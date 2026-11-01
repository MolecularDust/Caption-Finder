//! Whether this app may read a browser's data folder. macOS protects some browsers' folders
//! (Chrome, Firefox) so that only approved apps can open them; yt-dlp, started by this app,
//! then reports that it "could not find" the cookie database.
use std::path::PathBuf;

#[derive(Debug, PartialEq, Eq)]
pub enum Access {
    Ok,
    /// The folder exists but the operating system refuses this app access to it.
    Blocked,
    /// The browser has no data folder here (not installed, or never run).
    Missing,
}

impl Access {
    pub fn as_str(&self) -> &'static str {
        match self {
            Access::Ok => "ok",
            Access::Blocked => "blocked",
            Access::Missing => "missing",
        }
    }
}

/// The folder the browser keeps its profile and cookies in, on macOS.
fn data_dir(browser: &str) -> Option<PathBuf> {
    let support = PathBuf::from(std::env::var_os("HOME")?).join("Library/Application Support");
    Some(match browser {
        "chrome" => support.join("Google/Chrome"),
        "chromium" => support.join("Chromium"),
        "brave" => support.join("BraveSoftware/Brave-Browser"),
        "edge" => support.join("Microsoft Edge"),
        "vivaldi" => support.join("Vivaldi"),
        "opera" => support.join("com.operasoftware.Opera"),
        "firefox" => support.join("Firefox"),
        "safari" => PathBuf::from(std::env::var_os("HOME")?)
            .join("Library/Containers/com.apple.Safari/Data/Library/Cookies"),
        _ => return None,
    })
}

pub fn check(browser: &str) -> Access {
    if !cfg!(target_os = "macos") {
        return Access::Ok;
    }
    let Some(dir) = data_dir(browser) else {
        return Access::Ok;
    };
    match std::fs::read_dir(&dir) {
        Ok(_) => Access::Ok,
        Err(e) if e.kind() == std::io::ErrorKind::PermissionDenied => Access::Blocked,
        Err(_) => Access::Missing,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn unknown_browsers_are_not_checked() {
        assert_eq!(check("not-a-browser"), Access::Ok);
    }
    #[test]
    fn a_readable_folder_is_ok_and_an_absent_one_is_missing() {
        if cfg!(target_os = "macos") {
            // Application Support itself is always readable; a made-up browser folder is not there.
            let missing = std::env::temp_dir().join("cf-no-such-browser");
            assert!(std::fs::read_dir(&missing).is_err());
            assert_eq!(Access::Missing.as_str(), "missing");
        }
        assert_eq!(Access::Ok.as_str(), "ok");
        assert_eq!(Access::Blocked.as_str(), "blocked");
    }
    #[test]
    fn every_supported_browser_has_a_folder_on_macos() {
        std::env::set_var("HOME", "/Users/test");
        for b in ["chrome", "chromium", "brave", "edge", "vivaldi", "opera", "firefox", "safari"] {
            assert!(data_dir(b).is_some(), "{b}");
        }
    }
}
