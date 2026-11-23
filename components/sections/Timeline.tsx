import { STEPS } from "@/content/steps";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Marker and rail styling ported from the original static concept.
 * That markup used <div>s; these steps are an ordered sequence, so this is an
 * <ol> and screen readers announce "list, 3 items" and the position.
 *
 * Vertical rail on phones and tablets; from lg the steps sit side by side on a
 * horizontal rail, because a single narrow column left the right half of a
 * laptop screen empty.
 */
export function Timeline() {
	return (
		<ol className="relative list-none pl-10 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-0.5 before:bg-paper/[0.18] before:content-[''] lg:grid lg:grid-cols-3 lg:gap-12 lg:pl-0 lg:pt-10 lg:before:bottom-auto lg:before:left-0 lg:before:right-0 lg:before:top-[5px] lg:before:h-0.5 lg:before:w-auto">
			{STEPS.map((step, i) => (
				<Reveal as="li" key={step.title} delay={i * 110} className="relative pb-14 last:pb-0 lg:pb-0">
					<span
						aria-hidden="true"
						className="absolute -left-10 top-1 h-3 w-3 rounded-[3px] bg-lime lg:-top-10 lg:left-0"
					/>
					<h3 className="mb-3 font-body text-xl font-bold text-paper">
						<span className="mr-1.5 font-mono text-lime">
							{String(i + 1).padStart(2, "0")}
						</span>
						{step.title}
					</h3>
					{step.paragraphs.map((p) => (
						<p key={p} className="mt-2.5 max-w-[56ch] font-body text-[15.5px] leading-relaxed text-paper/[0.68]">
							{p}
						</p>
					))}
				</Reveal>
			))}
		</ol>
	);
}
