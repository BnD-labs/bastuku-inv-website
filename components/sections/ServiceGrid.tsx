import Link from "next/link";
import { SERVICES } from "@/content/services";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { Reveal } from "@/components/ui/Reveal";

/*
 * The services as a plain grid, on the homepage and the hub alike. It replaced
 * a 3D coverflow on the homepage that showed one service out of seven, let the
 * text of neighbouring cards bleed through each other mid-animation, and pushed
 * its off-stage slides past the edge of a phone screen, which widened the page
 * to 698px and made the browser zoom the whole homepage out.
 *
 * The last cell is a "not sure" card that spans whatever is left of the final
 * row, so no service sits alone on a row at any column count. The spans are
 * worked out from SERVICES.length, not written for seven.
 */
const SM_COLS = 2;
const LG_COLS = 4;
const span = (cols: number) => cols - (SERVICES.length % cols);
// Whole class names, so Tailwind's scanner can see them.
const SM_SPAN: Record<number, string> = { 1: "sm:col-span-1", 2: "sm:col-span-2" };
const LG_SPAN: Record<number, string> = {
	1: "lg:col-span-1",
	2: "lg:col-span-2",
	3: "lg:col-span-3",
	4: "lg:col-span-4",
};

const tones = {
	// On a navy section: paper cards, a navy icon chip carrying the lime.
	ink: {
		card: "bg-paper text-ink hover:shadow-[0_26px_44px_-22px_rgba(0,0,0,0.75)]",
		chip: "bg-ink text-lime",
		cta: "text-lime-deep",
		filler: "border border-dashed border-paper/30 text-paper hover:border-paper/60",
		fillerBody: "text-paper/70",
		fillerCta: "text-lime",
	},
	// On a paper section: tinted cards, and the filler goes navy so it reads as
	// the way out rather than an eighth service.
	paper: {
		card: "bg-card-tint text-ink hover:bg-card-tint/70 hover:shadow-[0_22px_38px_-20px_rgba(7,34,72,0.55)]",
		chip: "bg-ink text-lime",
		cta: "text-lime-deep",
		filler: "bg-ink text-paper hover:shadow-[0_22px_38px_-20px_rgba(7,34,72,0.75)]",
		fillerBody: "text-paper/70",
		fillerCta: "text-lime",
	},
} as const;

const cardBase =
	"group flex h-full flex-col rounded-2xl p-6 transition-[background-color,transform,box-shadow,border-color] " +
	"duration-300 ease-out hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2";

export function ServiceGrid({
	tone,
	headingLevel,
}: {
	tone: keyof typeof tones;
	/** h2 on the hub, where each card is a top-level entry; h3 under a section heading. */
	headingLevel: "h2" | "h3";
}) {
	const t = tones[tone];
	const Heading = headingLevel;
	const outline = tone === "ink" ? "focus-visible:outline-lime" : "focus-visible:outline-lime-deep";

	return (
		<ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{SERVICES.map((s, i) => (
				// Cascade across the grid rather than revealing it as one slab.
				// Capped so the last card is never more than ~0.4s behind the first.
				<Reveal as="li" key={s.slug} delay={Math.min(i, 5) * 70}>
					<Link href={`/services/${s.slug}`} className={`${cardBase} ${t.card} ${outline}`}>
						<span
							className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 ease-out group-hover:-translate-y-0.5 ${t.chip}`}
						>
							<ServiceIcon name={s.icon} />
						</span>
						<Heading className="mt-5 font-display text-[22px] font-extrabold uppercase leading-[1.05]">
							{s.name}
						</Heading>
						<p className="mt-3 flex-1 font-body text-sm leading-relaxed text-ink-soft">{s.summary}</p>
						<span className={`mt-5 font-body text-sm font-bold ${t.cta}`}>
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
			<Reveal
				as="li"
				delay={Math.min(SERVICES.length, 5) * 70}
				className={`${SM_SPAN[span(SM_COLS)]} ${LG_SPAN[span(LG_COLS)]}`}
			>
				<Link href="/quote" className={`${cardBase} justify-center ${t.filler} ${outline}`}>
					<Heading className="font-display text-[22px] font-extrabold uppercase leading-[1.05]">
						Not sure which you need?
					</Heading>
					<p className={`mt-3 max-w-[40ch] font-body text-sm leading-relaxed ${t.fillerBody}`}>
						Tell us what you&apos;re moving and we&apos;ll point you at the right one.
					</p>
					<span className={`mt-5 font-body text-sm font-bold ${t.fillerCta}`}>
						Get My Quote
						<span
							aria-hidden="true"
							className="ml-1 inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5"
						>
							→
						</span>
					</span>
				</Link>
			</Reveal>
		</ul>
	);
}
