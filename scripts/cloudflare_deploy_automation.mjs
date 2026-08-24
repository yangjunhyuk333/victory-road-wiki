import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function automateCloudflareLogin() {
    console.log('🚀 [1/4] Puppeteer 브라우저 기동 중...');
    const browser = await puppeteer.launch({
        headless: false, // 사용자 화면에서도 보이도록 하거나 브라우저 띄우기
        defaultViewport: { width: 1280, height: 800 },
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        console.log('🌐 [2/4] Cloudflare 로그인 페이지 접속 중...');
        await page.goto('https://dash.cloudflare.com/login', { waitUntil: 'networkidle2', timeout: 60000 });

        console.log('📝 [3/4] 이메일 및 비밀번호 입력 중...');
        // 이메일 입력창 찾기
        await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 15000 });
        await page.type('input[type="email"], input[name="email"]', 'yangjunhyuk3640@gmail.com', { delay: 50 });

        // 비밀번호 입력창 찾기
        await page.waitForSelector('input[type="password"], input[name="password"]', { timeout: 15000 });
        await page.type('input[type="password"], input[name="password"]', 'yjh364007@', { delay: 50 });

        // 스크린샷 캡처
        await page.screenshot({ path: 'cf_login_step.png' });

        // 로그인 버튼 클릭
        console.log('🔑 [4/4] 로그인 제출 중...');
        const submitBtn = await page.$('button[type="submit"]');
        if (submitBtn) {
            await submitBtn.click();
        }

        // 5초 대기 후 상태 확인
        await new Promise(r => setTimeout(r, 6000));
        await page.screenshot({ path: 'cf_after_login.png' });
        console.log('📸 로그인 진행 상태 스크린샷 저장 완료 (cf_after_login.png)');
        console.log('👉 현재 URL:', page.url());

    } catch (err) {
        console.error('❌ 자동화 에러:', err.message);
    }
}

automateCloudflareLogin();
