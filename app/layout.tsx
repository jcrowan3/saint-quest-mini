import type { Metadata } from "next";
import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/lib/context/GameContext";
import PwaRegistration from "./components/PwaRegistration";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const buildSha = process.env.NEXT_PUBLIC_BUILD_SHA ?? "local";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saint Quest - Journey to Sainthood",
  description: "Embark on a journey with the saints. Complete quests, grow in virtue, and become an everyday saint.",
  applicationName: "Saint Quest",
  manifest: `${basePath}/manifest.webmanifest`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Saint Quest",
  },
  icons: {
    icon: [
      { url: `${basePath}/icon.svg`, type: "image/svg+xml" },
      { url: `${basePath}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { url: `${basePath}/icon-512.png`, sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: `${basePath}/icon-192.png`, sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f59e0b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="saint-quest-build" content={buildSha} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PwaRegistration />
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  );
}
