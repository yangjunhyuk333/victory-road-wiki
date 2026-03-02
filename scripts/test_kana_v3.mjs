import * as wanakana from 'wanakana';
import { hangulify } from './hangulify_engine.mjs'; // 별도 구현

async function test() {
    const kanas = ['えんどう まもる', 'ごうえんじ しゅうや', 'かぜまる いちろうた', 'かべやま へいごろう', 'はんだ しんいち'];

    kanas.forEach(k => {
        // 1. 가나 -> 로마자 표기
        const romaji = wanakana.toRomaji(k);
        // 2. 로마자 -> 한글 발음 치환 엔진 적용
        const hangul = hangulify(romaji);

        console.log(`${k} -> ${romaji} -> ${hangul}`);
    });
}
test();
