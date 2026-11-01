//! Full Disk Access has no prompt, and an app cannot add itself to the list: the user drags the
//! app in or presses +. This opens System Settings and puts a small window with the app's icon
//! beside it, ready to drag into the list.
use std::path::PathBuf;
use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindowBuilder};

const LABEL: &str = "grant-helper";
const WIDTH: f64 = 260.0;
const HEIGHT: f64 = 300.0;

/// The app bundle this process runs from, if it runs from one.
pub fn own_bundle() -> Option<PathBuf> {
    std::env::current_exe()
        .ok()?
        .ancestors()
        .find(|p| p.extension().is_some_and(|e| e == "app"))
        .map(PathBuf::from)
}

/// System Settings' window as (x, y, width, height) in points. The window list is read in a
/// short script because reading window bounds needs no special permission.
#[cfg(target_os = "macos")]
fn settings_frame() -> Option<(f64, f64, f64, f64)> {
    const SCRIPT: &str = r#"ObjC.import('CoreGraphics');
const list = ObjC.deepUnwrap(ObjC.castRefToObject($.CGWindowListCopyWindowInfo($.kCGWindowListOptionOnScreenOnly | $.kCGWindowListExcludeDesktopElements, 0)));
const w = list.find(x => x.kCGWindowOwnerName === 'System Settings' && x.kCGWindowLayer === 0 && x.kCGWindowBounds.Width > 200);
w ? [w.kCGWindowBounds.X, w.kCGWindowBounds.Y, w.kCGWindowBounds.Width, w.kCGWindowBounds.Height].join(',') : ''"#;
    let out = std::process::Command::new("osascript")
        .args(["-l", "JavaScript", "-e", SCRIPT])
        .output()
        .ok()?;
    let text = String::from_utf8_lossy(&out.stdout);
    let n: Vec<f64> = text.trim().split(',').filter_map(|v| v.parse().ok()).collect();
    (n.len() == 4).then(|| (n[0], n[1], n[2], n[3]))
}

/// Beside System Settings where there is room (left first, then right), else over its corner.
/// Vertically it sits near the bottom, where the list and its + button are.
fn placement(frame: Option<(f64, f64, f64, f64)>, screen_width: f64) -> Option<(f64, f64)> {
    let (x, y, w, h) = frame?;
    let left = x - WIDTH - 12.0;
    let right = x + w + 12.0;
    let across = if left >= 0.0 {
        left
    } else if right + WIDTH <= screen_width {
        right
    } else {
        x + 20.0
    };
    Some((across, (y + h - HEIGHT - 60.0).max(40.0)))
}

pub fn close(app: &AppHandle) {
    if let Some(window) = app.get_webview_window(LABEL) {
        let _ = window.close();
    }
}

/// Opens the Full Disk Access page of System Settings and shows the helper window beside it.
pub async fn open(app: AppHandle) -> Result<(), String> {
    #[cfg(not(target_os = "macos"))]
    {
        let _ = app;
        Err("This is only needed on macOS".into())
    }
    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg("x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles")
            .spawn()
            .map_err(|_| "Could not open System Settings".to_string())?;
        // System Settings takes a moment to show its window.
        let frame = tauri::async_runtime::spawn_blocking(|| {
            for _ in 0..30 {
                if let Some(f) = settings_frame() {
                    return Some(f);
                }
                std::thread::sleep(std::time::Duration::from_millis(150));
            }
            None
        })
        .await
        .map_err(|_| "Could not place the helper window".to_string())?;
        close(&app);
        let mut builder = WebviewWindowBuilder::new(
            &app,
            LABEL,
            WebviewUrl::App("index.html?helper=grant".into()),
        )
        .title("Allow Caption Finder")
        .inner_size(WIDTH, HEIGHT)
        .resizable(false)
        .minimizable(false)
        .maximizable(false)
        .always_on_top(true);
        let screen_width = app
            .primary_monitor()
            .ok()
            .flatten()
            .map(|m| m.size().width as f64 / m.scale_factor())
            .unwrap_or(1440.0);
        builder = match placement(frame, screen_width) {
            Some((x, y)) => builder.position(x, y),
            None => builder.center(),
        };
        builder
            .build()
            .map_err(|_| "Could not open the helper window".to_string())?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn helper_goes_left_then_right_then_over_the_corner() {
        let (x, y) = placement(Some((400.0, 50.0, 740.0, 1000.0)), 1728.0).unwrap();
        assert_eq!(x, 400.0 - WIDTH - 12.0);
        assert!(y > 50.0 && y + HEIGHT < 1050.0);
        // no room on the left, room on the right
        let (x, _) = placement(Some((100.0, 50.0, 740.0, 1000.0)), 1728.0).unwrap();
        assert_eq!(x, 100.0 + 740.0 + 12.0);
        // no room on either side
        let (x, _) = placement(Some((100.0, 50.0, 740.0, 1000.0)), 1000.0).unwrap();
        assert_eq!(x, 120.0);
        assert!(placement(None, 1728.0).is_none());
    }
}
