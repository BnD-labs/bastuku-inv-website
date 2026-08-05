import { describe, it, expect } from "vitest";
import { calculateEstimate } from "@/lib/estimate";
import { formatKwacha } from "@/lib/format";
import type { RateConfig } from "@/content/rates";

// Fixed fixture so tests never break when the real rate card lands.
const rates: RateConfig = {
	baseFee: { "house-removals": 1000, packaging: 500 },
	perKm: 10,
	volumeMultiplier: { small: 1, medium: 2, large: 3 },
	spread: 0.2,
};

describe("calculateEstimate", () => {
	it("computes (base + distance) * volume with a symmetric spread", () => {
		// (1000 + 10*50) * 1 = 1500 → ±20% → 1200 to 1800
		const r = calculateEstimate(
			{ serviceSlug: "house-removals", distanceKm: 50, volume: "small" },
			rates
		);
		expect(r).toEqual({ low: 1200, high: 1800, currency: "ZMW" });
	});

	it("applies the volume multiplier", () => {
		// (1000 + 10*50) * 3 = 4500 → 3600 to 5400
		const r = calculateEstimate(
			{ serviceSlug: "house-removals", distanceKm: 50, volume: "large" },
			rates
		);
		expect(r).toEqual({ low: 3600, high: 5400, currency: "ZMW" });
	});

	it("returns whole kwacha, never fractional", () => {
		const r = calculateEstimate(
			{ serviceSlug: "packaging", distanceKm: 7, volume: "medium" },
			rates
		);
		expect(Number.isInteger(r.low)).toBe(true);
		expect(Number.isInteger(r.high)).toBe(true);
	});

	it("throws on an unknown service rather than silently returning zero", () => {
		expect(() =>
			calculateEstimate({ serviceSlug: "unknown", distanceKm: 10, volume: "small" }, rates)
		).toThrow(/unknown service/i);
	});

	it("throws on negative distance", () => {
		expect(() =>
			calculateEstimate({ serviceSlug: "packaging", distanceKm: -5, volume: "small" }, rates)
		).toThrow(/distance/i);
	});

	it("handles zero distance as a same-area move", () => {
		const r = calculateEstimate(
			{ serviceSlug: "packaging", distanceKm: 0, volume: "small" },
			rates
		);
		expect(r).toEqual({ low: 400, high: 600, currency: "ZMW" });
	});
});

describe("formatKwacha", () => {
	it("formats with a K prefix and comma thousands", () => {
		expect(formatKwacha(1200)).toBe("K1,200");
		expect(formatKwacha(950)).toBe("K950");
		expect(formatKwacha(1234567)).toBe("K1,234,567");
	});
});
