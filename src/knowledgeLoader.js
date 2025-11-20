// Knowledge Loader
// Vite's ?raw import allows loading text files as strings

import nameSaju from '../knowledge/이름사주번호.txt?raw';
import totalSaju from '../knowledge/전체사주풀이.txt?raw';
import totalHaeun from '../knowledge/전체해운풀이.txt?raw';
import projectGuide from '../knowledge/프로젝트 지침 설정.txt?raw';

export function getKnowledgeBase() {
    return {
        nameSaju,
        totalSaju,
        totalHaeun,
        projectGuide
    };
}

export function getCombinedKnowledge() {
    return `
=== 프로젝트 지침 ===
${projectGuide}

=== 이름 사주 풀이 데이터 ===
${nameSaju}

=== 전체 사주 풀이 데이터 ===
${totalSaju}

=== 전체 해운 풀이 데이터 ===
${totalHaeun}
    `;
}
