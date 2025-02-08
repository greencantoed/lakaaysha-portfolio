// convert-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Define the input directory (where your PNGs are) and output directory for WebP images.
const inputDir = path.join(__dirname, 'images');
const outputDir = path.join(__dirname, 'images', 'webp');

// Create output directory if it doesn't exist.
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read all files from the input directory.
fs.readdir(inputDir, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    // Check if the file is a PNG.
    if (path.extname(file).toLowerCase() === '.png') {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, path.basename(file, '.png') + '.webp');
      // Convert PNG to WebP with high quality.
      sharp(inputPath)
        .toFormat('webp', { quality: 100 })
        .toFile(outputPath)
        .then(info => console.log(`Converted ${file} to ${path.basename(outputPath)}`))
        .catch(err => console.error(`Error converting ${file}:`, err));
    }
  });
});
