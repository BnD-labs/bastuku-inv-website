export const SITE = {
	name: "Bastuku Investments",
	legalName: "Bastuku Investments Limited",
	foundedYear: 2017,
	phoneDisplay: "+260 976 831 400",
	phoneE164: "+260976831400",
	whatsappNumber: "260976831400",
	// Secondary call line only. WhatsApp stays on the primary number. From the
	// 2026 company profile; it replaced +260 967 022 254 (CLAIMS #17).
	phone2Display: "+260 977 778 844",
	phone2E164: "+260977778844",
	email: "info@bastuku-inv.com",
	// Office address, as printed three times in the 2026 company profile
	// (CLAIMS #25). The plot number is for the schema and the contact page;
	// the footer uses the short form people actually navigate by.
	building: "CHAZ Complex",
	street: "Mission Drive",
	plot: "Plot No. 2882/B/510",
	unit: "Office Unit F3-1",
	poBox: "34511",
	city: "Lusaka",
	country: "Zambia",
	url: "https://bastuku-inv.com",
} as const;

export const CONTACT_EMAIL = SITE.email;
