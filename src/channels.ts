import type { ChannelEntry } from "./search";

export type ChannelChoice = {
  /** What yt-dlp is given: a channel link, @handle or UC id (or a video link in video mode). */
  source: string;
  title: string;
  subscribers?: number;
  thumbnail?: string;
  /** Video mode: the channel the video is on, and its length in seconds. */
  channel?: string;
  duration?: number;
  /** Video mode: the title and channel are still being looked up. */
  loading?: boolean;
};

export type SearchMode = "channels" | "videos";

export type ChannelPreset = {
  name: string;
  channels: ChannelChoice[];
  /** The preset's file name (without .json): how the backend finds it. */
  file?: string;
};

export type ChannelSuggestion = {
  id: string;
  title: string;
  handle?: string;
  subscribers?: number;
  thumbnail?: string;
};

/** A link to one video (watch, shorts or youtu.be), whose channel can be looked up. */
export const isVideoLink = (text: string) =>
  /^(https?:\/\/)?((www|m)\.)?(youtube\.com\/(watch\?([^#]*&)?v=|shorts\/)|youtu\.be\/)[\w-]{11}/i.test(
    text.trim(),
  );

/** Every video link in the text (links may be separated by spaces, commas or lines), once each. */
export function parseVideoLinks(text: string): { id: string; source: string }[] {
  const found = new Map<string, string>();
  const pattern =
    /(?:https?:\/\/)?(?:(?:www|m)\.)?(?:youtube\.com\/(?:watch\?(?:[^\s#]*&)?v=|shorts\/)|youtu\.be\/)([\w-]{11})/gi;
  for (const m of text.matchAll(pattern))
    if (!found.has(m[1])) found.set(m[1], `https://www.youtube.com/watch?v=${m[1]}`);
  return [...found].map(([id, source]) => ({ id, source }));
}

/** The videos themselves as a stream, in the order given, for searching a fixed list. */
export function videoLister(videos: { id: string; source: string }[]) {
  return async (from: number, count: number): Promise<ChannelEntry[]> =>
    videos.slice(from - 1, from - 1 + count).map((v) => ({ id: v.id, source: v.source }));
}

/** True for text that names one channel directly rather than something to look up. */
export const looksLikeChannel = (text: string) =>
  !isVideoLink(text) &&
  /^(https?:\/\/|www\.|youtube\.com|@|UC[\w-]{22}$)/i.test(text.trim());

export const subscriberText = (n?: number) => {
  if (!n) return "";
  if (n >= 1e6) return `${+(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${+(n / 1e3).toFixed(1)}K`;
  return String(n);
};

/**
 * One stream of videos from several channels. By default it reads one channel after another
 * in the order given; with `mix` it takes one video from each channel in turn, then the next
 * from each, and so on. Each channel contributes at most `perChannel` of its newest videos.
 * Pages are fetched lazily; callers must read the stream in order (as searchChannel does).
 */
export function mergedLister(
  list: (source: string, from: number, count: number) => Promise<ChannelEntry[]>,
  sources: string[],
  perChannel: number,
  pageSize = 30,
  mix = false,
) {
  const queues = sources.map(() => [] as ChannelEntry[]);
  const fetched = sources.map(() => 0);
  const done = sources.map(() => false);
  const failures: unknown[] = [];
  let turn = 0;
  const refill = async (i: number) => {
    const count = Math.min(pageSize, perChannel - fetched[i]);
    if (count <= 0) {
      done[i] = true;
      return;
    }
    try {
      const page = await list(sources[i], fetched[i] + 1, count);
      fetched[i] += count;
      queues[i].push(...page.map((e) => ({ ...e, source: sources[i] })));
      if (page.length < count) done[i] = true;
    } catch (e) {
      done[i] = true;
      // A single bad channel shouldn't stop the others; the failure is raised only if
      // every channel fails.
      failures.push(e);
    }
  };
  return async (_from: number, count: number): Promise<ChannelEntry[]> => {
    const out: ChannelEntry[] = [];
    while (out.length < count) {
      const live = queues.map((_, k) => k).filter((k) => queues[k].length || !done[k]);
      if (!live.length) break;
      const i = mix ? live[turn++ % live.length] : live[0];
      if (!queues[i].length) await refill(i);
      const next = queues[i].shift();
      if (next) out.push(next);
    }
    if (!out.length && failures.length === sources.length) throw failures[0];
    return out;
  };
}
