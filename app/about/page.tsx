import type { Metadata } from "next";
import { SITE } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
	title: "About",
	description: `Logistics and supply solutions in ${SITE.city}, ${SITE.country}, since ${SITE.foundedYear}.`,
	alternates: { canonical: "/about" },
};

const VALUES: { title: string; body: string }[] = [
	{
		title: "One point of contact",
		body: "Every job gets a named lead who stays with it from first box to final walkthrough. No switchboard, no chasing updates.",
	},
	{
		title: "Say the real number",
		body: "An indicative range up front and a firm quote once we understand the job. No figure that quietly grows on moving day.",
	},
	{
		title: "Finish properly",
		body: "We place things where you want them and walk through it with you before we leave, while anything unresolved can still be dealt with.",
	},
];

export default function AboutPage() {
	return (
		<main>
			<Section>
				<p className="font-mono text-xs uppercase tracking-wider text-brick">About</p>
				<h1 className="mt-3 max-w-[16ch] font-display text-[clamp(34px,4.5vw,52px)] font-black uppercase leading-none text-ink">
					Moving Zambia since {SITE.foundedYear}
				</h1>
				<p className="mt-5 max-w-[52ch] font-body text-lg leading-relaxed text-ink-soft">
					{SITE.legalName} is a {SITE.city}-based logistics and supply company. We started
					with household moves and grew into office relocation, cross-border transport, and
					commercial freight — because customers kept asking.
				</p>
				<p className="mt-4 max-w-[52ch] font-body text-lg leading-relaxed text-ink-soft">
					The work is mostly unglamorous: packing carefully, arriving when we said we would,
					and being reachable when something changes. That is the whole business.
				</p>
			</Section>

			<Section tone="ink">
				<h2 className="font-display text-[clamp(28px,3.5vw,40px)] font-black uppercase leading-none">
					How we work
				</h2>
				<div className="mt-10 grid gap-8 sm:grid-cols-3">
					{VALUES.map((v) => (
						<article key={v.title}>
							<h3 className="font-body text-lg font-bold text-paper">{v.title}</h3>
							<p className="mt-3 font-body text-base leading-relaxed text-paper/70">{v.body}</p>
						</article>
					))}
				</div>
			</Section>

			<Section>
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-display text-[clamp(28px,3.5vw,40px)] font-black uppercase leading-none text-ink">
						Work with us
					</h2>
					<ButtonLink href="/quote" className="mt-8">
						Get My Quote →
					</ButtonLink>
				</div>
			</Section>
		</main>
	);
}
