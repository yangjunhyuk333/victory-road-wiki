# 📱 이나즈마 스테이션 모바일 & 태블릿 앱 (Flutter)

이나즈마 일레븐 빅토리로드 5,400+ 선수 도감 및 스마트 축구 전술판 스튜디오의 Flutter 크로스플랫폼 모바일/태블릿 전용 애플리케이션입니다.

---

## 🌟 주요 특징

1. **📱 스마트폰 모바일 화면 (`< 768px`)**:
   - 현대적인 플로팅 글래스모피즘 **바텀 네비게이션 바** 탑재
   - 홈(Home), 캐릭터 도감(Zukan), 전술판(Tactics), 설정(Settings) 4대 핵심 탭
   - 원터치 스쿼드 배치 & 스와이프 제스처 최적화

2. **💻 태블릿 & 데스크톱 대화면 (`≥ 768px`)**:
   - 웹사이트 및 윈도우 데스크톱 앱과 100% 동일한 **상단 와이드 툴바 + 2-Column 대화면 에디터 레이아웃**
   - 아이패드 스플릿 뷰 및 대화면 멀티태스킹 지원

3. **⚽ 전 기능 완벽 포팅**:
   - 5,400+ 선수 DB 실시간 검색, 속성(화/풍/림/산), 포지션(GK/DF/MF/FW) 필터
   - 8종 포메이션(4-4-2, 4-3-3, 3-5-2 등) 및 중앙선 자동 정렬
   - 전술 JSON 파일 내보내기/불러오기 웹/데스크톱 상호 호환

---

## 🚀 빌드 및 실행 방법

### 1. 사전 요구사항
* Flutter SDK 3.0.0 이상
* Dart SDK 3.0.0 이상

### 2. 의존성 설치
```bash
cd flutter_app
flutter pub get
```

### 3. 디바이스별 실행 및 빌드

#### 📱 Android (갤럭시) APK 빌드:
```bash
flutter build apk --release
# 생성 위치: build/app/outputs/flutter-apk/app-release.apk
```

#### 🍏 iOS / iPadOS (아이폰, 아이패드) 빌드:
```bash
flutter build ipa --release
```

#### 💻 웹 및 데스크톱 실행:
```bash
flutter run -d chrome
flutter run -d windows
```
