/**
 * Source images → optimised, deploy-ready assets.
 *
 *   node scripts/optimise-images.mjs
 *
 * Sources live in `images/` (repo only — never deployed, since the Worker
 * serves `public/`). Outputs go to `public/images/`, which does ship.
 *
 * To add a new image: drop it in `images/`, add a MANIFEST entry, re-run.
 * The script is idempotent and fails loudly if an output blows the budget.
 */
import { mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

/** Hard ceiling from the plan's global constraints. */
const MAX_BYTES = 200 * 1024;
/** Muted service-page loops; they load only when scrolled into view. */
const MAX_VIDEO_BYTES = 1.5 * 1024 * 1024;

const SRC_DIR = "images";
const OUT_DIR = path.join("public", "images");

/**
 * `formats` produce <name>.<ext>. `raster` writes a single PNG (icons).
 * `crop` extracts a region before resizing. `duotone` desaturates and washes
 * the result in a brand colour so headline text stays legible over it.
 * `saturation` only tones the colour down; the CSS overlay does the rest.
 *
 * Deliberately NOT included:
 *   - Founder.png  — excluded from the build at the client's request
 *   - hero-bg.png  — depicts Bastuku-branded premises that do not exist; using
 *     it would assert a facility the business may not have. See CLAIMS.md.
 *   - Gemini_Generated_Image_*.png — the old hero: the client's own photo,
 *     upscaled with an AI tool (it also carries another firm's livery and the
 *     tool's watermark, which had to be cropped out). Only 1920px wide after the
 *     crop, so it blurred on phones (CLAIMS #16). Replaced in November 2026.
 * They stay in `images/` as sources; they simply never reach `public/`.
 *
 * The phone photos from November 2026 are not committed (8-10 MB each, and the
 * WhatsApp copies are client media). Keep them in `images/` locally; an entry
 * whose source is missing is skipped, and its committed output stays as it is.
 */
const MANIFEST = [
	// Home hero, from an 8160x3672 phone original, so it stays sharp on a 2x
	// laptop. The portrait crop is for phones, where the landscape frame
	// cropped to a narrow slice was being blown up about five times.
	{
		src: "20260624_092641.jpg",
		name: "hero-packing",
		width: 2400,
		saturation: 0.7,
		quality: 78,
		formats: ["webp"],
	},
	{
		src: "20260624_092641.jpg",
		name: "hero-packing-portrait",
		// 4:5 around the woman packing and the carton behind her.
		crop: { left: 930, top: 0, width: 2940, height: 3672 },
		width: 1170,
		saturation: 0.7,
		quality: 78,
		formats: ["webp"],
	},
	// Named for what they actually show. The plan called these a "team photo";
	// both are container freight operations, so they are used on the freight
	// pages rather than on /how-it-works.
	{
		src: "IMG-20230813-WA0025.jpg",
		name: "container-lift",
		width: 1400,
		formats: ["webp", "avif"],
	},
	// Service photos. WhatsApp copies, so 765-960px wide at most; the phone
	// originals would be sharper if the client still has them.
	{ src: "IMG-20260826-WA0020.jpg", name: "office-equipment-loading", width: 960, formats: ["webp"] },
	{ src: "IMG-20260823-WA0010.jpg", name: "crate-forklift", width: 960, formats: ["webp"] },
	{ src: "WhatsApp Image 2026-11-17 at 09.39.32 (1).jpeg", name: "airport-export-check", width: 960, formats: ["webp"] },
	{ src: "IMG-20260823-WA0025.jpg", name: "machinery-crating", width: 960, formats: ["webp"] },
	{ src: "WhatsApp Image 2026-11-17 at 09.39.33.jpeg", name: "palletised-goods", width: 960, formats: ["webp"] },
	{ src: "IMG-20260823-WA0032.jpg", name: "collection-truck", width: 960, formats: ["webp"] },
	// Poster for public/videos/house-packing.mp4: its first frame, saved by the
	// ffmpeg command in DEVELOPING.md.
	{ src: "house-packing-poster.png", name: "house-packing-poster", width: 720, formats: ["webp"] },
	// Next's file conventions: app/icon.png and app/apple-icon.png are detected
	// automatically and emit the right <link> tags. public/ would not be.
	{ src: "BASTUKU-LOGO1.png", name: "app:icon", width: 512, raster: "png" },
	{ src: "BASTUKU-LOGO1.png", name: "app:apple-icon", width: 180, raster: "png" },
	{
		src: "BASTUKU-LOGO1.png",
		name: "../og",
		width: 1200,
		height: 630,
		raster: "png",
		contain: "#F6F8FA",
	},
];

const kb = (b) => `${(b / 1024).toFixed(1)} KB`;

function hexToRgb(hex) {
	const [r, g, b] = hex.replace("#", "").match(/../g).map((h) => parseInt(h, 16));
	return { r, g, b };
}

async function main() {
	await mkdir(OUT_DIR, { recursive: true });

	const results = [];
	const missing = [];

	for (const entry of MANIFEST) {
		const srcPath = path.join(SRC_DIR, entry.src);
		if (!existsSync(srcPath)) {
			missing.push(entry.src);
			continue;
		}

		let base = sharp(srcPath).rotate(); // honour EXIF orientation
		if (entry.crop) base = base.extract(entry.crop);

		let resized = entry.contain
			? base.resize(entry.width, entry.height, {
					fit: "contain",
					background: entry.contain,
					withoutEnlargement: false,
				})
			: base.resize(entry.width, entry.height, { withoutEnlargement: true });

		if (entry.saturation !== undefined) resized = resized.modulate({ saturation: entry.saturation });

		if (entry.duotone) {
			const { color, opacity, saturation, brightness } = entry.duotone;
			const { r, g, b } = hexToRgb(color);
			const washed = await resized.modulate({ saturation, brightness }).toBuffer();
			const { width: w, height: h } = await sharp(washed).metadata();
			const wash = await sharp({
				create: { width: w, height: h, channels: 4, background: { r, g, b, alpha: opacity } },
			})
				.png()
				.toBuffer();
			resized = sharp(await sharp(washed).composite([{ input: wash }]).toBuffer());
		}

		const formats = entry.raster ? [entry.raster] : entry.formats;

		for (const fmt of formats) {
			// "app:name" targets the app/ directory (Next file conventions);
			// everything else lands in public/images/.
			const outPath = entry.name.startsWith("app:")
				? path.join("app", `${entry.name.slice(4)}.${fmt}`)
				: path.join(OUT_DIR, `${entry.name}.${fmt}`);
			await mkdir(path.dirname(outPath), { recursive: true });

			const pipeline = resized.clone();
			if (fmt === "webp") pipeline.webp({ quality: entry.quality ?? 82 });
			else if (fmt === "avif") pipeline.avif({ quality: 60 });
			else if (fmt === "png") pipeline.png({ compressionLevel: 9, palette: true });

			await pipeline.toFile(outPath);
			const { size } = await stat(outPath);
			const meta = await sharp(outPath).metadata();
			results.push({ outPath, size, w: meta.width, h: meta.height });
		}
	}

	for (const r of results.sort((a, b) => b.size - a.size)) {
		const over = r.size > MAX_BYTES;
		console.log(
			`${over ? "OVER  " : "ok    "} ${r.outPath.padEnd(34)} ${String(`${r.w}x${r.h}`).padEnd(10)} ${kb(r.size)}`
		);
	}

	if (missing.length) {
		console.log(`\nSkipped (source not found): ${missing.join(", ")}`);
	}

	// Budget applies to everything shipped, not just what this run produced.
	const shipped = [];
	const videos = [];
	async function walk(dir) {
		for (const e of await readdir(dir, { withFileTypes: true })) {
			const p = path.join(dir, e.name);
			if (e.isDirectory()) await walk(p);
			else if (/\.(png|jpe?g|webp|avif|gif)$/i.test(e.name)) {
				shipped.push({ p, size: (await stat(p)).size });
			} else if (/\.(mp4|webm|mov)$/i.test(e.name)) {
				videos.push({ p, size: (await stat(p)).size });
			}
		}
	}
	await walk("public");
	// app/icon.png and app/apple-icon.png ship too, so they face the same budget.
	for (const f of ["app/icon.png", "app/apple-icon.png"]) {
		if (existsSync(f)) shipped.push({ p: f, size: (await stat(f)).size });
	}

	const offenders = shipped.filter((f) => f.size > MAX_BYTES);
	const total = shipped.reduce((n, f) => n + f.size, 0);
	console.log(`\npublic/ rasters: ${shipped.length} files, ${kb(total)} total`);

	// Videos are encoded by hand (DEVELOPING.md), so this is the only thing
	// stopping a raw 17 MB phone clip from shipping.
	const heavyVideos = videos.filter((f) => f.size > MAX_VIDEO_BYTES);
	for (const v of videos) console.log(`${v.size > MAX_VIDEO_BYTES ? "OVER  " : "ok    "} ${v.p.padEnd(34)} ${kb(v.size)}`);

	if (offenders.length || heavyVideos.length) {
		if (offenders.length) console.error(`\nFAIL: ${offenders.length} raster(s) exceed the ${kb(MAX_BYTES)} budget:`);
		for (const f of offenders) console.error(`  ${f.p} — ${kb(f.size)}`);
		if (heavyVideos.length) console.error(`\nFAIL: ${heavyVideos.length} video(s) exceed the ${kb(MAX_VIDEO_BYTES)} budget:`);
		for (const f of heavyVideos) console.error(`  ${f.p} — ${kb(f.size)}`);
		process.exit(1);
	}
	console.log(`All rasters within ${kb(MAX_BYTES)}, all videos within ${kb(MAX_VIDEO_BYTES)}.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
