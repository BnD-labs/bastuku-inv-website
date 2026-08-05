import { RATES, type RateConfig } from "@/content/rates";

export type Volume = "small" | "medium" | "large";

export interface EstimateInput {
	serviceSlug: string;
	distanceKm: number;
	volume: Volume;
}

export interface EstimateRange {
	low: number;
	high: number;
	currency: "ZMW";
}

export function calculateEstimate(
	input: EstimateInput,
	rates: RateConfig = RATES
): EstimateRange {
	const base = rates.baseFee[input.serviceSlug];
	if (base === undefined) {
		throw new Error(`Unknown service: ${input.serviceSlug}`);
	}
	if (!Number.isFinite(input.distanceKm) || input.distanceKm < 0) {
		throw new Error(`Invalid distance: ${input.distanceKm}`);
	}

	const midpoint = (base + input.distanceKm * rates.perKm) * rates.volumeMultiplier[input.volume];

	return {
		low: Math.round(midpoint * (1 - rates.spread)),
		high: Math.round(midpoint * (1 + rates.spread)),
		currency: "ZMW",
	};
}
