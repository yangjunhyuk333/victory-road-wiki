export function hangulify(romaji) {
    const romajiToHangul = {
        'a': '아', 'i': '이', 'u': '우', 'e': '에', 'o': '오',
        'ka': '카', 'ki': '키', 'ku': '쿠', 'ke': '케', 'ko': '코',
        'sa': '사', 'shi': '시', 'su': '스', 'se': '세', 'so': '소',
        'ta': '타', 'chi': '치', 'tsu': '츠', 'te': '테', 'to': '토',
        'na': '나', 'ni': '니', 'nu': '누', 'ne': '네', 'no': '노',
        'ha': '하', 'hi': '히', 'fu': '후', 'he': '헤', 'ho': '호',
        'ma': '마', 'mi': '미', 'mu': '무', 'me': '메', 'mo': '모',
        'ya': '야', 'yu': '유', 'yo': '요',
        'ra': '라', 'ri': '리', 'ru': '루', 're': '레', 'ro': '로',
        'wa': '와', 'wo': '오', 'n': 'ㄴ',
        'ga': '가', 'gi': '기', 'gu': '구', 'ge': '게', 'go': '고',
        'za': '자', 'ji': '지', 'zu': '즈', 'ze': '제', 'zo': '조',
        'da': '다', 'de': '데', 'do': '도',
        'ba': '바', 'bi': '비', 'bu': '부', 'be': '베', 'bo': '보',
        'pa': '파', 'pi': '피', 'pu': '푸', 'pe': '페', 'po': '포',
        'kya': '캬', 'kyu': '큐', 'kyo': '쿄',
        'sha': '샤', 'shu': '슈', 'sho': '쇼',
        'cha': '차', 'chu': '추', 'cho': '초',
        'nya': '냐', 'nyu': '뉴', 'nyo': '뇨',
        'hya': '햐', 'hyu': '휴', 'hyo': '효',
        'mya': '먀', 'myu': '뮤', 'myo': '묘',
        'rya': '랴', 'ryu': '류', 'ryo': '료',
        'gya': '갸', 'gyu': '규', 'gyo': '교',
        'ja': '자', 'ju': '주', 'jo': '조',
        'bya': '뱌', 'byu': '뷰', 'byo': '뵤',
        'pya': '퍄', 'pyu': '퓨', 'pyo': '표',
        '-': 'ー'
    };

    const words = romaji.toLowerCase()
        .replace(/'/g, '') // n'ichi -> nichi
        .replace(/ou/g, 'o') // 엔도우 -> 엔도, 키도우 -> 키도
        .replace(/uu/g, 'u') // 유우토 -> 유토, 슈우야 -> 슈야
        .replace(/oo/g, 'o') // 오오야마 -> 오야마
        .split(' ');
    let result = [];

    for (let word of words) {
        let hangulWord = '';
        let i = 0;
        while (i < word.length) {
            if (i + 2 < word.length && romajiToHangul[word.substring(i, i + 3)]) {
                hangulWord += romajiToHangul[word.substring(i, i + 3)];
                i += 3;
            }
            else if (i + 1 < word.length && romajiToHangul[word.substring(i, i + 2)]) {
                hangulWord += romajiToHangul[word.substring(i, i + 2)];
                i += 2;
            }
            else if (i + 1 < word.length && word[i] === word[i + 1] && ['k', 's', 't', 'p', 'c'].includes(word[i])) {
                hangulWord += 'ㅅ';
                i++;
            }
            else if (word[i] === 'n' && (i + 1 === word.length || !['a', 'i', 'u', 'e', 'o', 'y'].includes(word[i + 1]))) {
                hangulWord += 'ㄴ';
                i++;
            }
            else if (romajiToHangul[word[i]]) {
                hangulWord += romajiToHangul[word[i]];
                i++;
            }
            else {
                hangulWord += word[i];
                i++;
            }
        }

        // 초중종성 합성 처리
        let combined = '';
        for (let j = 0; j < hangulWord.length; j++) {
            if (hangulWord[j] === 'ㄴ' && j > 0 && isHangulSyllableWithoutJongsung(combined[combined.length - 1])) {
                combined = combined.slice(0, -1) + addJongsung(combined[combined.length - 1], 4);
            }
            else if (hangulWord[j] === 'ㅅ' && j > 0 && isHangulSyllableWithoutJongsung(combined[combined.length - 1])) {
                combined = combined.slice(0, -1) + addJongsung(combined[combined.length - 1], 19);
            }
            else {
                combined += hangulWord[j];
            }
        }
        result.push(combined);
    }

    return result.join(' ');
}

function isHangulSyllableWithoutJongsung(char) {
    if (!char) return false;
    const code = char.charCodeAt(0);
    if (code < 0xAC00 || code > 0xD7A3) return false;
    return (code - 0xAC00) % 28 === 0;
}

function addJongsung(char, jongsungIndex) {
    const code = char.charCodeAt(0);
    return String.fromCharCode(code + jongsungIndex);
}
