import type { Metadata } from "next";
import { Timeline } from "@/components/sections/Timeline";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQS } from "@/content/faqs";

export const metadata: Metadata = {
	title: "How It Works",
	description:
		"Three steps: request an estimate, we pack and move, then we unpack and confirm with you before we leave.",
	alternates: { canonical: "/how-it-works" },
};

const faqSchema = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: FAQS.map((f) => ({
		"@type": "Question",
		name: f.question,
		acceptedAnswer: { "@type": "Answer", text: f.answer },
	})),
};

export default function HowItWorksPage() {
	return (
		<main>
			<JsonLd data={faqSchema} />
			<Section tone="ink">
				<p className="font-mono text-xs uppercase tracking-wider text-lime">The process</p>
				<h1 className="mt-3 max-w-[16ch] font-display text-[clamp(34px,4.5vw,52px)] font-black uppercase leading-none">
					How it works
				</h1>
				<p className="mt-5 max-w-[52ch] font-body text-lg leading-relaxed text-paper/70">
					Three steps, one point of contact, no chasing.
				</p>
				<div className="mt-12">
					<Timeline />
				</div>
			</Section>

			<Section>
				<h2 className="font-display text-[clamp(28px,3.5vw,40px)] font-black uppercase leading-none text-ink">
					Common questions
				</h2>
				<div className="mt-8 max-w-3xl">
					<FaqAccordion />
				</div>
			</Section>

			<Section tone="ink">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-display text-[clamp(28px,3.5vw,40px)] font-black uppercase leading-none">
						Ready when you are
					</h2>
					<ButtonLink href="/quote" className="mt-8">
						Get My Quote →
					</ButtonLink>
				</div>
			</Section>
		</main>
	);
}
