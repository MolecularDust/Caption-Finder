import { describe, expect, it } from "vitest";
import { searchChannel, type SearchDeps, type SearchResult } from "./search";
import { matchLine } from "./subtitles";
import type { Video } from "./domain";

const video = (id: string): Video => ({
  id,
  url: `https://www.youtube.com/watch?v=${id}`,
  title: id,
  channel: "c",
  duration: 100,
  thumbnail: "",
  formats: [],
  subtitles: {},
});
const track = (text: string) => ({
  language: "en",
  kind: "supplied",
  cues: [{ start: 5, end: 8, text }],
});

function deps(
  ids: string[],
  texts: Record<string, string | Error>,
): SearchDeps {
  return {
    list: async (from, count) =>
      ids.slice(from - 1, from - 1 + count).map((id) => ({ id })),
    captions: async (id) => {
      const t = texts[id];
      if (t instanceof Error) throw t;
      return { video: video(id), track: track(t ?? "nothing here") };
    },
  };
}
const run = (d: SearchDeps, phrase: string, limit = 25, batch = 3) => {
  const results: SearchResult[] = [];
  const outcome = searchChannel(d, phrase, {
    limit,
    batch,
    cap: 30,
    concurrency: 2,
    backoffMs: 1,
    signal: new AbortController().signal,
    onResult: (r) => results.push(r),
    onProgress: () => {},
  });
  return { outcome, results };
};

describe("searchChannel", () => {
  const ids = ["a", "b", "c", "d", "e", "f", "g"];
  const texts = { b: "we will visit", d: "we will visit again", f: "we will visit" };

  it("returns matching videos newest first and notes when the channel runs out", async () => {
    const { outcome, results } = run(deps(ids, texts), "we will visit");
    expect(await outcome).toMatchObject({ found: 3, scanned: 7, reason: "exhausted" });
    expect(results.map((r) => r.video.id).sort()).toEqual(["b", "d", "f"]);
    expect(results.find((r) => r.video.id === "d")!.order).toBe(3);
  });

  it("stops at the limit", async () => {
    const { outcome, results } = run(deps(ids, texts), "we will visit", 2);
    expect((await outcome).reason).toBe("limit");
    expect(results).toHaveLength(2);
  });

  it("skips a video that fails and keeps going", async () => {
    const d = deps(ids, { ...texts, a: new Error("No supplied captions") });
    expect(await run(d, "we will visit").outcome).toMatchObject({ found: 3 });
  });

  it("keeps retrying a rate-limited video, then stops if it never clears", async () => {
    const limited = new Error("YouTube rate-limited this request.");
    const d = deps(ids, { ...texts, a: limited });
    const out = await run(d, "we will visit").outcome;
    expect(out.reason).toBe("blocked");
    expect(out.error).toMatch(/rate-limited/);
  });

  it("carries on when a rate limit clears after a pause", async () => {
    const base = deps(ids, texts);
    let failures = 2;
    const d: SearchDeps = {
      ...base,
      captions: async (id) => {
        if (id === "b" && failures-- > 0)
          throw new Error("YouTube rate-limited this request.");
        return base.captions(id);
      },
    };
    expect(await run(d, "we will visit").outcome).toMatchObject({ found: 3, reason: "exhausted" });
  });

  it("stops at once when the browser's cookies can't be read", async () => {
    const d = deps(ids, { ...texts, a: new Error("Browser cookies are unavailable. Check the browser.") });
    expect((await run(d, "we will visit").outcome).reason).toBe("blocked");
  });

  it("stops after several access denials in a row, not one", async () => {
    const denied = new Error("YouTube denied access.");
    expect((await run(deps(ids, { ...texts, c: denied }), "we will visit").outcome).reason).toBe("exhausted");
    const d = deps(ids, { a: denied, b: denied, c: denied });
    expect((await run(d, "we will visit").outcome).reason).toBe("blocked");
  });
});

describe("result ordering", () => {
  it("reports a result as settled only once every earlier video is done", async () => {
    const base = deps(["a", "b", "c"], { b: "we will visit" });
    const events: string[] = [];
    const slow: SearchDeps = {
      ...base,
      captions: async (id) => {
        if (id === "a") await new Promise((r) => setTimeout(r, 30));
        return base.captions(id);
      },
    };
    await searchChannel(slow, "we will visit", {
      limit: 25,
      batch: 3,
      cap: 30,
      concurrency: 3,
      backoffMs: 1,
      signal: new AbortController().signal,
      onResult: (r) => events.push(`result:${r.video.id}`),
      onProgress: () => {},
      onSettled: (n) => events.push(`settled:${n}`),
    });
    // b arrives while a is still running, so it cannot yet be treated as the top result.
    const resultAt = events.indexOf("result:b");
    expect(events.slice(0, resultAt + 1).some((e) => e === "settled:2" || e === "settled:3")).toBe(false);
    expect(events[events.length - 1]).toBe("settled:3");
    const numbers = events.filter((e) => e.startsWith("settled:")).map((e) => Number(e.slice(8)));
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
  });
});

describe("matchLine", () => {
  it("joins the cues spoken during the match", () => {
    const cues = [
      { start: 0, end: 2, text: "before" },
      { start: 2, end: 4, text: "we will\nvisit" },
      { start: 4, end: 6, text: "after" },
    ];
    expect(matchLine(cues, { start: 2, end: 4, text: "" })).toBe("we will visit");
  });
});
