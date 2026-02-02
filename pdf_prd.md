# 📄 AI PDF Summarizer - PRD

## 1. 개요 (Overview)
- **제품명**: AI PDF 요약기 (Smart PDF Summary)
- **목표**: 사용자가 긴 PDF 문서를 읽지 않고도 핵심 내용을 빠르게 파악할 수 있도록 AI가 요약해주는 웹 서비스.
- **타겟 사용자**: 논문/보고서를 많이 읽는 연구자, 학생, 직장인.

## 2. 사용자 스토리 (User Stories)
1. 사용자는 PDF 파일을 드래그&드롭으로 쉽게 업로드할 수 있어야 한다.
2. 시스템은 업로드된 PDF에서 텍스트를 추출한다.
3. AI는 추출된 텍스트를 분석하여 '핵심 요약', '주요 키워드', '결론'으로 구조화된 결과를 제공한다.
4. 사용자는 결과 요약문을 복사하거나 다시 생성할 수 있다.

## 3. 기능 명세 (Functional Specs)

### 3.1 파일 업로드 (Frontend & Backend)
- **입력**: PDF 파일 (.pdf), 최대 10MB.
- **UI**: Drag & Drop 영역, 파일 선택 버튼.
- **처리**: Client-side에서 `pdf.js`를 사용하여 텍스트 추출 (서버 부하 최소화 및 개인정보 보호).

### 3.2 AI 요약 (AI & Backend)
- **모델**: DeepSeek V3/R1 (OpenRouter API).
- **프롬프트 전략**:
  - 역할: 전문 분석가.
  - 출력 형식: Markdown (타이틀, 3줄 요약, 상세 내용, 키워드).
  - 제한: 토큰 제한을 고려하여 텍스트가 너무 길 경우 자동 분할(Chunking) 또는 전처리.

### 3.3 결과 표시 (Frontend)
- **UI**: 마크다운 렌더링 지원 (가독성 확보).
- **기능**: 요약 내용 클립보드 복사 버튼.

## 4. UI/UX 디자인 가이드
- **컨셉**: 'Clean & Intellectual'. 신뢰감을 주는 블루/그레이 톤.
- **레이아웃**: 좌측(또는 상단) 업로드, 우측(또는 하단) 실시간 결과 표시.

## 5. 기술 스택 Constraint
- **Frontend**: HTML5, CSS3, Vanilla JS.
- **Library**: PDF.js (PDF Parsing), Marked.js (Markdown Rendering).
- **API**: OpenRouter (DeepSeek).
