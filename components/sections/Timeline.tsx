import { STEPS } from "@/content/steps";

/**
 * Marker and rail styling ported from `legacy/bastuku-full-flow.html:252-267`.
 * The concept used <div>s; these steps are an ordered sequence, so the markup
 * is an <ol> and screen readers announce "list, 3 items" and the position.
 */
export function Timeline() {
	return (
		<ol className="relative list-none pl-10 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-0.5 before:bg-paper/[0.18] before:content-['']">
			{STEPS.map((step, i) => (
				<li key={step.title} className="relative pb-14 last:pb-0">
					<span
						aria-hidden="true"
						className="absolute -left-10 top-1 h-3 w-3 rounded-[3px] bg-amber-bright"
					/>
					<h3 className="mb-3 font-body text-xl font-bold text-paper">
						<span className="mr-1.5 font-mono text-amber-bright">
							{String(i + 1).padStart(2, "0")}
						</span>
						{step.title}
					</h3>
					{step.paragraphs.map((p) => (
						<p key={p} className="mt-2.5 max-w-[56ch] font-body text-[15.5px] leading-relaxed text-paper/[0.68]">
							{p}
						</p>
					))}
				</li>
			))}
		</ol>
	);
}
