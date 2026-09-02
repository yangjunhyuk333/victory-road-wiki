# 이나즈마 스테이션 코드 감사 및 리디자인 정의서

> 작성일: 2026-09-01  
> 대상: `victory-road-wiki` 현재 `main` 브랜치  
> 범위: 웹 SPA, 선수 데이터, 전술판, Firebase 규칙, Electron/Android 패키징, 저장소 구조, 반응형 UI  
> 원칙: 이 문서는 분석 결과이며 애플리케이션 코드는 변경하지 않았다.

## 1. 결론

현재 프로젝트는 React/Vite 빌드가 성공하고 선수 도감·전술판의 기본 흐름도 동작한다. 다만 공개 배포를 계속하기 전에 처리해야 할 보안 문제 2건이 있고, README에 적힌 기능과 실제 제품 범위가 크게 어긋나며, 데이터 정확성·저장 안정성·모바일 UX·접근성·초기 번들 크기에 출시 차단급 문제가 남아 있다.

가장 안전한 실행 순서는 다음과 같다.

1. 노출된 Cloudflare 자격증명과 Android 서명 키를 즉시 폐기·회전하고 Git 전체 이력을 정리한다.
2. 손상된 데이터나 전술 파일이 운영 데이터와 사용자 저장소를 덮어쓰지 못하도록 스키마 검증과 복구 경계를 만든다.
3. Electron·Firestore·의존성 보안 경계를 보강한다.
4. 선수 데이터를 목록/상세로 분리하고 표시명 인덱스와 목록 가상화를 적용한다.
5. 전술판을 도메인 상태, 저장소, 파일 입출력, UI 컴포넌트로 분해한다.
6. 공통 디자인 시스템 위에서 도감→상세→전술 추가 흐름과 모바일 전술판을 리디자인한다.

## 2. 현재 구조와 검증 결과

### 2.1 실제 제품 구조

```text
App (HashRouter)
├─ Home                  전체 선수 JSON + 로컬 전술 최근 목록
├─ Zukan                 전체 선수 JSON + 검색/필터/누적 렌더
├─ PlayerDetail          전체 선수 JSON + 상세/런타임 번역
├─ Tactics               전체 선수 JSON + 편집/저장/가져오기/내보내기
└─ Settings              별도 테마 상태

미연결 코드
├─ Login / Profile / Board
├─ Firebase Auth / Firestore UI
└─ AppDownloadModal

배포·패키징
├─ Vite/Cloudflare 정적 웹
├─ Electron file:// 셸
├─ 순수 Android 생성 스크립트와 산출물
└─ 별도 Flutter 앱 디렉터리
```

근거: `src/App.jsx:4-9`, `src/App.jsx:131-146`.

### 2.2 실행 검증

| 항목 | 결과 |
|---|---|
| `npm run build` | 성공, Vite 대형 청크 경고 |
| 배포 JS | 실제 3,538,735 bytes, gzip 870~875KB, Brotli 606,724 bytes |
| CSS | 약 22KB raw, gzip 약 4.84KB |
| `npm run lint` | 실패, 생성물까지 검사하여 4,862 problems |
| `src` + `electron` 대상 lint | 140 errors, 3 warnings |
| `npm audit --omit=dev` | 총 14건: critical 2, high 11, moderate 1 |
| 자동화 테스트/CI | 테스트 스크립트와 CI 없음 |
| 선수 데이터 | 5,407건, 4,235,385 bytes, ID 중복 0, 공통 스키마 유지 |
| 실제 화면 검증 | 1440px 데스크톱, 390×844 모바일에서 홈/도감/전술 모달 확인 |

측정값은 2026-09-01 현재 lockfile과 로컬 빌드 기준이다.

## 3. P0 — 즉시 보안 조치

### SEC-001 Cloudflare 계정 자격증명 평문 노출

- 위치: `scripts/cloudflare_deploy_automation.mjs:21-25`.
- Git에 추적 중이며 origin은 GitHub 저장소를 가리킨다. 비밀번호 값은 이 문서에 재기록하지 않는다.
- 영향: 계정 탈취, 배포·DNS 변조, 동일 비밀번호 재사용 계정 확산 가능성.

조치 순서:

1. Cloudflare 비밀번호를 즉시 변경하고 기존 세션·토큰을 모두 폐기한다.
2. MFA와 계정 활동 기록을 확인한다.
3. `cf_login_step.png`, `cf_after_login.png`도 계정 정보 노출 여부를 확인한다.
4. 브라우저 로그인 자동화를 제거하고 Wrangler API token/OIDC/CI secret 방식으로 교체한다.
5. 현재 파일 삭제로 끝내지 말고 Git 전체 이력에서 비밀을 제거한 뒤 협업자 재클론까지 수행한다.

완료 기준: 저장소와 이력에서 자격증명 탐지가 0건이고, 폐기된 비밀번호·토큰으로 로그인할 수 없어야 한다.

### SEC-002 Android 릴리스 서명 키와 암호 노출

- 추적 파일: `temp_android_build/release.keystore`.
- 키 생성·서명: `scripts/build_official_apk.mjs:20-22`, `scripts/build_official_apk.mjs:1991-2000`.
- 스크립트는 키 암호를 평문으로 전달하며 빌드 시 키를 재생성하는 경로도 갖는다.
- 영향: 같은 패키지명의 악성 APK를 공식 서명처럼 배포할 수 있고, 매 빌드 새 키라면 정상 업데이트도 기존 설치본 위에 설치되지 않을 수 있다.

조치 순서:

1. 새 APK 배포를 잠시 중단하고 현재 키가 사용된 배포 채널과 설치 사용자 유무를 확인한다.
2. 현재 키를 손상된 키로 간주한다.
3. Play App Signing/signing lineage가 가능하면 공식 키 교체 절차를 사용하고, 직접 배포 앱이면 새 package ID 또는 재설치 마이그레이션을 설계한다.
4. 장기 릴리스 키는 저장소 밖의 OS 키 저장소·CI secret·HSM에 1회 생성해 보관한다.
5. keystore와 암호를 Git 전체 이력에서 제거한다.

완료 기준: CI/릴리스 환경 외부에 개인 키가 없고, 동일 버전 재빌드 시 서명 계보와 업데이트 전략이 재현 가능해야 한다.

## 4. P1 — 다음 배포 전에 수정

### DATA-001 데이터 수집 파이프라인의 부분 덮어쓰기

`scripts/scrape_zukan.mjs:28-31`은 페이지 수를 고정하고, `:70-81`은 페이지 실패 후 계속 진행하며, `:84-96`은 성공 페이지 수·ID 집합·감소율 검증 없이 운영 `characters.json`을 바로 덮어쓴다. 공식 사이트 구조 변경이나 일시적 실패 한 번으로 선수 수백 명이 빠진 파일이 정상 데이터처럼 게시될 수 있다.

수정 정의:

- 스크랩 결과를 staging 파일에 저장한다.
- 페이지 자동 탐색과 페이지별 재시도를 사용하고 한 페이지라도 실패하면 전체 작업을 실패시킨다.
- 이전 버전 대비 레코드 감소율, ID 중복, 필수 필드, enum, appearances 길이, 이름 문자 패턴을 검증한다.
- 검증 통과 후에만 atomic rename으로 운영 파일을 교체한다.
- `officialName`, `kana`, `nameKo`, `aliases`를 분리하고 공식 원본을 파괴적으로 덮어쓰지 않는다.
- 데이터 버전, 수집 시각, 원본 URL, checksum을 함께 생성한다.

### DATA-002 실제 데이터 오표시와 번역 훼손

- appearances의 `-`가 163명, 총 1,467칸 존재하지만 상세 UI는 `○`가 아닌 모든 값을 `미등장 (×)`으로 표시한다: `src/pages/PlayerDetail.jsx:561-586`.
- 164명은 element/position/gender/category 등이 `-`인데 상세에 `-속성`, 포지션 `-`처럼 노출된다.
- 이름에는 ASCII 혼입 147건, 낱자 자모 24건, 일본 문자 잔존 574건이 있어 검수 큐가 필요하다. 예: `하야미 마h하`, `바ーㄴ`.
- build-time에 이미 정제된 `description_ko`를 런타임에서 다시 `refineTranslation`한다: `src/pages/PlayerDetail.jsx:30-33`. 비멱등 규칙 때문에 실제 데이터에 `진짜다다다` 같은 누적 손상이 있다.
- 한글 설명의 일본 문자 잔존도 17건이다.

수정 정의:

- `-`를 `null/unknown`으로 정규화하고 appearances는 `appeared | absent | unknown` 삼상태로 렌더링한다.
- 검수 완료 `description_ko`는 그대로 출력하고 정제는 build-time 1회로 제한한다.
- `refine(refine(text)) === refine(text)` 전수 테스트를 추가한다.
- `description_ja`, `description_ko_machine`, `description_ko_reviewed`, `translationVersion/status`를 분리한다.
- 문자 혼입·반복어·미상 enum을 데이터 검증 리포트로 만든다. ASCII/일본 문자는 합법적인 고유명도 있으므로 자동 삭제하지 않는다.

### TAC-001 전술 저장·가져오기에서 데이터 손상 가능

- ID와 동일 제목을 하나의 갱신 조건으로 섞어 다른 문서를 조용히 덮어쓸 수 있다: `src/pages/Tactics.jsx:661-665`, `:796-800`.
- 임의 JSON을 타입·범위·버전 검증 없이 사용한다: `src/pages/Tactics.jsx:1029-1051`, `:1110-1145`.
- 렌더는 `positions`가 배열이라고 가정한다: `src/pages/Tactics.jsx:1461`.
- 홈은 렌더 중 localStorage를 다시 무방비 파싱해 손상 데이터가 있으면 blank screen이 될 수 있다: `src/pages/Home.jsx:146`.
- 자동 저장은 기본 ON으로 보이지만 신규 전술에는 편집 ID가 없어 실제 저장되지 않는다: `src/pages/Tactics.jsx:177-184`, `:504-508`, `:1377-1408`.

수정 정의:

- 수정 대상은 ID로만 확정하고 제목 충돌은 `취소/덮어쓰기/복제`를 명시적으로 선택하게 한다.
- `TacticDocument`에 `schemaVersion`을 두고 JSON Schema 또는 Zod로 파일 크기, 타입, 11개 슬롯, 좌표 0~100, 선수 ID, 버전을 검증한다.
- 가져오기 전에 미리보기와 충돌 목록을 보여주고 잘못된 항목만 격리한다.
- 저장소 접근을 `TacticsRepository`로 모으고 migration, backup, recovery UI를 제공한다.
- 신규 문서는 `저장되지 않음`, 기존 문서는 `저장 중/저장됨/오류` 상태를 정확히 표시한다.
- route error boundary와 손상된 로컬 데이터 복구 동선을 추가한다.

### SEC-003 Electron 보안 경계 복구

- `electron/main.cjs:22-27`에서 `webSecurity: false`.
- `electron/main.cjs:35-42`는 HTTP(S) 외 스킴을 새 창으로 허용할 수 있고 동일 창 탐색 제한도 없다.
- 원격 이미지와 번역 API를 사용하므로 원격 콘텐츠 변조 시 위험이 커진다.

수정 정의:

- `webSecurity: true`, `sandbox: true`, `nodeIntegration: false`, `contextIsolation: true`를 기본값으로 고정한다.
- 새 창은 기본 deny하고 `new URL()`로 검증한 HTTPS allowlist만 `shell.openExternal`한다.
- `will-navigate`로 앱 문서 이외 탐색을 차단한다.
- file 셸 대신 안전한 custom protocol 또는 로컬 origin을 검토한다.
- 웹과 Electron 모두 CSP를 추가하고 필요한 이미지 CDN만 허용한다.
- 런타임 번역 API를 제거하거나 IPC/서버 프록시로 격리한다.

### SEC-004 Firestore 규칙의 작성자 위조·소유권 이전

- 게시글 create는 로그인만 확인해 다른 UID를 `authorUid`로 넣을 수 있다: `firestore.rules:10-14`.
- tactics/formations update는 기존 문서의 `userUid`만 확인해 새 문서의 UID 변경을 막지 않는다: `firestore.rules:26-27`, `:38-39`.
- 허용 필드, 문자열 타입·길이, timestamp 검증도 없다.

수정 정의:

- create에서 작성자 UID와 인증 UID 일치를 강제한다.
- update에서 새 UID가 기존 UID와 인증 UID에 모두 일치하게 한다.
- `keys().hasOnly`, 타입·길이·timestamp 검증을 추가한다.
- Rules Emulator 테스트, 페이지네이션, 쓰기 제한·신고 정책을 준비한다.
- Firebase 클라이언트 API key는 공개 식별자이므로 키 숨김보다 규칙·API 제한·App Check가 핵심이다.

### DEP-001 알려진 의존성 취약점

2026-09-01 `npm audit --omit=dev` 기준 critical 2/high 11/moderate 1이다. 직접 의존성 중 `react-router-dom@7.13.1`, `puppeteer@24.37.5`가 수정 대상이고, Firebase 계열 transitive에 `protobufjs`, `websocket-driver`가 포함된다. 현재 Firebase UI는 미연결이고 Puppeteer는 자동화 도구라 배포 도달성은 제한적일 수 있으므로, 실제 경로를 확인하면서 업데이트해야 한다.

수정 정의:

- Router는 회귀 테스트 후 감사가 제시한 수정 버전 이상으로 올린다.
- Firebase를 살릴지 제거할지 먼저 결정하고 유지 시 SDK와 transitive를 업데이트한다.
- Puppeteer와 크롤링·번역 도구는 `devDependencies`로 이동하고 업데이트한다.
- Dependabot/Renovate와 lockfile 기반 audit를 CI에 추가한다.

### A11Y-001 핵심 흐름의 키보드·스크린리더 차단

- 도감 카드, 전술 슬롯, 선수 선택 결과가 클릭 가능한 `div`다: `src/pages/Zukan.jsx:204-208`, `src/pages/Tactics.jsx:1466-1477`, `:2077-2080`.
- 모달에 `role="dialog"`, `aria-modal`, focus trap, Escape 닫기, 원래 포커스 복귀가 없다: `src/pages/Tactics.jsx:2002-2051`.
- 토스트에 `aria-live`가 없다: `src/pages/Tactics.jsx:2155-2161`.
- 기본 outline을 없앴지만 `:focus-visible` 대체가 없다: `src/index.css:192-205`.
- 문서 언어가 `en`이고 사용자 확대를 차단한다: `index.html:2`, `index.html:9`.
- 15×15px 삭제 버튼 등 터치 목표가 지나치게 작다: `src/index.css:1177-1197`.

수정 정의:

- 도감 카드는 `<Link>`, 슬롯·선수 행은 `<button>`으로 변경한다.
- 필터는 `aria-pressed`, 탭은 `aria-selected`, 현재 내비게이션은 `aria-current`를 사용한다.
- 공용 Dialog primitive로 focus trap, Escape, focus restore, 배경 스크롤 잠금을 제공한다.
- `lang="ko"`, 확대 제한 제거, `:focus-visible`, `prefers-reduced-motion`, 주요 목표 최소 44px를 적용한다.
- axe serious/critical 0건과 전 흐름 키보드 완주를 완료 기준으로 둔다.

### UX-001 모바일 모달 레이어 충돌

선수 선택 오버레이는 `z-index: 2000`, 모바일 하단바는 `9999`여서 실제 390×844 화면에서 하단바가 모달을 덮었다: `src/pages/Tactics.jsx:2002-2013`, `src/index.css:1241-1259`. Escape를 눌러도 모달이 닫히지 않았고 DOM에 dialog 역할도 0개였다.

수정 정의: 레이어 토큰을 `base/sticky/dropdown/overlay/modal/toast`로 통일하고, 모달 중 하단바를 숨기거나 모달보다 낮게 둔다.

## 5. P2 — 성능·구조 개선

### PERF-001 초기 단일 번들 분리

모든 라우트가 eager import되고 Home/Zukan/Tactics/PlayerDetail이 전체 JSON을 직접 import한다: `src/App.jsx:4-9`, 각 페이지 상단 import. 현재 JS는 raw 약 3.54MB, gzip 약 875KB, Brotli 약 607KB다.

분리 측정 결과 전체 선수 데이터는 Brotli 약 533KB, 목록용 필드만 남긴 summary index는 약 187KB였다. 목록/상세 분리만으로 데이터 부분 약 346KB Brotli를 줄일 여지가 있다.

권장 구조:

- `players-index.json`: id, 표시명, kana, nickname, thumbnail, element, position, category, team, series, 정규화 검색 토큰.
- `players-detail-XX.json`: 설명·등장 기록 등 상세 데이터를 ID 범위 또는 시리즈별 shard로 제공.
- `PlayerRepository`: Promise cache, `playersById`, `displayNameById`, 공통 검색 인덱스를 한 번만 구축.
- `React.lazy`/route lazy로 Tactics·PlayerDetail·미연결 Firebase 기능을 분리.
- 코드를 변경하지 않은 선수 데이터는 독립 content hash asset으로 장기 캐시.

성능 예산:

- 앱 셸 initial JS gzip 250KB 이하(선수 데이터 제외).
- 홈은 전체 5,407명 상세 데이터를 초기 로드하지 않는다.
- 카탈로그 진입 후 검색 가능 상태 LCP 2.5초 이하(Fast 4G 기준 목표).

### PERF-002 O(n²) 표시명 계산과 무가상화 목록

`getPlayerDisplayName`은 카드마다 5,407명을 다시 filter한다: `src/utils/playerHelpers.js:254-269`, 호출 `src/pages/Zukan.jsx:278`. 전부 노출하면 29,235,649회 비교이며 로컬 순수 JS 측정은 341~450ms였다. 이름 count Map 구축은 약 2ms였다.

`src/pages/Zukan.jsx:86-106`, `:198-309`의 무한 스크롤은 페이지가 아니라 DOM 누적이라 최종 5,407개 카드와 이미지를 유지한다. README의 “가상화 페이지네이션”과 다르다.

수정 정의:

- build-time 또는 repository 초기화 시 name count와 최종 display label을 O(n)으로 만든다.
- `@tanstack/react-virtual` 또는 동급 도구로 행 단위 가상화한다.
- 임시 단계에서는 실제 페이지네이션 + `content-visibility:auto`를 사용한다.
- 화면 주변 DOM을 100~150개 이하로 유지한다.
- `PlayerCard`를 공용 컴포넌트로 분리하고 정적 class와 `React.memo`를 사용한다.

### PERF-003 검색·이미지·런타임 번역 통합

- Zukan/Home/Tactics의 검색 필드와 정규화 방식이 서로 다르다: `src/pages/Zukan.jsx:57-79`, `src/pages/Home.jsx:75-89`, `src/pages/Tactics.jsx:197-211`.
- Zukan은 search term의 소문자화도 선수 루프 안에서 반복한다.
- 전술 모달은 40px 표시를 위해 256×256 PNG 50장을 eager load한다: `src/pages/Tactics.jsx:2073-2111`.
- 전체 이미지는 외부 CloudFront에 의존해 “완전 오프라인” 설명과 다르다.
- 5,407명 모두 `description_ko`가 있고 팀 193개도 매핑돼 정상 상세에서 외부 번역 호출은 불필요하다.

수정 정의:

- 공통 NFKC/소문자/공백 정규화 검색 인덱스를 사용하고 kana·별칭·팀·시리즈·포지션을 동일하게 검색한다.
- 필요 시 한국어 초성 토큰을 추가하고 `useDeferredValue` 또는 Web Worker를 사용한다.
- 목록·전술 모달은 64~96px WebP/AVIF thumbnail, 상세은 256px 파생 이미지를 사용한다.
- 이미지에 `loading="lazy"`, `decoding="async"`, width/height를 지정한다.
- 런타임 번역과 “다시 번역”을 제거한다. 유지 시 AbortController, timeout, player ID 경합 검사, 서버 캐시를 적용한다.
- 자체 호스팅 이미지만 offline cache 대상으로 명시하고 README 표현을 실제 수준에 맞춘다.

### ARCH-001 전술판 2,210줄 모놀리스 분해

`src/pages/Tactics.jsx:114-184`에 상태/ref가 집중되고, 자동 저장 `:497-598`, 수동 저장 `:647-708`, 파일 입출력 `:920-1188`, 캔버스와 모달까지 한 컴포넌트가 담당한다.

권장 구조:

```text
src/features/tactics/
├─ model/tacticSchema
├─ model/tacticsEditorReducer
├─ persistence/localTacticsRepository
├─ hooks/useAutoSave
├─ hooks/useImportExport
├─ hooks/useFormationPointerDrag
├─ components/FormationCanvas
├─ components/Bench
├─ components/PlayerPicker
├─ components/Inspector
└─ components/TacticsLibrary
```

- 상태 전이는 `useReducer` 명령으로 통일하고 Undo/Redo가 가능한 history를 둔다.
- 저장 문서에는 player ID를 원본으로 저장하고, 삭제된 선수 대비 최소 snapshot만 fallback으로 둔다.
- `crypto.randomUUID()`와 명시적 schema migration을 사용한다.
- 마우스/터치 코드는 Pointer Events로 합치고 unmount cleanup을 보장한다.

### ARCH-002 테마·미연결 기능·공용 UI 정리

- App과 Settings가 별도 테마 상태를 갖는다: `src/App.jsx:104-119`, `src/pages/Settings.jsx:4-19`.
- Board/Login/Profile은 라우트와 auth observer가 없고 AppDownloadModal도 import만 된다.
- core 화면에 인라인 style object가 최소 266개(Tactics 93, Home 76, PlayerDetail 53, Zukan 35, App 9)라 반응형과 상태 스타일이 분산된다.

수정 정의:

- `ThemeProvider` 한 곳에서 DOM attribute와 storage를 관리한다.
- Firebase/게시판/프로필/다운로드를 정식 제품 범위로 복원할지 삭제할지 먼저 결정한다.
- `PlayerCard`, `FilterBar`, `Button`, `Dialog`, `Drawer`, `Toast`, `EmptyState`와 레이어·간격·색·반경 토큰을 공용화한다.
- CSS Modules 또는 일관된 feature stylesheet로 hover/focus/disabled를 class variant로 관리한다.

### QA-001 lint·테스트·배포 게이트 복구

- `eslint.config.js:8`이 `dist`만 제외해 백업·생성 번들까지 검사한다.
- source lint에도 중복 객체 키 `src/utils/playerHelpers.js:219-220`, hook dependency, unused imports 등 실제 문제가 있다.
- 테스트와 데이터 검증 스크립트가 없다: `package.json:9-18`.

수정 정의:

- `**/dist/**`, `InazumaStation_App/**`, `temp_*/**`, `backup/**`를 lint에서 제외한다.
- source lint 0 errors를 만든 뒤 build/lint/test를 CI 필수 체크로 둔다.
- Vitest/RTL: 검색 인덱스, display label, reducer, autosave, migration, 번역 멱등성.
- Playwright: 도감 URL 상태, 상세→전술 추가, 저장/복구, 잘못된 JSON, 모바일 모달 레이어, 키보드 흐름.
- Firebase Emulator: 모든 규칙의 허용/거부 케이스.
- `validate:data`와 번들 size budget을 배포 필수 단계로 추가한다.

### REPO-001 생성물·중복 앱 저장소 정리

저장소는 Android 임시 객체 77개, keystore, 서로 다른 APK 2개, backup zip, `characters_backup.json`, Flutter 앱, Electron 산출물을 함께 추적한다. working tree의 추적 파일은 약 28.9MB이고 Git object DB는 약 190MB다.

수정 정의:

- 생성 APK/zip/스크린샷/temp build는 GitHub Release 또는 CI artifact로 이동한다.
- `apps/web`, `apps/electron`, `apps/android`와 `packages/data` 모노레포 구조 또는 별도 저장소 중 하나를 선택한다.
- Electron 빌드 도구를 custom packager와 electron-builder 중 하나로 통일한다.
- `wrangler.jsonc`와 `wrangler.toml` 중 하나만 canonical config로 둔다.
- 백업은 Git 이력과 Release로 대체하고 미사용 Vite/React 샘플 자산을 제거한다.

## 6. 문서와 실제 기능의 불일치

| README 주장 | 실제 구현 | 결정 필요 |
|---|---|---|
| 속성(무 포함)·포지션·성별 필터 | 속성 4종과 포지션만 있고 무/성별/팀/시리즈/카테고리 필터 없음 | 기능 추가 또는 문서 축소 |
| 가상화 페이지네이션 | 60개씩 DOM에 계속 누적 | 실제 가상화로 교체 |
| 선수 드래그 앤 드롭 | 드래그는 선수 교환이 아니라 슬롯 좌표 이동 | 표현 수정 또는 선수 swap 구현 |
| 등번호·이름·스탯 관리 | 데이터에 stats 필드가 전혀 없고 해당 편집 UI도 없음 | 데이터 확보 전까지 약속 제거 |
| 전술 이미지 저장·공유 | JSON import/export만 있음 | 이미지 export/share 구현 또는 문서 수정 |
| Firebase 로그인·보안 | Login/Profile/Board가 현재 라우트에 없음, 전술은 localStorage | 제품 범위 결정 |
| 인터넷 없이 데스크톱 사용 | 선수 초상화와 번역 경로가 원격 의존 | 오프라인 캐시/로컬 자산 또는 문구 수정 |
| 모바일·PC 완벽 대응 | 모바일 툴바·모달·도감 밀도·접근성 문제 확인 | 리디자인 필요 |

근거: `README.md:13-25`, `README.md:38`, 실제 라우트 `src/App.jsx:131-146`.

## 7. 리디자인 정의

### 7.1 핵심 사용자 흐름

현재 `도감 → 상세 → /tactics 이동`은 선수 정보를 넘기지 않는다: `src/pages/PlayerDetail.jsx:260-275`.

목표 흐름:

```text
인물 탐색
→ 선수 상세 확인
→ “전술에 추가”
→ 기존 전술/새 전술 선택
→ 권장 슬롯 선택
→ 다음 빈 슬롯으로 이동
→ 저장 상태 확인
```

완료 기준:

- 상세 CTA가 `playerId`를 전달한다.
- 이미 배치된 선수, 포지션 불일치, 비선수 카테고리를 명확히 처리한다.
- 11명 구성 중 현재 진행률과 저장 상태를 항상 볼 수 있다.

### 7.2 정보 구조

현재 데이터에는 선수 5,085명 외 감독 94, 매니저 47, 코치 13, 미분류 164, 기타 4가 포함돼 있다. “선수 도감”과 실제 데이터가 맞지 않는다.

권장:

- 상위 명칭은 `인물 도감`.
- 1차 탭: `선수 / 감독·코치 / 매니저·기타`.
- 선수 필터: 포지션, 속성, 성별, 팀, 시리즈.
- 활성 필터 칩, 전체 초기화, 결과 수, 정렬, URL 동기화.
- 중복 표시명 177그룹/469명을 위해 시리즈·팀·폼·도감 ID 보조 라벨을 사용한다. `？？？` 61명은 별도 미공개 상태로 표시한다.

### 7.3 선수 도감

데스크톱:

- 상단 고정 검색·필터 또는 좌측 필터 rail.
- 결과 영역에 grid/list·밀도 전환.
- 카드에 이름, 버전/시리즈, 팀, 포지션, 속성을 계층적으로 표시.
- 카드 보조 액션: 상세, 즐겨찾기, 전술에 추가.

모바일:

- 큰 히어로를 축소하고 첫 화면에 검색과 결과를 함께 노출.
- 세부 필터는 바텀시트로 이동.
- 현재 1열 약 320px 카드 대신 88px 썸네일 리스트 또는 2열 압축 카드.
- 상세에서 돌아왔을 때 URL·스크롤·필터 상태 복원.

### 7.4 선수 상세

- 상단: 초상화, 정확한 variant label, 포지션·속성·팀·시리즈.
- 주 CTA: `이 선수를 전술에 추가`.
- 등장 기록은 등장/미등장/미상 삼상태 타임라인.
- 한국어 검수 설명과 일본어 원문을 명확히 분리.
- stats 데이터가 생기기 전에는 빈 능력치 UI를 만들지 않는다.
- 이전/다음 선수와 최근 본 선수 동선을 제공한다.

### 7.5 전술판

데스크톱 3영역:

```text
선수 패널 | 경기장 캔버스 | 속성·저장·전술 라이브러리 패널
```

- 선수 패널은 모달 대신 지속적으로 열어 11번 반복되는 열기/검색/닫기 작업을 없앤다.
- 슬롯을 선택하면 역할·포지션에 맞는 선수를 우선 추천한다.
- 선수 drag/swap, 다음 빈 슬롯, 중복 경고, 포지션 불일치, 선발 `7/11`을 제공한다.
- 상단 command bar는 새 전술, Undo/Redo, 저장, 복제, 내보내기를 제공한다.
- 저장 상태는 `저장되지 않음 / 저장 중 / 저장됨 / 오류` 네 상태로 표시한다.
- 저장함은 미리보기, 복제, 이름 변경, 삭제, JSON export를 제공한다.

모바일:

- 한 줄 압축 명령바에서 `저장`만 주 액션으로 유지하고 import/export/reset은 더보기로 이동.
- 경기장을 화면에 맞추고 roster는 슬롯 문맥을 유지하는 바텀시트로 연다.
- `주전 / 벤치 / 저장함`을 별도 탭·시트로 전환한다.
- 후보 가로 스크롤에는 다음 항목이 있음을 보여주는 peek/indicator를 둔다.
- 모바일 저장 목록의 큰 고정 min-height를 제거한다.
- 모달이 열리면 하단 내비게이션을 숨기거나 올바른 레이어에 둔다.

### 7.6 시각 시스템

- 깊은 네이비: 앱 기본 표면.
- 경기장 그린: 전술판 캔버스에만 사용.
- 일렉트릭 블루: 주 행동.
- 빅토리 골드: 브랜드·중요 강조에 제한.
- 속성색: 데이터 의미에만 사용하고 텍스트 대비를 WCAG AA에 맞춘다.
- 반경 `8/12/16px`, 간격 `4/8/12/16/24/32px`, 본문 최소 14~16px, 배지 최소 12px.
- 과도한 glass/gradient/`transition: all`을 줄이고 스포츠 데이터 도구처럼 정보 대비를 우선한다.
- 초상화는 `contain`/`cover` 정책을 용도별로 통일한다.

## 8. 단계별 실행 계획과 완료 기준

### Phase 0 — 보안 격리

- SEC-001, SEC-002 완료.
- secret scan 결과 0건.
- 기존 APK 사용자에 대한 서명 교체 전략 문서화.

### Phase 1 — 정확성·안정성

- DATA-001/002, TAC-001, SEC-003/004, DEP-001 완료.
- 데이터 감소·손상 시 publish 실패.
- 손상된 localStorage와 잘못된 JSON에서도 앱이 복구 화면을 제공.
- appearances 미상 1,467칸이 정확히 구분됨.

### Phase 2 — 구조·성능

- route/data split, O(1) 표시명, 가상화, 공통 검색 인덱스.
- 화면 주변 DOM 150개 이하.
- 앱 셸 initial JS gzip 250KB 이하 목표.
- source lint 0 errors, unit/integration/E2E 기본 게이트 통과.

### Phase 3 — 핵심 리디자인

- 도감→상세→전술 추가 흐름 완결.
- desktop 3-pane, mobile bottom sheet 전술 편집.
- 모든 핵심 흐름 키보드 완주 및 axe serious/critical 0건.
- 주요 지표: 첫 선수 배치 시간, 11명 완성률, 모바일 저장 완료율.

### Phase 4 — 선택 기능

- 즐겨찾기, 비교, 최근 본 선수, 저장 필터.
- 전술 이미지 export, 공유 링크, 읽기 전용 공개 전술.
- 계정 동기화, 버전 기록, 팀·시리즈 기반 추천과 자동 완성.

## 9. 가장 먼저 구현할 작업 묶음

보안 조치가 끝난 뒤 첫 개발 묶음은 아래 정도가 적절하다.

1. `TacticDocument` 스키마와 안전한 repository/import validator.
2. 데이터 validator와 appearances/번역 정합성 수정.
3. route lazy + player summary/detail split + 표시명 Map.
4. 도감 URL 상태와 가상화 목록.
5. 공용 Dialog/Button/PlayerCard와 모바일 레이어 수정.
6. 상세 `전술에 추가` 전달과 Tactics reducer 기반 연결.
7. CI build/lint/test/data validation/size budget.

이 순서를 따르면 리디자인 전에 보안·데이터·저장 경계를 먼저 안정화하면서도, 이후 UI를 다시 뜯어낼 가능성을 줄일 수 있다.
