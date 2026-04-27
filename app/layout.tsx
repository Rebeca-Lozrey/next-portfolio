import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import ThemeButton from "@/components/ThemeButton";
import UserMenu from "@/components/UserMenu";
import { getCurrentUser } from "@/lib/modules/auth/auth.service";
import QueryProvider from "@/providers/QueryProvider";
import { UserProvider } from "@/providers/UserProvider";

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
  title: {
    default: "Next.js Portfolio",
    template: "%s | Next.js Portfolio",
  },
  description:
    "Portfolio showcasing modern web development with Next.js, TypeScript, React Query, and scalable frontend architecture.",

  metadataBase: new URL("https://next-portfolio-blush-psi.vercel.app/"),

  openGraph: {
    title: "Next.js Portfolio",
    description:
      "Explore projects built with Next.js, TypeScript, and React Query.",
    url: "https://next-portfolio-blush-psi.vercel.app/",
    siteName: "Next.js Portfolio",
    images: [
      {
        url: "/open_graph_social_image.png",
        width: 1200,
        height: 630,
        alt: "Next.js Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Next.js Portfolio",
    description:
      "Projects built with Next.js, TypeScript, and modern frontend tools.",
    images: ["/open_graph_social_image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider attribute="class">
          <Theme>
            <QueryProvider>
              <UserProvider user={user}>
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
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
              </UserProvider>
            </QueryProvider>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
