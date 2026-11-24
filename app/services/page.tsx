import { SERVICES } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";
import { Section } from "@/components/ui/Section";
import { ServiceGrid } from "@/components/sections/ServiceGrid";

export const metadata = pageMetadata({
	title: "Services",
	description:
		"House removals, office relocation, cross-border and international moves, clearing and forwarding, professional packaging, and general supplies across Zambia.",
	path: "/services",
});

export default function ServicesHubPage() {
	return (
		<main>
			{/* reveal={false}: the cards below cascade individually, and a block
			    reveal on top of that reads as a double fade. The grid's last cell
			    is the "not sure which" way out, so the page needs no closing band. */}
			<Section reveal={false}>
				<p className="font-mono text-xs uppercase tracking-wider text-lime-deep">Services</p>
				<h1 className="mt-3 max-w-[16ch] font-display text-[clamp(34px,4.5vw,52px)] font-black uppercase leading-none text-ink">
					Everything we move
				</h1>
				{/* One template literal: JSX drops the space between an expression and
				    following text when the text wraps to another line. */}
				<p className="mt-5 max-w-[52ch] font-body text-lg leading-relaxed text-ink-soft">
					{`${SERVICES.length} services, one point of contact. Pick the one that fits — or tell us what you need and we'll work it out with you.`}
				</p>

				<div className="mt-12">
					<ServiceGrid tone="paper" headingLevel="h2" />
				</div>
			</Section>
		</main>
	);
}
