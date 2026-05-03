"use client";

import { useEffect, useState } from "react";
import { marked } from "marked";
import styles from "./page.module.css";

marked.setOptions({
  breaks: true,
  gfm: true,
});

export default function LiveDemo({ initialMarkdown }: { initialMarkdown: string }) {
  const [source, setSource] = useState(initialMarkdown);
  const [rendered, setRendered] = useState<string>("");

  useEffect(() => {
    const out = marked.parse(source) as string;
    setRendered(out);
  }, [source]);

  return (
    <section className={styles.demo}>
      <div className={styles.editor}>
        <div className={styles.editorBar}>
          <span className={styles.fileLabel}>
            <span className={styles.dot} />
            page.md
          </span>
          <span className={styles.editorHint}>edit me ↓</span>
        </div>
        <textarea
          className={styles.textarea}
          value={source}
          onChange={(e) => setSource(e.target.value)}
          spellCheck={false}
          aria-label="Markdown source"
        />
      </div>
      <div className={styles.preview}>
        <div className={styles.editorBar}>
          <span className={styles.fileLabel}>
            <span className={`${styles.dot} ${styles.dotLive}`} />
            rendered
          </span>
          <span className={styles.editorHint}>← live</span>
        </div>
        <article
          className={styles.previewContent}
          dangerouslySetInnerHTML={{ __html: rendered }}
        />
      </div>
    </section>
  );
}
