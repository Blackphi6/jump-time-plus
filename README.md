# Seek to Timecode Control for YouTube Plus

[yudai-tiny-developer/jump-time](https://github.com/yudai-tiny-developer/jump-time) にインスパイアされた、非公式の派生版 Chrome 拡張機能です。
YouTube動画の現在時刻をクリックしてタイムコードを入力すると、任意の時刻にシークできます。

本家との違いが分かるよう、アイコンには青い `+` バッジを重ねています。

## 追加機能（本家からの変更点）

- **コロン省略入力に対応**: `828` と入力するだけで `8:28`、`1202` で `12:02` として解釈されます（右から2桁ずつ区切って 分:秒 / 時:分:秒 とみなします）。コロンありの入力 (`8:28` など) も引き続き使えます。
- **全角入力の自動正規化**: IMEが有効なまま全角数字（`８２８`）や全角コロン（`１２：０２`）を入力しても、確定時に半角へ変換してから解釈します。
- **入力欄に半角英数ヒントを付与**: `inputmode="numeric"` などの属性を設定し、対応するIME・ソフトウェアキーボードが半角数字入力を優先しやすくしています（ブラウザの仕様上、JavaScriptからIMEのオン/オフを強制することはできないため、あくまでヒントによるベストエフォート対応です）。

## Features（本家からの機能）

- Click the current time display in the YouTube player to edit it directly.
- Jump to an absolute timestamp with inputs like `90`, `1:30`, `1:02:45`, or colon-less `828` / `10203`.
- Jump relative to the end of the video with inputs like `-30` or `-1:15`.
- Pauses playback while editing and resumes if the video was already playing.

## How It Works

1. Click the current playback time.
2. Enter a timecode.
3. Press `Enter` to seek, or `Escape` to cancel.

Supported formats:

- `SS`
- `MM:SS`
- `HH:MM:SS`
- Colon-less equivalents: `MSS` / `MMSS` (3-4桁 → 分:秒), `HMMSS` / `HHMMSS` (5-6桁 → 時:分:秒)
- Negative variants of the above (seek from the end of the video), e.g. `-30`, `-1:15`, `-130`

## Install

Chrome Web Store未掲載のため、開発者モードで読み込んでください。

1. このリポジトリをダウンロード/クローンする
2. `chrome://extensions` を開き、右上の「デベロッパーモード」をON
3. 「パッケージ化されていない拡張機能を読み込む」からこのフォルダを選択

## Credit / License

元プロジェクト [jump-time](https://github.com/yudai-tiny-developer/jump-time) ( MIT / Apache-2.0 デュアルライセンス ) をベースに実装しています。
本リポジトリも同様にデュアルライセンスとします。

- [Apache License 2.0](LICENSE-APACHE)
- [MIT License](LICENSE-MIT)
