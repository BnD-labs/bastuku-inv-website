import { Hero } from "@/components/sections/Hero";
import { ServicePicker } from "@/components/sections/ServicePicker";
import { CoverageTiers } from "@/components/sections/CoverageTiers";
import { Section } from "@/components/ui/Section";

export default function Home() {
	return (
		<main>
			<Hero />
			<Section tone="ink">
				<div className="mx-auto mb-12 max-w-2xl text-center">
					<p className="font-mono text-xs uppercase tracking-widest text-amber-bright">
						What we do
					</p>
					<h2 className="mt-3 font-display text-[clamp(30px,4vw,46px)] font-black uppercase leading-none">
						Six ways we move things
					</h2>
				</div>
				<ServicePicker />
			</Section>
			<Section>
				<div className="mb-10 max-w-2xl">
					<p className="font-mono text-xs uppercase tracking-widest text-ink-soft">Where we go</p>
					<h2 className="mt-3 font-display text-[clamp(30px,4vw,46px)] font-black uppercase leading-none">
						Coverage
					</h2>
				</div>
				<CoverageTiers />
			</Section>
		</main>
	);
}
