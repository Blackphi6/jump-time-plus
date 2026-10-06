let normalizeTimecodeText;
let normalizeFullwidthDigits;

import(chrome.runtime.getURL('common.js')).then(common => {
    normalizeTimecodeText = common.normalizeTimecodeText;
    normalizeFullwidthDigits = common.normalizeFullwidthDigits;
    if (!common.isLiveChat(location.href)) {
        main();
    }
});

function main() {
    let time_current_confirm;
    let prev_textContent;
    let prev_paused;

    const detect_interval = setInterval(() => {
        const player = document.getElementById("movie_player");
        if (!player) return;

        let time_current;
        const time_display = document.getElementsByTagName('player-time-display')?.[0];
        if (time_display) { // new-style YouTube embedded player
            time_current = time_display.querySelector('div.ytwPlayerTimeDisplayTimeChunks:not(.ytwPlayerTimeDisplayLiveDot) > div > span');
        } else {
            time_current = player.querySelector('span.ytp-time-current');
        }
        if (!time_current) return;

        clearInterval(detect_interval);

        time_current.setAttribute('contenteditable', 'plaintext-only');
        // IMEを持つ環境向けに、可能な範囲で半角英数入力を促す
        time_current.setAttribute('inputmode', 'numeric');
        time_current.setAttribute('autocomplete', 'off');
        time_current.setAttribute('autocorrect', 'off');
        time_current.setAttribute('autocapitalize', 'off');
        time_current.setAttribute('spellcheck', 'false');

        time_current.addEventListener('focusin', () => {
            time_current.classList.add('_jump_time_edit');

            prev_textContent = time_current.textContent;

            const video = player.querySelector('video.html5-main-video');
            prev_paused = video.paused;
            video.pause();
        });

        time_current.addEventListener('focusout', e => {
            time_current.classList.remove('_jump_time_edit');

            const video = player.querySelector('video.html5-main-video');

            if (time_current_confirm) {
                const time_current_text = normalizeTimecodeText(time_current.textContent);

                const diff_mode = time_current_text.startsWith('-');

                const parts = time_current_text.replace('-', '').split(':').map(v => Math.trunc(v));
                if (parts.length === 1 && !isNaN(parts[0])) {
                    if (diff_mode) {
                        video.currentTime = video.duration - parts[0];
                    } else {
                        video.currentTime = parts[0];
                    }
                } else if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                    if (diff_mode) {
                        video.currentTime = video.duration - (parts[0] * 60 + parts[1]);
                    } else {
                        video.currentTime = parts[0] * 60 + parts[1];
                    }
                } else if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
                    if (diff_mode) {
                        video.currentTime = video.duration - (parts[0] * 3600 + parts[1] * 60 + parts[2]);
                    } else {
                        video.currentTime = parts[0] * 3600 + parts[1] * 60 + parts[2];
                    }
                } else {
                    time_current.innerText = prev_textContent;
                }
            } else {
                time_current.innerText = prev_textContent;
            }

            if (!prev_paused) {
                video.play();
            }
        });

        time_current.addEventListener('keydown', e => {
            e.stopImmediatePropagation();

            switch (e.key) {
                case 'Enter':
                    e.preventDefault();
                    time_current_confirm = true;
                    time_current.blur();
                    break;
                case 'Escape':
                    time_current_confirm = false;
                    time_current.blur();
                    break;
                default:
                    time_current_confirm = true;
            }
        });

        time_current.addEventListener('compositionend', () => {
            // IME変換確定直後に全角→半角へ即時変換する(体感的に英数強制に近づける)
            const converted = normalizeFullwidthDigits(time_current.textContent);
            if (converted === time_current.textContent) return;

            const selection = window.getSelection();
            const caretOffset = selection.focusOffset;

            time_current.textContent = converted;

            const textNode = time_current.firstChild;
            if (textNode) {
                const range = document.createRange();
                const pos = Math.min(caretOffset, textNode.length);
                range.setStart(textNode, pos);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });

        time_current.addEventListener('click', e => {
            e.stopPropagation();

            // クリック位置に関わらず、そのまま上書き入力できるよう全選択する
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(time_current);
            selection.removeAllRanges();
            selection.addRange(range);
        });
    }, 500);
}
