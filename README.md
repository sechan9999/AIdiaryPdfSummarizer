# 🤖 AI Web Apps Collection

인공지능 에이전트 팀과 함께 개발한 **AI 웹 애플리케이션 모음**입니다. OpenRouter API와 최신 LLM(DeepSeek, Gemini, Llama)을 활용하여 순수 JavaScript(Vanilla JS)로 구현되었습니다.

## 🚀 포함된 애플리케이션

### 1. 🌱 AI 공감 다이어리 (AI Empathy Diary)
오늘 하루의 이야기를 적으면 AI 상담가가 감정을 분석하고 따뜻한 위로와 조언을 건네줍니다.
- **실행 파일**: `index.html`
- **주요 기능**: 
  - 감정 분석 (Emotion Analysis) 및 컬러 태깅
  - 따뜻한 공감 메시지 및 조언 생성
  - 로컬 스토리지에 일기 데이터 저장 (프라이버시 보호)

### 2. 📑 AI PDF 요약기 (AI PDF Summarizer)
긴 PDF 문서를 업로드하면 AI가 핵심 내용을 빠르게 읽고 요약해줍니다.
- **실행 파일**: `index_pdf.html`
- **주요 기능**:
  - 브라우저 내 PDF 텍스트 추출 (Serverless)
  - 3줄 요약, 상세 분석, 주요 키워드 추출
  - Drag & Drop 파일 업로드

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **AI Model Integration**: 
  - API: [OpenRouter](https://openrouter.ai/)
  - Models: DeepSeek R1/V3, Gemini 2.0 Flash Thinking, Llama 3
- **Libraries**:
  - `pdf.js` (PDF Parsing)
  - `marked.js` (Markdown Rendering)

---

## 👥 AI Agent Team
이 프로젝트는 5명의 전문 AI 에이전트 워크플로우에 의해 기획되고 개발되었습니다. (`.agent/workflows/`)

1. **👔 Product Manager**: 제품 기획 및 PRD 작성
2. **⚙️ Backend Architect**: 시스템 설계 및 API 로직 구현
3. **🎨 Frontend Developer**: UI/UX 디자인 및 구현
4. **🧠 AI Expert**: LLM 프롬프트 최적화 및 파이프라인 구축
5. **🐞 QA Engineer**: 품질 검증 및 테스트

---

## 🏁 사용 방법 (Getting Started)

1. 이 저장소를 클론하거나 다운로드합니다.
   ```bash
   git clone https://github.com/sechan9999/AIdiaryPdfSummarizer.git
   ```
2. 무료 [OpenRouter API 키](https://openrouter.ai/keys)를 발급받습니다.
3. 실행하려는 앱의 HTML 파일(`index.html` 또는 `index_pdf.html`)을 브라우저에서 엽니다.
4. 우측 상단의 **설정(Settings)** 버튼을 눌러 API 키를 입력합니다.
   - 키는 브라우저의 `localStorage`에만 저장되며 외부로 전송되지 않습니다.

---

## 📝 라이선스
MIT License
