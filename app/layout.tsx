import type { Metadata } from "next";
import "./globals.css";
import HistoryRetention from "./routine/history-retention";

export const metadata: Metadata = {
  title: "Smile Track | Oral health, understood",
  description: "An early preview of Smile Track, a project for oral-health education and tracking. Not a diagnostic medical device.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><HistoryRetention />{children}</body></html>;
}
