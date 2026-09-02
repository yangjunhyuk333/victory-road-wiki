import puppeteer from 'puppeteer';

async function testParamPagination() {
    console.log('🔍 공식 chara_param 200명 단위 페이지네이션 크롤링 테스트...');
    const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    try {
        await page.goto('https://zukan.inazuma.jp/chara_param/?page=1&per_page=10', { waitUntil: 'networkidle2', timeout: 30000 });

        const extractedPlayers = await page.evaluate(() => {
            const results = [];
            // 각 선수별 블록 파싱
            const cards = document.querySelectorAll('.charaListResult tbody, .paramListResult tbody, .resultItem, .charaParamItem, table tbody');
            
            // 또는 테이블 행들 파싱
            const rows = Array.from(document.querySelectorAll('tbody tr, .charaParamBox, .chara-box, .chara-card'));
            
            // 본문에서 캐릭터 블록들 찾기
            const allHtml = document.body.innerHTML;

            return {
                cardsCount: cards.length,
                rowsCount: rows.length,
                sampleHtml: allHtml.slice(0, 1500)
            };
        });

        console.log('📊 파싱 감지 개수:', extractedPlayers.cardsCount, extractedPlayers.rowsCount);

    } catch (err) {
        console.error('❌ 에러:', err.message);
    } finally {
        await browser.close();
    }
}

testParamPagination();
