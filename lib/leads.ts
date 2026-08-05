import type { QuoteInput } from "@/lib/validation";

const INSERT_SQL = `
INSERT INTO leads (
  id, created_at, name, phone, email, service_slug,
  origin, destination, move_date, message,
  estimate_low, estimate_high, source_page, status
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`.trim();

export async function insertLead(db: D1Database, input: QuoteInput): Promise<string> {
	const id = crypto.randomUUID();

	await db
		.prepare(INSERT_SQL)
		.bind(
			id,
			new Date().toISOString(),
			input.name,
			input.phone,
			input.email || null,
			input.serviceSlug,
			input.origin || null,
			input.destination || null,
			input.moveDate || null,
			input.message || null,
			input.estimateLow ?? null,
			input.estimateHigh ?? null,
			input.sourcePage || null,
			"new"
		)
		.run();

	return id;
}
