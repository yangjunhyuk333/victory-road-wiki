import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const CHARACTERS_FILE = path.join(process.cwd(), 'src/data/characters.json');
const TOTAL_PAGES = 28;
const PER_PAGE = 200;

async function crawlAndMergeStats() {
    console.log('🚀 공식 이나즈마 도감 5,400명 공식 스탯(Lv50) & 입수 방법 전수 크롤링 시작...\n');

    if (!fs.existsSync(CHARACTERS_FILE)) {
        console.error('❌ characters.json 파일이 존재하지 않습니다:', CHARACTERS_FILE);
        return;
    }

    // 기존 characters.json 로드
    const rawChars = fs.readFileSync(CHARACTERS_FILE, 'utf-8');
    const characters = JSON.parse(rawChars);
    console.log(`📦 기존 캐릭터 데이터베이스 로드 완료: ${characters.length}명\n`);

    const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    // 불필요한 미디어/폰트 차단하여 초고속 크롤링 수행
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        const type = req.resourceType();
        if (['image', 'media', 'font'].includes(type)) {
            req.abort();
        } else {
            req.continue();
        }
    });

    let globalIndex = 0;
    let successCount = 0;

    for (let p = 1; p <= TOTAL_PAGES; p++) {
        const pageUrl = `https://zukan.inazuma.jp/chara_param/?page=${p}&per_page=${PER_PAGE}`;
        console.log(`📄 [${p}/${TOTAL_PAGES}] 페이지 크롤링 중 (${pageUrl})...`);

        try {
            await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 45000 });

            const pageData = await page.evaluate(() => {
                const items = Array.from(document.querySelectorAll('ul.charaListBox > li'));
                
                return items.map(li => {
                    // 스탯 파싱 (Lv50)
                    const stats = {};
                    const paramLis = Array.from(li.querySelectorAll('ul.param > li'));
                    paramLis.forEach(pLi => {
                        const text = pLi.innerText.trim();
                        const valMatch = text.match(/(\d+)$/);
                        const val = valMatch ? parseInt(valMatch[1], 10) : 0;

                        if (text.includes('キック')) stats.kick = val;
                        if (text.includes('コントロール')) stats.control = val;
                        if (text.includes('テクニック')) stats.technique = val;
                        if (text.includes('プレッシャー')) {
                            stats.pressure = val;
                            stats.guard = val; // 가드로도 병합
                        }
                        if (text.includes('フィジカル')) stats.physical = val;
                        if (text.includes('アジリティ')) {
                            stats.agility = val;
                            stats.speed = val; // 스피드로도 병합
                        }
                        if (text.includes('インテリジェンス')) stats.intelligence = val;
                    });

                    // 입수 방법 파싱
                    const rawText = li.innerText;
                    const universeMatch = rawText.match(/プレイヤーズユニバース([^\n]+)/);
                    const chronicleMatch = rawText.match(/クロニクル対戦ルート([^\n]+)/);
                    const freeMatch = rawText.match(/フリー対戦([^\n]+)/);

                    // 포지션 및 속성
                    const posMatch = rawText.match(/ポジション\s*([A-Z]+)/);
                    const elemMatch = rawText.match(/属性\s*([^\s]+)/);

                    return {
                        position: posMatch ? posMatch[1].trim() : '',
                        element: elemMatch ? elemMatch[1].trim() : '',
                        stats,
                        obtain: {
                            universe: universeMatch ? universeMatch[1].trim() : '',
                            chronicle: chronicleMatch ? chronicleMatch[1].trim() : '',
                            free: freeMatch ? freeMatch[1].trim() : ''
                        }
                    };
                });
            });

            console.log(`   👉 ${pageData.length}명 스탯 데이터 추출 성공`);

            // 기존 characters.json 순서대로 매합
            pageData.forEach((item) => {
                if (globalIndex < characters.length) {
                    const targetChar = characters[globalIndex];
                    
                    // 공식 스탯 데이터 주입
                    targetChar.stats = {
                        kick: item.stats.kick || 80,
                        control: item.stats.control || 80,
                        technique: item.stats.technique || 80,
                        guard: item.stats.guard || 80,
                        pressure: item.stats.pressure || 80,
                        physical: item.stats.physical || 80,
                        speed: item.stats.speed || 80,
                        agility: item.stats.agility || 80,
                        intelligence: item.stats.intelligence || 80,
                        stamina: Math.round(((item.stats.physical || 80) + (item.stats.agility || 80)) / 2) // 체력 계산
                    };

                    // 입수 방법 주입
                    targetChar.obtain = item.obtain;

                    // 만약 포지션이나 속성이 비어있었다면 보강
                    if (!targetChar.position && item.position) targetChar.position = item.position;
                    if (!targetChar.element && item.element) targetChar.element = item.element;

                    globalIndex++;
                    successCount++;
                }
            });

            if (pageData.length === 0) {
                console.log(`⚠️ 페이지 ${p}에 데이터가 없습니다. 크롤링을 종료합니다.`);
                break;
            }

            // 서버 부하 방지를 위한 짧은 딜레이
            await new Promise(r => setTimeout(r, 600));

        } catch (err) {
            console.error(`❌ [${p}/${TOTAL_PAGES}] 페이지 크롤링 오류:`, err.message);
        }
    }

    await browser.close();

    console.log(`\n🎉 크롤링 및 데이터 병합 완료! 총 ${successCount}명의 공식 스탯이 주입되었습니다.`);

    // 백업 생성
    const backupFile = path.join(process.cwd(), 'src/data/characters_backup_before_stats.json');
    fs.writeFileSync(backupFile, rawChars, 'utf-8');
    console.log(`💾 원본 데이터 백업 완료: ${backupFile}`);

    // 최종 병합 데이터 저장
    fs.writeFileSync(CHARACTERS_FILE, JSON.stringify(characters, null, 2), 'utf-8');
    console.log(`💾 공식 스탯이 주입된 최신 characters.json 저장 완료!\n`);
}

crawlAndMergeStats();
