import Link from "next/link";
import type { Metadata } from "next";
import { SERVICES } from "@/content/services";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
	title: "Services",
	description:
		"House removals, office relocation, cross-border and international moves, clearing and forwarding, professional packaging, and general supplies across Zambia.",
	alternates: { canonical: "/services" },
};

export default function ServicesHubPage() {
	return (
		<main>
			{/* reveal={false}: the cards below cascade individually, and a block
			    reveal on top of that reads as a double fade. */}
			<Section reveal={false}>
				<p className="font-mono text-xs uppercase tracking-wider text-lime-deep">Services</p>
				<h1 className="mt-3 max-w-[16ch] font-display text-[clamp(34px,4.5vw,52px)] font-black uppercase leading-none text-ink">
					Everything we move
				</h1>
				{/* One template literal: JSX drops the space between an expression and
				    following text when the text wraps to another line. */}
				<p className="mt-5 max-w-[52ch] font-body text-lg leading-relaxed text-ink-soft">
					{`${SERVICES.length} services, one team. Pick the one that fits — or tell us what you need and we'll work it out with you.`}
				</p>

				{/* A static, crawlable grid — no coverflow. A hub page has to be scannable. */}
				<ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{SERVICES.map((s, i) => (
						// Cascade across the grid rather than revealing it as one slab.
						// Capped so the last card is never more than ~0.4s behind the first.
						<Reveal as="li" key={s.slug} delay={Math.min(i, 5) * 70}>
							<Link
								href={`/services/${s.slug}`}
								className="group flex h-full flex-col rounded-2xl bg-card-tint p-7 transition-[background-color,transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:bg-card-tint/70 hover:shadow-[0_22px_38px_-20px_rgba(7,34,72,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-deep"
							>
								<span
									aria-hidden="true"
									className="text-3xl transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110"
								>
									{s.icon}
								</span>
								<h2 className="mt-4 font-display text-2xl font-extrabold uppercase leading-none text-ink">
									{s.name}
								</h2>
								<p className="mt-3 flex-1 font-body text-sm leading-relaxed text-ink-soft">
									{s.summary}
								</p>
								<span className="mt-5 font-body text-sm font-bold text-lime-deep">
									{s.cta}
									<span
										aria-hidden="true"
										className="ml-1 inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5"
									>
										→
									</span>
								</span>
							</Link>
						</Reveal>
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
