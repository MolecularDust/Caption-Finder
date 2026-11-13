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
    <td align="center"><b>简体中文</b></td>
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
    <td align="center"><a href="README.ja.md">日本語</a></td>
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

> 本译文由 AI 撰写，未经母语人士审校。应用也提供此语言版本，按钮和菜单的名称按应用中的显示写出 (可在 Account & Settings → Language 中切换语言)。如有疑问，请以[英文 README](../../README.md)为准。

在 YouTube 视频中找到某句话被说出的那一刻，选出你喜欢的片段，并下载裁剪好的剪辑。

输入一句话，让应用指向一个频道、多个频道或一份视频列表，它会扫描这些视频的字幕。匹配结果会填满左侧的列表。选中一个，视频就会在右侧加载，入点和出点已经设置在那一行前后。调整它们、预览，然后只下载这一部分。

<p align="center">
  <img src="../screenshot.webp" alt="Caption Finder 列出与短语“download”匹配的视频，并显示选中的视频及其匹配的字幕片段" width="420">
</p>

> 只下载你拥有或获准下载的内容。

## 安装（Windows）

从[发布页面](https://github.com/MolecularDust/Caption-Finder/releases)获取安装程序：`Caption-Finder-Setup_<version>_x64.exe`。需要 x64 电脑上的 Windows 11。应用使用的 WebView2 运行时已包含在 Windows 11 中。

1. 如果 Caption Finder 正在运行，请先关闭它。
2. 双击安装程序。由于应用未经代码签名，Windows 可能会警告它来自未知发布者。点击**更多信息**（More info），然后点击**仍要运行**（Run anyway）。
3. 选择一个选项：
   - **Install normally：** 为你的用户账户安装，无需管理员权限。会添加开始菜单快捷方式，以及已安装应用列表（Apps & features）中的一项。
   - **Portable：** 把应用复制到你选择的文件夹，例如 U 盘。不会向开始菜单或注册表添加任何内容，设置保存在应用旁边的 `Data` 文件夹中。
4. 点击 **Install**，然后点击 **Finish**。

要卸载普通安装，请使用已安装应用列表（Apps & features）。你的设置和登录数据会保留在你的用户配置文件中。

你也可以从同一页面下载 `Caption-Finder-Windows-Portable.zip`。请先把整个 ZIP 解压到一个文件夹，再运行 `Caption Finder.exe`。不要直接在 ZIP 内运行。

## 安装（macOS）

从[最新发布](https://github.com/MolecularDust/Caption-Finder/releases)获取 `Caption-Finder-Installer.dmg` 并打开它。窗口会显示各个步骤：

1. 双击 **Install Caption Finder**。
2. macOS 会拦截它（“无法打开”）。点击**完成**（Done）。
3. 双击蓝色的 **Open System Settings** 图块，在**系统设置**（System Settings）的**隐私与安全性**（Privacy & Security）中滚动到底部，然后点击**仍要打开**（Open Anyway）。
4. 用你的密码确认，然后点击**继续**（Continue）和**安装**（Install）。

该应用采用临时（ad hoc）签名，未经公证（notarization），因此 macOS 会拦截安装程序一次。由安装程序放置的应用不会被标记为已下载，所以 Caption Finder 本身打开时不会被拦截。需要 Apple 芯片上的 macOS 11 或更高版本。

## 设置 YouTube 访问

1. 安装 Caption Finder 并打开 **账号与设置**。
2. 在 **视频播放器账号** 下，点击 **1. Sign in to Google**，然后点击 **2. Connect YouTube**，如有提示请选择你的频道。完成后关闭账户窗口。
3. 在 **下载认证** 下，选择 **应用的 YouTube 会话**。

现在可以使用 Caption Finder 了。

如果想改用你已登录的浏览器，请在 **下载认证** 下选择它。在 Windows 上，搜索前请先关闭该浏览器：Chromium 系浏览器在运行时会锁定其 Cookie 文件，因此在那里应用自己的会话才是可靠的选择。在 macOS 上无需关闭浏览器。只使用你自己的账户。不要导入或分享别人的 Cookie。

你也可以保持 **匿名**，但 YouTube 对匿名访问的反机器人检查更严格，部分视频会失败。

## 使用方法

**搜索范围** 用来选择模式。

- **Channels：** 输入名称，会出现匹配的频道列表（按 Enter 立即显示）。点击一个即可添加。频道链接或 `@handle` 会被直接添加，粘贴的视频链接则会建议它所属的频道。多个频道会依次搜索，或交替混合（轮流从每个频道取一个视频）；参见 Account & Settings。
- **Videos：** 粘贴视频链接（watch、`youtu.be` 或 Shorts），一个或多个均可。列表中的视频按顺序搜索。

然后输入 **搜索短语** 并按 **Search**。结果在找到时就会出现，最新的在前，最多 25 个视频。点击一个即可打开；每个结果都会显示匹配的那一行以及该视频的匹配次数。

右侧：播放器、匹配的那一行、时间轴、带有间隔和时长的 **Set In / Set Out**、**Precise Cut**、**Preview selection** 以及文件名。选择一个下载文件夹，把所选片段添加到下载队列。队列支持暂停、继续、取消、重试，以及 **显示文件**，它会在 Windows 上用文件资源管理器、在 macOS 上用 Finder 显示已完成的文件。

**预设** 保存一份频道或视频列表，方便你之后调出。列表为空时 **保存预设** 不可用。**载入预设** 会打开预设文件夹以便选择文件。每种模式都有自己的预设。右键点击预设名称：Load、Add to current list、Show in Finder、Rename 和 Remove from list。右键点击空白处：Clear files、Clear presets 和 Show presets folder。从行中移除预设绝不会删除它的文件。在 Windows 上，**在访达中显示** 保留该标签，但会打开文件资源管理器并选中预设文件，**显示预设文件夹** 会在文件资源管理器中打开该文件夹。

### 匹配

- 大小写、标点和撇号样式都会被忽略。一句话可以跨越相邻的字幕片段。
- 没有空格的语言（中文、日语、泰语等）按字符逐个匹配。阿拉伯语和希伯来语的元音符号会被忽略。
- 字幕语言跟随短语的文字（西里尔字母的短语会寻找俄语、乌克兰语等轨道），对于拉丁字母则跟随每个视频所说的语言。设置中的 **字幕语言** 会覆盖这一点，这也会作用于某些频道发布的配音音轨。
- **在字幕中搜索** 把搜索限制在上传的字幕、YouTube 的自动字幕，或两者之一（优先上传的字幕）。绝不使用翻译。
- 边界是字幕片段的边界，而不是逐词对齐。

### Account & Settings

- **Video player account：** **1. Sign in to Google**、**2. Connect YouTube**（如有提示请选择频道）和 **Check playback** 会为播放器打开一个单独的账户窗口。登录信息保存在应用自己的浏览器存储中。在 YouTube 上，账户头像可确认你已登录，账户菜单可切换账户或退出登录。完成后关闭窗口，再次搜索以重新加载播放器。
- **Download authentication：** 字幕查询和下载从哪里获取 YouTube 登录。可选择 **匿名**（默认）、**App's YouTube session**、应用在这台电脑上找到的浏览器，或 **导入 Netscape Cookie…**。Cookie 绝不会被复制到应用的设置中。
  - **Windows：** 可检测到 Chrome、Edge、Firefox、Brave、Chromium、Vivaldi 和 Opera。
  - **macOS：** 可检测到 Chrome、Opera、Vivaldi、Firefox、Safari 等。
- **在 Windows 上：**
  - 在用某个浏览器的 Cookie 搜索或下载之前，请完全关闭该浏览器，包括它的后台进程。Chromium 系浏览器（Chrome、Edge、Opera、Brave、Vivaldi、Chromium）在运行时会锁定其 Cookie 文件。如果应用提示无法复制浏览器的 Cookie 数据库，原因就在这里。
  - Windows 上 Chromium 的 Cookie 加密仍可能阻止提取，而应用绝不会绕过它。请改用 **App's YouTube session** 或 **导入 Netscape Cookie…**。
  - 应用会把系统的手动 HTTP 代理（不含用户名和密码）传给 yt-dlp，并遵循 `HTTP_PROXY` 和 `HTTPS_PROXY`。PAC 脚本，或包含本地地址以外条目的例外列表，不会被转发。
  - 下载文件夹和导入的 Cookie 文件以完整路径保存。如果便携副本移到了另一个盘符，请重新选择它们。
  - 暂停下载会挂起其进程，因此长时间暂停可能导致 YouTube 断开连接。暂停和继续在应用重启后不会保留。
  - Windows 上没有“完全磁盘访问权限”（Full Disk Access），所以下面的 macOS 辅助窗口永远不会出现。
- **在 macOS 上：** Chrome 和 Firefox 的 Cookie 需要**完全磁盘访问权限**（Full Disk Access）；应用会打开一个小的辅助窗口，其中的图标可拖到系统设置（System Settings）。
- Windows 无法保存的**文件名**（`CON` 或 `NUL` 之类的保留名称，以及 `? * | < >` 之类的字符）在所有平台上都会被拒绝，这样剪辑就可以在两者之间移动。
- **每次搜索扫描的视频数**（每个频道，默认 50）、**来自多个频道的结果**、**字幕语言**、**在字幕中搜索**。
- **Don't play the first found video automatically**，以及 **视频加载时**（缩略图或加载动画）。

## 数据保存在哪里

| 内容 | Windows（普通安装） | macOS |
| --- | --- | --- |
| 设置（下载文件夹、身份验证） | `%APPDATA%\com.mike.captionfinder\settings.json` | `~/Library/Application Support/com.mike.captionfinder/settings.json` |
| 预设 | `%APPDATA%\Caption Finder\Presets\Channels` 和 `...\Videos` | `~/Library/Application Support/Caption Finder/Presets/Channels` 和 `.../Videos` |
| 应用自己的 YouTube 登录 | `%LOCALAPPDATA%\com.mike.captionfinder\EBWebView` | `~/Library/WebKit/com.mike.captionfinder` |

在 Windows 上，缓存和媒体日志（`logs\media.jsonl`，只包含安全的诊断代码）同样位于 `%LOCALAPPDATA%\com.mike.captionfinder` 下。便携副本（便携 ZIP，或安装程序的 **Portable** 选项）把设置、登录和缓存保存在 `Caption Finder.exe` 旁边的 `Data` 文件夹中，日志放在 `Data\Diagnostics`。它的预设仍然保存到 `%APPDATA%\Caption Finder\Presets`。只在应用关闭时移动便携文件夹。

预设有意放在应用自己的文件夹之外：重置或重新安装都不会动它们。应用绝不会在不询问的情况下删除或覆盖预设文件；替换一个预设时，旧版本会以 `<name>.json.bak` 保留在旁边。

## 开发与 Windows 构建

开发说明（前提条件、Windows 和 macOS 构建、代码结构）以及 Windows 构建的状态只在[英文 README](../../README.md#development)中提供。

## 致谢

Caption Finder 最初是 [YouGlish Downloader](https://github.com/MolecularDust/Youglish-Downloader) 的分支，而后者本身是 TubeCutter 的分支。下载队列和大部分打包工作都来自那些工作。第三方工具（yt-dlp、FFmpeg、Deno 以及应用中的库）保留各自的许可证；请参见 `LICENSES/` 和 `docs/DEPENDENCIES.md`。所用的 FFmpeg 构建采用 GPL，因此再分发本应用意味着要遵守这些条款。

采用 MIT 许可证；请参见 `LICENSE`。你对 YouTube 内容所做的一切，适用 YouTube 的[服务条款](https://www.youtube.com/t/terms)和 [Google 隐私权政策](https://policies.google.com/privacy)。
