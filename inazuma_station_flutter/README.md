# 📱 이나즈마 스테이션 모바일 공식 앱 (Flutter)

이나즈마 일레븐 빅토리로드 5,400+ 선수 도감 및 스마트 축구 전술판 스튜디오의 **Flutter 전용 모바일/태블릿 네이티브 크로스플랫폼 애플리케이션**입니다.

---

## 🌟 모바일 전용 UI/UX 핵심 특징

1. **📱 스마트폰 모바일 화면 (`< 768px`)**:
   - 현대적인 글래스모피즘 **플로팅 바텀 네비게이션 바** 적용.
   - 원터치 선수 교체 바텀 시트 및 터치 반응형 축구장 전술 보드.
   - 8종 포메이션(4-4-2, 4-3-3, 3-5-2 등) 및 중앙선 자동 정렬.
   - 전술 JSON 파일 내보내기/불러오기 지원.

2. **💻 태블릿 & 대화면 (`≥ 768px`)**:
   - 웹사이트/데스크톱과 동일한 대화면 스튜디오 2-Column 레이아웃 자동 적응.

---

## 🚀 APK 및 IPA 빌드 방법

### 1. 사전 요구사항
* Flutter SDK 3.0.0+ / Dart SDK 3.0.0+

### 2. 의존성 설치
```bash
cd inazuma_station_flutter
flutter pub get
```

### 3. Android (갤럭시) APK 빌드
```bash
flutter build apk --release
# 빌드 산출물: build/app/outputs/flutter-apk/app-release.apk
```

### 4. iOS / iPadOS (아이폰, 아이패드) 빌드
```bash
flutter build ipa --release
```
