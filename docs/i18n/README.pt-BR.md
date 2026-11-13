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
    <td align="center"><b>Português (Brasil)</b></td>
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

> Esta tradução foi escrita por uma IA e não foi revisada por falantes nativos. O app também está disponível neste idioma, e os nomes dos botões e dos menus aparecem aqui como o app os mostra (o idioma se muda em Account & Settings → Language). Em caso de dúvida, o [README em inglês](../../README.md) é a referência.

Encontre o momento em que uma frase é dita em vídeos do YouTube, escolha o trecho de que gostou e baixe o clipe recortado.

Digite uma frase, aponte o app para um canal, vários canais ou uma lista de vídeos, e ele examina as legendas. Os resultados preenchem uma lista à esquerda. Escolha um e o vídeo é carregado à direita, com pontos de entrada e saída já definidos em torno da fala. Ajuste-os, veja uma prévia e baixe apenas essa parte.

<p align="center">
  <img src="../screenshot.webp" alt="Caption Finder listando os vídeos que correspondem à frase “download”, com o vídeo selecionado e seus trechos de legenda correspondentes" width="420">
</p>

> Baixe apenas conteúdo que seja seu ou que você tenha permissão para baixar.

## Instalação (Windows)

Baixe o instalador na [página de versões](https://github.com/MolecularDust/Caption-Finder/releases): `Caption-Finder-Setup_<version>_x64.exe`. Ele exige o Windows 11 em um PC x64. O componente WebView2 que o app usa já vem incluído no Windows 11.

1. Feche o Caption Finder, se ele estiver em execução.
2. Dê um clique duplo no instalador. O Windows pode avisar que o app é de um editor desconhecido, porque ele não é assinado. Clique em **Mais informações** (More info) e depois em **Executar assim mesmo** (Run anyway).
3. Escolha uma opção:
   - **Install normally:** instala para a sua conta de usuário, sem direitos de administrador. Adiciona um atalho no menu Iniciar e uma entrada na lista de aplicativos instalados (Apps & features).
   - **Portable:** copia o app para uma pasta que você escolher, por exemplo um pen drive. Nada é adicionado ao menu Iniciar nem ao registro, e as configurações ficam em uma pasta `Data` ao lado do app.
4. Clique em **Install** e depois em **Finish**.

Para desinstalar uma instalação normal, use a lista de aplicativos instalados (Apps & features). Suas configurações e seus dados de login permanecem no seu perfil de usuário.

Você também pode baixar `Caption-Finder-Windows-Portable.zip` na mesma página. Extraia primeiro todo o ZIP para uma pasta e depois execute `Caption Finder.exe`. Não o execute de dentro do ZIP.

## Instalação (macOS)

Baixe `Caption-Finder-Installer.dmg` na [versão mais recente](https://github.com/MolecularDust/Caption-Finder/releases) e abra-o. A janela mostra os passos:

1. Dê um clique duplo em **Install Caption Finder**.
2. O macOS o interrompe (“não pode ser aberto”). Clique em **Concluído** (Done).
3. Dê um clique duplo no bloco azul **Open System Settings**, role até o fim de **Privacidade e Segurança** (Privacy & Security) nos **Ajustes do Sistema** (System Settings) e clique em **Abrir Mesmo Assim** (Open Anyway).
4. Confirme com a sua senha e depois clique em **Continuar** (Continue) e **Instalar** (Install).

O app é assinado ad hoc e não é notarizado, então o macOS bloqueia o instalador uma vez. Um app colocado pelo instalador não é marcado como baixado, de modo que o próprio Caption Finder abre sem bloqueio. Requer macOS 11 ou mais recente em Apple silicon.

## Configurar o acesso ao YouTube

1. Instale o Caption Finder e abra **Conta e ajustes**.
2. Em **Conta do player de vídeo**, clique em **1. Entrar no Google** e depois em **2. Conectar o YouTube**, e escolha o seu canal, se for solicitado. Feche a janela da conta quando terminar.
3. Em **Autenticação dos downloads**, escolha **Sessão do YouTube do app**.

Pronto, você já pode usar o Caption Finder.

Para usar, em vez disso, um navegador no qual você já está conectado, escolha-o em **Autenticação dos downloads**. No Windows, feche esse navegador antes de pesquisar: os navegadores Chromium bloqueiam o arquivo de cookies enquanto estão em execução, então a sessão própria do app é a opção confiável. No macOS, não é preciso fechar o navegador. Use apenas a sua própria conta. Não importe nem compartilhe os cookies de outra pessoa.

Você também pode manter **Anônimo**, mas as verificações antirrobô do YouTube são mais rígidas para acesso anônimo, e alguns vídeos vão falhar.

## Como usar

**Pesquisar em** escolhe o modo.

- **Canais:** digite um nome e uma lista de canais correspondentes aparece (Enter a mostra na hora). Clique em um para adicioná-lo. Um link de canal ou um `@handle` é adicionado diretamente, e um link de vídeo colado sugere o canal a que ele pertence. Vários canais são pesquisados um após o outro, ou misturados (um vídeo de cada, em sequência); veja Account & Settings.
- **Vídeos:** cole links de vídeos (watch, `youtu.be` ou Shorts), um ou vários. Os vídeos da lista são pesquisados em ordem.

Depois digite uma **Frase da pesquisa** e pressione **Pesquisar**. Os resultados aparecem conforme são encontrados, os mais recentes primeiro, até 25 vídeos. Clique em um para abri-lo; cada um mostra a linha correspondente e quantas ocorrências o vídeo tem.

À direita: o player, a linha encontrada, uma linha do tempo, **Definir início / Definir fim** com margem e duração, **Precise Cut**, **Pré-visualizar seleção** e o nome do arquivo. Escolha uma pasta de download e adicione a seleção à fila de downloads. A fila permite pausar, retomar, cancelar, tentar de novo e **Mostrar arquivo**, que mostra o arquivo concluído no Explorador de Arquivos no Windows ou no Finder no macOS.

Os **Predefinições** guardam uma lista de canais ou vídeos para você trazê-la de volta. **Salvar predefinição** fica desativado até a lista ter algo. **Carregar predefinição** abre a pasta de presets para escolher um arquivo. Cada modo tem seus próprios presets. Clique com o botão direito no nome de um preset: Load, Add to current list, Show in Finder, Rename e Remove from list. Clique com o botão direito em um espaço vazio: Clear files, Clear presets e Show presets folder. Remover um preset da linha nunca apaga o arquivo dele. No Windows, **Mostrar no Finder** mantém esse rótulo, mas abre o Explorador de Arquivos com o arquivo do preset selecionado, e **Mostrar a pasta de predefinições** abre a pasta no Explorador de Arquivos.

### Correspondência

- Maiúsculas e minúsculas, pontuação e o estilo do apóstrofo são ignorados. Uma frase pode abranger trechos de legenda vizinhos.
- Idiomas sem espaços (chinês, japonês, tailandês e semelhantes) são comparados caractere por caractere. As vogais do árabe e do hebraico são ignoradas.
- O idioma da legenda segue o alfabeto da frase (uma frase em cirílico procura faixas em russo, ucraniano e semelhantes) ou, para letras latinas, o idioma falado em cada vídeo. **Idioma das legendas** nas configurações substitui isso, o que também alcança as faixas de áudio dubladas que alguns canais publicam.
- **Pesquisar nas legendas** limita a pesquisa às legendas enviadas, às legendas automáticas do YouTube ou a qualquer uma das duas (com preferência pelas enviadas). Traduções nunca são usadas.
- Os limites são os dos trechos de legenda, não um alinhamento palavra por palavra.

### Account & Settings

- **Conta do player de vídeo:** **1. Entrar no Google**, **2. Conectar o YouTube** (escolha o seu canal, se for solicitado) e **Verificar a reprodução** abrem uma janela de conta separada para o player. O login fica guardado no armazenamento de navegador do próprio app. No YouTube, um avatar da conta confirma que você está conectado, e o menu da conta troca de conta ou sai. Feche a janela quando terminar e pesquise de novo para recarregar o player.
- **Autenticação dos downloads:** de onde as consultas de legenda e os downloads obtêm o login do YouTube. Escolha **Anônimo** (o padrão), **Sessão do YouTube do app**, um navegador que o app encontre neste computador ou **Importar cookies Netscape…**. Os cookies nunca são copiados para as configurações do app.
  - **Windows:** Chrome, Edge, Firefox, Brave, Chromium, Vivaldi e Opera são detectados.
  - **macOS:** Chrome, Opera, Vivaldi, Firefox, Safari e outros são detectados.
- **No Windows:**
  - Feche o navegador por completo, inclusive os processos em segundo plano, antes de pesquisar ou baixar com os cookies dele. Os navegadores Chromium (Chrome, Edge, Opera, Brave, Vivaldi, Chromium) bloqueiam o arquivo de cookies enquanto estão em execução. Se o app disser que não conseguiu copiar o banco de dados de cookies do navegador, é por isso.
  - A criptografia de cookies do Chromium no Windows ainda pode impedir a extração, e o app nunca a contorna. Use **Sessão do YouTube do app** ou **Importar cookies Netscape…** no lugar.
  - O app repassa ao yt-dlp o proxy HTTP manual do sistema (sem nome de usuário nem senha) e respeita `HTTP_PROXY` e `HTTPS_PROXY`. Um script PAC ou uma lista de exceções com entradas que não sejam endereços locais não é repassado.
  - A pasta de download e um arquivo de cookies importado são guardados como caminhos completos. Se uma cópia portátil for para outra letra de unidade, escolha-os de novo.
  - Pausar um download suspende o processo dele, então uma pausa longa pode fazer o YouTube derrubar a conexão. Pausar e retomar não sobrevivem a uma reinicialização do app.
  - Não existe Acesso Total ao Disco (Full Disk Access) no Windows, então a janela de ajuda do macOS mostrada abaixo nunca aparece.
- **No macOS:** os cookies do Chrome e do Firefox precisam do **Acesso Total ao Disco** (Full Disk Access); o app abre uma pequena janela de ajuda com um ícone para arrastar para os Ajustes do Sistema (System Settings).
- **Nomes de arquivo** que o Windows não consegue salvar (nomes reservados como `CON` ou `NUL`, e caracteres como `? * | < >`) são rejeitados em todas as plataformas, para que um clipe possa ir de uma para a outra.
- **Vídeos a verificar por pesquisa** (por canal, padrão 50), **Resultados de vários canais**, **Idioma das legendas**, **Pesquisar nas legendas**.
- **Não reproduzir automaticamente o primeiro vídeo encontrado** e **Enquanto um vídeo carrega** (miniatura ou indicador de carregamento).

## Onde as coisas ficam guardadas

| O quê | Windows (instalação normal) | macOS |
| --- | --- | --- |
| Configurações (pasta de download, autenticação) | `%APPDATA%\com.mike.captionfinder\settings.json` | `~/Library/Application Support/com.mike.captionfinder/settings.json` |
| Presets | `%APPDATA%\Caption Finder\Presets\Channels` e `...\Videos` | `~/Library/Application Support/Caption Finder/Presets/Channels` e `.../Videos` |
| O login do YouTube do próprio app | `%LOCALAPPDATA%\com.mike.captionfinder\EBWebView` | `~/Library/WebKit/com.mike.captionfinder` |

No Windows, os caches e o log de mídia (`logs\media.jsonl`, que contém apenas códigos de diagnóstico seguros) também ficam em `%LOCALAPPDATA%\com.mike.captionfinder`. Uma cópia portátil (o ZIP portátil ou a opção **Portable** do instalador) guarda as configurações, o login e os caches em uma pasta `Data` ao lado de `Caption Finder.exe`, com o log em `Data\Diagnostics`. Os presets dela continuam indo para `%APPDATA%\Caption Finder\Presets`. Mova uma pasta portátil somente com o app fechado.

Os presets ficam fora das pastas do próprio app de propósito: uma redefinição ou uma reinstalação não mexe neles. O app nunca apaga nem sobrescreve um arquivo de preset sem perguntar; ao substituir um, a versão antiga é mantida ao lado como `<name>.json.bak`.

## Desenvolvimento e build para Windows

As notas de desenvolvimento (pré-requisitos, builds para Windows e macOS, organização do código) e o estado do build para Windows estão apenas no [README em inglês](../../README.md#development).

## Créditos

O Caption Finder nasceu como um fork do [YouGlish Downloader](https://github.com/MolecularDust/Youglish-Downloader), que por sua vez é um fork do TubeCutter. A fila de downloads e boa parte do empacotamento vêm desse trabalho. As ferramentas de terceiros (yt-dlp, FFmpeg, Deno e as bibliotecas dos apps) mantêm suas próprias licenças; veja `LICENSES/` e `docs/DEPENDENCIES.md`. Os builds do FFmpeg usados são GPL, então redistribuir o app significa seguir esses termos.

Licenciado sob a Licença MIT; veja `LICENSE`. Os [Termos de Serviço](https://www.youtube.com/t/terms) do YouTube e a [Política de Privacidade do Google](https://policies.google.com/privacy) se aplicam ao que você faz com o conteúdo do YouTube.
