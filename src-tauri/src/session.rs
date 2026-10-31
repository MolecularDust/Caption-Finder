use std::{io::Write, path::PathBuf, sync::Arc};
use tauri::Manager;

pub struct CookieFile(pub PathBuf);
impl Drop for CookieFile {
    fn drop(&mut self) {
        let _ = std::fs::remove_file(&self.0);
    }
}
fn youtube_domain(domain: &str) -> bool {
    let domain = domain.trim_start_matches('.');
    domain == "youtube.com" || domain.ends_with(".youtube.com")
}
pub fn prepare(
    app: &tauri::AppHandle,
    mut settings: crate::model::Settings,
) -> Result<crate::model::Settings, String> {
    if settings.browser != "app" {
        return Ok(settings);
    }
    let window = app
        .get_webview_window("main")
        .ok_or("App session is unavailable")?;
    let cookies = window
        .cookies()
        .map_err(|_| "Could not read the app's YouTube session")?;
    let mut text = String::from("# Netscape HTTP Cookie File\n");
    let mut authenticated = false;
    for c in cookies {
        let domain = c.domain().unwrap_or("");
        if !youtube_domain(domain) {
            continue;
        }
        let path = c.path().unwrap_or("/");
        if [domain, path, c.name(), c.value()]
            .iter()
            .any(|s| s.contains(['\t', '\r', '\n']))
        {
            continue;
        }
        let expiry = c
            .expires_datetime()
            .map(|d| d.unix_timestamp())
            .unwrap_or(0);
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs() as i64;
        if expiry != 0 && expiry <= now {
            continue;
        }
        if ["SID", "SAPISID", "__Secure-3PAPISID", "__Secure-1PAPISID"].contains(&c.name()) {
            authenticated = true;
        }
        text.push_str(&format!(
            "{}{}\t{}\t{}\t{}\t{}\t{}\t{}\n",
            if c.http_only().unwrap_or(false) {
                "#HttpOnly_"
            } else {
                ""
            },
            domain,
            if domain.starts_with('.') {
                "TRUE"
            } else {
                "FALSE"
            },
            path,
            if c.secure().unwrap_or(false) {
                "TRUE"
            } else {
                "FALSE"
            },
            expiry,
            c.name(),
            c.value()
        ));
    }
    if !authenticated {
        return Err("Connect YouTube in Account & Settings first, then select your channel. No signed-in YouTube cookies were found.".into());
    }
    let path = std::env::temp_dir().join(format!("youglish-session-{}.txt", uuid::Uuid::new_v4()));
    let guard = Arc::new(CookieFile(path.clone()));
    let mut options = std::fs::OpenOptions::new();
    options.write(true).create_new(true);
    #[cfg(unix)]
    {
        use std::os::unix::fs::OpenOptionsExt;
        options.mode(0o600);
    }
    let mut file = options
        .open(&path)
        .map_err(|_| "Cannot create private session file")?;
    file.write_all(text.as_bytes())
        .map_err(|_| "Cannot prepare YouTube session")?;
    settings.browser.clear();
    settings.cookies_file = path.to_string_lossy().into_owned();
    settings.session_file = Some(guard);
    Ok(settings)
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn domains_are_restricted() {
        assert!(youtube_domain(".youtube.com"));
        assert!(youtube_domain("www.youtube.com"));
        assert!(!youtube_domain("youtube.com.evil.test"));
        assert!(!youtube_domain("google.com"));
        assert!(!youtube_domain("notyoutube.com"));
    }
    #[test]
    fn temporary_file_is_removed_after_last_owner() {
        let path = std::env::temp_dir().join(uuid::Uuid::new_v4().to_string());
        std::fs::write(&path, "test").unwrap();
        let a = Arc::new(CookieFile(path.clone()));
        let b = a.clone();
        drop(a);
        assert!(path.exists());
        drop(b);
        assert!(!path.exists());
    }
}
