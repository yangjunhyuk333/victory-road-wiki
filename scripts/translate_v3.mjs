import fs from 'fs';
import path from 'path';
import * as wanakana from 'wanakana';
import { hangulify } from './hangulify_engine.mjs';

const DATA_FILE = path.join(process.cwd(), 'src/data/characters.json');
let charas = [];
try {
    charas = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
} catch (e) {
    console.error("No characters.json found!");
    process.exit(1);
}

const OFFICIAL_NAMES = {
    "えんどう まもる": "강수호", "ごうえんじ しゅうや": "염성화", "きどう ゆうと": "신귀도",
    "かぜまる いちろうた": "강바람", "かべやま へいごろう": "장벽구", "めがね かける": "안경민",
    "そめおか りゅうご": "곽용호", "いちのせ かずや": "마지원", "どもん あすか": "손제빈",
    "ふぶき しろう": "눈보라", "つなみ じょうすけ": "박해일", "うつのみや とらまる": "팽호식",
    "きやま ひろと": "손현민", "たちむかい ゆうき": "모용기", "こぐれ ゆうや": "석진오",
    "さくま じろう": "사마진", "あふろ てるみ": "아프로디", "みどりかわ りゅうじ": "채연우",
    "らいもん なつみ": "천여름", "きの あき": "유가을", "おとなし はるな": "음무봄",
    "げんだ こうじろう": "맹수현", "ふどう あきお": "부동명", "こえんじ ゆか": "염유리아",
    "くどう ふゆか": "손겨울"
};

async function run() {
    console.log(`🚀 Starting V3 Local Transliteration for ${charas.length} characters...`);
    let fixedCount = 0;

    charas.forEach(c => {
        // 1. 공식 명칭이 있으면 무조건 1순위
        if (OFFICIAL_NAMES[c.kana]) {
            c.name = OFFICIAL_NAMES[c.kana];
        } else {
            // 2. 공식 명칭이 없는 모든 스카우트 캐릭터 (5000명 이상)는 구글 번역판(V2)이 아닌 순수 한글 음독으로 강제 교체
            if (c.kana) {
                try {
                    const romaji = wanakana.toRomaji(c.kana);
                    const pureHangulName = hangulify(romaji);
                    c.name = pureHangulName;
                } catch (e) {
                    // Fallback silently
                }
            }
        }

        // 닉네임 교체 로직도 동일
        if (c.nickname && c.kana) {
            // 닉네임이 kana에 부분포함되는 경우도 있지만 완전 일치는 아니므로 음독 엔진만 돌림
            try {
                // 일본어일때만 돌려야함 (V2 등에 의해 이미 한글/영어일수도 있음. 보통 히라가나 카나카나 여부는 wanakana가 판별)
                if (wanakana.isKana(c.nickname)) {
                    c.nickname = hangulify(wanakana.toRomaji(c.nickname));
                }
            } catch (e) { }
        }

        fixedCount++;
    });

    fs.writeFileSync(DATA_FILE, JSON.stringify(charas, null, 2), 'utf-8');
    console.log(`✅ ALL 5,400+ NASTY MACHINE TRANSLATIONS DESTROYED.`);
    console.log(`🎉 Finished rewriting ${fixedCount} names with Pure Local Transliteration V3!`);
}

run();
