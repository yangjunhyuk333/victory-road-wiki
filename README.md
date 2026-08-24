# ⚡ 이나즈마 스테이션 (Inazuma Station)
> **이나즈마일레븐: 영웅들의 빅토리 로드** 공식 데이터 기반 위키 & 전술판 웹/데스크톱 서비스

![이나즈마 스테이션 로고](./public/logo.png)

---

## 🌟 주요 기능

1. **⚡ 5,407명 전 선수 공식 대백과 (도감 DB)**
   - 레벨5 공식 도감(`zukan.inazuma.jp`) 데이터 기반 전 선수 수록
   - 100% 원작 발음 한글 음독 표기 (엔도 마모루, 고엔지 슈야 등)
   - 속성(풍/림/화/산/무), 포지션(GK/DF/MF/FW), 성별 실시간 검색 및 필터링
   - 가상화 페이지네이션으로 5,000명 대용량 데이터 초고속 렌더링

2. **⚽ 나만의 전술판 (Tactics Board)**
   - 포메이션(4-4-2, 4-3-3, 3-5-2 등) 선택 및 선수 드래그 앤 드롭 배치
   - 필드 위 선수 실시간 교체, 등번호/이름/스탯 관리
   - 완성된 전술 포메이션 이미지 저장 및 공유 기능

3. **🔒 Firebase 인증 및 보안**
   - 이메일 회원가입/로그인 및 Google 소셜 로그인 지원
   - 사용자별 프로필 설정 및 안전한 데이터 관리

4. **📱 모바일 & PC 반응형 완벽 대응**
   - 스마트폰, 태블릿, PC 전 해상도에 최적화된 스포티 블루 & 골드 테마

---

## 🚀 사용 및 접속 방법

### 1. 24시간 웹 접속 (서버 불필요, 어디서나 접속)
* **공식 웹사이트**: [https://yangjunhyuk333.github.io/victory-road-wiki/](https://yangjunhyuk333.github.io/victory-road-wiki/)
* **도감 바로가기**: [https://yangjunhyuk333.github.io/victory-road-wiki/#/zukan](https://yangjunhyuk333.github.io/victory-road-wiki/#/zukan)
* **전술판 바로가기**: [https://yangjunhyuk333.github.io/victory-road-wiki/#/tactics](https://yangjunhyuk333.github.io/victory-road-wiki/#/tactics)

### 2. 윈도우 독립 데스크톱 프로그램 (.exe)
인터넷이 없어도 내 컴퓨터에서 더블 클릭만으로 바로 실행됩니다.
* **실행 파일 위치**: `dist_app/이나즈마 스테이션-win32-x64/이나즈마 스테이션.exe`
* 또는 프로젝트 폴더의 `이나즈마스테이션_실행.bat` 더블 클릭

---

## 🛠️ 개발 및 명령어 안내

```bash
# 1. 의존성 패키지 설치
npm install

# 2. 로컬 개발 서버 실행 (코드 수정 실시간 미리보기)
npm run dev

# 3. 프로덕션 빌드 (dist 생성)
npm run build

# 4. GitHub Pages 웹 배포 (한 번에 빌드 및 라이브 배포)
npm run deploy

# 5. 윈도우 데스크톱 실행 프로그램(.exe) 패키징
npm run electron:build
```

---

## 📁 프로젝트 폴더 구조

```text
victory-road-wiki/
├── electron/                 # Electron 데스크톱 앱 메인/프리로드 프로세스
├── public/                   # 로고 및 정적 에셋
├── scripts/                  # 배포, 빌드 및 도감 데이터 처리 스크립트
│   ├── build_electron.mjs    # 윈도우 .exe 초고속 패키징 스크립트
│   ├── deploy.mjs            # GitHub Pages 자동 배포 스크립트
│   ├── hangulify_engine.mjs  # 100% 한글 자모 음독 합성 엔진
│   ├── scrape_zukan.mjs      # 공식 도감 크롤러
│   └── merge_and_transliterate.mjs
├── src/
│   ├── data/                 # 5,407명 캐릭터 JSON 데이터베이스
│   ├── pages/                # 홈, 도감, 전술판, 게시판, 로그인, 프로필 등
│   ├── config/               # Firebase 설정
│   ├── utils/                # 헬퍼 유틸리티
│   ├── App.jsx               # 상단 네비게이션 및 라우팅 (HashRouter)
│   └── index.css             # 모바일 반응형 전역 스타일시트
├── dist_app/                 # 완성된 윈도우 데스크톱 독립 실행 프로그램 (.exe)
└── 이나즈마스테이션_실행.bat  # 윈도우 원클릭 실행 런처
```
