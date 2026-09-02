import puppeteer from 'puppeteer';

async function fetchPlayerParamDetails() {
    console.log('🔍 엔도 마모루(No.1)와 고엔지 슈야(No.2) 파라미터 페이지 크롤링 테스트...');
    const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    try {
        const testUrl = 'https://zukan.inazuma.jp/chara_param/?q=hN2ZlpOLmo2gnJeejZ6glpugjIuN3cWk3ZzPzs_Pz8_Oz92igg%3D%3D';
        await page.goto(testUrl, { waitUntil: 'networkidle2', timeout: 30000 });

        const detail = await page.evaluate(() => {
            const name = document.querySelector('.charaName, h1, h2, .name')?.innerText.trim();
            const allElements = Array.from(document.querySelectorAll('*')).map(el => ({
                tag: el.tagName,
                className: el.className,
                text: el.innerText ? el.innerText.trim() : ''
            })).filter(x => x.text && x.text.length < 100);

            // 테이블이나 리스트, 스탯 관련 요소
            const stats = [];
            const rows = document.querySelectorAll('tr, dl, .paramItem, .statusItem, .specItem');
            rows.forEach(r => {
                stats.push(r.innerText.trim().replace(/\n+/g, ' : '));
            });

            return {
                name,
                url: window.location.href,
                pageTitle: document.title,
                stats: stats.slice(0, 30),
                rawBodyText: document.body.innerText
            };
        });

        console.log('📄 페이지 타이틀:', detail.pageTitle);
        console.log('👤 선수 이름:', detail.name);
        console.log('📊 추출된 파라미터/스탯 리스트:\n', detail.stats);
        console.log('📝 전체 본문 내용:\n', detail.rawBodyText);

    } catch (err) {
        console.error('❌ 크롤링 에러:', err.message);
    } finally {
        await browser.close();
    }
}

fetchPlayerParamDetails();
