import { sajuData, haewoonData } from './sajuData.js';
import { checkSpecialCombination, getZodiacByYear } from './sajuMatching.js';

/**
 * Calculate Saju Number
 * Rule:
 * 1. Sum Year+Month+Day
 * 2. If >= 2000:
 *    - Take last 2 digits.
 *    - If > 21, take the last digit (e.g. 33 -> 3).
 *    - Sum digits of the original sum? No, sum digits of the *result*?
 *    - Let's follow the example: 2010+5+18=2033 -> 33 -> 3. Then 2+0+3+3=8. Result 3, 8.
 *    - Wait, the example says "33 (21 이상이므로 3 사용)". This means the first number is 3.
 *    - The second number is sum of digits of 2033 -> 8.
 * 3. If < 2000:
 *    - Split sum into 2 parts (Year part / MD part? No, "반으로 자르기").
 *    - Example: 1970+5+15=1990 -> 19 / 90.
 *    - Sum each part: 1+9=10, 9+0=9.
 *    - First number = Sum of second part (9).
 *    - Second number = Sum of (Sum1 + Sum2) -> 10+9=19.
 */
function calculateSajuNumber(year, month, day) {
    const sum = year + month + day;
    let num1, num2;

    if (sum >= 2000) {
        // Rule for >= 2000
        const lastTwo = sum % 100;
        // "21 이상이면 마지막 숫자만 사용"
        // "21 이하면 그대로 사용"
        if (lastTwo > 21) {
            num1 = lastTwo % 10;
        } else {
            num1 = lastTwo;
        }

        // Second number: Sum of all digits of the total sum
        let tempSum = sum;
        let digitSum = 0;
        while (tempSum > 0) {
            digitSum += tempSum % 10;
            tempSum = Math.floor(tempSum / 10);
        }

        // Reduce to single digit if needed?
        // The example 2+0+3+3=8 (single digit).
        // Example 2+0+3+5=10 (not single digit).
        // "한 자리 숫자가 될 때까지 더합니다" -> Recursive sum
        while (digitSum > 21) {
            let temp = digitSum;
            while (temp > 21) {
                let s = 0;
                while (temp > 0) {
                    s += temp % 10;
                    temp = Math.floor(temp / 10);
                }
                temp = s;
            }
            digitSum = temp;
        }
        num2 = digitSum;

    } else {
        // Rule for < 2000
        const sumStr = sum.toString();
        // "반으로 자르기 (앞 2자리 / 뒤 2자리)"
        // Assuming sum is 4 digits (19xx)
        const part1Str = sumStr.substring(0, 2);
        const part2Str = sumStr.substring(2);

        const sumPart1 = parseInt(part1Str[0]) + parseInt(part1Str[1]);
        const sumPart2 = parseInt(part2Str[0]) + parseInt(part2Str[1]);

        // "뒤에서 더한 값 = 첫 번째 값"
        num1 = sumPart2;

        // "두 값을 합쳐서 각 자리를 더함 = 두 번째 값"
        // Example: 10 + 9 = 19.
        // Example 6: 10 + 17 = 27 -> 2+7=9.
        let combined = sumPart1 + sumPart2;
        if (combined > 21) {
            let s = 0;
            let temp = combined;
            while (temp > 0) {
                s += temp % 10;
                temp = Math.floor(temp / 10);
            }
            num2 = s;
        } else {
            num2 = combined;
        }
    }

    return [num1, num2];
}

/**
 * Calculate Haewoon Number (2025 Base)
 */
function calculateHaewoonNumber(month, day) {
    const baseYear = 2025;
    const sum = baseYear + month + day;

    // 1. Last two digits check
    const lastTwo = sum % 100;
    let num1;
    if (lastTwo > 21) {
        num1 = lastTwo % 10;
    } else {
        num1 = lastTwo;
    }

    // Special case: if num1 is 10, convert to 0 (per user requirement)
    if (num1 === 10) {
        num1 = 0;
    }

    // 2. Sum of all digits
    let tempSum = sum;
    let digitSum = 0;
    while (tempSum > 0) {
        digitSum += tempSum % 10;
        tempSum = Math.floor(tempSum / 10);
    }

    let num2 = digitSum;
    while (num2 > 21) {
        let s = 0;
        let temp = num2;
        while (temp > 0) {
            s += temp % 10;
            temp = Math.floor(temp / 10);
        }
        num2 = s;
    }

    return `${num1}/${num2}`;
}

/**
 * Main Analysis Function
 */
export function analyzeSaju(name, birthDateStr) {
    const date = new Date(birthDateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 1. Calculate Numbers
    const [sajuNum1, sajuNum2] = calculateSajuNumber(year, month, day);
    const haewoon = calculateHaewoonNumber(month, day);

    // 2. Get Interpretations
    const saju1Info = sajuData[sajuNum1] || { title: `${sajuNum1}번`, content: {} };
    const saju2Info = sajuData[sajuNum2] || { title: `${sajuNum2}번`, content: {} };
    const haewoonInfo = haewoonData[haewoon] || { title: `${haewoon} 해운`, content: { general: '해당 해운 번호에 대한 상세 정보가 없습니다.' } };

    // 3. Check Special Combinations
    const special = checkSpecialCombination(sajuNum1, sajuNum2);

    // 4. Zodiac
    const zodiac = getZodiacByYear(year);

    // 5. Inferred Analysis (from saju_analysis.md)
    const inferred = [];
    if ((sajuNum1 === 20 && sajuNum2 === 2) || (sajuNum1 === 2 && sajuNum2 === 20)) {
        inferred.push({ title: '심화 분석', desc: '사람은 모이지만, 곁은 쉽게 내주지 않는 전문가 성향' });
    }
    if ((sajuNum1 === 12 && sajuNum2 === 4) || (sajuNum1 === 4 && sajuNum2 === 12)) {
        inferred.push({ title: '심화 분석', desc: '남다른 시각을 가진 창의적 사업가' });
    }
    if ((sajuNum1 === 16 && sajuNum2 === 8) || (sajuNum1 === 8 && sajuNum2 === 16)) {
        inferred.push({ title: '심화 분석', desc: '참을성이 많지만 한 번 터지면 무서운 이타주의자' });
    }

    return {
        user: { name, birthDate: birthDateStr, zodiac },
        saju: {
            primary: { number: sajuNum1, info: saju1Info },
            secondary: { number: sajuNum2, info: saju2Info }
        },
        haewoon: {
            number: haewoon,
            info: haewoonInfo
        },
        special: special,
        inferred: inferred
    };
}
