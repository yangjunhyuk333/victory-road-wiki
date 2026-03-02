import fs from 'fs';
import puppeteer from 'puppeteer';
import path from 'path';

const PAGE_URL = 'https://zukan.inazuma.jp/chara_list/';
const TOTAL_PAGES = 28; // Currently around 5400 characters, 200 per page = ~28 pages
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/characters.json');

async function scrapeZukan() {
    console.log('🚀 Starting official Inazuma Zukan scraper...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Set consistent viewport and block images/fonts if possible to speed up
    await page.setViewport({ width: 1280, height: 800 });
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        const type = req.resourceType();
        if (['image', 'stylesheet', 'font', 'media'].includes(type)) {
            req.abort();
        } else {
            req.continue();
        }
    });

    const allCharacters = [];

    for (let i = 1; i <= TOTAL_PAGES; i++) {
        console.log(`\n📄 Scraping page ${i} of ${TOTAL_PAGES}...`);
        try {
            await page.goto(`${PAGE_URL}?page=${i}&per_page=200`, { waitUntil: 'networkidle2', timeout: 60000 });

            // Wait for the table to appear
            await page.waitForSelector('.charaListResult tbody', { timeout: 10000 }).catch(() => null);

            const pageCharacters = await page.evaluate(() => {
                const charas = [];
                const tbodies = document.querySelectorAll('.charaListResult tbody');

                tbodies.forEach(tbody => {
                    const tds = Array.from(tbody.querySelectorAll('td'));
                    if (tds.length < 21) return;

                    const nameCell = tds[2];
                    const imgEl = nameCell.querySelector('img');
                    const imgSrc = imgEl ? imgEl.src : null;

                    charas.push({
                        id: tds[1].innerText.trim(),
                        name: nameCell.querySelector('.name')?.innerText.trim() || '',
                        kana: nameCell.querySelector('.rubi')?.innerText.trim() || '',
                        image: imgSrc,
                        nickname: tds[3].innerText.trim() || '',
                        series: tds[4].innerText.trim() || '',
                        gender: tds[5].innerText.trim() || '',
                        element: tds[6].innerText.trim() || '',
                        position: tds[7].innerText.trim() || '',
                        category: tds[8]?.innerText.trim() || '',
                        team: tds[11].innerText.trim() || '',
                        description: tds[12].innerText.trim() || '',
                        appearances: tds.slice(13, 22).map(td => td.innerText.trim())
                    });
                });
                return charas;
            });

            console.log(`✅ Extracted ${pageCharacters.length} characters from page ${i}.`);
            allCharacters.push(...pageCharacters);

            // Stop early if a page is empty (meaning we've hit the end)
            if (pageCharacters.length === 0) {
                console.log(`⚠️ Page ${i} is empty. Assuming end of catalog.`);
                break;
            }

            // Small delay to be polite to the server
            await new Promise(r => setTimeout(r, 1000));

        } catch (error) {
            console.error(`❌ Error scraping page ${i}:`, error.message);
        }
    }

    await browser.close();

    console.log(`\n🎉 Scraping finished! Total characters found: ${allCharacters.length}`);

    // Ensure the directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save JSON
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allCharacters, null, 2), 'utf-8');
    console.log(`📁 Saved character data to: ${OUTPUT_FILE}`);
}

scrapeZukan();
