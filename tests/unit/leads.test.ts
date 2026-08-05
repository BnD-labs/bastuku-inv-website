import { describe, it, expect } from "vitest";
import { insertLead } from "@/lib/leads";
import type { QuoteInput } from "@/lib/validation";

function fakeDb() {
	const calls: { sql: string; values: unknown[] }[] = [];
	const db = {
		prepare(sql: string) {
			return {
				bind(...values: unknown[]) {
					calls.push({ sql, values });
					return { run: async () => ({ success: true }) };
				},
			};
		},
	};
	return { db: db as never, calls };
}

const input: QuoteInput = {
	name: "John Banda",
	phone: "+260962936172",
	serviceSlug: "house-removals",
};

describe("insertLead", () => {
	it("returns a generated id", async () => {
		const { db } = fakeDb();
		const id = await insertLead(db, input);
		expect(id).toMatch(/^[0-9a-f-]{36}$/);
	});

	it("inserts into the leads table with a parameterised statement", async () => {
		const { db, calls } = fakeDb();
		await insertLead(db, input);
		expect(calls).toHaveLength(1);
		expect(calls[0].sql).toContain("INSERT INTO leads");
		expect(calls[0].sql).not.toContain("John Banda"); // never interpolated
	});

	it("stores an ISO timestamp", async () => {
		const { db, calls } = fakeDb();
		await insertLead(db, input);
		const createdAt = calls[0].values[1] as string;
		expect(() => new Date(createdAt).toISOString()).not.toThrow();
	});

	it("writes null, not undefined, for absent optional fields", async () => {
		const { db, calls } = fakeDb();
		await insertLead(db, input);
		expect(calls[0].values).not.toContain(undefined);
	});

	it("persists the estimate range when supplied", async () => {
		const { db, calls } = fakeDb();
		await insertLead(db, { ...input, estimateLow: 1200, estimateHigh: 1800 });
		expect(calls[0].values).toContain(1200);
		expect(calls[0].values).toContain(1800);
	});
});
