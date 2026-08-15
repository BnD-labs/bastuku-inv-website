import Image from "next/image";
import { MoveScoper } from "@/components/sections/MoveScoper";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden bg-ink">
			<Image
				src="/images/hero-yard.webp"
				alt=""
				aria-hidden="true"
				fill
				priority
				sizes="100vw"
				className="object-cover object-center"
			/>
			{/* Keeps the headline legible over the photo's lighter right-hand side. */}
			<div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/25" />

			<div className="relative z-10 px-[5vw] pb-16 pt-16 sm:pt-20">
				<h1 className="max-w-[11ch] font-display text-[clamp(38px,5.4vw,64px)] font-black uppercase leading-[0.98] text-paper">
					We&apos;ll carry
					<br />
					the <span className="text-lime">load.</span>
					<br />
					You carry on.
				</h1>

				<div className="mt-8">
					<MoveScoper />
				</div>
			</div>
		</section>
	);
}
