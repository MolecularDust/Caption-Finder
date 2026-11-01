import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { invoke, isTauri } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import {
  safeFileName,
  fileNameNeedsFix,
  timestamp,
  preciseTimestamp,
  parseTimestamp,
  validSection,
  paddedSection,
  stepPaddedLength,
  jobProgress,
  endFromPaddedLength,
  codecFamily,
  updateQueue,
  clearQueueRows,
  isTrimmed,
  timelineTime,
  acceptPlayerTime,
  type SeekTarget,
  type Video,
  type Settings,
  type Job,
} from "./domain";
import {
  findSubtitleMatches,
  matchContext,
  type Cue,
  defaultHeight,
  type Match,
  type CaptionTrack,
} from "./subtitles";
import {
  searchChannel,
  type ChannelEntry,
  type SearchEnd,
  type SearchResult,
} from "./search";
import { ResultsList, Highlight } from "./results";
import "./style.css";
import appIcon from "./assets/app-icon.png";
const CAPTION_LANGUAGE = "en";
const RESULT_SLOTS = 25;
type SearchStatus = {
  state: "idle" | "running" | "done" | "error";
  scanned: number;
  found: number;
  reason?: SearchEnd;
  message?: string;
};
function searchStatusText(s: SearchStatus): string {
  if (s.state === "running")
    return `Searching… checked ${s.scanned} videos, ${s.found} with matches`;
  if (s.state === "error") return s.message ?? "The search failed.";
  if (s.state !== "done") return "Enter a channel and a phrase, then search.";
  if (s.reason === "blocked") return s.message ?? "The search was stopped.";
  if (!s.found)
    return `No matches in ${s.scanned} videos. Try a shorter phrase.`;
  const found = `${s.found} ${s.found === 1 ? "video" : "videos"}, newest first`;
  if (s.reason === "exhausted")
    return `${found} · checked all ${s.scanned} videos`;
  if (s.reason === "cap") return `${found} · stopped after ${s.scanned} videos`;
  return `${found} · checked ${s.scanned}`;
}
const defaults: Settings = {
  destination: "",
  browser: "",
  cookiesFile: "",
  appearance: "system",
};
function App() {
  const [settings, setSettings] = useState<Settings>(defaults),
    [showSettings, setShowSettings] = useState(false),
    [browsers, setBrowsers] = useState<string[]>([]),
    [channel, setChannel] = useState(() => localStorage.getItem("cf.channel") ?? ""),
    [phrase, setPhrase] = useState(() => localStorage.getItem("cf.phrase") ?? ""),
    [results, setResults] = useState<SearchResult[]>([]),
    [searchedPhrase, setSearchedPhrase] = useState(""),
    [searchStatus, setSearchStatus] = useState<SearchStatus>({
      state: "idle",
      scanned: 0,
      found: 0,
    }),
    [selectedId, setSelectedId] = useState(""),
    [selectedLine, setSelectedLine] = useState(""),
    [candidate, setCandidate] = useState(""),
    [matches, setMatches] = useState<Match[]>([]),
    [matchChosen, setMatchChosen] = useState(false),
    [pickerOpen, setPickerOpen] = useState(false),
    [matchStatus, setMatchStatus] = useState(""),
    [fileName, setFileName] = useState(""),
    [fileNameEditing, setFileNameEditing] = useState(false),
    [fileNameEdited, setFileNameEdited] = useState(false),
    [video, setVideo] = useState<Video | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [nameFix, setNameFix] = useState<{
      original: string;
      proposed: string;
    } | null>(null),
    [playerError, setPlayerError] = useState(""),
    [origin, setOrigin] = useState(""),
    [ready, setReady] = useState(false),
    [previewActive, setPreviewActive] = useState(false),
    [previewMode, setPreviewMode] = useState(false),
    [lengthValid, setLengthValid] = useState(true),
    [inValid, setInValid] = useState(true),
    [outValid, setOutValid] = useState(true),
    [resetVersion, setResetVersion] = useState(0),
    [metadataLoading, setMetadataLoading] = useState(false),
    [metadataStatus, setMetadataStatus] = useState(""),
    [start, setStart] = useState(0),
    [end, setEnd] = useState(0),
    [time, setTime] = useState(0),
    [padding, setPadding] = useState(2),
    [paddingEditing, setPaddingEditing] = useState(false),
    [precise, setPrecise] = useState(false),
    [container, setContainer] = useState("mp4"),
    [resolution, setResolution] = useState("1080"),
    [codec, setCodec] = useState("auto"),
    [audio, setAudio] = useState("best"),
    [mode, setMode] = useState("video"),
    [subtitle, setSubtitle] = useState(""),
    [jobs, setJobs] = useState<Job[]>([]);
  const captionCues = useRef<Cue[]>([]),
    candidateRef = useRef(""),
    dirtyName = useRef(false),
    searchAbort = useRef<AbortController | null>(null),
    matchRequest = useRef(0);
  const selectionGeneration = useRef(0);
  const captionCache = useRef(
    new Map<string, { video: Video; track: CaptionTrack }>(),
  );
  const iframe = useRef<HTMLIFrameElement>(null),
    clearedJobIds = useRef(new Set<string>()),
    scrub = useRef<{ id: number; kind: "in" | "out" | "playhead" } | null>(
      null,
    ),
    seekTarget = useRef<SeekTarget | null>(null),
    previewing = useRef<false | "seeking" | "playing">(false),
    token = useRef(crypto.randomUUID()),
    timeline = useRef<HTMLDivElement>(null);
  const send = (action: string, value?: number) =>
    iframe.current?.contentWindow?.postMessage(
      { token: token.current, action, value },
      origin,
    );
  const stopPreview = () => {
    send("pause");
    previewing.current = false;
    setPreviewActive(false);
  };
  const act = async (fn: () => Promise<unknown>) => {
    try {
      setError("");
      setNameFix(null);
      await fn();
    } catch (e) {
      setError(String(e));
    }
  };
  useEffect(() => {
    if (!isTauri()) {
      setOrigin(window.location.origin);
      setMatchStatus(
        "Browser preview: open the desktop app for subtitle matching and downloads.",
      );
      return;
    }
    let dispose: (() => void) | undefined;
    let disposed = false;
    invoke<string[]>("installed_browsers")
      .then(setBrowsers)
      .catch(() => setBrowsers([]));
    invoke<Settings>("get_settings")
      .then(setSettings)
      .catch((e) => setError(String(e)));
    invoke<string>("player_origin")
      .then(setOrigin)
      .catch((e) => setError(String(e)));
    invoke<Job[]>("jobs")
      .then((loaded) => setJobs(clearQueueRows(loaded, clearedJobIds.current)))
      .catch((e) => setError(String(e)));
    listen<Job>("job", (e) =>
      setJobs((old) => updateQueue(old, e.payload, clearedJobIds.current)),
    )
      .then((fn) => {
        if (disposed) fn();
        else dispose = fn;
      })
      .catch((e) => setError(String(e)));
    return () => {
      disposed = true;
      dispose?.();
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = settings.appearance;
  }, [settings.appearance]);
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (
        e.source !== iframe.current?.contentWindow ||
        e.origin !== origin ||
        e.data?.token !== token.current
      )
        return;
      const { type, value } = e.data;
      if (type === "time") {
        if (
          !acceptPlayerTime(
            value,
            seekTarget.current,
            scrub.current?.kind === "playhead",
            performance.now(),
          )
        )
          return;
        seekTarget.current = null;
        setTime(value);
        if (
          previewing.current === "seeking" &&
          value >= Math.max(0, start - padding) - 0.25 &&
          value < Math.min(video?.duration ?? end, end + padding)
        )
          previewing.current = "playing";
        if (
          previewing.current === "playing" &&
          value >= Math.min(video?.duration ?? end, end + padding)
        ) {
          send("pause");
          previewing.current = false;
          setPreviewActive(false);
        }
      }
      if (
        type === "state" &&
        (value === 0 || (value === 2 && previewing.current === "playing"))
      ) {
        previewing.current = false;
        setPreviewActive(false);
      }
      if (type === "state" && value === 1) setPlayerError("");
      if (type === "ready") setReady(true);
      if (type === "error") {
        setReady(false);
        previewing.current = false;
        setPreviewActive(false);
        setPlayerError(
          value === 153
            ? "YouTube rejected the player identity (error 153). Try reopening the app; this WebView may not send the required Referer."
            : [101, 150].includes(value)
              ? "The owner does not allow this video to be embedded. Downloads may still be available."
              : `YouTube player error ${value}. Check video availability and network access.`,
        );
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [origin, start, end, padding, video]);
  const setIn = () => setStart(Math.max(0, Math.min(time, end - 0.01)));
  const setOut = () =>
    setEnd(Math.min(video?.duration ?? end, Math.max(time, start + 0.01)));
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement).closest(
          "input,textarea,select,[contenteditable]",
        ) ||
        showSettings ||
        !ready
      )
        return;
      if (e.code === "Space" && !(e.target as HTMLElement).closest("button")) {
        e.preventDefault();
        send("toggle");
      }
      if (previewMode && e.key.toLowerCase() === "i") setIn();
      if (previewMode && e.key.toLowerCase() === "o") setOut();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });
  const save = async (next: Settings) => {
    await invoke("save_settings", { settings: next });
    setSettings(next);
  };
  const selectMatch = (m: Match, v = video) => {
    if (!v) return;
    setMatchChosen(true);
    setPickerOpen(false);
    setResetVersion((n) => n + 1);
    setInValid(true);
    setOutValid(true);
    setLengthValid(true);
    setStart(Math.max(0, m.start));
    setEnd(Math.min(v.duration, m.end));
    setTime(m.start);
    if (ready) send("seek", Math.max(0, m.start - padding));
    setMatchStatus(
      "Matched subtitle segment boundaries. Adjust In/Out as needed.",
    );
  };
  const matchFilename = (phrase?: string, selectedId?: string) =>
    act(async () => {
      const text = (phrase ?? fileName).trim(),
        id = selectedId ?? candidateRef.current;
      if (!id || !text) return;
      if (!isTauri()) {
        setMatchStatus("Open the desktop app to retrieve and match subtitles.");
        return;
      }
      const request = ++matchRequest.current;
      const code = CAPTION_LANGUAGE;
      const cacheKey = [id, code, settings.browser, settings.cookiesFile].join(
        "|",
      );
      setBusy(true);
      setMetadataLoading(true);
      setMatchStatus("Retrieving subtitles…");
      try {
        let cached = captionCache.current.get(cacheKey);
        if (!cached) {
          const url = `https://www.youtube.com/watch?v=${id}`;
          const { video: v, track } = await invoke<{
            video: Video;
            track: CaptionTrack;
          }>("caption_track", { url, language: code });
          if (request === matchRequest.current && id === candidateRef.current) {
            setVideo(v);
            if (!video || video.id !== id) {
              setStart(0);
              setEnd(v.duration);
              setResetVersion((n) => n + 1);
            }
            setResolution(defaultHeight(v.formats.map((f) => f.height ?? 0)));
          }
          cached = { video: v, track };
          captionCache.current.set(cacheKey, cached);
        }
        if (request !== matchRequest.current || id !== candidateRef.current)
          return;
        const v = cached.video;
        if (!v.duration || !Number.isFinite(v.duration))
          throw Error("Choose a finished video with a finite duration.");
        captionCues.current = cached.track.cues;
        const found = findSubtitleMatches(cached.track.cues, text);
        setVideo(v);
        setResolution(defaultHeight(v.formats.map((f) => f.height ?? 0)));
        setMatches(found);
        setMatchChosen(false);
        setPickerOpen(false);
        if (found.length === 1) selectMatch(found[0], v);
        else if (found.length) {
          setMatchStatus(
            `${found.length} matches — choose the occurrence you want.`,
          );
          setPickerOpen(true);
        } else
          setMatchStatus(
            "No subtitle match. Timings were not changed; edit the phrase or set In/Out manually.",
          );
        if (found.length === 1)
          setMatchStatus(
            `${cached.track.kind} captions · ${cached.track.language}. Subtitle segment boundaries found; adjust In/Out as needed.`,
          );
      } catch (e) {
        if (request === matchRequest.current) {
          setMatchStatus(
            "Subtitle matching failed. You can set In/Out manually, or edit the phrase and retry.",
          );
          throw e;
        }
      } finally {
        if (request === matchRequest.current) {
          setBusy(false);
          setMetadataLoading(false);
        }
      }
    });
  const playerStart = useRef(0);
  const selectResult = (r: SearchResult) => {
    const first = r.matches[0];
    candidateRef.current = r.video.id;
    matchRequest.current++;
    selectionGeneration.current++;
    dirtyName.current = false;
    captionCache.current.set(
      [r.video.id, CAPTION_LANGUAGE, settings.browser, settings.cookiesFile].join("|"),
      { video: r.video, track: r.track },
    );
    playerStart.current = Math.max(0, first.start - 2);
    captionCues.current = r.track.cues;
    setPickerOpen(false);
    setSelectedId(r.video.id);
    setCandidate(r.video.id);
    setSelectedLine(r.line);
    setPlayerError("");
    setReady(false);
    setPreviewMode(true);
    setPreviewActive(false);
    previewing.current = false;
    setBusy(false);
    setMetadataLoading(false);
    setMetadataStatus("");
    setPadding(2);
    setVideo(r.video);
    setMatches(r.matches);
    setResolution(defaultHeight(r.video.formats.map((f) => f.height ?? 0)));
    setFileName(safeFileName(r.line).slice(0, 90));
    setFileNameEdited(true);
    selectMatch(first, r.video);
  };
  const runSearch = async () => {
    const text = phrase.trim(),
      source = channel.trim();
    if (!text || !source) return;
    if (!isTauri()) {
      setSearchStatus({
        state: "error",
        scanned: 0,
        found: 0,
        message: "Open the desktop app to search a channel.",
      });
      return;
    }
    try {
      localStorage.setItem("cf.channel", source);
      localStorage.setItem("cf.phrase", text);
    } catch {
      /* remembering the last search is only a convenience */
    }
    searchAbort.current?.abort();
    const control = new AbortController();
    searchAbort.current = control;
    matchRequest.current++;
    candidateRef.current = "";
    setResults([]);
    setSelectedId("");
    setCandidate("");
    setVideo(null);
    setMatches([]);
    setSelectedLine("");
    setFileName("");
    setSearchedPhrase(text);
    setSearchStatus({ state: "running", scanned: 0, found: 0 });
    try {
      const outcome = await searchChannel(
        {
          list: (from, count) =>
            invoke<ChannelEntry[]>("list_channel", {
              channel: source,
              from,
              count,
            }),
          captions: async (id) => {
            const key = [id, CAPTION_LANGUAGE, settings.browser, settings.cookiesFile].join("|");
            const cached = captionCache.current.get(key);
            if (cached) return cached;
            const found = await invoke<{ video: Video; track: CaptionTrack }>(
              "caption_track",
              {
                url: `https://www.youtube.com/watch?v=${id}`,
                language: CAPTION_LANGUAGE,
              },
            );
            captionCache.current.set(key, found);
            return found;
          },
        },
        text,
        {
          limit: RESULT_SLOTS,
          batch: 30,
          cap: 400,
          concurrency: 3,
          signal: control.signal,
          onResult: (r) =>
            setResults((old) => [...old, r].sort((a, b) => a.order - b.order)),
          onProgress: (scanned, found) =>
            setSearchStatus((old) => ({ ...old, scanned, found })),
        },
      );
      if (searchAbort.current === control)
        setSearchStatus({
          state: outcome.reason === "blocked" ? "error" : "done",
          scanned: outcome.scanned,
          found: outcome.found,
          reason: outcome.reason,
          message: outcome.error,
        });
    } catch (e) {
      if (searchAbort.current === control)
        setSearchStatus((old) => ({ ...old, state: "error", message: String(e) }));
    }
  };
  const cancelSearch = () => {
    searchAbort.current?.abort();
    setSearchStatus((old) => ({ ...old, state: "done", reason: "cancelled" }));
  };
  useEffect(() => {
    if (!candidate && results.length > 0) selectResult(results[0]);
  }, [results]);
  const formats =
    video?.formats.filter((f) => f.height && f.vcodec !== "none") ?? [];
  const heights = [...new Set(formats.map((f) => f.height!))].sort(
    (a, b) => b - a,
  );
  const available = formats.filter(
    (f) => !resolution || f.height === Number(resolution),
  );
  const codecs = new Set(available.map((f) => codecFamily(f.vcodec)));
  const compatible =
    container === "mkv" ||
    codec === "h264" ||
    codec === "hevc" ||
    codec === "av1" ||
    codec === "auto";
  const duration = video?.duration ?? 0;
  const timelineDuration = duration || 1;
  const [clipStart, clipEnd] = paddedSection(start, end, padding, duration);
  const section = !!video && isTrimmed(clipStart, clipEnd, video.duration);
  const selectionValid =
    !!video &&
    lengthValid &&
    inValid &&
    outValid &&
    (matches.length <= 1 || matchChosen) &&
    validSection(start, end, video.duration);
  const enqueue = () =>
    act(async () => {
      if (!video || !selectionValid)
        throw Error("Select a valid video section.");
      if (fileNameEdited && fileNameNeedsFix(fileName)) {
        setNameFix({ original: fileName, proposed: safeFileName(fileName) });
        setError(
          "This file name contains unsupported characters, is empty, or is too long. Review the suggested name below.",
        );
        return;
      }
      await invoke("enqueue", {
        request: {
          url: video.url,
          title: video.title,
          fileName: fileNameEdited ? fileName.trim() : null,
          destination: settings.destination,
          container,
          resolution: resolution ? Number(resolution) : null,
          codec,
          audio,
          mode,
          subtitle,
          section: section ? [clipStart, clipEnd] : null,
          precise: section && precise,
          duration: video.duration,
        },
      });
    });
  const seek = (value: number) => {
    if (!video || !ready || busy) return;
    const position = Math.max(0, Math.min(video.duration, value));
    if (previewing.current) stopPreview();
    seekTarget.current = { position, expires: performance.now() + 3000 };
    setTime(position);
    send("seek", position);
  };
  const moveTimelineControl = (
    clientX: number,
    kind: "in" | "out" | "playhead",
  ) => {
    if (!timeline.current || !video || busy) return;
    const bounds = timeline.current.getBoundingClientRect();
    const position = timelineTime(
      clientX,
      bounds.left,
      bounds.width,
      video.duration,
    );
    if (kind === "in") setStart(Math.min(position, end - 0.01));
    else if (kind === "out") setEnd(Math.max(position, start + 0.01));
    else seek(position);
  };
  return (
    <div className="app">
      <header>
        <div className="brand">
          <img className="app-icon" src={appIcon} alt="" />
          <div>
            <strong>Caption Finder</strong>
            <small>Find the line. Keep the moment.</small>
          </div>
        </div>
        <div className="header-actions">
          <span className="badge">
            ●{" "}
            {settings.browser || settings.cookiesFile
              ? settings.browser === "app"
                ? "App session"
                : "Browser session"
              : "Anonymous"}
          </span>
          <button onClick={() => setShowSettings(true)}>
            ◎ <span>Account & Settings</span>
          </button>
        </div>
      </header>
      <main>
        <section className="url-card">
          <form
            className="search-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchStatus.state !== "running") void runSearch();
            }}
          >
            <label className="field" htmlFor="channel">
              <span>YouTube channel</span>
              <input
                id="channel"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                placeholder="Channel link or @handle"
                required
              />
            </label>
            <div className="phrase-group">
              <label className="field" htmlFor="phrase">
                <span>Search phrase</span>
                <input
                  id="phrase"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  value={phrase}
                  onChange={(e) => setPhrase(e.target.value)}
                  placeholder="Enter a word or phrase"
                  required
                />
              </label>
              {searchStatus.state === "running" ? (
                <button
                  className="search-button"
                  type="button"
                  onClick={cancelSearch}
                >
                  Stop
                </button>
              ) : (
                <button className="primary search-button" type="submit">
                  Search →
                </button>
              )}
            </div>
          </form>
        </section>
        <div className="panes">
          <section className="results-card" aria-label="Matching videos">
            <div className="video-info">
              <div>
                <span className="eyebrow">RESULTS</span>
                <h2>
                  {results.length
                    ? `${results.length} ${results.length === 1 ? "video" : "videos"} with “${searchedPhrase}”`
                    : "Matching videos"}
                </h2>
                <p
                  className={
                    searchStatus.state === "error" ? "status error" : "status"
                  }
                  role="status"
                >
                  {searchStatusText(searchStatus)}{" "}
                  {/denied access|cookies/i.test(searchStatus.message ?? "") && (
                    <button
                      type="button"
                      className="inline-action"
                      onClick={() => setShowSettings(true)}
                    >
                      Open Account & Settings
                    </button>
                  )}
                </p>
              </div>
            </div>
            <div className="results-scroll">
              <ResultsList
                results={results}
                slots={RESULT_SLOTS}
                searching={searchStatus.state === "running"}
                phrase={searchedPhrase}
                selectedId={selectedId}
                onSelect={selectResult}
              />
            </div>
          </section>
          <section className="video-card">
          <div className="video-info">
            <div>
              <span className="eyebrow">VIDEO</span>
              <h2>
                {video?.title ?? "Watch, adjust, and keep your example."}
              </h2>
              <p>
                {video
                  ? `${video.channel} · ${timestamp(video.duration)}`
                  : "Select a search result to load its video."}
              </p>
            </div>
          </div>
          {metadataStatus && (
            <p className="metadata-status" role="status">
              {metadataLoading && (
                <span className="analyze-spinner" aria-hidden="true" />
              )}
              {metadataStatus}
            </p>
          )}
          <div className="player">
            {candidate && origin ? (
              <iframe
                ref={iframe}
                key={candidate}
                title="YouTube player"
                src={`${origin}/player?token=${token.current}&id=${candidate}&start=${playerStart.current.toFixed(2)}`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <div className="empty-player">
                <div className="play-symbol">▶</div>
                <h3>Your video appears here</h3>
                <p>Search a channel, then select a result.</p>
              </div>
            )}
          </div>
          {candidate && (
            <div className="external-video-actions">
              <button
                onClick={() =>
                  act(() =>
                    invoke("open_youtube", {
                      url: `https://www.youtube.com/watch?v=${candidate}`,
                    }),
                  )
                }
              >
                Open in YouTube ↗
              </button>
              <button
                onClick={() =>
                  act(() =>
                    invoke("copy_youtube_link", {
                      url: `https://www.youtube.com/watch?v=${candidate}`,
                    }),
                  )
                }
              >
                Copy link
              </button>
            </div>
          )}
          {playerError && <div className="notice error">{playerError}</div>}
          <div className="matched-line">
            <span className="label">Matched line</span>
            <p>
              {selectedLine ? (
                <>
                  … <Highlight line={selectedLine} phrase={searchedPhrase} /> …
                </>
              ) : (
                "The caption line containing your phrase shows here."
              )}
            </p>
          </div>
          <div className="trim">
            <fieldset className="trim-details" disabled={!candidate}>
              <fieldset className="clip-controls" disabled={!video || busy}>
                <div className="timeline-labels">
                  <span>{timestamp(0)}</span>
                  <span>
                    {timestamp(time)} <small>PLAYHEAD</small>
                  </span>
                  <span>{timestamp(duration)}</span>
                </div>
                <div
                  className="timeline"
                  ref={timeline}
                  onPointerDown={(e) => {
                    if (!video || busy || e.button !== 0 || !e.isPrimary)
                      return;
                    const control = (
                      e.target as HTMLElement
                    ).closest<HTMLElement>("[data-timeline-control]");
                    const kind = (control?.dataset.timelineControl ??
                      "playhead") as "in" | "out" | "playhead";
                    if (kind === "playhead" && !ready) return;
                    e.preventDefault();
                    (
                      control ??
                      e.currentTarget.querySelector<HTMLElement>(
                        ".playhead-handle",
                      )
                    )?.focus({ preventScroll: true });
                    e.currentTarget.setPointerCapture(e.pointerId);
                    scrub.current = { id: e.pointerId, kind };
                    if (!control) moveTimelineControl(e.clientX, kind);
                  }}
                  onPointerMove={(e) => {
                    if (scrub.current?.id === e.pointerId)
                      moveTimelineControl(e.clientX, scrub.current.kind);
                  }}
                  onPointerUp={(e) => {
                    if (scrub.current?.id !== e.pointerId) return;
                    const kind = scrub.current.kind;
                    scrub.current = null;
                    moveTimelineControl(e.clientX, kind);
                    if (e.currentTarget.hasPointerCapture(e.pointerId))
                      e.currentTarget.releasePointerCapture(e.pointerId);
                  }}
                  onPointerCancel={() => {
                    scrub.current = null;
                  }}
                  onLostPointerCapture={() => {
                    scrub.current = null;
                  }}
                >
                  <div
                    className="selection"
                    style={{
                      left: `${(clipStart / timelineDuration) * 100}%`,
                      width: `${((clipEnd - clipStart) / timelineDuration) * 100}%`,
                    }}
                  />
                  <div
                    className="playhead"
                    style={{ left: `${(time / timelineDuration) * 100}%` }}
                  >
                    <button
                      className="playhead-handle"
                      data-timeline-control="playhead"
                      aria-label="Playhead"
                      role="slider"
                      aria-valuemin={0}
                      aria-valuemax={duration}
                      aria-valuenow={time}
                      aria-valuetext={preciseTimestamp(time)}
                      disabled={!ready || !video || metadataLoading}
                      title="Drag to seek"
                      onKeyDown={(e) => {
                        if (
                          ["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                            e.key,
                          )
                        ) {
                          e.preventDefault();
                          const delta =
                            (e.key === "ArrowRight" ? 1 : -1) *
                            (e.shiftKey ? 1 : 0.1);
                          seek(
                            e.key === "Home"
                              ? 0
                              : e.key === "End"
                                ? duration
                                : time + delta,
                          );
                        }
                      }}
                    />
                  </div>
                  {(["in", "out"] as const).map((which) => (
                    <button
                      key={which}
                      className={`marker ${which}`}
                      disabled={!video || metadataLoading}
                      aria-label={`${which} marker`}
                      role="slider"
                      aria-valuemin={0}
                      aria-valuemax={duration}
                      aria-valuenow={which === "in" ? start : end}
                      style={{
                        left: `${((which === "in" ? start : end) / timelineDuration) * 100}%`,
                      }}
                      data-timeline-control={which}
                      onKeyDown={(e) => {
                        if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
                          e.preventDefault();
                          const delta =
                            (e.key === "ArrowRight" ? 1 : -1) *
                            (e.shiftKey ? 1 : 0.1);
                          if (which === "in")
                            setStart(
                              Math.max(0, Math.min(end - 0.01, start + delta)),
                            );
                          else
                            setEnd(
                              Math.min(
                                duration,
                                Math.max(start + 0.01, end + delta),
                              ),
                            );
                        }
                      }}
                    >
                      Ⅱ
                    </button>
                  ))}
                </div>
                <fieldset
                  className="trim-controls"
                  disabled={!video || metadataLoading}
                >
                  <div className="point">
                    <button disabled={!ready || !previewMode} onClick={setIn}>
                      Set In <kbd>I</kbd>
                    </button>
                    <TimeInput
                      key={`in-${resetVersion}`}
                      label="In"
                      onValidity={setInValid}
                      value={start}
                      onChange={(n) => {
                        if (!validSection(n, end, duration))
                          throw Error("In must precede Out.");
                        setStart(n);
                      }}
                    />
                  </div>
                  <div className="point">
                    <button disabled={!ready || !previewMode} onClick={setOut}>
                      Set Out <kbd>O</kbd>
                    </button>
                    <TimeInput
                      key={`out-${resetVersion}`}
                      label="Out"
                      onValidity={setOutValid}
                      value={end}
                      onChange={(n) => {
                        if (!validSection(start, n, duration))
                          throw Error("Out must follow In and fit the video.");
                        setEnd(n);
                      }}
                    />
                  </div>
                  <div className="time-input length-input padding-input">
                    <label className="length-label" htmlFor="padding">
                      Padding
                      <br />
                      (seconds)
                    </label>
                    <div className="number-stepper">
                      <input
                        id="padding"
                        aria-label="Padding in seconds"
                        inputMode="numeric"
                        maxLength={2}
                        value={
                          paddingEditing
                            ? String(padding)
                            : String(padding).padStart(2, "0")
                        }
                        onFocus={(e) => {
                          setPaddingEditing(true);
                          e.target.select();
                        }}
                        onBlur={() => setPaddingEditing(false)}
                        onChange={(e) => {
                          if (/^\d{0,2}$/.test(e.target.value))
                            setPadding(Number(e.target.value));
                        }}
                      />
                      <StepperButtons
                        label="Padding"
                        onStep={(delta) =>
                          setPadding(Math.max(0, Math.min(99, padding + delta)))
                        }
                      />
                    </div>
                  </div>
                  <div className="time-input length-input calculated-length">
                    <span className="length-label">
                      Length
                      <br />
                      (seconds)
                    </span>
                    <div className="number-stepper">
                      <LengthInput
                        key={`length-${resetVersion}`}
                        value={Math.round((clipEnd - clipStart) * 1000) / 1000}
                        onValidity={setLengthValid}
                        onCommit={(length) => {
                          setEnd(
                            endFromPaddedLength(
                              start,
                              padding,
                              duration,
                              length,
                            ),
                          );
                          setInValid(true);
                          setOutValid(true);
                        }}
                      />
                      <StepperButtons
                        label="Length"
                        onStep={(delta) => {
                          setEnd(
                            stepPaddedLength(
                              start,
                              end,
                              padding,
                              duration,
                              delta,
                            ),
                          );
                          setResetVersion((n) => n + 1);
                          setInValid(true);
                          setOutValid(true);
                          setLengthValid(true);
                        }}
                      />
                    </div>
                  </div>
                  <button
                    className="preview-button"
                    disabled={!ready || (!previewActive && !selectionValid)}
                    onClick={() => {
                      if (previewing.current) {
                        stopPreview();
                        return;
                      }
                      seekTarget.current = {
                        position: clipStart,
                        expires: performance.now() + 3000,
                      };
                      setTime(clipStart);
                      send("seek", clipStart);
                      previewing.current = "seeking";
                      setPreviewActive(true);
                      send("play");
                    }}
                  >
                    {previewActive ? "■ Stop" : "▶ Preview selection"}
                  </button>
                  <button
                    className="reset-button"
                    type="button"
                    onClick={() => {
                      if (!video) return;
                      matchRequest.current++;
                      setBusy(false);
                      if (previewing.current) stopPreview();
                      setPadding(2);
                      setStart(0);
                      setEnd(duration);
                      setTime(0);
                      setInValid(true);
                      setOutValid(true);
                      setLengthValid(true);
                      setMatches([]);
                      setMatchChosen(false);
                      setResetVersion((n) => n + 1);
                      setMatchStatus("Full video selected.");
                    }}
                  >
                    Reset
                  </button>
                </fieldset>
                {padding > 0 && (
                  <small className="padding-summary">
                    With padding: {preciseTimestamp(clipStart)} –{" "}
                    {preciseTimestamp(clipEnd)}. Padding stops at the video
                    boundaries.
                  </small>
                )}
              </fieldset>
              <div
                className={`download-filename${fileNameEditing || fileNameEdited ? " is-editing" : ""}`}
              >
                <span>File name</span>
                <div>
                  <input
                    aria-label="File name"
                    value={fileName}
                    readOnly={busy}
                    onFocus={() => {
                      dirtyName.current = true;
                      setFileNameEditing(true);
                    }}
                    onChange={(e) => {
                      dirtyName.current = true;
                      matchRequest.current++;
                      setMatchChosen(false);
                      setFileName(e.target.value);
                      setMatches([]);
                      setFileNameEdited(true);
                    }}
                    onBlur={() => {
                      setFileNameEditing(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !busy) {
                        e.preventDefault();
                        matchFilename();
                      }
                    }}
                    placeholder="Select a result, or type a sentence from its subtitles"
                  />
                  <span>.{container}</span>
                  <button
                    type="button"
                    className="lookup-button primary"
                    disabled={busy || !candidate || !fileName.trim()}
                    aria-busy={busy}
                    aria-label={busy ? "Looking up subtitles" : "Look Up"}
                    onClick={() => void matchFilename()}
                  >
                    {busy ? (
                      <>
                        <span className="analyze-spinner" aria-hidden="true" />
                        <span>Looking up…</span>
                      </>
                    ) : (
                      "Look Up"
                    )}
                  </button>
                </div>
                <small>
                  Choose an example, then click Look Up (or press Enter) to load
                  its timings. The same text names your file.
                </small>
              </div>
              <p className="match-status" role="status">
                {matchStatus}
              </p>
              {matches.length > 1 && (
                <div className="match-list">
                  {matches.map((m, i) => (
                    <button
                      key={`${m.start}-${i}`}
                      onClick={() => selectMatch(m)}
                    >
                      {preciseTimestamp(m.start)} – {preciseTimestamp(m.end)}
                    </button>
                  ))}
                </div>
              )}
              <div
                className={`check${!video || busy ? " disabled-control" : ""}`}
              >
                <input
                  type="checkbox"
                  disabled={!video || busy}
                  aria-label="Precise Cut"
                  aria-describedby="precise-cut-description"
                  checked={precise}
                  onChange={(e) => setPrecise(e.target.checked)}
                />
                <span>Precise Cut</span>
                <small id="precise-cut-description">
                  {precise
                    ? "Re-encodes for accurate boundaries. Automatic uses H.264 / AAC."
                    : "Fast Cut preserves streams; boundaries may align to keyframes."}
                </small>
              </div>
            </fieldset>
            {!video && (
              <small className="trim-hint">
                Select a search result to set In and Out from its caption line.
                Padding extends both ends, stopping at the beginning and end of
                the video.
              </small>
            )}
          </div>
        </section>
        </div>
        <section className="settings-card">
          <details>
            <summary>
              Download settings{" "}
              <small>1080p preferred · lower resolution if unavailable</small>
            </summary>
            <div className="options">
              <Field label="Container">
                <select
                  value={container}
                  onChange={(e) => setContainer(e.target.value)}
                >
                  <option value="mp4">MP4</option>
                  <option value="mkv">MKV</option>
                </select>
              </Field>
              <Field label="Resolution">
                <select
                  disabled={mode === "audio"}
                  value={resolution}
                  onChange={(e) => {
                    setResolution(e.target.value);
                    setCodec("auto");
                  }}
                >
                  <option value="">Best available</option>
                  {heights.map((h) => (
                    <option key={h} value={h}>
                      {h === 2160 ? "4K · " : h === 1440 ? "2K · " : ""}
                      {h}p
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Video codec">
                <select
                  disabled={mode === "audio"}
                  value={codec}
                  onChange={(e) => setCodec(e.target.value)}
                >
                  <option value="auto">Automatic</option>
                  {[
                    ["h264", "H.264"],
                    ["hevc", "H.265 / HEVC"],
                    ["av1", "AV1"],
                    ["vp9", "VP9"],
                  ].map(([v, l]) => (
                    <option key={v} value={v} disabled={!codecs.has(v)}>
                      {l}
                      {!codecs.has(v) ? " · unavailable" : ""}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Audio">
                <select
                  value={audio}
                  disabled={mode === "audio"}
                  onChange={(e) => setAudio(e.target.value)}
                >
                  <option value="best">Best available</option>
                  <option value="original">Original compatible stream</option>
                  <option value="none">No audio</option>
                </select>
              </Field>
              <Field label="Subtitles">
                <select
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                >
                  <option value="">None</option>
                  {Object.keys(video?.subtitles ?? {}).map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </Field>
              <Field label="Download mode">
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option value="video">Video + audio</option>
                  <option value="audio">Audio only</option>
                </select>
              </Field>
            </div>
            <p className="format-note">
              ⓘ{" "}
              {precise && section
                ? "Precise cut re-encodes. Resolution is retained and the output duration is checked."
                : compatible
                  ? "Original streams are preserved where the selected container supports them; separate tracks require merging."
                  : "This codec may not be supported in MP4. Choose MKV to preserve the original stream."}{" "}
              Unavailable combinations fail explicitly.
            </p>
          </details>
          <div className="destination">
            <svg
              className="folder-icon"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z" />
              <path d="M3 9h18" />
            </svg>
            <div>
              <small>SAVE TO</small>
              <p>{settings.destination || "Choose a download folder"}</p>
            </div>
            <button
              onClick={() =>
                act(async () => {
                  const p = await invoke<string | null>("pick_folder");
                  if (p) await save({ ...settings, destination: p });
                })
              }
            >
              Choose folder…
            </button>
          </div>
          <button
            className="primary add"
            disabled={
              !video || !settings.destination || !selectionValid || busy
            }
            onClick={enqueue}
          >
            ＋ Add to Download Queue{" "}
            <span>{section ? "Selected section" : "Entire video"}</span>
          </button>
          <p className="legal">
            Download only content you own or have permission to download.
          </p>
        </section>
        <section className="queue">
          <div className="section-heading">
            <h2>
              Download queue <span className="count">{jobs.length}</span>
            </h2>
            <button
              disabled={
                !jobs.some((j) =>
                  ["completed", "canceled", "failed"].includes(j.state),
                )
              }
              onClick={() =>
                act(async () => {
                  const cleared = await invoke<string[]>("clear_completed");
                  for (const id of cleared) clearedJobIds.current.add(id);
                  setJobs((current) =>
                    clearQueueRows(current, clearedJobIds.current),
                  );
                })
              }
            >
              Clear Finished
            </button>
          </div>
          {!jobs.length ? (
            <div className="queue-empty">
              <span>⇣</span>
              <div>
                <strong>A home for your downloads</strong>
                <p>Add a video and we’ll take it from here.</p>
              </div>
            </div>
          ) : (
            jobs.map((j) => (
              <article className="job" key={j.id}>
                <div className="job-icon" aria-hidden="true">
                  {j.state === "completed" ? (
                    <span className="queue-checkmark">✓</span>
                  ) : ["canceled", "failed"].includes(j.state) ? (
                    <span className="queue-canceled">✕</span>
                  ) : (
                    <span
                      className={`queue-spinner${["downloading", "merging", "processing"].includes(j.state) ? " is-spinning" : ""}`}
                    />
                  )}
                </div>
                <div className="job-body">
                  <strong>{j.title}</strong>
                  <div className="job-status">
                    <span>{jobProgress(j).label}</span>
                    <span>
                      {[
                        jobProgress(j).percent === null
                          ? ""
                          : `${jobProgress(j).percent!.toFixed(1)}%`,
                        j.speed,
                        j.bytes,
                        j.eta ? `${j.eta} remaining` : "",
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </div>
                  <progress
                    value={jobProgress(j).percent ?? undefined}
                    max="100"
                  />
                  {j.message && <p>{j.message}</p>}
                </div>
                <div className="job-actions">
                  {j.state === "completed" ? (
                    <button
                      onClick={() => act(() => invoke("reveal", { id: j.id }))}
                    >
                      Reveal file
                    </button>
                  ) : j.state === "failed" ? (
                    <button
                      onClick={() => act(() => invoke("retry", { id: j.id }))}
                    >
                      Retry
                    </button>
                  ) : j.state === "canceled" ? null : (
                    <>
                      <button
                        disabled={["queued", "cooldown"].includes(j.state)}
                        onClick={() =>
                          act(() =>
                            invoke("control", {
                              id: j.id,
                              action: j.state === "paused" ? "resume" : "pause",
                            }),
                          )
                        }
                      >
                        {j.state === "paused" ? "Resume" : "Pause"}
                      </button>
                      <button
                        onClick={() =>
                          act(() =>
                            invoke("control", { id: j.id, action: "cancel" }),
                          )
                        }
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
        <footer>
          <span>YOUGLISH DOWNLOADER</span>
          <span>Made for your personal library.</span>
        </footer>
      </main>
      {pickerOpen && matches.length > 1 && video && (
        <div className="modal-backdrop">
          <section
            className="modal match-picker"
            role="dialog"
            aria-modal="true"
            aria-label="Choose an occurrence"
          >
            <h2>Choose the occurrence</h2>
            <p>
              This phrase appears {matches.length} times in the video. YouGlish
              does not tell the app which one you picked, so choose it here.
            </p>
            <ul>
              {matches.map((m, i) => {
                const ctx = matchContext(captionCues.current, m);
                return (
                  <li key={`${m.start}-${i}`}>
                    <button onClick={() => selectMatch(m)}>
                      <strong>
                        {preciseTimestamp(m.start)} – {preciseTimestamp(m.end)}
                      </strong>
                      <span>
                        {ctx.before && `…${ctx.before} `}
                        <mark>{m.text}</mark>
                        {ctx.after && ` ${ctx.after}…`}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="error-popup-actions">
              <button onClick={() => setPickerOpen(false)}>Decide later</button>
            </div>
          </section>
        </div>
      )}
      {error && (
        <ErrorPopup
          message={error}
          nameFix={nameFix}
          onClose={() => {
            setError("");
            setNameFix(null);
          }}
          onFix={() => {
            if (nameFix) {
              setFileName(nameFix.proposed);
              setFileNameEdited(true);
              dirtyName.current = true;
            }
            setError("");
            setNameFix(null);
          }}
        />
      )}
      {showSettings && (
        <div className="modal-backdrop">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Account and Settings"
          >
            <div className="section-heading">
              <h2>Account & Settings</h2>
              <button onClick={() => setShowSettings(false)}>Done</button>
            </div>
            <h3>Video player account</h3>
            <p>Sign in to Google first, then connect YouTube and select your channel if asked. Close the account window when finished and search again to reload the player.</p>
            <div className="playback-test-actions">
              <button
                onClick={() => act(() => invoke("youtube_sign_in_window"))}
              >
                1. Sign in to Google ↗
              </button>
              <button
                onClick={() => act(() => invoke("youtube_connect_window"))}
              >
                2. Connect YouTube ↗
              </button>
              <button
                onClick={() => act(() => invoke("youtube_playback_test"))}
              >
                Check playback ↗
              </button>
            </div>
            <p>
              Your login is kept in the app’s browser storage. On YouTube, an
              account avatar confirms sign-in; use its account menu to switch
              accounts or sign out. A successful check plays a sample video in
              that window.
            </p>
            <h3>Subtitle and download authentication</h3>
            <p>
              Use an existing browser session for videos you’re authorized to
              access. Anonymous is the default.
            </p>
            <Field label="Download authentication">
              <select
                value={settings.browser || (settings.cookiesFile ? "file" : "")}
                onChange={(e) =>
                  act(async () => {
                    if (e.target.value === "file") {
                      const p = await invoke<string | null>("pick_cookies");
                      if (p)
                        await save({
                          ...settings,
                          browser: "",
                          cookiesFile: p,
                        });
                    } else
                      await save({
                        ...settings,
                        browser: e.target.value,
                        cookiesFile: "",
                      });
                  })
                }
              >
                <option value="">Anonymous</option>
                <option value="app">App’s YouTube session</option>
                {browsers.map((browser) => (
                  <option key={browser} value={browser}>
                    {
                      (
                        {
                          opera: "Opera",
                          chrome: "Chrome",
                          firefox: "Firefox",
                          safari: "Safari",
                          edge: "Edge",
                          brave: "Brave",
                          chromium: "Chromium",
                          vivaldi: "Vivaldi",
                        } as Record<string, string>
                      )[browser]
                    }
                  </option>
                ))}
                <option value="file">Import Netscape cookies…</option>
              </select>
            </Field>
            <p className="notice">
              Selecting the app’s session uses only its YouTube cookies in a temporary file, removed when the operation finishes. Selecting another browser authorizes yt-dlp to read its cookies when you
              analyze or download. Your operating system may request browser cookie-store

              access. Cookies are never printed or copied into app settings, or
              injected into the video player. This setting controls caption
              retrieval and downloads; the player uses the app’s own sign-in
              above.
            </p>
            <Field label="Appearance">
              <select
                value={settings.appearance}
                onChange={(e) =>
                  act(() => save({ ...settings, appearance: e.target.value }))
                }
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </Field>
          </section>
        </div>
      )}
    </div>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
function StepperButtons({
  label,
  onStep,
}: {
  label: string;
  onStep: (delta: number) => void;
}) {
  return (
    <span className="stepper-buttons">
      <button
        type="button"
        aria-label={`Increase ${label} by one second`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onStep(1)}
      >
        ▴
      </button>
      <button
        type="button"
        aria-label={`Decrease ${label} by one second`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onStep(-1)}
      >
        ▾
      </button>
    </span>
  );
}
function LengthInput({
  value,
  onCommit,
  onValidity,
}: {
  value: number;
  onCommit: (length: number) => void;
  onValidity: (valid: boolean) => void;
}) {
  const [text, setText] = useState(String(value)),
    [invalid, setInvalid] = useState("");
  useEffect(() => {
    setText(String(value));
    setInvalid("");
    onValidity(true);
  }, [value, onValidity]);
  const commit = () => {
    try {
      const trimmed = text.trim();
      if (!/^\d+(\.\d{1,3})?$/.test(trimmed))
        throw Error("Enter seconds, e.g. 7.32.");
      onCommit(Number(trimmed));
      setInvalid("");
      onValidity(true);
    } catch (e) {
      setInvalid(e instanceof Error ? e.message : String(e));
      onValidity(false);
    }
  };
  return (
    <>
      <input
        aria-label="Length in seconds"
        inputMode="decimal"
        value={text}
        aria-invalid={!!invalid}
        onChange={(e) => {
          setText(e.target.value);
          onValidity(false);
        }}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
      />
      {invalid && <small role="alert">{invalid}</small>}
    </>
  );
}
function TimeInput({
  value,
  onChange,
  onValidity,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  onValidity: (valid: boolean) => void;
  label: string;
}) {
  const [text, setText] = useState(preciseTimestamp(value)),
    [invalid, setInvalid] = useState("");
  useEffect(() => {
    setText(preciseTimestamp(value));
    setInvalid("");
    onValidity(true);
  }, [value, onValidity]);
  const commit = () => {
    try {
      onChange(parseTimestamp(text));
      setInvalid("");
      onValidity(true);
    } catch (e) {
      setInvalid(String(e));
      onValidity(false);
    }
  };
  const step = (delta: number) => {
    try {
      onChange(Math.round((value + delta) * 1000) / 1000);
      setInvalid("");
      onValidity(true);
    } catch (e) {
      setInvalid(String(e));
      onValidity(false);
    }
  };
  return (
    <div className="time-input">
      <div className="number-stepper">
        <input
          aria-label={`${label} timestamp`}
          value={text}
          aria-invalid={!!invalid}
          onChange={(e) => {
            setText(e.target.value);
            onValidity(false);
          }}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />
        <StepperButtons label={label} onStep={step} />
      </div>
      {invalid && <small role="alert">{invalid}</small>}
    </div>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

function ErrorPopup({
  message,
  nameFix,
  onClose,
  onFix,
}: {
  message: string;
  nameFix: { original: string; proposed: string } | null;
  onClose: () => void;
  onFix: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      className="error-popup"
      aria-labelledby="error-title"
      aria-describedby="error-message"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <h2 id="error-title">
        {nameFix ? "Fix file name" : "Something went wrong"}
      </h2>
      <p id="error-message">{message}</p>
      {nameFix && (
        <dl className="filename-comparison">
          <dt>Original name</dt>
          <dd>{nameFix.original || "(empty)"}</dd>
          <dt>Proposed name</dt>
          <dd>{nameFix.proposed}</dd>
        </dl>
      )}
      <div className="error-popup-actions">
        <button onClick={onClose}>{nameFix ? "Cancel" : "Close"}</button>
        {nameFix && (
          <button className="primary" onClick={onFix}>
            Fix name
          </button>
        )}
      </div>
    </dialog>
  );
}
