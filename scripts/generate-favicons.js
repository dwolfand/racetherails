const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

async function generateFavicons() {
  const inputFile = path.join(
    process.cwd(),
    "public/images/logos/WMATA_Metro_Logo.svg.png"
  );
  const outputDir = path.join(process.cwd(), "public");

  // Ensure the output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Generate different sizes
  const sizes = {
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
    "apple-touch-icon.png": 180,
    "favicon.ico": 32,
  };

  for (const [filename, size] of Object.entries(sizes)) {
    await sharp(inputFile)
      .resize(size, size)
      .toFile(path.join(outputDir, filename));
  }

  console.log("Favicons generated successfully!");
}

generateFavicons().catch(console.error);
