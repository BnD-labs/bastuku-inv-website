/**
 * PLACEHOLDER RATE CARD — NUMBERS ARE INVENTED.
 * Awaiting Bastuku's real rate card. See CLAIMS.md.
 * Swapping this file requires no code changes.
 */
export interface RateConfig {
	/** Callout fee in ZMW before distance and volume. */
	baseFee: Record<string, number>;
	/** ZMW per kilometre. */
	perKm: number;
	/** Multiplier applied to (base + distance). */
	volumeMultiplier: Record<"small" | "medium" | "large", number>;
	/** Fraction applied either side of the midpoint to produce the range. */
	spread: number;
}

export const RATES: RateConfig = {
	baseFee: {
		"house-removals": 1500,
		"office-relocation": 2500,
		"cross-border-moves": 6000,
		"international-moves": 12000,
		"clearing-forwarding-freight": 5000,
		packaging: 800,
		warehousing: 1000,
		"general-supplies": 500,
	},
	perKm: 25,
	volumeMultiplier: { small: 1, medium: 1.6, large: 2.4 },
	spread: 0.2,
};

export const RATES_ARE_PLACEHOLDER = true;
