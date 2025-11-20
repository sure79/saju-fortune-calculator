/**
 * Main UI Controller
 * app.js와 sajuMatching.js를 연결하여 UI를 제어합니다
 */
import {
    getNameNumbers,
    sajuMeanings,
    haeunMeanings
} from './app.js';
import * as SajuMatching from './sajuMatching.js';
import { analyzeSaju } from './sajuAnalyzer.js';
import { marked } from 'marked';
import { GeminiClient } from './gemini.js';



// DOM Elements
const form = document.getElementById('calc-form');
const solarYmdEl = document.getElementById('solarYmd');
const lunarYmdEl = document.getElementById('lunarYmd');
const refYearEl = document.getElementById('refYear');
const nameEl = document.getElementById('name');
const resultsWrap = document.getElementById('results');
const emptyState = document.getElementById('emptyState');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');
const resetBtn = document.getElementById('resetBtn');

// New DOM Elements for AI Report
const btnAiReport = document.getElementById('btnAiReport');
const apiKeyModal = document.getElementById('apiKeyModal');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
const apiKeyClose = document.getElementById('apiKeyClose');
const reportModal = document.getElementById('reportModal');
const reportContent = document.getElementById('reportContent');
const reportClose = document.getElementById('reportClose');

// ... (Existing code)

// AI Report Logic
let geminiClient = null;

// Hardcoded key as fallback/default
const DEFAULT_KEY = 'AIzaSyCqamZjyNPC5aq2VtefkOK53FnuGh_MffI';

function getApiKey() {
    return localStorage.getItem('gemini_api_key') || DEFAULT_KEY;
}

function setApiKey(key) {
    localStorage.setItem('gemini_api_key', key);
    geminiClient = new GeminiClient(key);
}

function initGemini() {
    const key = getApiKey();
    if (key) {
        geminiClient = new GeminiClient(key);
    }
}

initGemini();

// API Key Modal Events
function openApiKeyModal() {
    apiKeyModal.classList.remove('hidden');
    apiKeyInput.value = getApiKey() || '';
    apiKeyInput.focus();
}

function closeApiKeyModal() {
    apiKeyModal.classList.add('hidden');
}

apiKeyClose.addEventListener('click', closeApiKeyModal);
document.getElementById('apiKeyOverlay').addEventListener('click', closeApiKeyModal);

saveApiKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
        setApiKey(key);
        closeApiKeyModal();
        generateAiReport(); // Retry generation
    } else {
        alert('API Key를 입력해주세요.');
    }
});

// Report Modal Events
function openReportModal() {
    reportModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeReportModal() {
    reportModal.classList.add('hidden');
    document.body.style.overflow = '';
}

reportClose.addEventListener('click', closeReportModal);
document.getElementById('reportOverlay').addEventListener('click', closeReportModal);

// Generate Report
// Generate Report
async function generateAiReport() {
    alert("상세 운세 보고서는 추후 개발 예정입니다.");
}

btnAiReport.addEventListener('click', generateAiReport);

// ... (Rest of the code)

// Section Elements
const nameSection = document.getElementById('nameSection');
const solarSajuSection = document.getElementById('solarSajuSection');
const lunarSajuSection = document.getElementById('lunarSajuSection');
const solarHaeunSection = document.getElementById('solarHaeunSection');
const lunarHaeunSection = document.getElementById('lunarHaeunSection');
const cardGallerySection = document.getElementById('cardGallerySection');
const matchingSection = document.getElementById('matchingSection');

// 초기 설정
function setTodayDefaults() {
    const today = new Date();
    const y = today.getFullYear();
    if (!refYearEl.value) refYearEl.value = y;
}

setTodayDefaults();

// 생년월일 파싱 함수
function parseYmd(ymd) {
    if (!/^\d{8}$/.test(ymd)) return null;
    const y = parseInt(ymd.slice(0, 4), 10);
    const m = parseInt(ymd.slice(4, 6), 10);
    const d = parseInt(ymd.slice(6, 8), 10);
    if (y < 1900 || y > 2099 || m < 1 || m > 12 || d < 1 || d > 31) return null;
    return { y, m, d };
}

// 이름 사주 번호 렌더링
function renderNameChips(name) {
    const items = getNameNumbers(name);
    const nameSajuValues = document.getElementById('nameSajuValues');
    const nameMeaningList = document.getElementById('nameMeaningList');

    nameSajuValues.innerHTML = '';
    nameMeaningList.innerHTML = '';

    items.forEach(({ char, num }) => {
        const pill = document.createElement('span');
        pill.className = 'pill';
        pill.textContent = `${char} ${num || '0'}`;
        nameSajuValues.appendChild(pill);

        const meaning = sajuMeanings[num];
        if (meaning) {
            const item = document.createElement('div');
            item.className = 'meaning-item';
            item.textContent = `${char}: ${meaning.emoji} ${meaning.title} - ${meaning.text}`;
            nameMeaningList.appendChild(item);
        }
    });

    nameSection.classList.remove('hidden');
}

// 사주 정보 렌더링
function renderSajuInfo(type, sajuData) {
    const prefix = type === 'solar' ? 'Solar' : 'Lunar';
    const calendarType = type === 'solar' ? '양력' : '음력';

    if (!sajuData) {
        document.getElementById(`sajuFirst${prefix}`).textContent = '-';
        document.getElementById(`sajuSecond${prefix}`).textContent = '-';
        document.getElementById(`sajuDesc${prefix}`).textContent = '';
        document.getElementById(`sajuMeaning${prefix}`).textContent = '';
        const second = document.getElementById(`sajuMeaning${prefix}2`);
        if (second) second.textContent = '';
        return;
    }

    const { primary, secondary } = sajuData;

    document.getElementById(`sajuFirst${prefix}`).textContent = primary.number;
    document.getElementById(`sajuSecond${prefix}`).textContent = secondary.number;
    document.getElementById(`sajuDesc${prefix}`).textContent =
        `${calendarType} 사주: ${primary.number}번 / ${secondary.number}번`;

    // 첫 번째 사주 의미
    if (primary.info) {
        const title = primary.info.title || `${primary.number}번`;
        const summary = primary.info.content?.general?.split('\n')[0] || ''; // 첫 줄만 표시
        document.getElementById(`sajuMeaning${prefix}`).textContent = `${title}: ${summary}`;
    }

    // 두 번째 사주 의미
    const secondEl = document.getElementById(`sajuMeaning${prefix}2`);
    if (secondEl && secondary.info) {
        const title = secondary.info.title || `${secondary.number}번`;
        const summary = secondary.info.content?.general?.split('\n')[0] || '';
        secondEl.textContent = `${title}: ${summary}`;
    }

    // 상세 보기 버튼 추가 (기존 버튼이 있다면 제거 후 추가)
    const container = document.getElementById(`${type}SajuSection`);
    let detailBtn = container.querySelector('.detail-btn');
    if (!detailBtn) {
        detailBtn = document.createElement('button');
        detailBtn.className = 'detail-btn mt-2 text-sm text-indigo-600 hover:text-indigo-800 underline';
        detailBtn.textContent = '📜 상세 풀이 보기';
        container.appendChild(detailBtn);
    }

    // 버튼 이벤트 리스너 새로 등록 (클로저 문제 해결 위해)
    const newBtn = detailBtn.cloneNode(true);
    detailBtn.parentNode.replaceChild(newBtn, detailBtn);

    newBtn.addEventListener('click', () => {
        showDetailedReport(sajuData, type === 'solar' ? '양력 사주 풀이' : '음력 사주 풀이');
    });

    container.classList.remove('hidden');
}

// 해운 정보 렌더링
function renderHaeunInfo(type, haeunData) {
    const prefix = type === 'solar' ? 'Solar' : 'Lunar';
    const calendarType = type === 'solar' ? '양력' : '음력';

    if (!haeunData) {
        document.getElementById(`haeunFirst${prefix}`).textContent = '-';
        document.getElementById(`haeunSecond${prefix}`).textContent = '-';
        document.getElementById(`haeunDesc${prefix}`).textContent = '';
        document.getElementById(`haeunMeaning${prefix}`).textContent = '';
        return;
    }

    const { number, info } = haeunData;
    const [first, second] = number.split('/');

    document.getElementById(`haeunFirst${prefix}`).textContent = first;
    document.getElementById(`haeunSecond${prefix}`).textContent = second;
    document.getElementById(`haeunDesc${prefix}`).textContent =
        `${calendarType} 해운: ${number}`;

    if (info && info.content) {
        const summary = info.content.general || info.content.summary || '상세 정보가 없습니다.';
        document.getElementById(`haeunMeaning${prefix}`).textContent = summary.split('\n')[0];
    } else {
        document.getElementById(`haeunMeaning${prefix}`).textContent = '해당 해운 번호에 대한 상세 정보가 없습니다.';
    }

    // 상세 보기 버튼
    const container = document.getElementById(`${type}HaeunSection`);
    let detailBtn = container.querySelector('.detail-btn');
    if (!detailBtn) {
        detailBtn = document.createElement('button');
        detailBtn.className = 'detail-btn mt-2 text-sm text-indigo-600 hover:text-indigo-800 underline';
        detailBtn.textContent = '🌊 해운 상세 풀이 보기';
        container.appendChild(detailBtn);
    }

    const newBtn = detailBtn.cloneNode(true);
    detailBtn.parentNode.replaceChild(newBtn, detailBtn);

    newBtn.addEventListener('click', () => {
        showDetailedHaeunReport(haeunData, type === 'solar' ? '양력 해운 풀이' : '음력 해운 풀이');
    });

    container.classList.remove('hidden');
}

// 카드 갤러리 렌더링 (그리드 방식)
let isCardGalleryInitialized = false;

function renderCardGallery() {
    // 한 번만 초기화
    if (isCardGalleryInitialized) {
        cardGallerySection.classList.remove('hidden');
        return;
    }

    const cardGrid = document.getElementById('cardGrid');
    cardGrid.innerHTML = '';

    // 0부터 21까지 모든 카드 생성
    for (let num = 0; num <= 21; num++) {
        const paddedNum = num === 0 ? '0' : String(num).padStart(2, '0');
        const frontPath = encodeURIComponent(`인생보감개운법카드-${paddedNum}_앞.png`);

        const gridItem = document.createElement('div');
        gridItem.className = 'card-grid-item';
        gridItem.dataset.number = num;

        gridItem.innerHTML = `
        <img src="/${frontPath}" alt="사주 카드 ${num}번" loading="lazy">
    `;

        // 클릭 시 모달 열기
        gridItem.addEventListener('click', () => {
            openCardModal(num);
        });

        cardGrid.appendChild(gridItem);
    }

    // 모달 이벤트 설정
    setupCardModal();

    isCardGalleryInitialized = true;
    cardGallerySection.classList.remove('hidden');
}

// 카드 모달 열기
function openCardModal(num) {
    const modal = document.getElementById('cardModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalFrontImg = document.getElementById('modalFrontImg');
    const modalBackImg = document.getElementById('modalBackImg');

    const paddedNum = num === 0 ? '0' : String(num).padStart(2, '0');
    const frontPath = encodeURIComponent(`인생보감개운법카드-${paddedNum}_앞.png`);
    const backPath = encodeURIComponent(`인생보감개운법카드-${paddedNum}_뒤.png`);

    modalTitle.textContent = `사주 카드 ${num}번`;
    modalFrontImg.src = `/${frontPath}`;
    modalBackImg.src = `/${backPath}`;
    modalFrontImg.alt = `${num}번 카드 앞면`;
    modalBackImg.alt = `${num}번 카드 뒷면`;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // 스크롤 방지
}

// 카드 모달 닫기
function closeCardModal() {
    const modal = document.getElementById('cardModal');
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // 스크롤 복원
}

// 카드 모달 이벤트 설정
function setupCardModal() {
    const modal = document.getElementById('cardModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');

    // 닫기 버튼
    modalClose.addEventListener('click', closeCardModal);

    // 오버레이 클릭 시 닫기
    modalOverlay.addEventListener('click', closeCardModal);

    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeCardModal();
        }
    });
}

// 매칭 정보 렌더링 (4개 사주번호 모두 사용)
function renderMatchingInfo(sajuNumbers, birthYear) {
    if (!sajuNumbers || sajuNumbers.length === 0) return;

    // 4개 사주번호에서 모든 정보 수집
    const allConsonants = [];
    const allCompatible = [];
    const allTerrains = [];
    const allDescriptions = [];
    const allExamples = [];
    const sajuNumbersList = [];

    // 4개 사주번호의 정보를 모두 수집
    sajuNumbers.forEach(num => {
        if (num && num >= 0 && num <= 21) {
            sajuNumbersList.push(num);
            const matchInfo = SajuMatching.getComprehensiveMatch(num, birthYear);

            if (matchInfo.locationInfo) {
                allConsonants.push(...matchInfo.locationInfo.consonants);
                allTerrains.push(matchInfo.locationInfo.terrain);
                allDescriptions.push(matchInfo.locationInfo.description);
                allExamples.push(...matchInfo.locationInfo.examples);
            }

            if (matchInfo.compatibleSaju) {
                allCompatible.push(...matchInfo.compatibleSaju);
            }
        }
    });

    // 초성 중복 확인 (2번 이상 나온 것)
    const consonantCount = {};
    allConsonants.forEach(cons => {
        consonantCount[cons] = (consonantCount[cons] || 0) + 1;
    });

    const duplicateConsonants = Object.keys(consonantCount).filter(cons => consonantCount[cons] >= 2);
    const uniqueConsonants = [...new Set(allConsonants)];

    // 궁합 중복 확인
    const compatibleCount = {};
    allCompatible.forEach(num => {
        compatibleCount[num] = (compatibleCount[num] || 0) + 1;
    });

    const duplicateCompatible = Object.keys(compatibleCount).filter(num => compatibleCount[num] >= 2).map(Number);
    const uniqueCompatible = [...new Set(allCompatible)];

    // 행운의 숫자 (첫 번째 사주번호 기준)
    const mainSajuNumber = sajuNumbers[0];
    const matchInfo = SajuMatching.getComprehensiveMatch(mainSajuNumber, birthYear);

    if (matchInfo.luckyInfo) {
        const luckyContainer = document.getElementById('luckyNumbers');
        luckyContainer.innerHTML = '';

        // 행운의 숫자 모음 (자신의 사주번호 + 행운의 숫자들)
        const allFortuneNumbers = [...sajuNumbersList, ...matchInfo.luckyInfo.fortuneNumbers];
        const avoidNumbersSet = new Set(matchInfo.luckyInfo.avoidNumbers);

        // 지양할 숫자와 겹치지 않는 행운의 숫자만 표시
        const uniqueFortuneNumbers = [...new Set(allFortuneNumbers)]
            .filter(num => !avoidNumbersSet.has(num));

        uniqueFortuneNumbers.forEach(num => {
            const pill = document.createElement('span');
            const isMyNumber = sajuNumbersList.includes(num);
            pill.className = isMyNumber ? 'pill fortune my-number' : 'pill fortune';
            pill.textContent = num;
            if (isMyNumber) {
                pill.title = '내 사주번호';
            }
            luckyContainer.appendChild(pill);
        });
    }

    // 지양할 숫자 (행운의 숫자와 겹치지 않는 것만)
    if (matchInfo.luckyInfo) {
        const avoidContainer = document.getElementById('avoidNumbers');
        avoidContainer.innerHTML = '';

        const fortuneNumbersSet = new Set([...sajuNumbersList, ...matchInfo.luckyInfo.fortuneNumbers]);

        // 행운의 숫자와 겹치지 않는 지양할 숫자만 표시
        const uniqueAvoidNumbers = matchInfo.luckyInfo.avoidNumbers
            .filter(num => !fortuneNumbersSet.has(num));

        uniqueAvoidNumbers.forEach(num => {
            const pill = document.createElement('span');
            pill.className = 'pill avoid';
            pill.textContent = num;
            avoidContainer.appendChild(pill);
        });
    }

    // 초성 렌더링 (중복은 굵게)
    const consonantsContainer = document.getElementById('consonants');
    consonantsContainer.innerHTML = '';

    // 기존 안내 문구 제거
    const oldConsonantNotice = consonantsContainer.parentElement.querySelector('.consonant-notice');
    if (oldConsonantNotice) {
        oldConsonantNotice.remove();
    }

    uniqueConsonants.forEach(cons => {
        const pill = document.createElement('span');
        const isDuplicate = duplicateConsonants.includes(cons);
        pill.className = isDuplicate ? 'pill location duplicate' : 'pill location';
        pill.textContent = cons;
        if (isDuplicate) {
            pill.title = `중복 ${consonantCount[cons]}회 - 더 잘 맞는 초성`;
        }
        consonantsContainer.appendChild(pill);
    });

    // 중복 초성이 있으면 안내 문구 추가
    if (duplicateConsonants.length > 0) {
        const notice = document.createElement('p');
        notice.className = 'consonant-notice';
        notice.textContent = `✨ 굵은 초성(${duplicateConsonants.join(', ')})은 여러 사주번호에서 중복되어 더 잘 맞는 지역입니다!`;
        consonantsContainer.parentElement.appendChild(notice);
    }

    // 지형 정보 (모든 지형 통합)
    const uniqueTerrains = [...new Set(allTerrains)];
    const uniqueDescriptions = [...new Set(allDescriptions)];
    document.getElementById('terrain').textContent =
        `${uniqueTerrains.join(', ')} - ${uniqueDescriptions.join(' 또는 ')}`;

    // 추천 지역 (중복 제거)
    const locationsContainer = document.getElementById('locations');
    locationsContainer.innerHTML = '';
    const uniqueExamples = [...new Set(allExamples)];
    uniqueExamples.forEach(loc => {
        const pill = document.createElement('span');
        pill.className = 'pill location';
        pill.textContent = loc;
        locationsContainer.appendChild(pill);
    });

    // 잘 맞는 사주번호 (중복은 굵게)
    const compatibleContainer = document.getElementById('compatible');
    compatibleContainer.innerHTML = '';

    // 기존 안내 문구 제거
    const oldCompatibleNotice = compatibleContainer.parentElement.querySelector('.compatible-notice');
    if (oldCompatibleNotice) {
        oldCompatibleNotice.remove();
    }

    uniqueCompatible.forEach(num => {
        const pill = document.createElement('span');
        const isDuplicate = duplicateCompatible.includes(num);
        pill.className = isDuplicate ? 'pill compatible duplicate' : 'pill compatible';
        pill.textContent = num;
        if (isDuplicate) {
            pill.title = `중복 ${compatibleCount[num]}회 - 더 잘 맞는 궁합`;
        }
        compatibleContainer.appendChild(pill);
    });

    // 중복 궁합이 있으면 안내 문구 추가
    if (duplicateCompatible.length > 0) {
        const notice = document.createElement('p');
        notice.className = 'compatible-notice';
        notice.textContent = `💫 굵은 번호(${duplicateCompatible.join(', ')})는 여러 사주번호와 궁합이 좋아 더욱 잘 맞습니다!`;
        compatibleContainer.parentElement.appendChild(notice);
    }

    // 특수 사주 조합 확인
    const specialCombinations = [];
    for (let i = 0; i < sajuNumbers.length; i++) {
        for (let j = i + 1; j < sajuNumbers.length; j++) {
            const special = SajuMatching.checkSpecialCombination(sajuNumbers[i], sajuNumbers[j]);
            if (special.length > 0) {
                special.forEach(s => {
                    specialCombinations.push({
                        numbers: `${sajuNumbers[i]}번 + ${sajuNumbers[j]}번`,
                        ...s
                    });
                });
            }
        }
    }

    // 특수 조합 렌더링
    if (specialCombinations.length > 0) {
        const specialContainer = document.getElementById('specialCombinations');
        specialContainer.innerHTML = '';
        specialCombinations.forEach(combo => {
            const item = document.createElement('div');
            item.className = 'special-combo-item';
            item.innerHTML = `
            <strong>${combo.numbers}</strong>: ${combo.category.replace(/_/g, ' ')}
            <p>${combo.description}</p>
        `;
            specialContainer.appendChild(item);
        });
        document.getElementById('specialCombinationsSection').classList.remove('hidden');
    }

    // 특별한 특징 (첫 번째 사주번호 기준)
    if (matchInfo.specialNotes) {
        document.getElementById('specialText').textContent = matchInfo.specialNotes;
        document.getElementById('specialNotes').classList.remove('hidden');
    }

    // 띠별 정보
    if (matchInfo.zodiacInfo) {
        const zodiacText = `${matchInfo.zodiacInfo.zodiac}띠 - 타로번호: ${matchInfo.zodiacInfo.tarot.join(', ')} / ${matchInfo.zodiacInfo.keywords.join(', ')}`;
        document.getElementById('zodiacInfo').textContent = zodiacText;
        document.getElementById('zodiacSection').classList.remove('hidden');
    }

    matchingSection.classList.remove('hidden');
}

// 상세 보고서 표시 함수 (사주)
function showDetailedReport(sajuData, title) {
    const { primary, secondary } = sajuData;
    let content = `# ${title}\n\n`;

    // Primary
    content += `## 1. ${primary.info.title || primary.number + '번'}\n`;
    if (primary.info.content) {
        for (const [key, val] of Object.entries(primary.info.content)) {
            content += `### ${key}\n${val}\n\n`;
        }
    }

    content += `\n---\n\n`;

    // Secondary
    content += `## 2. ${secondary.info.title || secondary.number + '번'}\n`;
    if (secondary.info.content) {
        for (const [key, val] of Object.entries(secondary.info.content)) {
            content += `### ${key}\n${val}\n\n`;
        }
    }

    reportContent.innerHTML = marked.parse(content);
    openReportModal();
}

// 상세 보고서 표시 함수 (해운)
function showDetailedHaeunReport(haeunData, title) {
    const { number, info } = haeunData;
    let content = `# ${title} (${number})\n\n`;

    if (info.title) content += `## ${info.title}\n\n`;

    if (info.content) {
        for (const [key, val] of Object.entries(info.content)) {
            let sectionTitle = key;
            if (key === 'general') sectionTitle = '전반적 특징';
            else if (key === 'wealth') sectionTitle = '재물운';
            else if (key === 'love') sectionTitle = '애정운';
            else if (key === 'job') sectionTitle = '직장운';
            else if (key === 'health') sectionTitle = '건강운';
            else if (key === 'todo') sectionTitle = '오늘 시도해보기';
            else if (key === 'caution') sectionTitle = '오늘 조심할 점';

            content += `### ${sectionTitle}\n${val}\n\n`;
        }
    } else {
        content += '상세 정보가 없습니다.';
    }

    reportContent.innerHTML = marked.parse(content);
    openReportModal();
}

// 폼 제출 이벤트
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameEl.value.trim();
    const solar = (solarYmdEl.value || '').trim();
    const lunar = (lunarYmdEl.value || '').trim();
    let refY = parseInt(refYearEl.value, 10);
    if (isNaN(refY)) refY = new Date().getFullYear();

    const solarParsed = parseYmd(solar);
    const lunarParsed = parseYmd(lunar);

    if (!name && !solarParsed && !lunarParsed) {
        alert('이름 또는 생년월일(양력/음력) 중 하나 이상을 입력해주세요.');
        return;
    }

    // 모든 섹션 숨기기
    nameSection.classList.add('hidden');
    solarSajuSection.classList.add('hidden');
    lunarSajuSection.classList.add('hidden');
    solarHaeunSection.classList.add('hidden');
    lunarHaeunSection.classList.add('hidden');
    cardGallerySection.classList.add('hidden');
    matchingSection.classList.add('hidden');

    // 이름 처리
    if (name) {
        renderNameChips(name);
    }

    // 양력 계산
    let resultSolar = null;
    if (solarParsed) {
        // YYYY-MM-DD 형식으로 변환
        const dateStr = `${solarParsed.y}-${String(solarParsed.m).padStart(2, '0')}-${String(solarParsed.d).padStart(2, '0')}`;
        resultSolar = analyzeSaju(name, dateStr);
        renderSajuInfo('solar', resultSolar.saju);
        renderHaeunInfo('solar', resultSolar.haewoon);
    }

    // 음력 계산
    let resultLunar = null;
    if (lunarParsed) {
        const dateStr = `${lunarParsed.y}-${String(lunarParsed.m).padStart(2, '0')}-${String(lunarParsed.d).padStart(2, '0')}`;
        resultLunar = analyzeSaju(name, dateStr);
        renderSajuInfo('lunar', resultLunar.saju);
        renderHaeunInfo('lunar', resultLunar.haewoon);
    }

    // 매칭 정보 표시 (4개 사주번호 모두 사용)
    const allSajuNumbers = [];
    if (resultSolar) {
        allSajuNumbers.push(resultSolar.saju.primary.number, resultSolar.saju.secondary.number);
    }
    if (resultLunar) {
        allSajuNumbers.push(resultLunar.saju.primary.number, resultLunar.saju.secondary.number);
    }

    if (allSajuNumbers.length > 0) {
        const birthYear = solarParsed ? solarParsed.y : (lunarParsed ? lunarParsed.y : null);

        // 매칭 정보 렌더링
        renderMatchingInfo(allSajuNumbers, birthYear);

        // 카드 갤러리 렌더링 (모든 카드 0-21)
        renderCardGallery();
    }

    // 결과 표시
    emptyState.classList.add('hidden');
    resultsWrap.classList.remove('hidden');

    // 결과로 스크롤
    resultsWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// 복사 버튼
copyBtn.addEventListener('click', async () => {
    try {
        const nameNums = nameEl.value.trim()
            ? getNameNumbers(nameEl.value.trim()).map(n => n.num || 0).join(', ')
            : '';
        const sajuSolar = `${document.getElementById('sajuFirstSolar').textContent}, ${document.getElementById('sajuSecondSolar').textContent}`;
        const sajuLunar = `${document.getElementById('sajuFirstLunar').textContent}, ${document.getElementById('sajuSecondLunar').textContent}`;
        const haeunSolar = `${document.getElementById('haeunFirstSolar').textContent}/${document.getElementById('haeunSecondSolar').textContent}`;
        const haeunLunar = `${document.getElementById('haeunFirstLunar').textContent}/${document.getElementById('haeunSecondLunar').textContent}`;

        const text = [
            nameEl.value.trim() ? `이름: ${nameEl.value.trim()} (${nameNums})` : '',
            `사주번호(양력): ${sajuSolar}`,
            `사주번호(음력): ${sajuLunar}`,
            `해운번호(양력): ${haeunSolar}`,
            `해운번호(음력): ${haeunLunar}`,
            '',
            '나와 잘 맞는 장소와 번호를 확인해보세요!'
        ].filter(line => line).join('\n');

        await navigator.clipboard.writeText(text);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '복사 완료!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 1500);
    } catch (e) {
        alert('복사에 실패했어요. 브라우저 권한을 확인해주세요.');
    }
});

// 공유 버튼
shareBtn.addEventListener('click', async () => {
    try {
        const nameNums = nameEl.value.trim()
            ? getNameNumbers(nameEl.value.trim()).map(n => n.num || 0).join(', ')
            : '';
        const sajuSolar = `${document.getElementById('sajuFirstSolar').textContent}, ${document.getElementById('sajuSecondSolar').textContent}`;
        const sajuLunar = `${document.getElementById('sajuFirstLunar').textContent}, ${document.getElementById('sajuSecondLunar').textContent}`;
        const haeunSolar = `${document.getElementById('haeunFirstSolar').textContent}/${document.getElementById('haeunSecondSolar').textContent}`;
        const haeunLunar = `${document.getElementById('haeunFirstLunar').textContent}/${document.getElementById('haeunSecondLunar').textContent}`;

        const text = [
            nameEl.value.trim() ? `이름: ${nameEl.value.trim()} (${nameNums})` : '',
            `사주번호(양력): ${sajuSolar}`,
            `사주번호(음력): ${sajuLunar}`,
            `해운번호(양력): ${haeunSolar}`,
            `해운번호(음력): ${haeunLunar}`,
            '',
            '나와 잘 맞는 장소와 번호를 확인해보세요!'
        ].filter(line => line).join('\n');

        if (navigator.share) {
            await navigator.share({
                title: '사주번호 운세 계산기',
                text: text
            });
        } else {
            // Web Share API를 지원하지 않으면 복사
            await navigator.clipboard.writeText(text);
            alert('공유 기능이 없어 복사했습니다. 붙여넣어 공유해주세요.');
        }
    } catch (e) {
        if (e.name !== 'AbortError') {
            alert('공유/복사에 실패했어요.');
        }
    }
});

// 다시하기 버튼
resetBtn.addEventListener('click', () => {
    form.reset();
    setTodayDefaults();
    resultsWrap.classList.add('hidden');
    emptyState.classList.remove('hidden');

    // 모든 섹션 숨기기
    nameSection.classList.add('hidden');
    solarSajuSection.classList.add('hidden');
    lunarSajuSection.classList.add('hidden');
    solarHaeunSection.classList.add('hidden');
    lunarHaeunSection.classList.add('hidden');
    cardGallerySection.classList.add('hidden');
    matchingSection.classList.add('hidden');

    // 입력 폼으로 스크롤
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// 숫자만 입력 허용
[solarYmdEl, lunarYmdEl].forEach(input => {
    input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
});
