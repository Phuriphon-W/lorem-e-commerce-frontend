import { Geist, Geist_Mono, Neuton } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const neuton = Neuton({
  weight: ["200", "400", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});
