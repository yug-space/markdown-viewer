import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Markdown Viewer — Read markdown. Nothing else.",
  description: "A clean, distraction-free markdown viewer for macOS, Windows, and Linux. Opens .md files directly from your operating system.",
  openGraph: {
    title: "Markdown Viewer",
    description: "Read markdown. Nothing else.",
    type: "website",
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
