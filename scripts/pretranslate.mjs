import fs from 'fs';
import { refineTranslation } from '../src/utils/playerHelpers.js';

// 구글 번역 호출 헬퍼
async function translateText(text) {
  if (!text || text.trim() === '') return '';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=ko&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Status ' + res.status);
  const data = await res.json();
  if (data && data[0]) {
    const raw = data[0].map(item => item[0]).join('');
    return refineTranslation(raw);
  }
  return refineTranslation(text);
}

async function main() {
  console.log('🚀 주요 선수 설명문 사전 번역 시작...');
  const characters = JSON.parse(fs.readFileSync('src/data/characters.json', 'utf8'));

  // 기존 translations.json이 있으면 로드
  let dict = {};
  if (fs.existsSync('src/data/description_translations.json')) {
    try {
      dict = JSON.parse(fs.readFileSync('src/data/description_translations.json', 'utf8'));
    } catch (e) {}
  }

  // 상위 300명 주요 선수 우선 번역 (엔도, 고엔지, 키도, 카제마루 등)
  let count = 0;
  for (let i = 0; i < Math.min(characters.length, 300); i++) {
    const c = characters[i];
    if (!c.description || dict[c.id]) continue;

    try {
      const ko = await translateText(c.description);
      dict[c.id] = ko;
      count++;
      if (count % 20 === 0) {
        console.log(`[${count}] 번역 완료: ${c.name} -> ${ko.slice(0, 20)}...`);
      }
      await new Promise(r => setTimeout(r, 60)); // 레이트 리밋 방지
    } catch (err) {
      console.warn(`선수 ${c.name} 번역 실패:`, err.message);
    }
  }

  fs.writeFileSync('src/data/description_translations.json', JSON.stringify(dict, null, 2), 'utf8');
  console.log(`🎉 사전 번역 저장 완료! 총 ${Object.keys(dict).length}명 데이터베이스 구축됨.`);
}

main();
