// Caption languages to try, in order, for each script a search phrase is written in. Latin
// text maps to nothing: the video's own spoken language is used.
const SCRIPTS: [RegExp, string[]][] = [
  [/\p{Script=Cyrillic}/u, ["ru", "uk", "be", "bg", "sr", "mk", "kk", "ky", "mn"]],
  [/\p{Script=Arabic}/u, ["ar", "fa", "ur"]],
  [/\p{Script=Hebrew}/u, ["iw", "he"]],
  [/[\p{Script=Hiragana}\p{Script=Katakana}]/u, ["ja"]],
  [/\p{Script=Han}/u, ["zh-Hans", "zh-Hant", "zh", "ja"]],
  [/\p{Script=Hangul}/u, ["ko"]],
  [/\p{Script=Thai}/u, ["th"]],
  [/\p{Script=Devanagari}/u, ["hi", "mr", "ne"]],
  [/\p{Script=Bengali}/u, ["bn"]],
  [/\p{Script=Tamil}/u, ["ta"]],
  [/\p{Script=Telugu}/u, ["te"]],
  [/\p{Script=Malayalam}/u, ["ml"]],
  [/\p{Script=Gurmukhi}/u, ["pa"]],
  [/\p{Script=Gujarati}/u, ["gu"]],
  [/\p{Script=Kannada}/u, ["kn"]],
  [/\p{Script=Greek}/u, ["el"]],
  [/\p{Script=Armenian}/u, ["hy"]],
  [/\p{Script=Georgian}/u, ["ka"]],
];

/** Choices for the "Caption language" setting. */
export const LANGUAGE_CHOICES: [string, string][] = [
  ["en", "English"],
  ["es", "Spanish"],
  ["fr", "French"],
  ["de", "German"],
  ["pt", "Portuguese"],
  ["it", "Italian"],
  ["nl", "Dutch"],
  ["pl", "Polish"],
  ["tr", "Turkish"],
  ["id", "Indonesian"],
  ["vi", "Vietnamese"],
  ["ru", "Russian"],
  ["uk", "Ukrainian"],
  ["ar", "Arabic"],
  ["hi", "Hindi"],
  ["zh-Hans,zh-Hant,zh", "Chinese"],
  ["ja", "Japanese"],
  ["ko", "Korean"],
];

/**
 * The caption language(s) to look for, as the backend expects them: "auto" (the language each
 * video is spoken in) or a comma-separated list in order of preference. An explicit choice
 * wins; otherwise the script of the phrase decides.
 */
export function captionLanguages(phrase: string, choice = "auto"): string {
  if (choice && choice !== "auto") return choice;
  const found: string[] = [];
  for (const [script, codes] of SCRIPTS)
    if (script.test(phrase)) for (const c of codes) if (!found.includes(c)) found.push(c);
  return found.length ? found.join(",") : "auto";
}
