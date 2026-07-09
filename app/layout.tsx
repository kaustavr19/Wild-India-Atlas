import type { Metadata } from "next";
import { Fraunces, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";
const display = Fraunces({ subsets: ["latin"], weight: ["400","500","600","700","900"], style: ["normal","italic"], variable: "--font-display" });
const body = Work_Sans({ subsets: ["latin"], variable: "--font-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["500","600"], variable: "--font-mono" });
export const metadata: Metadata = {
  title: "Wild India Atlas",
  description: "A map-first wildlife travel prototype for India.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" suppressHydrationWarning className={display.variable + " " + body.variable + " " + mono.variable}><body><Script id="theme-init" strategy="beforeInteractive">{themeInitScript}</Script><Header />{children}<Footer /></body></html>; }
