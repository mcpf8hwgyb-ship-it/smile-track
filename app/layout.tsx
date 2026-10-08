import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smile Track | Oral health, understood",
  description: "An early preview of Smile Track, a project for oral-health education and tracking. Not a diagnostic medical device.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
