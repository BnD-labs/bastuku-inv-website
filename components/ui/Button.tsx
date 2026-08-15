import Link from "next/link";
import type { ComponentProps } from "react";

const variants = {
	primary: "bg-lime text-ink hover:bg-lime-bright",
	dark: "bg-ink text-lime hover:bg-ink-soft",
	ghost: "bg-card-tint text-ink border border-ink/10 hover:bg-card-tint/70",
} as const;

type Variant = keyof typeof variants;

const base =
	"inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3.5 " +
	"font-body text-sm font-bold whitespace-nowrap transition-colors " +
	"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-deep";

export function Button({
	variant = "primary",
	className = "",
	...props
}: ComponentProps<"button"> & { variant?: Variant }) {
	return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function ButtonLink({
	variant = "primary",
	className = "",
	...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
	return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
