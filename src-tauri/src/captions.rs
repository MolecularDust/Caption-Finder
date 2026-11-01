use crate::{base, base_with, model::Settings, safe_error};
use serde_json::{json, Value};
use std::{path::PathBuf, process::Stdio};
struct TempDir(PathBuf);
impl Drop for TempDir {
    fn drop(&mut self) {
        let _ = std::fs::remove_dir_all(&self.0);
    }
}
fn track(v: &Value, language: &str) -> Option<(String, bool)> {
    let manual = v["subtitles"].as_object();
    if let Some(map) = manual {
        let mut keys = map
            .keys()
            .filter(|k| *k == language || k.starts_with(&format!("{language}-")))
            .collect::<Vec<_>>();
        keys.sort_by_key(|k| (if k.as_str() == language { 0 } else { 1 }, k.as_str()));
        if let Some(k) = keys.first() {
            return Some(((*k).clone(), false));
        }
    }
    let auto = v["automatic_captions"].as_object()?;
    for key in [format!("{language}-orig"), language.to_string()] {
        if auto.get(&key).and_then(Value::as_array).is_some_and(|a| {
            a.iter().any(|f| {
                f["url"].as_str().is_some_and(|u| {
                    url::Url::parse(u)
                        .ok()
                        .is_some_and(|u| !u.query_pairs().any(|(k, _)| k == "tlang"))
                })
            })
        }) {
            return Some((key, true));
        }
    }
    None
}
pub fn retrieve(
    url: String,
    language: String,
    settings: Settings,
    cache: PathBuf,
) -> Result<Value, String> {
    let normalized = crate::model::normalize(&url)?;
    if language.len() > 3 || language.len() < 2 || !language.bytes().all(|c| c.is_ascii_lowercase())
    {
        return Err("Unsupported caption language code".into());
    }
    let mut c = base(&settings)?;
    let o = crate::platform::output(
        c.args(["--dump-single-json", "--skip-download", "--", &normalized])
            .stdout(Stdio::piped())
            .stderr(Stdio::piped()),
    )
    .map_err(|_| "Cannot start caption worker")?;
    crate::diagnostics::log(
        crate::diagnostics::Stage::CaptionMetadata,
        &settings,
        o.status.code(),
        &String::from_utf8_lossy(&o.stderr),
    );
    if !o.status.success() {
        return Err(format!(
            "Caption request: {}",
            safe_error(&String::from_utf8_lossy(&o.stderr))
        ));
    }
    let v: Value = serde_json::from_slice(&o.stdout).map_err(|_| "Invalid caption metadata")?;
    if v["is_live"].as_bool() == Some(true)
        || !v["duration"]
            .as_f64()
            .is_some_and(|d| d.is_finite() && d > 0.)
    {
        return Err("Choose a finished video with a finite duration.".into());
    }
    let (code, automatic) = track(&v, &language).ok_or(
        "No supplied or original automatic captions in this language. Translations are not used.",
    )?;
    let dir = TempDir(cache.join(uuid::Uuid::new_v4().to_string()));
    std::fs::create_dir_all(&dir.0).map_err(|_| "Cannot create temporary subtitle folder")?;
    // Reuse the extraction, including signed caption URLs and request headers.
    // Private temporary directory: metadata may contain authenticated URLs.
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        std::fs::set_permissions(&dir.0, std::fs::Permissions::from_mode(0o700))
            .map_err(|_| "Cannot secure temporary subtitle folder")?;
    }
    let info = dir.0.join("video.info.json");
    std::fs::write(
        &info,
        serde_json::to_vec(&v).map_err(|_| "Invalid metadata")?,
    )
    .map_err(|_| "Cannot save temporary metadata")?;
    let template = dir.0.join("captions.%(ext)s");
    let mut c = base(&settings)?;
    c.args([
        "--skip-download",
        "--sub-format",
        "json3",
        "--sub-langs",
        &code,
        "--sleep-subtitles",
        "3",
    ]);
    c.arg(if automatic {
        "--write-auto-subs"
    } else {
        "--write-subs"
    });
    let o = crate::platform::output(c.arg("-o").arg(template).arg("--load-info-json").arg(&info))
        .map_err(|_| "Cannot retrieve captions")?;
    crate::diagnostics::log(
        crate::diagnostics::Stage::Captions,
        &settings,
        o.status.code(),
        &String::from_utf8_lossy(&o.stderr),
    );
    if !o.status.success() {
        return Err(format!(
            "Caption request: {}",
            safe_error(&String::from_utf8_lossy(&o.stderr))
        ));
    }
    let path = std::fs::read_dir(&dir.0)
        .map_err(|_| "No subtitle output")?
        .flatten()
        .map(|e| e.path())
        .find(|p| p.extension().is_some_and(|e| e == "json3"))
        .ok_or("No usable subtitle file")?;
    assemble(&v, &normalized, code, automatic, &path)
}

/// Turns a downloaded json3 caption file and the video's metadata into the reply sent to the UI.
fn assemble(
    v: &Value,
    normalized: &str,
    code: String,
    automatic: bool,
    path: &std::path::Path,
) -> Result<Value, String> {
    let json: Value =
        serde_json::from_slice(&std::fs::read(path).map_err(|_| "Cannot read captions")?)
            .map_err(|_| "Invalid caption data")?;
    let cues = json["events"]
        .as_array()
        .ok_or("No caption events")?
        .iter()
        .filter_map(|e| {
            let start = e["tStartMs"].as_f64()? / 1000.;
            let duration = e["dDurationMs"].as_f64()? / 1000.;
            let text = e["segs"]
                .as_array()?
                .iter()
                .filter_map(|s| s["utf8"].as_str())
                .collect::<String>();
            if text.trim().is_empty() || duration <= 0. {
                None
            } else {
                Some(json!({"start":start,"end":start+duration,"text":text}))
            }
        })
        .collect::<Vec<_>>();
    Ok(
        json!({"video": {"id":v["id"],"url":normalized,"title":v["title"],"channel":v["channel"],"duration":v["duration"],"thumbnail":v["thumbnail"],"formats":v["formats"].as_array().map(|a| a.iter().map(|f| json!({"format_id":f["format_id"],"height":f["height"],"vcodec":f["vcodec"],"acodec":f["acodec"],"ext":f["ext"]})).collect::<Vec<_>>()),"subtitles":v["subtitles"]},"track":{"language":code,"kind":if automatic {"original automatic"} else {"supplied"},"cues":cues}}),
    )
}

/// Faster variant for scanning many videos: one yt-dlp run fetches the metadata and the
/// captions together, without the per-request pauses that single lookups use. Callers back
/// off when YouTube rate-limits.
pub fn retrieve_quick(
    url: String,
    language: String,
    settings: Settings,
    cache: PathBuf,
) -> Result<Value, String> {
    let normalized = crate::model::normalize(&url)?;
    if language.len() > 3 || language.len() < 2 || !language.bytes().all(|c| c.is_ascii_lowercase())
    {
        return Err("Unsupported caption language code".into());
    }
    let dir = TempDir(cache.join(uuid::Uuid::new_v4().to_string()));
    std::fs::create_dir_all(&dir.0).map_err(|_| "Cannot create temporary subtitle folder")?;
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        std::fs::set_permissions(&dir.0, std::fs::Permissions::from_mode(0o700))
            .map_err(|_| "Cannot secure temporary subtitle folder")?;
    }
    let mut c = base_with(&settings, false)?;
    c.args([
        "--skip-download",
        // Without the JavaScript runtime no formats can be resolved; captions and metadata
        // are all this path needs.
        "--ignore-no-formats-error",
        "--write-info-json",
        "--write-subs",
        "--write-auto-subs",
        "--sub-format",
        "json3",
        "--sub-langs",
        &format!("{language},{language}-orig"),
        // Later options win over base()'s pauses.
        "--sleep-requests",
        "0",
        "--sleep-subtitles",
        "0",
    ]);
    let o = crate::platform::output(
        c.arg("-o")
            .arg(dir.0.join("v.%(ext)s"))
            .arg("--")
            .arg(&normalized),
    )
    .map_err(|_| "Cannot retrieve captions")?;
    let stderr = String::from_utf8_lossy(&o.stderr).into_owned();
    crate::diagnostics::log(
        crate::diagnostics::Stage::Captions,
        &settings,
        o.status.code(),
        &stderr,
    );
    let info = dir.0.join("v.info.json");
    let v: Value = match std::fs::read(&info) {
        Ok(bytes) => serde_json::from_slice(&bytes).map_err(|_| "Invalid caption metadata")?,
        Err(_) => return Err(format!("Caption request: {}", safe_error(&stderr))),
    };
    if v["is_live"].as_bool() == Some(true)
        || !v["duration"]
            .as_f64()
            .is_some_and(|d| d.is_finite() && d > 0.)
    {
        return Err("Choose a finished video with a finite duration.".into());
    }
    let (code, automatic) = track(&v, &language).ok_or(
        "No supplied or original automatic captions in this language. Translations are not used.",
    )?;
    let path = dir.0.join(format!("v.{code}.json3"));
    if !path.is_file() {
        return Err(format!("Caption request: {}", safe_error(&stderr)));
    }
    assemble(&v, &normalized, code, automatic, &path)
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn manual_first_and_no_translation() {
        let v = json!({"subtitles":{"en-custom":[{}]},"automatic_captions":{"en-orig":[{"url":"https://example.org/a?lang=en"}]}});
        assert_eq!(track(&v, "en"), Some(("en-custom".into(), false)));
        let v =
            json!({"automatic_captions":{"en":[{"url":"https://example.org/a?lang=es&tlang=en"}]}});
        assert_eq!(track(&v, "en"), None);
    }
}

#[cfg(test)]
mod network_tests {
    use super::*;
    #[test]
    #[ignore = "Requires network access and yt-dlp"]
    fn quick_retrieval_matches_the_standard_result_and_is_faster() {
        let url = "https://www.youtube.com/watch?v=H14bBuluwB8";
        let cache = std::env::temp_dir().join(format!("cf-caption-quick-{}", uuid::Uuid::new_v4()));
        // Set CF_TEST_BROWSER (for example "opera") when YouTube demands a signed-in session.
        let settings = Settings {
            browser: std::env::var("CF_TEST_BROWSER").unwrap_or_default(),
            ..Settings::default()
        };
        let t = std::time::Instant::now();
        let quick = retrieve_quick(url.into(), "en".into(), settings.clone(), cache.clone()).unwrap();
        let quick_time = t.elapsed();
        let t = std::time::Instant::now();
        let standard = retrieve(url.into(), "en".into(), settings, cache.clone()).unwrap();
        let standard_time = t.elapsed();
        println!("quick {quick_time:?} vs standard {standard_time:?}");
        let n = |v: &Value| v["track"]["cues"].as_array().unwrap().len();
        assert!(n(&quick) > 0);
        assert_eq!(n(&quick), n(&standard));
        assert_eq!(quick["track"]["kind"], standard["track"]["kind"]);
        assert_eq!(std::fs::read_dir(&cache).unwrap().count(), 0);
        std::fs::remove_dir(cache).unwrap();
        assert!(quick_time < standard_time);
    }

    #[test]
    #[ignore = "Requires network access and pinned media tools"]
    fn windows_public_caption_workflow() {
        let cache =
            std::env::temp_dir().join(format!("youglish-caption-smoke-{}", uuid::Uuid::new_v4()));
        let result = retrieve(
            "https://www.youtube.com/watch?v=H14bBuluwB8".into(),
            "en".into(),
            Settings::default(),
            cache.clone(),
        )
        .unwrap();
        assert!(!result["track"]["cues"].as_array().unwrap().is_empty());
        assert_eq!(std::fs::read_dir(&cache).unwrap().count(), 0);
        std::fs::remove_dir(cache).unwrap();
    }
}
