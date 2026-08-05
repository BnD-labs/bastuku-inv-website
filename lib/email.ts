import { Resend } from "resend";
import { SITE } from "@/content/site";
import { getService } from "@/content/services";
import type { QuoteInput } from "@/lib/validation";
import { formatKwacha } from "@/lib/format";

export interface EmailResult {
	notified: boolean;
	confirmed: boolean;
}

function leadSummary(input: QuoteInput, leadId: string): string {
	const service = getService(input.serviceSlug)?.name ?? input.serviceSlug;
	const rows: [string, string | undefined][] = [
		["Name", input.name],
		["Phone", input.phone],
		["Email", input.email || undefined],
		["Service", service],
		["From", input.origin],
		["To", input.destination],
		["Preferred date", input.moveDate],
		["Details", input.message],
		[
			"Estimate shown",
			input.estimateLow && input.estimateHigh
				? `${formatKwacha(input.estimateLow)} – ${formatKwacha(input.estimateHigh)}`
				: undefined,
		],
		["Page", input.sourcePage],
		["Lead ID", leadId],
	];

	return rows
		.filter(([, v]) => v)
		.map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`)
		.join("\n");
}

export async function sendLeadEmails(
	apiKey: string,
	notifyTo: string,
	input: QuoteInput,
	leadId: string
): Promise<EmailResult> {
	const resend = new Resend(apiKey);
	const service = getService(input.serviceSlug)?.name ?? input.serviceSlug;
	const result: EmailResult = { notified: false, confirmed: false };

	try {
		await resend.emails.send({
			from: `${SITE.name} <noreply@bastuku-inv.com>`,
			to: notifyTo,
			replyTo: input.email || undefined,
			subject: `New quote request — ${service} — ${input.name}`,
			html: `<h2>New quote request</h2>${leadSummary(input, leadId)}`,
		});
		result.notified = true;
	} catch {
		// Swallowed deliberately: the lead is already in D1. See route handler.
	}

	if (input.email) {
		try {
			await resend.emails.send({
				from: `${SITE.name} <noreply@bastuku-inv.com>`,
				to: input.email,
				subject: `We've got your request — ${SITE.name}`,
				html: `
          <p>Hi ${input.name},</p>
          <p>Thanks for getting in touch about <strong>${service}</strong>.
             We've received your request and will come back to you shortly.</p>
          <p>If it's urgent, WhatsApp us on ${SITE.phoneDisplay}.</p>
          <p>— The ${SITE.name} team</p>
        `,
			});
			result.confirmed = true;
		} catch {
			// Confirmation is a nicety; never fail the request over it.
		}
	}

	return result;
}
