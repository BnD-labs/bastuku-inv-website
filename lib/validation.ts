import { z } from "zod";

export const SERVICE_SLUGS = [
	"house-removals",
	"office-relocation",
	"cross-border-moves",
	"exports-imports",
	"packaging",
	"general-supplies",
] as const;

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
	serviceSlug: z.enum(SERVICE_SLUGS),
	origin: z.string().trim().max(200).optional(),
	destination: z.string().trim().max(200).optional(),
	moveDate: z.string().trim().max(40).optional(),
	message: z.string().trim().max(2000, "Please keep it under 2000 characters").optional(),
	estimateLow: z.number().int().nonnegative().optional(),
	estimateHigh: z.number().int().nonnegative().optional(),
	sourcePage: z.string().trim().max(120).optional(),
});

export type QuoteInput = z.infer<typeof quoteSchema>;
