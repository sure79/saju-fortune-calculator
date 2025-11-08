/**
 * 사주 매칭 시스템 (Saju Matching System)
 * 사주번호를 기반으로 잘 맞는 장소, 번호, 지형, 사주번호를 제공
 * 2025년 기준
 */

// ========================================
// 1. 행운/지양 숫자 시스템
// ========================================
const luckyNumbers = {
  fortune: [1, 3, 4, 5, 6, 7, 10, 11, 14, 17, 19, 21],
  avoid: [0, 2, 8, 9, 12, 13, 15, 16, 18, 20]
};

/**
 * 특정 사주번호의 행운/지양 숫자 가져오기
 */
function getLuckyNumbers(sajuNumber) {
  return {
    fortuneNumbers: luckyNumbers.fortune,
    avoidNumbers: luckyNumbers.avoid,
    personalLucky: sajuNumber, // 자신의 사주번호도 행운의 숫자
  };
}

// ========================================
// 2. 지역 매칭 시스템 (초성 기반)
// ========================================
const locationMatching = {
  2: {
    consonants: ['ㄱ', 'ㄴ', 'ㅇ'],
    terrain: '물',
    description: '물과 관련된 지역이 좋습니다. 강, 바다, 호수 근처에서 편안함과 안정감을 느낍니다. 물의 흐름처럼 유연한 에너지가 당신의 운을 돕습니다.',
    examples: ['강남구', '노원구', '인천', '영등포구', '안양시']
  },
  3: {
    consonants: ['ㄴ', 'ㄷ', 'ㅁ', 'ㅂ'],
    terrain: '언덕',
    description: '언덕이나 높은 지대가 좋습니다. 풍요와 포용력을 상징하는 완만한 경사지에서 창조적 에너지가 발휘됩니다. 자연과 함께하는 여유로운 공간이 이상적입니다.',
    examples: ['남양주시', '대구', '목포', '부산', '부천시']
  },
  4: {
    consonants: ['ㄷ', 'ㅅ'],
    terrain: '산',
    description: '산이 있는 지역이 좋습니다. 확고한 기반과 리더십을 상징하는 산세가 강한 곳에서 추진력과 결단력이 극대화됩니다. 높은 곳에서 내려다보는 전망이 운세를 돕습니다.',
    examples: ['대전', '서울', '수원', '성남시', '속초']
  },
  5: {
    consonants: ['ㄷ', 'ㅂ'],
    terrain: '평지',
    description: '평평한 지형이 좋습니다. 넓고 탁 트인 평야나 평지에서 사교성과 소통 능력이 발휘됩니다. 여러 사람이 모이는 열린 공간이 인간관계 운을 높입니다.',
    examples: ['대구', '부산', '동작구', '도봉구', '부평구']
  },
  6: {
    consonants: ['ㄱ', 'ㄴ', 'ㅇ'],
    terrain: '물',
    description: '물과 가까운 지역이 좋습니다. 감성과 힐링을 상징하는 수변 공간에서 정서적 안정과 사랑의 에너지가 충만해집니다. 물소리가 들리는 곳이 이상적입니다.',
    examples: ['강서구', '광주', '영종도', '광명시', '안산시']
  },
  7: {
    consonants: ['ㄷ', 'ㅈ'],
    terrain: '중심가',
    description: '중심가나 교통이 발달한 곳이 좋습니다. 빠른 이동과 역동성을 상징하는 교통 요지나 번화가에서 추진력과 승리의 기운이 강화됩니다. 활동적인 에너지가 모이는 곳입니다.',
    examples: ['종로구', '중구', '제주', '전주', '진주']
  },
  8: {
    consonants: ['ㄱ', 'ㅂ', 'ㅅ'],
    terrain: '중앙',
    description: '중앙에 위치한 번화가가 좋습니다. 느리지만 확실한 성장을 상징하는 중심지에서 인내와 끈기가 결실을 맺습니다. 안정적이고 성실한 에너지가 흐르는 곳입니다.',
    examples: ['강남구', '부천시', '서초구', '광진구', '성동구']
  },
  9: {
    consonants: ['ㅅ', 'ㅇ', 'ㅈ', 'ㅎ'],
    terrain: '북쪽',
    description: '북쪽 방향의 지역이 좋습니다. 고독과 깊은 사색을 상징하는 북쪽 방위에서 통찰력과 집중력이 극대화됩니다. 조용하고 차분한 에너지가 당신의 지혜를 돕습니다.',
    examples: ['성북구', '은평구', '종로구', '양천구', '용산구']
  },
  10: {
    consonants: ['ㄴ'],
    terrain: '물가',
    description: '강이나 호수 근처가 좋습니다. 변화와 순환을 상징하는 흐르는 물가에서 적응력과 운명의 흐름이 조화롭게 흘러갑니다. 물의 변화무쌍함이 행운을 가져옵니다.',
    examples: ['노원구', '남구', '남양주시']
  },
  11: {
    consonants: ['ㄱ', 'ㄴ', 'ㅂ', 'ㅅ'],
    terrain: '균형잡힌 곳',
    description: '도심과 자연이 조화로운 곳이 좋습니다. 균형과 공정을 상징하는 조화로운 공간에서 판단력과 객관성이 빛을 발합니다. 양쪽의 장점을 모두 취할 수 있는 중도의 장소입니다.',
    examples: ['강남구', '강동구', '분당구', '송파구', '서초구']
  }
};

/**
 * 사주번호에 맞는 지역 정보 가져오기
 */
function getLocationMatch(sajuNumber) {
  // 사주번호가 12 이상이면 각 자릿수로 분해
  const baseNumbers = sajuNumber > 11 
    ? [Math.floor(sajuNumber / 10), sajuNumber % 10]
    : [sajuNumber];
  
  const matches = baseNumbers.map(num => locationMatching[num]).filter(m => m);
  
  if (matches.length === 0) return null;
  
  // 여러 매칭이 있으면 통합
  return {
    consonants: [...new Set(matches.flatMap(m => m.consonants))],
    terrain: matches.map(m => m.terrain).join(', '),
    description: matches.map(m => m.description).join(' 또는 '),
    examples: [...new Set(matches.flatMap(m => m.examples))]
  };
}

// ========================================
// 3. 사주번호별 특성 데이터베이스
// ========================================
const sajuCharacteristics = {
  0: {
    name: '바보(광대)',
    element: '물',
    keywords: ['자유분방', '새로운 시작', '순수', '미성숙'],
    strengths: ['자유로운 영혼', '활동적', '순수함'],
    weaknesses: ['끈기 부족', '성급함', '세상 물정 모름'],
    compatibility: [1, 3, 5, 21]
  },
  1: {
    name: '마법사',
    element: '불',
    keywords: ['창조력', '재능', '영리함', '매력'],
    strengths: ['뛰어난 기술', '임기응변', '카리스마'],
    weaknesses: ['계산적', '자만심', '과시욕'],
    compatibility: [5, 6, 7, 8]
  },
  2: {
    name: '여사제',
    element: '물',
    keywords: ['진지함', '신중함', '통찰력', '내면'],
    strengths: ['깊은 사고', '집중력', '분석력'],
    weaknesses: ['지나친 신중함', '소극적', '답정너'],
    compatibility: [5, 9, 10, 11]
  },
  3: {
    name: '여황제',
    element: '흙',
    keywords: ['포용력', '관대함', '예술성', '무관심'],
    strengths: ['예술적 감각', '포용력', '힐링 능력'],
    weaknesses: ['게으름', '무관심', '산만함'],
    compatibility: [5, 6, 21]
  },
  4: {
    name: '황제',
    element: '불',
    keywords: ['리더십', '자수성가', '고집', '책임감'],
    strengths: ['리더십', '추진력', '책임감'],
    weaknesses: ['고집', '독단적', '완벽주의'],
    compatibility: [2, 6, 8, 11]
  },
  5: {
    name: '교황',
    element: '나무',
    keywords: ['조언자', '인간관계', '약속', '실천력 부족'],
    strengths: ['좋은 조언', '사교성', '중재 능력'],
    weaknesses: ['약속 불이행', '우유부단', '반복 질문'],
    compatibility: [1, 2, 3, 7, 12]
  },
  6: {
    name: '연인',
    element: '물',
    keywords: ['힐링', '연애', '감정', '소비'],
    strengths: ['공감 능력', '사랑스러움', '예술성'],
    weaknesses: ['감정 기복', '과소비', '우유부단'],
    compatibility: [1, 3, 4, 10]
  },
  7: {
    name: '전차',
    element: '물+불',
    keywords: ['추진력', '승리', '성급함', '고집'],
    strengths: ['강한 추진력', '승부욕', '결단력'],
    weaknesses: ['성급함', '고집', '독단적'],
    compatibility: [1, 5, 11, 13]
  },
  8: {
    name: '힘',
    element: '산신줄',
    keywords: ['인내', '느림', '끈기', '참을성'],
    strengths: ['끈기', '인내심', '성실함'],
    weaknesses: ['느림', '소극적', '답답함'],
    compatibility: [4, 6, 10, 11]
  },
  9: {
    name: '은둔자',
    element: '산신줄',
    keywords: ['집착', '고독', '통찰력', '이면성'],
    strengths: ['깊은 통찰', '집중력', '완벽주의'],
    weaknesses: ['외로움', '이면적', '집착'],
    compatibility: [2, 5, 10, 11]
  },
  10: {
    name: '운명의 수레바퀴',
    element: '물',
    keywords: ['변동', '감정 기복', '순환', '행운'],
    strengths: ['적응력', '변화 수용', '행운'],
    weaknesses: ['감정 변동', '불안정', '의존성'],
    compatibility: [2, 6, 8, 9]
  },
  11: {
    name: '정의',
    element: '쇠',
    keywords: ['공정함', 'Give and Take', '균형', '법'],
    strengths: ['공정함', '객관성', '판단력'],
    weaknesses: ['융통성 없음', '냉정함', '계산적'],
    compatibility: [2, 4, 7, 8]
  },
  12: {
    name: '매달린 사람',
    element: '물',
    keywords: ['예술성', '희생', '인플루언서', '창의성'],
    strengths: ['예술적 재능', '창의성', '영향력'],
    weaknesses: ['자기희생', '우유부단', '수동적'],
    compatibility: [3, 5, 6],
    special: '6+6번의 사주로 예술적 기질 탁월, 12/5는 인플루언서/아나운서 사주'
  },
  13: {
    name: '죽음',
    element: '물',
    keywords: ['변화', '종료', '새 시작', '급함과 고집'],
    strengths: ['변화 수용', '새로운 시작', '결단력'],
    weaknesses: ['두려움', '저항', '집착'],
    compatibility: [5, 7, 14, 20],
    special: '7번의 성급함과 4번의 고집이 포함됨'
  },
  14: {
    name: '절제',
    element: '물',
    keywords: ['균형', '조화', '절제', '야망'],
    strengths: ['균형감각', '조화', '인내'],
    weaknesses: ['우유부단', '책임 면피', '과도한 야망'],
    compatibility: [6, 10, 13]
  },
  15: {
    name: '악마',
    element: '물',
    keywords: ['유혹', '집착', '물질', '쾌락'],
    strengths: ['매력', '열정', '추진력'],
    weaknesses: ['중독성', '집착', '물질주의'],
    compatibility: [1, 5, 7],
    special: '6번의 업그레이드 버전'
  },
  16: {
    name: '탑',
    element: '불',
    keywords: ['파괴', '급변', '깨달음', '시간'],
    strengths: ['변화 대응', '재기', '깨달음'],
    weaknesses: ['충격', '혼란', '말실수'],
    compatibility: [10, 13, 20],
    special: '8번 두 개 - 성공에 시간이 걸림, 7번 업그레이드 - 성격 급하고 욱함, 말실수 주의, 정이 많고 다정함'
  },
  17: {
    name: '별',
    element: '물',
    keywords: ['희망', '치유', '긍정', '행운'],
    strengths: ['희망적', '치유 능력', '영감'],
    weaknesses: ['비현실적', '몽상', '수동적'],
    compatibility: [3, 5, 6, 18],
    special: '3번, 6번, 10번 모두 합침 - 힘든 일도 좋은 방향으로, 좋은 일은 더 좋게 만듦'
  },
  18: {
    name: '달',
    element: '물',
    keywords: ['이면성', '혼란', '직관', '불안'],
    strengths: ['직관력', '예술성', '깊이'],
    weaknesses: ['불안', '혼란', '이중성'],
    compatibility: [2, 9, 17],
    special: '9번 두 개 - 이면적 성격, 새로운 사람에겐 친절하나 익숙한 사람에게 박대'
  },
  19: {
    name: '태양',
    element: '불',
    keywords: ['성공', '행복', '긍정', '개인주의'],
    strengths: ['긍정적', '활력', '성공'],
    weaknesses: ['자만심', '과시욕', '개인주의'],
    compatibility: [1, 3, 21],
    special: '9번+10번 - 개인주의를 보완한 사주, 시간을 두든 거리를 가까워져야만 진면목 알 수 있음'
  },
  20: {
    name: '심판',
    element: '불',
    keywords: ['부활', '평가', '희귀함', '얼리어댑터'],
    strengths: ['재기', '각성', '판단력'],
    weaknesses: ['심판적', '과거 집착', '불안'],
    compatibility: [0, 13, 16],
    special: '2번+10번 - 얼리어댑터, 희귀한 것을 할 확률 높음'
  },
  21: {
    name: '세계',
    element: '하늘',
    keywords: ['완성', '성취', '여행', '도전'],
    strengths: ['완성도', '성취', '활동성'],
    weaknesses: ['공주병', '게으름', '선택적 노력'],
    compatibility: [0, 1, 3, 19],
    special: '3번의 게으름을 보완한 도전하는 3번 사주'
  }
};

/**
 * 사주번호 궁합 확인
 */
function checkCompatibility(myNumber, partnerNumber) {
  const myChar = sajuCharacteristics[myNumber];
  if (!myChar) return { compatible: false, reason: '유효하지 않은 사주번호' };
  
  const isCompatible = myChar.compatibility.includes(partnerNumber);
  
  return {
    compatible: isCompatible,
    myCharacter: myChar,
    partnerCharacter: sajuCharacteristics[partnerNumber],
    reason: isCompatible 
      ? '서로 좋은 에너지를 주고받는 궁합입니다' 
      : '서로 다른 특성을 이해하고 배려가 필요합니다'
  };
}

// ========================================
// 4. 특수 사주 조합 정보
// ========================================
const specialCombinations = {
  '상대방_덕을_보는_사주': [
    { first: 10, second: 3 },
    { first: 6, second: 8 },
    { first: 8, second: 10 },
    { first: 17, second: 10 },
    { first: 17, second: 9 },
    { first: 5, second: 7 },
    { first: 18, second: 10 }
  ],
  '더_나은_사람을_찾는_성향': [
    { first: 11, second: 4 },
    { first: 7, second: 11 },
    { first: 2, second: 6 }
  ],
  '야망이_많은_사주': [
    { first: 14, second: 7 }
  ]
};

/**
 * 특수 조합 확인
 */
function checkSpecialCombination(first, second) {
  const results = [];
  
  for (const [category, combinations] of Object.entries(specialCombinations)) {
    const match = combinations.find(c => c.first === first && c.second === second);
    if (match) {
      results.push({
        category: category,
        description: getCategoryDescription(category)
      });
    }
  }
  
  return results;
}

function getCategoryDescription(category) {
  const descriptions = {
    '상대방_덕을_보는_사주': '상대방의 도움과 인연으로 성공하는 사주입니다. 협력 관계에서 큰 시너지를 발휘하며, 좋은 파트너를 만나면 본인의 능력이 몇 배로 증폭됩니다. 인간관계가 재물과 성공의 핵심 열쇠입니다.',
    '더_나은_사람을_찾는_성향': '더 나은 조건의 사람을 찾으려는 성향이 있습니다. 현재에 만족하기보다 더 좋은 기회를 탐색하는 특성이 있으며, 이는 발전의 원동력이 될 수도 있지만 때로는 관계의 불안정을 초래할 수 있습니다. 균형잡힌 시각이 필요합니다.',
    '야망이_많은_사주': '큰 야망과 목표가 있으나 책임을 피하려는 경향이 있습니다. 높은 이상을 품고 있지만 실천과 책임감이 뒷받침되어야 성공할 수 있습니다. 목표를 현실화하는 구체적인 행동 계획과 책임감이 성공의 열쇠입니다.'
  };
  return descriptions[category] || '';
}

// ========================================
// 5. 띠별 타로 매칭
// ========================================
const zodiacMatching = {
  '쥐': {
    years: [1948, 1960, 1972, 1984, 1996, 2008, 2020],
    tarot: [1, 5],
    keywords: ['영리함', '창조력', '사교성', '인간관계']
  },
  '소': {
    years: [1949, 1961, 1973, 1985, 1997, 2009, 2021],
    tarot: [4, 8],
    keywords: ['성실함', '리더십', '인내', '근면']
  },
  '호랑이': {
    years: [1950, 1962, 1974, 1986, 1998, 2010, 2022],
    tarot: [4, 7],
    keywords: ['자수성가', '리더십', '추진력', '고집']
  },
  '토끼': {
    years: [1951, 1963, 1975, 1987, 1999, 2011, 2023],
    tarot: [6, 3],
    keywords: ['힐링', '온화함', '관대함', '예술성']
  },
  '용': {
    years: [1952, 1964, 1976, 1988, 2000, 2012, 2024],
    tarot: [1, 7],
    keywords: ['창조성', '주도성', '승리', '추진력']
  },
  '뱀': {
    years: [1953, 1965, 1977, 1989, 2001, 2013, 2025],
    tarot: [2, 9],
    keywords: ['신중함', '지혜', '집착', '통찰력']
  },
  '말': {
    years: [1954, 1966, 1978, 1990, 2002, 2014],
    tarot: [7, 5],
    keywords: ['자유로움', '추진력', '인간관계', '흐름']
  },
  '양': {
    years: [1955, 1967, 1979, 1991, 2003, 2015],
    tarot: [6, 3],
    keywords: ['힐링', '평화', '온순함', '관대함']
  },
  '원숭이': {
    years: [1956, 1968, 1980, 1992, 2004, 2016],
    tarot: [1, 5],
    keywords: ['재치', '창의력', '적응력', '사교성']
  },
  '닭': {
    years: [1957, 1969, 1981, 1993, 2005, 2017],
    tarot: [4, 11],
    keywords: ['책임감', '리더십', '공정함', 'Give and Take']
  },
  '개': {
    years: [1958, 1970, 1982, 1994, 2006, 2018],
    tarot: [11, 8],
    keywords: ['의리', '공정함', '충직함', '인내']
  },
  '돼지': {
    years: [1959, 1971, 1983, 1995, 2007, 2019],
    tarot: [0, 3],
    keywords: ['순수함', '새 시작', '관대함', '사교성']
  }
};

/**
 * 출생연도로 띠 찾기
 */
function getZodiacByYear(year) {
  for (const [zodiac, data] of Object.entries(zodiacMatching)) {
    if (data.years.includes(year)) {
      return { zodiac, ...data };
    }
  }
  return null;
}

// ========================================
// 6. 종합 매칭 함수
// ========================================

/**
 * 사주번호 기반 종합 매칭 정보
 */
function getComprehensiveMatch(sajuNumber, birthYear = null) {
  const result = {
    sajuNumber: sajuNumber,
    character: sajuCharacteristics[sajuNumber],
    luckyInfo: getLuckyNumbers(sajuNumber),
    locationInfo: getLocationMatch(sajuNumber),
    compatibleSaju: sajuCharacteristics[sajuNumber]?.compatibility || [],
    specialNotes: sajuCharacteristics[sajuNumber]?.special || null
  };
  
  // 띠 정보 추가 (출생연도가 있는 경우)
  if (birthYear) {
    result.zodiacInfo = getZodiacByYear(birthYear);
  }
  
  return result;
}

/**
 * 두 사주번호의 궁합 분석
 */
function analyzeRelationship(myNumber, partnerNumber, myYear = null, partnerYear = null) {
  const compatibility = checkCompatibility(myNumber, partnerNumber);
  const special = checkSpecialCombination(myNumber, partnerNumber);
  
  const result = {
    myInfo: getComprehensiveMatch(myNumber, myYear),
    partnerInfo: getComprehensiveMatch(partnerNumber, partnerYear),
    compatibility: compatibility,
    specialCombinations: special,
    recommendation: generateRecommendation(compatibility, special)
  };
  
  return result;
}

function generateRecommendation(compatibility, special) {
  let recommendation = '';
  
  if (compatibility.compatible) {
    recommendation = '✅ 좋은 궁합입니다. ';
  } else {
    recommendation = '⚠️ 서로 다른 특성이 있습니다. ';
  }
  
  if (special.length > 0) {
    recommendation += special.map(s => s.description).join(' ');
  } else {
    recommendation += compatibility.compatible 
      ? '서로의 장점을 살리며 함께 성장할 수 있습니다.'
      : '상호 이해와 배려가 필요합니다.';
  }
  
  return recommendation;
}

// ========================================
// 7. Export (Node.js/브라우저 환경 모두 지원)
// ========================================

if (typeof module !== 'undefined' && module.exports) {
  // Node.js 환경
  module.exports = {
    luckyNumbers,
    locationMatching,
    sajuCharacteristics,
    zodiacMatching,
    getLuckyNumbers,
    getLocationMatch,
    checkCompatibility,
    checkSpecialCombination,
    getZodiacByYear,
    getComprehensiveMatch,
    analyzeRelationship
  };
} else {
  // 브라우저 환경
  window.SajuMatching = {
    luckyNumbers,
    locationMatching,
    sajuCharacteristics,
    zodiacMatching,
    getLuckyNumbers,
    getLocationMatch,
    checkCompatibility,
    checkSpecialCombination,
    getZodiacByYear,
    getComprehensiveMatch,
    analyzeRelationship
  };
}

// ========================================
// 8. 사용 예시
// ========================================

/*
// 예시 1: 내 사주 종합 정보
const myMatch = getComprehensiveMatch(5, 1990);
console.log('내 사주 정보:', myMatch);

// 예시 2: 궁합 분석
const relationship = analyzeRelationship(5, 7, 1990, 1988);
console.log('궁합 분석:', relationship);

// 예시 3: 특정 지역 매칭
const location = getLocationMatch(5);
console.log('좋은 지역:', location);

// 예시 4: 행운의 숫자
const lucky = getLuckyNumbers(5);
console.log('행운의 숫자:', lucky);
*/
