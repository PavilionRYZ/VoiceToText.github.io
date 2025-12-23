// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::command;

#[command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[command]
fn type_text(text: String) {
    use enigo::{Enigo, Keyboard, Settings};
    use std::{thread, time};

    // Give user time to focus another app
    thread::sleep(time::Duration::from_millis(300));

    let mut enigo = Enigo::new(&Settings::default())
        .expect("Failed to initialize Enigo");

    enigo
        .text(&text)
        .expect("Failed to type text");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, type_text])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
