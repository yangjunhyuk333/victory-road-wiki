import puppeteer from 'puppeteer';

async function checkIndexMapping() {
    const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');

    try {
        await page.goto('https://zukan.inazuma.jp/chara_param/?page=1&per_page=20', { waitUntil: 'networkidle2', timeout: 30000 });

        const namesWithAttributes = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('ul.charaListBox > li'));
            return items.map((li, idx) => {
                const rawText = li.innerText;
                const posMatch = rawText.match(/ポジション\s*([A-Z]+)/);
                const elemMatch = rawText.match(/属性\s*([^\s]+)/);
                const descMatch = rawText.match(/登場作品：\s*([^\n]+)\n\n([\s\S]*?)\n\n入手方法/);

                // 이름 추출
                const nameBox = li.querySelector('.nameBox, figure + p, .charaName');
                const rawName = nameBox ? nameBox.innerText : li.querySelector('p')?.innerText || '';

                return {
                    index: idx + 1,
                    position: posMatch ? posMatch[1] : '',
                    element: elemMatch ? elemMatch[1] : '',
                    series: descMatch ? descMatch[1].trim() : '',
                    descriptionSample: descMatch ? descMatch[2].trim().slice(0, 30) : ''
                };
            });
        });

        console.log('📋 첫 10명 순서 및 속성 검증:\n', namesWithAttributes.slice(0, 10));

    } catch (err) {
        console.error('❌ 에러:', err.message);
    } finally {
        await browser.close();
    }
}

checkIndexMapping();
