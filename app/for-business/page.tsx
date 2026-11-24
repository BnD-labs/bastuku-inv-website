import { SITE } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { CLIENTS, RECENT_WORK, currentCredentials } from "@/content/credentials";

export const metadata = pageMetadata({
	title: "For Business",
	description:
		"Office relocation, recurring supply runs, and clearing and forwarding for commercial cargo, for businesses in Lusaka and across Zambia.",
	path: "/for-business",
});

const OFFERS: { title: string; body: string }[] = [
	{
		title: "Office relocation",
		body: "Scheduled around your working hours — evenings, weekends, or phased department by department — so the move costs you furniture time, not billable time.",
	},
	{
		title: "Recurring logistics",
		body: "Standing collection and delivery runs on a schedule that suits your operation, with one point of contact who knows your operation.",
	},
	{
		title: "Clearing, forwarding and freight",
		body: "Customs clearing, documentation, and freight forwarding for commercial cargo, including air cargo out of Kenneth Kaunda International Airport, so goods move instead of accruing storage fees.",
	},
	{
		title: "Sourcing and supply",
		body: "Food, safety wear, cleaning materials, office consumables, and livestock for farms, as a one-off order or an ongoing supply arrangement, with no minimum and no long-term commitment.",
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

			{/* Procurement teams check registration before they check anything else,
			    and the profile's annexes prove all of it (CLAIMS #21, #22). The
			    lists carry role="list" because Safari drops list semantics once
			    list-style is none. */}
			<Section className="border-t border-ink/10" aria-labelledby="record-heading">
				<h2
					id="record-heading"
					className="font-display text-[clamp(26px,3vw,34px)] font-black uppercase leading-none text-ink"
				>
					On the record
				</h2>
				<p className="mt-3 max-w-[56ch] font-body text-lg leading-relaxed text-ink-soft">
					Registered, tax-cleared, and on the government supplier list. Copies of each
					certificate are available on request.
				</p>

				<dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{currentCredentials().map((c) => (
						<div key={c.body} className="rounded-2xl bg-card-tint p-6">
							<dt>
								<span className="block font-display text-3xl font-black uppercase leading-none text-ink">
									{c.body}
								</span>
								<span className="mt-2 block font-body text-xs font-semibold leading-snug text-ink-soft">
									{c.bodyName}
								</span>
							</dt>
							<dd className="mt-4 font-body text-[15px] leading-snug text-ink">{c.detail}</dd>
						</div>
					))}
				</dl>

				<div className="mt-14 grid gap-12 lg:grid-cols-2">
					<div>
						<h3 className="font-display text-2xl font-extrabold uppercase leading-none text-ink">
							Recent work
						</h3>
						<ul role="list" className="mt-6 flex flex-col gap-5">
							{RECENT_WORK.map((w) => (
								<li key={w.client} className="border-l-2 border-lime-deep pl-4">
									<p className="font-body text-base font-bold text-ink">{w.client}</p>
									<p className="mt-1 font-body text-[15px] leading-relaxed text-ink-soft">{w.scope}</p>
									<p className="mt-1 font-mono text-xs uppercase tracking-wider text-ink-soft">{w.date}</p>
								</li>
							))}
						</ul>
					</div>
					<div>
						<h3 className="font-display text-2xl font-extrabold uppercase leading-none text-ink">
							Clients include
						</h3>
						<ul role="list" className="mt-6 flex flex-wrap gap-2">
							{CLIENTS.map((name) => (
								<li
									key={name}
									className="rounded-pill border border-ink/10 bg-white px-4 py-2 font-body text-sm font-semibold text-ink"
								>
									{name}
								</li>
							))}
						</ul>
					</div>
				</div>
			</Section>

			{/* Contact-led rather than form-led: business jobs have too many variables
			    for the quote form's fields, so they start with a conversation. */}
			<Section tone="ink">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-display text-[clamp(28px,3.5vw,40px)] font-black uppercase leading-none">
						Let&apos;s scope it properly
					</h2>
					<p className="mt-4 font-body text-lg text-paper/70">
						Business jobs get a conversation, not a form. Tell us what you run and
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
