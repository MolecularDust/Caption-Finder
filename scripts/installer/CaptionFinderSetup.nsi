; Setup wrapper offering a regular per-user install or a portable copy.
; Built by scripts/package-windows-installer.mjs, which passes PAYLOAD, OUTFILE, ICON and VERSION.
; Adapted from the YouGlish Downloader setup, with a few changes: regular installs always use the
; fixed folder (so the uninstaller can only ever remove its own folder), portable copies default to
; a folder beside the setup file, and a populated portable target gets its own subfolder.
Unicode true
!include "MUI2.nsh"
!include "FileFunc.nsh"
!include "LogicLib.nsh"
!include "nsDialogs.nsh"

!ifndef PAYLOAD
  !error "Pass /DPAYLOAD=<folder> to makensis"
!endif
!ifndef OUTFILE
  !error "Pass /DOUTFILE=<installer path> to makensis"
!endif
!ifndef ICON
  !error "Pass /DICON=<icon.ico> to makensis"
!endif
!ifndef VERSION
  !define VERSION "0.1.0"
!endif

!define APPNAME "Caption Finder"
!define EXE "Caption Finder.exe"
!define UNINSTALL_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}"
!define DEFAULT_INSTDIR "$LOCALAPPDATA\Programs\${APPNAME}"

Name "${APPNAME} ${VERSION}"
OutFile "${OUTFILE}"
Icon "${ICON}"
UninstallIcon "${ICON}"
InstallDir "${DEFAULT_INSTDIR}"
RequestExecutionLevel user
SetCompressor /SOLID lzma

!define MUI_ICON "${ICON}"
!define MUI_UNICON "${ICON}"
!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_RUN "$INSTDIR\${EXE}"

Var Mode
Var RadioInstall
Var RadioPortable

!insertmacro MUI_PAGE_WELCOME
Page custom ModePage ModePageLeave
!define MUI_PAGE_CUSTOMFUNCTION_PRE DirectoryPre
!define MUI_PAGE_CUSTOMFUNCTION_LEAVE DirectoryLeave
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

Function .onInit
  StrCpy $Mode "install"
  ; Silent switches for scripted installs:
  ;   /S                          regular install (always into the fixed per-user folder)
  ;   /S /PORTABLE=1 [/D=<folder>] portable copy; the folder is used exactly as given
  ${GetParameters} $0
  ClearErrors
  ${GetOptions} $0 "/PORTABLE=" $1
  ${If} ${Errors}
    ; A regular install ignores /D=, so the uninstaller's folder removal is always safe.
    StrCpy $INSTDIR "${DEFAULT_INSTDIR}"
  ${Else}
    StrCpy $Mode "portable"
    ; Keep a /D= folder if one was given; otherwise default to a folder beside this setup file.
    ${If} $INSTDIR == "${DEFAULT_INSTDIR}"
      StrCpy $INSTDIR "$EXEDIR\${APPNAME} Portable"
    ${EndIf}
  ${EndIf}
FunctionEnd

Function ModePage
  nsDialogs::Create 1018
  Pop $0
  ${If} $0 == error
    Abort
  ${EndIf}

  ${NSD_CreateLabel} 0 0 100% 24u "Choose how to set up ${APPNAME} on this computer."
  Pop $0

  ${NSD_CreateRadioButton} 0 26u 100% 26u "Install normally: Start menu shortcut and an entry in Apps & features. No administrator rights needed."
  Pop $RadioInstall

  ${NSD_CreateRadioButton} 0 62u 100% 26u "Portable: copy the program into a folder you choose, for example on a USB drive. Nothing is added to the Start menu or the registry."
  Pop $RadioPortable

  ${If} $Mode == "portable"
    ${NSD_Check} $RadioPortable
  ${Else}
    ${NSD_Check} $RadioInstall
  ${EndIf}

  nsDialogs::Show
FunctionEnd

Function ModePageLeave
  ${NSD_GetState} $RadioPortable $0
  ${If} $0 == ${BST_CHECKED}
    StrCpy $Mode "portable"
    StrCpy $INSTDIR "$EXEDIR\${APPNAME} Portable"
  ${Else}
    StrCpy $Mode "install"
    StrCpy $INSTDIR "${DEFAULT_INSTDIR}"
  ${EndIf}
FunctionEnd

; The folder page only applies to portable copies; a regular install uses the fixed location.
Function DirectoryPre
  ${If} $Mode == "install"
    Abort
  ${EndIf}
FunctionEnd

; A portable copy puts the program files directly into the chosen folder. If that folder already
; holds other files (a drive root, Desktop, ...), use a new subfolder instead of scattering them.
Function DirectoryLeave
  ${If} $Mode == "portable"
    ${DirState} "$INSTDIR" $0
    ${If} $0 == 1
    ${AndIfNot} ${FileExists} "$INSTDIR\${EXE}"
      StrCpy $1 $INSTDIR 1 -1
      ${If} $1 == "\"
        StrCpy $INSTDIR "$INSTDIR${APPNAME}"
      ${Else}
        StrCpy $INSTDIR "$INSTDIR\${APPNAME}"
      ${EndIf}
      MessageBox MB_OK|MB_ICONINFORMATION "That folder already contains other files, so ${APPNAME} will be copied into a new folder inside it:$\r$\n$\r$\n$INSTDIR"
    ${EndIf}
  ${EndIf}
FunctionEnd

; A running copy locks its program files, so they can't be replaced. Ask the user to close it first.
Function WaitForAppClosed
retry:
  ; nsExec returns 0 when tasklist finds the running program.
  nsExec::Exec 'cmd /c tasklist /FI "IMAGENAME eq ${EXE}" /NH | find /I "${EXE}" >nul'
  Pop $0
  ${If} $0 != 0
    Return
  ${EndIf}
  IfSilent fail
  MessageBox MB_RETRYCANCEL|MB_ICONEXCLAMATION "${APPNAME} is running. Close it, then click Retry to continue installing." IDRETRY retry
fail:
  Abort "${APPNAME} is still running. Close it and run this setup again."
FunctionEnd

Section "Install"
  Call WaitForAppClosed
  SetOutPath "$INSTDIR"
  SetOverwrite on
  File /r "${PAYLOAD}\*.*"

  ${If} $Mode == "install"
    WriteUninstaller "$INSTDIR\uninstall.exe"
    CreateShortCut "$SMPROGRAMS\${APPNAME}.lnk" "$INSTDIR\${EXE}"
    WriteRegStr HKCU "${UNINSTALL_KEY}" "DisplayName" "${APPNAME}"
    WriteRegStr HKCU "${UNINSTALL_KEY}" "DisplayVersion" "${VERSION}"
    WriteRegStr HKCU "${UNINSTALL_KEY}" "InstallLocation" "$INSTDIR"
    WriteRegStr HKCU "${UNINSTALL_KEY}" "DisplayIcon" "$INSTDIR\${EXE}"
    WriteRegStr HKCU "${UNINSTALL_KEY}" "UninstallString" '"$INSTDIR\uninstall.exe"'
    WriteRegDWORD HKCU "${UNINSTALL_KEY}" "NoModify" 1
    WriteRegDWORD HKCU "${UNINSTALL_KEY}" "NoRepair" 1
  ${Else}
    ; Portable copies keep settings, WebView2 data and caches beside the program.
    FileOpen $0 "$INSTDIR\portable.marker" w
    FileWrite $0 "Caption Finder portable data mode v1$\r$\n"
    FileClose $0
  ${EndIf}
SectionEnd

; Removes the program and its shortcut and registry entry. Settings, sign-in data and caches that
; the app keeps in the user's profile are left alone.
Section "Uninstall"
  Delete "$SMPROGRAMS\${APPNAME}.lnk"
  RMDir /r "$INSTDIR"
  DeleteRegKey HKCU "${UNINSTALL_KEY}"
SectionEnd
