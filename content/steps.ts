export interface Step {
	title: string;
	paragraphs: string[];
}

export const STEPS: Step[] = [
	{
		title: "Request",
		paragraphs: [
			"Tell us what you're moving and where — house, office, or cross-border — and get an indicative estimate right on the site, no waiting required.",
			"Once you're happy with the range, confirm your date and we lock in your slot.",
		],
	},
	{
		title: "Pack & Move",
		paragraphs: [
			"Our team arrives on schedule to pack, load, and transport your belongings. You'll have a direct contact for the whole move — no chasing updates.",
			"Need something adjusted on the day? Tell your move lead and they'll sort it on the spot.",
		],
	},
	{
		title: "Unpack & Confirm",
		paragraphs: [
			"We place everything where you want it and do a walkthrough together before we leave — so you can confirm everything arrived in the shape it left in.",
			"Payment is finalised once you're satisfied.",
		],
	},
];
