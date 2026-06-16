# 프랜차이즈 브랜드 인텔리전스 허브

공정거래위원회 가맹 공개 정보를 기반으로 프랜차이즈 브랜드를 탐색하고, AI에게 창업 관련 질문을 할 수 있는 웹 서비스입니다.

---

## 서비스 URL

| 구분 | URL |
|------|-----|
| 프론트엔드 (Netlify) | https://dapper-sawine-fc3471.netlify.app/|
| 백엔드 API (Render) | https://swai-8vm2.onrender.com |

---

## 주요 기능

### 1단계 — 관심 설정 (`index.html`)
- 관심 업종 다중 선택
- 창업 예산 범위 설정 (프리셋 칩 + 듀얼 슬라이더)

### 2단계 — 브랜드 탐색 (`brands.html`)
- 필터링된 브랜드 목록 (업종·예산 기준)
- 브랜드 상세 정보: 점포 수, 평균 매출, 성장률, 폐점률, 창업 비용 상세
- 브랜드 저장 / 즐겨찾기
- 브랜드 비교 (최대 2개 동시 비교)
- 필터 실시간 수정
- **AI 분석 리포트 신청 (Fake Door)**

### 3단계 — AI 상담 (`chat.html`)
- 브랜드 선택 후 자연어로 질문
- LangChain 기반 AI가 실제 DB 데이터를 참조하여 답변
- 저장한 브랜드 빠른 선택

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프론트엔드 | HTML / CSS / Vanilla JS |
| 백엔드 | Python 3, FastAPI, uvicorn |
| AI | LangChain + OpenAI GPT-4.1 mini |
| 데이터 | 공정거래위원회 가맹 공개 정보 (Excel → JSON) |
| 데이터 수집 | Google Sheets + Google Apps Script (JSONP) |
| 프론트엔드 배포 | Netlify |
| 백엔드 배포 | Render (Python Web Service) |

---

## 로컬 실행 방법

### 1. 저장소 클론

```bash
git clone https://github.com/yerincho04/SWAI.git
cd SWAI
```

### 2. 사전 준비
- Python 3.10 이상 필요 (`python3 --version` 으로 확인)
- OpenAI API 키 필요

### 3. 백엔드 실행

```bash
# 가상환경 생성 및 활성화 (권장)
python3 -m venv venv

# Mac / Linux
source venv/bin/activate

# Windows
venv\Scripts\activate

# 의존성 설치 (프로젝트 루트에서 실행)
pip install -r db_chatbot/requirements.txt

# 환경 변수 설정
# Mac / Linux
export OPENAI_API_KEY=your_openai_api_key_here

# Windows
set OPENAI_API_KEY=your_openai_api_key_here

# 서버 실행 (프로젝트 루트에서 실행)
cd db_chatbot && uvicorn web_api:app --host 127.0.0.1 --port 8001
```

서버가 실행되면 브라우저에서 `http://127.0.0.1:8001/health` 접속 시 `{"ok": true}` 가 표시됩니다.

### 4. 프론트엔드 실행

> **사전 준비**: VS Code에 **Live Server** 확장 설치 필요

1. VS Code에서 프로젝트 루트 폴더(`SWAI`)를 열기
2. `templatemo_607_glass_admin/index.html` 파일을 열기
3. 우하단 **Go Live** 버튼 클릭 (또는 우클릭 → Open with Live Server)
4. 브라우저에서 자동으로 `http://127.0.0.1:5500/templatemo_607_glass_admin/index.html` 열림

> **참고**: 브랜드 데이터 JSON 파일(`templatemo_607_glass_admin/data/`)은 저장소에 포함되어 있으므로 별도 빌드 스크립트 실행 불필요합니다.

> **참고**: 로컬 실행 시 채팅 API는 `http://127.0.0.1:8001/api/chat` 으로 자동 연결됩니다 (`app-config.js` 기본값).

---

## 사용 방법 (서비스 흐름)

> 배포된 서비스 기준: https://dapper-sawine-fc3471.netlify.app

### 1단계 — 관심 설정 (`index.html`)

1. 페이지에 접속하면 관심 업종 칩이 자동으로 로드됩니다 (공정위 데이터 기반)
2. 원하는 **업종을 하나 이상 클릭** (복수 선택 가능, 선택 안 하면 전체 표시)
3. **창업 예산**을 프리셋 칩으로 빠르게 선택하거나 슬라이더로 직접 범위를 설정
4. **추천 브랜드 보기** 버튼 클릭 → 2단계로 이동

### 2단계 — 브랜드 탐색 (`brands.html`)

1. 설정한 조건에 맞는 브랜드 목록이 좌측에 표시됩니다
2. 브랜드 카드를 클릭하면 우측 패널에 **상세 정보**가 표시됩니다
   - 점포 수, 평균 매출, 성장률, 폐점률, 이탈률, 창업 총비용
   - 창업 비용 상세 (가맹비 / 보증금 / 교육비 / 기타)
   - 연도별 추이 테이블
3. **필터 수정** 버튼으로 업종·예산 조건을 변경할 수 있습니다
4. ♡ **저장** 버튼으로 관심 브랜드를 즐겨찾기에 추가합니다 (새로고침 후에도 유지)
5. ⊕ **비교** 버튼으로 최대 2개 브랜드를 나란히 비교합니다
6. **📊 AI 리포트 신청** 버튼 클릭 → 이메일 입력 후 신청 (Fake Door)
7. **AI에게 물어보기 →** 버튼 클릭 → 3단계로 이동 (해당 브랜드 자동 선택)

### 3단계 — AI 상담 (`chat.html`)

1. 상단 드롭다운에서 분석할 브랜드를 선택합니다
   - 검색창에 브랜드명 또는 업종을 입력하면 목록이 필터링됩니다
   - 저장한 브랜드는 빠른 선택 칩으로 표시됩니다
2. 2단계에서 넘어온 경우 브랜드가 자동으로 선택됩니다
3. 질문 예시 칩 클릭 또는 직접 입력 후 **질문하기** 버튼 클릭
4. AI가 실제 공정위 데이터를 조회하여 답변합니다 (응답 시간: 약 5~15초)
5. 첫 응답은 서버 부팅으로 최대 30초 소요될 수 있습니다

### 로컬 실행 시 주의사항

- **채팅 기능**: 백엔드(`uvicorn`)가 실행 중이어야 작동합니다. `http://127.0.0.1:8001/health` 에서 `{"ok": true}` 확인 후 사용하세요.
- **구글 시트 연동**: 로컬에서는 `app-config.js`의 `sheetScriptUrl`이 비어 있어 방문자 로그 및 리포트 신청이 저장되지 않습니다. 브랜드 탐색·AI 채팅 기능은 정상 작동합니다.
- **데이터 파일**: `templatemo_607_glass_admin/data/` 폴더에 JSON 파일이 포함되어 있으므로 별도 전처리 불필요합니다.

---

## 환경 변수

### 백엔드 (Render)

| 변수명 | 설명 |
|--------|------|
| `OPENAI_API_KEY` | OpenAI API 키 |
| `HOST` | 바인딩 호스트 (Render: `0.0.0.0`) |

### 프론트엔드 (Netlify)

| 변수명 | 설명 |
|--------|------|
| `CHAT_API_URL` | 백엔드 채팅 엔드포인트 URL |
| `SHEET_SCRIPT_URL` | Google Apps Script 배포 URL |
| `SURVEY_TABLE` | 설문 데이터 시트명 |
| `VISITORS_TABLE` | 방문자 로그 시트명 |

---

## 프로젝트 구조

```
├── db_chatbot/
│   ├── web_api.py          # FastAPI 서버 (POST /api/chat)
│   ├── chat_app.py         # LangChain 단일 라운드 챗봇
│   ├── data_access.py      # 브랜드 데이터 로딩 및 쿼리
│   ├── tools.py            # LangChain 툴 정의
│   ├── requirements.txt    # Python 의존성
│   ├── api_data/           # 원본 Excel 데이터
│   └── build_api_selected/ # 전처리된 JSON 데이터
├── templatemo_607_glass_admin/
│   ├── index.html          # 1단계: 관심 설정 (온보딩)
│   ├── brands.html         # 2단계: 브랜드 탐색
│   ├── chat.html           # 3단계: AI 상담
│   ├── app-config.js       # 환경 변수 주입 (Netlify 빌드 시 생성)
│   └── data/               # 프론트엔드용 JSON (Netlify 빌드 시 복사)
├── scripts/
│   └── prepare_netlify.py  # Netlify 빌드 전처리 스크립트
├── netlify.toml            # Netlify 빌드 설정
└── RENDER_DEPLOY.md        # Render 배포 가이드
```

---

## 주요 코드 파일 설명

### 프론트엔드

- `templatemo_607_glass_admin/index.html`
  - 사용자가 관심 업종과 창업 예산을 선택하는 첫 화면입니다.
  - 선택한 조건은 `localStorage`의 `brandhub_prefs`에 저장되고, 이후 `brands.html`에서 필터로 사용됩니다.

- `templatemo_607_glass_admin/brands.html`
  - 브랜드 목록, 상세 정보, 저장, 비교, 필터 수정 기능을 담당합니다.
  - `templatemo_607_glass_admin/data/` 안의 JSON 파일을 읽어 최신 브랜드 통계와 창업 비용을 화면에 표시합니다.
  - AI 리포트 신청 버튼은 실제 기능 출시 전 수요를 확인하기 위한 Fake Door 테스트입니다.

- `templatemo_607_glass_admin/chat.html`
  - 사용자가 브랜드를 선택하고 질문을 입력하는 AI 상담 화면입니다.
  - `app-config.js`의 `chatApiUrl` 값을 사용해 백엔드 `/api/chat` 엔드포인트로 요청을 보냅니다.

- `templatemo_607_glass_admin/app-config.js`
  - 프론트엔드에서 사용할 API 주소와 Google Apps Script 주소를 저장하는 설정 파일입니다.
  - Netlify 배포 시 `scripts/prepare_netlify.py`가 환경 변수 값을 읽어 자동 생성합니다.

### 백엔드

- `db_chatbot/web_api.py`
  - FastAPI 서버 진입점입니다.
  - `GET /health`로 서버 상태를 확인하고, `POST /api/chat`으로 사용자 질문을 처리합니다.

- `db_chatbot/chat_app.py`
  - LangChain과 OpenAI 모델을 이용해 챗봇 응답을 생성합니다.
  - 질문 의도에 따라 브랜드 개요, 비교, 조건 검색, 추이 분석 도구를 호출합니다.

- `db_chatbot/data_access.py`
  - 브랜드 데이터를 불러오고 검색하는 핵심 데이터 계층입니다.
  - 브랜드명 매칭, 연도별 통계 조회, 창업 비용 조회, 브랜드 비교, 조건 검색, 추이 분석 로직이 들어 있습니다.

- `db_chatbot/tools.py`
  - `data_access.py`의 기능을 LangChain 도구 형태로 감싸는 파일입니다.
  - AI가 직접 데이터를 추측하지 않고 정해진 도구를 통해 실제 데이터만 조회하도록 연결합니다.

### 데이터 처리 및 배포

- `db_chatbot/scripts/build_from_api_selected_json.py`
  - 공정위 API에서 수집한 selected JSON 파일을 프론트엔드와 백엔드가 사용하기 쉬운 정규화 JSON으로 변환합니다.
  - 결과는 `db_chatbot/build_api_selected/` 폴더에 저장됩니다.

- `db_chatbot/api_data/`
  - 공정위 API 데이터를 수집하는 스크립트와 원본/선택 데이터가 들어 있습니다.
  - 브랜드 기본 정보, 점포 통계, 창업 비용, 본사 통계, 인테리어 비용 데이터를 각각 수집합니다.

- `scripts/prepare_netlify.py`
  - Netlify 배포 전에 필요한 JSON 데이터를 프론트엔드 `data/` 폴더로 복사합니다.
  - `CHAT_API_URL`, `SHEET_SCRIPT_URL` 등 배포 환경 변수를 읽어 `app-config.js`를 생성합니다.

## 코드 실행 흐름

1. 사용자가 `index.html`에서 업종과 예산을 선택합니다.
2. 선택 조건이 브라우저 `localStorage`에 저장됩니다.
3. `brands.html`이 브랜드 JSON 데이터를 불러와 조건에 맞는 브랜드를 보여줍니다.
4. 사용자가 브랜드를 선택하면 상세 통계, 창업 비용, 연도별 추이가 표시됩니다.
5. `chat.html`에서 질문을 입력하면 프론트엔드가 `web_api.py`의 `/api/chat`으로 요청을 보냅니다.
6. `chat_app.py`가 LangChain 도구를 호출하고, `data_access.py`가 실제 브랜드 데이터를 조회합니다.
7. OpenAI 모델이 조회된 데이터만 근거로 한국어 답변을 생성해 프론트엔드로 반환합니다.

---

## XYZ 가설 (Fake Door 테스트)

**가설**: 브랜드 상세 정보를 확인한 사용자 중 **20%** 가 AI 분석 리포트를 신청할 것이다.

- **분모 (Y)**: `visitors` 시트의 방문자 수
- **분자 (Z)**: `tab_final` 시트에서 `wanted_feature = "AI 분석 리포트"` 인 행 수
- **검정 방법**: 단일 비율 Z-검정 (단측)

---

## 데이터 출처

공정거래위원회 가맹사업거래의 공정화에 관한 법률에 따른 가맹 공개 정보 (정보공개서 데이터)
