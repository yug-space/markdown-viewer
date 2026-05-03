import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Markdown Viewer — Read markdown. Nothing else.",
  description: "A clean, distraction-free markdown viewer for macOS, Windows, and Linux. Opens .md files directly from your operating system.",
  applicationName: "Markdown Viewer",
  authors: [{ name: "Yug Gupta" }],
  keywords: ["markdown", "viewer", "macos", "electron", "open source", "minimal"],
  openGraph: {
    title: "Markdown Viewer — Read markdown. Nothing else.",
    description: "A clean, distraction-free markdown viewer. Opens .md files directly from your operating system.",
    type: "website",
    siteName: "Markdown Viewer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Markdown Viewer",
    description: "Read markdown. Nothing else.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
