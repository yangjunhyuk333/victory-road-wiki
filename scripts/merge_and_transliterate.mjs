import fs from 'fs';
import path from 'path';
import * as wanakana from 'wanakana';
import { hangulify } from './hangulify_engine.mjs';

const FRESH_FILE = path.join(process.cwd(), 'src/data/characters.json');
const BACKUP_FILE = path.join(process.cwd(), 'src/data/characters_backup.json');

let freshCharas = [], backupCharas = [];
try {
    freshCharas = JSON.parse(fs.readFileSync(FRESH_FILE, 'utf-8'));
    backupCharas = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf-8'));
} catch (e) {
    console.error("Error reading JSON files:", e);
    process.exit(1);
}

const backupMap = new Map();
backupCharas.forEach(c => {
    backupMap.set(c.id, c);
});

const ELEMENT_MAP = { '火': '화', '風': '풍', '林': '림', '山': '산', '無': '무', '': '무' };
const GENDER_MAP = { '男': '남', '女': '여', '': '불명' };
const POS_MAP = { 'GK': 'GK', 'DF': 'DF', 'MF': 'MF', 'FW': 'FW', '': '무' };

let fixedCount = 0;

freshCharas.forEach(c => {
    // 1. 번역된 설명문 및 메타 복구
    const backupChar = backupMap.get(c.id);
    if (backupChar && backupChar.description) {
        c.description = backupChar.description;
    }

    // 2. 단어장 매핑 
    if (ELEMENT_MAP[c.element]) c.element = ELEMENT_MAP[c.element];
    if (GENDER_MAP[c.gender]) c.gender = GENDER_MAP[c.gender];
    if (POS_MAP[c.position]) c.position = POS_MAP[c.position];

    // 3. 더빙명 완전히 버리고 오롯이 "100% 히라가나 한글 음독" 적용
    if (c.kana) {
        try {
            const romaji = wanakana.toRomaji(c.kana);
            c.name = hangulify(romaji);
        } catch (e) { }
    }

    if (c.nickname && c.kana) {
        try {
            if (wanakana.isKana(c.nickname)) {
                c.nickname = hangulify(wanakana.toRomaji(c.nickname));
            }
        } catch (e) { }
    }

    fixedCount++;
});

fs.writeFileSync(FRESH_FILE, JSON.stringify(freshCharas, null, 2), 'utf-8');
console.log(`🎉 Finished rewriting ${fixedCount} names with PURE Transliteration!`);
