import puppeteer from 'puppeteer';
import fs from 'fs';

async function testParseParamDOM() {
    console.log('🔍 공식 chara_param 정밀 셀렉터 추출 테스트...');
    const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    try {
        await page.goto('https://zukan.inazuma.jp/chara_param/?page=1&per_page=5', { waitUntil: 'networkidle2', timeout: 30000 });

        const result = await page.evaluate(() => {
            const players = [];
            // 각 캐릭터 박스 탐색
            const boxes = document.querySelectorAll('.charaParamBox, .charaListResult tbody tr, .charaParamItem');
            
            // 본문에서 각 캐릭터 단위 추출
            const tables = document.querySelectorAll('.charaListResult');
            const tbodies = document.querySelectorAll('.charaListResult tbody');

            // 전체 파싱 테스트
            const parsedList = [];
            tbodies.forEach((tbody, idx) => {
                const text = tbody.innerText;
                const nameEl = tbody.querySelector('.name, .charaName');
                const name = nameEl ? nameEl.innerText.trim() : '';
                const kanaEl = tbody.querySelector('.rubi');
                const kana = kanaEl ? kanaEl.innerText.trim() : '';

                // 스탯 파싱
                const stats = {};
                const statBlocks = tbody.querySelectorAll('div, tr, td, dl, li');
                
                // 정규식이나 키워드로 스탯 추출
                const fullText = tbody.innerText;
                const kickMatch = fullText.match(/キック\s*(?:Lv50)?\s*(\d+)/);
                const controlMatch = fullText.match(/コントロール\s*(?:Lv50)?\s*(\d+)/);
                const techMatch = fullText.match(/テクニック\s*(?:Lv50)?\s*(\d+)/);
                const pressMatch = fullText.match(/プレッシャー\s*(?:Lv50)?\s*(\d+)/);
                const physMatch = fullText.match(/フィジカル\s*(?:Lv50)?\s*(\d+)/);
                const agilMatch = fullText.match(/アジリティ\s*(?:Lv50)?\s*(\d+)/);
                const intelMatch = fullText.match(/インテリジェンス\s*(?:Lv50)?\s*(\d+)/);

                // 입수 방법 파싱
                let obtain = {};
                const obtainMatch = fullText.match(/入手方法\s*([\s\S]*?)(?:ポジション|属性|キック)/);
                if (obtainMatch) {
                    obtain.raw = obtainMatch[1].trim();
                }

                parsedList.push({
                    name,
                    kana,
                    stats: {
                        kick: kickMatch ? parseInt(kickMatch[1], 10) : null,
                        control: controlMatch ? parseInt(controlMatch[1], 10) : null,
                        technique: techMatch ? parseInt(techMatch[1], 10) : null,
                        pressure: pressMatch ? parseInt(pressMatch[1], 10) : null,
                        guard: pressMatch ? parseInt(pressMatch[1], 10) : null, // 가드로도 매핑
                        physical: physMatch ? parseInt(physMatch[1], 10) : null,
                        agility: agilMatch ? parseInt(agilMatch[1], 10) : null,
                        speed: agilMatch ? parseInt(agilMatch[1], 10) : null, // 스피드로도 매핑
                        intelligence: intelMatch ? parseInt(intelMatch[1], 10) : null
                    },
                    obtain: obtain.raw || ''
                });
            });

            return {
                tbodiesCount: tbodies.length,
                firstParsed: parsedList.slice(0, 5)
            };
        });

        console.log('✅ 파싱 결과 (첫 5명):\n', JSON.stringify(result, null, 2));

    } catch (err) {
        console.error('❌ 에러:', err.message);
    } finally {
        await browser.close();
    }
}

testParseParamDOM();
