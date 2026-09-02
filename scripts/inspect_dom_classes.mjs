import puppeteer from 'puppeteer';

async function inspectDOMClasses() {
    const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');

    try {
        await page.goto('https://zukan.inazuma.jp/chara_param/?page=1&per_page=5', { waitUntil: 'networkidle2', timeout: 30000 });

        const domStructure = await page.evaluate(() => {
            const containers = Array.from(document.querySelectorAll('section, div, ul, ol')).map(el => ({
                tag: el.tagName,
                className: el.className,
                id: el.id,
                childCount: el.children.length
            })).filter(x => x.className && (x.className.includes('Result') || x.className.includes('List') || x.className.includes('chara') || x.className.includes('param')));

            // 각 캐릭터 아이템 클래스 확인
            const itemClasses = Array.from(document.querySelectorAll('.resultWrap *, .searchResult *, main *')).map(el => el.className).filter(c => c && c.length > 0);

            return {
                containers,
                uniqueClasses: Array.from(new Set(itemClasses)).slice(0, 30)
            };
        });

        console.log('📦 감지된 컨테이너 클래스:', domStructure.containers);
        console.log('🏷️ 고유 클래스명들:\n', domStructure.uniqueClasses);

    } catch (err) {
        console.error('❌ 에러:', err.message);
    } finally {
        await browser.close();
    }
}

inspectDOMClasses();
