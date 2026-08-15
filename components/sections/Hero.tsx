import Image from "next/image";
import { MoveScoper } from "@/components/sections/MoveScoper";

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

			<div className="relative z-10 px-[5vw] pb-16 pt-16 sm:pt-20">
				{/* Above the fold, so this is a load-time stagger rather than a scroll
				    reveal — an observer would fire instantly and look mistimed. */}
				<h1 className="max-w-[11ch] font-display text-[clamp(38px,5.4vw,64px)] font-black uppercase leading-[0.98] text-paper">
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

				<div className="u-rise mt-8" style={{ animationDelay: "420ms" }}>
					<MoveScoper />
				</div>
			</div>
		</section>
	);
}
