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
    <td align="center"><b>Español</b></td>
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

> Esta traducción fue escrita por una IA y no ha sido revisada por hablantes nativos. La aplicación también está disponible en este idioma, y los nombres de los botones y los menús se dan aquí tal como los muestra la app (el idioma se cambia en Account & Settings → Language). Ante cualquier duda, el [README en inglés](../../README.md) es la referencia.

Encuentra el momento en que se dice una frase en vídeos de YouTube, elige la toma que te guste y descarga el clip recortado.

Escribe una frase, apunta la aplicación a un canal, a varios canales o a una lista de vídeos, y analiza sus subtítulos. Las coincidencias llenan una lista a la izquierda. Elige una y el vídeo se carga a la derecha con los puntos de entrada y salida ya colocados alrededor de la línea. Ajústalos, previsualiza y descarga solo esa parte.

<p align="center">
  <img src="../screenshot.webp" alt="Caption Finder mostrando los vídeos que coinciden con la frase «download», con el vídeo seleccionado y sus segmentos de subtítulos coincidentes" width="420">
</p>

> Descarga solo contenido que sea tuyo o para el que tengas permiso.

## Instalación (Windows)

Consigue el instalador en la [página de versiones](https://github.com/MolecularDust/Caption-Finder/releases): `Caption-Finder-Setup_<version>_x64.exe`. Necesita Windows 11 en un PC x64. El entorno WebView2 que usa la aplicación viene incluido en Windows 11.

1. Cierra Caption Finder si se está ejecutando.
2. Haz doble clic en el instalador. Windows puede avisar de que la aplicación es de un editor desconocido, porque no está firmada. Haz clic en **Más información** (More info) y luego en **Ejecutar de todas formas** (Run anyway).
3. Elige una opción:
   - **Install normally:** instala para tu cuenta de usuario sin permisos de administrador. Añade un acceso directo en el menú Inicio y una entrada en la lista de aplicaciones instaladas (Apps & features).
   - **Portable:** copia la aplicación en una carpeta que elijas, por ejemplo en una unidad USB. No se añade nada al menú Inicio ni al registro, y la configuración se queda en una carpeta `Data` junto a la aplicación.
4. Haz clic en **Install** y luego en **Finish**.

Para desinstalar una instalación normal, usa la lista de aplicaciones instaladas (Apps & features). Tu configuración y tus datos de inicio de sesión se conservan en tu perfil de usuario.

También puedes descargar `Caption-Finder-Windows-Portable.zip` de la misma página. Extrae primero todo el ZIP en una carpeta y luego ejecuta `Caption Finder.exe`. No lo ejecutes desde dentro del ZIP.

## Instalación (macOS)

Consigue `Caption-Finder-Installer.dmg` en la [última versión](https://github.com/MolecularDust/Caption-Finder/releases) y ábrelo. La ventana muestra los pasos:

1. Haz doble clic en **Install Caption Finder**.
2. macOS lo detiene («no se puede abrir»). Haz clic en **Aceptar** (Done).
3. Haz doble clic en el icono azul **Open System Settings**, baja hasta el final de **Privacidad y seguridad** (Privacy & Security) en los **Ajustes del Sistema** (System Settings) y haz clic en **Abrir igualmente** (Open Anyway).
4. Confirma con tu contraseña y luego haz clic en **Continuar** (Continue) e **Instalar** (Install).

La aplicación está firmada ad hoc y no está notarizada, así que macOS bloquea el instalador una vez. Una aplicación colocada por el instalador no se marca como descargada, por lo que Caption Finder se abre después sin bloqueo. Requiere macOS 11 o posterior en Apple silicon.

## Configurar el acceso a YouTube

1. Instala Caption Finder y abre **Cuenta y ajustes**.
2. En **Cuenta del reproductor de vídeo**, haz clic en **1. Iniciar sesión en Google** y luego en **2. Conectar YouTube**, y elige tu canal si te lo piden. Cierra la ventana de la cuenta cuando termines.
3. En **Autenticación de las descargas**, elige **Sesión de YouTube de la app**.

Ya puedes usar Caption Finder.

Para usar en su lugar un navegador en el que ya has iniciado sesión, elígelo en **Autenticación de las descargas**. En Windows, cierra ese navegador antes de buscar: los navegadores Chromium bloquean su archivo de cookies mientras se ejecutan, por lo que la sesión propia de la aplicación es la opción fiable. En macOS no hace falta cerrar el navegador. Usa solo tu propia cuenta. No importes ni compartas las cookies de otra persona.

También puedes dejar **Anónimo**, pero los controles antibots de YouTube son más estrictos para el acceso anónimo y algunos vídeos fallarán.

## Cómo se usa

**Buscar en** elige el modo.

- **Canales:** escribe un nombre y aparece una lista de canales coincidentes (Intro la muestra al instante). Haz clic en uno para añadirlo. Un enlace de canal o un `@handle` se añade directamente, y un enlace de vídeo pegado sugiere el canal al que pertenece. Varios canales se buscan uno tras otro, o mezclados (un vídeo de cada uno por turnos); consulta Account & Settings.
- **Vídeos:** pega enlaces de vídeos (watch, `youtu.be` o Shorts), uno o varios. Los vídeos de la lista se buscan en orden.

Luego escribe una **Frase de búsqueda** y pulsa **Buscar**. Los resultados aparecen a medida que se encuentran, los más recientes primero, hasta 25 vídeos. Haz clic en uno para abrirlo; cada uno muestra la línea coincidente y cuántas coincidencias tiene el vídeo.

A la derecha: el reproductor, la línea encontrada, una línea de tiempo, **Fijar entrada / Fijar salida** con margen y duración, **Precise Cut**, **Vista previa de la selección** y el nombre del archivo. Elige una carpeta de descarga y añade la selección a la cola de descargas. La cola permite pausar, reanudar, cancelar, reintentar y **Mostrar archivo**, que muestra el archivo terminado en el Explorador de archivos en Windows o en el Finder en macOS.

Los **Preajustes** guardan una lista de canales o vídeos para recuperarla. **Guardar preajuste** está desactivado hasta que la lista tiene algo. **Cargar preajuste** abre la carpeta de presets para elegir un archivo. Cada modo tiene sus propios presets. Haz clic derecho en el nombre de un preset: Load, Add to current list, Show in Finder, Rename y Remove from list. Clic derecho en un espacio vacío: Clear files, Clear presets y Show presets folder. Quitar un preset de la fila nunca borra su archivo. En Windows, **Mostrar en el Finder** conserva esa etiqueta pero abre el Explorador de archivos con el archivo del preset seleccionado, y **Mostrar la carpeta de preajustes** abre la carpeta en el Explorador de archivos.

### Coincidencias

- Se ignoran las mayúsculas, la puntuación y el estilo del apóstrofo. Una frase puede abarcar segmentos de subtítulos contiguos.
- Los idiomas sin espacios (chino, japonés, tailandés y similares) se comparan carácter por carácter. Se ignoran las vocales del árabe y del hebreo.
- El idioma de los subtítulos sigue el alfabeto de la frase (una frase en cirílico busca pistas en ruso, ucraniano y similares) o, para letras latinas, el idioma en que se habla cada vídeo. **Idioma de los subtítulos** en los ajustes lo anula, lo que también alcanza las pistas de audio dobladas que publican algunos canales.
- **Buscar en los subtítulos** limita la búsqueda a los subtítulos subidos, a los subtítulos automáticos de YouTube o a cualquiera de los dos (con preferencia por los subidos). Nunca se usan traducciones.
- Los límites son los de los segmentos de subtítulos, no una alineación palabra por palabra.

### Account & Settings

- **Cuenta del reproductor de vídeo:** **1. Iniciar sesión en Google**, **2. Conectar YouTube** (elige tu canal si te lo piden) y **Comprobar la reproducción** abren una ventana de cuenta aparte para el reproductor. El inicio de sesión se guarda en el almacenamiento de navegador propio de la aplicación. En YouTube, un avatar de cuenta confirma que has iniciado sesión, y su menú de cuenta cambia de cuenta o cierra la sesión. Cierra la ventana cuando termines y vuelve a buscar para recargar el reproductor.
- **Autenticación de las descargas:** de dónde sacan su inicio de sesión de YouTube las consultas de subtítulos y las descargas. Elige **Anónimo** (el valor por defecto), **Sesión de YouTube de la app**, un navegador que la aplicación encuentre en este equipo o **Importar cookies de Netscape…**. Las cookies nunca se copian a los ajustes de la aplicación.
  - **Windows:** se detectan Chrome, Edge, Firefox, Brave, Chromium, Vivaldi y Opera.
  - **macOS:** se detectan Chrome, Opera, Vivaldi, Firefox, Safari y otros.
- **En Windows:**
  - Cierra el navegador por completo, incluidos sus procesos en segundo plano, antes de buscar o descargar con sus cookies. Los navegadores Chromium (Chrome, Edge, Opera, Brave, Vivaldi, Chromium) bloquean su archivo de cookies mientras se ejecutan. Si la aplicación dice que no pudo copiar la base de datos de cookies del navegador, es por esto.
  - El cifrado de cookies de Chromium en Windows aún puede impedir la extracción, y la aplicación nunca lo elude. Usa en su lugar **Sesión de YouTube de la app** o **Importar cookies de Netscape…**.
  - La aplicación pasa a yt-dlp el proxy HTTP manual del sistema (sin nombre de usuario ni contraseña) y respeta `HTTP_PROXY` y `HTTPS_PROXY`. No se reenvía un script PAC ni una lista de excepciones con entradas distintas de direcciones locales.
  - La carpeta de descarga y un archivo de cookies importado se guardan como rutas completas. Si una copia portátil pasa a otra letra de unidad, vuelve a elegirlos.
  - Pausar una descarga suspende su proceso, así que una pausa larga puede hacer que YouTube corte la conexión. La pausa y la reanudación no sobreviven a un reinicio de la aplicación.
  - En Windows no existe el Acceso total al disco (Full Disk Access), por lo que la ventana de ayuda de macOS que aparece más abajo nunca se muestra.
- **En macOS:** las cookies de Chrome y Firefox necesitan el **Acceso total al disco** (Full Disk Access); la aplicación abre una pequeña ventana de ayuda con un icono para arrastrar a los Ajustes del Sistema (System Settings).
- **Los nombres de archivo** que Windows no puede guardar (nombres reservados como `CON` o `NUL`, y caracteres como `? * | < >`) se rechazan en todas las plataformas, para que un clip pueda pasar de una a otra.
- **Vídeos a revisar por búsqueda** (por canal, 50 por defecto), **Resultados de varios canales**, **Idioma de los subtítulos**, **Buscar en los subtítulos**.
- **No reproducir automáticamente el primer vídeo encontrado** y **Mientras se carga un vídeo** (miniatura o indicador de carga).

## Dónde se guarda cada cosa

| Qué | Windows (instalación normal) | macOS |
| --- | --- | --- |
| Ajustes (carpeta de descarga, autenticación) | `%APPDATA%\com.mike.captionfinder\settings.json` | `~/Library/Application Support/com.mike.captionfinder/settings.json` |
| Presets | `%APPDATA%\Caption Finder\Presets\Channels` y `...\Videos` | `~/Library/Application Support/Caption Finder/Presets/Channels` y `.../Videos` |
| El inicio de sesión de YouTube propio de la aplicación | `%LOCALAPPDATA%\com.mike.captionfinder\EBWebView` | `~/Library/WebKit/com.mike.captionfinder` |

En Windows, las cachés y el registro de medios (`logs\media.jsonl`, que solo contiene códigos de diagnóstico seguros) también están en `%LOCALAPPDATA%\com.mike.captionfinder`. Una copia portátil (el ZIP portátil o la opción **Portable** del instalador) guarda sus ajustes, su inicio de sesión y sus cachés en una carpeta `Data` junto a `Caption Finder.exe`, con el registro en `Data\Diagnostics`. Sus presets siguen yendo a `%APPDATA%\Caption Finder\Presets`. Mueve una carpeta portátil solo con la aplicación cerrada.

Los presets viven fuera de las carpetas propias de la aplicación a propósito: un restablecimiento o una reinstalación no los toca. La aplicación nunca borra ni sobrescribe un archivo de preset sin preguntar; al reemplazar uno, la versión anterior se conserva a su lado como `<name>.json.bak`.

## Desarrollo y compilación para Windows

Las notas de desarrollo (requisitos, compilaciones para Windows y macOS, estructura del código) y el estado de la compilación para Windows solo están en el [README en inglés](../../README.md#development).

## Créditos

Caption Finder nació como un fork de [YouGlish Downloader](https://github.com/MolecularDust/Youglish-Downloader), que a su vez es un fork de TubeCutter. La cola de descargas y buena parte del empaquetado proceden de ese trabajo. Las herramientas de terceros (yt-dlp, FFmpeg, Deno y las bibliotecas de las aplicaciones) conservan sus propias licencias; consulta `LICENSES/` y `docs/DEPENDENCIES.md`. Las compilaciones de FFmpeg que se usan son GPL, así que redistribuir la aplicación implica cumplir esos términos.

Licenciado bajo la licencia MIT; consulta `LICENSE`. Las [Condiciones del servicio](https://www.youtube.com/t/terms) de YouTube y la [Política de privacidad de Google](https://policies.google.com/privacy) se aplican a lo que hagas con el contenido de YouTube.
