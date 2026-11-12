use crate::{metadata_base, model::Settings, platform, safe_error};
use serde_json::{json, Value};
use std::process::Stdio;
use std::sync::Mutex;

/// Processes of channel lookups in flight, so that a lookup the user has typed past can be
/// stopped instead of running to the end for an answer nobody wants.
static LOOKUPS: Mutex<Vec<u32>> = Mutex::new(Vec::new());

#[cfg(unix)]
fn run_lookup(c: &mut std::process::Command) -> std::io::Result<std::process::Output> {
    c.stdout(Stdio::piped()).stderr(Stdio::piped());
    let child = platform::spawn(c)?;
    let pid = child.id();
    LOOKUPS.lock().unwrap_or_else(|e| e.into_inner()).push(pid);
    let output = child.wait_with_output();
    LOOKUPS.lock().unwrap_or_else(|e| e.into_inner()).retain(|p| *p != pid);
    output
}
#[cfg(not(unix))]
fn run_lookup(c: &mut std::process::Command) -> std::io::Result<std::process::Output> {
    c.stdout(Stdio::piped()).stderr(Stdio::piped());
    platform::output(c)
}

/// Stops every channel lookup that is still running.
pub fn cancel_lookups() {
    let pids: Vec<u32> = LOOKUPS.lock().unwrap_or_else(|e| e.into_inner()).drain(..).collect();
    for pid in pids {
        let _ = platform::signal(pid, "cancel");
    }
}

/// For lookups that only need a video's title, length and channel: read them from the watch
/// page alone, skipping the extra player-API requests and JS challenge that only serve to list
/// playable formats (three requests and a deno run fewer). With no formats requested, their
/// absence is not an error.
const VIDEO_DETAILS_ONLY: [&str; 3] = [
    "--extractor-args",
    "youtube:player_skip=configs,js;player_client=web",
    "--ignore-no-formats-error",
];

/// The channel a video belongs to, for suggesting it when someone pastes a video link.
pub fn of_video(settings: Settings, url: &str) -> Result<Value, String> {
    let video = crate::model::normalize(url)?;
    let mut c = metadata_base(&settings)?;
    c.args(VIDEO_DETAILS_ONLY);
    c.args([
        "--no-playlist",
        "--skip-download",
        "--print",
        "%(channel_id)s\t%(channel)s\t%(uploader_id)s\t%(channel_follower_count)s",
        "--",
        &video,
    ]);
    let o = run_lookup(&mut c).map_err(|_| "Cannot start yt-dlp")?;
    let stderr = String::from_utf8_lossy(&o.stderr).into_owned();
    crate::diagnostics::log(
        crate::diagnostics::Stage::ChannelList,
        &settings,
        o.status.code(),
        &stderr,
    );
    parse_video_channel(&String::from_utf8_lossy(&o.stdout)).ok_or_else(|| {
        if stderr.trim().is_empty() {
            "Couldn’t find that video’s channel.".to_string()
        } else {
            safe_error(&stderr)
        }
    })
}

/// A video's title, channel and length, for listing it when someone adds it to a search.
pub fn video_info(settings: Settings, url: &str) -> Result<Value, String> {
    let video = crate::model::normalize(url)?;
    let mut c = metadata_base(&settings)?;
    c.args(VIDEO_DETAILS_ONLY);
    c.args([
        "--no-playlist",
        "--skip-download",
        "--print",
        "%(id)s\t%(title)s\t%(channel)s\t%(duration)s",
        "--",
        &video,
    ]);
    let o = run_lookup(&mut c).map_err(|_| "Cannot start yt-dlp")?;
    let stderr = String::from_utf8_lossy(&o.stderr).into_owned();
    crate::diagnostics::log(
        crate::diagnostics::Stage::ChannelList,
        &settings,
        o.status.code(),
        &stderr,
    );
    parse_video_info(&String::from_utf8_lossy(&o.stdout), &video).ok_or_else(|| {
        let lower = stderr.to_lowercase();
        if lower.contains("unavailable") || lower.contains("private") {
            "That video is unavailable.".to_string()
        } else if stderr.trim().is_empty() {
            "Couldn’t read that video.".to_string()
        } else {
            safe_error(&stderr)
        }
    })
}

fn parse_video_info(output: &str, source: &str) -> Option<Value> {
    let line = output.lines().find(|l| l.contains('\t'))?;
    let mut parts = line.split('\t');
    let id = parts.next()?.trim();
    let title = parts.next()?.trim();
    let channel = parts.next().unwrap_or("").trim();
    let duration = parts.next().and_then(|d| d.trim().parse::<f64>().ok());
    if id.len() != 11 || title.is_empty() || title == "NA" {
        return None;
    }
    Some(json!({
        "id": id,
        "source": source,
        "title": title,
        "channel": (channel != "NA" && !channel.is_empty()).then_some(channel),
        "duration": duration,
    }))
}

fn parse_video_channel(output: &str) -> Option<Value> {
    let line = output.lines().find(|l| l.contains('\t'))?;
    let mut parts = line.split('\t');
    let id = parts.next()?.trim();
    let title = parts.next()?.trim();
    let handle = parts.next().unwrap_or("").trim();
    let subscribers = parts.next().and_then(|s| s.trim().parse::<u64>().ok());
    if !id.starts_with("UC") || title.is_empty() || title == "NA" {
        return None;
    }
    Some(json!({
        "id": id,
        "title": title,
        "handle": (handle != "NA" && !handle.is_empty()).then_some(handle),
        "subscribers": subscribers,
    }))
}

/// Channel list address for a link, an @handle, or a bare channel id.
pub fn channel_url(input: &str) -> Result<String, String> {
    let text = input.trim();
    if text.is_empty() {
        return Err("Enter a channel link or @handle".into());
    }
    let tabs = [
        "videos",
        "featured",
        "streams",
        "shorts",
        "playlists",
        "community",
        "about",
    ];
    if text.starts_with("http://") || text.starts_with("https://") {
        let url = url::Url::parse(text).map_err(|_| "That is not a valid link")?;
        let host = url.host_str().unwrap_or("");
        if !["youtube.com", "www.youtube.com", "m.youtube.com"].contains(&host)
            || url.username() != ""
            || url.password().is_some()
            || url.port().is_some()
        {
            return Err("Use a youtube.com channel link".into());
        }
        let mut segments = url
            .path_segments()
            .map(|s| s.filter(|p| !p.is_empty()).collect::<Vec<_>>())
            .unwrap_or_default();
        if segments.last().is_some_and(|l| tabs.contains(l)) {
            segments.pop();
        }
        let channel = match segments.as_slice() {
            [handle] if handle.starts_with('@') => handle.to_string(),
            ["channel", id] | ["c", id] | ["user", id] => format!("{}/{id}", segments[0]),
            _ => return Err("That link is not a channel. Use a channel link or @handle.".into()),
        };
        return Ok(format!("https://www.youtube.com/{channel}/videos"));
    }
    let valid = |s: &str| {
        !s.is_empty()
            && s.len() <= 100
            && s.chars()
                .all(|c| c.is_alphanumeric() || matches!(c, '.' | '_' | '-'))
    };
    if text.len() == 24 && text.starts_with("UC") && valid(text) {
        return Ok(format!("https://www.youtube.com/channel/{text}/videos"));
    }
    let handle = text.trim_start_matches('@');
    if valid(handle) {
        return Ok(format!("https://www.youtube.com/@{handle}/videos"));
    }
    Err("Use a channel link or an @handle, for example @TED".into())
}

fn percent_encode(text: &str) -> String {
    text.bytes()
        .map(|b| match b {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'~' => {
                (b as char).to_string()
            }
            _ => format!("%{b:02X}"),
        })
        .collect()
}

/// Channels whose names match `query`, best match first, for the channel suggestion list.
pub fn find(settings: Settings, query: &str) -> Result<Vec<Value>, String> {
    let query = query.trim();
    if query.chars().count() < 2 || query.len() > 100 {
        return Ok(Vec::new());
    }
    // `sp` limits YouTube's search results to channels.
    let url = format!(
        "https://www.youtube.com/results?search_query={}&sp=EgIQAg%3D%3D",
        percent_encode(query)
    );
    let mut c = metadata_base(&settings)?;
    c.args([
        "--flat-playlist",
        "--dump-json",
        "--sleep-requests",
        "0",
        "--playlist-end",
        "8",
        "--",
        &url,
    ])
    ;
    let o = run_lookup(&mut c).map_err(|_| "Cannot start yt-dlp")?;
    let stderr = String::from_utf8_lossy(&o.stderr).into_owned();
    crate::diagnostics::log(
        crate::diagnostics::Stage::ChannelList,
        &settings,
        o.status.code(),
        &stderr,
    );
    Ok(String::from_utf8_lossy(&o.stdout)
        .lines()
        .filter_map(|l| serde_json::from_str::<Value>(l).ok())
        .filter_map(|v| {
            let id = v["channel_id"].as_str().or_else(|| v["id"].as_str())?;
            id.starts_with("UC").then(|| {
                let thumbnail = v["thumbnails"][0]["url"].as_str().map(|u| {
                    if u.starts_with("//") { format!("https:{u}") } else { u.to_string() }
                });
                json!({
                    "id": id,
                    "title": v["title"],
                    "handle": v["uploader_id"],
                    "subscribers": v["channel_follower_count"],
                    "thumbnail": thumbnail,
                })
            })
        })
        .collect())
}

/// One page of a channel's videos, newest first. Entries are 1-based and inclusive.
pub fn list(settings: Settings, channel: &str, from: u32, count: u32) -> Result<Vec<Value>, String> {
    let url = channel_url(channel)?;
    if from == 0 || count == 0 || count > 100 {
        return Err("Invalid page request".into());
    }
    let range = format!("{from}-{}", from + count - 1);
    let mut c = metadata_base(&settings)?;
    // Later options win, so this page is fetched without the per-request pause that
    // spaces out caption and download requests.
    c.args([
        "--yes-playlist",
        "--flat-playlist",
        "--dump-json",
        "--sleep-requests",
        "0",
        "--playlist-items",
        &range,
        "--",
        &url,
    ])
    .stdout(Stdio::piped())
    .stderr(Stdio::piped());
    let o = platform::output(&mut c).map_err(|_| "Cannot start yt-dlp")?;
    let stderr = String::from_utf8_lossy(&o.stderr).into_owned();
    crate::diagnostics::log(
        crate::diagnostics::Stage::ChannelList,
        &settings,
        o.status.code(),
        &stderr,
    );
    let entries = String::from_utf8_lossy(&o.stdout)
        .lines()
        .filter_map(|l| serde_json::from_str::<Value>(l).ok())
        .filter_map(|v| {
            let id = v["id"].as_str()?;
            (id.len() == 11).then(|| {
                json!({
                    "id": id,
                    "title": v["title"],
                    "duration": v["duration"],
                    "thumbnail": format!("https://i.ytimg.com/vi/{id}/mqdefault.jpg"),
                })
            })
        })
        .collect::<Vec<_>>();
    if entries.is_empty() && from == 1 {
        let lower = stderr.to_lowercase();
        return Err(if lower.contains("404") || lower.contains("does not exist") {
            "Couldn’t find that channel. Check the link or @handle.".into()
        } else {
            let message = safe_error(&stderr);
            // Debug builds also show yt-dlp's last line to make setup problems diagnosable.
            if cfg!(debug_assertions) {
                let last = stderr.lines().rev().find(|l| !l.trim().is_empty()).unwrap_or("");
                format!("{message} [debug: {}]", last.chars().take(240).collect::<String>())
            } else {
                message
            }
        });
    }
    Ok(entries)
}

#[cfg(test)]
mod network_tests {
    use super::*;
    #[test]
    #[ignore = "Requires network access and yt-dlp"]
    fn lists_a_public_channel_page_by_page() {
        let first = list(Settings::default(), "@TED", 1, 3).unwrap();
        assert_eq!(first.len(), 3);
        assert!(first.iter().all(|v| v["id"].as_str().unwrap().len() == 11));
        let second = list(Settings::default(), "@TED", 4, 2).unwrap();
        assert_eq!(second.len(), 2);
        assert_ne!(first[0]["id"], second[0]["id"]);
    }
    #[test]
    #[ignore = "Requires network access and yt-dlp"]
    fn unknown_channel_gives_a_clear_error() {
        let err = list(Settings::default(), "@this-channel-does-not-exist-zzqq", 1, 3).unwrap_err();
        assert!(!err.is_empty());
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn accepts_links_handles_and_ids() {
        let want = "https://www.youtube.com/@TED/videos";
        assert_eq!(channel_url("@TED").unwrap(), want);
        assert_eq!(channel_url("TED").unwrap(), want);
        assert_eq!(channel_url("https://www.youtube.com/@TED").unwrap(), want);
        assert_eq!(channel_url("https://youtube.com/@TED/featured/").unwrap(), want);
        assert_eq!(
            channel_url("https://www.youtube.com/channel/UC1234567890123456789012").unwrap(),
            "https://www.youtube.com/channel/UC1234567890123456789012/videos"
        );
        assert_eq!(
            channel_url("UC1234567890123456789012").unwrap(),
            "https://www.youtube.com/channel/UC1234567890123456789012/videos"
        );
    }
    #[test]
    fn rejects_other_hosts_videos_and_junk() {
        assert!(channel_url("").is_err());
        assert!(channel_url("https://example.com/@TED").is_err());
        assert!(channel_url("https://evil.test/https://youtube.com/@TED").is_err());
        assert!(channel_url("https://www.youtube.com/watch?v=abcdefghijk").is_err());
        assert!(channel_url("two words").is_err());
        assert!(channel_url("@a/../b").is_err());
    }
}

#[cfg(test)]
mod find_tests {
    use super::percent_encode;
    #[test]
    fn encodes_queries_for_a_url() {
        assert_eq!(percent_encode("TED talks"), "TED%20talks");
        assert_eq!(percent_encode("a&b=c"), "a%26b%3Dc");
        assert_eq!(percent_encode("é"), "%C3%A9");
    }
}

#[cfg(test)]
mod video_channel_tests {
    use super::parse_video_channel;
    #[test]
    fn reads_a_video_channel_line() {
        let v = parse_video_channel("UCAuUUnT6oDeKwE6v1NGQxug\tTED\t@TED\t27900000\n").unwrap();
        assert_eq!(v["id"], "UCAuUUnT6oDeKwE6v1NGQxug");
        assert_eq!(v["title"], "TED");
        assert_eq!(v["handle"], "@TED");
        assert_eq!(v["subscribers"], 27900000);
    }
    #[test]
    fn reads_a_video_info_line() {
        let src = "https://www.youtube.com/watch?v=SDSzIs9K_Sg";
        let v = super::parse_video_info("SDSzIs9K_Sg\tA title\tSome channel\t1234\n", src).unwrap();
        assert_eq!(v["id"], "SDSzIs9K_Sg");
        assert_eq!(v["title"], "A title");
        assert_eq!(v["channel"], "Some channel");
        assert_eq!(v["duration"], 1234.0);
        assert_eq!(v["source"], src);
        let sparse = super::parse_video_info("SDSzIs9K_Sg\tA title\tNA\tNA", src).unwrap();
        assert!(sparse["channel"].is_null() && sparse["duration"].is_null());
        assert!(super::parse_video_info("short\tx\ty\tz", src).is_none());
        assert!(super::parse_video_info("", src).is_none());
    }
    #[test]
    fn copes_with_missing_fields_and_rejects_junk() {
        let v = parse_video_channel("UCx\tSome channel\tNA\tNA").unwrap();
        assert!(v["handle"].is_null() && v["subscribers"].is_null());
        assert!(parse_video_channel("NA\tNA\tNA\tNA").is_none());
        assert!(parse_video_channel("").is_none());
        assert!(parse_video_channel("a warning line").is_none());
    }
}
