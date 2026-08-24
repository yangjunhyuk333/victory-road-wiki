import fs from 'fs';
import puppeteer from 'puppeteer';
import path from 'path';

const PAGE_URL = 'https://zukan.inazuma.jp/chara_list/';
const TOTAL_PAGES = 1; // Test with 1 page
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/test_characters.json');

async function scrapeZukan() {
    console.log('🚀 Starting official Inazuma Zukan scraper (TEST)...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 800 });
    // Let images load for testing if dataset.src exists or natural src gets loaded
    // Do not intercept images.

    const allCharacters = [];

    for (let i = 1; i <= TOTAL_PAGES; i++) {
        console.log(`\n📄 Scraping page ${i} of ${TOTAL_PAGES}...`);
        try {
            await page.goto(`${PAGE_URL}?page=${i}&per_page=200`, { waitUntil: 'networkidle0', timeout: 60000 });

            // Scroll down a bit to trigger lazy loading if any
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
            await new Promise(r => setTimeout(r, 2000));

            const pageCharacters = await page.evaluate(() => {
                const charas = [];
                const tbodies = document.querySelectorAll('.charaListResult tbody');

                tbodies.forEach(tbody => {
                    const tds = Array.from(tbody.querySelectorAll('td'));
                    if (tds.length < 21) return;

                    const nameCell = tds[2];
                    const imgEl = nameCell.querySelector('img');
                    const imgSrc = imgEl ? (imgEl.getAttribute('dataset-src') || imgEl.src) : null;

                    charas.push({
                        id: tds[1].innerText.trim(),
                        name: nameCell.querySelector('.name')?.innerText.trim() || '',
                        image: imgSrc
                    });
                });
                return charas;
            });

            console.log(`✅ Extracted ${pageCharacters.length} characters from page ${i}.`);
            allCharacters.push(...pageCharacters);

        } catch (error) {
            console.error(`❌ Error scraping page ${i}:`, error.message);
        }
    }

    await browser.close();
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allCharacters, null, 2), 'utf-8');
    console.log(`📁 Saved test data to: ${OUTPUT_FILE}`);
}

scrapeZukan();
