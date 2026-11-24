/**
 * Registrations and recent contracts, from the 2026 company profile and the
 * certificates and purchase orders annexed to it (CLAIMS #21, #22).
 *
 * Two of these expire every year. `validUntil` hides an expired one from the
 * page at build time, and tests/unit/credentials.test.ts fails once any date
 * has passed, so a lapsed certificate can't quietly stay on the site. When a
 * certificate is renewed, update its line and `validUntil` together.
 *
 * Certificate and taxpayer numbers are left off on purpose: they are for
 * tender documents, not a public page. The PACRA company number is a public
 * record, and it lets a buyer look the company up.
 */
export interface Credential {
	body: string;
	/** Expanded name, for anyone who doesn't know the acronym. */
	bodyName: string;
	detail: string;
	/** ISO date the registration lapses, if it is renewed periodically. */
	validUntil?: string;
}

export const CREDENTIALS: Credential[] = [
	{
		body: "PACRA",
		bodyName: "Patents and Companies Registration Agency",
		detail: "Incorporated 19 May 2017. Company no. 120170003932.",
	},
	{
		body: "ZRA",
		bodyName: "Zambia Revenue Authority",
		detail: "Tax clearance certificate, valid to 31 December 2026.",
		validUntil: "2026-12-31",
	},
	{
		body: "ZPPA",
		bodyName: "Zambia Public Procurement Authority",
		detail: "Registered public procurement supplier since January 2019, citizen-owned.",
	},
	{
		body: "ZCILT",
		bodyName: "Zambia Chartered Institute of Logistics and Transport",
		detail: "Corporate member for 2026.",
		validUntil: "2026-12-31",
	},
];

/** Credentials still current on `on` (a validUntil date is good through that whole day). */
export function currentCredentials(on: Date = new Date()): Credential[] {
	const today = on.toISOString().slice(0, 10);
	return CREDENTIALS.filter((c) => !c.validUntil || c.validUntil >= today);
}

/** Contracts with purchase orders on file, newest first. */
export const RECENT_WORK: { client: string; scope: string; date: string }[] = [
	{
		client: "ZICTA",
		scope: "Household goods transport for a staff relocation.",
		date: "November 2026",
	},
	{
		client: "ZCCM Investments Holdings",
		scope: "Office relocation from Lusaka to Kalulushi: packing materials, loading, and inter-city transport.",
		date: "February 2026",
	},
];

/** Organisations from the profile's client list. Private individuals are left out. */
export const CLIENTS = [
	"ZICTA",
	"ZCCM-IH",
	"SES Zambia",
	"Ross Breeders",
	"Scimitar Farms",
	"Hybrid Poultry",
	"Teta Metals",
	"Mpundu Wild Honey",
	"RDG Collective",
	"Bough Diamond Consultancy",
	"PJ Ventures",
	"New Ching Fung",
	"Yeuhai International",
];
