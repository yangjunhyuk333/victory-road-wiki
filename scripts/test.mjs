import { translate } from 'google-translate-api-x';

async function test() {
    try {
        const res = await translate(['hello', 'world'], { to: 'ko' });
        console.log(Array.isArray(res));
        console.log(res.length);
        console.log(res[0].text);
        console.log(res[1].text);
    } catch (e) {
        console.error(e);
    }
}
test();
