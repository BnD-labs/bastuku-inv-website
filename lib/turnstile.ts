const SITEVERIFY = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
	token: string,
	secret: string,
	remoteip?: string
): Promise<boolean> {
	if (!token) return false;

	try {
		const res = await fetch(SITEVERIFY, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ secret, response: token, ...(remoteip ? { remoteip } : {}) }),
		});
		const data = (await res.json()) as { success?: boolean };
		return data.success === true;
	} catch {
		// Never let a captcha outage throw — the caller decides how to degrade.
		return false;
	}
}
