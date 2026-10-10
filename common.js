function isLiveChat(url) {
    return url.startsWith('https://www.youtube.com/live_chat?')
        || url.startsWith('https://www.youtube.com/live_chat_replay?')
        ;
}

const ZENKAKU_MAP = {
    '０': '0', '１': '1', '２': '2', '３': '3', '４': '4',
    '５': '5', '６': '6', '７': '7', '８': '8', '９': '9',
    '：': ':', '－': '-', 'ー': '-', '―': '-',
};

// 全角数字・記号を半角に変換する(1文字→1文字なので文字列長は変わらない)
function normalizeFullwidthDigits(rawText) {
    return rawText.replace(/[０-９：－ー―]/g, ch => ZENKAKU_MAP[ch]);
}

// 全角数字・記号を半角に正規化しつつ、コロン省略入力("828"→"8:28"等)を
// 既存パーサーが扱える "8:28" 形式へ変換する
function normalizeTimecodeText(rawText) {
    let text = normalizeFullwidthDigits(rawText).trim();

    const negative = text.startsWith('-');
    const body = negative ? text.slice(1) : text;

    // コロンなしの3桁以上の数字列は、右から2桁ずつ区切って MM:SS / HH:MM:SS とみなす
    if (/^\d{3,}$/.test(body)) {
        const groups = [];
        let rest = body;
        while (rest.length > 2) {
            groups.unshift(rest.slice(-2));
            rest = rest.slice(0, -2);
        }
        groups.unshift(rest);
        text = (negative ? '-' : '') + groups.join(':');
    }

    return text;
}

// Node (テスト) からはモジュールとして読み込めるようにする。
// ブラウザのcontent script実行時はmoduleが存在しないため何もしない。
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { isLiveChat, normalizeFullwidthDigits, normalizeTimecodeText };
}
