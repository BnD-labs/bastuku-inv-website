import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/turnstile", () => ({ verifyTurnstile: vi.fn() }));
vi.mock("@/lib/leads", () => ({ insertLead: vi.fn() }));
vi.mock("@/lib/email", () => ({ sendLeadEmails: vi.fn() }));
vi.mock("@opennextjs/cloudflare", () => ({
	getCloudflareContext: () => ({
		env: {
			DB: {},
			TURNSTILE_SECRET_KEY: "s",
			RESEND_API_KEY: "r",
			LEAD_NOTIFY_EMAIL: "info@bastuku-inv.com",
		},
	}),
}));

import { POST } from "@/app/api/quote/route";
import { verifyTurnstile } from "@/lib/turnstile";
import { insertLead } from "@/lib/leads";
import { sendLeadEmails } from "@/lib/email";

const body = {
	name: "John Banda",
	phone: "+260962936172",
	serviceSlug: "house-removals",
	turnstileToken: "tok",
};

const req = (b: unknown) =>
	new Request("https://bastuku-inv.com/api/quote", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(b),
	});

beforeEach(() => {
	vi.mocked(verifyTurnstile).mockResolvedValue(true);
	vi.mocked(insertLead).mockResolvedValue("lead-123");
	vi.mocked(sendLeadEmails).mockResolvedValue({ notified: true, confirmed: true });
});

describe("POST /api/quote", () => {
	it("stores the lead and returns its id on the happy path", async () => {
		const res = await POST(req(body));
		expect(res.status).toBe(200);
		await expect(res.json()).resolves.toMatchObject({ ok: true, leadId: "lead-123" });
	});

	it("stores a submission with the retired exports-imports slug under the new slug", async () => {
		// A quote form loaded from a page cached before the rename still sends the old value.
		const res = await POST(req({ ...body, serviceSlug: "exports-imports" }));
		expect(res.status).toBe(200);
		expect(insertLead).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ serviceSlug: "clearing-forwarding-freight" })
		);
	});

	it("rejects a failed Turnstile check with 403 and never touches the database", async () => {
		vi.mocked(verifyTurnstile).mockResolvedValue(false);
		const res = await POST(req(body));
		expect(res.status).toBe(403);
		expect(insertLead).not.toHaveBeenCalled();
	});

	it("returns 400 with field errors for invalid input", async () => {
		const res = await POST(req({ ...body, phone: "12345" }));
		expect(res.status).toBe(400);
		const json = (await res.json()) as { fieldErrors: Record<string, string[]> };
		expect(json.fieldErrors.phone).toBeTruthy();
	});

	it("still succeeds when the database write fails but email is sent", async () => {
		vi.mocked(insertLead).mockRejectedValue(new Error("D1 down"));
		const res = await POST(req(body));
		expect(res.status).toBe(200);
		expect(sendLeadEmails).toHaveBeenCalled();
	});

	it("still succeeds when email fails but the lead was stored", async () => {
		vi.mocked(sendLeadEmails).mockResolvedValue({ notified: false, confirmed: false });
		const res = await POST(req(body));
		expect(res.status).toBe(200);
	});

	it("returns a prefilled WhatsApp URL when both storage and email fail", async () => {
		vi.mocked(insertLead).mockRejectedValue(new Error("D1 down"));
		vi.mocked(sendLeadEmails).mockResolvedValue({ notified: false, confirmed: false });
		const res = await POST(req(body));
		expect(res.status).toBe(503);
		const json = (await res.json()) as { whatsappUrl: string };
		expect(json.whatsappUrl).toContain("wa.me/260976831400");
		expect(decodeURIComponent(json.whatsappUrl)).toContain("John Banda");
	});

	it("returns 400 for a malformed JSON body", async () => {
		const res = await POST(
			new Request("https://bastuku-inv.com/api/quote", { method: "POST", body: "not json" })
		);
		expect(res.status).toBe(400);
	});
});
