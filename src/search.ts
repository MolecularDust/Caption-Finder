import type { Video } from "./domain";
import {
  findSubtitleMatches,
  matchLine,
  type CaptionTrack,
  type Match,
} from "./subtitles";

export type ChannelEntry = { id: string; title?: string; duration?: number };
export type SearchResult = {
  /** position in the channel's newest-first list */
  order: number;
  video: Video;
  track: CaptionTrack;
  matches: Match[];
  /** caption text around the first match */
  line: string;
};
export type SearchEnd = "limit" | "exhausted" | "cap" | "cancelled" | "blocked";
export type SearchDeps = {
  list(from: number, count: number): Promise<ChannelEntry[]>;
  captions(id: string): Promise<{ video: Video; track: CaptionTrack }>;
};
export type SearchOptions = {
  limit: number;
  batch: number;
  cap: number;
  concurrency: number;
  signal: AbortSignal;
  onResult(result: SearchResult): void;
  onProgress(scanned: number, found: number): void;
};
export type SearchOutcome = {
  scanned: number;
  found: number;
  reason: SearchEnd;
  error?: string;
};

// Messages from the backend's safe_error that mean "stop", not "skip this video".
const rateLimited = /rate-limited|cookies are unavailable|cookie database/i;
const denied = /denied access/i;
const DENIED_IN_A_ROW = 3;

/**
 * Walks a channel newest-first and collects videos whose captions contain the
 * phrase, stopping at the limit. One unusable video never ends the search;
 * rate limiting, unreadable cookies, or repeated access denials do.
 */
export async function searchChannel(
  deps: SearchDeps,
  phrase: string,
  options: SearchOptions,
): Promise<SearchOutcome> {
  const { limit, batch, cap, concurrency, signal } = options;
  let scanned = 0,
    found = 0,
    deniedRun = 0,
    error: string | undefined,
    reason: SearchEnd = "cap";
  for (let from = 1; from <= cap; from += batch) {
    if (signal.aborted) return { scanned, found, reason: "cancelled" };
    const entries = await deps.list(from, batch);
    if (signal.aborted) return { scanned, found, reason: "cancelled" };
    if (!entries.length) {
      reason = "exhausted";
      break;
    }
    let next = 0;
    const worker = async () => {
      while (!signal.aborted && !error && found < limit) {
        const index = next++;
        if (index >= entries.length) return;
        try {
          const { video, track } = await deps.captions(entries[index].id);
          if (signal.aborted) return;
          deniedRun = 0;
          const matches = findSubtitleMatches(track.cues, phrase);
          if (matches.length && found < limit) {
            found++;
            options.onResult({
              order: from - 1 + index,
              video,
              track,
              matches,
              line: matchLine(track.cues, matches[0]),
            });
          }
        } catch (e) {
          if (signal.aborted) return;
          const message = String(e);
          if (rateLimited.test(message)) error = message;
          else if (denied.test(message) && ++deniedRun >= DENIED_IN_A_ROW)
            error = message;
        }
        scanned++;
        options.onProgress(scanned, found);
      }
    };
    await Promise.all(Array.from({ length: concurrency }, worker));
    if (error) return { scanned, found, reason: "blocked", error };
    if (signal.aborted) return { scanned, found, reason: "cancelled" };
    if (found >= limit) {
      reason = "limit";
      break;
    }
    if (entries.length < batch) {
      reason = "exhausted";
      break;
    }
  }
  return { scanned, found, reason };
}
