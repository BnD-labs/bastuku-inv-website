import { COVERAGE_TIERS } from "@/content/coverage";
import { pageMetadata } from "@/lib/metadata";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = pageMetadata({
	title: "Coverage",
	description:
		"Where we operate: Lusaka and surrounds, Zambia's major cities, and cross-border to neighbouring countries.",
	path: "/coverage",
});

export default function CoveragePage() {
	return (
		<main>
			<Section>
				<p className="font-mono text-xs uppercase tracking-wider text-lime-deep">Coverage</p>
				<h1 className="mt-3 max-w-[16ch] font-display text-[clamp(34px,4.5vw,52px)] font-black uppercase leading-none text-ink">
					Where we go
				</h1>
				<p className="mt-5 max-w-[52ch] font-body text-lg leading-relaxed text-ink-soft">
					From a cross-town move in Lusaka to a border crossing. If your destination
					isn&apos;t listed, ask — it is usually still possible.
				</p>

				{/* All three tiers expanded: on a dedicated coverage page every area
				    should be visible to a reader and to a crawler at once. */}
				<div className="mt-12 flex flex-col gap-10">
					{COVERAGE_TIERS.map((tier) => (
						<article key={tier.id} className="border-t border-ink/10 pt-8">
							<p className="font-mono text-xs uppercase tracking-wider text-lime-deep">{tier.label}</p>
							<h2 className="mt-2 font-display text-3xl font-extrabold uppercase leading-none text-ink">
								{tier.headline}
							</h2>
							<p className="mt-3 max-w-[58ch] font-body text-base leading-relaxed text-ink-soft">
								{tier.detail}
							</p>
							<ul className="mt-5 flex flex-wrap gap-2">
								{tier.areas.map((a) => (
									<li key={a} className="rounded-pill bg-card-tint px-4 py-2 font-body text-sm">
										{a}
									</li>
								))}
							</ul>
						</article>
					))}
				</div>
			</Section>

			<Section tone="ink">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-display text-[clamp(28px,3.5vw,40px)] font-black uppercase leading-none">
						Moving somewhere on this list?
					</h2>
					<ButtonLink href="/quote" className="mt-8">
						Get My Quote →
					</ButtonLink>
				</div>
			</Section>
		</main>
	);
}
