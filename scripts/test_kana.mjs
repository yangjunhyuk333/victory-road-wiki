import { translate } from 'google-translate-api-x';

async function test() {
    const kanas = ['えんどう まもる', 'ごうえんじ しゅうや', 'かぜまる いちろうた', 'かべやま へいごろう'];
    try {
        const res = await translate(kanas, { to: 'ko' });
        console.log(res.map(r => r.text));
    } catch (e) {
        console.error(e);
    }
}
test();
