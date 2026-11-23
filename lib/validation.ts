import { z } from "zod";

export const SERVICE_SLUGS = [
	"house-removals",
	"office-relocation",
	"cross-border-moves",
	"international-moves",
	"clearing-forwarding-freight",
	"packaging",
	"general-supplies",
] as const;

/**
 * Slugs retired by a rename, mapped to their replacement. Old links live on in
 * Facebook posts, the Google Business Profile, and WhatsApp chats, and a form
 * loaded from a cached page can still submit the old value. Existing D1 rows
 * keep the slug they were stored with; they are not migrated.
 */
export const LEGACY_SLUGS: Readonly<Record<string, (typeof SERVICE_SLUGS)[number]>> = {
	"exports-imports": "clearing-forwarding-freight",
};

/** Maps a retired slug to its replacement; anything else passes through unchanged. */
export function normaliseServiceSlug<T>(value: T): T | (typeof SERVICE_SLUGS)[number] {
	return typeof value === "string" && Object.hasOwn(LEGACY_SLUGS, value)
		? LEGACY_SLUGS[value]
		: value;
}

// Zambian mobile: +260 or 0 prefix, then 9 digits starting 7 or 9.
const ZM_MOBILE = /^(?:\+260|0)(?:7|9)\d{8}$/;

export const quoteSchema = z.object({
	name: z.string().trim().min(2, "Please enter your full name").max(120),
	phone: z
		.string()
		.transform((v) => v.replace(/[\s()-]/g, ""))
		.refine((v) => ZM_MOBILE.test(v), "Enter a valid Zambian mobile number")
		.transform((v) => (v.startsWith("0") ? `+260${v.slice(1)}` : v)),
	email: z.union([z.literal(""), z.email("Enter a valid email address")]).optional(),
	serviceSlug: z.preprocess(normaliseServiceSlug, z.enum(SERVICE_SLUGS)),
	origin: z.string().trim().max(200).optional(),
	destination: z.string().trim().max(200).optional(),
	moveDate: z.string().trim().max(40).optional(),
	message: z.string().trim().max(2000, "Please keep it under 2000 characters").optional(),
	estimateLow: z.number().int().nonnegative().optional(),
	estimateHigh: z.number().int().nonnegative().optional(),
	sourcePage: z.string().trim().max(120).optional(),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
