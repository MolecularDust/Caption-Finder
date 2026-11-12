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
    <td align="center"><b>Filipino</b></td>
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

> Isinulat ng AI ang salin na ito at hindi pa ito nasusuri ng mga katutubong tagapagsalita. Nasa Ingles ang mismong app, kaya nananatiling Ingles ang mga pangalan ng button at menu. Kapag may alinlangan, ang [README sa Ingles](../../README.md) ang batayan.

Hanapin ang sandali kapag binibigkas ang isang parirala sa mga video sa YouTube, piliin ang bahaging gusto mo, at i-download ang pinutol na clip.

Mag-type ng parirala, ituro ang app sa isang channel, ilang channel, o listahan ng mga video, at i-scan nito ang mga caption nila. Pupunuin ng mga tugma ang listahan sa kaliwa. Pumili ng isa at mag-load ang video sa kanan, na may In at Out point na nakatakda na sa paligid ng linya. Ayusin ang mga iyon, i-preview, at i-download lamang ang bahaging iyon.

<p align="center">
  <img src="../screenshot.webp" alt="Ipinapakita ng Caption Finder ang mga video na tumutugma sa pariralang “download”, kasama ang napiling video at ang mga tumutugmang bahagi ng caption" width="420">
</p>

> Mag-download lamang ng nilalamang pag-aari mo o may pahintulot kang i-download.

## Pag-install (Windows)

Kunin ang setup mula sa [pahina ng mga release](https://github.com/MolecularDust/Caption-Finder/releases): `Caption-Finder-Setup_<version>_x64.exe`. Kailangan nito ng Windows 11 sa isang x64 na PC. Kasama na sa Windows 11 ang WebView2 runtime na ginagamit ng app.

1. Isara ang Caption Finder kung tumatakbo ito.
2. I-double-click ang setup. Maaaring magbabala ang Windows na galing sa hindi kilalang publisher ang app, dahil hindi ito code-signed. I-click ang **More info**, pagkatapos ang **Run anyway**.
3. Pumili ng isang opsyon:
   - **Install normally:** nag-i-install para sa user account mo nang walang karapatan ng administrator. Nagdaragdag ng shortcut sa Start menu at entry sa listahan ng mga naka-install na app (Apps & features).
   - **Portable:** kinokopya ang app sa folder na pipiliin mo, halimbawa isang USB drive. Walang idinaragdag sa Start menu o registry, at nananatili ang mga setting sa isang folder na `Data` sa tabi ng app.
4. I-click ang **Install**, pagkatapos ang **Finish**.

Para i-uninstall ang normal na pag-install, gamitin ang listahan ng mga naka-install na app (Apps & features). Nananatili sa user profile mo ang mga setting at sign-in data mo.

Maaari mo ring i-download ang `Caption-Finder-Windows-Portable.zip` mula sa parehong pahina. I-extract muna ang buong ZIP sa isang folder, saka patakbuhin ang `Caption Finder.exe`. Huwag itong patakbuhin mula sa loob ng ZIP.

## Pag-install (macOS)

Kunin ang `Caption-Finder-Installer.dmg` mula sa [pinakabagong release](https://github.com/MolecularDust/Caption-Finder/releases) at buksan ito. Ipinapakita ng window ang mga hakbang:

1. I-double-click ang **Install Caption Finder**.
2. Hinihinto ito ng macOS (“hindi mabubuksan”). I-click ang **Done**.
3. I-double-click ang asul na tile na **Open System Settings**, mag-scroll sa pinakailalim ng **Privacy & Security** sa **System Settings**, at i-click ang **Open Anyway**.
4. Kumpirmahin gamit ang password mo, pagkatapos i-click ang **Continue** at **Install**.

Ad hoc ang lagda ng app at hindi ito notarized, kaya hinaharang ng macOS ang installer nang isang beses. Ang app na inilagay ng Installer ay hindi minamarkahang na-download, kaya bumubukas nang walang harang ang mismong Caption Finder. Kailangan ng macOS 11 o mas bago sa Apple silicon.

## Pag-set up ng access sa YouTube

1. I-install ang Caption Finder at buksan ang **Account & Settings**.
2. Sa ilalim ng **Video player account**, i-click ang **1. Sign in to Google**, pagkatapos ang **2. Connect YouTube**, at piliin ang channel mo kung tatanungin. Isara ang window ng account kapag tapos ka na.
3. Sa ilalim ng **Download authentication**, piliin ang **App’s YouTube session**.

Handa ka nang gamitin ang Caption Finder.

Para sa halip ay gumamit ng browser na naka-sign in ka na, piliin ito sa ilalim ng **Download authentication**. Sa Windows, isara ang browser na iyon bago maghanap: nila-lock ng mga Chromium browser ang cookie file nila habang tumatakbo, kaya ang sariling session ng app ang maaasahang pagpipilian doon. Sa macOS, hindi mo kailangang isara ang browser. Gamitin lamang ang sarili mong account. Huwag mag-import o magbahagi ng cookie ng ibang tao.

Maaari mo ring panatilihin ang **Anonymous**, ngunit mas mahigpit ang anti-bot na pagsusuri ng YouTube para sa anonymous na access, at may mga video na mabibigo.

## Paano gamitin

Pinipili ng **Search across** ang mode.

- **Channels:** mag-type ng pangalan at lalabas ang listahan ng mga tumutugmang channel (agad itong ipinapakita ng Enter). Mag-click ng isa para idagdag. Direktang idinaragdag ang link ng channel o `@handle`, at ang idinikit na link ng video ay nagmumungkahi ng channel na pinagmulan nito. Sunud-sunod na hinahanap ang ilang channel, o hinahalo (isang video mula sa bawat isa nang paikot); tingnan ang Account & Settings.
- **Videos:** idikit ang mga link ng video (watch, `youtu.be` o Shorts), isa o marami. Hinahanap nang sunud-sunod ang mga video sa listahan.

Pagkatapos ay mag-type ng **Search phrase** at pindutin ang **Search**. Lumalabas ang mga resulta habang natatagpuan, pinakabago muna, hanggang 25 video. Mag-click ng isa para buksan; bawat isa ay nagpapakita ng tumutugmang linya at kung ilang tugma ang mayroon ang video.

Sa kanan: ang player, ang tumutugmang linya, isang timeline, **Set In / Set Out** na may padding at haba, **Precise Cut**, **Preview selection**, at ang pangalan ng file. Pumili ng download folder at idagdag ang napili sa download queue. Sinusuportahan ng queue ang pause, resume, cancel, retry, at **Reveal file**, na nagpapakita ng natapos na file sa File Explorer sa Windows o sa Finder sa macOS.

Sine-save ng **Presets** ang listahan ng mga channel o video para maibalik mo ito. Naka-disable ang **Save preset** hangga't walang laman ang listahan. Binubuksan ng **Load preset** ang folder ng mga preset para pumili ng file. May sariling preset ang bawat mode. Mag-right-click sa pangalan ng preset: Load, Add to current list, Show in Finder, Rename, at Remove from list. Mag-right-click sa blankong espasyo: Clear files, Clear presets, at Show presets folder. Ang pag-alis ng preset sa hanay ay hindi kailanman nagbubura ng file nito. Sa Windows, pinananatili ng **Show in Finder** ang label na iyon ngunit binubuksan ang File Explorer na napili ang preset file, at binubuksan ng **Show presets folder** ang folder sa File Explorer.

### Pagtutugma

- Hindi pinapansin ang laki ng titik, bantas, at istilo ng apostrophe. Maaaring sumaklaw ang isang parirala sa magkakatabing bahagi ng caption.
- Ang mga wikang walang espasyo (Chinese, Japanese, Thai, at katulad) ay tinutugma nang karakter por karakter. Hindi pinapansin ang mga marka ng patinig sa Arabic at Hebrew.
- Sinusunod ng wika ng caption ang alpabeto ng parirala (ang pariralang Cyrillic ay naghahanap ng mga track sa Russian, Ukrainian, at katulad), o ang wikang sinasalita sa bawat video para sa mga letrang Latin. Pinapalitan ito ng **Caption language** sa mga setting, na umaabot din sa mga dubbed na audio track na inilalathala ng ilang channel.
- Nililimitahan ng **Search in captions** ang paghahanap sa mga na-upload na caption, sa mga awtomatikong caption ng YouTube, o alinman (mas pinipili ang na-upload). Hindi kailanman ginagamit ang mga salin.
- Ang mga hangganan ay hangganan ng mga bahagi ng caption, hindi pagkakahanay na salita por salita.

### Account & Settings

- **Video player account:** ang **1. Sign in to Google**, **2. Connect YouTube** (piliin ang channel mo kung tatanungin), at **Check playback** ay nagbubukas ng hiwalay na window ng account para sa player. Nakatago ang login sa sariling browser storage ng app. Sa YouTube, kinukumpirma ng avatar ng account na naka-sign in ka, at ang account menu nito ay nagpapalit ng account o nagsa-sign out. Isara ang window kapag tapos ka na at maghanap muli para i-reload ang player.
- **Download authentication:** kung saan kumukuha ng YouTube sign-in ang mga paghahanap ng caption at mga download. Piliin ang **Anonymous** (default), **App's YouTube session**, isang browser na nahanap ng app sa computer na ito, o **Import Netscape cookies…**. Hindi kailanman kinokopya ang mga cookie sa mga setting ng app.
  - **Windows:** natutukoy ang Chrome, Edge, Firefox, Brave, Chromium, Vivaldi, at Opera.
  - **macOS:** natutukoy ang Chrome, Opera, Vivaldi, Firefox, Safari, at iba pa.
- **Sa Windows:**
  - Isara nang buo ang browser, kasama ang mga background process nito, bago maghanap o mag-download gamit ang mga cookie nito. Nila-lock ng mga Chromium browser (Chrome, Edge, Opera, Brave, Vivaldi, Chromium) ang cookie file nila habang tumatakbo. Kung sabihin ng app na hindi nito makopya ang cookie database ng browser, ito ang dahilan.
  - Maaari pa ring harangan ng cookie encryption ng Chromium sa Windows ang pagkuha, at hindi ito kailanman nilalampasan ng app. Gamitin na lang ang **App's YouTube session** o **Import Netscape cookies…**.
  - Ipinapasa ng app sa yt-dlp ang manual na HTTP proxy ng sistema (walang user name at password), at iginagalang ang `HTTP_PROXY` at `HTTPS_PROXY`. Hindi ipinapasa ang PAC script o ang listahan ng exception na may mga entry maliban sa lokal na address.
  - Sine-save bilang buong path ang download folder at ang na-import na cookie file. Kung lumipat ang portable na kopya sa ibang drive letter, piliin muli ang mga ito.
  - Sinususpinde ng pag-pause ng download ang proseso nito, kaya maaaring putulin ng YouTube ang koneksyon kapag matagal ang pause. Hindi nananatili ang pause at resume pagkatapos i-restart ang app.
  - Walang Full Disk Access sa Windows, kaya hindi kailanman lumalabas doon ang macOS helper window sa ibaba.
- **Sa macOS:** kailangan ng **Full Disk Access** ang mga cookie ng Chrome at Firefox; nagbubukas ang app ng maliit na helper window na may icon na iba-drag sa System Settings.
- Ang mga **pangalan ng file** na hindi kayang i-save ng Windows (mga nakareserbang pangalan tulad ng `CON` o `NUL`, at mga karakter tulad ng `? * | < >`) ay tinatanggihan sa bawat platform, para mailipat ang isang clip sa pagitan ng dalawa.
- **Videos to scan per search** (bawat channel, default 50), **Results from several channels**, **Caption language**, **Search in captions**.
- **Don't play the first found video automatically**, at **While a video loads** (thumbnail o spinner).

## Saan iniimbak ang mga bagay

| Ano | Windows (normal na pag-install) | macOS |
| --- | --- | --- |
| Mga setting (download folder, authentication) | `%APPDATA%\com.mike.captionfinder\settings.json` | `~/Library/Application Support/com.mike.captionfinder/settings.json` |
| Mga preset | `%APPDATA%\Caption Finder\Presets\Channels` at `...\Videos` | `~/Library/Application Support/Caption Finder/Presets/Channels` at `.../Videos` |
| Ang sariling YouTube sign-in ng app | `%LOCALAPPDATA%\com.mike.captionfinder\EBWebView` | `~/Library/WebKit/com.mike.captionfinder` |

Sa Windows, ang mga cache at ang media log (`logs\media.jsonl`, na naglalaman lamang ng ligtas na diagnostic code) ay nasa ilalim din ng `%LOCALAPPDATA%\com.mike.captionfinder`. Ang portable na kopya (ang portable na ZIP, o ang opsyong **Portable** ng setup) ay nag-iingat ng mga setting, sign-in, at cache nito sa folder na `Data` sa tabi ng `Caption Finder.exe`, na ang log ay nasa `Data\Diagnostics`. Ang mga preset nito ay napupunta pa rin sa `%APPDATA%\Caption Finder\Presets`. Ilipat lamang ang portable na folder kapag sarado ang app.

Sinadya na nasa labas ng sariling mga folder ng app ang mga preset: hindi ito ginagalaw ng reset o muling pag-install. Hindi kailanman nagbubura o nagpapatong ng preset file ang app nang hindi nagtatanong; kapag may pinalitan, nananatili sa tabi nito ang lumang bersyon bilang `<name>.json.bak`.

## Development at Windows build

Ang mga tala sa development (mga kinakailangan, mga build para sa Windows at macOS, balangkas ng code) at ang kalagayan ng Windows build ay nasa [README sa Ingles](../../README.md#development) lamang.

## Mga kredito

Nagsimula ang Caption Finder bilang fork ng [YouGlish Downloader](https://github.com/MolecularDust/Youglish-Downloader), na mismong fork ng TubeCutter. Galing sa gawaing iyon ang download queue at malaking bahagi ng packaging. Pinapanatili ng mga third-party na tool (yt-dlp, FFmpeg, Deno, at ang mga library sa mga app) ang sarili nilang lisensya; tingnan ang `LICENSES/` at `docs/DEPENDENCIES.md`. GPL ang mga FFmpeg build na ginagamit, kaya ang muling pamamahagi ng app ay nangangahulugang pagsunod sa mga tuntuning iyon.

Lisensyado sa ilalim ng MIT License; tingnan ang `LICENSE`. Nalalapat ang [Terms of Service](https://www.youtube.com/t/terms) ng YouTube at ang [Privacy Policy ng Google](https://policies.google.com/privacy) sa ginagawa mo sa nilalaman ng YouTube.
