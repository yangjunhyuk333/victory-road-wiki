import puppeteer from 'puppeteer';

async function inspectListParamButtons() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
        await page.goto('https://zukan.inazuma.jp/chara_list/?page=1&per_page=5', { waitUntil: 'networkidle2', timeout: 30000 });

        const buttonDetails = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('a')).map(a => ({
                text: a.innerText.trim(),
                href: a.href,
                className: a.className,
                onClick: a.getAttribute('onclick'),
                dataset: Object.assign({}, a.dataset)
            }));
            const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
                text: b.innerText.trim(),
                className: b.className,
                dataset: Object.assign({}, b.dataset)
            }));

            return {
                paramAnchors: anchors.filter(a => a.href.includes('param') || a.text.includes('パラメータ') || a.text.includes('能力')),
                allAnchorsSample: anchors.slice(0, 15),
                buttons: buttons.slice(0, 10)
            };
        });

        console.log('🔗 파라미터 관련 링크 목록:\n', buttonDetails.paramAnchors);
        console.log('🔘 버튼 목록:\n', buttonDetails.buttons);

    } catch (err) {
        console.error('❌ 분석 오류:', err.message);
    } finally {
        await browser.close();
    }
}

inspectListParamButtons();
