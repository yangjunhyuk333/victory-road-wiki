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

// 나무위키 교차 검증 추출 기반 공식 더빙명 딕셔너리
const OFFICIAL_NAMES = {
    "えんどう まもる": "강수호", "ごうえんじ しゅうや": "염성화", "きどう ゆうと": "신귀도",
    "かぜまる いちろうた": "강바람", "かべやま へいごろう": "장벽구", "めがね かける": "안경민",
    "そめおか りゅうご": "곽용호", "いちのせ かずや": "마지원", "どもん あすか": "손제빈",
    "ふぶき しろう": "눈보라", "つなみ じょうすけ": "박해일", "うつのみや とらまる": "팽호식",
    "きやま ひろと": "손현민", "たちむかい ゆうき": "모용기", "こぐれ ゆうや": "석진오",
    "さくま じろう": "사마진", "あふろ てるみ": "아프로디", "みどりかわ りゅうじ": "채연우",
    "らいもん なつみ": "천여름", "きの あき": "유가을", "おとなし はるな": "음무봄",
    "げんだ こうじろう": "맹수현", "ふどう あきお": "부동명"
};

const ELEMENT_MAP = { '火': '화', '風': '풍', '林': '림', '山': '산', '無': '무', '': '무' };
const GENDER_MAP = { '男': '남', '女': '여', '': '불명' };
const POS_MAP = { 'GK': 'GK', 'DF': 'DF', 'MF': 'MF', 'FW': 'FW', '': '무' };

async function run() {
    console.log(`🚀 Starting V2 Hybrid Translation for ${charas.length} characters...`);

    // 1. 매핑 기초 설정 (속성, 성별 등) 및 초기 훼손명 복원 처리
    charas = charas.map(c => {
        if (ELEMENT_MAP[c.element]) c.element = ELEMENT_MAP[c.element];
        if (GENDER_MAP[c.gender]) c.gender = GENDER_MAP[c.gender];
        if (POS_MAP[c.position]) c.position = POS_MAP[c.position];

        // 이전에 번역이 완료된 경우도 'name'은 한자가 구글 자동번역기로 오염되었을 확률이 매우 큼
        // 따라서 V2 플래그가 없는 경우 이름 복원 처리가 필요함
        return c;
    });

    const CHUNK_SIZE = 50;
    let translatedCount = 0;

    for (let i = 0; i < charas.length; i += CHUNK_SIZE) {
        const chunk = charas.slice(i, i + CHUNK_SIZE);

        // 이미 V2 번역 알고리즘을 거친 애들은 패스
        if (chunk.every(c => c._translatedV2)) {
            translatedCount += chunk.length;
            continue;
        }

        const textsToTranslate = [];
        const metaMap = [];

        chunk.forEach((c, idx) => {
            // 1순위: 공식 더빙명 딕셔너리
            let finalName = '';
            if (OFFICIAL_NAMES[c.kana]) {
                finalName = OFFICIAL_NAMES[c.kana];
            }

            // 오염된 이름, 별명, 설명을 위해 V2에서는 재번역 요청 리스트에 채움
            // 만약 딕셔너리에 없으면 kana 를 구글 번역기에 던져서 자연스러운 한글 음독(Transliteration) 추출
            textsToTranslate.push(finalName ? "-" : c.kana || '-');
            textsToTranslate.push(c.description || '-');

            metaMap.push({ charaDef: c, hasOfficialName: !!finalName, officialName: finalName });
        });

        let retries = 3;
        let success = false;

        while (retries > 0 && !success) {
            try {
                const resArray = await translate(textsToTranslate, { to: 'ko' });

                metaMap.forEach((meta, idx) => {
                    const chara = meta.charaDef;
                    const translatedKanaName = resArray[idx * 2].text;
                    const translatedDesc = resArray[idx * 2 + 1].text;

                    // 이름 교체: 공식 명칭이 있으면 그걸 쓰고, 없으면 일본어 카나 번역 결과를 씁니다!
                    chara.name = meta.hasOfficialName ? meta.officialName : (translatedKanaName !== '-' ? translatedKanaName : chara.name);
                    chara.description = translatedDesc !== '-' ? translatedDesc : chara.description;
                    chara._translated = true;
                    chara._translatedV2 = true; // V2 보정 완료 마스크
                });

                success = true;
                translatedCount += chunk.length;
                console.log(`✅ Fixed & Translated ${translatedCount} / ${charas.length} characters (V2)...`);
            } catch (e) {
                console.error(`❌ Translation error on V2 chunk ${Math.floor(i / CHUNK_SIZE)}: ${e.message}`);
                retries--;
                console.log(`Retries left: ${retries}. Waiting 5 seconds...`);
                await new Promise(r => setTimeout(r, 5000));
            }
        }

        // 파일 로컬 저장 
        fs.writeFileSync(DATA_FILE, JSON.stringify(charas, null, 2), 'utf-8');

        // 안정성 부여 대기 
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log('\n🎉 All V2 High-Quality translation tasks successfully completed!');
}

run();
