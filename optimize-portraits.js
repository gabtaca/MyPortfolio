const sharp = require('sharp');
const fs = require('fs');

const files = ['portrait_desktop.webp', 'portrait_desktop-darrkmode.webp'];

console.log('🖼️  Optimisation des images portrait...\n');

async function optimizeImages() {
  for (const file of files) {
    try {
      const inputPath = `public/images/${file}`;
      const outputPath = `public/images/${file.replace('.webp', '-optimized.webp')}`;
      
      // Obtenir la taille originale
      const originalStats = fs.statSync(inputPath);
      const originalSizeKB = (originalStats.size / 1024).toFixed(2);
      
      // Optimiser l'image
      await sharp(inputPath)
        .resize(800, 1000, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .webp({ 
          quality: 65,
          effort: 6 // Plus d'effort pour une meilleure compression
        })
        .toFile(outputPath);
      
      // Obtenir la nouvelle taille
      const newStats = fs.statSync(outputPath);
      const newSizeKB = (newStats.size / 1024).toFixed(2);
      const reduction = ((1 - newStats.size / originalStats.size) * 100).toFixed(1);
      
      console.log(`✅ ${file}`);
      console.log(`   Original: ${originalSizeKB} KB`);
      console.log(`   Optimisé: ${newSizeKB} KB`);
      console.log(`   Réduction: ${reduction}%`);
      console.log(`   Sauvegardé: ${outputPath}\n`);
    } catch (error) {
      console.error(`❌ Erreur pour ${file}:`, error.message);
    }
  }
  
  console.log('\n💡 Une fois vérifié, renommez les fichiers optimisés pour remplacer les originaux:');
  console.log('   Move-Item -Force public/images/portrait_desktop-optimized.webp public/images/portrait_desktop.webp');
  console.log('   Move-Item -Force public/images/portrait_desktop-darrkmode-optimized.webp public/images/portrait_desktop-darrkmode.webp');
}

optimizeImages().catch(console.error);
