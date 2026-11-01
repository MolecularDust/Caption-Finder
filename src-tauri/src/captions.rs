use crate::{base, model::Settings, safe_error};
use serde_json::{json, Value};
use std::path::PathBuf;
struct TempDir(PathBuf);
impl Drop for TempDir {
    fn drop(&mut self) {
        let _ = std::fs::remove_dir_all(&self.0);
    }
}
/// The language a video is spoken in, so a search phrase in that language can be matched:
/// YouTube's own language tag first, else the language of an original automatic caption.
fn spoken_language(v: &Value) -> String {
    if let Some(l) = v["language"].as_str().filter(|l| !l.is_empty()) {
        return l.to_string();
    }
    v["automatic_captions"]
        .as_object()
        .and_then(|m| m.keys().find_map(|k| k.strip_suffix("-orig")))
        .unwrap_or("en")
        .to_string()
}
/// `language` is "auto" or a comma-separated list of codes in order of preference.
fn valid_languages(list: &str) -> bool {
    !list.is_empty() && list.len() <= 200 && list.split(',').all(valid_language)
}
/// The first wanted language the video has a usable track for. Videos with dubbed audio carry
/// an original caption track per dubbed language, so a Russian phrase can match a Russian dub
/// of an English video. "auto" means the language the video is spoken in.
fn choose_language(v: &Value, wanted: &str, source: &str) -> Option<(String, String, bool)> {
    let wanted: Vec<String> = if wanted == "auto" {
        vec![spoken_language(v)]
    } else {
        wanted.split(',').map(str::to_string).collect()
    };
    for code in wanted {
        let primary = code.split('-').next().unwrap_or(&code).to_string();
        for candidate in [code.clone(), primary] {
            if let Some((key, automatic)) = track(v, &candidate, source) {
                return Some((candidate, key, automatic));
            }
        }
    }
    None
}
fn valid_language(code: &str) -> bool {
    code == "auto"
        || (!code.is_empty()
            && code.len() <= 12
            && code.split('-').all(|part| {
                !part.is_empty() && part.bytes().all(|c| c.is_ascii_alphanumeric())
            })
            && code.as_bytes()[0].is_ascii_alphabetic())
}
/// `source` limits the choice: "manual" (uploaded captions only), "automatic" (YouTube's
/// speech recognition only) or anything else for either, preferring uploaded captions.
fn track(v: &Value, language: &str, source: &str) -> Option<(String, bool)> {
    let manual = v["subtitles"].as_object().filter(|_| source != "automatic");
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
    if source == "manual" {
        return None;
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
    source: String,
    settings: Settings,
    cache: PathBuf,
) -> Result<(Value, Vec<u8>), String> {
    let normalized = crate::model::normalize(&url)?;
    if !valid_languages(&language) {
        return Err("Unsupported caption language code".into());
    }
    let mut c = base(&settings)?;
    if cfg!(debug_assertions) {
        c.arg("--verbose"); // development builds only: makes yt-dlp print its phases for timing
    }
    let (o, trace) = crate::timing::run(c.args(["--dump-single-json", "--skip-download", "--", &normalized]))
        .map_err(|_| "Cannot start caption worker")?;
    crate::diagnostics::log_timed(
        crate::diagnostics::Stage::CaptionMetadata,
        &settings,
        o.status.code(),
        &String::from_utf8_lossy(&o.stderr),
        &trace,
    );
    if !o.status.success() {
        return Err(format!(
            "Caption request: {}",
            safe_error(&String::from_utf8_lossy(&o.stderr))
        ));
    }
    let raw = o.stdout;
    let v: Value = serde_json::from_slice(&raw).map_err(|_| "Invalid caption metadata")?;
    if v["is_live"].as_bool() == Some(true)
        || !v["duration"]
            .as_f64()
            .is_some_and(|d| d.is_finite() && d > 0.)
    {
        return Err("Choose a finished video with a finite duration.".into());
    }
    let (_, code, automatic) = choose_language(&v, &language, &source).ok_or(match source.as_str() {
        "manual" => "No uploaded captions in this language. Translations are not used.",
        "automatic" => "No original automatic captions in this language. Translations are not used.",
        _ => "No supplied or original automatic captions in this language. Translations are not used.",
    })?;
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
    ]);
    c.arg(if automatic {
        "--write-auto-subs"
    } else {
        "--write-subs"
    });
    if cfg!(debug_assertions) {
        c.arg("--verbose");
    }
    let (o, trace) = crate::timing::run(c.arg("-o").arg(template).arg("--load-info-json").arg(&info))
        .map_err(|_| "Cannot retrieve captions")?;
    crate::diagnostics::log_timed(
        crate::diagnostics::Stage::Captions,
        &settings,
        o.status.code(),
        &String::from_utf8_lossy(&o.stderr),
        &trace,
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
    Ok((assemble(&v, &normalized, code, automatic, &path)?, raw))
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

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn manual_first_and_no_translation() {
        let v = json!({"subtitles":{"en-custom":[{}]},"automatic_captions":{"en-orig":[{"url":"https://example.org/a?lang=en"}]}});
        assert_eq!(track(&v, "en", "any"), Some(("en-custom".into(), false)));
        let v =
            json!({"automatic_captions":{"en":[{"url":"https://example.org/a?lang=es&tlang=en"}]}});
        assert_eq!(track(&v, "en", "any"), None);
    }
}

#[cfg(test)]
mod network_tests {
    use super::*;

    #[test]
    #[ignore = "Requires network access and pinned media tools"]
    fn windows_public_caption_workflow() {
        let cache =
            std::env::temp_dir().join(format!("youglish-caption-smoke-{}", uuid::Uuid::new_v4()));
        let diagnostics = std::env::temp_dir().join(format!("yg-diag-{}", uuid::Uuid::new_v4()));
        crate::diagnostics::initialize(diagnostics.clone());
        let (result, _) = retrieve(
            "https://www.youtube.com/watch?v=H14bBuluwB8".into(),
            "en".into(),
            "any".into(),
            Settings::default(),
            cache.clone(),
        )
        .unwrap();
        assert!(!result["track"]["cues"].as_array().unwrap().is_empty());
        assert_eq!(std::fs::read_dir(&cache).unwrap().count(), 0);
        std::fs::remove_dir(cache).unwrap();
        let log = std::fs::read_to_string(diagnostics.join("media.jsonl")).unwrap();
        println!("{log}");
        assert!(log.contains("\"duration_ms\""));
        std::fs::remove_dir_all(diagnostics).unwrap();
    }
}

#[cfg(test)]
mod language_tests {
    use super::{choose_language, spoken_language, track, valid_language, valid_languages};
    use serde_json::json;
    #[test]
    fn accepts_auto_and_region_codes_only() {
        for ok in ["auto", "en", "zh-Hans", "pt-BR", "iw"] {
            assert!(valid_language(ok), "{ok}");
        }
        for bad in ["", "-en", "en/../x", "e n", "1en", "averyveryverylongcode"] {
            assert!(!valid_language(bad), "{bad}");
        }
    }
    #[test]
    fn spoken_language_prefers_the_video_tag_then_original_captions() {
        assert_eq!(spoken_language(&json!({"language": "ru"})), "ru");
        assert_eq!(
            spoken_language(&json!({"language": null, "automatic_captions": {"ar": [], "ar-orig": []}})),
            "ar"
        );
        assert_eq!(spoken_language(&json!({})), "en");
    }
    #[test]
    fn caption_source_limits_which_track_is_used() {
        let v = json!({
            "subtitles": {"en": [{"url": "https://x/y"}]},
            "automatic_captions": {"en-orig": [{"url": "https://x/z"}]}
        });
        assert_eq!(track(&v, "en", "any"), Some(("en".into(), false)));
        assert_eq!(track(&v, "en", "manual"), Some(("en".into(), false)));
        assert_eq!(track(&v, "en", "automatic"), Some(("en-orig".into(), true)));
        let only_auto = json!({"automatic_captions": {"en-orig": [{"url": "https://x/z"}]}});
        assert_eq!(track(&only_auto, "en", "manual"), None);
        assert_eq!(track(&only_auto, "en", "any"), Some(("en-orig".into(), true)));
    }
    #[test]
    fn dubbed_languages_are_found_and_region_tags_fall_back() {
        let v = json!({
            "language": "en-US",
            "automatic_captions": {
                "en-orig": [{"url": "https://x/a"}],
                "ru-orig": [{"url": "https://x/b"}],
                "ru": [{"url": "https://x/b?tlang=ru"}]
            }
        });
        // The spoken language "en-US" falls back to "en".
        assert_eq!(choose_language(&v, "auto", "any").unwrap().1, "en-orig");
        // A Russian phrase finds the Russian dub; a Ukrainian-first list falls through to it.
        assert_eq!(choose_language(&v, "uk,ru", "any").unwrap().1, "ru-orig");
        assert!(choose_language(&v, "ar,fa", "any").is_none());
        assert!(valid_languages("ru,uk,bg"));
        assert!(!valid_languages("ru,,uk"));
    }
}
