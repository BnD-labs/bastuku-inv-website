export interface CoverageTier {
	id: "local" | "regional" | "cross-border";
	label: string;
	headline: string;
	/** Named places. UNVERIFIED — see CLAIMS.md #4, #5. */
	areas: string[];
	detail: string;
}

export const COVERAGE_TIERS: CoverageTier[] = [
	{
		id: "local",
		label: "Local",
		headline: "Lusaka and surrounds",
		areas: ["Lusaka Central", "Kabulonga", "Woodlands", "Chelston", "Roma", "Olympia"],
		detail:
			"Our home ground. Same-week scheduling is usually possible, and for most local moves we can quote from a phone call.",
	},
	{
		id: "regional",
		label: "Regional",
		headline: "Across Zambia",
		areas: ["Ndola", "Kitwe", "Livingstone", "Kabwe", "Chipata", "Solwezi"],
		detail:
			"Long-haul moves to Zambia's major cities. These need a few days' notice so we can route the vehicle efficiently — which keeps your cost down.",
	},
	{
		id: "cross-border",
		label: "Cross-Border",
		headline: "Beyond Zambia",
		areas: ["Zimbabwe", "South Africa", "Botswana"],
		detail:
			"Customs documentation, permits, and border clearance handled before your belongings reach the crossing.",
	},
];
