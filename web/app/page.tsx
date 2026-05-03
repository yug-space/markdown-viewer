import styles from "./page.module.css";
import LiveDemo from "./LiveDemo";

const initialMarkdown = `# Read markdown.

A clean, distraction-free viewer for \`.md\` files.
Opens directly from your operating system.

> *No accounts. No telemetry. Just your words.*

## How it works

1. **Install** the app
2. **Double-click** any \`.md\` file
3. That's it.

---

*This page is a real markdown file.*
**Edit the source on the left** — watch it render here, live.
`;

export default function Home() {
  return (
    <main className={styles.main}>

      <header className={styles.header}>
        <a href="/" className={styles.brand}>
          <span className={styles.brandMark}>MV</span>
          <span>Markdown Viewer</span>
        </a>
        <div className={styles.headerRight}>
          <span className={styles.tag}>v1.0 · Free</span>
          <a
            href="https://github.com/yug-space/markdown-viewer"
            target="_blank"
            rel="noreferrer"
            className={styles.btnGhost}
            aria-label="View on GitHub"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            <span>GitHub</span>
          </a>
          <a
            href="https://github.com/yug-space/markdown-viewer/releases/download/v1.0.0/Markdown-Viewer-1.0.0-arm64.dmg"
            className={styles.btnPrimary}
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="currentColor" aria-hidden>
              <path d="M14.5 9.6c0-2 1.6-2.9 1.7-3-0.9-1.4-2.4-1.5-2.9-1.6-1.2-0.1-2.4 0.7-3 0.7-0.6 0-1.6-0.7-2.6-0.7-1.4 0-2.6 0.8-3.3 2-1.4 2.4-0.4 6 1 8 0.7 1 1.5 2 2.6 2 1 0 1.4-0.7 2.7-0.7 1.2 0 1.6 0.7 2.7 0.7 1.1 0 1.8-1 2.5-2 0.8-1.1 1.1-2.2 1.1-2.3 0 0-2.1-0.8-2.1-3.1zM12.6 3.7c0.5-0.7 0.9-1.6 0.8-2.5-0.8 0-1.7 0.5-2.3 1.2-0.5 0.6-1 1.6-0.8 2.5 0.9 0.1 1.7-0.5 2.3-1.2z"/>
            </svg>
            <span>Download for Mac</span>
          </a>
        </div>
      </header>

      <LiveDemo initialMarkdown={initialMarkdown} />

      <footer className={styles.footer}>
        <span>Made with care</span>
        <span aria-hidden>·</span>
        <a
          href="https://github.com/yug-space/markdown-viewer/blob/main/LICENSE"
          target="_blank"
          rel="noreferrer"
        >
          MIT
        </a>
        <span aria-hidden>·</span>
        <span>Also for Windows & Linux</span>
      </footer>

    </main>
  );
}
