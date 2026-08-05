import type { SERVICE_SLUGS } from "@/lib/validation";

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export interface Service {
	slug: ServiceSlug;
	/** Short label for tiles and dropdowns. */
	name: string;
	/** Page <h1>. */
	heading: string;
	/** One-sentence tile copy and meta description seed. */
	summary: string;
	/** Body copy, one paragraph per entry. */
	body: string[];
	/** Bullets rendered as an "included" list. */
	includes: string[];
	/** CTA label used on tiles and the page hero. */
	cta: string;
	/** Emoji placeholder replaced by SVG in Task 15. */
	icon: string;
}

export const SERVICES: Service[] = [
	{
		slug: "house-removals",
		name: "House Removals",
		heading: "House moves, handled end to end",
		summary:
			"We pack, load, transport, and unpack. Book a date and let us carry the rest.",
		body: [
			"Moving house is mostly logistics wearing the costume of an emotional event. We take the logistics off your hands so you can deal with the rest of it.",
			"Your move gets a named lead who is with you from the first packed box to the final walkthrough. One person, one number, no chasing updates through a switchboard.",
		],
		includes: [
			"Packing materials and professional packing",
			"Loading, transport, and unloading",
			"Unpacking and placement in your new home",
			"A walkthrough together before we leave",
		],
		cta: "Book This Move",
		icon: "🏠",
	},
	{
		slug: "office-relocation",
		name: "Office Relocation",
		heading: "Move the office without losing the week",
		summary:
			"Relocations scheduled around your working hours, so your team barely notices the switch.",
		body: [
			"The cost of an office move is rarely the move. It is the days your team spends unable to work. We schedule around that — evenings, weekends, or phased by department.",
			"Equipment, furniture, and sensitive documents are inventoried before they leave and checked off on arrival, so nothing goes missing between two addresses.",
		],
		includes: [
			"Out-of-hours and weekend scheduling",
			"Inventoried, checked-off transport",
			"IT equipment and sensitive document handling",
			"Phased moves by department or floor",
		],
		cta: "Plan My Relocation",
		icon: "🏢",
	},
	{
		slug: "cross-border-moves",
		name: "Cross-Border Moves",
		heading: "Relocating out of Zambia",
		summary:
			"Customs, permits, and border logistics handled — you don't lift a finger.",
		body: [
			"A cross-border move is a paperwork problem with a truck attached. We handle the paperwork.",
			"Customs documentation, permits, and border clearance are arranged before your belongings reach the crossing, so your things are not sitting at a border waiting on a form.",
		],
		includes: [
			"Customs documentation and permits",
			"Border clearance coordination",
			"Full packing and secure transport",
			"Delivery and placement at destination",
		],
		cta: "Get Cross-Border Quote",
		icon: "🌍",
	},
	{
		slug: "exports-imports",
		name: "Exports & Imports",
		heading: "Commercial freight and clearing",
		summary:
			"Moving goods, not households — customs clearing and freight for businesses.",
		body: [
			"This is the commercial side: consignments, clearing agents, and customs procedure for businesses moving stock rather than furniture.",
			"We handle documentation, duty calculation, and clearance so your goods move through the border on schedule instead of accruing storage fees.",
		],
		includes: [
			"Import and export documentation",
			"Customs clearing and duty handling",
			"Freight forwarding and consolidation",
			"Delivery to your warehouse or site",
		],
		cta: "Discuss Freight",
		icon: "🚢",
	},
	{
		slug: "packaging",
		name: "Professional Packaging",
		heading: "Packing that survives the road",
		summary:
			"Custom crating, wrapping, and materials for fragile and high-value items.",
		body: [
			"Most transit damage is packing damage that happened before the truck moved. Good packing is the cheapest insurance in logistics.",
			"We supply the materials and do the work — including custom crating for items that no standard box was designed to hold.",
		],
		includes: [
			"Professional packing materials supplied",
			"Custom crating for fragile and odd-shaped items",
			"Labelling and inventory",
			"Available standalone or as part of a move",
		],
		cta: "Book Packing",
		icon: "📦",
	},
	{
		slug: "general-supplies",
		name: "General Supplies",
		heading: "Sourced, collected, delivered",
		summary:
			"One-off jobs and ongoing supply — no long-term commitment required.",
		body: [
			"Sometimes the job is not a move. Something needs sourcing, collecting, or delivering, and it needs to happen this week.",
			"We take one-off jobs as readily as recurring supply contracts, with no minimum and no long-term commitment.",
		],
		includes: [
			"Sourcing goods and materials",
			"Collection and delivery",
			"One-off or recurring schedules",
			"No minimum commitment",
		],
		cta: "Request a Job",
		icon: "🚚",
	},
];

export function getService(slug: string): Service | undefined {
	return SERVICES.find((s) => s.slug === slug);
}
