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
    startDrag({
      item: [bundle],
      icon: appIcon.replace(/^data:image\/\w+;base64,/, ""),
    }).catch((err) => setError(String(err)));
  };
  return (
    <div className="helper">
      <strong>Turn on Caption Finder in the Full Disk Access list</strong>
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
        </>
      )}
      {error && <p className="helper-error">{error}</p>}
      <button onClick={() => void invoke("close_grant_helper")}>Done</button>
    </div>
  );
}
