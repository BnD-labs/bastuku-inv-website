import { getImageProps } from "next/image";
import { MoveScoper } from "@/components/sections/MoveScoper";
import { SITE } from "@/content/site";

/*
 * Art-directed: a portrait crop below sm, the full landscape frame above.
 * The old hero was one 1920x973 landscape image behind the whole section, and
 * `sizes="100vw"` told a phone it only needed a 1200px file. On a 390x1038
 * hero, `object-cover` then blew that up about five times, which is why it
 * looked stretched and soft. A <picture> loads only the source that matches,
 * so eager loading here never fetches both.
 */
const HERO_COMMON = { alt: "", sizes: "100vw", loading: "eager", fetchPriority: "high" } as const;
const {
	props: { srcSet: heroLandscape },
} = getImageProps({ ...HERO_COMMON, src: "/images/hero-packing.webp", width: 2400, height: 1080 });
const {
	props: { srcSet: heroPortrait, ...heroImg },
} = getImageProps({ ...HERO_COMMON, src: "/images/hero-packing-portrait.webp", width: 1170, height: 1461 });

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden bg-ink">
			{/* Below lg the photo is a band behind the headline that fades into
			    solid ink, so the scoper sits on a plain background instead of a
			    photo stretched to the height of the whole stacked section. */}
			<div aria-hidden="true" className="absolute inset-x-0 top-0 h-[36rem] overflow-hidden lg:inset-y-0 lg:h-auto">
				{/* Wrapper carries the Ken Burns so the transform never lands on the
				    <img> itself. */}
				<div className="u-ken-burns absolute inset-0">
					<picture>
						<source media="(min-width: 640px)" srcSet={heroLandscape} />
						{/* getImageProps already produced the optimised srcSet; next/image
						    cannot render a <picture>. */}
						{/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
						<img
							{...heroImg}
							srcSet={heroPortrait}
							className="absolute inset-0 h-full w-full object-cover object-[50%_35%] lg:object-center"
						/>
					</picture>
				</div>
				{/* Keeps the headline legible: top-down over the band on phones,
				    left-to-right on a laptop, where the text sits on the left. */}
				<div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/[0.82] to-ink lg:bg-gradient-to-r lg:from-ink lg:via-ink/80 lg:to-ink/30" />
			</div>

			{/* Two columns from lg: on a 1366x678 laptop the stacked layout left only
			    the scoper's first field above the fold, beside an empty photo. */}
			<div className="relative z-10 grid gap-10 px-[5vw] pb-16 pt-16 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-center lg:gap-16 lg:pb-12 lg:pt-10">
				<div>
					{/* Above the fold, so this is a load-time stagger rather than a scroll
					    reveal — an observer would fire instantly and look mistimed. */}
					<h1 className="max-w-[13ch] font-display text-[clamp(38px,5.4vw,64px)] font-black uppercase leading-[0.98] text-paper">
						<span className="u-rise block" style={{ animationDelay: "60ms" }}>
							We&apos;ll carry
						</span>
						<span className="u-rise block" style={{ animationDelay: "170ms" }}>
							the <span className="text-lime">load.</span>
						</span>
						<span className="u-rise block" style={{ animationDelay: "280ms" }}>
							You carry on.
						</span>
					</h1>
					<p
						className="u-rise mt-6 max-w-[42ch] font-body text-lg leading-relaxed text-paper/75"
						style={{ animationDelay: "360ms" }}
					>
						House and office moves, cross-border relocation, and freight clearing, from{" "}
						{SITE.city}.
					</p>
					<p className="u-rise mt-5 font-body text-sm text-paper/60" style={{ animationDelay: "400ms" }}>
						Rather talk?{" "}
						<a
							href={`tel:${SITE.phoneE164}`}
							className="font-semibold text-paper underline decoration-lime decoration-2 underline-offset-4 hover:text-lime focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
						>
							Call {SITE.phoneDisplay}
						</a>
					</p>
				</div>

				<div className="u-rise" style={{ animationDelay: "420ms" }}>
					<MoveScoper />
				</div>
			</div>
		</section>
	);
}
