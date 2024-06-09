import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { RootProvider } from "@/components/provider";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Significados v0",
  description: "Quem sabe o que significa?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div vaul-drawer-wrapper="">
          <RootProvider>
            <div className="relative flex min-h-screen flex-col bg-background">
              {children}
            </div>
          </RootProvider>
        </div>
      </body>
    </html>
  );
}
