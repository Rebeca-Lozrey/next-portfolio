import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "@/components/UserMenu";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Theme>
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
                <UserMenu />
              </nav>
            </div>
          </header>

          <main className="site-content">{children}</main>
        </Theme>
      </body>
    </html>
  );
}
