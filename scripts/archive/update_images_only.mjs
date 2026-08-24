import fs from 'fs';
import puppeteer from 'puppeteer';
import path from 'path';

const PAGE_URL = 'https://zukan.inazuma.jp/chara_list/';
const TOTAL_PAGES = 28; // Currently ~5400 characters, 200 per page = ~28 pages
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/characters.json');
const BACKUP_FILE = path.join(process.cwd(), 'src/data/characters_backup.json');

async function scrapeImagesOnly() {
    console.log('🚀 Starting image update scraper...');

    // Load existing data
    let existingData = [];
    if (fs.existsSync(OUTPUT_FILE)) {
        try {
            existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
            // Create backup first
            fs.writeFileSync(BACKUP_FILE, JSON.stringify(existingData, null, 2), 'utf-8');
            console.log(`✅ Loaded ${existingData.length} existing characters. Backup created.`);
        } catch (e) {
            console.error("Failed to parse existing characters.json!", e);
            process.exit(1);
        }
    } else {
        console.error("No characters.json found to update!");
        process.exit(1);
    }

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const newImagesMap = new Map();

    for (let i = 1; i <= TOTAL_PAGES; i++) {
        console.log(`\n📄 Scraping page ${i} of ${TOTAL_PAGES}...`);
        try {
            await page.goto(`${PAGE_URL}?page=${i}&per_page=200`, { waitUntil: 'networkidle0', timeout: 60000 });

            // Scroll multiple times to trigger all lazy-loaded images
            for (let s = 0; s < 5; s++) {
                await page.evaluate(() => window.scrollBy(0, 1000));
                await new Promise(r => setTimeout(r, 500));
            }
            await new Promise(r => setTimeout(r, 2000));

            const pageImages = await page.evaluate(() => {
                const map = [];
                const tbodies = document.querySelectorAll('.charaListResult tbody');

                tbodies.forEach(tbody => {
                    const tds = Array.from(tbody.querySelectorAll('td'));
                    if (tds.length < 21) return;

                    const idStr = tds[1].innerText.trim();
                    const nameCell = tds[2];
                    const imgEl = nameCell.querySelector('img');

                    // Prefer dataset-src if image hasn't fully loaded, fallback to src
                    const imgSrc = imgEl ? (imgEl.getAttribute('data-src') || imgEl.getAttribute('dataset-src') || imgEl.src) : null;

                    map.push({ id: idStr, image: imgSrc });
                });
                return map;
            });

            console.log(`✅ Extracted ${pageImages.length} image sets from page ${i}.`);

            // Populate the map
            pageImages.forEach(item => {
                if (item.id && item.image) {
                    newImagesMap.set(item.id, item.image);
                }
            });

            // Stop early if a page is empty
            if (pageImages.length === 0) {
                console.log(`⚠️ Page ${i} is empty. Assumed end.`);
                break;
            }

        } catch (error) {
            console.error(`❌ Error scraping page ${i}:`, error.message);
        }
    }

    await browser.close();

    console.log(`\n🎉 Scraping finished! Updating ${newImagesMap.size} image URLs...`);

    let updateCount = 0;

    // Merge updates into existing data (preserve names, translations, properties)
    const updatedData = existingData.map(char => {
        if (char.id && newImagesMap.has(char.id)) {
            const newImageSrc = newImagesMap.get(char.id);
            // check if it is a real image URL
            if (newImageSrc && newImageSrc.startsWith('http') && !newImageSrc.includes('icn_secret_character.png') && !newImageSrc.includes('no_image')) {
                char.image = newImageSrc;
                updateCount++;
            }
        }
        return char;
    });

    // Save JSON
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(updatedData, null, 2), 'utf-8');
    console.log(`📁 Successfully updated ${updateCount} images! Data saved to: ${OUTPUT_FILE}`);
}

scrapeImagesOnly();
