import puppeteer from 'puppeteer';

async function testCharaListBoxParser() {
    const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');

    try {
        await page.goto('https://zukan.inazuma.jp/chara_param/?page=1&per_page=5', { waitUntil: 'networkidle2', timeout: 30000 });

        const parsed = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('ul.charaListBox > li'));
            
            return items.map(li => {
                const name = li.querySelector('.name')?.innerText.trim() || '';
                const kana = li.querySelector('.rubi')?.innerText.trim() || '';
                const nickname = li.querySelector('.nickname')?.innerText.trim() || '';
                const desc = li.querySelector('.description')?.innerText.trim() || '';
                const series = li.querySelector('.appearances, .series')?.innerText.trim() || '';
                const position = li.querySelector('.position, .pos')?.innerText.trim() || '';
                const element = li.querySelector('.element, .attr')?.innerText.trim() || '';

                // 스탯 파싱
                const stats = {};
                const paramLis = Array.from(li.querySelectorAll('ul.param > li'));
                paramLis.forEach(pLi => {
                    const text = pLi.innerText.trim();
                    const valMatch = text.match(/(\d+)$/);
                    const val = valMatch ? parseInt(valMatch[1], 10) : null;

                    if (text.includes('キック')) stats.kick = val;
                    if (text.includes('コントロール')) stats.control = val;
                    if (text.includes('テクニック')) stats.technique = val;
                    if (text.includes('プレッシャー')) {
                        stats.pressure = val;
                        stats.guard = val; // 가드/방어력으로도 매핑
                    }
                    if (text.includes('フィジカル')) stats.physical = val;
                    if (text.includes('アジリティ')) {
                        stats.agility = val;
                        stats.speed = val; // 민첩/스피드로도 매핑
                    }
                    if (text.includes('インテリジェンス')) stats.intelligence = val;
                });

                // 입수 방법 파싱
                const obtainEl = li.querySelector('.obtain, .howToGet, .getRoute, .route');
                const rawText = li.innerText;
                
                // 별자리 (플레이어즈 유니버스)
                const universeMatch = rawText.match(/プレイヤーズユニバース([^\n]+)/);
                // 대전 루트
                const chronicleMatch = rawText.match(/クロニクル対戦ルート([^\n]+)/);
                // 프리 대전
                const freeMatch = rawText.match(/フリー対戦([^\n]+)/);

                return {
                    name,
                    kana,
                    nickname,
                    position,
                    element,
                    stats,
                    obtain: {
                        universe: universeMatch ? universeMatch[1].trim() : null,
                        chronicle: chronicleMatch ? chronicleMatch[1].trim() : null,
                        free: freeMatch ? freeMatch[1].trim() : null
                    },
                    rawSample: rawText.slice(0, 200)
                };
            });
        });

        console.log('🎉 파싱 결과 (첫 5명):\n', JSON.stringify(parsed, null, 2));

    } catch (err) {
        console.error('❌ 에러:', err.message);
    } finally {
        await browser.close();
    }
}

testCharaListBoxParser();
