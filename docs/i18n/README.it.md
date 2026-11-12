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
    <td align="center"><b>Italiano</b></td>
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

> Questa traduzione è stata scritta da un’IA e non è stata rivista da madrelingua. L’app stessa è in inglese, quindi i nomi di pulsanti e menu restano in inglese. In caso di dubbio, fa fede il [README in inglese](../../README.md).

Trova il momento in cui una frase viene pronunciata nei video di YouTube, scegli la ripresa che preferisci e scarica la clip ritagliata.

Digita una frase, indica all’app un canale, più canali o un elenco di video, e lei analizza i loro sottotitoli. Le corrispondenze riempiono un elenco a sinistra. Selezionane una e il video si carica a destra con i punti di ingresso e di uscita già impostati attorno alla frase. Regolali, guarda l’anteprima e scarica solo quella parte.

<p align="center">
  <img src="../screenshot.webp" alt="Caption Finder che elenca i video corrispondenti alla frase «download», con il video selezionato e i relativi segmenti di sottotitoli" width="420">
</p>

> Scarica solo contenuti che ti appartengono o per cui hai il permesso di scaricare.

## Installazione (Windows)

Scarica il programma di installazione dalla [pagina delle release](https://github.com/MolecularDust/Caption-Finder/releases): `Caption-Finder-Setup_<version>_x64.exe`. Richiede Windows 11 su un PC x64. Il runtime WebView2 usato dall’app è incluso in Windows 11.

1. Chiudi Caption Finder se è in esecuzione.
2. Fai doppio clic sul programma di installazione. Windows potrebbe avvisare che l’app proviene da un editore sconosciuto, perché non è firmata. Fai clic su **Ulteriori informazioni** (More info) e poi su **Esegui comunque** (Run anyway).
3. Scegli un’opzione:
   - **Install normally:** installa per il tuo account utente senza diritti di amministratore. Aggiunge un collegamento nel menu Start e una voce nell’elenco delle app installate (Apps & features).
   - **Portable:** copia l’app in una cartella a tua scelta, per esempio su una chiavetta USB. Non viene aggiunto nulla al menu Start né al registro, e le impostazioni restano in una cartella `Data` accanto all’app.
4. Fai clic su **Install** e poi su **Finish**.

Per disinstallare un’installazione normale, usa l’elenco delle app installate (Apps & features). Le tue impostazioni e i dati di accesso restano nel tuo profilo utente.

Puoi anche scaricare `Caption-Finder-Windows-Portable.zip` dalla stessa pagina. Estrai prima tutto lo ZIP in una cartella, poi avvia `Caption Finder.exe`. Non avviarlo dall’interno dello ZIP.

## Installazione (macOS)

Scarica `Caption-Finder-Installer.dmg` dall’[ultima release](https://github.com/MolecularDust/Caption-Finder/releases) e aprilo. La finestra mostra i passaggi:

1. Fai doppio clic su **Install Caption Finder**.
2. macOS lo blocca («non può essere aperto»). Fai clic su **Fine** (Done).
3. Fai doppio clic sul riquadro blu **Open System Settings**, scorri in fondo a **Privacy e sicurezza** (Privacy & Security) nelle **Impostazioni di Sistema** (System Settings) e fai clic su **Apri comunque** (Open Anyway).
4. Conferma con la tua password, poi fai clic su **Continua** (Continue) e **Installa** (Install).

L’app è firmata ad hoc e non è notarizzata, quindi macOS blocca il programma di installazione una volta. Un’app messa in posizione dall’installer non è contrassegnata come scaricata, perciò Caption Finder si apre poi senza blocchi. Richiede macOS 11 o successivo su Apple silicon.

## Configurare l’accesso a YouTube

1. Installa Caption Finder e apri **Account & Settings**.
2. Sotto **Video player account**, fai clic su **1. Sign in to Google**, poi su **2. Connect YouTube**, e scegli il tuo canale se richiesto. Chiudi la finestra dell’account quando hai finito.
3. Sotto **Download authentication**, scegli **App’s YouTube session**.

Sei pronto a usare Caption Finder.

Per usare invece un browser in cui hai già effettuato l’accesso, sceglilo sotto **Download authentication**. Su Windows, chiudi quel browser prima di cercare: i browser Chromium bloccano il file dei cookie finché sono in esecuzione, quindi la sessione propria dell’app è la scelta affidabile. Su macOS non serve chiudere il browser. Usa solo il tuo account. Non importare né condividere i cookie di altri.

Puoi anche lasciare **Anonymous**, ma i controlli anti-bot di YouTube sono più severi per l’accesso anonimo e alcuni video non funzioneranno.

## Come si usa

**Search across** sceglie la modalità.

- **Channels:** digita un nome e compare un elenco di canali corrispondenti (Invio lo mostra subito). Fai clic su uno per aggiungerlo. Un link di canale o un `@handle` viene aggiunto direttamente, e un link di video incollato suggerisce il canale a cui appartiene. Più canali vengono cercati uno dopo l’altro, oppure mescolati (un video da ciascuno a turno); vedi Account & Settings.
- **Videos:** incolla link di video (watch, `youtu.be` o Shorts), uno o molti. I video in elenco vengono cercati in ordine.

Poi digita una **Search phrase** e premi **Search**. I risultati compaiono man mano che vengono trovati, i più recenti per primi, fino a 25 video. Fai clic su uno per aprirlo; ognuno mostra la riga corrispondente e quante corrispondenze ha il video.

A destra: il lettore, la riga trovata, una linea temporale, **Set In / Set Out** con margine e durata, **Precise Cut**, **Preview selection** e il nome del file. Scegli una cartella di download e aggiungi la selezione alla coda di download. La coda supporta pausa, ripresa, annullamento, nuovo tentativo e **Reveal file**, che mostra il file finito in Esplora file su Windows o nel Finder su macOS.

I **Presets** salvano un elenco di canali o video per poterlo riprendere. **Save preset** è disattivato finché l’elenco è vuoto. **Load preset** apre la cartella dei preset per scegliere un file. Ogni modalità ha i propri preset. Clic destro sul nome di un preset: Load, Add to current list, Show in Finder, Rename e Remove from list. Clic destro su uno spazio vuoto: Clear files, Clear presets e Show presets folder. Rimuovere un preset dalla riga non elimina mai il suo file. Su Windows, **Show in Finder** mantiene questa etichetta ma apre Esplora file con il file del preset selezionato, e **Show presets folder** apre la cartella in Esplora file.

### Corrispondenza

- Maiuscole e minuscole, punteggiatura e stile dell’apostrofo vengono ignorati. Una frase può estendersi su segmenti di sottotitoli adiacenti.
- Le lingue senza spazi (cinese, giapponese, thai e simili) vengono confrontate carattere per carattere. Le vocali dell’arabo e dell’ebraico vengono ignorate.
- La lingua dei sottotitoli segue l’alfabeto della frase (una frase in cirillico cerca tracce in russo, ucraino e simili) oppure, per le lettere latine, la lingua parlata in ogni video. **Caption language** nelle impostazioni lo sostituisce, e questo raggiunge anche le tracce audio doppiate che alcuni canali pubblicano.
- **Search in captions** limita la ricerca ai sottotitoli caricati, ai sottotitoli automatici di YouTube o a entrambi (con preferenza per quelli caricati). Le traduzioni non vengono mai usate.
- I confini sono quelli dei segmenti di sottotitoli, non un allineamento parola per parola.

### Account & Settings

- **Video player account:** **1. Sign in to Google**, **2. Connect YouTube** (scegli il tuo canale se richiesto) e **Check playback** aprono una finestra account separata per il lettore. L’accesso viene conservato nell’archivio del browser dell’app. Su YouTube, un avatar dell’account conferma che hai effettuato l’accesso, e il suo menu permette di cambiare account o uscire. Chiudi la finestra quando hai finito e cerca di nuovo per ricaricare il lettore.
- **Download authentication:** da dove le richieste di sottotitoli e i download prendono l’accesso a YouTube. Scegli **Anonymous** (predefinito), **App's YouTube session**, un browser che l’app trova su questo computer oppure **Import Netscape cookies…**. I cookie non vengono mai copiati nelle impostazioni dell’app.
  - **Windows:** vengono rilevati Chrome, Edge, Firefox, Brave, Chromium, Vivaldi e Opera.
  - **macOS:** vengono rilevati Chrome, Opera, Vivaldi, Firefox, Safari e altri.
- **Su Windows:**
  - Chiudi completamente il browser, compresi i processi in background, prima di cercare o scaricare con i suoi cookie. I browser Chromium (Chrome, Edge, Opera, Brave, Vivaldi, Chromium) bloccano il file dei cookie finché sono in esecuzione. Se l’app dice di non aver potuto copiare il database dei cookie del browser, è per questo.
  - La cifratura dei cookie di Chromium su Windows può comunque impedire l’estrazione, e l’app non la aggira mai. Usa invece **App's YouTube session** o **Import Netscape cookies…**.
  - L’app passa a yt-dlp il proxy HTTP manuale del sistema (senza nome utente né password) e rispetta `HTTP_PROXY` e `HTTPS_PROXY`. Uno script PAC o un elenco di esclusioni con voci diverse dagli indirizzi locali non viene inoltrato.
  - La cartella di download e un file di cookie importato vengono salvati come percorsi completi. Se una copia portatile passa a un’altra lettera di unità, sceglili di nuovo.
  - Mettere in pausa un download sospende il suo processo, quindi una pausa lunga può far cadere la connessione con YouTube. Pausa e ripresa non sopravvivono a un riavvio dell’app.
  - Su Windows non esiste l’Accesso completo al disco (Full Disk Access), quindi la finestra di aiuto di macOS descritta sotto non compare mai.
- **Su macOS:** i cookie di Chrome e Firefox richiedono l’**Accesso completo al disco** (Full Disk Access); l’app apre una piccola finestra di aiuto con un’icona da trascinare nelle Impostazioni di Sistema (System Settings).
- **I nomi di file** che Windows non può salvare (nomi riservati come `CON` o `NUL`, e caratteri come `? * | < >`) vengono rifiutati su ogni piattaforma, così una clip può passare dall’una all’altra.
- **Videos to scan per search** (per canale, predefinito 50), **Results from several channels**, **Caption language**, **Search in captions**.
- **Don't play the first found video automatically** e **While a video loads** (miniatura o indicatore di caricamento).

## Dove vengono conservati i dati

| Cosa | Windows (installazione normale) | macOS |
| --- | --- | --- |
| Impostazioni (cartella di download, autenticazione) | `%APPDATA%\com.mike.captionfinder\settings.json` | `~/Library/Application Support/com.mike.captionfinder/settings.json` |
| Preset | `%APPDATA%\Caption Finder\Presets\Channels` e `...\Videos` | `~/Library/Application Support/Caption Finder/Presets/Channels` e `.../Videos` |
| L’accesso a YouTube proprio dell’app | `%LOCALAPPDATA%\com.mike.captionfinder\EBWebView` | `~/Library/WebKit/com.mike.captionfinder` |

Su Windows, anche le cache e il registro dei media (`logs\media.jsonl`, che contiene solo codici diagnostici sicuri) si trovano in `%LOCALAPPDATA%\com.mike.captionfinder`. Una copia portatile (lo ZIP portatile o l’opzione **Portable** del programma di installazione) conserva impostazioni, accesso e cache in una cartella `Data` accanto a `Caption Finder.exe`, con il registro in `Data\Diagnostics`. I suoi preset vanno comunque in `%APPDATA%\Caption Finder\Presets`. Sposta una cartella portatile solo con l’app chiusa.

I preset stanno di proposito fuori dalle cartelle proprie dell’app: un ripristino o una reinstallazione non li tocca. L’app non elimina né sovrascrive mai un file di preset senza chiedere; sostituirne uno mantiene la vecchia versione accanto come `<name>.json.bak`.

## Sviluppo e build per Windows

Le note di sviluppo (prerequisiti, build per Windows e macOS, struttura del codice) e lo stato della build per Windows si trovano solo nel [README in inglese](../../README.md#development).

## Crediti

Caption Finder è nato come fork di [YouGlish Downloader](https://github.com/MolecularDust/Youglish-Downloader), a sua volta un fork di TubeCutter. La coda di download e gran parte del packaging derivano da quel lavoro. Gli strumenti di terze parti (yt-dlp, FFmpeg, Deno e le librerie nelle app) mantengono le proprie licenze; vedi `LICENSES/` e `docs/DEPENDENCIES.md`. Le build di FFmpeg usate sono GPL, quindi ridistribuire l’app significa rispettare quei termini.

Distribuito con licenza MIT; vedi `LICENSE`. I [Termini di servizio](https://www.youtube.com/t/terms) di YouTube e l’[Informativa sulla privacy di Google](https://policies.google.com/privacy) si applicano a ciò che fai con i contenuti di YouTube.
