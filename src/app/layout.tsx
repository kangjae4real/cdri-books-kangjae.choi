import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CERTICOS BOOKS",
  description: "CERTICOS BOOKS, kangjae.choi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="antialiased">
      <body>{children}</body>
    </html>
  );
}
