import type { Metadata } from "next";
import "./globals.css";
import "./board.css";

export const metadata: Metadata = { title: "FluentFrame — English through video", description: "Learn English from the videos you already love." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pl"><body>{children}</body></html>;
}
