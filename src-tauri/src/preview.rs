//! A short, low-resolution cut around a match, played inside the app when YouTube's own embedded
//! player refuses to run (it often answers with a "sign in to confirm you're not a bot" page).
use crate::{base, model::Settings, platform, safe_error, session};
use std::{
    path::PathBuf,
    process::Stdio,
    sync::Arc,
    time::{Duration, SystemTime},
};

const MAX_SECONDS: f64 = 180.0;
const KEEP_FOR: Duration = Duration::from_secs(24 * 60 * 60);
// Small and widely playable: a progressive 360p MP4 if there is one, otherwise the next best.
const FORMAT: &str =
    "b[height<=360][ext=mp4]/18/b[height<=480][ext=mp4]/bv*[height<=480][ext=mp4]+ba[ext=m4a]/b[height<=480]";

fn validate(id: &str, start: f64, end: f64) -> Result<(), String> {
    let id_ok = id.len() == 11 && id.bytes().all(|b| b.is_ascii_alphanumeric() || b == b'-' || b == b'_');
    if !id_ok {
        return Err("Invalid video id".into());
    }
    if !(start.is_finite() && end.is_finite() && start >= 0. && end > start) {
        return Err("Invalid preview range".into());
    }
    if end - start > MAX_SECONDS {
        return Err("The preview range is too long".into());
    }
    Ok(())
}

fn file_name(id: &str, start: f64, end: f64) -> String {
    format!("{id}_{}_{}.mp4", (start * 1000.).round() as u64, (end * 1000.).round() as u64)
}

/// Removes previews older than a day so the cache folder doesn't grow without bound.
fn prune(dir: &std::path::Path) {
    let Ok(entries) = std::fs::read_dir(dir) else {
        return;
    };
    for entry in entries.flatten() {
        let old = entry
            .metadata()
            .and_then(|m| m.modified())
            .ok()
            .and_then(|t| SystemTime::now().duration_since(t).ok())
            .is_some_and(|age| age > KEEP_FOR);
        if old {
            let _ = std::fs::remove_file(entry.path());
        }
    }
}

pub fn make(
    app: &tauri::AppHandle,
    settings: Settings,
    saved: Option<Arc<Vec<u8>>>,
    id: &str,
    start: f64,
    end: f64,
    dir: PathBuf,
) -> Result<PathBuf, String> {
    validate(id, start, end)?;
    std::fs::create_dir_all(&dir).map_err(|_| "Cannot create the preview folder")?;
    prune(&dir);
    let dest = dir.join(file_name(id, start, end));
    if dest.is_file() {
        return Ok(dest);
    }
    // Reusing the metadata fetched by the caption lookup avoids extracting the video again; if its
    // signed links have expired, the second attempt extracts it afresh.
    let mut last = String::new();
    for use_saved in [saved.is_some(), false] {
        let mut c = base(&settings)?;
        let info = use_saved
            .then(|| saved.as_ref().and_then(|json| session::write_metadata(app, json).ok()))
            .flatten();
        c.args([
            "-f",
            FORMAT,
            "--merge-output-format",
            "mp4",
            "--download-sections",
            &format!("*{start:.2}-{end:.2}"),
            "--force-overwrites",
            "--no-part",
            "--sleep-requests",
            "0",
            "-o",
        ])
        .arg(&dest);
        match &info {
            Some(file) => c.arg("--load-info-json").arg(&file.0),
            None => c.arg("--").arg(format!("https://www.youtube.com/watch?v={id}")),
        };
        c.stdout(Stdio::piped()).stderr(Stdio::piped());
        let o = platform::output(&mut c).map_err(|_| "Cannot start yt-dlp")?;
        if o.status.success() && dest.is_file() {
            return Ok(dest);
        }
        last = safe_error(&String::from_utf8_lossy(&o.stderr));
        let _ = std::fs::remove_file(&dest);
        if info.is_none() {
            break;
        }
    }
    Err(last)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn rejects_bad_ids_and_ranges() {
        assert!(validate("H14bBuluwB8", 1.0, 20.0).is_ok());
        assert!(validate("short", 1.0, 20.0).is_err());
        assert!(validate("../../etc/pw", 1.0, 20.0).is_err());
        assert!(validate("H14bBuluwB8", 20.0, 20.0).is_err());
        assert!(validate("H14bBuluwB8", -1.0, 20.0).is_err());
        assert!(validate("H14bBuluwB8", f64::NAN, 20.0).is_err());
        assert!(validate("H14bBuluwB8", 0.0, 500.0).is_err());
    }
    #[test]
    fn names_encode_the_range() {
        assert_eq!(file_name("H14bBuluwB8", 5.5, 65.25), "H14bBuluwB8_5500_65250.mp4");
    }
}
