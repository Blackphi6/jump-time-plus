import assert from 'node:assert/strict';
import { normalizeTimecodeText } from '../common.js';

const cases = [
    ['828', '8:28'],
    ['1202', '12:02'],
    ['90', '90'],       // 2桁以下は従来通りSS扱い
    ['5', '5'],
    ['10203', '1:02:03'],
    ['8:28', '8:28'],   // コロンありはそのまま
    ['-828', '-8:28'],
    ['８２８', '8:28'], // 全角数字
    ['１２：０２', '12:02'], // 全角コロン
];

for (const [input, expected] of cases) {
    const actual = normalizeTimecodeText(input);
    assert.equal(actual, expected, `normalizeTimecodeText(${JSON.stringify(input)}) should be ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

console.log(`OK: ${cases.length} cases passed`);
