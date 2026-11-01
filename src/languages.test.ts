import { describe, expect, it } from "vitest";
import { captionLanguages } from "./languages";

describe("captionLanguages", () => {
  it("uses the spoken language for Latin text", () => {
    expect(captionLanguages("hello there")).toBe("auto");
    expect(captionLanguages("café")).toBe("auto");
  });
  it("picks languages by script", () => {
    expect(captionLanguages("один").startsWith("ru,uk")).toBe(true);
    expect(captionLanguages("مرحبا")).toBe("ar,fa,ur");
    expect(captionLanguages("हिन्दी")).toBe("hi,mr,ne");
    expect(captionLanguages("北京")).toContain("zh");
  });
  it("treats kana as Japanese", () => {
    expect(captionLanguages("天気ですね")).toBe("ja,zh-Hans,zh-Hant,zh");
  });
  it("lets an explicit choice win", () => {
    expect(captionLanguages("один", "uk")).toBe("uk");
    expect(captionLanguages("hola", "es")).toBe("es");
  });
});
