import puppeteer from 'puppeteer';

async function inspectWithUserAgent() {
    console.log('🔍 일반 브라우저 User-Agent로 공식 도감 접속 테스트 중...');
    const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    try {
        const response = await page.goto('https://zukan.inazuma.jp/chara_list/', { waitUntil: 'domcontentloaded', timeout: 30000 });
        console.log('🌐 응답 상태 코드:', response.status());

        await page.waitForSelector('.charaListResult', { timeout: 15000 }).catch(() => null);

        const data = await page.evaluate(() => {
            const tableHeaders = Array.from(document.querySelectorAll('.charaListResult th')).map(th => th.innerText.trim());
            const firstRowCells = Array.from(document.querySelectorAll('.charaListResult tbody tr:first-child td')).map(td => ({
                text: td.innerText.trim(),
                html: td.innerHTML
            }));

            // 파라미터/스탯 관련 버튼이나 링크 검색
            const paramButtons = Array.from(document.querySelectorAll('a, button')).map(el => ({
                tag: el.tagName,
                text: el.innerText.trim(),
                href: el.href || el.getAttribute('onclick') || '',
                className: el.className
            })).filter(item => item.text.includes('パラメータ') || item.text.includes('能力') || item.href.includes('param'));

            return {
                tableHeaders,
                firstRowCells: firstRowCells.slice(0, 15),
                paramButtons: paramButtons.slice(0, 10)
            };
        });

        console.log('📋 테이블 컬럼 헤더:', data.tableHeaders);
        console.log('📊 첫 번째 선수 데이터 샘플:', data.firstRowCells);
        console.log('🔗 스탯/파라미터 관련 버튼/링크:', data.paramButtons);

    } catch (err) {
        console.error('❌ 분석 오류:', err.message);
    } finally {
        await browser.close();
    }
}

inspectWithUserAgent();
