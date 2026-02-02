/**
 * AI Empathy Diary - Logic Layer
 * Designed by Backend Architect Agent
 */

const CONFIG = {
    API_BASE_URL: 'https://openrouter.ai/api/v1',
    // 무료이면서 성능이 좋은 DeepSeek 모델 사용 (V3/R1 계열)
    MODEL: 'meta-llama/llama-3.3-70b-instruct:free',
    APP_NAME: 'AI Empathy Diary',
    SITE_URL: window.location.href
};

// State Management
const state = {
    apiKey: localStorage.getItem('openrouter_api_key') || '',
    diaries: JSON.parse(localStorage.getItem('empathy_diaries') || '[]'),
    isAnalyzing: false
};

// ==================== API Service ====================

/**
 * OpenRouter API 호출
 * @param {string} userDiary - 사용자의 일기 내용
 * @returns {Promise<Object>} - 감정 분석 결과 및 위로 메시지
 */
async function analyzeDiaryWithAI(userDiary) {
    if (!state.apiKey) {
        throw new Error('API 키가 설정되지 않았습니다.');
    }

    const systemPrompt = `
당신은 따뜻하고 사려 깊은 'AI 심리 상담가'입니다. 
사용자가 하루의 일기를 작성하면, 그 내용에 담긴 감정을 섬세하게 분석하고, 진심 어린 공감과 위로의 말을 건네주세요.

응답은 반드시 아래의 JSON 형식으로만 출력해야 합니다 (마크다운 코드 블록 없이 순수 JSON만):

{
  "emotion": "핵심 감정 키워드 (예: 지침, 뿌듯함, 우울함, 설렘)",
  "color": "감정을 대표하는 색상 코드 (예: #FFD700, #4682B4)",
  "empathy_message": "사용자의 상황에 깊이 공감하는 따뜻한 메시지 (3-4문장)",
  "advice": "내일을 위한 부드러운 제안이나 마음가짐 (1-2문장)"
}

주의사항:
1. 사용자의 마음에 상처를 주지 않도록 항상 부드럽고 존중하는 어조를 사용하세요.
2. 기계적인 답변보다는 친구처럼 다정하게 반응해주세요.
3. JSON 형식을 엄격히 준수하세요.
`;

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.apiKey}`,
                'HTTP-Referer': CONFIG.SITE_URL,
                'X-Title': CONFIG.APP_NAME
            },
            body: JSON.stringify({
                model: CONFIG.MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userDiary }
                ],
                temperature: 0.7 // 적절한 창의성과 안정성 균형
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || 'API 요청 실패');
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) throw new Error('AI 응답이 비어있습니다.');

        return parseAIResponse(content);

    } catch (error) {
        console.error('AI Analysis Error:', error);
        throw error;
    }
}

/**
 * AI 응답 파싱 (JSON 추출)
 */
function parseAIResponse(content) {
    try {
        // 혹시 모를 마크다운 코드 블록 제거
        const jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (e) {
        // 파싱 실패 시 기본 구조 반환 (Fallback)
        console.warn('JSON Parsing Failed, using fallback:', content);
        return {
            emotion: "복합적인 기분",
            color: "#A9A9A9",
            empathy_message: content, // 원문 그대로 메시지로 사용
            advice: "오늘 하루도 정말 고생 많으셨어요. 편안한 밤 보내세요."
        };
    }
}

// ==================== Local Storage Service ====================

function saveDiary(diary) {
    const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        timestamp: new Date().toISOString(),
        ...diary
    };

    state.diaries.unshift(newEntry);
    localStorage.setItem('empathy_diaries', JSON.stringify(state.diaries));
    return newEntry;
}

function getDiaries() {
    return state.diaries;
}

function deleteDiary(id) {
    state.diaries = state.diaries.filter(d => d.id !== id);
    localStorage.setItem('empathy_diaries', JSON.stringify(state.diaries));
}

function saveApiKey(key) {
    state.apiKey = key;
    localStorage.setItem('openrouter_api_key', key);
}
