import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SERVICES, getService } from "@/content/services";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { LoopingVideo } from "@/components/ui/LoopingVideo";

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
	return pageMetadata({
		title: `${service.name} in Lusaka`,
		description: service.summary,
		path: `/services/${service.slug}`,
	});
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const service = getService(slug);
	if (!service) notFound();

	const schema = {
		"@context": "https://schema.org",
		"@type": "Service",
		name: service.name,
		description: service.summary,
		serviceType: service.name,
		url: `${SITE.url}/services/${service.slug}`,
		provider: {
			"@type": "MovingCompany",
			name: SITE.legalName,
			telephone: SITE.phoneE164,
			url: SITE.url,
		},
		areaServed: { "@type": "Country", name: SITE.country },
	};

	const others = SERVICES.filter((s) => s.slug !== service.slug);

	/*
	 * Two columns from lg. The page used to be one narrow column with the right
	 * half of the screen empty, and it ended on "What's included" running
	 * straight into the footer, with no way on: no closing call to action and no
	 * link to any other service.
	 */
	return (
		<main>
			<JsonLd data={schema} />
			<Section>
				<div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
					<div>
						<Link
							href="/services"
							className="font-mono text-xs uppercase tracking-wider text-lime-deep hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-deep"
						>
							Services
						</Link>
						<h1 className="mt-3 max-w-[14ch] font-display text-[clamp(38px,5vw,56px)] font-black uppercase leading-none">
							{service.heading}
						</h1>
						{service.body.map((p) => (
							<p key={p} className="mt-5 max-w-[52ch] font-body text-lg leading-relaxed text-ink-soft">
								{p}
							</p>
						))}
						<div className="mt-8 flex flex-wrap gap-3">
							<ButtonLink href={`/quote?service=${service.slug}`}>{service.cta} →</ButtonLink>
							<a
								href={buildWhatsAppUrl({ service: service.name })}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center rounded-pill border border-ink/10 bg-card-tint px-6 py-3.5 font-body text-sm font-bold text-ink transition-[background-color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:bg-card-tint/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-deep"
							>
								Ask on WhatsApp
							</a>
						</div>
					</div>

					<aside aria-labelledby="included-heading" className="flex flex-col gap-6">
						<div className="rounded-2xl bg-ink p-8 text-paper">
							<div className="flex items-center gap-3">
								<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-paper/10 text-lime">
									<ServiceIcon name={service.icon} />
								</span>
								<h2 id="included-heading" className="font-display text-2xl font-black uppercase leading-none">
									What&apos;s included
								</h2>
							</div>
							<ul className="mt-6 flex flex-col gap-3.5">
								{service.includes.map((item) => (
									<li key={item} className="flex gap-3 font-body text-[15px] leading-snug text-paper/80">
										<span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-[2px] bg-lime" />
										{item}
									</li>
								))}
							</ul>
						</div>

						{service.video ? (
							<LoopingVideo
								{...service.video}
								className="aspect-[4/5] w-full rounded-2xl bg-ink"
							/>
						) : service.image && (
							<Image
								src={service.image.src}
								alt={service.image.alt}
								width={service.image.width}
								height={service.image.height}
								// Explicit dimensions reserve the space (no layout shift);
								// `sizes` stops phones downloading the desktop asset.
								sizes="(max-width: 1024px) 100vw, 416px"
								// 4:5, close to the portrait sources (3:4): a landscape frame
								// cropped the crane's jib and the container out of their own photo.
								className="aspect-[4/5] w-full rounded-2xl object-cover"
							/>
						)}
					</aside>
				</div>
			</Section>

			<Section className="border-t border-ink/10">
				<h2 className="font-display text-[clamp(26px,3vw,34px)] font-black uppercase leading-none text-ink">
					Other services
				</h2>
				<ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{others.map((o) => (
						<li key={o.slug}>
							<Link
								href={`/services/${o.slug}`}
								className="group flex h-full items-center gap-4 rounded-2xl bg-card-tint px-5 py-4 transition-[background-color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:bg-card-tint/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-deep"
							>
								<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-lime">
									<ServiceIcon name={o.icon} className="h-5 w-5" />
								</span>
								<span className="flex-1 font-body text-[15px] font-bold text-ink">{o.name}</span>
								<span
									aria-hidden="true"
									className="text-lime-deep transition-transform duration-300 ease-out group-hover:translate-x-1"
								>
									→
								</span>
							</Link>
						</li>
					))}
				</ul>
			</Section>

			<Section tone="ink">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-display text-[clamp(28px,3.5vw,40px)] font-black uppercase leading-none">
						Ready when you are
					</h2>
					<p className="mt-4 font-body text-lg text-paper/70">
						Tell us what you&apos;re moving and we&apos;ll come back with a firm price.
					</p>
					<ButtonLink href={`/quote?service=${service.slug}`} className="mt-8">
						{service.cta} →
					</ButtonLink>
				</div>
			</Section>
		</main>
	);
}
