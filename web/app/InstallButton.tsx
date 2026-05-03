"use client";

import { useState } from "react";
import styles from "./page.module.css";

const INSTALL_CMD = "curl -fsSL https://markdown.yuggupta.com/install.sh | sh";

export default function InstallButton() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = INSTALL_CMD;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <button onClick={copy} className={styles.btnInstall} aria-label="Copy install command">
      <span className={styles.btnInstallPrompt}>$</span>
      <code className={styles.btnInstallCmd}>curl -fsSL markdown.yuggupta.com/install.sh | sh</code>
      <span className={styles.btnInstallCopy} aria-hidden>
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7l3 3 5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M5 1h6a2 2 0 0 1 2 2v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        )}
      </span>
    </button>
  );
}
