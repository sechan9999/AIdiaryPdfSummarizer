/**
 * AI PDF Summarizer - Core Logic
 * Collaborated by Backend Architect & AI Integration Specialist
 */

// ==================== Configuration ====================
const CONFIG = {
    API_BASE_URL: 'https://openrouter.ai/api/v1',
    // 교체: DeepSeek 무료 버전 불안정 -> 구글 Gemini 2.0 Flash Thinking (무료, 고성능)
    MODEL: 'meta-llama/llama-3.1-8b-instruct:free',
    FALLBACK_MODEL: 'microsoft/phi-3-medium-128k-instruct:free', // 예비용 무료 모델
    MAX_CHARS: 25000, // Gemini Context 윈도우 고려하여 조정
};

// PDF.js Worker 설정 (CDN)
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// State
const state = {
    apiKey: localStorage.getItem('openrouter_api_key') || '',
    isProcessing: false,
    extractedText: ''
};

// ==================== 1. PDF Processing (Backend Arch) ====================

/**
 * PDF 파일에서 텍스트 추출
 * @param {File} file 
 */
async function extractTextFromPDF(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let fullText = '';

        // 페이지별 텍스트 추출 (최대 10페이지까지만 제한하여 성능 보호)
        const maxPages = Math.min(pdf.numPages, 20); // 20페이지 제한

        for (let i = 1; i <= maxPages; i++) {
            updateStatus(`페이지 읽는 중... (${i}/${pdf.numPages})`);
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += `[Page ${i}]\n${pageText}\n\n`;
        }

        if (pdf.numPages > maxPages) {
            fullText += `\n...(위 내용은 전체 ${pdf.numPages}페이지 중 ${maxPages}페이지만 추출되었습니다)...`;
        }

        return fullText;
    } catch (error) {
        console.error('PDF Parsing Error:', error);
        throw new Error('PDF 파일을 읽는 중 오류가 발생했습니다. 암호가 걸려있거나 손상된 파일인지 확인해주세요.');
    }
}

// ==================== 2. AI Summarization (AI Expert) ====================

/**
 * 텍스트 요약 요청
 * @param {string} text 
 */
async function summarizeText(text) {
    if (!state.apiKey) throw new Error('API 키가 필요합니다.');

    // 텍스트 길이 최적화 (토큰 절약)
    const truncatedText = text.length > CONFIG.MAX_CHARS
        ? text.substring(0, CONFIG.MAX_CHARS) + "\n...(내용이 너무 길어 일부만 전송됩니다)..."
        : text;

    const systemPrompt = `
당신은 학술 논문 및 비즈니스 보고서를 전문적으로 분석하는 '수석 연구원 AI'입니다.
제공된 텍스트 내용을 바탕으로 핵심을 완벽하게 파악할 수 있도록 요약해주세요.

다음 마크다운(Markdown) 형식을 엄격히 준수하여 출력하세요:

# [문서의 주제/제목 한 줄 요약]

## 💡 3줄 핵심 요약
- (핵심 내용 1)
- (핵심 내용 2)
- (핵심 내용 3)

## 📝 상세 분석
(주요 챕터나 포인트 별로 불릿 포인트 사용하여 300자 내외로 서술)

## 🔑 주요 키워드
\`키워드1\`, \`키워드2\`, \`키워드3\`

---
*AI Smart Summary*
`;

    async function callApi(model, messages) {
        const response = await fetch(`${CONFIG.API_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.apiKey}`,
                'HTTP-Referer': window.location.href
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                temperature: 0.3
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || `API Error (${response.status})`);
        }
        return response.json();
    }

    try {
        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: truncatedText }
        ];

        let data;
        try {
            // 1차 시도: 메인 모델
            data = await callApi(CONFIG.MODEL, messages);
        } catch (e) {
            console.warn(`Primary model (${CONFIG.MODEL}) failed, trying fallback...`, e);
            // 2차 시도: 예비 모델
            updateStatus('기본 모델 응답 지연으로 예비 모델로 전환합니다...', false);
            data = await callApi(CONFIG.FALLBACK_MODEL, messages);
        }

        return data.choices[0]?.message?.content || '요약 내용을 생성하지 못했습니다.';

    } catch (error) {
        console.error('Final AI Error:', error);
        throw new Error(`AI 분석 실패: ${error.message}. 다른 무료 모델을 시도해보세요.`);
    }
}

// ==================== 3. Controller (Event Handlers) ====================

async function handleFileUpload(file) {
    if (!file || file.type !== 'application/pdf') {
        alert('PDF 파일만 업로드 가능합니다.');
        return;
    }

    if (!state.apiKey) {
        openKeyModal();
        return;
    }

    setLoading(true);
    showResultSection(false);

    try {
        // 1. Text Extraction
        updateStatus('PDF 내용을 텍스트로 변환하고 있습니다...');
        const text = await extractTextFromPDF(file);
        state.extractedText = text;

        // 2. AI Summarization
        updateStatus('AI가 문서를 분석하고 요약하는 중입니다... (10~20초 소요)');
        const summary = await summarizeText(text);

        // 3. Render
        renderResult(summary);

    } catch (error) {
        alert(`오류 발생: ${error.message}`);
        updateStatus('작업이 중단되었습니다.', true);
    } finally {
        setLoading(false);
    }
}

// Helper Functions
function updateStatus(msg, isError = false) {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = msg;
    statusEl.style.color = isError ? 'red' : '#666';
}

function saveApiKey(key) {
    state.apiKey = key;
    localStorage.setItem('openrouter_api_key', key);
    updateApiStatusUI();
}
