import https from 'https';

https.get('https://zukan.inazuma.jp/chara_list/', (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        const matches = rawData.match(/<img[^>]+>/g);
        if (matches) {
            console.log("Found img tags:");
            console.log(matches.slice(0, 10).join('\n'));
        }
    });
});
