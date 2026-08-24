/**
 * 📱 OS 및 디바이스 자동 감지 유틸리티
 * 접속자의 User-Agent와 화면/터치 특성을 분석하여
 * 갤럭시(Android), 아이폰(iOS), 아이패드(iPadOS), 윈도우(Windows), 맥(macOS) 등을 판별합니다.
 */

export function detectDeviceOS() {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return {
            os: 'unknown',
            deviceType: 'desktop',
            displayName: '기타 기기',
            icon: 'laptop',
            isMobile: false,
            isTablet: false,
            isDesktop: true
        };
    }

    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    const platform = navigator.platform || '';
    const maxTouchPoints = navigator.maxTouchPoints || 0;
    const width = window.innerWidth || (typeof screen !== 'undefined' ? screen.width : 1024);

    // 1. 아이패드 (iPadOS) 감지 (iPad 문자열 포함 또는 터치 지원 Mac Intel)
    const isIPad = /iPad/i.test(ua) || (/Macintosh/i.test(ua) && maxTouchPoints > 1);

    // 2. 아이폰 (iOS) 감지
    const isIPhone = /iPhone|iPod/i.test(ua);

    // 3. 안드로이드 / 갤럭시 감지
    const isAndroid = /Android/i.test(ua);

    // 4. 윈도우 PC 감지
    const isWindows = /Windows|Win32|Win64/i.test(ua) || /Win/i.test(platform);

    // 5. 맥 (macOS) 감지 (터치가 없는 일반 Mac)
    const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/i.test(ua) && maxTouchPoints <= 1;

    // 디바이스 세부 분류 (스마트폰 vs 태블릿 vs 데스크톱)
    let os = 'unknown';
    let deviceType = 'desktop';
    let displayName = '기타 기기';
    let icon = 'laptop';
    let isMobile = false;
    let isTablet = false;
    let isDesktop = false;

    if (isIPad) {
        os = 'ipados';
        deviceType = 'tablet';
        displayName = 'iPad (iPadOS)';
        icon = 'tablet';
        isTablet = true;
    } else if (isIPhone) {
        os = 'ios';
        deviceType = 'mobile';
        displayName = 'iPhone (iOS)';
        icon = 'smartphone';
        isMobile = true;
    } else if (isAndroid) {
        os = 'android';
        // 안드로이드 태블릿 vs 폰 구분 (폭 768px 이상이거나 'Mobile' 키워드가 없는 경우 태블릿)
        const isAndroidTablet = !/Mobile/i.test(ua) || width >= 768;
        if (isAndroidTablet) {
            deviceType = 'tablet';
            displayName = 'Galaxy Tab / Android 태블릿';
            icon = 'tablet';
            isTablet = true;
        } else {
            deviceType = 'mobile';
            displayName = 'Galaxy / Android 스마트폰';
            icon = 'smartphone';
            isMobile = true;
        }
    } else if (isWindows) {
        os = 'windows';
        deviceType = 'desktop';
        displayName = 'Windows PC';
        icon = 'monitor';
        isDesktop = true;
    } else if (isMac) {
        os = 'macos';
        deviceType = 'desktop';
        displayName = 'Mac (macOS)';
        icon = 'laptop';
        isDesktop = true;
    } else {
        os = 'other';
        deviceType = width < 768 ? 'mobile' : 'desktop';
        displayName = '데스크톱 / 웹 브라우저';
        icon = 'globe';
        if (width < 768) isMobile = true;
        else isDesktop = true;
    }

    return {
        os,
        deviceType,
        displayName,
        icon,
        isMobile,
        isTablet,
        isDesktop,
        rawUserAgent: ua
    };
}
