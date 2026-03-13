import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

import ThemeButton from "@/components/ThemeButton";
import UserMenu from "@/components/UserMenu";
import QueryProvider from "@/providers/QueryProvider";

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
  title: "Nextjs Portfolio",
  description: "Typescript Vitest React Query",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider attribute="class">
          <Theme>
            <QueryProvider>
              <header className="topbar">
                <div className="topbar-inner">
                  <Link href="/">
                    <Image
                      src="/logo.svg"
                      alt="social logo"
                      width={72}
                      height={18}
                      priority
                    />
                  </Link>

                  <nav className="topbar-menu">
                    <ThemeButton />
                    <UserMenu />
                  </nav>
                </div>
              </header>
              <div className="layout">
                <aside className="sidebar-left"></aside>
                <main className="site-content">{children}</main>
                <aside className="sidebar-right"></aside>
              </div>
            </QueryProvider>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
