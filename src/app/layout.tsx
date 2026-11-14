import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "小學生的勇者之路 | 台灣教育部最新深化課綱・國小學習地圖與魔王挑戰",
  description:
    "專為台灣家長與國小學童設計的 RPG 冒險學習地圖！依據教育部最新深化課綱（新世代 AI 數位深化版）將 1~6 年級課程、課後作業與數位科技素養轉化為大魔王關卡，提供核心素養破關技巧與家長親職陪讀心法。",
  keywords: [
    "小學生的勇者之路",
    "教育部最新深化課綱",
    "新世代AI課綱",
    "中小學生成式AI教學指引",
    "國小學習地圖",
    "低年級",
    "中年級",
    "高年級",
    "親職教育",
    "生生用平板",
    "本土語文",
    "作業輔導",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
