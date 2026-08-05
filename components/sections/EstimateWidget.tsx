"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { calculateEstimate, type Volume } from "@/lib/estimate";
import { formatKwacha } from "@/lib/format";
import { SERVICES } from "@/content/services";
import { RATES_ARE_PLACEHOLDER } from "@/content/rates";
import { Button } from "@/components/ui/Button";

export function EstimateWidget() {
	const router = useRouter();
	const [serviceSlug, setServiceSlug] = useState(SERVICES[0].slug);
	const [distanceKm, setDistanceKm] = useState(15);
	const [volume, setVolume] = useState<Volume>("medium");

	const range = calculateEstimate({ serviceSlug, distanceKm, volume });

	function goToQuote() {
		const params = new URLSearchParams({
			service: serviceSlug,
			low: String(range.low),
			high: String(range.high),
		});
		router.push(`/quote?${params}`);
	}

	return (
		<div className="max-w-xl rounded-2xl bg-paper/80 p-6 backdrop-blur-sm">
			<p className="font-mono text-xs font-bold uppercase tracking-wider text-ink-soft">
				Get an instant estimate
			</p>

			<div className="mt-4 flex flex-col gap-4">
				<div className="flex flex-col gap-1.5">
					<label htmlFor="est-service" className="font-body text-sm font-semibold">
						What are you moving?
					</label>
					<select
						id="est-service"
						value={serviceSlug}
						onChange={(e) => setServiceSlug(e.target.value as typeof serviceSlug)}
						className="rounded-pill border-[1.5px] border-ink/15 bg-white px-4 py-3 font-body text-sm"
					>
						{SERVICES.map((s) => (
							<option key={s.slug} value={s.slug}>
								{s.name}
							</option>
						))}
					</select>
				</div>

				<div className="flex flex-col gap-1.5">
					<label htmlFor="est-distance" className="font-body text-sm font-semibold">
						Distance: {distanceKm} km
					</label>
					<input
						id="est-distance"
						type="range"
						min={0}
						max={500}
						step={5}
						value={distanceKm}
						onChange={(e) => setDistanceKm(Number(e.target.value))}
						className="accent-amber"
					/>
				</div>

				<fieldset className="flex flex-col gap-1.5">
					<legend className="font-body text-sm font-semibold">How much?</legend>
					<div className="mt-1 flex gap-2">
						{(["small", "medium", "large"] as const).map((v) => (
							<button
								key={v}
								type="button"
								aria-pressed={volume === v}
								onClick={() => setVolume(v)}
								className={`rounded-pill px-4 py-2 font-body text-sm font-bold capitalize ${
									volume === v ? "bg-ink text-amber-bright" : "bg-card-tint text-ink"
								}`}
							>
								{v}
							</button>
						))}
					</div>
				</fieldset>
			</div>

			<p aria-live="polite" className="mt-5 font-display text-4xl font-black text-ink">
				{formatKwacha(range.low)} – {formatKwacha(range.high)}
			</p>
			<p className="mt-1 font-body text-xs text-ink-soft/70">
				Indicative range. Your final quote is confirmed by our team.
				{RATES_ARE_PLACEHOLDER && " Pricing shown is provisional."}
			</p>

			<Button className="mt-4 w-full" onClick={goToQuote}>
				Continue to Quote
			</Button>
		</div>
	);
}
