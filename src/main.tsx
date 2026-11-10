import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { convertFileSrc, invoke, isTauri } from "@tauri-apps/api/core";
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
import {
  isVideoLink,
  looksLikeChannel,
  mergedLister,
  parseVideoLinks,
  videoLister,
  type SearchMode,
  subscriberText,
  type ChannelChoice,
  type ChannelPreset,
  type ChannelSuggestion,
} from "./channels";
import { LANGUAGE_CHOICES, captionLanguages } from "./languages";
import { ResultsList, Highlight } from "./results";
import GrantHelper from "./GrantHelper";
import "./style.css";
import appIcon from "./assets/app-icon.png";
const RESULT_SLOTS = 25;
const DEFAULT_SCAN = 50;
const MAX_SCAN = 1000;
const validScan = (n: number) => Number.isInteger(n) && n >= 1 && n <= MAX_SCAN;
type SearchStatus = {
  state: "idle" | "running" | "done" | "error";
  scanned: number;
  found: number;
  reason?: SearchEnd;
  message?: string;
};
function searchStatusText(s: SearchStatus, mode: SearchMode = "channels"): string {
  if (s.state === "running")
    return `Searching… checked ${s.scanned} videos, ${s.found} with matches`;
  if (s.state === "error") return s.message ?? "The search failed.";
  if (s.state !== "done")
    return mode === "videos"
      ? "Add videos and a phrase, then search."
      : "Enter a channel and a phrase, then search.";
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
  playFirstResult: false,
};
function App() {
  const [settings, setSettings] = useState<Settings>(defaults),
    [showSettings, setShowSettings] = useState(false),
    [browsers, setBrowsers] = useState<string[]>([]),
    [channel, setChannel] = useState(""),
    [searchMode, setSearchMode] = useState<SearchMode>(() => {
      try {
        return localStorage.getItem("cf.mode") === "videos" ? "videos" : "channels";
      } catch {
        return "channels";
      }
    }),
    [videos, setVideos] = useState<ChannelChoice[]>(() => {
      try {
        const saved = JSON.parse(localStorage.getItem("cf.videos") ?? "[]");
        return Array.isArray(saved)
          ? saved.filter((c) => c && typeof c.source === "string")
          : [];
      } catch {
        return [];
      }
    }),
    [channels, setChannels] = useState<ChannelChoice[]>(() => {
      try {
        const saved = JSON.parse(localStorage.getItem("cf.channels") ?? "[]");
        return Array.isArray(saved)
          ? saved.filter((c) => c && typeof c.source === "string")
          : [];
      } catch {
        return [];
      }
    }),
    [presets, setPresets] = useState<ChannelPreset[]>([]),
    // The files of the presets shown as chips. Removing a chip only stops showing it; the
    // preset's file stays in the presets folder. null: not chosen yet (show them all once).
    [shownPresets, setShownPresets] = useState<string[] | null>(null),
    [areaMenu, setAreaMenu] = useState<{ x: number; y: number } | null>(null),
    [presetMenu, setPresetMenu] = useState<{
      x: number;
      y: number;
      name: string;
      file: string;
    } | null>(null),
    [chipMenu, setChipMenu] = useState<{
      x: number;
      y: number;
      source: string;
    } | null>(null),
    [presetName, setPresetName] = useState<string | null>(null),
    [replaceAsk, setReplaceAsk] = useState<string | null>(null),
    [renaming, setRenaming] = useState<{
      file: string;
      name: string;
      value: string;
    } | null>(null),
    [suggestions, setSuggestions] = useState<ChannelSuggestion[]>([]),
    [suggesting, setSuggesting] = useState(false),
    [suggestOpen, setSuggestOpen] = useState(false),
    [channelNote, setChannelNote] = useState(""),
    [lookingUpVideo, setLookingUpVideo] = useState(false),
    [captionSource, setCaptionSource] = useState<string>(() => {
      try {
        const saved = localStorage.getItem("cf.captionSource");
        return saved === "manual" || saved === "automatic" ? saved : "any";
      } catch {
        return "any";
      }
    }),
    [loadingStyle, setLoadingStyle] = useState<string>(() => {
      try {
        return localStorage.getItem("cf.loadingStyle") === "thumbnail"
          ? "thumbnail"
          : "spinner";
      } catch {
        return "spinner";
      }
    }),
    [mixChannels, setMixChannels] = useState<boolean>(() => {
      try {
        return localStorage.getItem("cf.mixChannels") === "1";
      } catch {
        return false;
      }
    }),
    [captionLanguage, setCaptionLanguage] = useState<string>(() => {
      try {
        return localStorage.getItem("cf.captionLanguage") || "auto";
      } catch {
        return "auto";
      }
    }),
    [scanCount, setScanCount] = useState(() => {
      const saved = Number(localStorage.getItem("cf.scan"));
      return validScan(saved) ? saved : DEFAULT_SCAN;
    }),
    [scanDraft, setScanDraft] = useState<string | null>(null),
    [phrase, setPhrase] = useState(() => localStorage.getItem("cf.phrase") ?? ""),
    [results, setResults] = useState<SearchResult[]>([]),
    [searchedPhrase, setSearchedPhrase] = useState(""),
    [searchStatus, setSearchStatus] = useState<SearchStatus>({
      state: "idle",
      scanned: 0,
      found: 0,
    }),
    [local, setLocal] = useState<{
      url: string;
      offset: number;
      length: number;
    } | null>(null),
    [localStatus, setLocalStatus] = useState(""),
    [browserAccess, setBrowserAccess] = useState(""),
    [appSession, setAppSession] = useState<boolean | null>(null),
    [settled, setSettled] = useState(0),
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
    localVideo = useRef<HTMLVideoElement>(null),
    timeline = useRef<HTMLDivElement>(null);
  // Commands go to the local preview when one is showing, else to YouTube's embedded player.
  const send = (action: string, value?: unknown) => {
    const v = localVideo.current;
    if (local && v) {
      if (action === "load") return;
      if (action === "seek" && typeof value === "number")
        v.currentTime = Math.max(
          0,
          Math.min(v.duration || local.length, value - local.offset),
        );
      else if (action === "play") void v.play().catch(() => {});
      else if (action === "pause") v.pause();
      else if (action === "toggle") {
        if (v.paused) void v.play().catch(() => {});
        else v.pause();
      }
      return;
    }
    iframe.current?.contentWindow?.postMessage(
      { token: token.current, action, value },
      origin,
    );
  };
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
  const onPlayer = (type: string, value: any) => {
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
          ? "YouTube rejected the player identity (error 153)."
          : [101, 150].includes(value)
            ? `YouTube’s embedded player won’t run here (error ${value}). That is usually a sign-in check, not a restriction by the video’s owner. A local preview is used instead.`
            : `YouTube player error ${value}. A local preview is used instead.`,
      );
      if (!local && localStatus !== "loading") void loadLocalPreview();
    }
  };
  const playerEvent = useRef(onPlayer);
  playerEvent.current = onPlayer;
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (
        e.source !== iframe.current?.contentWindow ||
        e.origin !== origin ||
        e.data?.token !== token.current
      )
        return;
      playerEvent.current(e.data.type, e.data.value);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [origin]);
  // A local preview reports its position like the embedded player does.
  useEffect(() => {
    if (!local) return;
    const timer = window.setInterval(() => {
      const v = localVideo.current;
      if (v && !v.paused) playerEvent.current("time", local.offset + v.currentTime);
    }, 80);
    return () => window.clearInterval(timer);
  }, [local]);
  // Cuts a small low-resolution copy around the selection and plays it here instead.
  const loadLocalPreview = async () => {
    if (!video || !isTauri()) return;
    const id = video.id;
    const a = Math.max(0, start - padding - 30);
    const b = Math.min(video.duration, a + 179, end + padding + 30);
    setLocalStatus("loading");
    try {
      const path = await invoke<string>("make_preview", { id, start: a, end: b });
      if (candidateRef.current !== id) return;
      setReady(false);
      setLocal({ url: convertFileSrc(path), offset: a, length: b - a });
      setLocalStatus("");
      setPlayerError("");
    } catch (e) {
      if (candidateRef.current === id) setLocalStatus(`error:${String(e)}`);
    }
  };
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
      const code = activeLanguage.current;
      const cacheKey = [id, code, activeSource.current, settings.browser, settings.cookiesFile].join(
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
          }>("caption_track", {
            url,
            language: code,
            source: activeSource.current,
          });
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
  // One player page serves every video; later videos are loaded into it by message, so it is
  // only rebuilt when the video area is emptied (a new search).
  const frameSrc = useRef("");
  const frameVideo = useRef("");
  const playerAutoplay = useRef(true);
  if (local || !candidate || !origin) {
    frameSrc.current = "";
    frameVideo.current = "";
  } else if (!frameSrc.current) {
    frameSrc.current = `${origin}/player?token=${token.current}&id=${candidate}&start=${playerStart.current.toFixed(2)}&play=${playerAutoplay.current ? 1 : 0}`;
    frameVideo.current = candidate;
  }
  useEffect(() => {
    if (candidate && frameSrc.current && frameVideo.current !== candidate) {
      frameVideo.current = candidate;
      send("load", {
        id: candidate,
        start: playerStart.current,
        play: playerAutoplay.current,
      });
    }
  }, [candidate]);
  const selectResult = (r: SearchResult, autoOpened = false) => {
    playerAutoplay.current = !(autoOpened && !settings.playFirstResult);
    const first = r.matches[0];
    candidateRef.current = r.video.id;
    matchRequest.current++;
    selectionGeneration.current++;
    dirtyName.current = false;
    captionCache.current.set(
      [r.video.id, activeLanguage.current, activeSource.current, settings.browser, settings.cookiesFile].join("|"),
      { video: r.video, track: r.track },
    );
    playerStart.current = Math.max(0, first.start - 2);
    captionCues.current = r.track.cues;
    setPickerOpen(false);
    setLocal(null);
    setLocalStatus("");
    setSelectedId(r.video.id);
    setCandidate(r.video.id);
    setSelectedLine(r.line);
    setPlayerError("");
    // Reselecting the video already in the player keeps it ready: nothing is reloaded.
    if (frameVideo.current !== r.video.id || local) setReady(false);
    else send("seek", playerStart.current);
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
  // The caption kind a search was started with, so its results and the video later opened
  // from them agree even if the setting is changed meanwhile.
  const activeSource = useRef(captionSource);
  const activeLanguage = useRef("auto");
  const removedSources = useRef(new Set<string>());
  const suggestRequest = useRef(0);
  const videosRef = useRef(videos);
  videosRef.current = videos;
  // The list being searched: channels or videos, depending on the mode.
  const items = searchMode === "videos" ? videos : channels;
  const noun = searchMode === "videos" ? "video" : "channel";
  useEffect(() => {
    try {
      localStorage.setItem(
        "cf.videos",
        JSON.stringify(videos.filter((v) => !v.loading)),
      );
    } catch {
      /* remembering the videos is only a convenience */
    }
  }, [videos]);
  const saveChannels = (next: ChannelChoice[]) => {
    if (searchMode === "videos") {
      setVideos(next);
      return;
    }
    setChannels(next);
    try {
      localStorage.setItem("cf.channels", JSON.stringify(next));
    } catch {
      /* remembering the channels is only a convenience */
    }
  };
  const addChannel = (choice: ChannelChoice) => {
    if (!items.some((c) => c.source === choice.source))
      saveChannels([...items, choice]);
    suggestRequest.current++;
    setChannel("");
    setSuggestions([]);
    setSuggesting(false);
    setSuggestOpen(false);
    setChannelNote("");
  };
  // Removing a channel also drops what it contributed to the results.
  const removeChannels = (gone: ChannelChoice[]) => {
    const sources = new Set(gone.map((c) => c.source));
    saveChannels(items.filter((x) => !sources.has(x.source)));
    sources.forEach((s) => removedSources.current.add(s));
    setResults((old) => old.filter((r) => !sources.has(r.source ?? "")));
    const shown = results.find((r) => r.video.id === candidateRef.current);
    if (shown && sources.has(shown.source ?? "")) {
      matchRequest.current++;
      candidateRef.current = "";
      setSelectedId("");
      setCandidate("");
      setVideo(null);
      setMatches([]);
      setSelectedLine("");
      setFileName("");
      setLocal(null);
    }
  };
  const removeChannel = (c: ChannelChoice) => removeChannels([c]);
  // Presets are files in the user's data folder, so they outlive a reset or reinstall.
  const shownKey = `cf.presetChips.${searchMode}`;
  const shownRef = useRef<string[] | null>(null);
  const updateShown = (next: string[] | null) => {
    shownRef.current = next;
    setShownPresets(next);
    if (next === null) return;
    try {
      localStorage.setItem(shownKey, JSON.stringify(next));
    } catch {
      /* remembering which presets are shown is only a convenience */
    }
  };
  const showPreset = (file: string) =>
    updateShown([...new Set([...(shownRef.current ?? []), file])]);
  const refreshPresets = () =>
    invoke<ChannelPreset[]>("list_presets", { kind: searchMode })
      .then((list) => {
        setPresets(list);
        // The first time presets are shown, every saved one is; after that only the ones the
        // user saved or loaded, until they remove them from the row.
        if (shownRef.current === null)
          updateShown(list.map((p) => p.file ?? p.name));
        return list;
      })
      .catch(() => {
        setPresets([]);
        return [] as ChannelPreset[];
      });
  // Files can change under the app (Finder), so look again whenever the window comes forward.
  useEffect(() => {
    if (!isTauri()) return;
    const again = () => void refreshPresets();
    window.addEventListener("focus", again);
    return () => window.removeEventListener("focus", again);
  }, [searchMode]);
  const savePreset = (replace = false) =>
    act(async () => {
      const name = (presetName ?? "").trim();
      if (!name || !items.length) return;
      // A name already in use: ask whether to replace it rather than refusing or overwriting.
      if (!replace && presets.some((p) => p.name.trim().toLowerCase() === name.toLowerCase())) {
        setReplaceAsk(name);
        return;
      }
      // Videos still being looked up get a moment to finish, so the preset keeps their titles.
      for (let i = 0; i < 80 && videosRef.current.some((v) => v.loading); i++)
        await new Promise((r) => window.setTimeout(r, 250));
      const list = searchMode === "videos" ? videosRef.current : items;
      let file: string;
      try {
        file = await invoke<string>("save_preset", {
          name,
          channels: list.map((c) => ({ ...c, loading: undefined })),
          kind: searchMode,
          replace,
        });
      } catch (e) {
        // The name is taken by a preset the list hadn't shown yet: offer to replace it too.
        if (!replace && String(e).includes("already exists")) {
          setReplaceAsk(name);
          return;
        }
        throw e;
      }
      showPreset(file);
      setPresetName(null);
      setReplaceAsk(null);
      // No message on success: the preset appearing in the row is the confirmation.
      await refreshPresets();
    });
  const renamePreset = () =>
    act(async () => {
      if (!renaming) return;
      const value = renaming.value.trim();
      try {
        if (value && value !== renaming.name)
          await invoke("rename_preset", {
            file: renaming.file,
            new: value,
            kind: searchMode,
          });
      } finally {
        setRenaming(null);
        await refreshPresets();
      }
    });
  // Removing a preset from the row never touches its file. It also takes the preset's own
  // channels or videos off the screen (and their results); anything else in the list stays.
  const hidePreset = (p: ChannelPreset) => {
    const file = p.file ?? p.name;
    updateShown((shownRef.current ?? []).filter((f) => f !== file));
    const own = new Set(p.channels.map((c) => c.source));
    removeChannels(items.filter((c) => own.has(c.source)));
  };
  useEffect(() => {
    if (!isTauri()) return;
    void (async () => {
      // Presets saved by earlier versions lived in the browser storage; move them to files.
      try {
        const old = JSON.parse(localStorage.getItem("cf.presets") ?? "[]");
        if (Array.isArray(old)) {
          const have = new Map(
            (await invoke<ChannelPreset[]>("list_presets")).map((p) => [
              p.name.toLowerCase(),
              JSON.stringify(p.channels.map((c) => c.source)),
            ]),
          );
          for (const p of old) {
            if (!p || typeof p.name !== "string" || !Array.isArray(p.channels))
              continue;
            const sources = JSON.stringify(
              p.channels.map((c: ChannelChoice) => c.source),
            );
            const same = have.get(p.name.toLowerCase());
            if (same === sources) continue;
            // Never discard a preset: a different one with the same name is kept under
            // another name.
            let name = p.name;
            for (let n = 2; same !== undefined && have.has(name.toLowerCase()); n++)
              name = `${p.name} (${n})`;
            await invoke("save_preset", { name, channels: p.channels });
            have.set(name.toLowerCase(), sources);
          }
        }
        localStorage.removeItem("cf.presets");
      } catch {
        /* nothing to move, or storage unavailable */
      }
      await refreshPresets();
    })();
  }, []);
  useEffect(() => {
    if (!presetMenu && !chipMenu && !areaMenu) return;
    const close = () => {
      setPresetMenu(null);
      setChipMenu(null);
      setAreaMenu(null);
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("click", close);
    window.addEventListener("blur", close);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("blur", close);
      window.removeEventListener("keydown", key);
    };
  }, [presetMenu, chipMenu, areaMenu]);
  // Each mode has its own presets: reload them when the mode changes.
  useEffect(() => {
    if (!isTauri()) return;
    setPresets([]);
    let saved: string[] | null = null;
    try {
      const parsed = JSON.parse(localStorage.getItem(shownKey) ?? "null");
      if (Array.isArray(parsed)) saved = parsed.filter((f) => typeof f === "string");
    } catch {
      /* start with nothing chosen */
    }
    shownRef.current = saved;
    setShownPresets(saved);
    void refreshPresets();
  }, [searchMode]);
  // Loading a preset replaces the current channels, and drops results from the ones it replaces.
  const loadPreset = (p: ChannelPreset) => {
    const keep = new Set(p.channels.map((c) => c.source));
    removeChannels(items.filter((c) => !keep.has(c.source)));
    saveChannels(p.channels);
    removedSources.current = new Set(
      [...removedSources.current].filter((s) => !keep.has(s)),
    );
  };
  // Adds a preset's entries to the current list without removing anything.
  const addPreset = (p: ChannelPreset) => {
    const fresh = p.channels.filter((c) => !items.some((x) => x.source === c.source));
    saveChannels([...items, ...fresh]);
    const keep = new Set(fresh.map((c) => c.source));
    removedSources.current = new Set(
      [...removedSources.current].filter((s) => !keep.has(s)),
    );
  };
  // Picks a preset file (the dialog opens in the presets folder), loads it, and shows it in
  // the row.
  const importPreset = () =>
    act(async () => {
      const picked = await invoke<{ name: string; file: string } | null>(
        "import_preset",
        { kind: searchMode },
      );
      if (!picked) return;
      const all = await invoke<ChannelPreset[]>("list_presets", { kind: searchMode });
      setPresets(all);
      showPreset(picked.file);
      const loaded = all.find((p) => (p.file ?? p.name) === picked.file);
      if (loaded) loadPreset(loaded);
    });
  const addSuggestion = (c: ChannelSuggestion) =>
    addChannel({
      source: `https://www.youtube.com/channel/${c.id}`,
      title: c.title,
      subscribers: c.subscribers,
      thumbnail: c.thumbnail,
    });
  // Recent lookups, so typing a name again doesn't search again.
  const lookupCache = useRef(
    new Map<string, { at: number; found: ChannelSuggestion[] }>(),
  );
  // Starts the pending lookup now, for Enter pressed before the typing pause has run out.
  const lookupNow = useRef<(() => void) | null>(null);
  // Look channels up as the user types, after a short pause, or find the channel of a pasted
  // video link. A lookup the user has typed past is stopped rather than left to finish.
  useEffect(() => {
    const text = channel.trim();
    const request = ++suggestRequest.current;
    const video = isVideoLink(text);
    lookupNow.current = null;
    setChannelNote("");
    setLookingUpVideo(video);
    if (isTauri()) void invoke("cancel_channel_lookups");
    if (
      !isTauri() ||
      searchMode === "videos" ||
      (!video && (text.length < 2 || looksLikeChannel(text)))
    ) {
      setSuggestions([]);
      setSuggesting(false);
      return;
    }
    const key = `${video ? "v" : "q"}:${text.toLowerCase()}`;
    const cached = lookupCache.current.get(key);
    if (cached && Date.now() - cached.at < 5 * 60 * 1000) {
      setSuggestions(cached.found);
      setChannelNote(cached.found.length ? "" : "No channels found.");
      setSuggesting(false);
      return;
    }
    setSuggestions([]);
    setSuggesting(true);
    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      {
        const lookup = video
          ? invoke<ChannelSuggestion>("channel_of_video", { url: text }).then(
              (c) => [c],
            )
          : invoke<ChannelSuggestion[]>("find_channels", { query: text });
        lookup
          .then((found) => {
            if (request !== suggestRequest.current) return;
            lookupCache.current.set(key, { at: Date.now(), found });
            setSuggestions(found);
            setChannelNote(found.length ? "" : "No channels found.");
          })
          .catch((e) => {
            if (request === suggestRequest.current) {
              setSuggestions([]);
              setChannelNote(String(e));
            }
          })
          .finally(() => {
            if (request === suggestRequest.current) setSuggesting(false);
          });
      }
    };
    const timer = window.setTimeout(run, video ? 0 : 600);
    lookupNow.current = () => {
      window.clearTimeout(timer);
      run();
    };
    return () => {
      window.clearTimeout(timer);
      lookupNow.current = null;
    };
  }, [channel, searchMode]);
  // Video mode: adds every video link in the text as soon as it is known, then fills in the
  // title and channel as they are looked up.
  const addVideos = (text: string) => {
    const links = parseVideoLinks(text);
    if (!links.length) {
      setChannelNote("Paste a YouTube video link (watch, youtu.be or shorts).");
      return;
    }
    setChannelNote("");
    const fresh = links.filter((l) => !videos.some((v) => v.source === l.source));
    setChannel("");
    if (!fresh.length) return;
    setVideos((old) => [
      ...old,
      ...fresh.map((l) => ({
        source: l.source,
        title: `youtube.com/watch?v=${l.id}`,
        loading: true,
      })),
    ]);
    for (const l of fresh)
      invoke<{ title: string; channel?: string; duration?: number }>(
        "video_info",
        { url: l.source },
      )
        .then((info) =>
          setVideos((old) =>
            old.map((v) =>
              v.source === l.source
                ? {
                    ...v,
                    title: info.title,
                    channel: info.channel ?? undefined,
                    duration: info.duration ?? undefined,
                    loading: false,
                  }
                : v,
            ),
          ),
        )
        .catch((e) => {
          // A link that can't be read is dropped, with the reason.
          setVideos((old) => old.filter((v) => v.source !== l.source));
          setChannelNote(`${l.source}: ${String(e)}`);
        });
  };
  const submitChannelText = () => {
    const text = channel.trim();
    if (!text) return;
    if (searchMode === "videos") {
      addVideos(text);
      return;
    }
    if (looksLikeChannel(text))
      addChannel({
        source: text,
        title: text
          .replace(/^https?:\/\/(www\.)?youtube\.com\//i, "")
          .replace(/\/videos\/?$/, ""),
      });
    else {
      // Enter on a name only shows the matching channels; the user picks one deliberately.
      setSuggestOpen(true);
      lookupNow.current?.();
    }
  };
  // Whether Enter will do something for the text in the field: add a pasted link or handle,
  // or show the matching channels while they haven't been listed yet.
  const channelText = channel.trim();
  const enterHint = !channelText
    ? ""
    : searchMode === "videos"
      ? parseVideoLinks(channelText).length
        ? "ready"
        : ""
      : looksLikeChannel(channelText)
      ? "ready"
      : channelText.length >= 2 && suggestions.length === 0 && !channelNote
        ? suggesting
          ? "waiting"
          : "ready"
        : "";
  const enterHintLabel =
    searchMode === "videos"
      ? "Add this video"
      : looksLikeChannel(channelText)
        ? "Add this channel"
        : "Show matching channels";
  // Switching between searching channels and searching videos starts from a clean slate: the
  // results belong to the old list, and each mode keeps its own list and presets.
  const switchMode = (next: SearchMode) => {
    if (next === searchMode) return;
    searchAbort.current?.abort();
    removedSources.current.clear();
    matchRequest.current++;
    candidateRef.current = "";
    setResults([]);
    setSettled(0);
    setSelectedId("");
    setCandidate("");
    setVideo(null);
    setMatches([]);
    setSelectedLine("");
    setFileName("");
    setLocal(null);
    setSearchedPhrase("");
    setSearchStatus({ state: "idle", scanned: 0, found: 0 });
    setChannel("");
    setChannelNote("");
    setSuggestions([]);
    setPresetName(null);
    setReplaceAsk(null);
    setRenaming(null);
    setPresetMenu(null);
    setChipMenu(null);
    setAreaMenu(null);
    setSearchMode(next);
    try {
      localStorage.setItem("cf.mode", next);
    } catch {
      /* remembering the mode is only a convenience */
    }
  };
  const runSearch = async () => {
    const text = phrase.trim();
    const pending = channel.trim();
    const source = captionSource;
    const language = captionLanguages(text, captionLanguage);
    // Video mode searches the listed videos, plus any link still waiting in the field.
    const searchVideos =
      searchMode === "videos"
        ? [
            ...videos.flatMap((v) => parseVideoLinks(v.source)),
            ...parseVideoLinks(pending).filter(
              (l) => !videos.some((v) => v.source === l.source),
            ),
          ]
        : [];
    const sources =
      searchMode === "videos"
        ? searchVideos.map((v) => v.source)
        : [
            ...channels.map((c) => c.source),
            ...(looksLikeChannel(pending) &&
            !channels.some((c) => c.source === pending)
              ? [pending]
              : []),
          ];
    if (!text) return;
    if (!sources.length) {
      setSearchStatus({
        state: "error",
        scanned: 0,
        found: 0,
        message:
          searchMode === "videos"
            ? pending
              ? "Paste a YouTube video link, then press Enter to add it."
              : "Add at least one video to search."
            : pending
              ? "Pick a channel from the suggestions first."
              : "Add at least one channel to search.",
      });
      return;
    }
    if (!isTauri()) {
      setSearchStatus({
        state: "error",
        scanned: 0,
        found: 0,
        message: "Open the desktop app to search.",
      });
      return;
    }
    try {
      localStorage.setItem("cf.phrase", text);
      localStorage.setItem("cf.scan", String(scanCount));
    } catch {
      /* remembering the last search is only a convenience */
    }
    activeSource.current = source;
    activeLanguage.current = language;
    searchAbort.current?.abort();
    const control = new AbortController();
    searchAbort.current = control;
    removedSources.current.clear();
    matchRequest.current++;
    candidateRef.current = "";
    setResults([]);
    setSettled(0);
    setSelectedId("");
    setCandidate("");
    setVideo(null);
    setMatches([]);
    setSelectedLine("");
    setFileName("");
    if (searchMode === "videos") {
      if (parseVideoLinks(pending).length) addVideos(pending);
    } else if (
      looksLikeChannel(pending) &&
      !channels.some((c) => c.source === pending)
    )
      addChannel({ source: pending, title: pending });
    setSearchedPhrase(text);
    setSearchStatus({ state: "running", scanned: 0, found: 0 });
    try {
      const outcome = await searchChannel(
        {
          list:
            searchMode === "videos"
              ? videoLister(searchVideos)
              : mergedLister(
                  (source, from, count) =>
                    invoke<ChannelEntry[]>("list_channel", {
                      channel: source,
                      from,
                      count,
                    }),
                  sources,
                  scanCount,
                  30,
                  mixChannels,
                ),
          captions: async (id) => {
            const key = [id, language, source, settings.browser, settings.cookiesFile].join("|");
            const cached = captionCache.current.get(key);
            if (cached) return cached;
            const found = await invoke<{ video: Video; track: CaptionTrack }>(
              "caption_track",
              {
                url: `https://www.youtube.com/watch?v=${id}`,
                language,
                source,
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
          cap: searchMode === "videos" ? sources.length : scanCount * sources.length,
          concurrency: 3,
          signal: control.signal,
          onResult: (r) =>
            !removedSources.current.has(r.source ?? "") &&
            setResults((old) => [...old, r].sort((a, b) => a.order - b.order)),
          onSettled: (upTo) => setSettled(upTo),
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
  // Open the top result only once no earlier video can still turn up a match; otherwise a
  // later video that happens to finish first would be selected and then sit below others.
  useEffect(() => {
    if (!candidate && results.length > 0 && settled >= results[0].order)
      selectResult(results[0], true);
  }, [results, settled]);
  // macOS can refuse this app access to a browser's cookies; ask, and recheck when the user
  // comes back from System Settings.
  const checkBrowserAccess = (browser: string) => {
    if (!isTauri() || !browser || browser === "app") {
      setBrowserAccess("");
      return;
    }
    invoke<string>("check_browser_access", { browser })
      .then(setBrowserAccess)
      .catch(() => setBrowserAccess(""));
  };
  // The app's own YouTube session works only once the user has signed in inside the app.
  const checkAppSession = () => {
    if (!isTauri() || settings.browser !== "app") {
      setAppSession(null);
      return;
    }
    invoke<boolean>("app_session_status")
      .then(setAppSession)
      .catch(() => setAppSession(null));
  };
  useEffect(() => {
    if (!showSettings) return;
    checkBrowserAccess(settings.browser);
    checkAppSession();
    const recheck = () => {
      checkBrowserAccess(settings.browser);
      checkAppSession();
    };
    window.addEventListener("focus", recheck);
    return () => window.removeEventListener("focus", recheck);
  }, [showSettings, settings.browser]);
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
        <section
          className="url-card"
          onContextMenu={(e) => {
            // Right-clicking empty space opens the list actions; controls keep their own menus.
            if ((e.target as HTMLElement).closest(".chip, button, input, select, label"))
              return;
            e.preventDefault();
            setPresetMenu(null);
            setChipMenu(null);
            setAreaMenu({ x: e.clientX, y: e.clientY });
          }}
        >
          <div className="mode-switch" role="group" aria-label="Search across">
            <span className="mode-label">Search across</span>
            <div className="mode-buttons">
              {(["channels", "videos"] as SearchMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={searchMode === m ? "active" : ""}
                  aria-pressed={searchMode === m}
                  onClick={() => switchMode(m)}
                >
                  {m === "channels" ? "Channels" : "Videos"}
                </button>
              ))}
            </div>
          </div>
          <form
            className="search-row"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchStatus.state !== "running") void runSearch();
            }}
          >
            <div className="channel-box">
              <label className="field" htmlFor="channel">
                <span>
                  YouTube {noun}
                  {items.length > 0 ? "s" : ""}
                </span>
                <input
                  id="channel"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  value={channel}
                  onChange={(e) => {
                    setChannel(e.target.value);
                    setSuggestOpen(true);
                    if (searchMode === "videos") setChannelNote("");
                  }}
                  onPaste={(e) => {
                    // Pasting one or several video links adds them straight away.
                    if (searchMode !== "videos") return;
                    const text = e.clipboardData.getData("text");
                    if (parseVideoLinks(text).length) {
                      e.preventDefault();
                      addVideos(text);
                    }
                  }}
                  onFocus={() => setSuggestOpen(true)}
                  onBlur={() => window.setTimeout(() => setSuggestOpen(false), 150)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && channel.trim()) {
                      e.preventDefault();
                      submitChannelText();
                    } else if (e.key === "Escape") setSuggestOpen(false);
                  }}
                  placeholder={
                    searchMode === "videos"
                      ? items.length
                        ? "Add another video link"
                        : "Paste a YouTube video link"
                      : items.length
                        ? "Add another channel"
                        : "Channel name, link or @handle"
                  }
                />
              </label>
              {enterHint && (
                // Clicking does what Enter does in the field. Inside the search form, so it
                // must not be a submit button; it keeps focus in the field (so the suggestion
                // list isn't closed by the blur) and stays out of the Tab order, since Enter
                // already covers keyboard use.
                <button
                  type="button"
                  tabIndex={-1}
                  className={`enter-hint ${enterHint}`}
                  aria-label={enterHintLabel}
                  title={`${enterHintLabel} (Enter)`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={submitChannelText}
                >
                  ↵
                </button>
              )}
              {searchMode === "videos" && channelNote && (
                <p className="field-note" role="status">
                  {channelNote}
                </p>
              )}
              {searchMode === "channels" &&
                suggestOpen &&
                (suggesting || suggestions.length > 0 || channelNote) && (
                <ul className="suggestions" role="listbox">
                  {suggestions.length > 0 && lookingUpVideo && (
                    <li className="note">Channel of this video:</li>
                  )}
                  {suggesting && (
                    <li className="note looking">
                      <span className="spinner" aria-hidden="true" />
                      {lookingUpVideo
                        ? "Finding this video’s channel"
                        : "Looking up channels"}
                      <span className="dots" aria-hidden="true" />
                    </li>
                  )}
                  {!suggesting && channelNote && <li className="note">{channelNote}</li>}
                  {suggestions.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected="false"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => addSuggestion(c)}
                      >
                        {c.thumbnail ? (
                          <img src={c.thumbnail} alt="" />
                        ) : (
                          <span className="avatar" />
                        )}
                        <span>
                          <strong>{c.title}</strong>
                          <small>
                            {[subscriberText(c.subscribers) && `${subscriberText(c.subscribers)} subs`, c.handle]
                              .filter(Boolean)
                              .join(" · ")}
                          </small>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
                  key="stop"
                  className="search-button"
                  type="button"
                  onClick={cancelSearch}
                >
                  <span className="spinner" aria-hidden="true" />
                  Stop
                </button>
              ) : (
                <button
                  key="search"
                  className="primary search-button"
                  type="submit"
                >
                  Search →
                </button>
              )}
            </div>
          </form>
          {(
            <div className="preset-row" aria-label={`Presets of ${noun}s`}>
              <span className="preset-label">Presets</span>
              {presets
                .filter((p) => (shownPresets ?? []).includes(p.file ?? p.name))
                .map((p) => (
                <span
                  className="chip preset"
                  key={p.file ?? p.name}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setChipMenu(null);
                    setPresetMenu({
                      x: e.clientX,
                      y: e.clientY,
                      name: p.name,
                      file: p.file ?? p.name,
                    });
                  }}
                >
                  {renaming?.file === (p.file ?? p.name) ? (
                    <input
                      className="preset-rename"
                      autoFocus
                      value={renaming.value}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) =>
                        setRenaming({
                          file: p.file ?? p.name,
                          name: p.name,
                          value: e.target.value,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void renamePreset();
                        } else if (e.key === "Escape") setRenaming(null);
                      }}
                      onBlur={() => setRenaming(null)}
                    />
                  ) : (
                    <button
                      type="button"
                      className="preset-load"
                      title={p.channels.map((c) => c.title).join(", ")}
                      onClick={() => loadPreset(p)}
                    >
                      {p.name}
                      <small>{p.channels.length}</small>
                    </button>
                  )}
                  <button
                    type="button"
                    aria-label={`Remove preset ${p.name} from the list`}
                    onClick={() => hidePreset(p)}
                  >
                    ×
                  </button>
                </span>
              ))}
              {(
                presetName === null ? (
                  <button
                    type="button"
                    className="preset-save"
                    disabled={items.length === 0}
                    onClick={() => setPresetName("")}
                  >
                    Save preset
                  </button>
                ) : replaceAsk ? (
                  <span className="preset-form">
                    <span className="preset-note">
                      A preset named “{replaceAsk}” already exists.
                    </span>
                    <button type="button" onClick={() => void savePreset(true)}>
                      Replace it
                    </button>
                    <button type="button" onClick={() => setReplaceAsk(null)}>
                      Choose another name
                    </button>
                  </span>
                ) : (
                  <span className="preset-form">
                    <input
                      autoFocus
                      value={presetName}
                      placeholder="Preset name"
                      onChange={(e) => setPresetName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void savePreset();
                        } else if (e.key === "Escape") setPresetName(null);
                      }}
                    />
                    <button
                      type="button"
                      disabled={!presetName.trim()}
                      onClick={() => void savePreset()}
                    >
                      Save
                    </button>
                    <button type="button" onClick={() => setPresetName(null)}>
                      Cancel
                    </button>
                  </span>
                ))}
              <button
                type="button"
                className="preset-save"
                onClick={() => void importPreset()}
              >
                Load preset
              </button>
            </div>
          )}
          {items.length > 0 && (
            <div className="channel-chips" aria-label={`${noun}s to search`}>
              {items.map((c) => (
                <span
                  className={c.loading ? "chip loading" : "chip"}
                  key={c.source}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setPresetMenu(null);
                    setChipMenu({ x: e.clientX, y: e.clientY, source: c.source });
                  }}
                >
                  <span className="chip-title" title={c.title}>
                    {c.title}
                  </span>
                  {c.subscribers ? <small>{subscriberText(c.subscribers)}</small> : null}
                  {c.channel ? <small className="chip-channel">{c.channel}</small> : null}
                  <button
                    type="button"
                    aria-label={`Remove ${c.title}`}
                    onClick={() => removeChannel(c)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>
        {areaMenu && (
          <ul
            className="context-menu"
            role="menu"
            style={{ left: areaMenu.x, top: areaMenu.y }}
          >
            <li>
              <button
                role="menuitem"
                disabled={items.length === 0}
                onClick={() => removeChannels(items)}
              >
                Clear files
              </button>
            </li>
            <li>
              <button
                role="menuitem"
                disabled={!(shownPresets ?? []).length}
                onClick={() => updateShown([])}
              >
                Clear presets
              </button>
            </li>
            <li>
              <button
                role="menuitem"
                onClick={() =>
                  act(() => invoke("show_presets_folder", { kind: searchMode }))
                }
              >
                Show presets folder
              </button>
            </li>
          </ul>
        )}
        {chipMenu && (
          <ul
            className="context-menu"
            role="menu"
            style={{ left: chipMenu.x, top: chipMenu.y }}
          >
            <li>
              <button
                role="menuitem"
                onClick={() =>
                  removeChannels(
                    items.filter((c) => c.source === chipMenu.source),
                  )
                }
              >
                Remove
              </button>
            </li>
            <li>
              <button role="menuitem" onClick={() => removeChannels(items)}>
                Remove all
              </button>
            </li>
          </ul>
        )}
        {presetMenu && (
          <ul
            className="context-menu"
            role="menu"
            style={{ left: presetMenu.x, top: presetMenu.y }}
          >
            <li>
              <button
                role="menuitem"
                onClick={() => {
                  const p = presets.find((x) => (x.file ?? x.name) === presetMenu.file);
                  if (p) loadPreset(p);
                }}
              >
                Load
              </button>
            </li>
            <li>
              <button
                role="menuitem"
                onClick={() => {
                  const p = presets.find((x) => (x.file ?? x.name) === presetMenu.file);
                  if (p) addPreset(p);
                }}
              >
                Add to current list
              </button>
            </li>
            <li>
              <button
                role="menuitem"
                onClick={() =>
                  act(() => invoke("reveal_preset", { file: presetMenu.file, kind: searchMode }))
                }
              >
                Show in Finder
              </button>
            </li>
            <li>
              <button
                role="menuitem"
                onClick={() =>
                  setRenaming({
                    file: presetMenu.file,
                    name: presetMenu.name,
                    value: presetMenu.name,
                  })
                }
              >
                Rename
              </button>
            </li>
            <li>
              <button
                role="menuitem"
                onClick={() => {
                  const p = presets.find((x) => (x.file ?? x.name) === presetMenu.file);
                  if (p) hidePreset(p);
                }}
              >
                Remove from list
              </button>
            </li>
          </ul>
        )}
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
                  {searchStatusText(searchStatus, searchMode)}{" "}
                  {/Full Disk Access/.test(searchStatus.message ?? "") && (
                    <button
                      type="button"
                      className="inline-action"
                      onClick={() => act(() => invoke("open_privacy_settings"))}
                    >
                      Open privacy settings
                    </button>
                  )}{" "}
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
            {local ? (
              <video
                key={local.url}
                ref={localVideo}
                src={local.url}
                controls
                playsInline
                onLoadedMetadata={(e) => {
                  const v = e.currentTarget;
                  v.currentTime = Math.max(
                    0,
                    Math.min(v.duration || 0, playerStart.current - local.offset),
                  );
                  playerEvent.current("ready", true);
                }}
                onPlay={() => playerEvent.current("state", 1)}
                onPause={() => playerEvent.current("state", 2)}
                onEnded={() => playerEvent.current("state", 0)}
                onError={() =>
                  setLocalStatus("error:The preview file could not be played.")
                }
              />
            ) : candidate && origin ? (
              <>
                {/* Until the new player is up, show the video's own thumbnail: a player being
                    rebuilt would otherwise flash empty and black. */}
                {loadingStyle === "spinner" ? (
                  <div className="player-poster player-spinner" aria-hidden="true">
                    <span className="spinner" />
                  </div>
                ) : (
                  <img
                    className="player-poster"
                    src={
                      results.find((r) => r.video.id === candidate)?.video
                        .thumbnail ||
                      `https://i.ytimg.com/vi/${candidate}/mqdefault.jpg`
                    }
                    alt=""
                  />
                )}
              <iframe
                className={ready || playerError ? "player-live" : "player-loading"}
                ref={iframe}
                title="YouTube player"
                src={frameSrc.current}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
              </>
            ) : (
              <div className="empty-player">
                <div className="play-symbol">▶</div>
                <h3>Your video appears here</h3>
                <p>Search a channel, then select a result.</p>
              </div>
            )}
          </div>
          {localStatus === "loading" && (
            <p className="metadata-status" role="status">
              <span className="analyze-spinner" aria-hidden="true" />
              Preparing a local preview…
            </p>
          )}
          {localStatus.startsWith("error:") && (
            <div className="notice error">
              {localStatus.slice(6)}{" "}
              <button onClick={() => void loadLocalPreview()}>Try again</button>
            </div>
          )}
          {local && (
            <p className="metadata-status">
              Local preview of {timestamp(local.offset)} –{" "}
              {timestamp(local.offset + local.length)}. Move In and Out inside
              it, or{" "}
              <button
                className="inline-action"
                onClick={() => void loadLocalPreview()}
              >
                reload around your selection
              </button>
              .
            </p>
          )}
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
              {!local && localStatus !== "loading" && (
                <button onClick={() => void loadLocalPreview()}>
                  Local preview
                </button>
              )}
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
              className={settings.destination ? undefined : "attention"}
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
            {browserAccess === "blocked" && (
              <div
                className="notice error access-notice"
                role="alert"
                style={{ display: "block" }}
              >
                <p>
                  macOS is blocking Caption Finder from reading this browser’s
                  cookies. Press the button: System Settings opens with a small
                  Caption Finder window beside it. Drag its icon into the Full
                  Disk Access list, switch it on, and reopen the app. No
                  permission is needed if you choose Opera or Vivaldi instead,
                  or sign in with the app’s own YouTube session above. If
                  Caption Finder is already in the list but this message
                  stays, that entry belongs to an older build: remove it with
                  the − button and drag the icon in again.
                </p>
                <div className="playback-test-actions">
                  <button
                    onClick={() => act(() => invoke("open_privacy_settings"))}
                  >
                    Allow access in System Settings ↗
                  </button>
                  <button onClick={() => checkBrowserAccess(settings.browser)}>
                    Check again
                  </button>
                </div>
              </div>
            )}
            {settings.browser === "app" && appSession === false && (
              <div
                className="notice error access-notice"
                role="alert"
                style={{ display: "block" }}
              >
                <p>
                  You’re not signed in to YouTube in this app yet. Press “1.
                  Sign in to Google”, then “2. Connect YouTube” above, and
                  choose your channel if asked. Until then, searches and
                  downloads can’t use this option.
                </p>
                <div className="playback-test-actions">
                  <button
                    onClick={() => act(() => invoke("youtube_sign_in_window"))}
                  >
                    1. Sign in to Google ↗
                  </button>
                  <button onClick={() => checkAppSession()}>Check again</button>
                </div>
              </div>
            )}
            {settings.browser === "app" && appSession === true && (
              <p className="access-ok">✓ Signed in to YouTube in this app.</p>
            )}
            {browserAccess === "ok" && settings.browser && (
              <p className="access-ok">
                ✓ Caption Finder can read this browser’s cookies.
              </p>
            )}
            <p className="notice">
              Selecting the app’s session uses only its YouTube cookies in a temporary file, removed when the operation finishes. Selecting another browser authorizes yt-dlp to read its cookies when you
              analyze or download. Your operating system may request browser cookie-store

              access. Cookies are never printed or copied into app settings, or
              injected into the video player. This setting controls caption
              retrieval and downloads; the player uses the app’s own sign-in
              above.
            </p>
            <Field label="Videos to scan per search">
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={MAX_SCAN}
                step={1}
                value={scanDraft ?? scanCount}
                onChange={(e) => {
                  setScanDraft(e.target.value);
                  const n = Number(e.target.value);
                  if (e.target.value.trim() && validScan(n)) {
                    setScanCount(n);
                    try {
                      localStorage.setItem("cf.scan", String(n));
                    } catch {
                      /* remembering the choice is only a convenience */
                    }
                  }
                }}
                onBlur={() => setScanDraft(null)}
              />
              <small>
                Newest videos checked per search, 1–{MAX_SCAN}. Default{" "}
                {DEFAULT_SCAN}.
              </small>
            </Field>
            <label className="check-row">
              <input
                type="checkbox"
                checked={!settings.playFirstResult}
                onChange={(e) =>
                  act(() =>
                    save({ ...settings, playFirstResult: !e.target.checked }),
                  )
                }
              />
              <span>Don’t play the first found video automatically</span>
            </label>
            <Field label="While a video loads">
              <select
                value={loadingStyle}
                onChange={(e) => {
                  setLoadingStyle(e.target.value);
                  try {
                    localStorage.setItem("cf.loadingStyle", e.target.value);
                  } catch {
                    /* remembering the choice is only a convenience */
                  }
                }}
              >
                <option value="thumbnail">Show Thumbnail</option>
                <option value="spinner">Show Spinner</option>
              </select>
            </Field>
            <Field label="Results from several channels">
              <select
                value={mixChannels ? "mix" : "sequential"}
                onChange={(e) => {
                  const mix = e.target.value === "mix";
                  setMixChannels(mix);
                  try {
                    localStorage.setItem("cf.mixChannels", mix ? "1" : "0");
                  } catch {
                    /* remembering the choice is only a convenience */
                  }
                }}
              >
                <option value="sequential">One channel after another</option>
                <option value="mix">Mix channels (take turns)</option>
              </select>
              <small>
                Mixing takes the newest video from each channel, then the next
                newest from each, and so on. Applies to the next search.
              </small>
            </Field>
            <Field label="Caption language">
              <select
                value={captionLanguage}
                onChange={(e) => {
                  setCaptionLanguage(e.target.value);
                  try {
                    localStorage.setItem("cf.captionLanguage", e.target.value);
                  } catch {
                    /* remembering the choice is only a convenience */
                  }
                }}
              >
                <option value="auto">
                  Automatic (from the search phrase)
                </option>
                {LANGUAGE_CHOICES.map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
              <small>
                Automatic follows the phrase’s alphabet, or the language each
                video is spoken in for Latin letters. Pick a language to search
                its captions or dubbed audio tracks.
              </small>
            </Field>
            <Field label="Search in captions">
              <select
                value={captionSource}
                onChange={(e) => {
                  setCaptionSource(e.target.value);
                  try {
                    localStorage.setItem("cf.captionSource", e.target.value);
                  } catch {
                    /* remembering the choice is only a convenience */
                  }
                }}
              >
                <option value="any">Either (uploaded captions preferred)</option>
                <option value="manual">Uploaded (manual) captions only</option>
                <option value="automatic">Automatic captions only</option>
              </select>
              <small>
                Applies to the next search. Videos without the chosen kind are
                skipped.
              </small>
            </Field>
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
const helperWindow =
  new URLSearchParams(window.location.search).get("helper") === "grant";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>{helperWindow ? <GrantHelper /> : <App />}</React.StrictMode>,
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
