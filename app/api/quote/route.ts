import { getCloudflareContext } from "@opennextjs/cloudflare";
import { quoteSchema } from "@/lib/validation";
import { insertLead } from "@/lib/leads";
import { sendLeadEmails } from "@/lib/email";
import { verifyTurnstile } from "@/lib/turnstile";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { getService } from "@/content/services";

export async function POST(request: Request): Promise<Response> {
	const { env } = getCloudflareContext();

	let raw: unknown;
	try {
		raw = await request.json();
	} catch {
		return Response.json({ ok: false, error: "Malformed request" }, { status: 400 });
	}

	const { turnstileToken, ...fields } = (raw ?? {}) as Record<string, unknown>;

	const ok = await verifyTurnstile(
		typeof turnstileToken === "string" ? turnstileToken : "",
		env.TURNSTILE_SECRET_KEY,
		request.headers.get("CF-Connecting-IP") ?? undefined
	);
	if (!ok) {
		return Response.json(
			{ ok: false, error: "Verification failed. Please try again." },
			{ status: 403 }
		);
	}

	const parsed = quoteSchema.safeParse(fields);
	if (!parsed.success) {
		return Response.json(
			{ ok: false, error: "Please check the form", fieldErrors: parsed.error.flatten().fieldErrors },
			{ status: 400 }
		);
	}
	const input = parsed.data;

	// Store and notify independently — neither failure may discard the lead.
	let leadId: string | null = null;
	try {
		leadId = await insertLead(env.DB, input);
	} catch (err) {
		console.error("D1 insert failed", err);
	}

	const emails = await sendLeadEmails(
		env.RESEND_API_KEY,
		env.LEAD_NOTIFY_EMAIL,
		input,
		leadId ?? "unstored"
	);

	// Both paths dead: hand the user their own data back as a WhatsApp message.
	if (!leadId && !emails.notified) {
		console.error("Lead capture fully failed", { name: input.name, phone: input.phone });
		return Response.json(
			{
				ok: false,
				error: "We couldn't submit that. Message us on WhatsApp and we'll pick it up right away.",
				whatsappUrl: buildWhatsAppUrl({
					name: input.name,
					service: getService(input.serviceSlug)?.name,
					origin: input.origin,
					destination: input.destination,
					message: input.message,
				}),
			},
			{ status: 503 }
		);
	}

	return Response.json({ ok: true, leadId });
}
