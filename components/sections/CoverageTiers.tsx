"use client";

import { useState } from "react";
import { COVERAGE_TIERS } from "@/content/coverage";

export function CoverageTiers() {
	const [activeId, setActiveId] = useState(COVERAGE_TIERS[0].id);
	const active = COVERAGE_TIERS.find((t) => t.id === activeId)!;

	return (
		<div>
			<div role="tablist" aria-label="Coverage areas" className="flex flex-wrap gap-3">
				{COVERAGE_TIERS.map((t) => (
					<button
						key={t.id}
						role="tab"
						id={`coverage-tab-${t.id}`}
						aria-selected={t.id === activeId}
						aria-controls="coverage-detail"
						onClick={() => setActiveId(t.id)}
						className={`rounded-pill px-6 py-3.5 font-body text-sm font-bold uppercase transition-colors ${
							t.id === activeId
								? "bg-ink text-lime"
								: "bg-card-tint text-ink hover:bg-card-tint/70"
						}`}
					>
						{t.label}
					</button>
				))}
			</div>

			<div
				id="coverage-detail"
				role="tabpanel"
				// A tabpanel must be named by the tab that controls it, or screen
				// readers announce an anonymous region.
				aria-labelledby={`coverage-tab-${activeId}`}
				aria-live="polite"
				className="mt-6"
			>
				<h3 className="font-display text-2xl font-extrabold uppercase">{active.headline}</h3>
				<p className="mt-2 font-body text-base text-ink-soft">{active.detail}</p>
				<ul className="mt-4 flex flex-wrap gap-2">
					{active.areas.map((a) => (
						<li key={a} className="rounded-pill bg-card-tint px-4 py-2 font-body text-sm">
							{a}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
