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

### 사전 준비
- Python 3.10 이상
- OpenAI API 키

### 백엔드 실행

```bash
# 의존성 설치
pip install -r db_chatbot/requirements.txt

# 환경 변수 설정
export OPENAI_API_KEY=your_openai_api_key_here

# 서버 실행
cd db_chatbot && uvicorn web_api:app --host 127.0.0.1 --port 8001
```

서버가 실행되면 `http://127.0.0.1:8001/health` 에서 `{"ok": true}` 응답을 확인할 수 있습니다.

### 프론트엔드 실행

VS Code의 **Live Server** 확장을 사용하여 프로젝트 루트에서 실행합니다.

```
프로젝트 루트에서 Live Server 실행
→ templatemo_607_glass_admin/index.html 열기
```

> 로컬 실행 시 채팅 API는 `http://127.0.0.1:8001/api/chat` 으로 자동 연결됩니다.

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

## XYZ 가설 (Fake Door 테스트)

**가설**: 브랜드 상세 정보를 확인한 사용자 중 **20%** 가 AI 분석 리포트를 신청할 것이다.

- **분모 (Y)**: `visitors` 시트의 방문자 수
- **분자 (Z)**: `tab_final` 시트에서 `wanted_feature = "AI 분석 리포트"` 인 행 수
- **검정 방법**: 단일 비율 Z-검정 (단측)

---

## 데이터 출처

공정거래위원회 가맹사업거래의 공정화에 관한 법률에 따른 가맹 공개 정보 (정보공개서 데이터)
