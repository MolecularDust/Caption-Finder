//! Channel presets, kept as one small JSON file each in a folder outside the app's own data,
//! so they survive a reset or a reinstall and can be opened, copied or backed up by hand.
use serde_json::{json, Value};
use std::path::{Path, PathBuf};

const MAX_NAME: usize = 80;
const MAX_CHANNELS: usize = 200;

/// The preset folder: "Caption Finder/Presets" in the user's application data folder. It is
/// named for the product rather than the bundle id, so resetting the app leaves it alone.
pub fn folder(data: &Path, kind: &str) -> PathBuf {
    let base = data.join("Caption Finder").join("Presets");
    // Presets of videos are kept apart from presets of channels: the listing reads only the
    // files directly in a folder, so each kind sees only its own.
    base.join(if kind == "videos" { "Videos" } else { "Channels" })
}

/// Earlier versions kept channel presets directly in the "Presets" folder. Moves those files
/// into "Presets/Channels", never replacing anything: a file whose name is already taken
/// there is moved under another name. Safe to run every time.
pub fn migrate_legacy(data: &Path) {
    let base = data.join("Caption Finder").join("Presets");
    let Ok(entries) = std::fs::read_dir(&base) else { return };
    let target = folder(data, "channels");
    for entry in entries.flatten() {
        let path = entry.path();
        let movable = path.is_file()
            && path
                .extension()
                .is_some_and(|x| x == "json" || x == "bak");
        if !movable {
            continue;
        }
        if std::fs::create_dir_all(&target).is_err() {
            return;
        }
        let name = entry.file_name().to_string_lossy().into_owned();
        let (stem, ext) = name.split_once('.').unwrap_or((&name, ""));
        let mut destination = target.join(&name);
        let mut n = 2;
        while destination.exists() && n < 100 {
            destination = target.join(format!("{stem} ({n}).{ext}"));
            n += 1;
        }
        if !destination.exists() {
            let _ = std::fs::rename(&path, &destination);
        }
    }
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

/// Saves a new preset and returns its file key. A name that is already used is refused; use
/// `replace` when the user has agreed to overwrite it.
pub fn save(dir: &Path, name: &str, channels: Value) -> Result<String, String> {
    valid(name, &channels)?;
    std::fs::create_dir_all(dir).map_err(|_| "Could not create the presets folder.")?;
    // Only the preset's name can clash. Its file name is an implementation detail: when the
    // obvious file name is taken (by a preset with another name, say after a rename in Finder),
    // the new preset gets "Name (2).json" instead.
    if file_holding(dir, name).is_some() {
        return Err(format!(
            "A preset named “{}” already exists. Choose another name.",
            name.trim()
        ));
    }
    write(dir, name, channels, free_path(dir, name, None))
}

/// A file path for a preset of this name that nothing else is using. `own` is a file that may be
/// reused (the preset's current file, when it is being renamed).
fn free_path(dir: &Path, name: &str, own: Option<&Path>) -> PathBuf {
    let first = path_for(dir, name);
    let usable = |p: &Path| {
        !p.exists() || own.is_some_and(|o| o.file_name().map(|f| f.to_string_lossy().to_lowercase()) == p.file_name().map(|f| f.to_string_lossy().to_lowercase()))
    };
    if usable(&first) {
        return first;
    }
    let stem = file_name(name);
    let stem = stem.trim_end_matches(".json");
    (2..100)
        .map(|n| dir.join(format!("{stem} ({n}).json")))
        .find(|p| usable(p))
        .unwrap_or(first)
}

/// Overwrites the existing preset with this name, after the user has agreed to. The version
/// being replaced is kept beside it as "<file>.json.bak" (not listed as a preset), so a
/// mistaken overwrite can be undone by hand.
pub fn replace(dir: &Path, name: &str, channels: Value) -> Result<String, String> {
    valid(name, &channels)?;
    let target = file_holding(dir, name).ok_or("There is no preset with that name to replace.")?;
    std::fs::copy(&target, target.with_extension("json.bak"))
        .map_err(|_| "Could not keep a copy of the old preset.")?;
    write(dir, name, channels, target)
}

fn write(dir: &Path, name: &str, channels: Value, target: PathBuf) -> Result<String, String> {
    let _ = dir;
    let text = serde_json::to_string_pretty(&json!({ "name": name.trim(), "channels": channels }))
        .map_err(|_| "Could not write the preset.")?;
    // Write beside the target and rename, so a crash never leaves a half-written preset.
    let temp = target.with_extension("json.tmp");
    std::fs::write(&temp, text).map_err(|_| "Could not write the preset.")?;
    std::fs::rename(&temp, &target).map_err(|_| "Could not write the preset.")?;
    Ok(target.file_stem().map(|s| s.to_string_lossy().into_owned()).unwrap_or_default())
}

/// The file of an existing preset with this name, wherever Finder has left it.
fn file_holding(dir: &Path, name: &str) -> Option<PathBuf> {
    let wanted = name.trim().to_lowercase();
    list(dir)
        .into_iter()
        .find(|v| v["name"].as_str().is_some_and(|n| n.trim().to_lowercase() == wanted))
        .and_then(|v| v["file"].as_str().map(|f| dir.join(format!("{f}.json"))))
}

/// A preset's file from its `file` key. The key is only a file name, never a path.
fn path_of(dir: &Path, file: &str) -> Result<PathBuf, String> {
    if file.is_empty() || file.contains(['/', '\\']) || file == "." || file == ".." {
        return Err("That isn't a preset.".into());
    }
    Ok(dir.join(format!("{file}.json")))
}

/// All readable presets, sorted by name. Files that aren't valid presets are skipped.
pub fn list(dir: &Path) -> Vec<Value> {
    let mut found: Vec<Value> = std::fs::read_dir(dir)
        .into_iter()
        .flatten()
        .flatten()
        .filter(|e| e.path().extension().is_some_and(|x| x == "json"))
        .filter_map(|e| {
            let stem = e.path().file_stem()?.to_string_lossy().into_owned();
            let text = std::fs::read_to_string(e.path()).ok()?;
            Some((stem, serde_json::from_str::<Value>(&text).ok()?))
        })
        .filter(|(_, v)| {
            v["name"].is_string() && valid(v["name"].as_str().unwrap(), &v["channels"]).is_ok()
        })
        // `file` names the preset's file. A preset is found by its file, not by recomputing
        // one from its name, because a file may have been renamed or copied in Finder.
        .map(|(stem, mut v)| {
            v["file"] = json!(stem);
            v
        })
        .collect();
    found.sort_by_key(|v| {
        (
            v["name"].as_str().unwrap_or("").to_lowercase(),
            v["file"].as_str().unwrap_or("").to_lowercase(),
        )
    });
    found
}

/// Renames a preset. Never replaces a different preset: if the new name is taken, nothing
/// changes. Changing only the capitalisation of a name is allowed.
pub fn rename(dir: &Path, file: &str, new: &str) -> Result<(), String> {
    let new = new.trim();
    if new.is_empty() || new.chars().count() > MAX_NAME {
        return Err("Give the preset a name of up to 80 characters.".into());
    }
    let from = existing_path(dir, file)?;
    let to = free_path(dir, new, Some(&from));
    let same_file = from
        .file_name()
        .is_some_and(|f| f.to_string_lossy().to_lowercase() == to.file_name().map(|t| t.to_string_lossy().to_lowercase()).unwrap_or_default());
    if file_holding(dir, new).is_some_and(|f| f != from) {
        return Err(format!("A preset named “{new}” already exists."));
    }
    let mut value: Value = serde_json::from_str(
        &std::fs::read_to_string(&from).map_err(|_| "Could not read the preset.")?,
    )
    .map_err(|_| "Could not read the preset.")?;
    value["name"] = json!(new);
    let text = serde_json::to_string_pretty(&value).map_err(|_| "Could not write the preset.")?;
    let temp = to.with_extension("json.tmp");
    std::fs::write(&temp, text).map_err(|_| "Could not write the preset.")?;
    std::fs::rename(&temp, &to).map_err(|_| "Could not write the preset.")?;
    if !same_file {
        let _ = std::fs::remove_file(&from);
    }
    Ok(())
}

fn is_video_source(source: &str) -> bool {
    let s = source.to_lowercase();
    s.contains("watch?v=") || s.contains("youtu.be/") || s.contains("/shorts/")
}

/// Brings a preset file from anywhere into the preset folder for `kind`. Never replaces a
/// preset that is already there: a clash is saved as "Name (2)". Returns the name it was saved as.
pub fn import(dir: &Path, file: &Path, kind: &str) -> Result<Value, String> {
    const MAX_FILE: u64 = 1_000_000;
    let meta = std::fs::metadata(file).map_err(|_| "Could not read that file.")?;
    if !meta.is_file() || meta.len() > MAX_FILE {
        return Err("That doesn't look like a preset file.".into());
    }
    let value: Value = serde_json::from_str(
        &std::fs::read_to_string(file).map_err(|_| "Could not read that file.")?,
    )
    .map_err(|_| "That file isn't a valid preset.")?;
    let name = value["name"].as_str().unwrap_or("").trim().to_string();
    valid(&name, &value["channels"]).map_err(|_| "That file isn't a valid preset.".to_string())?;
    let list = value["channels"].as_array().unwrap();
    let videos = list.iter().filter(|c| is_video_source(c["source"].as_str().unwrap_or(""))).count();
    if kind == "videos" && videos != list.len() {
        return Err("That preset holds channels. Switch to Channels mode to load it.".into());
    }
    if kind != "videos" && videos > 0 {
        return Err("That preset holds videos. Switch to Videos mode to load it.".into());
    }
    // A file picked from the presets folder itself is loaded where it is, not copied.
    let in_place = match (file.parent().map(std::fs::canonicalize), std::fs::canonicalize(dir)) {
        (Some(Ok(parent)), Ok(folder)) => parent == folder,
        _ => false,
    };
    if in_place {
        let stem = file.file_stem().map(|s| s.to_string_lossy().into_owned()).unwrap_or_default();
        return Ok(json!({ "name": name, "file": stem }));
    }
    let taken = |n: &str| {
        let wanted = file_name(n).to_lowercase();
        file_holding(dir, n).is_some()
            || std::fs::read_dir(dir)
                .into_iter()
                .flatten()
                .flatten()
                .any(|e| e.file_name().to_string_lossy().to_lowercase() == wanted)
    };
    let mut final_name = name.clone();
    let mut n = 2;
    while taken(&final_name) {
        final_name = format!("{name} ({n})");
        n += 1;
        if n > 99 {
            return Err("Too many presets share that name.".into());
        }
    }
    let stem = save(dir, &final_name, value["channels"].clone())?;
    Ok(json!({ "name": final_name, "file": stem }))
}

/// The preset's file, if it exists, for showing in the file manager.
pub fn existing_path(dir: &Path, file: &str) -> Result<PathBuf, String> {
    let path = path_of(dir, file)?;
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
    fn finds_presets_by_file_even_when_the_file_was_renamed_in_finder() {
        let dir = scratch();
        // A copy made in Finder: the file is "AI copy.json" but the preset inside is "AI".
        std::fs::write(
            dir.join("AI copy.json"),
            serde_json::to_string(&json!({ "name": "AI", "channels": channels() })).unwrap(),
        )
        .unwrap();
        let listed = list(&dir);
        assert_eq!(listed.len(), 1);
        assert_eq!(listed[0]["name"], "AI");
        assert_eq!(listed[0]["file"], "AI copy");
        // Saving under that name is refused, even though no AI.json exists: the name is taken.
        assert!(save(&dir, "AI", json!([{ "source": "@other" }])).is_err());
        assert_eq!(std::fs::read_dir(&dir).unwrap().count(), 1);
        assert_eq!(list(&dir)[0]["channels"][0]["source"], "https://www.youtube.com/@TED");
        // Renaming works on the file the list reported.
        rename(&dir, "AI copy", "Renamed").unwrap();
        assert_eq!(list(&dir)[0]["name"], "Renamed");
        assert!(rename(&dir, "AI copy", "Again").is_err());
        // A file key is never a path.
        assert!(existing_path(&dir, "../x").is_err());
        std::fs::remove_dir_all(dir).unwrap();
    }
    #[test]
    fn imports_a_preset_file_without_replacing_anything() {
        let dir = scratch();
        let from = scratch();
        let file = from.join("shared.json");
        std::fs::write(&file, serde_json::to_string(&json!({ "name": "Shared", "channels": channels() })).unwrap()).unwrap();
        assert_eq!(import(&dir, &file, "channels").unwrap()["name"], "Shared");
        // The same file again: kept beside the first, not replacing it.
        assert_eq!(import(&dir, &file, "channels").unwrap()["name"], "Shared (2)");
        assert_eq!(import(&dir, &file, "channels").unwrap()["name"], "Shared (3)");
        assert_eq!(list(&dir).len(), 3);
        // A file picked from the presets folder itself is loaded in place, not copied.
        let loaded = import(&dir, &dir.join("Shared (2).json"), "channels").unwrap();
        assert_eq!(loaded["name"], "Shared (2)");
        assert_eq!(loaded["file"], "Shared (2)");
        assert_eq!(list(&dir).len(), 3);
        std::fs::remove_dir_all(dir).unwrap();
        std::fs::remove_dir_all(from).unwrap();
    }
    #[test]
    fn import_checks_the_file_and_the_kind() {
        let dir = scratch();
        let from = scratch();
        let write = |name: &str, text: &str| {
            let f = from.join(name);
            std::fs::write(&f, text).unwrap();
            f
        };
        assert!(import(&dir, &write("junk.json", "nope"), "channels").is_err());
        assert!(import(&dir, &write("empty.json", r#"{"name":"x","channels":[]}"#), "channels").is_err());
        assert!(import(&dir, &from.join("missing.json"), "channels").is_err());
        let videos = write(
            "v.json",
            r#"{"name":"Vids","channels":[{"source":"https://www.youtube.com/watch?v=SDSzIs9K_Sg"}]}"#,
        );
        assert!(import(&dir, &videos, "channels").unwrap_err().contains("Videos mode"));
        assert!(import(&dir, &write("c.json", &serde_json::to_string(&json!({"name":"Chans","channels":channels()})).unwrap()), "videos")
            .unwrap_err()
            .contains("Channels mode"));
        assert_eq!(import(&dir, &videos, "videos").unwrap()["name"], "Vids");
        assert!(list(&dir).len() == 1);
        std::fs::remove_dir_all(dir).unwrap();
        std::fs::remove_dir_all(from).unwrap();
    }
    #[test]
    fn video_presets_live_in_their_own_folder() {
        let data = scratch();
        let channels_dir = folder(&data, "channels");
        let videos_dir = folder(&data, "videos");
        assert_ne!(channels_dir, videos_dir);
        assert_eq!(channels_dir.parent(), videos_dir.parent());
        assert!(channels_dir.ends_with("Channels") && videos_dir.ends_with("Videos"));
        save(&channels_dir, "Shared name", channels()).unwrap();
        save(&videos_dir, "Shared name", json!([{ "source": "https://www.youtube.com/watch?v=SDSzIs9K_Sg" }])).unwrap();
        // Same name, different kinds: neither replaces the other, and neither lists the other.
        assert_eq!(list(&channels_dir).len(), 1);
        assert_eq!(list(&videos_dir).len(), 1);
        assert_eq!(list(&channels_dir)[0]["channels"][0]["source"], "https://www.youtube.com/@TED");
        std::fs::remove_dir_all(data).unwrap();
    }
    #[test]
    fn moves_legacy_channel_presets_into_the_channels_folder_without_losing_any() {
        let data = scratch();
        let base = data.join("Caption Finder").join("Presets");
        std::fs::create_dir_all(base.join("Videos")).unwrap();
        std::fs::write(base.join("Old.json"), "old").unwrap();
        std::fs::write(base.join("Old.json.bak"), "old backup").unwrap();
        std::fs::write(base.join("notes.txt"), "leave me").unwrap();
        std::fs::write(base.join("Videos").join("V.json"), "video preset").unwrap();
        // The target already holds a file of the same name: both must survive.
        std::fs::create_dir_all(base.join("Channels")).unwrap();
        std::fs::write(base.join("Channels").join("Old.json"), "already there").unwrap();
        migrate_legacy(&data);
        let channels = base.join("Channels");
        assert_eq!(std::fs::read_to_string(channels.join("Old.json")).unwrap(), "already there");
        assert_eq!(std::fs::read_to_string(channels.join("Old (2).json")).unwrap(), "old");
        assert!(channels.join("Old.json.bak").exists());
        assert!(!base.join("Old.json").exists());
        // Other files and the videos folder are left alone.
        assert!(base.join("notes.txt").exists());
        assert!(base.join("Videos").join("V.json").exists());
        // Running it again changes nothing.
        migrate_legacy(&data);
        assert_eq!(std::fs::read_dir(&channels).unwrap().count(), 3);
        std::fs::remove_dir_all(data).unwrap();
    }
    #[test]
    fn file_names_are_safe() {
        assert_eq!(file_name("Russian Accent"), "Russian Accent.json");
        assert_eq!(file_name("a/b:c"), "a-b-c.json");
        assert_eq!(file_name("..."), "Preset.json");
        assert_eq!(file_name("Русский акцент"), "Русский акцент.json");
    }
    #[test]
    fn saves_and_lists() {
        let dir = scratch();
        assert_eq!(save(&dir, "Beta", channels()).unwrap(), "Beta");
        save(&dir, "alpha", channels()).unwrap();
        let names: Vec<_> = list(&dir).iter().map(|v| v["name"].as_str().unwrap().to_string()).collect();
        assert_eq!(names, ["alpha", "Beta"]);
        assert!(existing_path(&dir, "Beta").is_ok());
        assert!(existing_path(&dir, "Gamma").is_err());
        std::fs::remove_dir_all(dir).unwrap();
    }
    #[test]
    fn renames_without_replacing_another_preset() {
        let dir = scratch();
        save(&dir, "One", channels()).unwrap();
        save(&dir, "Two", json!([{ "source": "@other" }])).unwrap();
        // A taken name is refused and both presets stay as they were.
        assert!(rename(&dir, "One", "two").is_err());
        assert_eq!(list(&dir).len(), 2);
        rename(&dir, "One", "Uno").unwrap();
        let names: Vec<_> = list(&dir).iter().map(|v| v["name"].as_str().unwrap().to_string()).collect();
        assert_eq!(names, ["Two", "Uno"]);
        assert!(existing_path(&dir, "One").is_err());
        // Only the capitalisation changes: the same file, not a clash.
        rename(&dir, "Uno", "UNO").unwrap();
        assert_eq!(list(&dir).iter().filter(|v| v["name"] == "UNO").count(), 1);
        assert_eq!(list(&dir).len(), 2);
        assert!(rename(&dir, "Missing", "X").is_err());
        assert!(rename(&dir, "Two", "  ").is_err());
        std::fs::remove_dir_all(dir).unwrap();
    }
    #[test]
    fn a_taken_file_name_never_blocks_a_save_or_a_rename() {
        let dir = scratch();
        // The file "Taken.json" holds a preset with a different name.
        std::fs::write(
            dir.join("Taken.json"),
            serde_json::to_string(&json!({ "name": "Other name", "channels": channels() })).unwrap(),
        )
        .unwrap();
        // Saving "Taken" works: only a clash of names counts. The file gets another name.
        assert_eq!(save(&dir, "Taken", channels()).unwrap(), "Taken (2)");
        let names: Vec<_> = list(&dir).iter().map(|v| v["name"].as_str().unwrap().to_string()).collect();
        assert_eq!(names, ["Other name", "Taken"]);
        assert_eq!(std::fs::read_dir(&dir).unwrap().count(), 2);
        // The same name again is a real clash.
        assert!(save(&dir, "taken", channels()).is_err());
        // Renaming onto a name whose file is taken also works; onto a taken name does not.
        save(&dir, "Plain", channels()).unwrap();
        rename(&dir, "Plain", "Other name 2").unwrap();
        assert!(rename(&dir, "Other name 2", "Taken").is_err());
        std::fs::remove_dir_all(dir).unwrap();
    }
    #[test]
    fn replacing_keeps_the_old_version_and_only_when_asked() {
        let dir = scratch();
        assert!(replace(&dir, "Nothing", channels()).is_err());
        save(&dir, "Same", channels()).unwrap();
        let other = json!([{ "source": "@other", "title": "Other" }]);
        assert!(save(&dir, "Same", other.clone()).is_err());
        assert_eq!(replace(&dir, "same", other).unwrap(), "Same");
        // The new content is in place, listed once; the old one is kept as a backup file.
        let all = list(&dir);
        assert_eq!(all.len(), 1);
        assert_eq!(all[0]["channels"][0]["source"], "@other");
        let backup = std::fs::read_to_string(dir.join("Same.json.bak")).unwrap();
        assert!(backup.contains("youtube.com/@TED"));
        assert!(!dir.join("Same.json.tmp").exists());
        std::fs::remove_dir_all(dir).unwrap();
    }
    #[test]
    fn never_saves_over_an_existing_preset_and_leaves_no_temp_file() {
        let dir = scratch();
        save(&dir, "Same", channels()).unwrap();
        let err = save(&dir, "same", json!([{ "source": "@other", "title": "Other" }])).unwrap_err();
        assert!(err.contains("already exists"));
        let all = list(&dir);
        assert_eq!(all.len(), 1);
        assert_eq!(all[0]["channels"][0]["source"], "https://www.youtube.com/@TED");
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
