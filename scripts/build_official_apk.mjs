import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 [1/6] 100% 안드로이드 순수 네이티브 APK 빌드 시작...');

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
const resLayout = path.join(resDir, 'layout');
const resValues = path.join(resDir, 'values');
const resDrawable = path.join(resDir, 'drawable');
const resMipmap = path.join(resDir, 'mipmap-xxxhdpi');
const assetsDir = path.join(WORK_DIR, 'assets');
const binDir = path.join(WORK_DIR, 'bin');
const objDir = path.join(WORK_DIR, 'obj');

fs.mkdirSync(srcDir, { recursive: true });
fs.mkdirSync(resLayout, { recursive: true });
fs.mkdirSync(resValues, { recursive: true });
fs.mkdirSync(resDrawable, { recursive: true });
fs.mkdirSync(resMipmap, { recursive: true });
fs.mkdirSync(assetsDir, { recursive: true });
fs.mkdirSync(binDir, { recursive: true });
fs.mkdirSync(objDir, { recursive: true });

// ==========================================
// 1. AndroidManifest.xml (멀티 액티비티 네이티브 앱)
// ==========================================
const manifestContent = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.inazumastation.app"
    android:versionCode="2"
    android:versionName="2.0.0">

    <uses-sdk android:minSdkVersion="24" android:targetSdkVersion="34" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:allowBackup="true"
        android:hardwareAccelerated="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustPan"
            android:configChanges="orientation|screenSize|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <activity
            android:name=".PlayerDetailActivity"
            android:exported="false"
            android:configChanges="orientation|screenSize|keyboardHidden" />

    </application>
</manifest>`;
fs.writeFileSync(path.join(WORK_DIR, 'AndroidManifest.xml'), manifestContent, 'utf8');

// ==========================================
// 2. XML Values & Styles & Colors
// ==========================================
const stringsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">이나즈마 스테이션</string>
    <string name="tab_players">선수 도감</string>
    <string name="tab_moves">필살기</string>
    <string name="tab_info">정보</string>
    <string name="search_hint">선수 이름 / 속성 / 포지션 검색...</string>
    <string name="btn_original_ja">🇯🇵 일어 원문 보기</string>
    <string name="btn_translated_ko">🇰🇷 한국어 번역 보기</string>
    <string name="back">뒤로</string>
</resources>`;
fs.writeFileSync(path.join(resValues, 'strings.xml'), stringsXml, 'utf8');

const colorsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="bg_dark">#0F172A</color>
    <color name="bg_card">#1E293B</color>
    <color name="bg_card_light">#334155</color>
    <color name="gold_primary">#F59E0B</color>
    <color name="gold_glow">#FBBF24</color>
    <color name="cyan_accent">#06B6D4</color>
    <color name="text_white">#F8FAFC</color>
    <color name="text_muted">#94A3B8</color>
    <color name="border_subtle">#334155</color>
    
    <!-- 속성 컬러 -->
    <color name="elem_wind">#0284C7</color>
    <color name="elem_fire">#E11D48</color>
    <color name="elem_earth">#D97706</color>
    <color name="elem_wood">#16A34A</color>
    <color name="elem_void">#64748B</color>
    
    <!-- 포지션 컬러 -->
    <color name="pos_gk">#EAB308</color>
    <color name="pos_df">#3B82F6</color>
    <color name="pos_mf">#10B981</color>
    <color name="pos_fw">#EF4444</color>
</resources>`;
fs.writeFileSync(path.join(resValues, 'colors.xml'), colorsXml, 'utf8');

const stylesXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="@android:style/Theme.Material.NoActionBar">
        <item name="android:windowBackground">@color/bg_dark</item>
        <item name="android:colorPrimary">@color/bg_dark</item>
        <item name="android:colorPrimaryDark">#090D16</item>
        <item name="android:colorAccent">@color/gold_primary</item>
        <item name="android:textColorPrimary">@color/text_white</item>
        <item name="android:textColorSecondary">@color/text_muted</item>
    </style>
</resources>`;
fs.writeFileSync(path.join(resValues, 'styles.xml'), stylesXml, 'utf8');

// ==========================================
// 3. XML Drawables
// ==========================================
fs.writeFileSync(path.join(resDrawable, 'bg_card.xml'), `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#1E293B" />
    <corners android:radius="14dp" />
    <stroke android:width="1dp" android:color="#334155" />
</shape>`, 'utf8');

fs.writeFileSync(path.join(resDrawable, 'bg_card_gold.xml'), `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#1E293B" />
    <corners android:radius="14dp" />
    <stroke android:width="1.5dp" android:color="#F59E0B" />
</shape>`, 'utf8');

fs.writeFileSync(path.join(resDrawable, 'bg_search.xml'), `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#1E293B" />
    <corners android:radius="10dp" />
    <stroke android:width="1dp" android:color="#475569" />
</shape>`, 'utf8');

fs.writeFileSync(path.join(resDrawable, 'bg_badge_generic.xml'), `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#334155" />
    <corners android:radius="6dp" />
</shape>`, 'utf8');

fs.writeFileSync(path.join(resDrawable, 'bg_btn_gold.xml'), `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#D97706" />
    <corners android:radius="8dp" />
</shape>`, 'utf8');

// ==========================================
// 4. XML Layouts
// ==========================================

// activity_main.xml
const activityMainXml = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="@color/bg_dark">

    <!-- 상단 네이티브 헤더 툴바 -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:background="#090D16"
        android:padding="12dp">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="horizontal"
            android:gravity="center_vertical">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="⚡"
                android:textSize="22sp"
                android:layout_marginEnd="8dp" />

            <TextView
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1"
                android:text="이나즈마 스테이션"
                android:textColor="@color/gold_glow"
                android:textSize="18sp"
                android:textStyle="bold" />

            <TextView
                android:id="@+id/tv_player_count"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="5,407명"
                android:textColor="@color/cyan_accent"
                android:textSize="12sp"
                android:background="@drawable/bg_badge_generic"
                android:paddingLeft="8dp"
                android:paddingRight="8dp"
                android:paddingTop="3dp"
                android:paddingBottom="3dp" />
        </LinearLayout>

        <!-- 네이티브 실시간 검색창 -->
        <EditText
            android:id="@+id/et_search"
            android:layout_width="match_parent"
            android:layout_height="42dp"
            android:layout_marginTop="10dp"
            android:background="@drawable/bg_search"
            android:hint="@string/search_hint"
            android:textColorHint="@color/text_muted"
            android:textColor="@color/text_white"
            android:textSize="14sp"
            android:paddingStart="12dp"
            android:paddingEnd="12dp"
            android:singleLine="true"
            android:imeOptions="actionSearch" />

        <!-- 속성 필터 칩 (가로 스크롤) -->
        <HorizontalScrollView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:scrollbars="none">

            <LinearLayout
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:orientation="horizontal">

                <Button
                    android:id="@+id/btn_filter_all"
                    android:layout_width="wrap_content"
                    android:layout_height="32dp"
                    android:text="전체"
                    android:textColor="#FFFFFF"
                    android:textSize="11sp"
                    android:background="@drawable/bg_btn_gold"
                    android:layout_marginEnd="6dp"
                    android:minWidth="48dp"
                    android:paddingLeft="10dp"
                    android:paddingRight="10dp" />

                <Button
                    android:id="@+id/btn_filter_wind"
                    android:layout_width="wrap_content"
                    android:layout_height="32dp"
                    android:text="🌪️ 풍(風)"
                    android:textColor="#FFFFFF"
                    android:textSize="11sp"
                    android:background="@drawable/bg_badge_generic"
                    android:layout_marginEnd="6dp"
                    android:paddingLeft="10dp"
                    android:paddingRight="10dp" />

                <Button
                    android:id="@+id/btn_filter_fire"
                    android:layout_width="wrap_content"
                    android:layout_height="32dp"
                    android:text="🔥 화(火)"
                    android:textColor="#FFFFFF"
                    android:textSize="11sp"
                    android:background="@drawable/bg_badge_generic"
                    android:layout_marginEnd="6dp"
                    android:paddingLeft="10dp"
                    android:paddingRight="10dp" />

                <Button
                    android:id="@+id/btn_filter_earth"
                    android:layout_width="wrap_content"
                    android:layout_height="32dp"
                    android:text="⛰️ 산(山)"
                    android:textColor="#FFFFFF"
                    android:textSize="11sp"
                    android:background="@drawable/bg_badge_generic"
                    android:layout_marginEnd="6dp"
                    android:paddingLeft="10dp"
                    android:paddingRight="10dp" />

                <Button
                    android:id="@+id/btn_filter_wood"
                    android:layout_width="wrap_content"
                    android:layout_height="32dp"
                    android:text="🌲 림(林)"
                    android:textColor="#FFFFFF"
                    android:textSize="11sp"
                    android:background="@drawable/bg_badge_generic"
                    android:paddingLeft="10dp"
                    android:paddingRight="10dp" />
            </LinearLayout>
        </HorizontalScrollView>
    </LinearLayout>

    <!-- 초고속 네이티브 리스트뷰 -->
    <ListView
        android:id="@+id/list_players"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1"
        android:divider="#1E293B"
        android:dividerHeight="1dp"
        android:padding="8dp"
        android:clipToPadding="false"
        android:scrollbars="vertical"
        android:fastScrollEnabled="true" />

</LinearLayout>`;
fs.writeFileSync(path.join(resLayout, 'activity_main.xml'), activityMainXml, 'utf8');

// item_player.xml
const itemPlayerXml = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="horizontal"
    android:background="@drawable/bg_card"
    android:padding="10dp"
    android:layout_marginBottom="6dp"
    android:gravity="center_vertical">

    <!-- 선수 이미지 -->
    <ImageView
        android:id="@+id/iv_player_thumb"
        android:layout_width="52dp"
        android:layout_height="52dp"
        android:background="#090D16"
        android:scaleType="fitCenter"
        android:layout_marginEnd="12dp" />

    <!-- 선수 정보 영역 -->
    <LinearLayout
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_weight="1"
        android:orientation="vertical">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="horizontal"
            android:gravity="center_vertical">

            <TextView
                android:id="@+id/tv_player_name"
                android:layout_width="0dp"
                android:layout_height="wrap_content"
                android:layout_weight="1"
                android:text="엔도 마모루"
                android:textColor="@color/text_white"
                android:textSize="15sp"
                android:textStyle="bold"
                android:singleLine="true" />

            <!-- 포지션 뱃지 -->
            <TextView
                android:id="@+id/tv_player_pos"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="GK"
                android:textColor="#FFFFFF"
                android:textSize="10sp"
                android:textStyle="bold"
                android:background="@drawable/bg_badge_generic"
                android:paddingStart="6dp"
                android:paddingEnd="6dp"
                android:paddingTop="2dp"
                android:paddingBottom="2dp"
                android:layout_marginEnd="4dp" />

            <!-- 속성 뱃지 -->
            <TextView
                android:id="@+id/tv_player_element"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="산"
                android:textColor="#FFFFFF"
                android:textSize="10sp"
                android:textStyle="bold"
                android:background="@drawable/bg_badge_generic"
                android:paddingStart="6dp"
                android:paddingEnd="6dp"
                android:paddingTop="2dp"
                android:paddingBottom="2dp" />
        </LinearLayout>

        <!-- 시리즈 및 설명 프리뷰 -->
        <TextView
            android:id="@+id/tv_player_series"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="라이몬 중학교 (오리지널)"
            android:textColor="@color/cyan_accent"
            android:textSize="11sp"
            android:layout_marginTop="2dp"
            android:singleLine="true" />

        <TextView
            android:id="@+id/tv_player_desc_preview"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="축구에 대한 열정은 누구에게도 뒤지지 않는다..."
            android:textColor="@color/text_muted"
            android:textSize="11sp"
            android:layout_marginTop="2dp"
            android:singleLine="true" />
    </LinearLayout>

</LinearLayout>`;
fs.writeFileSync(path.join(resLayout, 'item_player.xml'), itemPlayerXml, 'utf8');

// activity_player_detail.xml
const activityPlayerDetailXml = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="@color/bg_dark">

    <!-- 상단 뒤로가기 헤더 -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="52dp"
        android:background="#090D16"
        android:orientation="horizontal"
        android:gravity="center_vertical"
        android:paddingStart="8dp"
        android:paddingEnd="12dp">

        <Button
            android:id="@+id/btn_back"
            android:layout_width="44dp"
            android:layout_height="40dp"
            android:text="⬅"
            android:textColor="@color/gold_glow"
            android:textSize="18sp"
            android:background="@drawable/bg_badge_generic" />

        <TextView
            android:id="@+id/tv_detail_title"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:layout_marginStart="10dp"
            android:text="선수 상세 정보"
            android:textColor="@color/text_white"
            android:textSize="16sp"
            android:textStyle="bold"
            android:singleLine="true" />
    </LinearLayout>

    <ScrollView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:padding="12dp">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical">

            <!-- 1. 프로필 요약 카드 -->
            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="horizontal"
                android:background="@drawable/bg_card_gold"
                android:padding="14dp"
                android:gravity="center_vertical">

                <ImageView
                    android:id="@+id/iv_detail_thumb"
                    android:layout_width="80dp"
                    android:layout_height="80dp"
                    android:background="#090D16"
                    android:scaleType="fitCenter"
                    android:layout_marginEnd="14dp" />

                <LinearLayout
                    android:layout_width="0dp"
                    android:layout_height="wrap_content"
                    android:layout_weight="1"
                    android:orientation="vertical">

                    <TextView
                        android:id="@+id/tv_detail_name"
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="엔도 마모루"
                        android:textColor="@color/gold_glow"
                        android:textSize="18sp"
                        android:textStyle="bold" />

                    <TextView
                        android:id="@+id/tv_detail_kana"
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:text="えんどう まもる"
                        android:textColor="@color/text_muted"
                        android:textSize="12sp" />

                    <LinearLayout
                        android:layout_width="wrap_content"
                        android:layout_height="wrap_content"
                        android:orientation="horizontal"
                        android:layout_marginTop="8dp">

                        <TextView
                            android:id="@+id/tv_detail_pos"
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:text="포지션: GK"
                            android:textColor="#FFFFFF"
                            android:textSize="11sp"
                            android:background="@drawable/bg_badge_generic"
                            android:paddingLeft="6dp"
                            android:paddingRight="6dp"
                            android:paddingTop="2dp"
                            android:paddingBottom="2dp"
                            android:layout_marginEnd="6dp" />

                        <TextView
                            android:id="@+id/tv_detail_elem"
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:text="속성: 산"
                            android:textColor="#FFFFFF"
                            android:textSize="11sp"
                            android:background="@drawable/bg_badge_generic"
                            android:paddingLeft="6dp"
                            android:paddingRight="6dp"
                            android:paddingTop="2dp"
                            android:paddingBottom="2dp" />
                    </LinearLayout>
                </LinearLayout>
            </LinearLayout>

            <!-- 2. 인게임 프로필 설명 카드 -->
            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:background="@drawable/bg_card"
                android:padding="14dp"
                android:layout_marginTop="12dp">

                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:orientation="horizontal"
                    android:gravity="center_vertical">

                    <TextView
                        android:layout_width="0dp"
                        android:layout_height="wrap_content"
                        android:layout_weight="1"
                        android:text="📖 인게임 프로필 설명"
                        android:textColor="@color/cyan_accent"
                        android:textSize="14sp"
                        android:textStyle="bold" />

                    <Button
                        android:id="@+id/btn_toggle_lang"
                        android:layout_width="wrap_content"
                        android:layout_height="32dp"
                        android:text="🇯🇵 일어 원문"
                        android:textColor="#FFFFFF"
                        android:textSize="11sp"
                        android:background="@drawable/bg_badge_generic"
                        android:paddingLeft="8dp"
                        android:paddingRight="8dp" />
                </LinearLayout>

                <TextView
                    android:id="@+id/tv_detail_desc"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="10dp"
                    android:text="축구에 대한 열정은 누구에게도 뒤지지 않는다.\\n어떤 상황에서도 포기하지 않는 강한 의지를 지녔다."
                    android:textColor="@color/text_white"
                    android:textSize="13sp"
                    android:lineSpacingExtra="4dp" />
            </LinearLayout>

            <!-- 3. 상세 스탯 카드 -->
            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:background="@drawable/bg_card"
                android:padding="14dp"
                android:layout_marginTop="12dp">

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="📊 능력치 (Lv.99 기준)"
                    android:textColor="@color/gold_glow"
                    android:textSize="14sp"
                    android:textStyle="bold"
                    android:layout_marginBottom="8dp" />

                <TextView
                    android:id="@+id/tv_detail_stats"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="킥: - | 컨트롤: - | 보디: - | 가드: - | 스피드: - | 스태미나: - | 거츠: -"
                    android:textColor="@color/text_muted"
                    android:textSize="12sp"
                    android:lineSpacingExtra="3dp" />
            </LinearLayout>

            <!-- 4. 소속 팀 및 시리즈 정보 -->
            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:background="@drawable/bg_card"
                android:padding="14dp"
                android:layout_marginTop="12dp"
                android:layout_marginBottom="24dp">

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="🏆 소속 및 시리즈"
                    android:textColor="@color/cyan_accent"
                    android:textSize="14sp"
                    android:textStyle="bold"
                    android:layout_marginBottom="6dp" />

                <TextView
                    android:id="@+id/tv_detail_extra"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="시리즈: 이나즈마 일레븐\\n성별: 남성"
                    android:textColor="@color/text_white"
                    android:textSize="12sp"
                    android:lineSpacingExtra="3dp" />
            </LinearLayout>

        </LinearLayout>
    </ScrollView>

</LinearLayout>`;
fs.writeFileSync(path.join(resLayout, 'activity_player_detail.xml'), activityPlayerDetailXml, 'utf8');

// ==========================================
// 5. Java 소스 코드 (안드로이드 순수 네이티브)
// ==========================================

// ImageLoader.java (비동기 이미지 다운로더 + 인메모리 LruCache)
const imageLoaderJava = `package com.inazumastation.app;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Handler;
import android.os.Looper;
import android.util.LruCache;
import android.widget.ImageView;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ImageLoader {
    private static ImageLoader instance;
    private final LruCache<String, Bitmap> memoryCache;
    private final ExecutorService executor = Executors.newFixedThreadPool(4);
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    private ImageLoader() {
        int maxMemory = (int) (Runtime.getRuntime().maxMemory() / 1024);
        int cacheSize = maxMemory / 8;
        memoryCache = new LruCache<String, Bitmap>(cacheSize) {
            @Override
            protected int sizeOf(String key, Bitmap bitmap) {
                return bitmap.getByteCount() / 1024;
            }
        };
    }

    public static synchronized ImageLoader getInstance() {
        if (instance == null) instance = new ImageLoader();
        return instance;
    }

    public void displayImage(final String urlString, final ImageView imageView) {
        if (urlString == null || urlString.trim().isEmpty()) {
            imageView.setImageDrawable(null);
            return;
        }

        Bitmap cached = memoryCache.get(urlString);
        if (cached != null) {
            imageView.setImageBitmap(cached);
            return;
        }

        imageView.setImageDrawable(null);
        imageView.setTag(urlString);

        executor.execute(new Runnable() {
            @Override
            public void run() {
                try {
                    URL url = new URL(urlString);
                    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                    conn.setDoInput(true);
                    conn.setConnectTimeout(4000);
                    conn.setReadTimeout(4000);
                    conn.connect();
                    InputStream input = conn.getInputStream();
                    final Bitmap bitmap = BitmapFactory.decodeStream(input);
                    if (bitmap != null) {
                        memoryCache.put(urlString, bitmap);
                        mainHandler.post(new Runnable() {
                            @Override
                            public void run() {
                                if (urlString.equals(imageView.getTag())) {
                                    imageView.setImageBitmap(bitmap);
                                }
                            }
                        });
                    }
                } catch (Exception e) {}
            }
        });
    }
}`;
fs.writeFileSync(path.join(srcDir, 'ImageLoader.java'), imageLoaderJava, 'utf8');

// PlayerData.java
const playerDataJava = `package com.inazumastation.app;

import org.json.JSONObject;

public class PlayerData {
    public String id = "";
    public String name = "";
    public String kana = "";
    public String element = "";
    public String position = "";
    public String series = "";
    public String gender = "";
    public String image = "";
    public String descriptionKo = "";
    public String descriptionJa = "";
    public String statsText = "";
    public String teamsText = "";

    public static PlayerData fromJson(JSONObject obj) {
        PlayerData p = new PlayerData();
        p.id = obj.optString("id", "");
        p.name = obj.optString("name", "");
        p.kana = obj.optString("kana", "");
        p.element = obj.optString("element", "");
        p.position = obj.optString("position", "");
        p.series = obj.optString("series", "");
        p.gender = obj.optString("gender", "");
        p.image = obj.optString("image", "");
        p.descriptionKo = obj.optString("description_ko", "");
        p.descriptionJa = obj.optString("description", "");

        JSONObject stats = obj.optJSONObject("stats");
        if (stats != null) {
            p.statsText = "킥: " + stats.optString("kick", "-") + 
                          " | 컨트롤: " + stats.optString("control", "-") + 
                          " | 보디: " + stats.optString("body", "-") + 
                          "\\n가드: " + stats.optString("guard", "-") + 
                          " | 스피드: " + stats.optString("speed", "-") + 
                          " | 스태미나: " + stats.optString("stamina", "-") + 
                          " | 거츠: " + stats.optString("guts", "-");
        }
        return p;
    }
}`;
fs.writeFileSync(path.join(srcDir, 'PlayerData.java'), playerDataJava, 'utf8');

// PlayerAdapter.java
const playerAdapterJava = `package com.inazumastation.app;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.List;

public class PlayerAdapter extends BaseAdapter {
    private final Context context;
    private final List<PlayerData> players;
    private final LayoutInflater inflater;

    public PlayerAdapter(Context context, List<PlayerData> players) {
        this.context = context;
        this.players = players;
        this.inflater = LayoutInflater.from(context);
    }

    @Override
    public int getCount() {
        return players.size();
    }

    @Override
    public Object getItem(int position) {
        return players.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    private static class ViewHolder {
        ImageView ivThumb;
        TextView tvName;
        TextView tvPos;
        TextView tvElement;
        TextView tvSeries;
        TextView tvDesc;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder holder;
        if (convertView == null) {
            convertView = inflater.inflate(R.layout.item_player, parent, false);
            holder = new ViewHolder();
            holder.ivThumb = (ImageView) convertView.findViewById(R.id.iv_player_thumb);
            holder.tvName = (TextView) convertView.findViewById(R.id.tv_player_name);
            holder.tvPos = (TextView) convertView.findViewById(R.id.tv_player_pos);
            holder.tvElement = (TextView) convertView.findViewById(R.id.tv_player_element);
            holder.tvSeries = (TextView) convertView.findViewById(R.id.tv_player_series);
            holder.tvDesc = (TextView) convertView.findViewById(R.id.tv_player_desc_preview);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }

        PlayerData p = players.get(position);
        holder.tvName.setText(p.name);
        holder.tvPos.setText(p.position.isEmpty() ? "MF" : p.position);
        holder.tvElement.setText(p.element.isEmpty() ? "풍" : p.element);
        holder.tvSeries.setText(p.series.isEmpty() ? "이나즈마 일레븐" : p.series);

        String desc = p.descriptionKo.isEmpty() ? p.descriptionJa : p.descriptionKo;
        holder.tvDesc.setText(desc.replace("\\n", " "));

        // 속성별 컬러링
        if ("풍".equals(p.element) || "風".equals(p.element)) {
            holder.tvElement.setBackgroundColor(Color.parseColor("#0284C7"));
        } else if ("화".equals(p.element) || "火".equals(p.element)) {
            holder.tvElement.setBackgroundColor(Color.parseColor("#E11D48"));
        } else if ("산".equals(p.element) || "山".equals(p.element)) {
            holder.tvElement.setBackgroundColor(Color.parseColor("#D97706"));
        } else if ("림".equals(p.element) || "林".equals(p.element)) {
            holder.tvElement.setBackgroundColor(Color.parseColor("#16A34A"));
        } else {
            holder.tvElement.setBackgroundColor(Color.parseColor("#475569"));
        }

        // 포지션별 컬러링
        if ("GK".equalsIgnoreCase(p.position)) {
            holder.tvPos.setBackgroundColor(Color.parseColor("#EAB308"));
        } else if ("DF".equalsIgnoreCase(p.position)) {
            holder.tvPos.setBackgroundColor(Color.parseColor("#3B82F6"));
        } else if ("MF".equalsIgnoreCase(p.position)) {
            holder.tvPos.setBackgroundColor(Color.parseColor("#10B981"));
        } else if ("FW".equalsIgnoreCase(p.position)) {
            holder.tvPos.setBackgroundColor(Color.parseColor("#EF4444"));
        }

        // 이미지 비동기 로딩
        ImageLoader.getInstance().displayImage(p.image, holder.ivThumb);

        return convertView;
    }
}`;
fs.writeFileSync(path.join(srcDir, 'PlayerAdapter.java'), playerAdapterJava, 'utf8');

// MainActivity.java
const mainActivityJava = `package com.inazumastation.app;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;

import org.json.JSONArray;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends Activity {
    public static List<PlayerData> allPlayers = new ArrayList<PlayerData>();
    private List<PlayerData> filteredPlayers = new ArrayList<PlayerData>();
    private PlayerAdapter adapter;
    private ListView listView;
    private EditText etSearch;
    private TextView tvCount;
    private String currentElementFilter = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        listView = (ListView) findViewById(R.id.list_players);
        etSearch = (EditText) findViewById(R.id.et_search);
        tvCount = (TextView) findViewById(R.id.tv_player_count);

        loadPlayersData();

        adapter = new PlayerAdapter(this, filteredPlayers);
        listView.setAdapter(adapter);

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                PlayerData selected = filteredPlayers.get(position);
                Intent intent = new Intent(MainActivity.this, PlayerDetailActivity.class);
                intent.putExtra("player_id", selected.id);
                startActivity(intent);
            }
        });

        // 실시간 검색
        etSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                applyFilter();
            }
            @Override
            public void afterTextChanged(Editable s) {}
        });

        // 속성 필터 버튼 리스너
        findViewById(R.id.btn_filter_all).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { currentElementFilter = ""; applyFilter(); }
        });
        findViewById(R.id.btn_filter_wind).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { currentElementFilter = "풍"; applyFilter(); }
        });
        findViewById(R.id.btn_filter_fire).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { currentElementFilter = "화"; applyFilter(); }
        });
        findViewById(R.id.btn_filter_earth).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { currentElementFilter = "산"; applyFilter(); }
        });
        findViewById(R.id.btn_filter_wood).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { currentElementFilter = "림"; applyFilter(); }
        });
    }

    private void loadPlayersData() {
        if (!allPlayers.isEmpty()) {
            filteredPlayers.addAll(allPlayers);
            return;
        }

        try {
            InputStream is = getAssets().open("characters.json");
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            String json = new String(buffer, StandardCharsets.UTF_8);

            JSONArray array = new JSONArray(json);
            for (int i = 0; i < array.length(); i++) {
                allPlayers.add(PlayerData.fromJson(array.getJSONObject(i)));
            }
            filteredPlayers.addAll(allPlayers);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void applyFilter() {
        String query = etSearch.getText().toString().trim().toLowerCase();
        filteredPlayers.clear();

        for (PlayerData p : allPlayers) {
            boolean matchElem = currentElementFilter.isEmpty() || p.element.contains(currentElementFilter);
            boolean matchQuery = query.isEmpty() || 
                                 p.name.toLowerCase().contains(query) || 
                                 p.kana.toLowerCase().contains(query) || 
                                 p.position.toLowerCase().contains(query) ||
                                 p.series.toLowerCase().contains(query);

            if (matchElem && matchQuery) {
                filteredPlayers.add(p);
            }
        }
        tvCount.setText(filteredPlayers.size() + "명");
        adapter.notifyDataSetChanged();
    }
}`;
fs.writeFileSync(path.join(srcDir, 'MainActivity.java'), mainActivityJava, 'utf8');

// PlayerDetailActivity.java
const playerDetailActivityJava = `package com.inazumastation.app;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

public class PlayerDetailActivity extends Activity {
    private PlayerData player;
    private boolean showOriginal = false;
    private TextView tvDesc;
    private Button btnToggleLang;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_player_detail);

        String playerId = getIntent().getStringExtra("player_id");
        for (PlayerData p : MainActivity.allPlayers) {
            if (p.id.equals(playerId)) {
                player = p;
                break;
            }
        }

        if (player == null) {
            finish();
            return;
        }

        findViewById(R.id.btn_back).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) { finish(); }
        });

        TextView tvTitle = (TextView) findViewById(R.id.tv_detail_title);
        ImageView ivThumb = (ImageView) findViewById(R.id.iv_detail_thumb);
        TextView tvName = (TextView) findViewById(R.id.tv_detail_name);
        TextView tvKana = (TextView) findViewById(R.id.tv_detail_kana);
        TextView tvPos = (TextView) findViewById(R.id.tv_detail_pos);
        TextView tvElem = (TextView) findViewById(R.id.tv_detail_elem);
        tvDesc = (TextView) findViewById(R.id.tv_detail_desc);
        btnToggleLang = (Button) findViewById(R.id.btn_toggle_lang);
        TextView tvStats = (TextView) findViewById(R.id.tv_detail_stats);
        TextView tvExtra = (TextView) findViewById(R.id.tv_detail_extra);

        tvTitle.setText(player.name + " (" + player.position + ")");
        tvName.setText(player.name);
        tvKana.setText(player.kana);
        tvPos.setText("포지션: " + (player.position.isEmpty() ? "MF" : player.position));
        tvElem.setText("속성: " + (player.element.isEmpty() ? "풍" : player.element));

        updateDescriptionText();

        btnToggleLang.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showOriginal = !showOriginal;
                updateDescriptionText();
            }
        });

        if (!player.statsText.isEmpty()) {
            tvStats.setText(player.statsText);
        }

        tvExtra.setText("시리즈: " + (player.series.isEmpty() ? "이나즈마 일레븐" : player.series) + 
                        "\\n성별: " + (player.gender.isEmpty() ? "남성" : player.gender));

        ImageLoader.getInstance().displayImage(player.image, ivThumb);
    }

    private void updateDescriptionText() {
        if (showOriginal) {
            tvDesc.setText(player.descriptionJa.isEmpty() ? "説明がありません。" : player.descriptionJa);
            btnToggleLang.setText("🇰🇷 한국어 번역");
        } else {
            tvDesc.setText(player.descriptionKo.isEmpty() ? player.descriptionJa : player.descriptionKo);
            btnToggleLang.setText("🇯🇵 일어 원문");
        }
    }
}`;
fs.writeFileSync(path.join(srcDir, 'PlayerDetailActivity.java'), playerDetailActivityJava, 'utf8');

// ==========================================
// 6. 5,407명 데이터베이스 Asset 복사
// ==========================================
console.log('📦 [2/6] 5,407명 캐릭터 데이터베이스 Asset 패키징 중...');
fs.copyFileSync('src/data/characters.json', path.join(assetsDir, 'characters.json'));
if (fs.existsSync('public/logo.png')) {
  fs.copyFileSync('public/logo.png', path.join(resMipmap, 'ic_launcher.png'));
}

// ==========================================
// 7. AAPT2 컴파일 및 링크
// ==========================================
console.log('🔨 [3/6] AAPT2 네이티브 리소스 컴파일 및 링크 중...');
execSync(`"${AAPT2}" compile --dir "${resDir}" -o "${binDir}/res.zip"`);
execSync(`"${AAPT2}" link -o "${binDir}/base.apk" -I "${ANDROID_JAR}" --manifest "${WORK_DIR}/AndroidManifest.xml" -A "${assetsDir}" --java "${WORK_DIR}/src" "${binDir}/res.zip" --auto-add-overlay`);

// ==========================================
// 8. Java 컴파일 (javac)
// ==========================================
console.log('☕ [4/6] Java 네이티브 컴파일 (javac)...');
const javaFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.java')).map(f => `"${path.join(srcDir, f)}"`).join(' ');
execSync(`"${JAVAC}" -source 8 -target 8 -bootclasspath "${ANDROID_JAR}" -cp "${ANDROID_JAR}" -d "${objDir}" ${javaFiles}`);

// ==========================================
// 9. D8 바이트코드 생성
// ==========================================
console.log('⚡ [5/6] Dalvik 바이트코드 생성 (d8 -> classes.dex)...');
const D8_JAR = path.join(BUILD_TOOLS, 'lib', 'd8.jar');
const classFiles = [];
function collectClasses(dir) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) collectClasses(full);
    else if (f.endsWith('.class')) classFiles.push(`"${full}"`);
  });
}
collectClasses(objDir);
execSync(`"${JAVA}" -cp "${D8_JAR}" com.android.tools.r8.D8 --lib "${ANDROID_JAR}" --output "${binDir}" ${classFiles.join(' ')}`);

// APK에 classes.dex 주입 (jar 커맨드로 classes.dex 삽입)
const JAR_EXE = path.join(JBR_BIN, 'jar.exe');
execSync(`cd "${binDir}" && "${JAR_EXE}" -uf "base.apk" "classes.dex"`);

// ==========================================
// 10. Zipalign 및 정식 디지털 서명 (apksigner)
// ==========================================
console.log('📐 [6/6] Zipalign 및 정식 디지털 서명 (apksigner v1/v2/v3)...');
const unalignedApk = path.join(binDir, 'base.apk');
const alignedApk = path.join(binDir, 'aligned.apk');
const finalApkPath = path.resolve('public/downloads/InazumaStation.apk');

fs.mkdirSync(path.dirname(finalApkPath), { recursive: true });

execSync(`"${ZIPALIGN}" -f -p 4 "${unalignedApk}" "${alignedApk}"`);

const keystorePath = path.join(WORK_DIR, 'release.keystore');
execSync(`"${KEYTOOL}" -genkey -v -keystore "${keystorePath}" -alias inazuma -keyalg RSA -keysize 2048 -validity 10000 -storepass inazuma123 -keypass inazuma123 -dname "CN=InazumaStation, OU=Mobile, O=VictoryRoad, L=Seoul, ST=Seoul, C=KR"`);

const APKSIGNER_JAR = path.join(BUILD_TOOLS, 'lib', 'apksigner.jar');
execSync(`"${JAVA}" -jar "${APKSIGNER_JAR}" sign --ks "${keystorePath}" --ks-pass pass:inazuma123 --ks-key-alias inazuma --key-pass pass:inazuma123 --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true --out "${finalApkPath}" "${alignedApk}"`);

execSync(`"${JAVA}" -jar "${APKSIGNER_JAR}" verify --verbose "${finalApkPath}"`);

console.log('🎉 100% 순수 안드로이드 네이티브 APK 빌드 완료!');
console.log('👉 산출물 파일:', finalApkPath);
