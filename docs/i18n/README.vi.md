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
    <td align="center"><b>Tiếng Việt</b></td>
  </tr>
</table>

</details>

</div>
<!-- languages:end -->

# Caption Finder

> Bản dịch này do AI viết và chưa được người bản ngữ rà soát. Ứng dụng cũng có bản bằng ngôn ngữ này, và tên các nút và menu ở đây được ghi đúng như ứng dụng hiển thị (có thể đổi ngôn ngữ tại Account & Settings → Language). Khi có điều gì chưa rõ, hãy tham khảo [README tiếng Anh](../../README.md).

Tìm đúng khoảnh khắc một câu được nói trong video YouTube, chọn đoạn bạn thích và tải xuống clip đã cắt.

Nhập một câu, trỏ ứng dụng tới một kênh, nhiều kênh hoặc một danh sách video, và nó sẽ quét phụ đề của chúng. Các kết quả khớp lấp đầy một danh sách ở bên trái. Chọn một kết quả và video sẽ tải ở bên phải, với điểm vào và điểm ra đã được đặt sẵn quanh dòng đó. Chỉnh chúng, xem trước và chỉ tải phần đó.

<p align="center">
  <img src="../screenshot.webp" alt="Caption Finder liệt kê các video khớp với cụm “download”, với video được chọn và các đoạn phụ đề khớp" width="420">
</p>

> Chỉ tải nội dung của chính bạn hoặc nội dung bạn được phép tải.

## Cài đặt (Windows)

Lấy trình cài đặt từ [trang phát hành](https://github.com/MolecularDust/Caption-Finder/releases): `Caption-Finder-Setup_<version>_x64.exe`. Cần Windows 11 trên máy tính x64. Thành phần WebView2 mà ứng dụng dùng đã có sẵn trong Windows 11.

1. Đóng Caption Finder nếu nó đang chạy.
2. Nhấp đúp vào trình cài đặt. Windows có thể cảnh báo ứng dụng đến từ nhà phát hành không xác định, vì nó chưa được ký mã. Nhấp **Thông tin khác** (More info), rồi **Vẫn chạy** (Run anyway).
3. Chọn một tùy chọn:
   - **Install normally:** cài cho tài khoản người dùng của bạn mà không cần quyền quản trị. Thêm lối tắt trong menu Start và một mục trong danh sách ứng dụng đã cài (Apps & features).
   - **Portable:** sao chép ứng dụng vào thư mục bạn chọn, chẳng hạn một ổ USB. Không có gì được thêm vào menu Start hay registry, và cài đặt nằm trong thư mục `Data` cạnh ứng dụng.
4. Nhấp **Install**, rồi **Finish**.

Để gỡ một bản cài đặt thông thường, hãy dùng danh sách ứng dụng đã cài (Apps & features). Cài đặt và dữ liệu đăng nhập của bạn vẫn nằm trong hồ sơ người dùng.

Bạn cũng có thể tải `Caption-Finder-Windows-Portable.zip` từ cùng trang. Hãy giải nén toàn bộ tệp ZIP vào một thư mục trước, rồi chạy `Caption Finder.exe`. Đừng chạy từ bên trong tệp ZIP.

## Cài đặt (macOS)

Lấy `Caption-Finder-Installer.dmg` từ [bản phát hành mới nhất](https://github.com/MolecularDust/Caption-Finder/releases) và mở nó. Cửa sổ hiển thị các bước:

1. Nhấp đúp vào **Install Caption Finder**.
2. macOS chặn nó (“không thể mở”). Nhấp **Xong** (Done).
3. Nhấp đúp vào ô màu xanh **Open System Settings**, cuộn xuống cuối mục **Quyền riêng tư & Bảo mật** (Privacy & Security) trong **Cài đặt Hệ thống** (System Settings), rồi nhấp **Vẫn mở** (Open Anyway).
4. Xác nhận bằng mật khẩu của bạn, rồi nhấp **Tiếp tục** (Continue) và **Cài đặt** (Install).

Ứng dụng được ký ad hoc và chưa được công chứng (notarize), nên macOS chặn trình cài đặt một lần. Ứng dụng do Installer đặt vào không bị đánh dấu là đã tải xuống, vì vậy bản thân Caption Finder mở ra mà không bị chặn. Cần macOS 11 trở lên trên Apple silicon.

## Thiết lập quyền truy cập YouTube

1. Cài Caption Finder và mở **Tài khoản & Cài đặt**.
2. Trong **Tài khoản trình phát video**, nhấp **1. Sign in to Google**, rồi **2. Connect YouTube**, và chọn kênh của bạn nếu được hỏi. Đóng cửa sổ tài khoản khi bạn xong.
3. Trong **Xác thực khi tải xuống**, chọn **Phiên YouTube của ứng dụng**.

Bạn đã sẵn sàng dùng Caption Finder.

Để dùng một trình duyệt bạn đã đăng nhập thay thế, hãy chọn nó trong **Xác thực khi tải xuống**. Trên Windows, hãy đóng trình duyệt đó trước khi tìm kiếm: các trình duyệt Chromium khóa tệp cookie của chúng khi đang chạy, nên phiên riêng của ứng dụng là lựa chọn đáng tin cậy ở đó. Trên macOS bạn không cần đóng trình duyệt. Chỉ dùng tài khoản của chính bạn. Đừng nhập hay chia sẻ cookie của người khác.

Bạn cũng có thể giữ **Ẩn danh**, nhưng các kiểm tra chống bot của YouTube nghiêm ngặt hơn với truy cập ẩn danh, và một số video sẽ lỗi.

## Cách dùng

**Tìm trong** chọn chế độ.

- **Channels:** nhập một tên và danh sách các kênh khớp sẽ xuất hiện (Enter hiện ngay). Nhấp vào một kênh để thêm. Liên kết kênh hoặc `@handle` được thêm trực tiếp, và liên kết video được dán sẽ gợi ý kênh mà video đó thuộc về. Nhiều kênh được tìm lần lượt, hoặc xen kẽ (mỗi kênh một video theo lượt); xem Account & Settings.
- **Videos:** dán liên kết video (watch, `youtu.be` hoặc Shorts), một hoặc nhiều. Các video trong danh sách được tìm theo thứ tự.

Sau đó nhập một **Cụm từ tìm kiếm** và nhấn **Search**. Kết quả xuất hiện khi được tìm thấy, mới nhất trước, tối đa 25 video. Nhấp vào một kết quả để mở; mỗi kết quả hiển thị dòng khớp và số lần khớp của video.

Bên phải: trình phát, dòng khớp, dòng thời gian, **Set In / Set Out** với phần đệm và độ dài, **Precise Cut**, **Preview selection** và tên tệp. Chọn thư mục tải xuống và thêm đoạn đã chọn vào hàng đợi tải. Hàng đợi hỗ trợ tạm dừng, tiếp tục, hủy, thử lại và **Hiện tệp**, hiển thị tệp đã xong trong File Explorer trên Windows hoặc trong Finder trên macOS.

**Cài đặt sẵn** lưu một danh sách kênh hoặc video để bạn gọi lại. **Lưu cài đặt sẵn** bị tắt cho đến khi danh sách có nội dung. **Tải cài đặt sẵn** mở thư mục preset để chọn một tệp. Mỗi chế độ có preset riêng. Nhấp chuột phải vào tên preset: Load, Add to current list, Show in Finder, Rename và Remove from list. Nhấp chuột phải vào khoảng trống: Clear files, Clear presets và Show presets folder. Gỡ preset khỏi hàng không bao giờ xóa tệp của nó. Trên Windows, **Hiện trong Finder** giữ nhãn đó nhưng mở File Explorer với tệp preset được chọn, còn **Hiện thư mục cài đặt sẵn** mở thư mục trong File Explorer.

### Đối sánh

- Chữ hoa/thường, dấu câu và kiểu dấu nháy đơn bị bỏ qua. Một câu có thể trải qua các đoạn phụ đề liền kề.
- Các ngôn ngữ không có khoảng trắng (tiếng Trung, Nhật, Thái và tương tự) được đối sánh từng ký tự. Dấu nguyên âm tiếng Ả Rập và Do Thái bị bỏ qua.
- Ngôn ngữ phụ đề theo bảng chữ cái của cụm từ (cụm chữ Kirin tìm các bản tiếng Nga, Ukraina và tương tự), hoặc ngôn ngữ nói trong từng video đối với chữ Latin. **Ngôn ngữ phụ đề** trong cài đặt ghi đè điều này, và cũng áp dụng cho các bản âm thanh lồng tiếng mà một số kênh phát hành.
- **Tìm trong phụ đề** giới hạn tìm kiếm ở phụ đề đã tải lên, phụ đề tự động của YouTube, hoặc cả hai (ưu tiên phụ đề đã tải lên). Bản dịch không bao giờ được dùng.
- Ranh giới là ranh giới đoạn phụ đề, không phải căn chỉnh theo từng từ.

### Account & Settings

- **Video player account:** **1. Sign in to Google**, **2. Connect YouTube** (chọn kênh của bạn nếu được hỏi) và **Check playback** mở một cửa sổ tài khoản riêng cho trình phát. Thông tin đăng nhập được giữ trong bộ nhớ trình duyệt riêng của ứng dụng. Trên YouTube, ảnh đại diện tài khoản xác nhận bạn đã đăng nhập, và menu tài khoản của nó dùng để đổi tài khoản hoặc đăng xuất. Đóng cửa sổ khi xong và tìm lại để tải lại trình phát.
- **Download authentication:** nơi các truy vấn phụ đề và lượt tải lấy thông tin đăng nhập YouTube. Chọn **Ẩn danh** (mặc định), **App's YouTube session**, một trình duyệt mà ứng dụng tìm thấy trên máy này, hoặc **Nhập cookie Netscape…**. Cookie không bao giờ được sao chép vào cài đặt của ứng dụng.
  - **Windows:** Chrome, Edge, Firefox, Brave, Chromium, Vivaldi và Opera được phát hiện.
  - **macOS:** Chrome, Opera, Vivaldi, Firefox, Safari và các trình duyệt khác được phát hiện.
- **Trên Windows:**
  - Hãy đóng hẳn trình duyệt, kể cả các tiến trình chạy nền, trước khi tìm kiếm hoặc tải bằng cookie của nó. Các trình duyệt Chromium (Chrome, Edge, Opera, Brave, Vivaldi, Chromium) khóa tệp cookie khi đang chạy. Nếu ứng dụng báo không sao chép được cơ sở dữ liệu cookie của trình duyệt, đó là lý do.
  - Mã hóa cookie của Chromium trên Windows vẫn có thể chặn việc trích xuất, và ứng dụng không bao giờ vượt qua nó. Hãy dùng **App's YouTube session** hoặc **Nhập cookie Netscape…** thay thế.
  - Ứng dụng chuyển proxy HTTP thủ công của hệ thống (không có tên người dùng và mật khẩu) cho yt-dlp, và tuân theo `HTTP_PROXY` và `HTTPS_PROXY`. Tập lệnh PAC hoặc danh sách ngoại lệ có mục khác ngoài địa chỉ cục bộ sẽ không được chuyển tiếp.
  - Thư mục tải xuống và tệp cookie đã nhập được lưu dưới dạng đường dẫn đầy đủ. Nếu bản portable chuyển sang ký tự ổ đĩa khác, hãy chọn lại chúng.
  - Tạm dừng một lượt tải sẽ treo tiến trình của nó, nên tạm dừng lâu có thể khiến YouTube ngắt kết nối. Tạm dừng và tiếp tục không được giữ lại sau khi khởi động lại ứng dụng.
  - Windows không có Toàn quyền truy cập ổ đĩa (Full Disk Access), nên cửa sổ trợ giúp macOS bên dưới không bao giờ xuất hiện.
- **Trên macOS:** cookie của Chrome và Firefox cần **Toàn quyền truy cập ổ đĩa** (Full Disk Access); ứng dụng mở một cửa sổ trợ giúp nhỏ có biểu tượng để kéo vào Cài đặt Hệ thống (System Settings).
- **Tên tệp** mà Windows không thể lưu (tên dành riêng như `CON` hoặc `NUL`, và các ký tự như `? * | < >`) bị từ chối trên mọi nền tảng, để một clip có thể chuyển qua lại giữa hai nền tảng.
- **Số video quét mỗi lần tìm** (mỗi kênh, mặc định 50), **Kết quả từ nhiều kênh**, **Ngôn ngữ phụ đề**, **Tìm trong phụ đề**.
- **Don't play the first found video automatically** và **Trong khi video đang tải** (ảnh thu nhỏ hoặc biểu tượng đang tải).

## Dữ liệu được lưu ở đâu

| Gì | Windows (cài đặt thông thường) | macOS |
| --- | --- | --- |
| Cài đặt (thư mục tải xuống, xác thực) | `%APPDATA%\com.mike.captionfinder\settings.json` | `~/Library/Application Support/com.mike.captionfinder/settings.json` |
| Preset | `%APPDATA%\Caption Finder\Presets\Channels` và `...\Videos` | `~/Library/Application Support/Caption Finder/Presets/Channels` và `.../Videos` |
| Phiên đăng nhập YouTube riêng của ứng dụng | `%LOCALAPPDATA%\com.mike.captionfinder\EBWebView` | `~/Library/WebKit/com.mike.captionfinder` |

Trên Windows, bộ nhớ đệm và nhật ký media (`logs\media.jsonl`, chỉ chứa các mã chẩn đoán an toàn) cũng nằm trong `%LOCALAPPDATA%\com.mike.captionfinder`. Bản portable (ZIP portable, hoặc tùy chọn **Portable** của trình cài đặt) giữ cài đặt, phiên đăng nhập và bộ nhớ đệm trong thư mục `Data` cạnh `Caption Finder.exe`, với nhật ký trong `Data\Diagnostics`. Preset của nó vẫn nằm trong `%APPDATA%\Caption Finder\Presets`. Chỉ di chuyển thư mục portable khi ứng dụng đã đóng.

Preset được cố ý lưu ngoài các thư mục riêng của ứng dụng: đặt lại hay cài lại đều không động đến chúng. Ứng dụng không bao giờ xóa hay ghi đè tệp preset mà không hỏi; thay thế một preset sẽ giữ phiên bản cũ bên cạnh dưới tên `<name>.json.bak`.

## Phát triển và bản dựng Windows

Ghi chú phát triển (yêu cầu, bản dựng cho Windows và macOS, cấu trúc mã) và tình trạng bản dựng Windows chỉ có trong [README tiếng Anh](../../README.md#development).

## Ghi công

Caption Finder khởi đầu là một fork của [YouGlish Downloader](https://github.com/MolecularDust/Youglish-Downloader), bản thân nó là một fork của TubeCutter. Hàng đợi tải và phần lớn việc đóng gói đến từ công việc đó. Các công cụ bên thứ ba (yt-dlp, FFmpeg, Deno và các thư viện trong ứng dụng) giữ giấy phép riêng của chúng; xem `LICENSES/` và `docs/DEPENDENCIES.md`. Các bản dựng FFmpeg được dùng là GPL, nên phân phối lại ứng dụng nghĩa là tuân theo các điều khoản đó.

Cấp phép theo Giấy phép MIT; xem `LICENSE`. [Điều khoản dịch vụ](https://www.youtube.com/t/terms) của YouTube và [Chính sách quyền riêng tư của Google](https://policies.google.com/privacy) áp dụng cho những gì bạn làm với nội dung YouTube.
