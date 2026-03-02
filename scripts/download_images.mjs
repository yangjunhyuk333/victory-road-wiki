import fs from 'fs';
import path from 'path';
import https from 'https';
import pLimit from 'p-limit';

const DATA_FILE = path.join(process.cwd(), 'src/data/characters.json');
const IMG_DIR = path.join(process.cwd(), 'public/images/characters');

if (!fs.existsSync(IMG_DIR)) {
    fs.mkdirSync(IMG_DIR, { recursive: true });
}

let characters = [];
try {
    characters = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
} catch (e) {
    console.error("No characters.json found!");
    process.exit(1);
}

const limit = pLimit(20); // 20개의 동시 다운로드 허용

function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        if (!url) return resolve(false);
        if (url.startsWith('/')) return resolve(true); // already local
        // if (fs.existsSync(dest)) return resolve(true); // already downloaded (주석 해제 시 이어받기 가능)

        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close(() => resolve(true));
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function run() {
    console.log(`🚀 Starting downloading up to ${characters.length} images...`);
    let count = 0;
    let skipped = 0;

    const tasks = characters.map((char, index) => {
        return limit(async () => {
            if (!char.image || char.image.startsWith('/images/')) {
                skipped++;
                return;
            }

            const ext = path.extname(new URL(char.image).pathname) || '.png';
            // ID가 없는 예외를 위한 인덱스 폴백
            const charId = char.id ? char.id : `unknown_${index}`;
            const filename = `${charId}${ext}`;
            const dest = path.join(IMG_DIR, filename);

            try {
                const downloaded = await downloadImage(char.image, dest);
                if (downloaded) {
                    char.image = `/images/characters/${filename}`;
                    count++;
                    if (count % 200 === 0) console.log(`🔽 Downloaded ${count} / ${characters.length} images...`);
                }
            } catch (e) {
                console.error(`❌ Error downloading image for ${char.name}: ${e.message}`);
            }
        });
    });

    await Promise.all(tasks);

    fs.writeFileSync(DATA_FILE, JSON.stringify(characters, null, 2), 'utf-8');
    console.log(`\n✅ Finished! Successfully mapped ${count} new images to local path.`);
    console.log(`⏭️ Skipped ${skipped} items (already local or no image).`);
}

run();
