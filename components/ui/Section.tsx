import { Reveal } from "@/components/ui/Reveal";

const tones = {
	paper: "bg-paper text-ink",
	ink: "bg-ink text-paper",
} as const;

export function Section({
	tone = "paper",
	className = "",
	children,
	reveal = true,
	...props
}: React.ComponentProps<"section"> & {
	tone?: keyof typeof tones;
	/** Opt out where the section is already animated by its own contents. */
	reveal?: boolean;
}) {
	const inner = <div className="mx-auto max-w-6xl">{children}</div>;
	return (
		<section className={`${tones[tone]} px-[6vw] py-20 ${className}`} {...props}>
			{reveal ? <Reveal>{inner}</Reveal> : inner}
		</section>
	);
}
