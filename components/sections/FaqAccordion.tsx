import { FAQS } from "@/content/faqs";

/**
 * Native <details>/<summary>: keyboard-operable and screen-reader-announced
 * with no JavaScript, and it degrades to plain open content if CSS fails.
 */
export function FaqAccordion() {
	return (
		<div className="flex flex-col gap-3">
			{FAQS.map((faq) => (
				<details
					key={faq.question}
					className="group rounded-2xl bg-card-tint px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
				>
					<summary className="flex cursor-pointer items-center justify-between gap-4 font-body text-base font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brick">
						{faq.question}
						<span aria-hidden="true" className="text-brick transition-transform group-open:rotate-45">
							+
						</span>
					</summary>
					<p className="mt-3 max-w-[62ch] font-body text-base leading-relaxed text-ink-soft">
						{faq.answer}
					</p>
				</details>
			))}
		</div>
	);
}
