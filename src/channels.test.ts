import { describe, expect, it } from "vitest";
import { isVideoLink, looksLikeChannel, mergedLister, subscriberText } from "./channels";

const ids = (prefix: string, n: number) =>
  Array.from({ length: n }, (_, i) => ({ id: `${prefix}${i}` }));
const lister = (data: Record<string, { id: string }[]>, calls: string[] = []) =>
  async (source: string, from: number, count: number) => {
    calls.push(`${source}:${from}+${count}`);
    return data[source].slice(from - 1, from - 1 + count);
  };

describe("mergedLister", () => {
  it("reads one channel after another, in the order given", async () => {
    const next = mergedLister(lister({ a: ids("a", 3), b: ids("b", 3) }), ["a", "b"], 10);
    expect((await next(1, 4)).map((e) => e.id)).toEqual(["a0", "a1", "a2", "b0"]);
    expect((await next(5, 10)).map((e) => e.id)).toEqual(["b1", "b2"]);
  });
  it("tags every video with the channel it came from", async () => {
    const next = mergedLister(lister({ a: ids("a", 2), b: ids("b", 2) }), ["a", "b"], 10);
    expect((await next(1, 4)).map((e) => e.source)).toEqual(["a", "a", "b", "b"]);
  });
  it("keeps going with the remaining channel when one runs out", async () => {
    const next = mergedLister(lister({ a: ids("a", 1), b: ids("b", 4) }), ["a", "b"], 10);
    expect((await next(1, 10)).map((e) => e.id)).toEqual(["a0", "b0", "b1", "b2", "b3"]);
  });
  it("takes at most perChannel videos from each channel", async () => {
    const calls: string[] = [];
    const next = mergedLister(lister({ a: ids("a", 99), b: ids("b", 99) }, calls), ["a", "b"], 5, 3);
    const all = await next(1, 100);
    expect(all).toHaveLength(10);
    expect(calls).toEqual(["a:1+3", "a:4+2", "b:1+3", "b:4+2"]);
  });
  it("skips a channel that fails, but throws when all fail", async () => {
    const some = mergedLister(
      async (s, f, c) => {
        if (s === "bad") throw new Error("nope");
        return ids("a", 2).slice(f - 1, f - 1 + c);
      },
      ["bad", "a"],
      5,
    );
    expect((await some(1, 10)).map((e) => e.id)).toEqual(["a0", "a1"]);
    const all = mergedLister(async () => { throw new Error("nope"); }, ["x", "y"], 5);
    await expect(all(1, 10)).rejects.toThrow("nope");
  });
});

describe("mixed channels", () => {
  it("takes one video from each channel in turn", async () => {
    const next = mergedLister(lister({ a: ids("a", 3), b: ids("b", 3) }), ["a", "b"], 10, 30, true);
    expect((await next(1, 4)).map((e) => e.id)).toEqual(["a0", "b0", "a1", "b1"]);
    expect((await next(5, 10)).map((e) => e.id)).toEqual(["a2", "b2"]);
  });
  it("carries on with the longer channel when the other runs out", async () => {
    const next = mergedLister(lister({ a: ids("a", 1), b: ids("b", 3) }), ["a", "b"], 10, 30, true);
    expect((await next(1, 10)).map((e) => e.id)).toEqual(["a0", "b0", "b1", "b2"]);
  });
});

describe("channel text", () => {
  it("tells links and handles from names", () => {
    expect(looksLikeChannel("@TED")).toBe(true);
    expect(looksLikeChannel("https://www.youtube.com/@TED/videos")).toBe(true);
    expect(looksLikeChannel("UCAuUUnT6oDeKwE6v1NGQxug")).toBe(true);
    expect(looksLikeChannel("ted talks")).toBe(false);
  });
  it("recognises video links, which are not channel links", () => {
    for (const link of [
      "https://www.youtube.com/watch?v=SDSzIs9K_Sg",
      "https://youtube.com/watch?feature=share&v=SDSzIs9K_Sg&t=5s",
      "https://m.youtube.com/watch?v=SDSzIs9K_Sg",
      "https://youtu.be/SDSzIs9K_Sg?t=10",
      "https://www.youtube.com/shorts/SDSzIs9K_Sg",
    ]) {
      expect(isVideoLink(link)).toBe(true);
      expect(looksLikeChannel(link)).toBe(false);
    }
    expect(isVideoLink("https://www.youtube.com/@TED/videos")).toBe(false);
    expect(isVideoLink("https://www.youtube.com/watch?v=short")).toBe(false);
    expect(looksLikeChannel("https://www.youtube.com/@TED/videos")).toBe(true);
  });
  it("shortens subscriber counts", () => {
    expect(subscriberText(27900000)).toBe("27.9M");
    expect(subscriberText(16200)).toBe("16.2K");
    expect(subscriberText(undefined)).toBe("");
  });
});
