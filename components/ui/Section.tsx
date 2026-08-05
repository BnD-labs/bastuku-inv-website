const tones = {
	paper: "bg-paper text-ink",
	ink: "bg-ink text-paper",
} as const;

export function Section({
	tone = "paper",
	className = "",
	children,
	...props
}: React.ComponentProps<"section"> & { tone?: keyof typeof tones }) {
	return (
		<section className={`${tones[tone]} px-[6vw] py-20 ${className}`} {...props}>
			<div className="mx-auto max-w-6xl">{children}</div>
		</section>
	);
}
