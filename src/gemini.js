// Gemini API Handler
import { GoogleGenerativeAI } from '@google/generative-ai';

// WARNING: Hardcoding API keys in client-side code is not secure for production.
// This is done per user request for a local/personal project.
const API_KEY = 'AIzaSyCqamZjyNPC5aq2VtefkOK53FnuGh_MffI';

export class GeminiClient {
    constructor(apiKey = API_KEY) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.apiKey = apiKey;
    }

    async generateReport(userInfo, knowledgeBase) {
        const prompt = `
당신은 전문 사주 상담가 '안티그래비티'입니다. 
사용자의 사주 정보를 바탕으로, 제공된 지식 베이스를 참고하여 심층적인 운세 보고서를 작성해주세요.

[사용자 정보]
- 이름: ${userInfo.name}
- 생년월일(양력): ${userInfo.solarYmd}
- 생년월일(음력): ${userInfo.lunarYmd}
- 기준연도: ${userInfo.refYear}
- 사주번호(양력): ${userInfo.sajuSolar}
- 사주번호(음력): ${userInfo.sajuLunar}
- 해운번호(양력): ${userInfo.haeunSolar}
- 해운번호(음력): ${userInfo.haeunLunar}

[지식 베이스]
${knowledgeBase}

[요청 사항]
1. 사용자의 사주번호와 해운번호에 해당하는 내용을 지식 베이스에서 찾아 해석해주세요.
2. 말투는 신비롭지만 친절하고 전문적인 어조를 사용해주세요. (예: "~입니다", "~합니다")
3. 결과는 Markdown 형식으로 작성해주세요.
4. 다음 항목들을 포함해주세요:
    - 🌟 총평 (핵심 요약)
    - 👤 타고난 성향 (사주번호 분석)
    - 📅 올해의 흐름 (해운번호 분석)
    - 💡 개운법 및 조언 (행운의 숫자, 장소 등 활용)
    - ✨ 특별한 메시지

보고서를 작성해주세요.
        `;

        // User requested "gemini-3-pro-preview".
        // We will try this specific version first, then others as fallback.
        const modelsToTry = ['gemini-3-pro-preview', 'gemini-1.5-pro-002', 'gemini-1.5-pro', 'gemini-pro'];

        for (const modelName of modelsToTry) {
            try {
                console.log(`Attempting to generate report with model: ${modelName}`);
                const model = this.genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                return response.text();
            } catch (error) {
                console.warn(`Failed with model ${modelName}:`, error.message);

                // If this was the last model, throw a detailed error
                if (modelName === modelsToTry[modelsToTry.length - 1]) {
                    console.error("All models failed.");
                    // Extract the status code if possible
                    const status = error.message.match(/\[(\d+)\]/)?.[1] || 'Unknown';
                    let userMsg = `모든 모델(${modelsToTry.join(', ')}) 접근에 실패했습니다. (오류코드: ${status})`;

                    if (status === '404') {
                        userMsg += '\n\n원인: API Key가 해당 모델을 사용할 권한이 없거나, 모델명이 유효하지 않습니다.\nGoogle AI Studio에서 "Generative Language API"가 활성화되어 있는지 확인해주세요.';
                    } else if (status === '400') {
                        userMsg += '\n\n원인: 잘못된 요청입니다. API Key가 유효한지 확인해주세요.';
                    }

                    throw new Error(userMsg);
                }
            }
        }
    }
}
