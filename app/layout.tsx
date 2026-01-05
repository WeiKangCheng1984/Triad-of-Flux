import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "天地人變數卡牌",
  description: "透過卡牌占卜獲得心理認知、運勢指引與深度思考",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}

