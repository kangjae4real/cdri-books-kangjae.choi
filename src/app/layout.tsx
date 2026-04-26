import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import { Inter } from "next/font/google";
import { cn } from "@/utils/shadcn";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
    <html lang="ko" className={cn("antialiased", "font-sans", inter.variable)}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
