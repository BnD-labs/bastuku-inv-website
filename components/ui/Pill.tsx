export function Pill({ className = "", ...props }: React.ComponentProps<"span">) {
	return (
		<span
			className={`inline-flex items-center gap-2 rounded-pill bg-card-tint px-5 py-2.5 font-body text-sm font-bold text-ink ${className}`}
			{...props}
		/>
	);
}
