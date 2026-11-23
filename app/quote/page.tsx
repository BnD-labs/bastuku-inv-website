import { Suspense } from "react";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/metadata";

// Description is the layout default. The canonical also collapses the
// ?service=… prefill variants onto /quote.
export const metadata = pageMetadata({ title: "Get a Quote", path: "/quote" });

export default function QuotePage() {
	return (
		<main>
			<Section>
				<div className="mx-auto max-w-2xl">
					<h1 className="font-display text-[clamp(30px,4vw,46px)] font-black uppercase leading-none text-ink">
						Get a quote
					</h1>
					<p className="mt-3 font-body text-base text-ink-soft">
						Tell us what you&apos;re moving. We&apos;ll come back with a firm price.
					</p>
					<div className="mt-8">
						{/* QuoteForm reads ?service/?low/?high, so it needs a Suspense
						    boundary for this page to stay statically prerendered. */}
						<Suspense fallback={null}>
							<QuoteForm />
						</Suspense>
					</div>
				</div>
			</Section>
		</main>
	);
}
