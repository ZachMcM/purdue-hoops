import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/QueryProvider";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";
import icon from "./favicon.ico";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Purdue Hoops",
  description:
    "Join the Purdue Hoops community and revolutionize your pickup basketball experience! Discover real-time game schedules, compete on leaderboards, rate players, and customize your profile. Download now!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <html lang="en">
        <body>
          <div className="flex flex-col min-h-[100dvh]">
            <main className="flex-1">
              <header className="flex items-center justify-between px-4 md:px-6 h-14 border-b">
                <Link href="/">
                  <Image
                    height="32"
                    width="32"
                    src={icon}
                    alt="icon"
                    className="rounded-md"
                  />
                </Link>
              </header>
              {children}
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
              <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                © 2024 Purdue Hoops. All rights reserved.
              </p>
              <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                <Link
                  className="text-xs hover:underline underline-offset-4"
                  href="/privacy"
                >
                  Privacy
                </Link>
              </nav>
            </footer>
          </div>
          <Toaster />
        </body>
      </html>
    </QueryProvider>
  );
}
