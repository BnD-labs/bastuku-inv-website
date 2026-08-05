import { SITE } from "@/content/site";

/**
 * The stat band from `legacy/bastuku-full-flow.html:355-360`.
 *
 * The concept showed four stats. Two are omitted deliberately, not forgotten:
 *   - "500+ moves completed" conflicts with the old site's "200+"  (CLAIMS.md #3)
 *   - "24/7 WhatsApp support" is unsubstantiated                   (CLAIMS.md #2)
 * A two-stat strip that is true beats a four-stat strip that is not. Restore
 * them here once those rows reach VERIFIED.
 */
const STATS: { value: string; label: string }[] = [
	{ value: String(SITE.foundedYear), label: "In business since" },
	{ value: `${SITE.city}+`, label: "Coverage area" },
];

export function TrustStrip() {
	return (
		<div className="flex flex-wrap justify-around gap-6 bg-ink px-[5vw] py-8">
			{STATS.map((s) => (
				<div key={s.label} className="text-center font-mono">
					<b className="block text-[22px] font-bold text-amber-bright">{s.value}</b>
					<span className="text-[11.5px] uppercase tracking-wide text-paper/60">{s.label}</span>
				</div>
			))}
		</div>
	);
}
