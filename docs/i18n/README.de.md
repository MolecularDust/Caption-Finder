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
    <td align="center"><b>Deutsch</b></td>
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

> Diese Übersetzung wurde von einer KI geschrieben und nicht von Muttersprachlern geprüft. Die App gibt es auch in dieser Sprache; die Namen von Schaltflächen und Menüs sind hier so angegeben, wie die App sie anzeigt (die Sprache lässt sich unter Account & Settings → Language ändern). Maßgeblich ist die [englische README](../../README.md).

Finde den Moment, in dem ein Satz in YouTube-Videos gesprochen wird, such dir die passende Stelle aus und lade den zugeschnittenen Clip herunter.

Gib einen Suchbegriff ein, richte die App auf einen Kanal, mehrere Kanäle oder eine Liste von Videos, und sie durchsucht deren Untertitel. Die Treffer füllen links eine Liste. Wähle einen aus, und das Video erscheint rechts mit In- und Out-Punkten, die bereits um die Zeile gesetzt sind. Passe sie an, sieh dir eine Vorschau an und lade nur diesen Teil herunter.

<p align="center">
  <img src="../screenshot.webp" alt="Caption Finder zeigt Videos, die zum Suchbegriff „download“ passen, mit dem ausgewählten Video und den passenden Untertitelabschnitten" width="420">
</p>

> Lade nur Inhalte herunter, die dir gehören oder für die du eine Erlaubnis hast.

## Installation (Windows)

Hol dir das Setup von der [Releases-Seite](https://github.com/MolecularDust/Caption-Finder/releases): `Caption-Finder-Setup_<version>_x64.exe`. Es braucht Windows 11 auf einem x64-PC. Die WebView2-Laufzeit, die die App verwendet, ist in Windows 11 enthalten.

1. Schließe Caption Finder, falls es läuft.
2. Doppelklicke auf das Setup. Windows warnt eventuell, dass die App von einem unbekannten Herausgeber stammt, weil sie nicht code-signiert ist. Klicke auf **Weitere Informationen** (More info) und dann auf **Trotzdem ausführen** (Run anyway).
3. Wähle eine Option:
   - **Install normally:** installiert für dein Benutzerkonto ohne Administratorrechte. Legt eine Startmenü-Verknüpfung an und einen Eintrag in der Liste der installierten Apps (Apps & features).
   - **Portable:** kopiert die App in einen Ordner deiner Wahl, zum Beispiel auf einen USB-Stick. Nichts wird zum Startmenü oder zur Registry hinzugefügt, und die Einstellungen bleiben in einem Ordner `Data` neben der App.
4. Klicke auf **Install** und dann auf **Finish**.

Um eine normale Installation zu entfernen, nutze die Liste der installierten Apps (Apps & features). Deine Einstellungen und Anmeldedaten bleiben in deinem Benutzerprofil erhalten.

Du kannst auch `Caption-Finder-Windows-Portable.zip` von derselben Seite herunterladen. Entpacke die ganze ZIP-Datei zuerst in einen Ordner und starte dann `Caption Finder.exe`. Starte sie nicht aus der ZIP-Datei heraus.

## Installation (macOS)

Hol dir `Caption-Finder-Installer.dmg` vom [neuesten Release](https://github.com/MolecularDust/Caption-Finder/releases) und öffne es. Das Fenster zeigt die Schritte:

1. Doppelklicke auf **Install Caption Finder**.
2. macOS stoppt das („kann nicht geöffnet werden“). Klicke auf **Fertig** (Done).
3. Doppelklicke auf die blaue Kachel **Open System Settings**, scrolle in den **Systemeinstellungen** (System Settings) ganz nach unten zu **Datenschutz & Sicherheit** (Privacy & Security) und klicke auf **Trotzdem öffnen** (Open Anyway).
4. Bestätige mit deinem Passwort und klicke dann auf **Fortfahren** (Continue) und **Installieren** (Install).

Die App ist ad hoc signiert und nicht notarisiert, deshalb blockiert macOS das Installationsprogramm einmal. Eine vom Installer abgelegte App ist nicht als heruntergeladen markiert, daher öffnet sich Caption Finder selbst ohne Sperre. Benötigt macOS 11 oder neuer auf Apple-Silicon.

## YouTube-Zugriff einrichten

1. Installiere Caption Finder und öffne **Konto & Einstellungen**.
2. Klicke unter **Konto für den Videoplayer** auf **1. Bei Google anmelden** und dann auf **2. YouTube verbinden**, und wähle deinen Kanal, falls danach gefragt wird. Schließe das Kontofenster, wenn du fertig bist.
3. Wähle unter **Download-Authentifizierung** den Eintrag **YouTube-Sitzung der App**.

Jetzt kannst du Caption Finder benutzen.

Wenn du stattdessen einen Browser verwenden willst, in dem du bereits angemeldet bist, wähle ihn unter **Download-Authentifizierung**. Schließe unter Windows diesen Browser, bevor du suchst: Chromium-Browser sperren ihre Cookie-Datei, solange sie laufen, deshalb ist die eigene Sitzung der App dort die verlässliche Wahl. Unter macOS musst du den Browser nicht schließen. Verwende nur dein eigenes Konto. Importiere oder teile keine Cookies anderer Personen.

Du kannst auch **Anonym** beibehalten, aber die Anti-Bot-Prüfungen von YouTube sind für anonymen Zugriff strenger, und manche Videos schlagen fehl.

## So wird es benutzt

**Suchen in** wählt den Modus.

- **Kanäle:** Tippe einen Namen, und es erscheint eine Liste passender Kanäle (mit Enter sofort). Klicke einen an, um ihn hinzuzufügen. Ein Kanallink oder ein `@handle` wird direkt hinzugefügt, und ein eingefügter Videolink schlägt den Kanal vor, zu dem er gehört. Mehrere Kanäle werden nacheinander durchsucht oder gemischt (abwechselnd ein Video von jedem); siehe Account & Settings.
- **Videos:** Füge Videolinks ein (watch, `youtu.be` oder Shorts), einen oder viele. Die aufgelisteten Videos werden der Reihe nach durchsucht.

Gib dann eine **Suchbegriff** ein und drücke **Suchen**. Die Ergebnisse erscheinen, sobald sie gefunden werden, das Neueste zuerst, bis zu 25 Videos. Klicke eines an, um es zu öffnen; jedes zeigt die passende Zeile und wie viele Treffer das Video hat.

Rechts: der Player, die passende Zeile, eine Zeitleiste, **Start setzen / Ende setzen** mit Polsterung und Länge, **Präziser Schnitt**, **Auswahl ansehen** und der Dateiname. Wähle einen Download-Ordner und füge die Auswahl der Download-Warteschlange hinzu. Die Warteschlange unterstützt Pause, Fortsetzen, Abbrechen, Wiederholen und **Datei anzeigen**, das die fertige Datei unter Windows im Explorer oder unter macOS im Finder anzeigt.

**Voreinstellungen** speichern eine Liste von Kanälen oder Videos, damit du sie wieder abrufen kannst. **Voreinstellung speichern** ist deaktiviert, solange die Liste leer ist. **Voreinstellung laden** öffnet den Presets-Ordner, um eine Datei auszuwählen. Jeder Modus hat eigene Presets. Rechtsklick auf einen Preset-Namen: Load, Add to current list, Show in Finder, Rename und Remove from list. Rechtsklick auf freie Fläche: Clear files, Clear presets und Show presets folder. Ein Preset aus der Zeile zu entfernen löscht nie seine Datei. Unter Windows behält **Im Finder zeigen** diese Beschriftung, öffnet aber den Explorer mit der ausgewählten Preset-Datei, und **Ordner der Voreinstellungen zeigen** öffnet den Ordner im Explorer.

### Abgleich

- Groß-/Kleinschreibung, Satzzeichen und die Art des Apostrophs werden ignoriert. Ein Satz kann über benachbarte Untertitel-Cues reichen.
- Sprachen ohne Leerzeichen (Chinesisch, Japanisch, Thai und ähnliche) werden Zeichen für Zeichen abgeglichen. Vokalzeichen im Arabischen und Hebräischen werden ignoriert.
- Die Untertitelsprache richtet sich nach der Schrift des Suchbegriffs (ein kyrillischer Satz sucht russische, ukrainische und ähnliche Spuren) oder bei lateinischen Buchstaben nach der Sprache, in der das jeweilige Video gesprochen wird. **Untertitelsprache** in den Einstellungen überschreibt das, was auch die synchronisierten Tonspuren erreicht, die manche Kanäle veröffentlichen.
- **In Untertiteln suchen** beschränkt die Suche auf hochgeladene Untertitel, auf die automatischen Untertitel von YouTube oder auf beides (hochgeladene bevorzugt). Übersetzungen werden nie verwendet.
- Die Grenzen sind Untertitel-Cue-Grenzen, keine wortgenaue Ausrichtung.

### Account & Settings

- **Konto für den Videoplayer:** **1. Bei Google anmelden**, **2. YouTube verbinden** (Kanal wählen, falls gefragt) und **Wiedergabe prüfen** öffnen ein eigenes Kontofenster für den Player. Die Anmeldung wird im eigenen Browser-Speicher der App gehalten. Auf YouTube bestätigt ein Konto-Avatar, dass du angemeldet bist, und sein Kontomenü wechselt das Konto oder meldet ab. Schließe das Fenster, wenn du fertig bist, und suche erneut, um den Player neu zu laden.
- **Download-Authentifizierung:** woher Untertitelabfragen und Downloads ihre YouTube-Anmeldung nehmen. Wähle **Anonym** (Standard), **YouTube-Sitzung der App**, einen Browser, den die App auf diesem Computer findet, oder **Netscape-Cookies importieren …**. Cookies werden nie in die Einstellungen der App kopiert.
  - **Windows:** Chrome, Edge, Firefox, Brave, Chromium, Vivaldi und Opera werden erkannt.
  - **macOS:** Chrome, Opera, Vivaldi, Firefox, Safari und weitere werden erkannt.
- **Unter Windows:**
  - Schließe den Browser vollständig, auch seine Hintergrundprozesse, bevor du mit seinen Cookies suchst oder herunterlädst. Chromium-Browser (Chrome, Edge, Opera, Brave, Vivaldi, Chromium) sperren ihre Cookie-Datei, solange sie laufen. Wenn die App meldet, sie konnte die Cookie-Datenbank des Browsers nicht kopieren, liegt es daran.
  - Die Cookie-Verschlüsselung von Chromium unter Windows kann die Extraktion trotzdem verhindern, und die App umgeht sie nie. Nutze stattdessen **YouTube-Sitzung der App** oder **Netscape-Cookies importieren …**.
  - Die App reicht den manuellen HTTP-Proxy des Systems (ohne Benutzername und Passwort) an yt-dlp weiter und beachtet `HTTP_PROXY` und `HTTPS_PROXY`. Ein PAC-Skript oder eine Ausnahmeliste mit anderen Einträgen als lokalen Adressen wird nicht weitergegeben.
  - Der Download-Ordner und eine importierte Cookie-Datei werden als vollständige Pfade gespeichert. Wenn eine portable Kopie auf einen anderen Laufwerksbuchstaben umzieht, wähle sie erneut aus.
  - Das Pausieren eines Downloads hält seinen Prozess an, daher kann eine lange Pause dazu führen, dass YouTube die Verbindung trennt. Pause und Fortsetzen überdauern keinen Neustart der App.
  - Unter Windows gibt es keinen Festplattenvollzugriff (Full Disk Access), deshalb erscheint das macOS-Hilfsfenster weiter unten nie.
- **Unter macOS:** Für Cookies von Chrome und Firefox ist **Festplattenvollzugriff** (Full Disk Access) nötig; die App öffnet ein kleines Hilfsfenster mit einem Symbol zum Ziehen in die Systemeinstellungen (System Settings).
- **Dateinamen**, die Windows nicht speichern kann (reservierte Namen wie `CON` oder `NUL` und Zeichen wie `? * | < >`), werden auf jeder Plattform abgelehnt, damit ein Clip zwischen beiden wechseln kann.
- **Pro Suche zu prüfende Videos** (pro Kanal, Standard 50), **Ergebnisse aus mehreren Kanälen**, **Untertitelsprache**, **In Untertiteln suchen**.
- **Das erste gefundene Video nicht automatisch abspielen** und **Während ein Video lädt** (Vorschaubild oder Ladeanzeige).

## Wo was gespeichert wird

| Was | Windows (normale Installation) | macOS |
| --- | --- | --- |
| Einstellungen (Download-Ordner, Authentifizierung) | `%APPDATA%\com.mike.captionfinder\settings.json` | `~/Library/Application Support/com.mike.captionfinder/settings.json` |
| Presets | `%APPDATA%\Caption Finder\Presets\Channels` und `...\Videos` | `~/Library/Application Support/Caption Finder/Presets/Channels` und `.../Videos` |
| Die eigene YouTube-Anmeldung der App | `%LOCALAPPDATA%\com.mike.captionfinder\EBWebView` | `~/Library/WebKit/com.mike.captionfinder` |

Unter Windows liegen auch Caches und das Medienprotokoll (`logs\media.jsonl`, das nur unbedenkliche Diagnosecodes enthält) unter `%LOCALAPPDATA%\com.mike.captionfinder`. Eine portable Kopie (die portable ZIP-Datei oder die Option **Portable** des Setups) hält Einstellungen, Anmeldung und Caches in einem Ordner `Data` neben `Caption Finder.exe`, das Protokoll in `Data\Diagnostics`. Ihre Presets liegen weiterhin in `%APPDATA%\Caption Finder\Presets`. Verschiebe einen portablen Ordner nur, während die App geschlossen ist.

Presets liegen absichtlich außerhalb der eigenen Ordner der App: Ein Zurücksetzen oder eine Neuinstallation lässt sie in Ruhe. Die App löscht oder überschreibt nie eine Preset-Datei, ohne zu fragen; beim Ersetzen bleibt die alte Version daneben als `<name>.json.bak` erhalten.

## Entwicklung und Windows-Build

Hinweise zur Entwicklung (Voraussetzungen, Builds für Windows und macOS, Aufbau des Codes) und der Stand des Windows-Builds stehen nur in der [englischen README](../../README.md#development).

## Credits

Caption Finder begann als Fork von [YouGlish Downloader](https://github.com/MolecularDust/Youglish-Downloader), das selbst ein Fork von TubeCutter ist. Die Download-Warteschlange und ein großer Teil des Packagings stammen aus dieser Arbeit. Werkzeuge von Drittanbietern (yt-dlp, FFmpeg, Deno und die Bibliotheken in den Apps) behalten ihre eigenen Lizenzen; siehe `LICENSES/` und `docs/DEPENDENCIES.md`. Die verwendeten FFmpeg-Builds sind GPL, daher bedeutet die Weitergabe der App, diese Bedingungen zu befolgen.

Lizenziert unter der MIT-Lizenz; siehe `LICENSE`. Die [Nutzungsbedingungen](https://www.youtube.com/t/terms) von YouTube und die [Datenschutzerklärung von Google](https://policies.google.com/privacy) gelten für das, was du mit YouTube-Inhalten tust.
