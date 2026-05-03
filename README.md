# Markdown Viewer

A clean, distraction-free markdown viewer for macOS, Windows, and Linux. Opens `.md` files directly from your operating system. Pure black & white. No clutter.

![Markdown Viewer](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-black) ![License](https://img.shields.io/badge/license-MIT-black) ![Free](https://img.shields.io/badge/price-free-black)

## Features

- **Native file association** — Double-click `.md` files in Finder/Explorer to open them
- **Recent files sidebar** — Quick access to previously opened documents
- **Drag & drop** — Drop a markdown file anywhere on the window
- **Live editing** — Toggle into edit mode with autosave
- **Syntax highlighting** — Monochrome code blocks
- **Free & open source** — No accounts, no telemetry, no subscriptions

## Project Structure

```
markdown-viewer/
├── app/              # Electron desktop app
│   ├── main.js       # Main process
│   ├── preload.js    # Preload bridge
│   ├── renderer/     # UI (HTML/CSS/JS)
│   └── assets/       # Icons
├── web/              # Next.js landing page
└── README.md
```

## Development

### Desktop App

```bash
cd app
npm install
npm start                    # Run in dev
npm run build:mac            # Build .dmg for macOS
npm run build:win            # Build .exe for Windows
npm run build:linux          # Build AppImage for Linux
```

### Landing Page

```bash
cd web
npm install
npm run dev                  # http://localhost:3000
npm run build                # Production build
```

## Tech Stack

- **Desktop**: Electron, markdown-it, highlight.js, electron-store, esbuild
- **Web**: Next.js, TypeScript, plain CSS

## License

MIT — see [LICENSE](LICENSE)

## Contributing

Pull requests welcome. For major changes, please open an issue first to discuss what you'd like to change.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.
