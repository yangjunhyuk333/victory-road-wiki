import fs from 'fs';

async function fetchZukan() {
    try {
        console.log('Fetching zukan data...');
        const res = await fetch('https://zukan.inazuma.jp/chara_list/?per_page=200');
        const body = await res.text();
        fs.writeFileSync('temp_zukan.html', body);
        console.log('Saved HTML. Length:', body.length);

        // Check for inline JSON objects that might contain the characters
        const jsonMatches = body.match(/\{"id":\d+,"name":".*?"\}/g);
        if (jsonMatches) {
            console.log('Found individual character JSON fragments! Sample:');
            console.log(jsonMatches.slice(0, 3));
        } else {
            console.log('Individual JSON fragments not found.');
        }
    } catch (e) {
        console.error(e);
    }
}
fetchZukan();
