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
    <td align="center"><b>Français</b></td>
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

> Cette traduction a été écrite par une IA et n’a pas été relue par des locuteurs natifs. L’application existe aussi dans cette langue, et les noms des boutons et des menus sont donnés ici tels que l’appli les affiche (la langue se change dans Account & Settings → Language). En cas de doute, le [README en anglais](../../README.md) fait foi.

Trouvez l’instant où une phrase est prononcée dans des vidéos YouTube, choisissez la prise qui vous plaît et téléchargez l’extrait découpé.

Saisissez une phrase, pointez l’application vers une chaîne, plusieurs chaînes ou une liste de vidéos, et elle analyse leurs sous-titres. Les résultats remplissent une liste à gauche. Choisissez-en un et la vidéo se charge à droite, avec des points d’entrée et de sortie déjà placés autour de la phrase. Ajustez-les, prévisualisez et téléchargez uniquement cette partie.

<p align="center">
  <img src="../screenshot.webp" alt="Caption Finder affichant les vidéos qui correspondent à la phrase « download », avec la vidéo sélectionnée et ses segments de sous-titres correspondants" width="420">
</p>

> Ne téléchargez que des contenus qui vous appartiennent ou que vous avez le droit de télécharger.

## Installation (Windows)

Récupérez le programme d’installation sur la [page des versions](https://github.com/MolecularDust/Caption-Finder/releases) : `Caption-Finder-Setup_<version>_x64.exe`. Il nécessite Windows 11 sur un PC x64. Le runtime WebView2 utilisé par l’application est inclus dans Windows 11.

1. Fermez Caption Finder s’il est en cours d’exécution.
2. Double-cliquez sur le programme d’installation. Windows peut avertir que l’application provient d’un éditeur inconnu, car elle n’est pas signée. Cliquez sur **Informations complémentaires** (More info), puis sur **Exécuter quand même** (Run anyway).
3. Choisissez une option :
   - **Install normally :** installe pour votre compte utilisateur, sans droits d’administrateur. Ajoute un raccourci dans le menu Démarrer et une entrée dans la liste des applications installées (Apps & features).
   - **Portable :** copie l’application dans un dossier de votre choix, par exemple sur une clé USB. Rien n’est ajouté au menu Démarrer ni au registre, et les paramètres restent dans un dossier `Data` à côté de l’application.
4. Cliquez sur **Install**, puis sur **Finish**.

Pour désinstaller une installation normale, utilisez la liste des applications installées (Apps & features). Vos paramètres et vos données de connexion restent dans votre profil utilisateur.

Vous pouvez aussi télécharger `Caption-Finder-Windows-Portable.zip` depuis la même page. Extrayez d’abord tout le ZIP dans un dossier, puis lancez `Caption Finder.exe`. Ne le lancez pas depuis l’intérieur du ZIP.

## Installation (macOS)

Récupérez `Caption-Finder-Installer.dmg` dans la [dernière version](https://github.com/MolecularDust/Caption-Finder/releases) et ouvrez-le. La fenêtre indique les étapes :

1. Double-cliquez sur **Install Caption Finder**.
2. macOS l’arrête (« ne peut pas être ouvert »). Cliquez sur **Terminé** (Done).
3. Double-cliquez sur la tuile bleue **Open System Settings**, faites défiler jusqu’en bas de **Confidentialité et sécurité** (Privacy & Security) dans les **Réglages Système** (System Settings), puis cliquez sur **Ouvrir quand même** (Open Anyway).
4. Confirmez avec votre mot de passe, puis cliquez sur **Continuer** (Continue) et **Installer** (Install).

L’application est signée ad hoc et n’est pas notariée ; macOS bloque donc l’installateur une fois. Une application placée par l’installateur n’est pas marquée comme téléchargée, si bien que Caption Finder s’ouvre ensuite sans blocage. Nécessite macOS 11 ou plus récent sur Apple silicon.

## Configurer l’accès à YouTube

1. Installez Caption Finder et ouvrez **Compte et réglages**.
2. Sous **Compte du lecteur vidéo**, cliquez sur **1. Sign in to Google**, puis sur **2. Connect YouTube**, et choisissez votre chaîne si on vous le demande. Fermez la fenêtre du compte quand vous avez terminé.
3. Sous **Authentification des téléchargements**, choisissez **Session YouTube de l’app**.

Vous êtes prêt à utiliser Caption Finder.

Pour utiliser plutôt un navigateur dans lequel vous êtes déjà connecté, choisissez-le sous **Authentification des téléchargements**. Sous Windows, fermez ce navigateur avant de lancer une recherche : les navigateurs Chromium verrouillent leur fichier de cookies tant qu’ils tournent ; la session propre à l’application est donc le choix fiable. Sous macOS, il n’est pas nécessaire de fermer le navigateur. N’utilisez que votre propre compte. N’importez ni ne partagez les cookies de quelqu’un d’autre.

Vous pouvez aussi garder **Anonyme**, mais les contrôles anti-robots de YouTube sont plus stricts pour un accès anonyme, et certaines vidéos échoueront.

## Utilisation

**Rechercher dans** choisit le mode.

- **Channels :** saisissez un nom et une liste de chaînes correspondantes apparaît (Entrée l’affiche aussitôt). Cliquez sur l’une d’elles pour l’ajouter. Un lien de chaîne ou un `@handle` est ajouté directement, et un lien de vidéo collé propose la chaîne à laquelle elle appartient. Plusieurs chaînes sont parcourues l’une après l’autre, ou mélangées (une vidéo de chacune à tour de rôle) ; voir Account & Settings.
- **Videos :** collez des liens de vidéos (watch, `youtu.be` ou Shorts), un ou plusieurs. Les vidéos listées sont parcourues dans l’ordre.

Saisissez ensuite une **Phrase recherchée** et appuyez sur **Search**. Les résultats apparaissent au fur et à mesure, les plus récents d’abord, jusqu’à 25 vidéos. Cliquez sur l’un pour l’ouvrir ; chacun affiche la ligne correspondante et le nombre de correspondances de la vidéo.

À droite : le lecteur, la ligne trouvée, une frise chronologique, **Set In / Set Out** avec marge et durée, **Precise Cut**, **Preview selection** et le nom du fichier. Choisissez un dossier de téléchargement et ajoutez la sélection à la file de téléchargement. La file permet la pause, la reprise, l’annulation, la nouvelle tentative et **Afficher le fichier**, qui affiche le fichier terminé dans l’Explorateur de fichiers sous Windows ou dans le Finder sous macOS.

Les **Presets** enregistrent une liste de chaînes ou de vidéos pour la retrouver. **Enregistrer le preset** est désactivé tant que la liste est vide. **Charger un preset** ouvre le dossier des presets pour choisir un fichier. Chaque mode a ses propres presets. Clic droit sur le nom d’un preset : Load, Add to current list, Show in Finder, Rename et Remove from list. Clic droit sur un espace vide : Clear files, Clear presets et Show presets folder. Retirer un preset de la ligne ne supprime jamais son fichier. Sous Windows, **Afficher dans le Finder** garde ce libellé mais ouvre l’Explorateur de fichiers avec le fichier de preset sélectionné, et **Afficher le dossier des presets** ouvre le dossier dans l’Explorateur de fichiers.

### Correspondance

- La casse, la ponctuation et le style d’apostrophe sont ignorés. Une phrase peut s’étendre sur des segments de sous-titres adjacents.
- Les langues sans espaces (chinois, japonais, thaï et similaires) sont comparées caractère par caractère. Les voyelles de l’arabe et de l’hébreu sont ignorées.
- La langue des sous-titres suit l’alphabet de la phrase (une phrase en cyrillique cherche des pistes russes, ukrainiennes et similaires) ou, pour l’alphabet latin, la langue parlée dans chaque vidéo. **Langue des sous-titres** dans les paramètres remplace ce choix, ce qui atteint aussi les pistes audio doublées que certaines chaînes publient.
- **Rechercher dans les sous-titres** limite la recherche aux sous-titres envoyés, aux sous-titres automatiques de YouTube, ou aux deux (envoyés en priorité). Les traductions ne sont jamais utilisées.
- Les limites sont celles des segments de sous-titres, pas un alignement mot à mot.

### Account & Settings

- **Video player account :** **1. Sign in to Google**, **2. Connect YouTube** (choisissez votre chaîne si on vous le demande) et **Check playback** ouvrent une fenêtre de compte distincte pour le lecteur. La connexion est conservée dans le stockage de navigateur propre à l’application. Sur YouTube, un avatar de compte confirme que vous êtes connecté, et son menu de compte permet de changer de compte ou de se déconnecter. Fermez la fenêtre quand vous avez terminé et relancez la recherche pour recharger le lecteur.
- **Download authentication :** d’où les recherches de sous-titres et les téléchargements tirent leur connexion YouTube. Choisissez **Anonyme** (par défaut), **App's YouTube session**, un navigateur que l’application trouve sur cet ordinateur, ou **Importer des cookies Netscape…**. Les cookies ne sont jamais copiés dans les paramètres de l’application.
  - **Windows :** Chrome, Edge, Firefox, Brave, Chromium, Vivaldi et Opera sont détectés.
  - **macOS :** Chrome, Opera, Vivaldi, Firefox, Safari et d’autres sont détectés.
- **Sous Windows :**
  - Fermez complètement le navigateur, y compris ses processus d’arrière-plan, avant de chercher ou de télécharger avec ses cookies. Les navigateurs Chromium (Chrome, Edge, Opera, Brave, Vivaldi, Chromium) verrouillent leur fichier de cookies tant qu’ils tournent. Si l’application indique qu’elle n’a pas pu copier la base de cookies du navigateur, c’est la raison.
  - Le chiffrement des cookies de Chromium sous Windows peut malgré tout empêcher l’extraction, et l’application ne le contourne jamais. Utilisez plutôt **App's YouTube session** ou **Importer des cookies Netscape…**.
  - L’application transmet à yt-dlp le proxy HTTP manuel du système (sans nom d’utilisateur ni mot de passe) et respecte `HTTP_PROXY` et `HTTPS_PROXY`. Un script PAC ou une liste d’exceptions contenant autre chose que des adresses locales n’est pas transmis.
  - Le dossier de téléchargement et un fichier de cookies importé sont enregistrés sous forme de chemins complets. Si une copie portable passe sur une autre lettre de lecteur, choisissez-les à nouveau.
  - Mettre un téléchargement en pause suspend son processus ; une longue pause peut donc amener YouTube à couper la connexion. La pause et la reprise ne survivent pas à un redémarrage de l’application.
  - Il n’y a pas d’Accès complet au disque (Full Disk Access) sous Windows ; la fenêtre d’aide macOS ci-dessous n’apparaît donc jamais.
- **Sous macOS :** les cookies de Chrome et de Firefox nécessitent l’**Accès complet au disque** (Full Disk Access) ; l’application ouvre une petite fenêtre d’aide avec une icône à faire glisser dans les Réglages Système (System Settings).
- **Les noms de fichiers** que Windows ne peut pas enregistrer (noms réservés comme `CON` ou `NUL`, et caractères comme `? * | < >`) sont refusés sur toutes les plateformes, afin qu’un extrait puisse passer de l’une à l’autre.
- **Vidéos à analyser par recherche** (par chaîne, 50 par défaut), **Résultats de plusieurs chaînes**, **Langue des sous-titres**, **Rechercher dans les sous-titres**.
- **Don't play the first found video automatically**, et **Pendant le chargement d’une vidéo** (miniature ou indicateur de chargement).

## Où sont conservées les données

| Quoi | Windows (installation normale) | macOS |
| --- | --- | --- |
| Paramètres (dossier de téléchargement, authentification) | `%APPDATA%\com.mike.captionfinder\settings.json` | `~/Library/Application Support/com.mike.captionfinder/settings.json` |
| Presets | `%APPDATA%\Caption Finder\Presets\Channels` et `...\Videos` | `~/Library/Application Support/Caption Finder/Presets/Channels` et `.../Videos` |
| La connexion YouTube propre à l’application | `%LOCALAPPDATA%\com.mike.captionfinder\EBWebView` | `~/Library/WebKit/com.mike.captionfinder` |

Sous Windows, les caches et le journal des médias (`logs\media.jsonl`, qui ne contient que des codes de diagnostic sans risque) se trouvent aussi dans `%LOCALAPPDATA%\com.mike.captionfinder`. Une copie portable (le ZIP portable, ou l’option **Portable** du programme d’installation) conserve ses paramètres, sa connexion et ses caches dans un dossier `Data` à côté de `Caption Finder.exe`, avec le journal dans `Data\Diagnostics`. Ses presets vont toujours dans `%APPDATA%\Caption Finder\Presets`. Ne déplacez un dossier portable que lorsque l’application est fermée.

Les presets sont volontairement conservés en dehors des dossiers propres à l’application : une réinitialisation ou une réinstallation n’y touche pas. L’application ne supprime ni n’écrase jamais un fichier de preset sans demander ; en remplacer un conserve l’ancienne version à côté sous le nom `<name>.json.bak`.

## Développement et compilation Windows

Les notes de développement (prérequis, compilations pour Windows et macOS, organisation du code) et l’état de la compilation Windows ne figurent que dans le [README en anglais](../../README.md#development).

## Crédits

Caption Finder est né comme un fork de [YouGlish Downloader](https://github.com/MolecularDust/Youglish-Downloader), lui-même un fork de TubeCutter. La file de téléchargement et une grande partie du packaging viennent de ce travail. Les outils tiers (yt-dlp, FFmpeg, Deno et les bibliothèques des applications) conservent leurs propres licences ; voir `LICENSES/` et `docs/DEPENDENCIES.md`. Les builds de FFmpeg utilisés sont sous GPL ; redistribuer l’application implique donc de respecter ces conditions.

Sous licence MIT ; voir `LICENSE`. Les [Conditions d’utilisation](https://www.youtube.com/t/terms) de YouTube et la [Politique de confidentialité de Google](https://policies.google.com/privacy) s’appliquent à ce que vous faites avec le contenu YouTube.
