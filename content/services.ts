import type { SERVICE_SLUGS } from "@/lib/validation";

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

/** Keys into the line-icon set in components/ui/ServiceIcon.tsx. */
export type ServiceIconName = "house" | "office" | "border" | "globe" | "container" | "box" | "truck";

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
	icon: ServiceIconName;
	/**
	 * Optional photograph. Omit rather than invent one — a service with no
	 * honest image renders text-only instead of showing something unrelated.
	 * Sources live in `images/`; run `npm run images` to emit optimised copies.
	 */
	image?: { src: string; alt: string; width: number; height: number };
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
		icon: "house",
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
		icon: "office",
	},
	{
		slug: "cross-border-moves",
		name: "Cross-Border Moves",
		heading: "Relocating out of Zambia",
		summary:
			"Your household across the border — permits, paperwork, and the route planned end to end. You don't lift a finger.",
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
		icon: "border",
		image: {
			src: "/images/container-lift.webp",
			alt: "A mobile crane lifting a shipping container onto hardstanding, with two crew members guiding it into position.",
			width: 960,
			height: 1280,
		},
	},
	{
		slug: "international-moves",
		name: "International Moves",
		heading: "Moving overseas, not just over the border",
		summary:
			"Sea and air freight for relocations beyond the region — packed here, delivered there.",
		body: [
			"A move to another continent is a different job from a drive to Harare. It runs on shipping schedules and container space, and it is measured in weeks rather than days.",
			"We pack and crate to survive a sea voyage, handle the export documentation, and coordinate with agents at the destination so your consignment is met on arrival rather than sitting in a port.",
		],
		includes: [
			"Sea and air freight options",
			"Export-grade crating and packing",
			"Export documentation and clearance",
			"Destination agent coordination",
		],
		cta: "Plan My International Move",
		icon: "globe",
	},
	{
		slug: "clearing-forwarding-freight",
		name: "Clearing, Forwarding & Freight",
		heading: "Clearing, forwarding and freight for business",
		summary:
			// The longer draft ("…imports, exports, and goods in transit. We handle the
			// paperwork and the border so your shipment keeps moving.") left 4px spare in
			// the fixed-height homepage tile at 375px, so any text scaling overflowed it.
			"Customs clearing, documentation, and freight forwarding for commercial cargo — in, out, or in transit.",
		body: [
			"This is the commercial side: consignments, customs clearing, and freight forwarding for businesses moving stock, samples, and equipment rather than furniture.",
			"We handle documentation, duty calculation, and clearance, and arrange air cargo out of Kenneth Kaunda International Airport, so your goods move on schedule instead of accruing storage fees.",
		],
		includes: [
			"Import and export documentation",
			"Customs clearing and duty handling",
			"Freight forwarding and consolidation",
			"Delivery to your warehouse or site",
			"Air cargo export from Kenneth Kaunda International Airport",
		],
		cta: "Discuss Freight",
		icon: "container",
		image: {
			src: "/images/crated-consignment.webp",
			alt: "A consignment loaded inside a shipping container, braced behind a plywood bulkhead and secured with tensioned strapping.",
			width: 810,
			height: 1080,
		},
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
		icon: "box",
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
		icon: "truck",
	},
];

export function getService(slug: string): Service | undefined {
	return SERVICES.find((s) => s.slug === slug);
}
