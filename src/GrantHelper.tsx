import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { startDrag } from "@crabnebula/tauri-plugin-drag";
import appIcon from "./assets/app-icon.png?inline";

/**
 * Small window shown beside System Settings. macOS has no prompt for Full Disk Access and
 * lists apps only once they are dragged in, so the app's own icon is draggable from here.
 */
export default function GrantHelper() {
  const [bundle, setBundle] = useState<string | null | undefined>(undefined),
    [error, setError] = useState("");
  useEffect(() => {
    invoke<string | null>("app_bundle_path")
      .then(setBundle)
      .catch(() => setBundle(null));
  }, []);
  const drag = (e: React.DragEvent) => {
    e.preventDefault();
    if (!bundle) return;
    setError("");
    // The plugin wants the icon as a full "data:image/png;base64,…" string, prefix included.
    startDrag({ item: [bundle], icon: appIcon }).catch((err) =>
      setError(String(err)),
    );
  };
  return (
    <div className="helper">
      <div className="helper-bar" data-tauri-drag-region>
        <button
          className="helper-close"
          aria-label="Close"
          onClick={() => void invoke("close_grant_helper")}
        >
          ✕
        </button>
      </div>
      <strong>Turn on Caption Finder in this list</strong>
      {bundle === null ? (
        <p>
          This copy isn’t a packaged app, so it can’t be added. Open the
          installed Caption Finder and try again.
        </p>
      ) : (
        <>
          <img
            className="helper-icon"
            src={appIcon}
            alt="Caption Finder"
            draggable
            onDragStart={drag}
            title="Drag into the list"
          />
          <p>
            Not in the list? Drag this icon into it, then switch it on. When
            macOS asks, choose <em>Quit &amp; Reopen</em>.
          </p>
          <p>
            Already listed but still blocked? That entry belongs to an older
            build: select it, press − under the list, then drag this icon in.
          </p>
        </>
      )}
      {error && <p className="helper-error">{error}</p>}
    </div>
  );
}
