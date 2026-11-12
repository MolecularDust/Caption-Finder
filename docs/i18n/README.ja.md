<!-- languages:start -->
<div align="center">

<details>
<summary><b>🌐 Language · Idioma · Langue · Sprache · Язык · 语言 · 言語 · 언어 · भाषा · لغة</b></summary>
<br>

<table>
  <tr>
    <td align="center"><a href="../../README.md">English</a></td>
    <td align="center"><a href="README.ar.md">العربية</a></td>
    <td align="center"><a href="README.bn.md">বাংলা</a></td>
    <td align="center"><a href="README.zh-Hans.md">简体中文</a></td>
    <td align="center"><a href="README.fil.md">Filipino</a></td>
  </tr>
  <tr>
    <td align="center"><a href="README.fr.md">Français</a></td>
    <td align="center"><a href="README.de.md">Deutsch</a></td>
    <td align="center"><a href="README.hi.md">हिन्दी</a></td>
    <td align="center"><a href="README.id.md">Bahasa Indonesia</a></td>
    <td align="center"><a href="README.it.md">Italiano</a></td>
  </tr>
  <tr>
    <td align="center"><b>日本語</b></td>
    <td align="center"><a href="README.ko.md">한국어</a></td>
    <td align="center"><a href="README.fa.md">فارسی</a></td>
    <td align="center"><a href="README.pt-BR.md">Português (Brasil)</a></td>
    <td align="center"><a href="README.ru.md">Русский</a></td>
  </tr>
  <tr>
    <td align="center"><a href="README.es.md">Español</a></td>
    <td align="center"><a href="README.te.md">తెలుగు</a></td>
    <td align="center"><a href="README.th.md">ไทย</a></td>
    <td align="center"><a href="README.tr.md">Türkçe</a></td>
    <td align="center"><a href="README.vi.md">Tiếng Việt</a></td>
  </tr>
</table>

</details>

</div>
<!-- languages:end -->

# Caption Finder

> この翻訳はAIが作成したもので、ネイティブスピーカーによる確認は受けていません。アプリ自体は英語なので、ボタンやメニューの名前は英語のままにしています。不明な点は[英語版README](../../README.md)を基準にしてください。

YouTube動画の中でフレーズが話される瞬間を見つけ、気に入った場面を選んで、切り出したクリップをダウンロードできます。

フレーズを入力し、1つのチャンネル、複数のチャンネル、または動画のリストをアプリに指定すると、字幕を調べます。一致した結果は左側のリストに表示されます。1つ選ぶと、右側に動画が読み込まれ、その行の前後にイン点とアウト点があらかじめ設定されます。調整してプレビューし、その部分だけをダウンロードします。

<p align="center">
  <img src="../screenshot.webp" alt="Caption Finderが「download」に一致する動画を一覧表示し、選択した動画と一致する字幕区間を表示している画面" width="420">
</p>

> 自分が所有している、またはダウンロードする許可を得ているコンテンツだけをダウンロードしてください。

## インストール（Windows）

[リリースページ](https://github.com/MolecularDust/Caption-Finder/releases)からセットアップを入手します：`Caption-Finder-Setup_<version>_x64.exe`。x64のPCでWindows 11が必要です。アプリが使うWebView2ランタイムはWindows 11に含まれています。

1. Caption Finderが起動している場合は閉じます。
2. セットアップをダブルクリックします。コード署名されていないため、Windowsが不明な発行元のアプリだと警告することがあります。**詳細情報**（More info）をクリックし、続けて**実行**（Run anyway）をクリックします。
3. オプションを1つ選びます：
   - **Install normally:** 管理者権限なしで、ご自分のユーザーアカウント用にインストールします。スタートメニューのショートカットと、インストール済みアプリの一覧（Apps & features）への項目を追加します。
   - **Portable:** アプリを選んだフォルダー（たとえばUSBドライブ）にコピーします。スタートメニューやレジストリには何も追加されず、設定はアプリの隣の`Data`フォルダーに保存されます。
4. **Install**をクリックし、続けて**Finish**をクリックします。

通常のインストールを削除するには、インストール済みアプリの一覧（Apps & features）を使います。設定とサインインデータはユーザープロファイルに残ります。

同じページから`Caption-Finder-Windows-Portable.zip`をダウンロードすることもできます。まずZIP全体をフォルダーに展開してから、`Caption Finder.exe`を実行してください。ZIPの中から直接実行しないでください。

## インストール（macOS）

[最新リリース](https://github.com/MolecularDust/Caption-Finder/releases)から`Caption-Finder-Installer.dmg`を入手して開きます。ウィンドウに手順が表示されます：

1. **Install Caption Finder**をダブルクリックします。
2. macOSが止めます（「開けません」）。**完了**（Done）をクリックします。
3. 青い**Open System Settings**のタイルをダブルクリックし、**システム設定**（System Settings）の**プライバシーとセキュリティ**（Privacy & Security）の一番下までスクロールして、**このまま開く**（Open Anyway）をクリックします。
4. パスワードで確認し、**続ける**（Continue）と**インストール**（Install）をクリックします。

このアプリはアドホック署名で、公証（notarization）は受けていないため、macOSはインストーラを一度ブロックします。インストーラが配置したアプリはダウンロードしたものとして印が付かないので、Caption Finder自体はブロックされずに開きます。Apple silicon上のmacOS 11以降が必要です。

## YouTubeアクセスの設定

1. Caption Finderをインストールし、**Account & Settings**を開きます。
2. **Video player account**の下で**1. Sign in to Google**をクリックし、続けて**2. Connect YouTube**をクリックして、求められたらチャンネルを選びます。終わったらアカウントのウィンドウを閉じます。
3. **Download authentication**の下で**App’s YouTube session**を選びます。

これでCaption Finderを使えます。

代わりに、すでにサインインしているブラウザーを使うには、**Download authentication**でそのブラウザーを選びます。Windowsでは、検索する前にそのブラウザーを閉じてください。Chromium系ブラウザーは動作中にCookieファイルをロックするため、アプリ独自のセッションがそこでは確実な選択です。macOSではブラウザーを閉じる必要はありません。ご自分のアカウントだけを使ってください。他人のCookieをインポートしたり共有したりしないでください。

**Anonymous**のままにすることもできますが、YouTubeのボット対策は匿名アクセスに対してより厳しく、失敗する動画もあります。

## 使い方

**Search across**でモードを選びます。

- **Channels:** 名前を入力すると、一致するチャンネルの一覧が表示されます（Enterですぐに表示）。1つをクリックして追加します。チャンネルのリンクや`@handle`はそのまま追加され、貼り付けた動画のリンクはそれが属するチャンネルを提案します。複数のチャンネルは順番に、または交互に（各チャンネルから1本ずつ順に）検索されます。Account & Settingsを参照してください。
- **Videos:** 動画のリンク（watch、`youtu.be`、Shorts）を1つまたは複数貼り付けます。一覧の動画は順番に検索されます。

次に**Search phrase**を入力して**Search**を押します。結果は見つかった順に表示され、新しいものが先で、最大25本です。クリックして開きます。各結果には一致した行と、その動画の一致数が表示されます。

右側には、プレーヤー、一致した行、タイムライン、パディングと長さ付きの**Set In / Set Out**、**Precise Cut**、**Preview selection**、ファイル名があります。ダウンロードフォルダーを選び、選択範囲をダウンロードキューに追加します。キューは一時停止、再開、キャンセル、再試行、そして**Reveal file**に対応しています。**Reveal file**は、完成したファイルをWindowsではエクスプローラーで、macOSではFinderで表示します。

**Presets**は、チャンネルや動画のリストを保存して後で呼び出せるようにします。リストが空の間は**Save preset**は無効です。**Load preset**はプリセットフォルダーを開いてファイルを選びます。モードごとに専用のプリセットがあります。プリセット名を右クリックすると、Load、Add to current list、Show in Finder、Rename、Remove from listが使えます。空白部分を右クリックすると、Clear files、Clear presets、Show presets folderが使えます。行からプリセットを外しても、そのファイルは削除されません。Windowsでは、**Show in Finder**はこの表記のままですが、プリセットファイルを選択した状態でエクスプローラーを開き、**Show presets folder**はフォルダーをエクスプローラーで開きます。

### 照合

- 大文字小文字、句読点、アポストロフィの種類は無視されます。フレーズは隣り合う字幕の区間にまたがってもかまいません。
- スペースのない言語（中国語、日本語、タイ語など）は1文字ずつ照合されます。アラビア語とヘブライ語の母音記号は無視されます。
- 字幕の言語は、フレーズの文字体系に従います（キリル文字のフレーズはロシア語、ウクライナ語などのトラックを探します）。ラテン文字の場合は、各動画で話されている言語に従います。設定の**Caption language**がこれを上書きし、一部のチャンネルが公開している吹き替え音声トラックにも及びます。
- **Search in captions**は、検索をアップロードされた字幕、YouTubeの自動字幕、またはどちらでも（アップロードされたものを優先）に限定します。翻訳は使われません。
- 境界は字幕区間の境界であり、単語単位の位置合わせではありません。

### Account & Settings

- **Video player account:** **1. Sign in to Google**、**2. Connect YouTube**（求められたらチャンネルを選択）、**Check playback**は、プレーヤー用に別のアカウントウィンドウを開きます。ログインはアプリ独自のブラウザーストレージに保存されます。YouTubeでは、アカウントのアバターでサインインしていることが確認でき、そのアカウントメニューでアカウントの切り替えやサインアウトができます。終わったらウィンドウを閉じ、もう一度検索してプレーヤーを再読み込みします。
- **Download authentication:** 字幕の取得とダウンロードがYouTubeのサインインをどこから得るかを指定します。**Anonymous**（既定）、**App's YouTube session**、このコンピューターでアプリが見つけたブラウザー、または**Import Netscape cookies…**から選びます。Cookieがアプリの設定にコピーされることはありません。
  - **Windows:** Chrome、Edge、Firefox、Brave、Chromium、Vivaldi、Operaが検出されます。
  - **macOS:** Chrome、Opera、Vivaldi、Firefox、Safariなどが検出されます。
- **Windowsの場合：**
  - ブラウザーのCookieで検索やダウンロードをする前に、バックグラウンドのプロセスも含めてブラウザーを完全に閉じてください。Chromium系ブラウザー（Chrome、Edge、Opera、Brave、Vivaldi、Chromium）は動作中にCookieファイルをロックします。アプリがブラウザーのCookieデータベースをコピーできなかったと表示する場合は、これが理由です。
  - WindowsでのChromiumのCookie暗号化により、それでも取り出せない場合があり、アプリがそれを回避することはありません。代わりに**App's YouTube session**または**Import Netscape cookies…**を使ってください。
  - アプリは、システムの手動HTTPプロキシ（ユーザー名とパスワードなし）をyt-dlpに渡し、`HTTP_PROXY`と`HTTPS_PROXY`に従います。PACスクリプトや、ローカルアドレス以外の項目を含む除外リストは渡されません。
  - ダウンロードフォルダーとインポートしたCookieファイルはフルパスで保存されます。ポータブル版を別のドライブ文字に移したら、選び直してください。
  - ダウンロードを一時停止するとそのプロセスが中断されるため、長く停止するとYouTubeが接続を切ることがあります。一時停止と再開はアプリの再起動をまたいで保持されません。
  - Windowsにはフルディスクアクセス（Full Disk Access）がないため、下に書いたmacOSの補助ウィンドウは表示されません。
- **macOSの場合：** ChromeとFirefoxのCookieには**フルディスクアクセス**（Full Disk Access）が必要です。アプリは、システム設定（System Settings）にドラッグするアイコンのある小さな補助ウィンドウを開きます。
- **ファイル名**について、Windowsが保存できないもの（`CON`や`NUL`のような予約名、`? * | < >`のような文字）はどのプラットフォームでも拒否されるため、クリップを両方の間で移せます。
- **Videos to scan per search**（チャンネルごと、既定は50）、**Results from several channels**、**Caption language**、**Search in captions**。
- **Don't play the first found video automatically**、および**While a video loads**（サムネイルまたはスピナー）。

## データの保存場所

| 項目 | Windows（通常のインストール） | macOS |
| --- | --- | --- |
| 設定（ダウンロードフォルダー、認証） | `%APPDATA%\com.mike.captionfinder\settings.json` | `~/Library/Application Support/com.mike.captionfinder/settings.json` |
| プリセット | `%APPDATA%\Caption Finder\Presets\Channels`と`...\Videos` | `~/Library/Application Support/Caption Finder/Presets/Channels`と`.../Videos` |
| アプリ独自のYouTubeサインイン | `%LOCALAPPDATA%\com.mike.captionfinder\EBWebView` | `~/Library/WebKit/com.mike.captionfinder` |

Windowsでは、キャッシュとメディアログ（安全な診断コードだけを含む`logs\media.jsonl`）も`%LOCALAPPDATA%\com.mike.captionfinder`の下にあります。ポータブル版（ポータブルZIP、またはセットアップの**Portable**オプション）は、設定、サインイン、キャッシュを`Caption Finder.exe`の隣の`Data`フォルダーに保存し、ログは`Data\Diagnostics`に置きます。そのプリセットは引き続き`%APPDATA%\Caption Finder\Presets`に保存されます。ポータブルのフォルダーは、アプリを閉じているときだけ移動してください。

プリセットは、意図的にアプリ自体のフォルダーの外に置かれています。リセットや再インストールでも影響を受けません。アプリは、確認せずにプリセットファイルを削除したり上書きしたりすることはありません。置き換えた場合は、古いバージョンが`<name>.json.bak`として隣に残ります。

## 開発とWindowsビルド

開発メモ（前提条件、WindowsとmacOSのビルド、コードの構成）とWindowsビルドの状況は、[英語版README](../../README.md#development)にのみ記載されています。

## クレジット

Caption Finderは[YouGlish Downloader](https://github.com/MolecularDust/Youglish-Downloader)のフォークとして始まりました。YouGlish Downloader自体がTubeCutterのフォークです。ダウンロードキューとパッケージングの多くはその成果によるものです。サードパーティのツール（yt-dlp、FFmpeg、Deno、およびアプリ内のライブラリ）はそれぞれのライセンスを保持します。`LICENSES/`と`docs/DEPENDENCIES.md`を参照してください。使用しているFFmpegのビルドはGPLのため、アプリを再配布する場合はその条件に従う必要があります。

MITライセンスで提供されます。`LICENSE`を参照してください。YouTubeコンテンツに対する操作には、YouTubeの[利用規約](https://www.youtube.com/t/terms)と[Googleのプライバシーポリシー](https://policies.google.com/privacy)が適用されます。
