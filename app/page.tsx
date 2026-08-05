import Link from "next/link";
import { Hero } from "@/components/sections/Hero";
import { CtaCards } from "@/components/sections/CtaCards";
import { ServicePicker } from "@/components/sections/ServicePicker";
import { CoverageTiers } from "@/components/sections/CoverageTiers";
import { Timeline } from "@/components/sections/Timeline";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";

export default function Home() {
	return (
		<main>
			<Hero />
			<CtaCards />
			<TrustStrip />

			<Section tone="ink">
				<div className="mx-auto mb-12 max-w-2xl text-center">
					<p className="font-mono text-xs uppercase tracking-widest text-amber-bright">What we do</p>
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

			<Section tone="ink">
				<div className="mb-10 max-w-2xl">
					<p className="font-mono text-xs uppercase tracking-widest text-amber-bright">The process</p>
					<h2 className="mt-3 font-display text-[clamp(30px,4vw,46px)] font-black uppercase leading-none">
						How it works
					</h2>
				</div>
				<Timeline />
				<Link
					href="/how-it-works"
					className="mt-10 inline-block border-b border-paper/35 pb-0.5 font-body text-sm font-semibold text-paper hover:border-paper"
				>
					See the full process →
				</Link>
			</Section>

			<Section>
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-display text-[clamp(30px,4vw,46px)] font-black uppercase leading-none text-ink">
						Ready to move?
					</h2>
					<p className="mt-4 font-body text-lg text-ink-soft">
						Get an indicative price in under a minute, then we&apos;ll confirm the details.
					</p>
					<ButtonLink href="/quote" className="mt-8">
						Get My Quote →
					</ButtonLink>
				</div>
			</Section>
		</main>
	);
}
