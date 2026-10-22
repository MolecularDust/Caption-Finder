import { describe, it, expect } from "vitest";
import {
  findSubtitleMatches,
  defaultHeight,
  cleanWidgetCaption,
} from "./subtitles";
describe("subtitle selection", () => {
  it("finds a phrase spanning adjacent cues with punctuation and contractions", () => {
    expect(
      findSubtitleMatches(
        [
          { start: 1, end: 2, text: "I’ll see" },
          { start: 2, end: 3, text: "ya next time." },
        ],
        "I'll see ya",
      ),
    ).toEqual([{ start: 1, end: 3, text: "I'll see ya" }]);
  });
  it("retains two real occurrences and rejects partial words", () => {
    expect(
      findSubtitleMatches(
        [
          { start: 1, end: 2, text: "yard ya" },
          { start: 3, end: 4, text: "ya" },
        ],
        "ya",
      ),
    ).toHaveLength(2);
  });
  it("does not match across a long silence", () => {
    expect(
      findSubtitleMatches(
        [
          { start: 1, end: 2, text: "see" },
          { start: 10, end: 11, text: "ya" },
        ],
        "see ya",
      ),
    ).toEqual([]);
  });
  it("suppresses rolling repeats without losing the phrase start", () => {
    expect(
      findSubtitleMatches(
        [
          { start: 1, end: 4, text: "see ya" },
          { start: 2, end: 5, text: "see ya next time" },
        ],
        "see ya next",
      ),
    ).toEqual([{ start: 1, end: 5, text: "see ya next" }]);
  });
  it("prefers 1080 and falls back downwards", () => {
    expect(defaultHeight([2160, 1080, 720])).toBe("1080");
    expect(defaultHeight([2160, 720, 360])).toBe("720");
  });
});

describe("widget caption decoding", () => {
  it("decodes highlighted, URL-encoded captions", () => {
    expect(cleanWidgetCaption("I%20mean%2C%20%5B%5B%5Bya%5D%5D%5D")).toBe(
      "I mean, ya",
    );
  });
  it("ignores blank end-of-video captions and preserves literal percent signs", () => {
    expect(cleanWidgetCaption("&nbsp;")).toBe("");
    expect(cleanWidgetCaption("100% sure &amp; ready")).toBe(
      "100% sure & ready",
    );
  });
});
