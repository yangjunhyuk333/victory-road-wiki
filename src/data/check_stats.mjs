import fs from 'fs';

const data = JSON.parse(fs.readFileSync('src/data/characters.json', 'utf-8'));
console.log(`Total Characters: ${data.length}`);

const vrCharacters = data.filter(c => c.appearances && c.appearances[8] === '○');
console.log(`Victory Road characters: ${vrCharacters.length}`);

const withRealImage = data.filter(c => c.image && !c.image.includes('icn_secret_character.png') && !c.image.includes('no_image'));
console.log(`Characters with real images: ${withRealImage.length}`);

const vrWithRealImage = vrCharacters.filter(c => c.image && !c.image.includes('icn_secret_character.png') && !c.image.includes('no_image'));
console.log(`VR characters with real images: ${vrWithRealImage.length}`);
