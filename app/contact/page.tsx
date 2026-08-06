import { Suspense } from "react";
import type { Metadata } from "next";
import { SITE } from "@/content/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
	title: "Contact",
	description: `Call, WhatsApp, or email Bastuku Investments in ${SITE.city}, ${SITE.country}.`,
	alternates: { canonical: "/contact" },
};

export default function ContactPage() {
	return (
		<main>
			<Section>
				<div className="grid gap-14 lg:grid-cols-[minmax(0,22rem)_1fr]">
					<div>
						<p className="font-mono text-xs uppercase tracking-wider text-brick">Contact</p>
						<h1 className="mt-3 font-display text-[clamp(34px,4.5vw,52px)] font-black uppercase leading-none text-ink">
							Talk to us
						</h1>
						<p className="mt-5 font-body text-lg leading-relaxed text-ink-soft">
							Fastest is WhatsApp. We answer the phone too.
						</p>

						<ul className="mt-8 flex flex-col gap-5 font-body">
							<li>
								<span className="block font-mono text-xs uppercase tracking-wider text-ink-soft/70">
									WhatsApp
								</span>
								<a
									href={buildWhatsAppUrl({})}
									target="_blank"
									rel="noopener noreferrer"
									className="text-base font-bold text-ink underline"
								>
									{SITE.phoneDisplay}
								</a>
							</li>
							<li>
								<span className="block font-mono text-xs uppercase tracking-wider text-ink-soft/70">
									Phone
								</span>
								<a href={`tel:${SITE.phoneE164}`} className="text-base font-bold text-ink underline">
									{SITE.phoneDisplay}
								</a>
							</li>
							<li>
								<span className="block font-mono text-xs uppercase tracking-wider text-ink-soft/70">
									Email
								</span>
								<a href={`mailto:${SITE.email}`} className="text-base font-bold text-ink underline">
									{SITE.email}
								</a>
							</li>
							<li>
								<span className="block font-mono text-xs uppercase tracking-wider text-ink-soft/70">
									Based in
								</span>
								<span className="text-base font-bold text-ink">
									{SITE.city}, {SITE.country}
								</span>
								{/* No map embed until a street address exists — see CLAIMS.md. */}
							</li>
						</ul>
					</div>

					<div>
						<h2 className="font-display text-2xl font-extrabold uppercase leading-none text-ink">
							Send us a message
						</h2>
						<div className="mt-6">
							<Suspense fallback={null}>
								<QuoteForm />
							</Suspense>
						</div>
					</div>
				</div>
			</Section>
		</main>
	);
}
