import puppeteer from 'puppeteer';

async function checkOfficialZukanStats() {
    console.log('🔍 공식 이나즈마 도감 사이트 구조 분석 중...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
        await page.goto('https://zukan.inazuma.jp/chara_list/?page=1&per_page=5', { waitUntil: 'networkidle2', timeout: 30000 });

        const tableInfo = await page.evaluate(() => {
            const headers = Array.from(document.querySelectorAll('.charaListResult th, thead th')).map(th => th.innerText.trim());
            const firstRowTds = Array.from(document.querySelectorAll('.charaListResult tbody tr td')).map(td => ({
                className: td.className,
                text: td.innerText.trim(),
                html: td.innerHTML.slice(0, 100)
            }));
            const links = Array.from(document.querySelectorAll('a')).map(a => a.href).filter(h => h.includes('chara'));

            return {
                headers,
                firstRowTds,
                links: links.slice(0, 5)
            };
        });

        console.log('📋 테이블 헤더 목록:', tableInfo.headers);
        console.log('📋 첫 번째 행 TD 데이터 개수:', tableInfo.firstRowTds.length);
        console.log('📋 첫 번째 행 TD 요약:', tableInfo.firstRowTds.slice(0, 15));
        console.log('🔗 상세 링크 여부:', tableInfo.links);

    } catch (err) {
        console.error('❌ 분석 오류:', err.message);
    } finally {
        await browser.close();
    }
}

checkOfficialZukanStats();
