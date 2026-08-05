import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SERVICES, getService } from "@/content/services";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export function generateStaticParams() {
	return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const service = getService(slug);
	if (!service) return {};
	return {
		title: `${service.name} in Lusaka | Bastuku Investments`,
		description: service.summary,
		alternates: { canonical: `/services/${service.slug}` },
	};
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const service = getService(slug);
	if (!service) notFound();

	return (
		<main>
			<Section>
				<p className="font-mono text-xs uppercase tracking-wider text-route">Services</p>
				<h1 className="mt-3 max-w-[14ch] font-display text-5xl font-black uppercase leading-none">
					{service.heading}
				</h1>
				{service.body.map((p) => (
					<p key={p} className="mt-5 max-w-[52ch] font-body text-lg leading-relaxed text-ink-soft">
						{p}
					</p>
				))}
				<ButtonLink href={`/quote?service=${service.slug}`} className="mt-8">
					{service.cta} →
				</ButtonLink>

				{service.image && (
					<Image
						src={service.image.src}
						alt={service.image.alt}
						width={service.image.width}
						height={service.image.height}
						// Explicit dimensions reserve the space (no layout shift);
						// `sizes` stops phones downloading the desktop asset.
						sizes="(max-width: 768px) 100vw, 640px"
						className="mt-12 w-full max-w-xl rounded-2xl object-cover"
					/>
				)}
			</Section>

			<Section tone="ink">
				<h2 className="font-display text-3xl font-black uppercase">What&apos;s included</h2>
				<ul className="mt-6 grid gap-4 sm:grid-cols-2">
					{service.includes.map((item) => (
						<li key={item} className="flex gap-3 font-body text-base text-paper/75">
							<span aria-hidden="true" className="text-amber-bright">
								—
							</span>
							{item}
						</li>
					))}
				</ul>
			</Section>
		</main>
	);
}
