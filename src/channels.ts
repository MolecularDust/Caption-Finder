import type { ChannelEntry } from "./search";

export type ChannelChoice = {
  /** What yt-dlp is given: a channel link, @handle or UC id. */
  source: string;
  title: string;
  subscribers?: number;
  thumbnail?: string;
};

export type ChannelPreset = { name: string; channels: ChannelChoice[] };

export type ChannelSuggestion = {
  id: string;
  title: string;
  handle?: string;
  subscribers?: number;
  thumbnail?: string;
};

/** True for text that names one channel directly rather than something to look up. */
export const looksLikeChannel = (text: string) =>
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
