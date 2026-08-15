import Link from "next/link";
import type { Metadata } from "next";
import { SERVICES } from "@/content/services";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
	title: "Services",
	description:
		"House removals, office relocation, cross-border and international moves, exports and imports, professional packaging, and general supplies across Zambia.",
	alternates: { canonical: "/services" },
};

export default function ServicesHubPage() {
	return (
		<main>
			<Section>
				<p className="font-mono text-xs uppercase tracking-wider text-lime-deep">Services</p>
				<h1 className="mt-3 max-w-[16ch] font-display text-[clamp(34px,4.5vw,52px)] font-black uppercase leading-none text-ink">
					Everything we move
				</h1>
				<p className="mt-5 max-w-[52ch] font-body text-lg leading-relaxed text-ink-soft">
					{SERVICES.length} services, one team. Pick the one that fits — or tell us what you
					need and we&apos;ll work it out with you.
				</p>

				{/* A static, crawlable grid — no coverflow. A hub page has to be scannable. */}
				<ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{SERVICES.map((s) => (
						<li key={s.slug}>
							<Link
								href={`/services/${s.slug}`}
								className="flex h-full flex-col rounded-2xl bg-card-tint p-7 transition-colors hover:bg-card-tint/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-deep"
							>
								<span aria-hidden="true" className="text-3xl">
									{s.icon}
								</span>
								<h2 className="mt-4 font-display text-2xl font-extrabold uppercase leading-none text-ink">
									{s.name}
								</h2>
								<p className="mt-3 flex-1 font-body text-sm leading-relaxed text-ink-soft">
									{s.summary}
								</p>
								<span className="mt-5 font-body text-sm font-bold text-lime-deep">{s.cta} →</span>
							</Link>
						</li>
					))}
				</ul>
			</Section>

			<Section tone="ink">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-display text-[clamp(28px,3.5vw,40px)] font-black uppercase leading-none">
						Not sure which you need?
					</h2>
					<p className="mt-4 font-body text-lg text-paper/70">
						Tell us what you&apos;re moving and we&apos;ll point you at the right one.
					</p>
					<ButtonLink href="/quote" className="mt-8">
						Get My Quote →
					</ButtonLink>
				</div>
			</Section>
		</main>
	);
}
