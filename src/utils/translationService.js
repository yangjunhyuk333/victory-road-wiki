import { refineTranslation } from './playerHelpers.js';

// 로컬 스토리지 캐시 키 접두사
const CACHE_PREFIX = 'inazuma_trans_v1_';

/**
 * 🌐 다중 번역 엔진을 활용한 초고속 & 안정적 일-한 번역 서비스
 * 1) 로컬 캐시 확인 -> 2) 구글 번역 -> 3) MyMemory API -> 4) 정제 필터 적용
 */
export async function translateJaToKo(text, cacheKey = null) {
  if (!text || text.trim() === '') return '';

  // 이미 한글이 포함된 경우 바로 반환
  if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text)) {
    return refineTranslation(text);
  }

  // 1. 로컬 스토리지 캐시 확인
  const key = cacheKey ? `${CACHE_PREFIX}${cacheKey}` : `${CACHE_PREFIX}${encodeURIComponent(text.substring(0, 30))}`;
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      return cached;
    }
  } catch (e) {
    // localStorage 접근 제한 무시
  }

  let translated = '';

  // 2. 1순위: Google Translate 무료 엔드포인트
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=ko&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data && data[0]) {
        translated = data[0].map(item => item[0]).join('');
      }
    }
  } catch (err) {
    console.warn('[Translate] Google engine failed, trying fallback...');
  }

  // 3. 2순위: MyMemory Translation API (Fallback)
  if (!translated) {
    try {
      const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ja|ko`;
      const res = await fetch(myMemoryUrl);
      if (res.ok) {
        const data = await res.json();
        if (data && data.responseData && data.responseData.translatedText) {
          translated = data.responseData.translatedText;
        }
      }
    } catch (err) {
      console.warn('[Translate] MyMemory fallback failed...');
    }
  }

  // 4. 번역 결과가 없으면 원본 반환
  if (!translated) {
    return refineTranslation(text);
  }

  // 5. 이나즈마 전용 어휘 사전 정제
  const refined = refineTranslation(translated);

  // 6. 캐시 저장
  try {
    localStorage.setItem(key, refined);
  } catch (e) {}

  return refined;
}
