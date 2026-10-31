import { describe, it, expect } from "vitest";
import { safeFileName, fileNameNeedsFix } from "./domain";

describe("portable file names", () => {
  it("removes incompatible characters and preserves readable Unicode", () => {
    expect(safeFileName('Who: café / tea? <yes> | "no"*\\')).toBe(
      "Who café  tea yes  no",
    );
    expect(safeFileName("hello\nworld\u007f")).toBe("helloworld");
    expect(fileNameNeedsFix("Who: café?")).toBe(true);
    expect(fileNameNeedsFix("café hello.mp4")).toBe(false);
  });
  it("handles empty names, reserved Windows names, trailing dots, and UTF-8 limits", () => {
    for (const name of ["", "...", "/?:*"])
      expect(safeFileName(name)).toBe("Speech sample");
    expect(safeFileName("CON.txt")).toBe("_CON.txt");
    expect(safeFileName("clip. ")).toBe("clip");
    const name = safeFileName("🙂".repeat(100));
    expect(new TextEncoder().encode(name).length).toBeLessThanOrEqual(180);
    expect(name).not.toContain("\ufffd");
    expect(fileNameNeedsFix("a".repeat(181))).toBe(true);
  });
});
