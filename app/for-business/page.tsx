import type { Metadata } from "next";
import { SITE } from "@/content/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
	title: "For Business",
	description:
		"Office relocation, recurring supply runs, and commercial freight for businesses in Lusaka and across Zambia.",
	alternates: { canonical: "/for-business" },
};

const OFFERS: { title: string; body: string }[] = [
	{
		title: "Office relocation",
		body: "Scheduled around your working hours — evenings, weekends, or phased department by department — so the move costs you furniture time, not billable time.",
	},
	{
		title: "Recurring logistics",
		body: "Standing collection and delivery runs on a schedule that suits your operation, with the same team each time rather than whoever is free.",
	},
	{
		title: "Exports and imports",
		body: "Documentation, duty handling, and customs clearing for commercial consignments, so goods move through the border instead of accruing storage fees.",
	},
	{
		title: "Sourcing and supply",
		body: "One-off procurement or an ongoing supply arrangement, with no minimum and no long-term commitment.",
	},
];

export default function ForBusinessPage() {
	return (
		<main>
			<Section>
				<p className="font-mono text-xs uppercase tracking-wider text-lime-deep">For business</p>
				<h1 className="mt-3 max-w-[16ch] font-display text-[clamp(34px,4.5vw,52px)] font-black uppercase leading-none text-ink">
					Logistics that fit your operation
				</h1>
				<p className="mt-5 max-w-[52ch] font-body text-lg leading-relaxed text-ink-soft">
					The cost of a business move is rarely the move. It is the hours your team spends
					unable to work. We plan around that.
				</p>

				<div className="mt-12 grid gap-6 sm:grid-cols-2">
					{OFFERS.map((o) => (
						<article key={o.title} className="rounded-2xl bg-card-tint p-7">
							<h2 className="font-display text-2xl font-extrabold uppercase leading-none text-ink">
								{o.title}
							</h2>
							<p className="mt-3 font-body text-base leading-relaxed text-ink-soft">{o.body}</p>
						</article>
					))}
				</div>
			</Section>

			{/* Contact-led, not estimate-led: business jobs are scoped in a
			    conversation, and the estimate tool is built for household moves. */}
			<Section tone="ink">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-display text-[clamp(28px,3.5vw,40px)] font-black uppercase leading-none">
						Let&apos;s scope it properly
					</h2>
					<p className="mt-4 font-body text-lg text-paper/70">
						Business jobs get a conversation, not a calculator. Tell us what you run and
						we&apos;ll put together terms that fit.
					</p>
					<div className="mt-8 flex flex-wrap justify-center gap-4">
						<ButtonLink href="/contact">Talk to us</ButtonLink>
						<a
							href={buildWhatsAppUrl({ message: "I'd like to discuss business logistics." })}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center rounded-pill bg-card-tint px-6 py-3.5 font-body text-sm font-bold text-ink"
						>
							WhatsApp {SITE.phoneDisplay}
						</a>
					</div>
				</div>
			</Section>
		</main>
	);
}
