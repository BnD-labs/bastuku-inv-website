"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { normaliseServiceSlug, quoteSchema } from "@/lib/validation";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { SERVICES } from "@/content/services";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

type FieldErrors = Partial<Record<string, string[]>>;

const inputClass =
	"rounded-2xl border-[1.5px] border-ink/15 bg-white px-4 py-3 font-body text-sm text-ink " +
	"focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-deep";

interface Prefill {
	serviceSlug: string;
	origin: string;
	destination: string;
}

const NO_PREFILL: Prefill = { serviceSlug: SERVICES[0].slug, origin: "", destination: "" };

/** The form, prefilled from ?service, ?origin and ?destination (the scoper's hand-off). */
export function QuoteForm() {
	const params = useSearchParams();
	const prefill: Prefill = {
		// Old shared links still carry ?service=exports-imports.
		serviceSlug: normaliseServiceSlug(params.get("service")) ?? NO_PREFILL.serviceSlug,
		origin: params.get("origin") ?? "",
		destination: params.get("destination") ?? "",
	};
	// Keyed so a client-side navigation to a different prefill starts fresh.
	return <QuoteFormFields key={JSON.stringify(prefill)} prefill={prefill} />;
}

/*
 * The Suspense fallback for QuoteForm: the same form with nothing prefilled.
 * useSearchParams has no value at prerender, so the static HTML is whatever the
 * fallback renders. It used to be null, so the page arrived with no form and
 * the footer jumped down by the form's full height on hydration (CLS 0.27 on a
 * laptop, 0.52 on a phone, the red Lighthouse check in CI). With the same form
 * as the fallback, hydration only changes field values, never the layout.
 *
 * It is disabled, not just a look-alike. React throws this DOM away and mounts
 * the real form when it hydrates, so anything typed here would vanish, and a
 * submit before hydration would be a native GET that puts the visitor's name
 * and phone in the URL. Disabled fields can't be typed in or submitted.
 */
export function QuoteFormSkeleton() {
	return <QuoteFormFields prefill={NO_PREFILL} placeholder />;
}

declare global {
	interface Window {
		turnstile?: {
			render: (el: HTMLElement, opts: { sitekey: string }) => string;
			remove: (widgetId: string) => void;
		};
	}
}

function QuoteFormFields({ prefill, placeholder = false }: { prefill: Prefill; placeholder?: boolean }) {
	const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
	const turnstileRef = useRef<HTMLDivElement>(null);
	const [turnstileReady, setTurnstileReady] = useState(false);

	/*
	 * Explicit rendering, owned by this form instance. The implicit mode scans for
	 * .cf-turnstile once, when the script loads, so it could fill the placeholder
	 * form (which React then discards) and leave the real one empty, and a form
	 * remounted after the script had loaded (navigating back to /quote, or a new
	 * prefill) got no widget at all. Either way the server answered 403.
	 */
	useEffect(() => {
		const el = turnstileRef.current;
		if (placeholder || !siteKey || !turnstileReady || !el || !window.turnstile) return;
		const widgetId = window.turnstile.render(el, { sitekey: siteKey });
		return () => window.turnstile?.remove(widgetId);
	}, [placeholder, siteKey, turnstileReady]);

	const [values, setValues] = useState({
		name: "",
		phone: "",
		email: "",
		serviceSlug: prefill.serviceSlug,
		origin: prefill.origin,
		destination: prefill.destination,
		moveDate: "",
		message: "",
	});
	const [errors, setErrors] = useState<FieldErrors>({});
	const [busy, setBusy] = useState(false);
	const [done, setDone] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

	const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
		setValues((v) => ({ ...v, [k]: e.target.value }));

	/** Secondary escape hatch, always available, built from what is typed so far. */
	const manualWhatsApp = buildWhatsAppUrl({
		name: values.name || undefined,
		service: SERVICES.find((s) => s.slug === values.serviceSlug)?.name,
		origin: values.origin || undefined,
		destination: values.destination || undefined,
		message: values.message || undefined,
	});

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setFormError(null);
		setFallbackUrl(null);

		const candidate = {
			...values,
			email: values.email || undefined,
			origin: values.origin || undefined,
			destination: values.destination || undefined,
			moveDate: values.moveDate || undefined,
			message: values.message || undefined,
			sourcePage: typeof window === "undefined" ? undefined : window.location.pathname,
		};

		const parsed = quoteSchema.safeParse(candidate);
		if (!parsed.success) {
			setErrors(parsed.error.flatten().fieldErrors);
			return;
		}
		setErrors({});
		setBusy(true);

		// The token may be absent if the widget has not loaded. Send anyway — the
		// server is the authority and answers 403. Blocking here would only
		// strand users behind a third-party script outage.
		const token =
			turnstileRef.current?.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')
				?.value ?? "";

		try {
			const res = await fetch("/api/quote", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...parsed.data, turnstileToken: token }),
			});
			const json = (await res.json()) as {
				ok: boolean;
				error?: string;
				fieldErrors?: FieldErrors;
				whatsappUrl?: string;
			};

			if (json.ok) {
				setDone(true);
				return;
			}
			if (json.fieldErrors) setErrors(json.fieldErrors);
			setFormError(json.error ?? "Something went wrong.");
			if (json.whatsappUrl) setFallbackUrl(json.whatsappUrl);
		} catch {
			setFormError("We couldn't reach the server. Message us on WhatsApp and we'll pick it up.");
			setFallbackUrl(manualWhatsApp);
		} finally {
			setBusy(false);
		}
	}

	// Deliberately terminal: the legacy form reset itself after a timeout
	// (the old static site reset it on a timer), which read as "it didn't send".
	if (done) {
		return (
			<div className="rounded-2xl bg-card-tint p-8 text-center">
				<h2 className="font-display text-3xl font-black uppercase text-ink">
					We&apos;ve got your request
				</h2>
				<p className="mt-3 font-body text-base text-ink-soft">
					We&apos;ll come back to you shortly. If it&apos;s urgent, message us on WhatsApp.
				</p>
				<a
					href={manualWhatsApp}
					target="_blank"
					rel="noopener noreferrer"
					className="mt-6 inline-flex rounded-pill bg-ink px-6 py-3 font-body text-sm font-bold text-lime"
				>
					WhatsApp us
				</a>
			</div>
		);
	}

	return (
		<form onSubmit={onSubmit} noValidate aria-busy={busy || placeholder} className="flex flex-col gap-5">
			{!placeholder && (
				// onReady, not onLoad: it also fires when this form remounts after the
				// script has already loaded.
				<Script
					src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
					strategy="lazyOnload"
					onReady={() => setTurnstileReady(true)}
				/>
			)}
			{/* display: contents keeps the form's flex gap; disabled only matters
			    for the placeholder. */}
			<fieldset disabled={placeholder} className="contents">

				<Field label="Full name" htmlFor="q-name" error={errors.name?.[0]}>
					<input
						id="q-name"
						name="name"
						value={values.name}
						onChange={set("name")}
						autoComplete="name"
						aria-invalid={!!errors.name}
						aria-describedby={errors.name ? "q-name-error" : undefined}
						className={inputClass}
					/>
				</Field>

				<Field label="Phone number" htmlFor="q-phone" error={errors.phone?.[0]}>
					<input
						id="q-phone"
						name="phone"
						type="tel"
						value={values.phone}
						onChange={set("phone")}
						autoComplete="tel"
						// A format hint, not a number: this used to be BASTUKU's retired
						// line, which read like a number to call.
						placeholder="09X XXX XXXX"
						aria-invalid={!!errors.phone}
						aria-describedby={errors.phone ? "q-phone-error" : undefined}
						className={inputClass}
					/>
				</Field>

				<Field label="Email (optional)" htmlFor="q-email" error={errors.email?.[0]}>
					<input
						id="q-email"
						name="email"
						type="email"
						value={values.email}
						onChange={set("email")}
						autoComplete="email"
						aria-invalid={!!errors.email}
						aria-describedby={errors.email ? "q-email-error" : undefined}
						className={inputClass}
					/>
				</Field>

				<Field label="Service" htmlFor="q-service" error={errors.serviceSlug?.[0]}>
					<select
						id="q-service"
						name="serviceSlug"
						value={values.serviceSlug}
						onChange={set("serviceSlug")}
						className={inputClass}
					>
						{SERVICES.map((s) => (
							<option key={s.slug} value={s.slug}>
								{s.name}
							</option>
						))}
					</select>
				</Field>

				<div className="grid gap-5 sm:grid-cols-2">
					<Field label="Moving from (optional)" htmlFor="q-origin" error={errors.origin?.[0]}>
						<input
							id="q-origin"
							name="origin"
							value={values.origin}
							onChange={set("origin")}
							className={inputClass}
						/>
					</Field>
					<Field label="Moving to (optional)" htmlFor="q-destination" error={errors.destination?.[0]}>
						<input
							id="q-destination"
							name="destination"
							value={values.destination}
							onChange={set("destination")}
							className={inputClass}
						/>
					</Field>
				</div>

				<Field label="Preferred date (optional)" htmlFor="q-date" error={errors.moveDate?.[0]}>
					<input
						id="q-date"
						name="moveDate"
						type="date"
						value={values.moveDate}
						onChange={set("moveDate")}
						className={inputClass}
					/>
				</Field>

				<Field label="Anything else? (optional)" htmlFor="q-message" error={errors.message?.[0]}>
					<textarea
						id="q-message"
						name="message"
						rows={4}
						value={values.message}
						onChange={set("message")}
						aria-invalid={!!errors.message}
						aria-describedby={errors.message ? "q-message-error" : undefined}
						className={inputClass}
					/>
				</Field>

				{/* The widget injects a 65px iframe once its script loads (lazily, after
				    hydration), so the space is reserved up front or the button below
				    would jump down. */}
				{siteKey && <div ref={turnstileRef} className="min-h-[65px]" />}

				{formError && (
					<p role="alert" className="font-body text-sm font-semibold text-danger">
						{formError}
					</p>
				)}

				{fallbackUrl && (
					<a
						href={fallbackUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="rounded-pill bg-lime px-6 py-4 text-center font-body text-base font-bold text-ink"
					>
						Send this on WhatsApp instead
					</a>
				)}

				<Button type="submit" disabled={busy}>
					{busy ? "Sending…" : "Get My Quote"}
				</Button>

				<a
					href={manualWhatsApp}
					target="_blank"
					rel="noopener noreferrer"
					className="text-center font-body text-sm font-semibold text-ink-soft underline"
				>
					Or WhatsApp us
				</a>
			</fieldset>
		</form>
	);
}
