import fs from 'fs';
import path from 'path';
import { refineTranslation } from '../src/utils/playerHelpers.js';

const TRANSLATION_FILE = path.resolve('src/data/description_translations.json');
const CHARACTERS_FILE = path.resolve('src/data/characters.json');

// 단일 텍스트 번역 함수
async function translateText(text) {
  if (!text || !text.trim()) return '';

  // 1순위: Google Translate clients5 chrome-ex
  try {
    const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=ja&tl=ko&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]) {
        const raw = Array.isArray(data[0]) ? data[0].join(' ') : data[0];
        if (raw && /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(raw)) {
          return refineTranslation(raw);
        }
      }
    }
  } catch (e) {}

  // 2순위: MyMemory API Fallback
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ja|ko`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const raw = data?.responseData?.translatedText;
      if (raw && /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(raw)) {
        return refineTranslation(raw);
      }
    }
  } catch (e) {}

  return refineTranslation(text);
}

async function main() {
  console.log('🚀 [5,407명 전수 번역] 데이터베이스 구축 파이프라인 시작...');
  const characters = JSON.parse(fs.readFileSync(CHARACTERS_FILE, 'utf8'));

  // 기존 번역 사전 로드
  let dict = {};
  if (fs.existsSync(TRANSLATION_FILE)) {
    try {
      dict = JSON.parse(fs.readFileSync(TRANSLATION_FILE, 'utf8'));
    } catch (e) {}
  }

  // 고유 일본어 설명문 맵 구축 (key: 일본어 설명, value: ID 배열)
  const uniqueJaMap = new Map();
  characters.forEach(c => {
    if (!c.description || !c.description.trim()) return;
    const ja = c.description.trim();
    if (!uniqueJaMap.has(ja)) {
      uniqueJaMap.set(ja, []);
    }
    uniqueJaMap.get(ja).push(c.id);
  });

  const uniqueJaList = Array.from(uniqueJaMap.keys());
  console.log(`📊 총 선수: ${characters.length}명 / 고유 일본어 설명문: ${uniqueJaList.length}개`);
  console.log(`💾 현재 사전 번역된 문장 수: ${Object.keys(dict).length}개`);

  let translatedCount = 0;
  let skippedCount = 0;
  const batchSize = 10; // 병렬 처리 크기

  for (let i = 0; i < uniqueJaList.length; i += batchSize) {
    const batch = uniqueJaList.slice(i, i + batchSize);
    
    // 번역 필요한 항목만 필터링
    const needed = batch.filter(ja => !dict[ja] || !/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(dict[ja]));
    
    if (needed.length > 0) {
      await Promise.all(
        needed.map(async (ja) => {
          try {
            const ko = await translateText(ja);
            dict[ja] = ko;
            translatedCount++;
          } catch (err) {
            dict[ja] = refineTranslation(ja);
          }
        })
      );

      // 50개마다 진행상황 출력 및 파일 저장
      if (i % 50 === 0 || i + batchSize >= uniqueJaList.length) {
        fs.writeFileSync(TRANSLATION_FILE, JSON.stringify(dict, null, 2), 'utf8');
        const percent = (((i + batch.length) / uniqueJaList.length) * 100).toFixed(1);
        console.log(`⏳ [${percent}%] (${i + batch.length}/${uniqueJaList.length}) 번역 진행 중... (신규 번역: ${translatedCount}개)`);
      }

      // 쿨다운 딜레이 (IP 차단 방지)
      await new Promise(r => setTimeout(r, 80));
    } else {
      skippedCount += batch.length;
    }
  }

  // 최종 사전 저장
  fs.writeFileSync(TRANSLATION_FILE, JSON.stringify(dict, null, 2), 'utf8');
  console.log(`🎉 1단계 고유 설명문 번역 완료! 총 ${Object.keys(dict).length}개 사전 구축 완료.`);

  // 2단계: characters.json에 description_ko 필드 주입
  console.log('🔄 2단계: characters.json에 한국어 번역(description_ko) 전수 주입 중...');
  let injectedCount = 0;
  const updatedCharacters = characters.map(c => {
    if (!c.description || !c.description.trim()) {
      return { ...c, description_ko: '' };
    }
    const ja = c.description.trim();
    const ko = dict[ja] || refineTranslation(ja);
    injectedCount++;
    return {
      ...c,
      description_ko: ko
    };
  });

  fs.writeFileSync(CHARACTERS_FILE, JSON.stringify(updatedCharacters, null, 2), 'utf8');
  console.log(`✨ 5,407명 모든 캐릭터에 description_ko 주입 완료! (총 ${injectedCount}명 완료)`);
}

main().catch(console.error);
