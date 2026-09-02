import puppeteer from 'puppeteer';

async function checkCharaParamPage() {
    console.log('🔍 공식 chara_param 스탯 페이지 분석 중...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
        const testUrl = 'https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPzs_Pz8_Oz92igg%3D%3D';
        await page.goto(testUrl, { waitUntil: 'networkidle2', timeout: 30000 });

        const paramData = await page.evaluate(() => {
            const title = document.querySelector('h1, h2, .charaName, .name')?.innerText.trim();
            const allText = document.body.innerText;
            const paramBlocks = Array.from(document.querySelectorAll('.param, .status, .spec, table, dl, ul')).map(el => ({
                tag: el.tagName,
                className: el.className,
                text: el.innerText.slice(0, 300)
            }));

            return {
                title,
                paramBlocks: paramBlocks.slice(0, 10),
                bodySample: allText.slice(0, 800)
            };
        });

        console.log('👤 대상 캐릭터:', paramData.title);
        console.log('📋 페이지 본문 텍스트 샘플:\n', paramData.bodySample);
        console.log('📊 파라미터 블록:', paramData.paramBlocks);

    } catch (err) {
        console.error('❌ 분석 오류:', err.message);
    } finally {
        await browser.close();
    }
}

checkCharaParamPage();
