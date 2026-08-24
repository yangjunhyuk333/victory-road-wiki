import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 [1/6] 네이티브 앱 (전술판 + 페이징 + 바텀 네비) 정식 APK 빌드 시작...');

const JBR_BIN = 'C:\\Program Files\\Android\\Android Studio\\jbr\\bin';
const JAVAC = path.join(JBR_BIN, 'javac.exe');
const KEYTOOL = path.join(JBR_BIN, 'keytool.exe');
const JAVA = path.join(JBR_BIN, 'java.exe');

const SDK_DIR = 'C:\\Users\\cucun\\AppData\\Local\\Android\\Sdk';
const BUILD_TOOLS = path.join(SDK_DIR, 'build-tools', '36.0.0');
const AAPT2 = path.join(BUILD_TOOLS, 'aapt2.exe');
const D8_JAR = path.join(BUILD_TOOLS, 'lib', 'd8.jar');
const ZIPALIGN = path.join(BUILD_TOOLS, 'zipalign.exe');
const APKSIGNER_JAR = path.join(BUILD_TOOLS, 'lib', 'apksigner.jar');
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
// 1. AndroidManifest.xml
// ==========================================
const manifestContent = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.inazumastation.app"
    android:versionCode="3"
    android:versionName="2.1.0">

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
// 2. XML Values & Colors & Styles
// ==========================================
const stringsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">이나즈마 스테이션</string>
    <string name="tab_players">선수 도감</string>
    <string name="tab_tactics">전술판</string>
    <string name="tab_moves">필살기</string>
    <string name="tab_settings">설정</string>
    <string name="search_hint">선수 이름 / 속성 / 포지션 검색...</string>
    <string name="search_moves_hint">필살기 이름 / 속성 / 타입 검색...</string>
</resources>`;
fs.writeFileSync(path.join(resValues, 'strings.xml'), stringsXml, 'utf8');

const colorsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="bg_dark">#0F172A</color>
    <color name="bg_darker">#090D16</color>
    <color name="bg_card">#1E293B</color>
    <color name="bg_card_light">#334155</color>
    <color name="gold_primary">#F59E0B</color>
    <color name="gold_glow">#FBBF24</color>
    <color name="cyan_accent">#06B6D4</color>
    <color name="text_white">#F8FAFC</color>
    <color name="text_muted">#94A3B8</color>
    <color name="pitch_green">#064E3B</color>
    <color name="pitch_line">#34D399</color>
</resources>`;
fs.writeFileSync(path.join(resValues, 'colors.xml'), colorsXml, 'utf8');

const stylesXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="@android:style/Theme.Material.NoActionBar">
        <item name="android:windowBackground">@color/bg_dark</item>
        <item name="android:colorPrimary">@color/bg_dark</item>
        <item name="android:colorPrimaryDark">@color/bg_darker</item>
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
    <corners android:radius="12dp" />
    <stroke android:width="1dp" android:color="#334155" />
</shape>`, 'utf8');

fs.writeFileSync(path.join(resDrawable, 'bg_card_gold.xml'), `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#1E293B" />
    <corners android:radius="12dp" />
    <stroke android:width="1.5dp" android:color="#F59E0B" />
</shape>`, 'utf8');

fs.writeFileSync(path.join(resDrawable, 'bg_pitch.xml'), `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#064E3B" />
    <corners android:radius="14dp" />
    <stroke android:width="2dp" android:color="#10B981" />
</shape>`, 'utf8');

fs.writeFileSync(path.join(resDrawable, 'bg_slot_player.xml'), `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#E20F172A" />
    <corners android:radius="24dp" />
    <stroke android:width="1.5dp" android:color="#F59E0B" />
</shape>`, 'utf8');

fs.writeFileSync(path.join(resDrawable, 'bg_slot_empty.xml'), `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#800F172A" />
    <corners android:radius="24dp" />
    <stroke android:width="1dp" android:color="#64748B" />
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

fs.writeFileSync(path.join(resDrawable, 'bg_search.xml'), `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#1E293B" />
    <corners android:radius="10dp" />
    <stroke android:width="1dp" android:color="#475569" />
</shape>`, 'utf8');

fs.writeFileSync(path.join(resDrawable, 'bg_bottom_bar.xml'), `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#090D16" />
    <stroke android:width="1dp" android:color="#1E293B" />
</shape>`, 'utf8');

// ==========================================
// 4. XML Layouts
// ==========================================

// item_player.xml
fs.writeFileSync(path.join(resLayout, 'item_player.xml'), `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="horizontal"
    android:background="@drawable/bg_card"
    android:padding="10dp"
    android:layout_marginBottom="6dp"
    android:gravity="center_vertical">

    <ImageView
        android:id="@+id/iv_player_thumb"
        android:layout_width="52dp"
        android:layout_height="52dp"
        android:background="#090D16"
        android:scaleType="fitCenter"
        android:layout_marginEnd="12dp" />

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
</LinearLayout>`, 'utf8');

// dialog_select_player.xml
fs.writeFileSync(path.join(resLayout, 'dialog_select_player.xml'), `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="@color/bg_dark"
    android:padding="12dp">

    <TextView
        android:id="@+id/tv_dialog_title"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="선수 배치 선택"
        android:textColor="@color/gold_glow"
        android:textSize="16sp"
        android:textStyle="bold"
        android:layout_marginBottom="8dp" />

    <EditText
        android:id="@+id/et_dialog_search"
        android:layout_width="match_parent"
        android:layout_height="40dp"
        android:background="@drawable/bg_search"
        android:hint="선수 검색..."
        android:textColorHint="@color/text_muted"
        android:textColor="@color/text_white"
        android:textSize="13sp"
        android:paddingStart="10dp"
        android:paddingEnd="10dp"
        android:singleLine="true" />

    <ListView
        android:id="@+id/list_dialog_players"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1"
        android:layout_marginTop="8dp"
        android:divider="#1E293B"
        android:dividerHeight="1dp" />

    <Button
        android:id="@+id/btn_dialog_clear_slot"
        android:layout_width="match_parent"
        android:layout_height="40dp"
        android:layout_marginTop="8dp"
        android:text="❌ 이 슬롯 비우기"
        android:textColor="#FFFFFF"
        android:background="@drawable/bg_card" />
</LinearLayout>`, 'utf8');

// activity_player_detail.xml
fs.writeFileSync(path.join(resLayout, 'activity_player_detail.xml'), `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="@color/bg_dark">

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
</LinearLayout>`, 'utf8');

// activity_main.xml (4개 탭 레이아웃 및 바텀 네비게이션)
fs.writeFileSync(path.join(resLayout, 'activity_main.xml'), `<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/bg_dark">

    <FrameLayout
        android:id="@+id/tab_content_container"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_above="@+id/bottom_nav_bar">

        <!-- 1. 선수 도감 탭 -->
        <LinearLayout
            android:id="@+id/tab_view_players"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:orientation="vertical"
            android:visibility="visible">

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
                    android:singleLine="true" />

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
        </LinearLayout>

        <!-- 2. 전술판 탭 -->
        <LinearLayout
            android:id="@+id/tab_view_tactics"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:orientation="vertical"
            android:visibility="gone">

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
                        android:layout_width="0dp"
                        android:layout_height="wrap_content"
                        android:layout_weight="1"
                        android:text="📋 이나즈마 전술판"
                        android:textColor="@color/gold_glow"
                        android:textSize="17sp"
                        android:textStyle="bold" />

                    <Button
                        android:id="@+id/btn_save_tactics"
                        android:layout_width="wrap_content"
                        android:layout_height="32dp"
                        android:text="💾 저장"
                        android:textColor="#FFFFFF"
                        android:textSize="11sp"
                        android:background="@drawable/bg_btn_gold"
                        android:layout_marginEnd="6dp"
                        android:paddingLeft="8dp"
                        android:paddingRight="8dp" />

                    <Button
                        android:id="@+id/btn_reset_tactics"
                        android:layout_width="wrap_content"
                        android:layout_height="32dp"
                        android:text="🔄 초기화"
                        android:textColor="#FFFFFF"
                        android:textSize="11sp"
                        android:background="@drawable/bg_badge_generic"
                        android:paddingLeft="8dp"
                        android:paddingRight="8dp" />
                </LinearLayout>

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
                            android:id="@+id/btn_form_442"
                            android:layout_width="wrap_content"
                            android:layout_height="30dp"
                            android:text="4-4-2"
                            android:textColor="#FFFFFF"
                            android:textSize="11sp"
                            android:background="@drawable/bg_btn_gold"
                            android:layout_marginEnd="4dp"
                            android:paddingLeft="8dp"
                            android:paddingRight="8dp" />

                        <Button
                            android:id="@+id/btn_form_433"
                            android:layout_width="wrap_content"
                            android:layout_height="30dp"
                            android:text="4-3-3"
                            android:textColor="#FFFFFF"
                            android:textSize="11sp"
                            android:background="@drawable/bg_badge_generic"
                            android:layout_marginEnd="4dp"
                            android:paddingLeft="8dp"
                            android:paddingRight="8dp" />

                        <Button
                            android:id="@+id/btn_form_352"
                            android:layout_width="wrap_content"
                            android:layout_height="30dp"
                            android:text="3-5-2"
                            android:textColor="#FFFFFF"
                            android:textSize="11sp"
                            android:background="@drawable/bg_badge_generic"
                            android:layout_marginEnd="4dp"
                            android:paddingLeft="8dp"
                            android:paddingRight="8dp" />

                        <Button
                            android:id="@+id/btn_form_4231"
                            android:layout_width="wrap_content"
                            android:layout_height="30dp"
                            android:text="4-2-3-1"
                            android:textColor="#FFFFFF"
                            android:textSize="11sp"
                            android:background="@drawable/bg_badge_generic"
                            android:layout_marginEnd="4dp"
                            android:paddingLeft="8dp"
                            android:paddingRight="8dp" />

                        <Button
                            android:id="@+id/btn_form_343"
                            android:layout_width="wrap_content"
                            android:layout_height="30dp"
                            android:text="3-4-3"
                            android:textColor="#FFFFFF"
                            android:textSize="11sp"
                            android:background="@drawable/bg_badge_generic"
                            android:paddingLeft="8dp"
                            android:paddingRight="8dp" />
                    </LinearLayout>
                </HorizontalScrollView>
            </LinearLayout>

            <ScrollView
                android:layout_width="match_parent"
                android:layout_height="match_parent"
                android:padding="8dp">

                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:orientation="vertical">

                    <RelativeLayout
                        android:id="@+id/layout_pitch"
                        android:layout_width="match_parent"
                        android:layout_height="380dp"
                        android:background="@drawable/bg_pitch">

                        <View
                            android:layout_width="match_parent"
                            android:layout_height="1.5dp"
                            android:layout_centerVertical="true"
                            android:background="#6034D399" />

                        <View
                            android:layout_width="70dp"
                            android:layout_height="70dp"
                            android:layout_centerInParent="true"
                            android:background="@drawable/bg_slot_empty" />

                        <FrameLayout
                            android:id="@+id/slots_container"
                            android:layout_width="match_parent"
                            android:layout_height="match_parent" />
                    </RelativeLayout>

                    <LinearLayout
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:orientation="vertical"
                        android:background="@drawable/bg_card"
                        android:padding="10dp"
                        android:layout_marginTop="8dp"
                        android:layout_marginBottom="24dp">

                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:text="🪑 후보 (벤치) 슬롯"
                            android:textColor="@color/cyan_accent"
                            android:textSize="13sp"
                            android:textStyle="bold"
                            android:layout_marginBottom="8dp" />

                        <LinearLayout
                            android:id="@+id/bench_container"
                            android:layout_width="match_parent"
                            android:layout_height="wrap_content"
                            android:orientation="horizontal"
                            android:gravity="center" />
                    </LinearLayout>
                </LinearLayout>
            </ScrollView>
        </LinearLayout>

        <!-- 3. 필살기 탭 -->
        <LinearLayout
            android:id="@+id/tab_view_moves"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:orientation="vertical"
            android:visibility="gone">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:background="#090D16"
                android:padding="12dp">

                <TextView
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="⚡ 필살기 도감"
                    android:textColor="@color/gold_glow"
                    android:textSize="18sp"
                    android:textStyle="bold" />

                <EditText
                    android:id="@+id/et_search_moves"
                    android:layout_width="match_parent"
                    android:layout_height="42dp"
                    android:layout_marginTop="10dp"
                    android:background="@drawable/bg_search"
                    android:hint="@string/search_moves_hint"
                    android:textColorHint="@color/text_muted"
                    android:textColor="@color/text_white"
                    android:textSize="14sp"
                    android:paddingStart="12dp"
                    android:paddingEnd="12dp"
                    android:singleLine="true" />
            </LinearLayout>

            <ListView
                android:id="@+id/list_moves"
                android:layout_width="match_parent"
                android:layout_height="match_parent"
                android:divider="#1E293B"
                android:dividerHeight="1dp"
                android:padding="8dp"
                android:clipToPadding="false" />
        </LinearLayout>

        <!-- 4. 설정 탭 -->
        <LinearLayout
            android:id="@+id/tab_view_settings"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:orientation="vertical"
            android:padding="16dp"
            android:visibility="gone">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:background="@drawable/bg_card_gold"
                android:padding="16dp">

                <TextView
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="⚡ 이나즈마 스테이션 v2.1.0 (Native)"
                    android:textColor="@color/gold_glow"
                    android:textSize="16sp"
                    android:textStyle="bold" />

                <TextView
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="• 순수 안드로이드 네이티브 엔진 (WebView 의존성 0%)\\n• 5,407명 전체 선수 100% 한국어 공식 도감 내장\\n• 8대 포메이션 전술판 &amp; 스쿼드 메이커\\n• 초고속 인메모리 페이징 무한 스크롤"
                    android:textColor="@color/text_white"
                    android:textSize="13sp"
                    android:lineSpacingExtra="4dp"
                    android:layout_marginTop="10dp" />
            </LinearLayout>
        </LinearLayout>

    </FrameLayout>

    <!-- 바텀 네비게이션 바 -->
    <LinearLayout
        android:id="@+id/bottom_nav_bar"
        android:layout_width="match_parent"
        android:layout_height="56dp"
        android:layout_alignParentBottom="true"
        android:background="@drawable/bg_bottom_bar"
        android:orientation="horizontal"
        android:gravity="center">

        <LinearLayout
            android:id="@+id/nav_btn_players"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:orientation="vertical"
            android:gravity="center"
            android:background="?android:attr/selectableItemBackground">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="⚽"
                android:textSize="18sp" />

            <TextView
                android:id="@+id/nav_tv_players"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="선수 도감"
                android:textColor="@color/gold_glow"
                android:textSize="11sp"
                android:textStyle="bold" />
        </LinearLayout>

        <LinearLayout
            android:id="@+id/nav_btn_tactics"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:orientation="vertical"
            android:gravity="center"
            android:background="?android:attr/selectableItemBackground">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="📋"
                android:textSize="18sp" />

            <TextView
                android:id="@+id/nav_tv_tactics"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="전술판"
                android:textColor="@color/text_muted"
                android:textSize="11sp" />
        </LinearLayout>

        <LinearLayout
            android:id="@+id/nav_btn_moves"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:orientation="vertical"
            android:gravity="center"
            android:background="?android:attr/selectableItemBackground">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="⚡"
                android:textSize="18sp" />

            <TextView
                android:id="@+id/nav_tv_moves"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="필살기"
                android:textColor="@color/text_muted"
                android:textSize="11sp" />
        </LinearLayout>

        <LinearLayout
            android:id="@+id/nav_btn_settings"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:orientation="vertical"
            android:gravity="center"
            android:background="?android:attr/selectableItemBackground">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="⚙️"
                android:textSize="18sp" />

            <TextView
                android:id="@+id/nav_tv_settings"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="설정"
                android:textColor="@color/text_muted"
                android:textSize="11sp" />
        </LinearLayout>
    </LinearLayout>
</RelativeLayout>`, 'utf8');

// ==========================================
// 5. Java 소스 코드 100% 정의
// ==========================================

// ImageLoader.java
fs.writeFileSync(path.join(srcDir, 'ImageLoader.java'), `package com.inazumastation.app;

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
}`, 'utf8');

// PlayerData.java
fs.writeFileSync(path.join(srcDir, 'PlayerData.java'), `package com.inazumastation.app;

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
}`, 'utf8');

// MoveData.java
fs.writeFileSync(path.join(srcDir, 'MoveData.java'), `package com.inazumastation.app;

public class MoveData {
    public String name = "";
    public String element = "";
    public String type = "";
    public String cost = "";
    public String power = "";

    public MoveData(String name, String element, String type, String cost, String power) {
        this.name = name;
        this.element = element;
        this.type = type;
        this.cost = cost;
        this.power = power;
    }
}`, 'utf8');

// PlayerAdapter.java
fs.writeFileSync(path.join(srcDir, 'PlayerAdapter.java'), `package com.inazumastation.app;

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

        if ("GK".equalsIgnoreCase(p.position)) {
            holder.tvPos.setBackgroundColor(Color.parseColor("#EAB308"));
        } else if ("DF".equalsIgnoreCase(p.position)) {
            holder.tvPos.setBackgroundColor(Color.parseColor("#3B82F6"));
        } else if ("MF".equalsIgnoreCase(p.position)) {
            holder.tvPos.setBackgroundColor(Color.parseColor("#10B981"));
        } else if ("FW".equalsIgnoreCase(p.position)) {
            holder.tvPos.setBackgroundColor(Color.parseColor("#EF4444"));
        }

        ImageLoader.getInstance().displayImage(p.image, holder.ivThumb);
        return convertView;
    }
}`, 'utf8');

// PlayerDetailActivity.java
fs.writeFileSync(path.join(srcDir, 'PlayerDetailActivity.java'), `package com.inazumastation.app;

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
}`, 'utf8');

// MainActivity.java
fs.writeFileSync(path.join(srcDir, 'MainActivity.java'), `package com.inazumastation.app;

import android.app.Activity;
import android.app.Dialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AbsListView;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainActivity extends Activity {
    public static List<PlayerData> allPlayers = new ArrayList<PlayerData>();
    private List<PlayerData> filteredPlayers = new ArrayList<PlayerData>();
    private List<PlayerData> pagedPlayers = new ArrayList<PlayerData>();
    
    private PlayerAdapter playerAdapter;
    private ListView listView;
    private EditText etSearch;
    private TextView tvCount;
    private String currentElementFilter = "";

    // 페이징 상수 (한 번에 50명씩 로드)
    private static final int PAGE_SIZE = 50;
    private int currentPage = 1;
    private boolean isLoadingMore = false;

    // 4개 탭 뷰
    private View tabPlayersView, tabTacticsView, tabMovesView, tabSettingsView;
    private TextView navTvPlayers, navTvTactics, navTvMoves, navTvSettings;

    // 전술판 상태
    private String currentFormation = "4-4-2";
    private FrameLayout pitchSlotsContainer;
    private LinearLayout benchContainer;
    private PlayerData[] startingEleven = new PlayerData[11];
    private PlayerData[] benchSlots = new PlayerData[5];

    // 포메이션별 좌표 정의 (top%, left%)
    private static final Map<String, int[][]> FORMATION_COORDS = new HashMap<String, int[][]>();
    static {
        FORMATION_COORDS.put("4-4-2", new int[][]{
            {86, 50}, {70, 15}, {72, 35}, {72, 65}, {70, 85},
            {46, 15}, {48, 36}, {48, 64}, {46, 85}, {18, 35}, {18, 65}
        });
        FORMATION_COORDS.put("4-3-3", new int[][]{
            {86, 50}, {70, 15}, {72, 35}, {72, 65}, {70, 85},
            {48, 30}, {52, 50}, {48, 70}, {20, 20}, {16, 50}, {20, 80}
        });
        FORMATION_COORDS.put("3-5-2", new int[][]{
            {86, 50}, {72, 25}, {74, 50}, {72, 75}, {50, 15},
            {54, 35}, {54, 65}, {50, 85}, {36, 50}, {18, 35}, {18, 65}
        });
        FORMATION_COORDS.put("4-2-3-1", new int[][]{
            {86, 50}, {70, 15}, {73, 35}, {73, 65}, {70, 85},
            {55, 35}, {55, 65}, {35, 18}, {35, 50}, {35, 82}, {16, 50}
        });
        FORMATION_COORDS.put("3-4-3", new int[][]{
            {86, 50}, {72, 25}, {74, 50}, {72, 75}, {48, 15},
            {48, 38}, {48, 62}, {48, 85}, {20, 25}, {16, 50}, {20, 75}
        });
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initViews();
        loadDatabaseAsync();
        setupBottomNav();
        setupTacticsBoard();
    }

    private void initViews() {
        tabPlayersView = findViewById(R.id.tab_view_players);
        tabTacticsView = findViewById(R.id.tab_view_tactics);
        tabMovesView = findViewById(R.id.tab_view_moves);
        tabSettingsView = findViewById(R.id.tab_view_settings);

        navTvPlayers = (TextView) findViewById(R.id.nav_tv_players);
        navTvTactics = (TextView) findViewById(R.id.nav_tv_tactics);
        navTvMoves = (TextView) findViewById(R.id.nav_tv_moves);
        navTvSettings = (TextView) findViewById(R.id.nav_tv_settings);

        listView = (ListView) findViewById(R.id.list_players);
        etSearch = (EditText) findViewById(R.id.et_search);
        tvCount = (TextView) findViewById(R.id.tv_player_count);

        playerAdapter = new PlayerAdapter(this, pagedPlayers);
        listView.setAdapter(playerAdapter);

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                if (position < pagedPlayers.size()) {
                    PlayerData selected = pagedPlayers.get(position);
                    Intent intent = new Intent(MainActivity.this, PlayerDetailActivity.class);
                    intent.putExtra("player_id", selected.id);
                    startActivity(intent);
                }
            }
        });

        // 50개 단위 무한 스크롤 (Paging)
        listView.setOnScrollListener(new AbsListView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(AbsListView view, int scrollState) {}

            @Override
            public void onScroll(AbsListView view, int firstVisibleItem, int visibleItemCount, int totalItemCount) {
                if (totalItemCount > 0 && (firstVisibleItem + visibleItemCount >= totalItemCount - 5)) {
                    loadNextPage();
                }
            }
        });

        // 실시간 검색창 이벤트
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

        findViewById(R.id.btn_filter_all).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { currentElementFilter = ""; applyFilter(); }
        });
        findViewById(R.id.btn_filter_wind).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { currentElementFilter = "풍"; applyFilter(); }
        });
        findViewById(R.id.btn_filter_fire).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { currentElementFilter = "화"; applyFilter(); }
        });
        findViewById(R.id.btn_filter_earth).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { currentElementFilter = "산"; applyFilter(); }
        });
        findViewById(R.id.btn_filter_wood).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { currentElementFilter = "림"; applyFilter(); }
        });
    }

    private void loadDatabaseAsync() {
        if (!allPlayers.isEmpty()) {
            applyFilter();
            return;
        }

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    InputStream is = getAssets().open("characters.json");
                    int size = is.available();
                    byte[] buffer = new byte[size];
                    is.read(buffer);
                    is.close();
                    String json = new String(buffer, StandardCharsets.UTF_8);

                    JSONArray array = new JSONArray(json);
                    final List<PlayerData> list = new ArrayList<PlayerData>();
                    for (int i = 0; i < array.length(); i++) {
                        list.add(PlayerData.fromJson(array.getJSONObject(i)));
                    }

                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            allPlayers.clear();
                            allPlayers.addAll(list);
                            applyFilter();
                            loadSavedTactics();
                            renderPitchSlots();
                        }
                    });
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).start();
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
        currentPage = 1;
        pagedPlayers.clear();
        loadNextPage();
    }

    private void loadNextPage() {
        if (isLoadingMore) return;
        int start = (currentPage - 1) * PAGE_SIZE;
        if (start >= filteredPlayers.size() && !pagedPlayers.isEmpty()) return;

        isLoadingMore = true;
        int end = Math.min(start + PAGE_SIZE, filteredPlayers.size());
        for (int i = start; i < end; i++) {
            pagedPlayers.add(filteredPlayers.get(i));
        }
        currentPage++;
        playerAdapter.notifyDataSetChanged();
        isLoadingMore = false;
    }

    private void setupBottomNav() {
        findViewById(R.id.nav_btn_players).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { selectTab(0); }
        });
        findViewById(R.id.nav_btn_tactics).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { selectTab(1); }
        });
        findViewById(R.id.nav_btn_moves).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { selectTab(2); }
        });
        findViewById(R.id.nav_btn_settings).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { selectTab(3); }
        });
    }

    private void selectTab(int index) {
        tabPlayersView.setVisibility(index == 0 ? View.VISIBLE : View.GONE);
        tabTacticsView.setVisibility(index == 1 ? View.VISIBLE : View.GONE);
        tabMovesView.setVisibility(index == 2 ? View.VISIBLE : View.GONE);
        tabSettingsView.setVisibility(index == 3 ? View.VISIBLE : View.GONE);

        navTvPlayers.setTextColor(index == 0 ? Color.parseColor("#FBBF24") : Color.parseColor("#94A3B8"));
        navTvTactics.setTextColor(index == 1 ? Color.parseColor("#FBBF24") : Color.parseColor("#94A3B8"));
        navTvMoves.setTextColor(index == 2 ? Color.parseColor("#FBBF24") : Color.parseColor("#94A3B8"));
        navTvSettings.setTextColor(index == 3 ? Color.parseColor("#FBBF24") : Color.parseColor("#94A3B8"));

        if (index == 1) {
            renderPitchSlots();
        }
    }

    private void setupTacticsBoard() {
        pitchSlotsContainer = (FrameLayout) findViewById(R.id.slots_container);
        benchContainer = (LinearLayout) findViewById(R.id.bench_container);

        findViewById(R.id.btn_form_442).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { currentFormation = "4-4-2"; renderPitchSlots(); }
        });
        findViewById(R.id.btn_form_433).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { currentFormation = "4-3-3"; renderPitchSlots(); }
        });
        findViewById(R.id.btn_form_352).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { currentFormation = "3-5-2"; renderPitchSlots(); }
        });
        findViewById(R.id.btn_form_4231).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { currentFormation = "4-2-3-1"; renderPitchSlots(); }
        });
        findViewById(R.id.btn_form_343).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { currentFormation = "3-4-3"; renderPitchSlots(); }
        });

        findViewById(R.id.btn_save_tactics).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { saveTactics(); }
        });
        findViewById(R.id.btn_reset_tactics).setOnClickListener(new View.OnClickListener() {
            @Override public void onClick(View v) { resetTactics(); }
        });
    }

    private void renderPitchSlots() {
        if (pitchSlotsContainer == null) return;
        pitchSlotsContainer.removeAllViews();

        int[][] coords = FORMATION_COORDS.get(currentFormation);
        if (coords == null) coords = FORMATION_COORDS.get("4-4-2");

        for (int i = 0; i < 11; i++) {
            final int slotIndex = i;
            int topPercent = coords[i][0];
            int leftPercent = coords[i][1];

            LinearLayout slotView = createSlotView(startingEleven[i], slotIndex, false);

            FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                dpToPx(56), dpToPx(56)
            );
            params.gravity = Gravity.TOP | Gravity.LEFT;
            params.topMargin = (int) (dpToPx(380) * (topPercent / 100.0f) - dpToPx(28));
            params.leftMargin = (int) (getResources().getDisplayMetrics().widthPixels * (leftPercent / 100.0f) - dpToPx(34));

            pitchSlotsContainer.addView(slotView, params);
        }

        if (benchContainer != null) {
            benchContainer.removeAllViews();
            for (int i = 0; i < 5; i++) {
                final int benchIndex = i;
                LinearLayout benchSlotView = createSlotView(benchSlots[i], benchIndex, true);
                LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(dpToPx(56), dpToPx(56));
                lp.setMargins(dpToPx(4), 0, dpToPx(4), 0);
                benchContainer.addView(benchSlotView, lp);
            }
        }
    }

    private LinearLayout createSlotView(final PlayerData player, final int index, final boolean isBench) {
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setGravity(Gravity.CENTER);
        layout.setBackgroundResource(player != null ? R.drawable.bg_slot_player : R.drawable.bg_slot_empty);
        layout.setClickable(true);

        ImageView iv = new ImageView(this);
        LinearLayout.LayoutParams ivParams = new LinearLayout.LayoutParams(dpToPx(32), dpToPx(32));
        iv.setLayoutParams(ivParams);
        iv.setScaleType(ImageView.ScaleType.FIT_CENTER);

        TextView tv = new TextView(this);
        tv.setTextSize(9);
        tv.setTextColor(Color.WHITE);
        tv.setSingleLine(true);
        tv.setGravity(Gravity.CENTER);

        if (player != null) {
            ImageLoader.getInstance().displayImage(player.image, iv);
            tv.setText(player.name);
        } else {
            tv.setText(isBench ? "후보 " + (index + 1) : (index == 0 ? "GK" : "선수 " + (index + 1)));
            tv.setTextColor(Color.parseColor("#94A3B8"));
        }

        layout.addView(iv);
        layout.addView(tv);

        layout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openPlayerSelectDialog(index, isBench);
            }
        });

        return layout;
    }

    private void openPlayerSelectDialog(final int slotIndex, final boolean isBench) {
        final Dialog dialog = new Dialog(this);
        dialog.setContentView(R.layout.dialog_select_player);
        dialog.getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, dpToPx(520));

        TextView tvTitle = (TextView) dialog.findViewById(R.id.tv_dialog_title);
        tvTitle.setText((isBench ? "후보 " + (slotIndex + 1) : "선발 슬롯 " + (slotIndex + 1)) + " 선수 선택");

        EditText etDialogSearch = (EditText) dialog.findViewById(R.id.et_dialog_search);
        ListView listDialog = (ListView) dialog.findViewById(R.id.list_dialog_players);

        final List<PlayerData> dialogFiltered = new ArrayList<PlayerData>(allPlayers);
        final PlayerAdapter dialogAdapter = new PlayerAdapter(this, dialogFiltered);
        listDialog.setAdapter(dialogAdapter);

        etDialogSearch.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            @Override public void onTextChanged(CharSequence s, int start, int before, int count) {
                String q = s.toString().trim().toLowerCase();
                dialogFiltered.clear();
                for (PlayerData p : allPlayers) {
                    if (q.isEmpty() || p.name.toLowerCase().contains(q) || p.position.toLowerCase().contains(q)) {
                        dialogFiltered.add(p);
                    }
                }
                dialogAdapter.notifyDataSetChanged();
            }
            @Override public void afterTextChanged(Editable s) {}
        });

        listDialog.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                PlayerData chosen = dialogFiltered.get(position);
                if (isBench) {
                    benchSlots[slotIndex] = chosen;
                } else {
                    startingEleven[slotIndex] = chosen;
                }
                renderPitchSlots();
                dialog.dismiss();
            }
        });

        dialog.findViewById(R.id.btn_dialog_clear_slot).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isBench) benchSlots[slotIndex] = null;
                else startingEleven[slotIndex] = null;
                renderPitchSlots();
                dialog.dismiss();
            }
        });

        dialog.show();
    }

    private void saveTactics() {
        SharedPreferences sp = getSharedPreferences("inazuma_tactics", MODE_PRIVATE);
        SharedPreferences.Editor editor = sp.edit();
        editor.putString("formation", currentFormation);
        for (int i = 0; i < 11; i++) {
            editor.putString("start_" + i, startingEleven[i] != null ? startingEleven[i].id : "");
        }
        for (int i = 0; i < 5; i++) {
            editor.putString("bench_" + i, benchSlots[i] != null ? benchSlots[i].id : "");
        }
        editor.apply();
        Toast.makeText(this, "💾 전술 스쿼드가 저장되었습니다!", Toast.LENGTH_SHORT).show();
    }

    private void loadSavedTactics() {
        SharedPreferences sp = getSharedPreferences("inazuma_tactics", MODE_PRIVATE);
        currentFormation = sp.getString("formation", "4-4-2");
        for (int i = 0; i < 11; i++) {
            String id = sp.getString("start_" + i, "");
            startingEleven[i] = findPlayerDataById(id);
        }
        for (int i = 0; i < 5; i++) {
            String id = sp.getString("bench_" + i, "");
            benchSlots[i] = findPlayerDataById(id);
        }
    }

    private void resetTactics() {
        for (int i = 0; i < 11; i++) startingEleven[i] = null;
        for (int i = 0; i < 5; i++) benchSlots[i] = null;
        renderPitchSlots();
        Toast.makeText(this, "🔄 전술판이 초기화되었습니다.", Toast.LENGTH_SHORT).show();
    }

    private PlayerData findPlayerDataById(String id) {
        if (id == null || id.isEmpty()) return null;
        for (PlayerData p : allPlayers) {
            if (p.id.equals(id)) return p;
        }
        return null;
    }

    private int dpToPx(int dp) {
        return (int) (dp * getResources().getDisplayMetrics().density + 0.5f);
    }
}`, 'utf8');

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

execSync(`"${JAVA}" -jar "${APKSIGNER_JAR}" sign --ks "${keystorePath}" --ks-pass pass:inazuma123 --ks-key-alias inazuma --key-pass pass:inazuma123 --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true --out "${finalApkPath}" "${alignedApk}"`);

execSync(`"${JAVA}" -jar "${APKSIGNER_JAR}" verify --verbose "${finalApkPath}"`);

console.log('🎉 전술판 + 50개 페이징 + 바텀 네비게이션 탑재 순수 네이티브 APK 빌드 완료!');
console.log('👉 산출물 파일:', finalApkPath);
