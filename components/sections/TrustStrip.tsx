import { SITE } from "@/content/site";

/**
 * A slim row of plain facts, in place of the concept's stat band. The band
 * was built for four big numbers, and only two could be shown honestly:
 *   - "500+ moves completed" conflicts with the old site's "200+"  (CLAIMS.md #3)
 *   - "24/7 WhatsApp support" is unsubstantiated                   (CLAIMS.md #2)
 * which left a full-width navy band holding "2017" and "Lusaka+", and that read
 * as empty rather than confident. Every item here is already stated elsewhere
 * on the site. Bring back a stat band once CLAIMS #3 has one agreed number.
 */
const FACTS = [
	`In business since ${SITE.foundedYear}`,
	`Based in ${SITE.city}`,
	"Firm quote before anything moves",
];

export function TrustStrip() {
	return (
		<div className="border-b border-paper/10 bg-ink px-[5vw] py-4">
			<ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 font-mono text-[11.5px] uppercase tracking-wider text-paper/75">
				{FACTS.map((f) => (
					<li key={f} className="flex items-center gap-2.5">
						<span aria-hidden="true" className="h-1.5 w-1.5 rounded-[2px] bg-lime" />
						{f}
					</li>
				))}
				<li className="flex items-center gap-2.5">
					<span aria-hidden="true" className="h-1.5 w-1.5 rounded-[2px] bg-lime" />
					<a href={`tel:${SITE.phoneE164}`} className="text-lime hover:text-lime-bright">
						Call {SITE.phoneDisplay}
					</a>
				</li>
			</ul>
		</div>
	);
}
