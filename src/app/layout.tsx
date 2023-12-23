import type { Metadata } from "next";

import "./globals.css";

import { cn } from "@/lib/utils";
import { fontMono, fontPoppins, fontSans } from "@/lib/fonts";
import { Providers } from "@/components/providers";
import MainHeader from "@/components/layout/main-header";

export const metadata: Metadata = {
  title: "ERP Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable,
          fontPoppins.variable
        )}
      >
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
