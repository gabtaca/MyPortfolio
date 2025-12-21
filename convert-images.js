const sharp = require('sharp');

const files = ['portrait_desktop.png', 'portrait_desktop-darrkmode.png'];

files.forEach(async (file) => {
  try {
    await sharp(`public/images/${file}`)
      .webp({ quality: 85 })
      .toFile(`public/images/${file.replace('.png', '.webp')}`);
    console.log(`✅ Converted ${file} to WebP`);
  } catch (error) {
    console.error(`❌ Error converting ${file}:`, error);
  }
});
