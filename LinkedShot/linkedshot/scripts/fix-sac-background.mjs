/**
 * Remplace le fond noir par du blanc #FFFFFF dans sac-apres.png
 * Usage: node scripts/fix-sac-background.mjs
 */
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(__dirname, "../public/photos/sac-apres.png");
const outputPath = inputPath;

// Seuil : en-dessous = considéré comme "noir" et remplacé par blanc
const BLACK_THRESHOLD = 50;

async function main() {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels } = info;
  const c = channels || 4;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * c;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Pixel noir ou très sombre → blanc #FFFFFF
      if (r <= BLACK_THRESHOLD && g <= BLACK_THRESHOLD && b <= BLACK_THRESHOLD) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        if (c === 4) data[i + 3] = 255;
      }
    }
  }

  await sharp(data, {
    raw: {
      width: w,
      height: h,
      channels: c,
    },
  })
    .png()
    .toFile(outputPath);

  console.log("Done: fond noir remplacé par blanc dans", outputPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
