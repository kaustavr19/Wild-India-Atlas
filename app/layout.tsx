import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";
const display = Fraunces({ subsets: ["latin"], weight: ["400","500","600","700","900"], style: ["normal","italic"], variable: "--font-display" });
const body = Work_Sans({ subsets: ["latin"], variable: "--font-body" });
export const metadata: Metadata = { title: "Wild India Atlas", description: "A map-first wildlife travel prototype for India." };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" className={display.variable + " " + body.variable}><body><Header />{children}</body></html>; }
