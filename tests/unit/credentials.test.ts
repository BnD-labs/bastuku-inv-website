import { describe, expect, it } from "vitest";
import { CREDENTIALS, currentCredentials } from "../../content/credentials";

describe("credentials", () => {
	// Fails on the first CI run after a certificate lapses. The page already
	// hides it by then; this is the prompt to renew it and update the line.
	it("has no certificate past its expiry date", () => {
		const today = new Date().toISOString().slice(0, 10);
		const lapsed = CREDENTIALS.filter((c) => c.validUntil && c.validUntil < today);
		expect(lapsed.map((c) => `${c.body} lapsed ${c.validUntil}`)).toEqual([]);
	});

	it("keeps a credential through its last valid day and drops it the day after", () => {
		const zra = (on: string) => currentCredentials(new Date(`${on}T12:00:00Z`)).some((c) => c.body === "ZRA");
		expect(zra("2026-12-31")).toBe(true);
		expect(zra("2027-01-01")).toBe(false);
	});

	it("never drops a credential that does not expire", () => {
		const later = currentCredentials(new Date("2040-01-01T00:00:00Z")).map((c) => c.body);
		expect(later).toEqual(CREDENTIALS.filter((c) => !c.validUntil).map((c) => c.body));
	});
});
