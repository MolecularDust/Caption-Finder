//! Channel presets, kept as one small JSON file each in a folder outside the app's own data,
//! so they survive a reset or a reinstall and can be opened, copied or backed up by hand.
use serde_json::{json, Value};
use std::path::{Path, PathBuf};

const MAX_NAME: usize = 80;
const MAX_CHANNELS: usize = 200;

/// The preset folder: "Caption Finder/Presets" in the user's application data folder. It is
/// named for the product rather than the bundle id, so resetting the app leaves it alone.
pub fn folder(data: &Path) -> PathBuf {
    data.join("Caption Finder").join("Presets")
}

/// A file name for a preset: its name with characters that file systems reject replaced.
fn file_name(name: &str) -> String {
    let safe: String = name
        .trim()
        .chars()
        .map(|c| match c {
            '/' | '\\' | ':' | '*' | '?' | '"' | '<' | '>' | '|' => '-',
            c if c.is_control() => ' ',
            c => c,
        })
        .collect();
    let safe = safe.trim().trim_matches('.').to_string();
    format!("{}.json", if safe.is_empty() { "Preset".to_string() } else { safe })
}

fn path_for(dir: &Path, name: &str) -> PathBuf {
    dir.join(file_name(name))
}

fn valid(name: &str, channels: &Value) -> Result<(), String> {
    if name.trim().is_empty() || name.chars().count() > MAX_NAME {
        return Err("Give the preset a name of up to 80 characters.".into());
    }
    let list = channels.as_array().ok_or("A preset needs a list of channels.")?;
    if list.is_empty() || list.len() > MAX_CHANNELS {
        return Err("A preset needs between 1 and 200 channels.".into());
    }
    if !list.iter().all(|c| c["source"].as_str().is_some_and(|s| !s.is_empty())) {
        return Err("Every channel needs a link or handle.".into());
    }
    Ok(())
}

pub fn save(dir: &Path, name: &str, channels: Value) -> Result<(), String> {
    valid(name, &channels)?;
    std::fs::create_dir_all(dir).map_err(|_| "Could not create the presets folder.")?;
    let text = serde_json::to_string_pretty(&json!({ "name": name.trim(), "channels": channels }))
        .map_err(|_| "Could not write the preset.")?;
    // Write beside the target and rename, so a crash never leaves a half-written preset.
    let target = path_for(dir, name);
    let temp = target.with_extension("json.tmp");
    std::fs::write(&temp, text).map_err(|_| "Could not write the preset.")?;
    std::fs::rename(&temp, &target).map_err(|_| "Could not write the preset.".to_string())
}

/// All readable presets, sorted by name. Files that aren't valid presets are skipped.
pub fn list(dir: &Path) -> Vec<Value> {
    let mut found: Vec<Value> = std::fs::read_dir(dir)
        .into_iter()
        .flatten()
        .flatten()
        .filter(|e| e.path().extension().is_some_and(|x| x == "json"))
        .filter_map(|e| std::fs::read_to_string(e.path()).ok())
        .filter_map(|t| serde_json::from_str::<Value>(&t).ok())
        .filter(|v| v["name"].is_string() && valid(v["name"].as_str().unwrap(), &v["channels"]).is_ok())
        .collect();
    found.sort_by_key(|v| v["name"].as_str().unwrap_or("").to_lowercase());
    found
}

pub fn delete(dir: &Path, name: &str) -> Result<(), String> {
    let path = path_for(dir, name);
    if path.is_file() {
        std::fs::remove_file(path).map_err(|_| "Could not delete the preset.")?;
    }
    Ok(())
}

/// The preset's file, if it exists, for showing in the file manager.
pub fn existing_path(dir: &Path, name: &str) -> Result<PathBuf, String> {
    let path = path_for(dir, name);
    if path.is_file() {
        Ok(path)
    } else {
        Err("That preset's file no longer exists.".into())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn scratch() -> PathBuf {
        let dir = std::env::temp_dir().join(format!("cf-presets-{}", uuid::Uuid::new_v4()));
        std::fs::create_dir_all(&dir).unwrap();
        dir
    }
    fn channels() -> Value {
        json!([{ "source": "https://www.youtube.com/@TED", "title": "TED", "subscribers": 27900000 }])
    }

    #[test]
    fn file_names_are_safe() {
        assert_eq!(file_name("Russian Accent"), "Russian Accent.json");
        assert_eq!(file_name("a/b:c"), "a-b-c.json");
        assert_eq!(file_name("..."), "Preset.json");
        assert_eq!(file_name("Русский акцент"), "Русский акцент.json");
    }
    #[test]
    fn saves_lists_and_deletes() {
        let dir = scratch();
        save(&dir, "Beta", channels()).unwrap();
        save(&dir, "alpha", channels()).unwrap();
        let names: Vec<_> = list(&dir).iter().map(|v| v["name"].as_str().unwrap().to_string()).collect();
        assert_eq!(names, ["alpha", "Beta"]);
        assert!(existing_path(&dir, "Beta").is_ok());
        delete(&dir, "Beta").unwrap();
        assert!(existing_path(&dir, "Beta").is_err());
        assert_eq!(list(&dir).len(), 1);
        std::fs::remove_dir_all(dir).unwrap();
    }
    #[test]
    fn saving_again_replaces_and_leaves_no_temp_file() {
        let dir = scratch();
        save(&dir, "Same", channels()).unwrap();
        save(&dir, "Same", json!([{ "source": "@other", "title": "Other" }])).unwrap();
        let all = list(&dir);
        assert_eq!(all.len(), 1);
        assert_eq!(all[0]["channels"][0]["source"], "@other");
        assert_eq!(std::fs::read_dir(&dir).unwrap().count(), 1);
        std::fs::remove_dir_all(dir).unwrap();
    }
    #[test]
    fn rejects_bad_presets_and_ignores_bad_files() {
        let dir = scratch();
        assert!(save(&dir, "  ", channels()).is_err());
        assert!(save(&dir, "Empty", json!([])).is_err());
        assert!(save(&dir, "NoSource", json!([{ "title": "x" }])).is_err());
        std::fs::write(dir.join("junk.json"), "not json").unwrap();
        std::fs::write(dir.join("notes.txt"), "hello").unwrap();
        assert!(list(&dir).is_empty());
        std::fs::remove_dir_all(dir).unwrap();
    }
}
