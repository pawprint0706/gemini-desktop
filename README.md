# Gemini Desktop

Gemini Desktop is a lightweight Electron wrapper that turns the Google Gemini web app into a Windows desktop application with tray controls. This project was generated through Codex and has no affiliation with Google.

## Development

1. Install Node.js LTS and npm.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the app:
   ```bash
   npm start
   ```

## Build Windows Executables

1. Install development dependencies:
   ```bash
   npm install
   ```
2. Package with Electron Builder (run the terminal as Administrator when building `.exe` on Windows):
   ```bash
   npm run build
   ```
3. Distribute the generated installer (`dist/*.exe`) or the portable executable.

## Features

- Uses the `Gemini.ico` icon for both the main window and the system tray
- Keeps the window minimized on the taskbar like a regular Windows app
- Close button hides the app to the tray instead of quitting
- Tray menu includes `Show Gemini`, `Reload`, and `Quit`
- External links open in the default browser

## License

Released under the Unlicense, allowing unrestricted use, modification, and distribution. See `LICENSE` for details.
