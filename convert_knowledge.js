
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const knowledgeDir = path.join(__dirname, 'knowledge');
const outputFile = path.join(__dirname, 'src', 'sajuData.js');

// Read files
const totalSajuPath = path.join(knowledgeDir, '전체사주풀이.txt');
const totalHaeunPath = path.join(knowledgeDir, '전체해운풀이.txt');

const totalSajuText = fs.readFileSync(totalSajuPath, 'utf-8');
const totalHaeunText = fs.readFileSync(totalHaeunPath, 'utf-8');

/**
 * Parse the Total Saju Text
 */
function parseSajuText(text) {
    const data = {};
    const normalized = text.replace(/\r\n/g, '\n');

    // The file has separators like "~~~~~~~~~~~~~~~~..."
    const sections = normalized.split(/~{10,}/);

    sections.forEach(section => {
        const lines = section.trim().split('\n');
        if (lines.length < 2) return;

        // Extract Number and Title
        const titleLine = lines.find(l => /^\d+번/.test(l));
        if (!titleLine) return;

        const numberMatch = titleLine.match(/^(\d+)번/);
        if (!numberMatch) return;

        const number = parseInt(numberMatch[1]);

        const content = {};
        let currentKey = 'general';
        let buffer = [];

        lines.forEach(line => {
            if (line.includes(titleLine)) return; // Skip title line

            const sectionMatch = line.match(/^\d+\)\s*(.*)/);
            if (sectionMatch) {
                if (buffer.length > 0) {
                    content[currentKey] = buffer.join('\n').trim();
                }
                const sectionTitle = sectionMatch[1].trim();
                if (sectionTitle.includes('그림')) currentKey = 'image_desc';
                else if (sectionTitle.includes('의미')) currentKey = 'meaning';
                else if (sectionTitle.includes('성격')) currentKey = 'personality';
                else if (sectionTitle.includes('직업')) currentKey = 'job';
                else if (sectionTitle.includes('건강')) currentKey = 'health';
                else if (sectionTitle.includes('재물')) currentKey = 'wealth';
                else if (sectionTitle.includes('사업')) currentKey = 'business';
                else if (sectionTitle.includes('애정')) currentKey = 'love';
                else if (sectionTitle.includes('시험')) currentKey = 'exam';
                else if (sectionTitle.includes('이사')) currentKey = 'move';
                else currentKey = sectionTitle;

                buffer = [];
            } else {
                buffer.push(line);
            }
        });

        if (buffer.length > 0) {
            content[currentKey] = buffer.join('\n').trim();
        }

        data[number] = {
            title: titleLine.trim(),
            content: content
        };
    });

    return data;
}

/**
 * Parse the Haewoon Text
 */
function parseHaewoonText(text) {
    const data = {};
    const normalized = text.replace(/\r\n/g, '\n');

    const headerRegex = /^(\d+\/\d+)\s+해운\s+-(.*)/gm;
    let match;
    const indices = [];
    while ((match = headerRegex.exec(normalized)) !== null) {
        indices.push({
            key: match[1],
            title: match[0],
            index: match.index
        });
    }

    for (let i = 0; i < indices.length; i++) {
        const start = indices[i].index;
        const end = (i + 1 < indices.length) ? indices[i + 1].index : normalized.length;
        const block = normalized.substring(start, end);

        const lines = block.split('\n');
        const key = indices[i].key;
        const title = indices[i].title;

        const content = {};
        let subKey = 'summary';
        let subBuffer = [];

        lines.forEach((line, idx) => {
            if (idx === 0) return; // Skip title

            if (line.trim().startsWith('전반적 특징')) {
                if (subBuffer.length) content[subKey] = subBuffer.join('\n').trim();
                subKey = 'general';
                subBuffer = [];
            } else if (line.trim().startsWith('재물운')) {
                if (subBuffer.length) content[subKey] = subBuffer.join('\n').trim();
                subKey = 'wealth';
                subBuffer = [];
            } else if (line.trim().startsWith('애정운')) {
                if (subBuffer.length) content[subKey] = subBuffer.join('\n').trim();
                subKey = 'love';
                subBuffer = [];
            } else if (line.trim().startsWith('직장운')) {
                if (subBuffer.length) content[subKey] = subBuffer.join('\n').trim();
                subKey = 'job';
                subBuffer = [];
            } else if (line.trim().startsWith('건강운')) {
                if (subBuffer.length) content[subKey] = subBuffer.join('\n').trim();
                subKey = 'health';
                subBuffer = [];
            } else if (line.trim().startsWith('오늘 시도해보기')) {
                if (subBuffer.length) content[subKey] = subBuffer.join('\n').trim();
                subKey = 'todo';
                subBuffer = [];
            } else if (line.trim().startsWith('오늘 조심할 점')) {
                if (subBuffer.length) content[subKey] = subBuffer.join('\n').trim();
                subKey = 'caution';
                subBuffer = [];
            } else {
                subBuffer.push(line);
            }
        });
        if (subBuffer.length) content[subKey] = subBuffer.join('\n').trim();

        data[key] = {
            title: title,
            content: content
        };
    }

    return data;
}

const sajuData = parseSajuText(totalSajuText);
const haewoonData = parseHaewoonText(totalHaeunText);

const outputContent = `
// Saju Data (Generated)
export const sajuData = ${JSON.stringify(sajuData, null, 2)};

export const haewoonData = ${JSON.stringify(haewoonData, null, 2)};
`;

fs.writeFileSync(outputFile, outputContent, 'utf-8');
console.log(`Generated ${outputFile}`);
