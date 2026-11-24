"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SERVICES } from "@/content/services";
import { Button } from "@/components/ui/Button";

const SIZES = [
	{ id: "small", label: "Small" },
	{ id: "medium", label: "Medium" },
	{ id: "large", label: "Large" },
] as const;

type Size = (typeof SIZES)[number]["id"];

/**
 * Replaces the old price calculator. It scopes the job and hands the result to
 * the quote form rather than quoting a figure, because no verified rate card
 * exists — a number here would be an invented price anchor. See CLAIMS.md #10.
 */
export function MoveScoper() {
	const router = useRouter();
	const [serviceSlug, setServiceSlug] = useState<string>(SERVICES[0].slug);
	const [origin, setOrigin] = useState("");
	const [destination, setDestination] = useState("");
	const [size, setSize] = useState<Size>("medium");

	const service = SERVICES.find((s) => s.slug === serviceSlug) ?? SERVICES[0];

	function goToQuote() {
		const params = new URLSearchParams({ service: serviceSlug, size });
		if (origin.trim()) params.set("origin", origin.trim());
		if (destination.trim()) params.set("destination", destination.trim());
		router.push(`/quote?${params}`);
	}

	const fieldClass =
		"rounded-pill border-[1.5px] border-paper/25 bg-ink-soft/60 px-4 py-3 font-body text-sm " +
		"text-paper placeholder:text-paper/45 focus-visible:outline-2 focus-visible:outline-offset-2 " +
		"focus-visible:outline-lime";

	return (
		<div className="max-w-2xl rounded-2xl border border-paper/15 bg-ink/70 p-6 backdrop-blur-md">
			<p className="font-mono text-xs font-bold uppercase tracking-wider text-lime">
				Scope your move in 20 seconds
			</p>

			<div className="mt-4 flex flex-col gap-4">
				<div className="flex flex-col gap-1.5">
					<label htmlFor="scope-service" className="font-body text-sm font-semibold text-paper">
						What are you moving?
					</label>
					<select
						id="scope-service"
						value={serviceSlug}
						onChange={(e) => setServiceSlug(e.target.value)}
						className={fieldClass}
					>
						{SERVICES.map((s) => (
							<option key={s.slug} value={s.slug} className="text-ink">
								{s.name}
							</option>
						))}
					</select>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<div className="flex flex-col gap-1.5">
						<label htmlFor="scope-origin" className="font-body text-sm font-semibold text-paper">
							From
						</label>
						<input
							id="scope-origin"
							value={origin}
							onChange={(e) => setOrigin(e.target.value)}
							placeholder="Kabulonga"
							className={fieldClass}
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="scope-destination"
							className="font-body text-sm font-semibold text-paper"
						>
							To
						</label>
						<input
							id="scope-destination"
							value={destination}
							onChange={(e) => setDestination(e.target.value)}
							placeholder="Roma"
							className={fieldClass}
						/>
					</div>
				</div>

				<fieldset className="flex flex-col gap-1.5">
					<legend className="font-body text-sm font-semibold text-paper">How big is the job?</legend>
					<div className="mt-1 flex gap-2">
						{SIZES.map((s) => (
							<button
								key={s.id}
								type="button"
								aria-pressed={size === s.id}
								onClick={() => setSize(s.id)}
								className={`rounded-pill px-4 py-2 font-body text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime ${
									size === s.id
										? "bg-lime text-ink"
										: "bg-paper/10 text-paper hover:bg-paper/20"
								}`}
							>
								{s.label}
							</button>
						))}
					</div>
				</fieldset>
			</div>

			<Button className="mt-6 w-full" onClick={goToQuote}>
				Get my firm quote
			</Button>
			<p className="mt-2 text-center font-body text-xs text-paper/55">
				No obligation. We confirm the price with you before anything moves.
			</p>

			{/* After the button, not before it: on a laptop the list pushed the
			    button below the fold. It still updates as the service changes. */}
			<div className="mt-6 border-t border-paper/15 pt-5">
				<p className="font-mono text-xs uppercase tracking-wider text-paper/60">
					What this job includes
				</p>
				<ul aria-live="polite" className="mt-3 flex flex-col gap-2">
					{service.includes.map((item) => (
						<li key={item} className="flex gap-2.5 font-body text-sm text-paper/85">
							<span aria-hidden="true" className="text-lime">
								&#8250;
							</span>
							{item}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
