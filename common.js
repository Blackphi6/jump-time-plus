export function isLiveChat(url) {
    return url.startsWith('https://www.youtube.com/live_chat?')
        || url.startsWith('https://www.youtube.com/live_chat_replay?')
        ;
}

// 全角数字・記号を半角に正規化しつつ、コロン省略入力("828"→"8:28"等)を
// 既存パーサーが扱える "8:28" 形式へ変換する
export function normalizeTimecodeText(rawText) {
    const zenkakuMap = {
        '０': '0', '１': '1', '２': '2', '３': '3', '４': '4',
        '５': '5', '６': '6', '７': '7', '８': '8', '９': '9',
        '：': ':', '－': '-', 'ー': '-', '―': '-',
    };
    let text = rawText.replace(/[０-９：－ー―]/g, ch => zenkakuMap[ch]).trim();

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
