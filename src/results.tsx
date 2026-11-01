import { timestamp } from "./domain";
import type { SearchResult } from "./search";
import { UNSPACED, words } from "./subtitles";

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Marks the searched phrase inside a caption line, ignoring case and punctuation between words. */
export function Highlight({ line, phrase }: { line: string; phrase: string }) {
  const tokens = words(phrase);
  if (!tokens.length) return <>{line}</>;
  const unspaced = new RegExp(`[${UNSPACED}]`, "u");
  // Words need a separator between them; characters of unspaced scripts don't.
  const pattern = new RegExp(
    `(${tokens
      .map((t, i) => {
        const gap =
          i === 0 ? "" : unspaced.test(t) || unspaced.test(tokens[i - 1]) ? "[^\\p{L}\\p{M}\\p{N}]*" : "[^\\p{L}\\p{M}\\p{N}]+";
        return gap + escape(t);
      })
      .join("")})`,
    "iu",
  );
  const [before, hit, ...rest] = line.split(pattern);
  if (hit === undefined) return <>{line}</>;
  return (
    <>
      {before}
      <mark>{hit}</mark>
      {rest.join("")}
    </>
  );
}

function PlaceholderRow({
  number,
  searching,
}: {
  number: number;
  searching: boolean;
}) {
  return (
    <li aria-hidden="true">
      <div className={`result-row placeholder${searching ? " searching" : ""}`}>
        <span className="thumb">
          <span className="slot-number">{number}</span>
        </span>
        <span className="result-body">
          <span className="bar title-bar" />
          <span className="bar line-bar" />
          <span className="bar line-bar short" />
          <span className="result-meta">
            <span className="bar chip-bar" />
            <span className="bar chip-bar" />
          </span>
        </span>
      </div>
    </li>
  );
}

export function ResultsList({
  results,
  slots,
  searching,
  phrase,
  selectedId,
  onSelect,
}: {
  results: SearchResult[];
  /** total rows to show; slots without a result are placeholders */
  slots: number;
  searching: boolean;
  phrase: string;
  selectedId: string;
  onSelect: (result: SearchResult) => void;
}) {
  const empty = Math.max(0, slots - results.length);
  return (
    <ul className="results">
      {results.map((r) => (
        <li key={r.video.id}>
          <button
            type="button"
            className={`result-row${r.video.id === selectedId ? " selected" : ""}`}
            aria-pressed={r.video.id === selectedId}
            onClick={() => onSelect(r)}
          >
            <span className="thumb">
              <img
                src={r.video.thumbnail || `https://i.ytimg.com/vi/${r.video.id}/mqdefault.jpg`}
                alt=""
                loading="lazy"
              />
            </span>
            <span className="result-body">
              <span className="result-title">{r.video.title}</span>
              <span className="result-line">
                <Highlight line={r.line} phrase={phrase} />
              </span>
              <span className="result-meta">
                <span className="chip">{timestamp(r.matches[0].start)}</span>
                <span className="chip">
                  {r.matches.length}{" "}
                  {r.matches.length === 1 ? "match" : "matches"}
                </span>
                {r.track.kind.includes("automatic") && (
                  <span className="chip subtle">auto captions</span>
                )}
              </span>
            </span>
          </button>
        </li>
      ))}
      {Array.from({ length: empty }, (_, i) => (
        <PlaceholderRow
          key={`p${i}`}
          number={results.length + i + 1}
          searching={searching}
        />
      ))}
    </ul>
  );
}
