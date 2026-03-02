import { translate } from 'google-translate-api-x';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'src/data/characters.json');
let charas = [];
try {
    charas = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
} catch (e) {
    console.error("No characters.json found!");
    process.exit(1);
}

const ELEMENT_MAP = { '火': '화', '風': '풍', '林': '림', '山': '산', '無': '무', '': '무' };
const GENDER_MAP = { '男': '남', '女': '여', '': '불명' };
const POS_MAP = { 'GK': 'GK', 'DF': 'DF', 'MF': 'MF', 'FW': 'FW', '': '무' };

async function run() {
    console.log(`🚀 Starting translation process for ${charas.length} characters...`);

    // 1. 단어장 매핑 (속성, 성별, 포지션)
    charas = charas.map(c => {
        if (ELEMENT_MAP[c.element]) c.element = ELEMENT_MAP[c.element];
        if (GENDER_MAP[c.gender]) c.gender = GENDER_MAP[c.gender];
        if (POS_MAP[c.position]) c.position = POS_MAP[c.position];
        return c;
    });

    const CHUNK_SIZE = 50; // 배열 입력 최적화 - 한 번에 50명, 즉 150개의 문장을 병렬 처리
    let translatedCount = 0;

    for (let i = 0; i < charas.length; i += CHUNK_SIZE) {
        const chunk = charas.slice(i, i + CHUNK_SIZE);

        // 이미 번역된 청크인지 확인
        if (chunk.every(c => c._translated)) {
            translatedCount += chunk.length;
            continue;
        }

        const texts = [];
        chunk.forEach(c => {
            texts.push(c.name || '-');
            texts.push(c.nickname || '-');
            texts.push(c.description || '-');
        });

        let retries = 3;
        let success = false;

        while (retries > 0 && !success) {
            try {
                const resArray = await translate(texts, { to: 'ko' });

                chunk.forEach((c, idx) => {
                    c.name = resArray[idx * 3].text !== '-' ? resArray[idx * 3].text : '';
                    c.nickname = resArray[idx * 3 + 1].text !== '-' ? resArray[idx * 3 + 1].text : '';
                    c.description = resArray[idx * 3 + 2].text !== '-' ? resArray[idx * 3 + 2].text : '';
                    c._translated = true;
                });

                success = true;
                translatedCount += chunk.length;
                console.log(`✅ Translated ${translatedCount} / ${charas.length} characters...`);
            } catch (e) {
                console.error(`❌ Translation error on chunk ${Math.floor(i / CHUNK_SIZE)}: ${e.message}`);
                retries--;
                console.log(`Retries left: ${retries}. Waiting 5 seconds...`);
                await new Promise(r => setTimeout(r, 5000));
            }
        }

        // 파일 덮어쓰기
        fs.writeFileSync(DATA_FILE, JSON.stringify(charas, null, 2), 'utf-8');

        // 무료 API 차단을 피하기 위한 고의적 딜레이
        await new Promise(r => setTimeout(r, 1500));
    }

    console.log('\n🎉 All translation tasks successfully completed!');
}

run();
