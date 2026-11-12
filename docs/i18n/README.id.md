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
    <td align="center"><b>Bahasa Indonesia</b></td>
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

> Terjemahan ini ditulis oleh AI dan belum ditinjau oleh penutur asli. Aplikasinya sendiri berbahasa Inggris, jadi nama tombol dan menu tetap dalam bahasa Inggris. Jika ada keraguan, rujukannya adalah [README bahasa Inggris](../../README.md).

Temukan saat sebuah kalimat diucapkan dalam video YouTube, pilih bagian yang Anda suka, dan unduh klip yang sudah dipotong.

Ketik sebuah kalimat, arahkan aplikasi ke satu kanal, beberapa kanal, atau daftar video, dan aplikasi akan memindai subtitelnya. Hasil yang cocok mengisi daftar di sebelah kiri. Pilih satu dan videonya dimuat di sebelah kanan dengan titik masuk dan keluar yang sudah diatur di sekitar baris tersebut. Sesuaikan, pratinjau, dan unduh hanya bagian itu.

<p align="center">
  <img src="../screenshot.webp" alt="Caption Finder menampilkan video yang cocok dengan frasa “download”, dengan video terpilih dan segmen subtitel yang cocok" width="420">
</p>

> Unduh hanya konten milik Anda atau yang Anda punya izin untuk mengunduhnya.

## Instalasi (Windows)

Ambil penyetel dari [halaman rilis](https://github.com/MolecularDust/Caption-Finder/releases): `Caption-Finder-Setup_<version>_x64.exe`. Memerlukan Windows 11 pada PC x64. Runtime WebView2 yang digunakan aplikasi sudah termasuk di Windows 11.

1. Tutup Caption Finder jika sedang berjalan.
2. Klik dua kali penyetel. Windows mungkin memperingatkan bahwa aplikasi ini berasal dari penerbit tidak dikenal, karena tidak ditandatangani kode. Klik **Informasi lebih lanjut** (More info), lalu **Tetap jalankan** (Run anyway).
3. Pilih salah satu opsi:
   - **Install normally:** memasang untuk akun pengguna Anda tanpa hak administrator. Menambahkan pintasan menu Start dan entri di daftar aplikasi terpasang (Apps & features).
   - **Portable:** menyalin aplikasi ke folder pilihan Anda, misalnya flash disk USB. Tidak ada yang ditambahkan ke menu Start atau registry, dan pengaturan tetap berada di folder `Data` di samping aplikasi.
4. Klik **Install**, lalu **Finish**.

Untuk menghapus instalasi normal, gunakan daftar aplikasi terpasang (Apps & features). Pengaturan dan data masuk Anda tetap berada di profil pengguna Anda.

Anda juga bisa mengunduh `Caption-Finder-Windows-Portable.zip` dari halaman yang sama. Ekstrak seluruh ZIP ke sebuah folder terlebih dahulu, lalu jalankan `Caption Finder.exe`. Jangan menjalankannya dari dalam ZIP.

## Instalasi (macOS)

Ambil `Caption-Finder-Installer.dmg` dari [rilis terbaru](https://github.com/MolecularDust/Caption-Finder/releases) dan buka. Jendelanya menampilkan langkah-langkahnya:

1. Klik dua kali **Install Caption Finder**.
2. macOS menghentikannya (“tidak dapat dibuka”). Klik **Selesai** (Done).
3. Klik dua kali ubin biru **Open System Settings**, gulir ke bagian bawah **Privasi & Keamanan** (Privacy & Security) di **Pengaturan Sistem** (System Settings), lalu klik **Tetap Buka** (Open Anyway).
4. Konfirmasikan dengan kata sandi Anda, lalu klik **Lanjutkan** (Continue) dan **Pasang** (Install).

Aplikasi ini ditandatangani ad hoc dan tidak dinotarisasi, jadi macOS memblokir penginstal satu kali. Aplikasi yang ditempatkan oleh Installer tidak ditandai sebagai hasil unduhan, sehingga Caption Finder sendiri terbuka tanpa pemblokiran. Memerlukan macOS 11 atau lebih baru pada Apple silicon.

## Menyiapkan akses YouTube

1. Pasang Caption Finder dan buka **Account & Settings**.
2. Di bawah **Video player account**, klik **1. Sign in to Google**, lalu **2. Connect YouTube**, dan pilih kanal Anda jika diminta. Tutup jendela akun setelah selesai.
3. Di bawah **Download authentication**, pilih **App’s YouTube session**.

Anda siap menggunakan Caption Finder.

Untuk memakai browser yang sudah Anda masuki akunnya, pilih browser itu di bawah **Download authentication**. Di Windows, tutup browser tersebut sebelum mencari: browser Chromium mengunci berkas cookie-nya selama berjalan, jadi sesi milik aplikasi adalah pilihan yang andal di sana. Di macOS Anda tidak perlu menutup browser. Gunakan hanya akun Anda sendiri. Jangan impor atau bagikan cookie milik orang lain.

Anda juga bisa tetap memakai **Anonymous**, tetapi pemeriksaan anti-bot YouTube lebih ketat untuk akses anonim, dan sebagian video akan gagal.

## Cara memakainya

**Search across** memilih mode.

- **Channels:** ketik nama dan daftar kanal yang cocok akan muncul (Enter menampilkannya seketika). Klik satu untuk menambahkannya. Tautan kanal atau `@handle` langsung ditambahkan, dan tautan video yang ditempel akan menyarankan kanal pemiliknya. Beberapa kanal dicari satu per satu, atau dicampur (satu video dari tiap kanal secara bergiliran); lihat Account & Settings.
- **Videos:** tempel tautan video (watch, `youtu.be`, atau Shorts), satu atau banyak. Video dalam daftar dicari secara berurutan.

Lalu ketik **Search phrase** dan tekan **Search**. Hasil muncul saat ditemukan, yang terbaru lebih dulu, hingga 25 video. Klik satu untuk membukanya; masing-masing menampilkan baris yang cocok dan jumlah kecocokan pada video itu.

Di sebelah kanan: pemutar, baris yang cocok, lini masa, **Set In / Set Out** dengan padding dan durasi, **Precise Cut**, **Preview selection**, dan nama berkas. Pilih folder unduhan dan tambahkan pilihan ke antrean unduhan. Antrean mendukung jeda, lanjut, batal, coba lagi, dan **Reveal file**, yang menampilkan berkas selesai di File Explorer pada Windows atau di Finder pada macOS.

**Presets** menyimpan daftar kanal atau video agar bisa Anda panggil kembali. **Save preset** nonaktif sampai daftar berisi sesuatu. **Load preset** membuka folder preset untuk memilih berkas. Setiap mode punya preset sendiri. Klik kanan nama preset: Load, Add to current list, Show in Finder, Rename, dan Remove from list. Klik kanan ruang kosong: Clear files, Clear presets, dan Show presets folder. Menghapus preset dari baris tidak pernah menghapus berkasnya. Di Windows, **Show in Finder** mempertahankan label itu tetapi membuka File Explorer dengan berkas preset terpilih, dan **Show presets folder** membuka folder di File Explorer.

### Pencocokan

- Huruf besar/kecil, tanda baca, dan gaya apostrof diabaikan. Sebuah kalimat bisa mencakup segmen subtitel yang berdekatan.
- Bahasa tanpa spasi (Tionghoa, Jepang, Thai, dan sejenisnya) dicocokkan karakter demi karakter. Tanda vokal Arab dan Ibrani diabaikan.
- Bahasa subtitel mengikuti aksara frasa (frasa Sirilik mencari trek Rusia, Ukraina, dan sejenisnya), atau bahasa yang digunakan di tiap video untuk huruf Latin. **Caption language** di pengaturan menimpanya, yang juga menjangkau trek audio hasil dubbing yang diterbitkan beberapa kanal.
- **Search in captions** membatasi pencarian pada subtitel yang diunggah, subtitel otomatis YouTube, atau keduanya (yang diunggah diutamakan). Terjemahan tidak pernah digunakan.
- Batasnya adalah batas segmen subtitel, bukan penyelarasan per kata.

### Account & Settings

- **Video player account:** **1. Sign in to Google**, **2. Connect YouTube** (pilih kanal Anda jika diminta), dan **Check playback** membuka jendela akun terpisah untuk pemutar. Login disimpan di penyimpanan browser milik aplikasi. Di YouTube, avatar akun menegaskan bahwa Anda sudah masuk, dan menu akunnya berganti akun atau keluar. Tutup jendela setelah selesai dan cari lagi untuk memuat ulang pemutar.
- **Download authentication:** dari mana pencarian subtitel dan unduhan mengambil login YouTube. Pilih **Anonymous** (bawaan), **App's YouTube session**, browser yang ditemukan aplikasi di komputer ini, atau **Import Netscape cookies…**. Cookie tidak pernah disalin ke pengaturan aplikasi.
  - **Windows:** Chrome, Edge, Firefox, Brave, Chromium, Vivaldi, dan Opera terdeteksi.
  - **macOS:** Chrome, Opera, Vivaldi, Firefox, Safari, dan lainnya terdeteksi.
- **Di Windows:**
  - Tutup browser sepenuhnya, termasuk proses latar belakangnya, sebelum mencari atau mengunduh dengan cookie-nya. Browser Chromium (Chrome, Edge, Opera, Brave, Vivaldi, Chromium) mengunci berkas cookie-nya selama berjalan. Jika aplikasi menyatakan tidak dapat menyalin basis data cookie browser, inilah penyebabnya.
  - Enkripsi cookie Chromium di Windows masih bisa menghalangi ekstraksi, dan aplikasi tidak pernah mengakalinya. Gunakan **App's YouTube session** atau **Import Netscape cookies…** sebagai gantinya.
  - Aplikasi meneruskan proxy HTTP manual sistem (tanpa nama pengguna dan kata sandi) ke yt-dlp, dan mematuhi `HTTP_PROXY` serta `HTTPS_PROXY`. Skrip PAC atau daftar pengecualian dengan entri selain alamat lokal tidak diteruskan.
  - Folder unduhan dan berkas cookie yang diimpor disimpan sebagai path lengkap. Jika salinan portabel dipindahkan ke huruf drive lain, pilih keduanya lagi.
  - Menjeda unduhan menangguhkan prosesnya, jadi jeda yang lama dapat membuat YouTube memutus koneksi. Jeda dan lanjut tidak bertahan setelah aplikasi dimulai ulang.
  - Tidak ada Akses Disk Penuh (Full Disk Access) di Windows, jadi jendela bantuan macOS di bawah tidak pernah muncul.
- **Di macOS:** cookie Chrome dan Firefox memerlukan **Akses Disk Penuh** (Full Disk Access); aplikasi membuka jendela bantuan kecil dengan ikon yang diseret ke Pengaturan Sistem (System Settings).
- **Nama berkas** yang tidak dapat disimpan Windows (nama yang dicadangkan seperti `CON` atau `NUL`, dan karakter seperti `? * | < >`) ditolak di semua platform, sehingga klip bisa berpindah antar keduanya.
- **Videos to scan per search** (per kanal, bawaan 50), **Results from several channels**, **Caption language**, **Search in captions**.
- **Don't play the first found video automatically** dan **While a video loads** (gambar mini atau indikator pemuatan).

## Tempat penyimpanan data

| Apa | Windows (instalasi normal) | macOS |
| --- | --- | --- |
| Pengaturan (folder unduhan, autentikasi) | `%APPDATA%\com.mike.captionfinder\settings.json` | `~/Library/Application Support/com.mike.captionfinder/settings.json` |
| Preset | `%APPDATA%\Caption Finder\Presets\Channels` dan `...\Videos` | `~/Library/Application Support/Caption Finder/Presets/Channels` dan `.../Videos` |
| Login YouTube milik aplikasi | `%LOCALAPPDATA%\com.mike.captionfinder\EBWebView` | `~/Library/WebKit/com.mike.captionfinder` |

Di Windows, cache dan log media (`logs\media.jsonl`, yang hanya berisi kode diagnostik yang aman) juga berada di `%LOCALAPPDATA%\com.mike.captionfinder`. Salinan portabel (ZIP portabel, atau opsi **Portable** pada penyetel) menyimpan pengaturan, login, dan cache-nya di folder `Data` di samping `Caption Finder.exe`, dengan log di `Data\Diagnostics`. Preset-nya tetap masuk ke `%APPDATA%\Caption Finder\Presets`. Pindahkan folder portabel hanya saat aplikasi tertutup.

Preset sengaja disimpan di luar folder milik aplikasi: pengaturan ulang atau instal ulang tidak menyentuhnya. Aplikasi tidak pernah menghapus atau menimpa berkas preset tanpa bertanya; mengganti satu preset menyimpan versi lamanya di sampingnya sebagai `<name>.json.bak`.

## Pengembangan dan build Windows

Catatan pengembangan (prasyarat, build untuk Windows dan macOS, tata letak kode) dan status build Windows hanya ada di [README bahasa Inggris](../../README.md#development).

## Kredit

Caption Finder bermula sebagai fork dari [YouGlish Downloader](https://github.com/MolecularDust/Youglish-Downloader), yang sendiri merupakan fork dari TubeCutter. Antrean unduhan dan sebagian besar pengemasan berasal dari karya itu. Alat pihak ketiga (yt-dlp, FFmpeg, Deno, dan pustaka dalam aplikasi) mempertahankan lisensinya masing-masing; lihat `LICENSES/` dan `docs/DEPENDENCIES.md`. Build FFmpeg yang digunakan berlisensi GPL, jadi mendistribusikan ulang aplikasi berarti mengikuti ketentuan tersebut.

Dilisensikan di bawah Lisensi MIT; lihat `LICENSE`. [Ketentuan Layanan](https://www.youtube.com/t/terms) YouTube dan [Kebijakan Privasi Google](https://policies.google.com/privacy) berlaku untuk apa yang Anda lakukan dengan konten YouTube.
