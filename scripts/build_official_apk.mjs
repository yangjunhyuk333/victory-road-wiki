import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 [1/6] 정식 안드로이드 APK 빌드 환경 설정 중...');

const JBR_BIN = 'C:\\Program Files\\Android\\Android Studio\\jbr\\bin';
const JAVAC = path.join(JBR_BIN, 'javac.exe');
const KEYTOOL = path.join(JBR_BIN, 'keytool.exe');
const JAVA = path.join(JBR_BIN, 'java.exe');

const SDK_DIR = 'C:\\Users\\cucun\\AppData\\Local\\Android\\Sdk';
const BUILD_TOOLS = path.join(SDK_DIR, 'build-tools', '36.0.0');
const AAPT2 = path.join(BUILD_TOOLS, 'aapt2.exe');
const D8 = path.join(BUILD_TOOLS, 'd8.bat');
const ZIPALIGN = path.join(BUILD_TOOLS, 'zipalign.exe');
const APKSIGNER = path.join(BUILD_TOOLS, 'apksigner.bat');
const ANDROID_JAR = path.join(SDK_DIR, 'platforms\\android-36.1\\android.jar');

const WORK_DIR = path.resolve('temp_android_build');
if (fs.existsSync(WORK_DIR)) fs.rmSync(WORK_DIR, { recursive: true, force: true });
fs.mkdirSync(WORK_DIR, { recursive: true });

const srcDir = path.join(WORK_DIR, 'src', 'com', 'inazumastation', 'app');
const resDir = path.join(WORK_DIR, 'res');
const resValues = path.join(resDir, 'values');
const resMipmap = path.join(resDir, 'mipmap-xxxhdpi');
const assetsDir = path.join(WORK_DIR, 'assets', 'www');
const binDir = path.join(WORK_DIR, 'bin');
const objDir = path.join(WORK_DIR, 'obj');

fs.mkdirSync(srcDir, { recursive: true });
fs.mkdirSync(resValues, { recursive: true });
fs.mkdirSync(resMipmap, { recursive: true });
fs.mkdirSync(assetsDir, { recursive: true });
fs.mkdirSync(binDir, { recursive: true });
fs.mkdirSync(objDir, { recursive: true });

// 1. AndroidManifest.xml
const manifestContent = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.inazumastation.app"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-sdk android:minSdkVersion="24" android:targetSdkVersion="34" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:allowBackup="true"
        android:hardwareAccelerated="true"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen"
        android:usesCleartextTraffic="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
fs.writeFileSync(path.join(WORK_DIR, 'AndroidManifest.xml'), manifestContent, 'utf8');

// 2. strings.xml
fs.writeFileSync(path.join(resValues, 'strings.xml'), '<resources><string name="app_name">이나즈마 스테이션</string></resources>', 'utf8');

// 3. Icon
if (fs.existsSync('public/logo.png')) {
    fs.copyFileSync('public/logo.png', path.join(resMipmap, 'ic_launcher.png'));
}

// 4. MainActivity.java (하드웨어 가속 풀스크린 WebView)
const mainActivityJava = `package com.inazumastation.app;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.Window;
import android.view.WindowManager;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);

        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("https://yangjunhyuk333.github.io/victory-road-wiki/");
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}`;
fs.writeFileSync(path.join(srcDir, 'MainActivity.java'), mainActivityJava, 'utf8');

// 5. Assets 복사
console.log('📦 [2/6] 웹 에셋 패키징 중...');
function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) return;
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        for (const file of fs.readdirSync(src)) {
            copyRecursive(path.join(src, file), path.join(dest, file));
        }
    } else {
        fs.copyFileSync(src, dest);
    }
}
copyRecursive('dist', assetsDir);

// 6. AAPT2 리소스 컴파일
console.log('🔨 [3/6] AAPT2 리소스 컴파일 및 링크 중...');
execSync(`"${AAPT2}" compile --dir "${resDir}" -o "${path.join(WORK_DIR, 'compiled_res.zip')}"`, { stdio: 'inherit' });
execSync(`"${AAPT2}" link -I "${ANDROID_JAR}" --manifest "${path.join(WORK_DIR, 'AndroidManifest.xml')}" "${path.join(WORK_DIR, 'compiled_res.zip')}" -A "${path.join(WORK_DIR, 'assets')}" -o "${path.join(WORK_DIR, 'base.apk')}" --java "${path.join(WORK_DIR, 'src')}" --auto-add-overlay`, { stdio: 'inherit' });

// 7. Java 소스 코드 컴파일 (javac)
console.log('☕ [4/6] Java 컴파일 (javac)...');
const javaFiles = [
    path.join(srcDir, 'MainActivity.java'),
    path.join(srcDir, 'R.java')
].filter(f => fs.existsSync(f));

execSync(`"${JAVAC}" -cp "${ANDROID_JAR}" -d "${objDir}" -source 1.8 -target 1.8 ${javaFiles.map(f => `"${f}"`).join(' ')}`, { stdio: 'inherit' });

// 8. Dalvik 바이트코드 변환 (d8 -> classes.dex)
console.log('⚡ [5/6] Dalvik 바이트코드 생성 (d8 -> classes.dex)...');
const classFiles = [];
function findClasses(dir) {
    for (const f of fs.readdirSync(dir)) {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) findClasses(full);
        else if (f.endsWith('.class')) classFiles.push(full);
    }
}
findClasses(objDir);

const env = { ...process.env, JAVA_HOME: 'C:\\Program Files\\Android\\Android Studio\\jbr', PATH: `${JBR_BIN};${process.env.PATH}` };
execSync(`"${D8}" --lib "${ANDROID_JAR}" --output "${binDir}" ${classFiles.map(f => `"${f}"`).join(' ')}`, { stdio: 'inherit', env });

// 9. classes.dex를 base.apk에 추가 (aapt.exe 또는 zip)
const AAPT = path.join(BUILD_TOOLS, 'aapt.exe');
execSync(`"${AAPT}" add "${path.join(WORK_DIR, 'base.apk')}" classes.dex`, { cwd: binDir, stdio: 'inherit' });

// 10. Zipalign (4바이트 정렬)
console.log('📐 [6/6] Zipalign 및 정식 디지털 서명 (apksigner v1/v2/v3)...');
const unalignedApk = path.join(WORK_DIR, 'base.apk');
const alignedApk = path.join(WORK_DIR, 'aligned.apk');
execSync(`"${ZIPALIGN}" -f -p 4 "${unalignedApk}" "${alignedApk}"`, { stdio: 'inherit' });

// 11. 릴리즈 키스토어 생성 및 APK 서명
const keystorePath = path.join(WORK_DIR, 'release.keystore');
if (!fs.existsSync(keystorePath)) {
    execSync(`"${KEYTOOL}" -genkeypair -v -keystore "${keystorePath}" -alias inazuma -keyalg RSA -keysize 2048 -validity 10000 -storepass inazuma123 -keypass inazuma123 -dname "CN=InazumaStation, OU=Mobile, O=VictoryRoad, L=Seoul, ST=Seoul, C=KR"`, { stdio: 'inherit' });
}

const finalApkPath = path.resolve('public', 'downloads', 'InazumaStation.apk');
if (!fs.existsSync(path.dirname(finalApkPath))) fs.mkdirSync(path.dirname(finalApkPath), { recursive: true });

execSync(`"${APKSIGNER}" sign --ks "${keystorePath}" --ks-pass pass:inazuma123 --ks-key-alias inazuma --key-pass pass:inazuma123 --out "${finalApkPath}" "${alignedApk}"`, { stdio: 'inherit', env });

// 서명 검증
execSync(`"${APKSIGNER}" verify -v "${finalApkPath}"`, { stdio: 'inherit', env });

// public 루트에도 복사
fs.copyFileSync(finalApkPath, path.resolve('public', 'InazumaStation.apk'));

console.log('🎉 정식 서명된 안드로이드 APK 생성 완료!');
console.log('👉 산출물 파일: ' + finalApkPath);
