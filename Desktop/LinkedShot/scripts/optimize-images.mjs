
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const examplesDir = path.join(process.cwd(), 'public/examples');

async function convertImages() {
    const files = fs.readdirSync(examplesDir).filter(file => file.endsWith('.png'));

    console.log(`Found ${files.length} PNG images to convert in ${examplesDir}`);

    for (const file of files) {
        const inputPath = path.join(examplesDir, file);
        const outputPath = path.join(examplesDir, file.replace('.png', '.webp'));

        console.log(`Converting ${file} to WebP...`);

        await sharp(inputPath)
            .webp({ quality: 80 })
            .toFile(outputPath);

        console.log(`Converted: ${outputPath}`);
    }
}

convertImages().catch(console.error);
