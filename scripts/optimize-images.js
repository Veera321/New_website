const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

async function optimizeImage(filePath) {
  try {
    console.log(`Optimizing: ${path.basename(filePath)}`);
    
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    if (!metadata) {
      console.log(`Skipping ${path.basename(filePath)}: Unable to read metadata`);
      return;
    }

    const outputPath = filePath.replace(/\.[^.]+$/, '.webp');
    
    if (metadata.width > 1200) {
      await image
        .resize(1200, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
    } else {
      await image
        .webp({ quality: 80 })
        .toFile(outputPath);
    }
    
    // Only delete the original if the new file was created successfully
    if (outputPath !== filePath) {
      await fs.access(outputPath);
      await fs.unlink(filePath);
    }
    
    console.log(`Successfully optimized: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Error optimizing ${path.basename(filePath)}:`, error.message);
  }
}

async function optimizeImages(directory) {
  try {
    const files = await fs.readdir(directory);
    
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = await fs.stat(filePath);
      
      if (stats.isDirectory()) {
        await optimizeImages(filePath);
      } else if (IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase())) {
        await optimizeImage(filePath);
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error.message);
  }
}

// Create the public directory if it doesn't exist
fs.mkdir(PUBLIC_DIR, { recursive: true }).catch(console.error);

optimizeImages(PUBLIC_DIR)
  .then(() => console.log('Image optimization complete!'))
  .catch(console.error);
