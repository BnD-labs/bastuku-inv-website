import Image from "next/image";
import { MoveScoper } from "@/components/sections/MoveScoper";
import { SITE } from "@/content/site";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden bg-ink">
			{/* Wrapper carries the Ken Burns so the transform never lands on the
			    <img> itself, which next/image positions absolutely under `fill`. */}
			<div className="u-ken-burns absolute inset-0">
				<Image
					src="/images/hero-yard.webp"
					alt=""
					aria-hidden="true"
					fill
					priority
					sizes="100vw"
					className="object-cover object-center"
				/>
			</div>
			{/* Keeps the headline legible over the photo's lighter right-hand side. */}
			<div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/25" />

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
