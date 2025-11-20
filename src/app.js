// 계산 유틸리티: 사주번호(calcSajuValue) 및 해운번호(calcHaeunValue)

// 자릿수 합 함수
function sumDigits(num) {
    return String(num).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
}

// 사주번호 계산 함수 (생년 + 월 + 일 방식)
function calcSajuValue(y, m, d) {
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
    const total = y + m + d;

    // 생년월일 합이 2000인 경우 특별 예외 처리
    if (total === 2000) {
        return { total, firstVal: 20, secondVal: 2 };
    }

    // 2000 초과인 경우 특별 처리
    if (total > 2000) {
        const lastTwoDigits = total % 100;
        let firstVal, secondVal;

        if (lastTwoDigits <= 21) {
            // 21 이하면 두자리 그대로 사용
            firstVal = lastTwoDigits;
        } else {
            // 22 이상이면 마지막 한자리만 사용
            firstVal = lastTwoDigits % 10;
        }

        // 0이 나올 경우 처리
        if (firstVal === 0) firstVal = 10;

        // 두 번째 사주는 전체 자릿수 합
        secondVal = sumDigits(total);
        // 0이 나올 경우 처리
        if (secondVal === 0) secondVal = 22;

        return { total, firstVal: firstVal, secondVal: secondVal };
    }

    // 2000 미만인 경우 기존 로직
    // 앞 두자리와 뒤 두자리로 분리
    const frontTwo = Math.floor(total / 100);
    const backTwo = total % 100;

    // 앞 두자리의 각 자리수 더하기
    const frontSum = sumDigits(frontTwo);

    // 뒤 두자리의 각 자리수 더하기
    const backSum = sumDigits(backTwo);

    // 2000 미만인 경우 특별 예외 처리
    const combinedString = String(frontSum) + String(backSum);
    const combinedNumber = parseInt(combinedString, 10);

    if (combinedNumber === 1010) {
        return { total, firstVal: 10, secondVal: 2 };
    }
    if (combinedNumber === 1011) {
        return { total, firstVal: 11, secondVal: 3 };
    }

    // 첫 번째 사주: 뒤 두자리의 합
    let fv = backSum;
    // 0이 나올 경우 22로 처리
    if (fv === 0) fv = 22;

    // 두 번째 사주: 앞 두자리의 합 + 뒤 두자리의 합
    let sv = frontSum + backSum;

    // 두 번째 사주가 21을 넘으면 각 자리수 더하기
    if (sv > 21) {
        sv = sumDigits(sv);
    }
    // 0이 나올 경우 22로 처리
    if (sv === 0) sv = 22;

    return { total, firstVal: fv, secondVal: sv };
}

// 운세번호 계산 함수 (기준연도 2025)
function calcHaeunValue(refY, m, d) {
    if (isNaN(refY) || isNaN(m) || isNaN(d)) return null;
    const total = refY + m + d;
    let lastTwo = total % 100;
    let fv = (lastTwo > 21) ? (lastTwo % 10) : lastTwo;
    // 0이 나올 경우 10으로 처리
    if (fv === 0) fv = 10;

    let sv = sumDigits(total);
    // 0이 나올 경우 22로 처리
    if (sv === 0) sv = 22;

    return { total, firstVal: fv, secondVal: sv };
}

// 이름 번호 매핑 (수비학 기반)
const nameMap = {
    // 2번
    '은': 2,
    // 3번
    '민': 3, '임': 3, '노': 3, '모': 3, '삼': 3, '묵': 3,
    '문': 3, '미': 3, '누': 3, '흠': 3, '움': 3, '점': 3,
    '무': 3, '겸': 3, '림': 3, '매': 3, '맹': 3,
    '나': 3, '남': 3, '마': 3, '명': 3, '목': 3,
    '김': 3, '금': 3, '막': 3, '봄': 3, '내': 3,
    '낭': 3, '담': 3, '첨': 3, '견': 3, '곤': 3,
    // 4번
    '석': 4, '로': 4, '학': 4, '슬': 4,
    '라': 4, '종': 4, '루': 4, '일': 4,
    '식': 4, '래': 4, '례': 4, '록': 4,
    '소': 4, '리': 4, '말': 4, '란': 4,
    '숙': 4, '근': 4, '솔': 4, '순': 4,
    '람': 4, '론': 4,
    // 5번
    '태': 5, '택': 5, '규': 5, '분': 5, '돔': 5, '던': 5,
    '만': 5, '엽': 5, '평': 5, '효': 5, '훈': 5, '도': 5,
    '다': 5, '둔': 5, '령': 5, '봉': 5, '탁': 5, '탄': 5,
    '대': 5, '덕': 5, '보': 5, '단': 5, '득': 5, '섭': 5,
    '돈': 5, '두': 5, '갑': 5, '당': 5, '딘': 5, '후': 5,
    '욱': 5, '팽': 5, '피': 5, '닷': 5, '타': 5, '탐': 5,
    '파': 5, '판': 5,
    // 6번
    '정': 6,
    // 7번
    '최': 7, '동': 7, '차': 7, '추': 7, '건': 7,
    '채': 7, '화': 7, '좌': 7, '찬': 7, '하': 7, '준': 7,
    '주': 7, '철': 7, '수': 7, '찰': 7, '춘': 7, '청': 7,
    '척': 7, '카': 7,
    // 8번
    '박': 8, '가': 8, '혜': 8, '늘': 8, '호': 8, '해': 8, '예': 8,
    '중': 8, '강': 8, '율': 8, '용': 8, '송': 8, '응': 8, '사': 8,
    '병': 8, '열': 8, '비': 8, '양': 8, '백': 8, '승': 8, '옥': 8,
    '을': 8, '상': 8, '오': 8, '흥': 8, '거': 8, '권': 8, '형': 8,
    '영': 8, '범': 8, '고': 8, '배': 8, '랑': 8, '빛': 8, '결': 8,
    '복': 8, '환': 8, '인': 8, '린': 8, '극': 8, '본': 8, '벼': 8,
    '의': 8, '검': 8, '황': 8,
    // 9번
    '순': 9, '서': 9, '선': 9, '여': 9, '녀': 9, '존': 9, '회': 9,
    '지': 9, '향': 9, '장': 9, '제': 9, '심': 9, '재': 9, '성': 9,
    '자': 9, '기': 9, '실': 9, '어': 9, '희': 9, '홍': 9, '유': 9,
    '우': 9, '언': 9, '귀': 9, '설': 9, '길': 9, '행': 9, '휴': 9,
    '헌': 9, '잠': 9, '허': 9, '갈': 9, '연': 9, '진': 9, '항': 9,
    '션': 9, '직': 9, '숀': 9, '요': 9, '이': 9, '주': 9, '철': 9, '류': 9,
    // 10번
    '안': 10, '윤': 10, '원': 10, '전': 10, '온': 10, '한': 10,
    '손': 10, '련': 10,
    // 11번
    '현': 11, '경': 11, '신': 11, '염': 11, '키': 11, '창': 11,
    '간': 11, '천': 11, '세': 11, '감': 11, '품': 11, '위': 11,
    '균': 11, '총': 11, '휘': 11, '시': 11, '필': 11
};

// 사주번호(0~21) 해석 매핑
const sajuMeanings = {
    0: { title: '광대', emoji: '🃏', text: '아직 준비는 부족하지만, 새로운 모험을 두려워하지 않는 자유로운 영혼' },
    1: { title: '마법사', emoji: '🪄', text: '무한한 능력으로 1을 2로, 2를 4로 만드는 창조의 마술사' },
    2: { title: '여사제', emoji: '🌙', text: '속내를 드러내지 않지만 답을 알고 있는 지혜의 수호자' },
    3: { title: '여황제', emoji: '👑', text: '넘어져도 돈을 줍는, 타고난 풍요와 나눔의 사주' },
    4: { title: '황제', emoji: '🛡️', text: '싸워서 이기고 쟁취하는, 확장과 발전의 자수성가형' },
    5: { title: '교황', emoji: '📜', text: '생각은 많지만 실천이 부족한, 앉아서 지배하는 조언자' },
    6: { title: '연인', emoji: '💞', text: '비워야 채워지는, 인복 많은 감정과 소비의 양육통' },
    7: { title: '전차', emoji: '🚀', text: '목적 있는 이동으로 두 가지를 동시에 성공시키는 행동파' },
    8: { title: '힘', emoji: '🦁', text: '두 발 후퇴, 세 발 전진하는 느림의 미학과 대기만성' },
    9: { title: '은둔자', emoji: '🕯️', text: '혼자만의 세계에서 답을 찾는 고독한 지혜자' },
    10: { title: '운명의 수레바퀴', emoji: '🎡', text: '물처럼 스며들어 운명을 믿으면 복이 따르는 변화의 물결' },
    11: { title: '정의', emoji: '⚖️', text: '칼과 저울로 Give and Take를 실천하는 공정한 심판자' },
    12: { title: '매달린 사람', emoji: '🌀', text: '세상을 거꾸로 보는 예술적 천재의 다른 시각' },
    13: { title: '죽음', emoji: '💀', text: '죽었다 깨어나는, 모 아니면 도의 극단적 변화' },
    14: { title: '절제', emoji: '🧪', text: '뜨거운 물과 차가운 물을 섞어 중용을 만드는 조화' },
    15: { title: '악마', emoji: '😈', text: '매력적이지만 위험한, 카멜레온 같은 다채로운 인간형' },
    16: { title: '탑', emoji: '🏰', text: '쌓은 탑을 무너뜨려 새로 시작하는 용두사미의 변화' },
    17: { title: '별', emoji: '✨', text: '마음만 먹으면 별도 따는, 온실 속 화초의 축복' },
    18: { title: '달', emoji: '🌕', text: '겉과 속이 다른, 애매모호한 이면의 달빛' },
    19: { title: '태양', emoji: '🌞', text: '홀로그램처럼 보는 각도마다 다른 찬란한 행운' },
    20: { title: '심판', emoji: '📣', text: '희귀한 것을 추구하는 얼리어댑터의 부활' },
    21: { title: '세계', emoji: '🌍', text: '한 사이클을 완성하고 새로운 도전을 시작하는 완성자' },
    22: { title: '마스터', emoji: '🏆', text: '스페셜 넘버, 큰 주기와 완성의 상징' }
};

// 해운번호 조합 해석 (예시: '0/7' 형태)
const haeunMeanings = {
    '0/5': { score: 60, star: ' ', text: '충신과 간신이 교차하는 인간관계의 변화기, 실천이 무엇보다 중요한 때입니다. 작은 시작이라도 주도적으로 움직이면 새로운 길이 열립니다.' },
    '0/6': { score: 65, star: ' ', text: '실체 없는 갈등과 선택장애의 연속, 비워야 채워지는 과소비의 시기입니다. 혼란스러워도 실리를 추구하며 한 걸음씩 나아가세요.' },
    '0/7': { score: 80, star: '⭐', text: '오랜 굴레에서 벗어나 두 가지 이상의 성공을 거두는 보상의 때입니다. 목적 있는 이동과 확실한 결정이 빠른 결과로 이어집니다.' },
    '0/8': { score: 75, star: ' ', text: '실체는 없지만 느림의 미학으로 체감하는 준비의 시간입니다. 조급해하지 말고 기대치를 낮추면 의외의 소득이 있습니다.' },
    '0/9': { score: 80, star: '⭐', text: '피할 수 없는 자연스러운 변화가 시작되는 전환점입니다. 기대 가득한 새로운 시작, 9월 이후가 특히 중요한 시기입니다.' },

    '1/6': { score: 85, star: '⭐', text: '실체 있는 좋은 사람들이 연속으로 들어오는 환경 호전의 시기입니다. 비우면 채워지므로 과감한 투자와 힐링이 가능한 때입니다.' },
    '1/7': { score: 90, star: '⭐⭐', text: '좋은 이동과 결과가 연속되는 최상의 운세입니다. 자의든 타의든 2가지 이상의 성공이 동시에 찾아옵니다.' },
    '1/8': { score: 85, star: '⭐', text: '결과는 분명히 좋지만 체감이 늦어 답답한 시기입니다. 욕심과 기대치를 내려놓으면 9월 이후 확실한 결실을 봅니다.' },
    '1/9': { score: 80, star: '⭐', text: '예견된 변화와 당연한 이동이 자연스럽게 이루어집니다. 군 입대나 진급처럼 이미 정해진 미래가 순조롭게 진행됩니다.' },

    '2/7': { score: 75, star: ' ', text: '준비된 이동이지만 눌림과 간섭이 있는 상반기입니다. 타의적 이동이 있으나 그에 따른 보상도 따라옵니다.' },
    '2/8': { score: 70, star: ' ', text: '내년 도약(3/9)을 위한 준비 과정, 감정 소모가 큰 시기입니다. 이미지는 흔들려도 마음을 내려놓고 자신을 돌보는 시간입니다.' },
    '2/9': { score: 65, star: ' ', text: '원치 않는 이동과 예상 밖의 결과가 나오는 시기입니다. 가족 해운을 확인하고 이별수에 대비해야 합니다.' },
    '2/10': { score: 60, star: ' ', text: '조건과 간섭이 계속되는 감정 기복의 시기입니다. 운은 왔지만 마음먹기에 달려있는 중립적 상황입니다.' },

    '3/8': { score: 75, star: ' ', text: '좋은 일이 들어오지만 본인은 체감하지 못하는 시기입니다. 기대치가 커서 만족 못하지만 9월 이후 확실히 느낄 수 있습니다.' },
    '3/9': { score: 80, star: '⭐', text: '작년의 힘듦을 보상받는 결실의 시기입니다. 준비한 만큼 좋은 변화가 찾아오는 수확의 때입니다.' },
    '3/10': { score: 75, star: ' ', text: '감정 변동이 크지만 그만큼 성공 가능성도 큰 시기입니다. 우연한 행운과 본인 의지가 만나면 풍요와 재물이 따릅니다.' },
    '3/11': { score: 90, star: '⭐⭐', text: '모든 결과물이 구체화되고 문서화되는 성공의 시기입니다. 임신, 결혼, 계약 등 중요한 결정이 현실이 됩니다.' },

    '4/9': { score: 85, star: '⭐', text: '내가 생각하고 내가 실천하는 주체적인 변화의 시기입니다. 4월부터 시작해 9월 이후 열정적인 결과를 확인합니다.' },
    '4/10': { score: 80, star: '⭐', text: '과유불급, 너무 움직여도 가만있어도 문제인 균형의 시기입니다. 열정은 좋지만 감정 조절과 느림의 미학이 필요합니다.' },
    '4/11': { score: 75, star: ' ', text: '본인의 판단과 결정이 가장 중요한 시기입니다. 자동차 사고 주의하며 모든 책임을 주도적으로 집니다.' },
    '4/12': { score: 70, star: ' ', text: '변화의 시기, 힘들지만 열정으로 극복하는 때입니다. 4월 이후 묶임에서 풀려 능동적으로 대처하면 성공합니다.' },

    '5/10': { score: 75, star: ' ', text: '내가 주도하면 모든 일이 내 맘먹기에 달린 시기입니다. 귀인의 도움으로 불행 중 다행이 되는 5월부터입니다.' },
    '5/11': { score: 70, star: ' ', text: '어제의 적이 오늘의 동지되는 제휴의 시기입니다. 남 탓하기 쉽지만 결국 내가 판단해야 하는 5월부터입니다.' },
    '5/12': { score: 65, star: ' ', text: '실천하고 싶어도 우유부단해지는 매너리즘의 시기입니다. 5월까지 묶임이지만 융통성 있게 대처하면 풀립니다.' },
    '5/13': { score: 60, star: ' ', text: '귀인과 함께하는 새로운 시작의 기회입니다. 5월부터 누군가의 도움으로 실천하면 긍정의 결과가 옵니다.' },

    '6/10': { score: 80, star: '⭐', text: '갈등의 연속이지만 결국 내 마음먹기에 달린 시기입니다. 인복과 선택장애 속에서도 실리를 추구하면 성공합니다.' },
    '6/11': { score: 85, star: '⭐', text: '선택장애의 결과가 나오는 결정의 시기입니다. 결혼, 이혼, 성형 등 구체적 문서와 결과가 나타납니다.' },
    '6/12': { score: 80, star: '⭐', text: '감정, 돈, 시간의 과소비로 비워지는 상반기입니다. 힐링과 은밀한 사랑으로 6월까지 새는 형국입니다.' },
    '6/13': { score: 85, star: '⭐', text: '인간관계가 완전히 바뀌는 대전환의 시기입니다. 누군가 때문에 또는 덕분에 환경이 변하는 이사/이동입니다.' },

    '7/11': { score: 80, star: '⭐', text: '아슬아슬하지만 결정을 내리는 중요한 한해입니다. 2가지 이상 새로운 시작과 문서, 자동차, 병원 관련 결정입니다.' },
    '7/12': { score: 75, star: ' ', text: '더 높은 곳을 위해 한걸음 물러나는 보상의 시기입니다. 2가지 결과와 자동차 변화, 7월까지 묶임 후 풀림입니다.' },
    '7/13': { score: 80, star: '⭐', text: '1이 2가 되는 확장의 터닝포인트입니다. 힘들었던 사람은 족쇄에서 벗어나는 새로운 기회의 시기입니다.' },
    '7/14': { score: 65, star: ' ', text: '마음이 원활히 교류하는 조화와 통합의 시기입니다. 자동차 사고수 있지만 과실 적고 좋은 결과 기대됩니다.' },

    '8/12': { score: 60, star: ' ', text: '애벌레가 나비되기 위한 인고의 시련기입니다. 나의 이미지를 만들 수 없지만 변화를 기다리는 시간입니다.' },
    '8/13': { score: 65, star: ' ', text: '피할 수 없는 변화로 나의 이미지를 만드는 시기입니다. 좋았던 사람은 힘들어지고 힘들었던 사람은 좋아지는 전환점입니다.' },
    '8/14': { score: 60, star: ' ', text: '평행상태를 유지하며 견디는 인내의 시기입니다. 시작했지만 체감 못하고 기대치에 못 미치는 중립기입니다.' },
    '8/15': { score: 55, star: ' ', text: '쇠사슬에 묶여 관재수, 망신수 조심해야 하는 시기입니다. 삼각관계와 집착, 사기수 주의하며 돌다리도 두드려야 합니다.' },

    '9/13': { score: 90, star: '⭐⭐', text: '알고 있던 변화가 확실한 이득으로 돌아오는 최고의 시기입니다. 준비한 것의 결실과 새로운 시도가 모두 성공합니다.' },
    '9/14': { score: 70, star: ' ', text: '소득은 없지만 당연하고 자연스러운 이동의 시기입니다. 내정된 대로 가는 예견된 변화, 또 다른 내일을 준비합니다.' },
    '9/15': { score: 80, star: '⭐', text: '호기심과 유혹이 가득한 도덕적 경계 없는 이동입니다. 합리화하며 당연한 이동으로 만들고 싶은 자유로운 시기입니다.' },
    '9/16': { score: 60, star: ' ', text: '예기치 않는 사고와 갑작스런 변화의 시기입니다. 모든 걸 준비하고 감내하면 오히려 큰 기회가 될 수 있습니다.' },
    '9/17': { score: 70, star: ' ', text: '한 사이클이 끝나고 새로운 시작을 준비하는 마무리입니다. 다음 단계로 도약하기 위한 정리와 재충전의 시기입니다.' }
};

function getNameNumbers(name) {
    let result = [];
    for (let ch of name) {
        result.push({ char: ch, num: nameMap[ch] || 0 });
    }
    return result;
}

function getNameNumbersForPrompt(name) {
    if (!name) return '';
    const nameNumbers = getNameNumbers(name);
    const numberString = nameNumbers.map(item => item.num === 0 ? '미등록' : item.num).join(', ');
    return `\n- 이름 번호(수비학, 출력 금지): ${numberString}`;
}

// ===== UI 바인딩 ===== (main.js에서 사용하므로 주석 처리)
// 이 파일은 계산 함수들만 제공합니다.
// UI 제어는 main.js에서 처리합니다.

/*
const form = document.getElementById('calc-form');
const solarYmdEl = document.getElementById('solarYmd');
const lunarYmdEl = document.getElementById('lunarYmd');
const refYearEl = document.getElementById('refYear');
const nameEl = document.getElementById('name');
const resultsWrap = document.getElementById('results');
const emptyState = document.getElementById('emptyState');
const nameSajuValues = document.getElementById('nameSajuValues');
const nameMeaningList = document.getElementById('nameMeaningList');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');
const resetBtn = document.getElementById('resetBtn');

function setTodayDefaults() {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    solarYmdEl.value = '';
    lunarYmdEl.value = '';
    if (!refYearEl.value) refYearEl.value = y;
}

setTodayDefaults();
*/

function formatResultText(label, obj) {
    if (!obj) return `${label}: -`;
    return `${label}: ${obj.firstVal} + ${obj.secondVal}`;
}

/*
function renderNameChips(name) {
    const items = getNameNumbers(name);
    nameSajuValues.innerHTML = '';
    if (nameMeaningList) nameMeaningList.innerHTML = '';
    items.forEach(({ char, num }) => {
        const pill = document.createElement('span');
        pill.className = 'pill';
        pill.textContent = `${char} ${num || '0'}`;
        nameSajuValues.appendChild(pill);

        const meaning = sajuMeanings[num];
        if (nameMeaningList && meaning) {
            const li = document.createElement('div');
            li.className = 'meaning-item';
            li.textContent = `${char}: ${meaning.emoji} ${meaning.title} - ${meaning.text}`;
            nameMeaningList.appendChild(li);
        }
    });
}

function onSubmit(e) {
    e.preventDefault();
    const name = nameEl.value.trim();
    const solar = (solarYmdEl.value || '').trim();
    const lunar = (lunarYmdEl.value || '').trim();
    let refY = parseInt(refYearEl.value, 10);
    if (isNaN(refY)) refY = new Date().getFullYear();

    const parseYmd = (ymd) => {
        if (!/^\d{8}$/.test(ymd)) return null;
        const y = parseInt(ymd.slice(0, 4), 10);
        const m = parseInt(ymd.slice(4, 6), 10);
        const d = parseInt(ymd.slice(6, 8), 10);
        if (y < 1900 || y > 2099 || m < 1 || m > 12 || d < 1 || d > 31) return null;
        return { y, m, d };
    };

    const solarParsed = parseYmd(solar);
    const lunarParsed = parseYmd(lunar);

    if (!name && !solarParsed && !lunarParsed) {
        alert('이름 또는 생년월일(양력/음력) 중 하나 이상을 입력해주세요.');
        return;
    }

    // 각 달력별로 별도 계산
    const sajuSolar = solarParsed ? calcSajuValue(solarParsed.y, solarParsed.m, solarParsed.d) : null;
    const sajuLunar = lunarParsed ? calcSajuValue(lunarParsed.y, lunarParsed.m, lunarParsed.d) : null;
    const haeunSolar = solarParsed ? calcHaeunValue(refY, solarParsed.m, solarParsed.d) : null;
    const haeunLunar = lunarParsed ? calcHaeunValue(refY, lunarParsed.m, lunarParsed.d) : null;

    // 출력 바인딩
    if (sajuSolar) {
        document.getElementById('sajuFirstSolar').textContent = sajuSolar.firstVal;
        document.getElementById('sajuSecondSolar').textContent = sajuSolar.secondVal;
        document.getElementById('sajuDescSolar').textContent = `양력 합 ${sajuSolar.total} → 첫값 ${sajuSolar.firstVal}, 둘째값 ${sajuSolar.secondVal}`;
        const sms = sajuMeanings[sajuSolar.firstVal];
        const sms2 = sajuMeanings[sajuSolar.secondVal];
        document.getElementById('sajuMeaningSolar').textContent = sms ? `${sms.emoji} ${sms.title}: ${sms.text}` : '';
        const sms2El = document.getElementById('sajuMeaningSolar2');
        if (sms2El) sms2El.textContent = sms2 ? `${sms2.emoji} ${sms2.title}: ${sms2.text}` : '';
    } else {
        document.getElementById('sajuFirstSolar').textContent = '-';
        document.getElementById('sajuSecondSolar').textContent = '-';
        document.getElementById('sajuDescSolar').textContent = '';
        document.getElementById('sajuMeaningSolar').textContent = '';
        const sms2El = document.getElementById('sajuMeaningSolar2');
        if (sms2El) sms2El.textContent = '';
    }

    if (sajuLunar) {
        document.getElementById('sajuFirstLunar').textContent = sajuLunar.firstVal;
        document.getElementById('sajuSecondLunar').textContent = sajuLunar.secondVal;
        document.getElementById('sajuDescLunar').textContent = `음력 합 ${sajuLunar.total} → 첫값 ${sajuLunar.firstVal}, 둘째값 ${sajuLunar.secondVal}`;
        const sml = sajuMeanings[sajuLunar.firstVal];
        const sml2 = sajuMeanings[sajuLunar.secondVal];
        document.getElementById('sajuMeaningLunar').textContent = sml ? `${sml.emoji} ${sml.title}: ${sml.text}` : '';
        const sml2El = document.getElementById('sajuMeaningLunar2');
        if (sml2El) sml2El.textContent = sml2 ? `${sml2.emoji} ${sml2.title}: ${sml2.text}` : '';
    } else {
        document.getElementById('sajuFirstLunar').textContent = '-';
        document.getElementById('sajuSecondLunar').textContent = '-';
        document.getElementById('sajuDescLunar').textContent = '';
        document.getElementById('sajuMeaningLunar').textContent = '';
        const sml2El = document.getElementById('sajuMeaningLunar2');
        if (sml2El) sml2El.textContent = '';
    }

    if (haeunSolar) {
        document.getElementById('haeunFirstSolar').textContent = haeunSolar.firstVal;
        document.getElementById('haeunSecondSolar').textContent = haeunSolar.secondVal;
        document.getElementById('haeunDescSolar').textContent = `기준연도 합 ${haeunSolar.total} → 첫값 ${haeunSolar.firstVal}, 둘째값 ${haeunSolar.secondVal}`;
        const hks = `${haeunSolar.firstVal}/${haeunSolar.secondVal}`;
        const hms = haeunMeanings[hks];
        document.getElementById('haeunMeaningSolar').textContent = hms ? `점수 ${hms.score}점 ${hms.star} · ${hms.text}` : '';
    } else {
        document.getElementById('haeunFirstSolar').textContent = '-';
        document.getElementById('haeunSecondSolar').textContent = '-';
        document.getElementById('haeunDescSolar').textContent = '';
        document.getElementById('haeunMeaningSolar').textContent = '';
    }

    if (haeunLunar) {
        document.getElementById('haeunFirstLunar').textContent = haeunLunar.firstVal;
        document.getElementById('haeunSecondLunar').textContent = haeunLunar.secondVal;
        document.getElementById('haeunDescLunar').textContent = `기준연도 합 ${haeunLunar.total} → 첫값 ${haeunLunar.firstVal}, 둘째값 ${haeunLunar.secondVal}`;
        const hkl = `${haeunLunar.firstVal}/${haeunLunar.secondVal}`;
        const hml = haeunMeanings[hkl];
        document.getElementById('haeunMeaningLunar').textContent = hml ? `점수 ${hml.score}점 ${hml.star} · ${hml.text}` : '';
    } else {
        document.getElementById('haeunFirstLunar').textContent = '-';
        document.getElementById('haeunSecondLunar').textContent = '-';
        document.getElementById('haeunDescLunar').textContent = '';
        document.getElementById('haeunMeaningLunar').textContent = '';
    }

    // 안내 문구는 고정 공지로 상단에 표시됨

    if (name) {
        renderNameChips(name);
    } else {
        nameSajuValues.innerHTML = '';
    }

    emptyState.classList.add('hidden');
    resultsWrap.classList.remove('hidden');
}

if (form) {
    form.addEventListener('submit', onSubmit);
}

if (copyBtn && document.getElementById('sajuFirstSolar')) {
    copyBtn.addEventListener('click', async () => {
        const nameNums = getNameNumbers(nameEl.value.trim()).map(n => n.num || 0).join(', ');
        const sajuSolar = `${document.getElementById('sajuFirstSolar').textContent} , ${document.getElementById('sajuSecondSolar').textContent}`;
        const sajuLunar = `${document.getElementById('sajuFirstLunar').textContent}, ${document.getElementById('sajuSecondLunar').textContent}`;
        const haeunSolar = `${document.getElementById('haeunFirstSolar').textContent}/${document.getElementById('haeunSecondSolar').textContent}`;
        const haeunLunar = `${document.getElementById('haeunFirstLunar').textContent}/${document.getElementById('haeunSecondLunar').textContent}`;
        const text = [
            `이름 : ${nameEl.value.trim()} : ${nameNums}`,
            `사주번호(양력) : ${sajuSolar}`,
            `사주번호(음력) : ${sajuLunar}`,
            `해운번호(양력): ${haeunSolar}`,
            `해운번호(음력): ${haeunLunar}`,
        ].join('\n');
        try {
            await navigator.clipboard.writeText(text);
            copyBtn.textContent = '복사됨!';
            setTimeout(() => (copyBtn.textContent = '결과 복사'), 1200);
        } catch (e) {
            alert('복사에 실패했어요. 브라우저 권한을 확인해주세요.');
        }
    });
}

if (shareBtn && document.getElementById('sajuFirstSolar')) {
    shareBtn.addEventListener('click', async () => {
        const nameNums = getNameNumbers(nameEl.value.trim()).map(n => n.num || 0).join(', ');
        const sajuSolar = `${document.getElementById('sajuFirstSolar').textContent} , ${document.getElementById('sajuSecondSolar').textContent}`;
        const sajuLunar = `${document.getElementById('sajuFirstLunar').textContent}, ${document.getElementById('sajuSecondLunar').textContent}`;
        const haeunSolar = `${document.getElementById('haeunFirstSolar').textContent}/${document.getElementById('haeunSecondSolar').textContent}`;
        const haeunLunar = `${document.getElementById('haeunFirstLunar').textContent}/${document.getElementById('haeunSecondLunar').textContent}`;
        const text = [
            `이름 : ${nameEl.value.trim()} : ${nameNums}`,
            `사주번호(양력) : ${sajuSolar}`,
            `사주번호(음력) : ${sajuLunar}`,
            `해운번호(양력): ${haeunSolar}`,
            `해운번호(음력): ${haeunLunar}`,
        ].join('\n');
        if (navigator.share) {
            try {
                await navigator.share({ title: '이름 사주번호 계산기', text });
            } catch (_) {}
        } else {
            try {
                await navigator.clipboard.writeText(text);
                alert('공유 기능이 없어 복사했습니다. 붙여넣어 공유해주세요.');
            } catch (e) {
                alert('공유/복사에 실패했어요.');
            }
        }
    });
}

if (resetBtn && form) {
    resetBtn.addEventListener('click', () => {
        form.reset();
        setTodayDefaults();
        resultsWrap.classList.add('hidden');
        emptyState.classList.remove('hidden');
        if (nameSajuValues) nameSajuValues.innerHTML = '';
    });
}
*/

// Export functions
export {
    sumDigits,
    calcSajuValue,
    calcHaeunValue,
    getNameNumbers,
    getNameNumbersForPrompt,
    formatResultText,
    sajuMeanings,
    haeunMeanings,
    nameMap
};

