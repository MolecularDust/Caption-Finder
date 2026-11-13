# Localizing the app

Caption Finder's interface comes in the same 20 languages as the README: English plus Arabic, Bengali, Chinese (Simplified), Filipino, French, German, Hindi, Indonesian, Italian, Japanese, Korean, Persian, Portuguese (Brazil), Russian, Spanish, Telugu, Thai, Turkish and Vietnamese. The language follows the system by default; **Account & Settings → Language** overrides it and remembers the choice (`cf.language` in the browser storage).

The translations were written by an AI and have not been reviewed by native speakers. Corrections are welcome as pull requests.

## How it works

- The English text of a message **is its key**. Code calls `t("Save")`, `t("{count, plural, one {# match} other {# matches}}", { count })`, or `tx(...)` when the text wraps other elements. There are no message ids to keep in sync.
- `src/locales/<code>.json` maps each English message to its translation. English needs no file. A language's file is loaded only when that language is in use.
- Messages use a small ICU subset: named values `{name}` and `{n, plural, one {…} other {…}}` with `#` for the number. Give a plural every form the language uses (the checker lists them): for example Russian `one`/`few`/`many`/`other`, Arabic `zero`/`one`/`two`/`few`/`many`/`other`, Japanese only `other`. A translation may use a plural on a value the English writes as plain `{name}`.
- Messages that come from the Rust side are plain English strings. `src/i18n/backend.json` lists the ones a person can see and act on, spelled exactly as Rust spells them (with `{name}` where Rust formats a value). `tb()` translates a message by exact match or by matching it against these templates, so Rust needs no change. A Rust message that is not in the list shows in English.
- Arabic and Persian set `dir="rtl"` on the page; the layout uses logical CSS properties (`margin-inline-start` and so on) so it mirrors itself. The timeline stays left-to-right, since time runs that way. Digits are always Latin (`-u-nu-latn`).
- Caption-language names (the language drop-down) come from `Intl.DisplayNames`, so they are translated without an entry here.

## Commands

```bash
node scripts/i18n.mjs check        # every locale against the code: missing, unused, empty, wrong values or plural forms
node scripts/i18n.mjs keys         # print every message the app can show
node scripts/i18n.mjs stub <code>  # write src/locales/<code>.json with every message, untranslated
```

`npm test` also runs the same consistency checks (`src/i18n.test.ts`). To see a language without changing your settings, open the dev server with `?lang=<code>`, for example `http://127.0.0.1:1420/?lang=ar`.

## Changing text

1. Wrap new user-visible text in `t()` / `tx()`. Use a literal string: the checker reads keys from the source, so a key built from variables is reported.
2. Run `node scripts/i18n.mjs check`; it lists what is missing in each language. Add the translations (or ask for them in the PR).
3. If you change an English message, its key changes: update it in every `src/locales/*.json` (the checker lists the old key as unused and the new one as missing).
4. A new Rust message a person should see: add it to `src/i18n/backend.json` and the locales. The checker verifies that every `backend.json` entry still exists in `src-tauri/src`.

## Adding a language

1. Add it to `LANGUAGES` and `PLURAL_CATEGORIES` in `src/i18n/languages.ts` (set `rtl: true` for a right-to-left script) and, for a script the default font may not cover, a `:lang(xx)` font stack at the end of `src/style.css`.
2. `node scripts/i18n.mjs stub <code>`, translate the file, run `check`.
3. Add the language to the README's language list (`scripts/readme-languages.mjs`).

## Not translated yet

Window and dialog titles that Rust creates, the installer, and a few developer-facing error messages are still English.
