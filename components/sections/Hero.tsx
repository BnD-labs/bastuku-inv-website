import { HeroArt } from "@/components/art/HeroArt";
import { EstimateWidget } from "@/components/sections/EstimateWidget";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-paper">
			<div className="absolute inset-0 z-0">
				<HeroArt />
			</div>

			<div className="relative z-10 px-[5vw] pb-16 pt-16 sm:pt-20">
				<h1 className="max-w-[11ch] font-display text-[clamp(38px,5.4vw,64px)] font-black uppercase leading-[0.98] text-ink">
					We&apos;ll carry
					<br />
					the <span className="text-brick">load.</span>
					<br />
					You carry on.
				</h1>

				<div className="mt-8">
					<EstimateWidget />
				</div>
			</div>
		</section>
	);
}
