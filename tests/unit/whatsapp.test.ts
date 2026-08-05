import { describe, it, expect } from "vitest";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

describe("buildWhatsAppUrl", () => {
	it("returns a bare wa.me link with a default message when given no context", () => {
		const url = buildWhatsAppUrl({});
		expect(url).toBe(
			"https://wa.me/260962936172?text=Hi%20Bastuku%2C%20I%27d%20like%20a%20quote."
		);
	});

	it("includes the service when provided", () => {
		const url = buildWhatsAppUrl({ service: "House Removals" });
		expect(decodeURIComponent(url)).toContain("Service: House Removals");
	});

	it("includes origin and destination when both provided", () => {
		const url = buildWhatsAppUrl({ origin: "Kabulonga", destination: "Roma" });
		const decoded = decodeURIComponent(url);
		expect(decoded).toContain("From: Kabulonga");
		expect(decoded).toContain("To: Roma");
	});

	it("omits empty fields rather than emitting blank labels", () => {
		const decoded = decodeURIComponent(buildWhatsAppUrl({ origin: "", service: "Packaging" }));
		expect(decoded).not.toContain("From:");
		expect(decoded).toContain("Service: Packaging");
	});

	it("percent-encodes newlines and special characters", () => {
		const url = buildWhatsAppUrl({ message: "50% fragile & heavy" });
		expect(url).not.toContain(" ");
		expect(url).toContain("%25");
		expect(decodeURIComponent(url)).toContain("50% fragile & heavy");
	});
});
