import { describe, it, expect } from "vitest";
import { normaliseServiceSlug, quoteSchema } from "@/lib/validation";

const valid = {
	name: "John Banda",
	phone: "+260962936172",
	serviceSlug: "house-removals",
};

describe("quoteSchema", () => {
	it("accepts a minimal valid submission", () => {
		expect(quoteSchema.safeParse(valid).success).toBe(true);
	});

	it("rejects a name shorter than two characters", () => {
		const r = quoteSchema.safeParse({ ...valid, name: "J" });
		expect(r.success).toBe(false);
	});

	it("accepts Zambian numbers in local 0-prefixed form", () => {
		expect(quoteSchema.safeParse({ ...valid, phone: "0962936172" }).success).toBe(true);
	});

	it("accepts numbers with spaces and strips them", () => {
		const r = quoteSchema.safeParse({ ...valid, phone: "+260 96 293 6172" });
		expect(r.success).toBe(true);
		if (r.success) expect(r.data.phone).toBe("+260962936172");
	});

	it("rejects a phone number that is not a plausible Zambian mobile", () => {
		expect(quoteSchema.safeParse({ ...valid, phone: "12345" }).success).toBe(false);
	});

	it("rejects an unknown service slug", () => {
		expect(quoteSchema.safeParse({ ...valid, serviceSlug: "teleportation" }).success).toBe(false);
	});

	it("accepts the retired exports-imports slug and outputs its replacement", () => {
		const r = quoteSchema.safeParse({ ...valid, serviceSlug: "exports-imports" });
		expect(r.success).toBe(true);
		if (r.success) expect(r.data.serviceSlug).toBe("clearing-forwarding-freight");
	});

	it("treats email as optional but validates it when present", () => {
		expect(quoteSchema.safeParse({ ...valid, email: "" }).success).toBe(true);
		expect(quoteSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
		expect(quoteSchema.safeParse({ ...valid, email: "a@b.com" }).success).toBe(true);
	});

	it("rejects a message longer than 2000 characters", () => {
		const r = quoteSchema.safeParse({ ...valid, message: "x".repeat(2001) });
		expect(r.success).toBe(false);
	});
});

// QuoteForm prefills its service select through this, so an old shared link
// (?service=exports-imports) opens with the renamed service selected.
describe("normaliseServiceSlug", () => {
	it("maps a retired slug to its replacement", () => {
		expect(normaliseServiceSlug("exports-imports")).toBe("clearing-forwarding-freight");
	});

	it("passes current slugs, unknown values, and null through unchanged", () => {
		expect(normaliseServiceSlug("house-removals")).toBe("house-removals");
		expect(normaliseServiceSlug("teleportation")).toBe("teleportation");
		expect(normaliseServiceSlug(null)).toBeNull();
	});

	it("does not treat Object.prototype keys as legacy slugs", () => {
		expect(normaliseServiceSlug("toString")).toBe("toString");
	});
});
