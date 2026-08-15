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

const SRC_DIR = "images";
const OUT_DIR = path.join("public", "images");

/**
 * `formats` produce <name>.<ext>. `raster` writes a single PNG (icons).
 * `crop` extracts a region before resizing. `duotone` desaturates and washes
 * the result in a brand colour so headline text stays legible over it.
 *
 * Deliberately NOT included:
 *   - Founder.png  — excluded from the build at the client's request
 *   - hero-bg.png  — depicts Bastuku-branded premises that do not exist; using
 *     it would assert a facility the business may not have. See CLAIMS.md.
 * They stay in `images/` as sources; they simply never reach `public/`.
 */
const MANIFEST = [
	// The source frame carries another firm's livery ("kwexports.co.za") on the
	// cab at left and a generator watermark at bottom-right. The crop removes
	// both; do not widen it without re-checking those two corners.
	{
		src: "Gemini_Generated_Image_9f8jd9f8jd9f8jd9.png",
		name: "hero-yard",
		crop: { left: 480, top: 200, width: 2170, height: 1100 },
		width: 1920,
		duotone: { color: "#072248", opacity: 0.45, saturation: 0.3, brightness: 0.95 },
		formats: ["webp", "avif"],
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
	{
		src: "IMG-20230813-WA0019.jpg",
		name: "crated-consignment",
		width: 1400,
		formats: ["webp", "avif"],
	},
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
			if (fmt === "webp") pipeline.webp({ quality: 82 });
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
	async function walk(dir) {
		for (const e of await readdir(dir, { withFileTypes: true })) {
			const p = path.join(dir, e.name);
			if (e.isDirectory()) await walk(p);
			else if (/\.(png|jpe?g|webp|avif|gif)$/i.test(e.name)) {
				shipped.push({ p, size: (await stat(p)).size });
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

	if (offenders.length) {
		console.error(`\nFAIL: ${offenders.length} file(s) exceed the ${kb(MAX_BYTES)} budget:`);
		for (const f of offenders) console.error(`  ${f.p} — ${kb(f.size)}`);
		process.exit(1);
	}
	console.log(`All rasters within the ${kb(MAX_BYTES)} budget.`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
