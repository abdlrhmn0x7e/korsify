import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Noto_Sans,
  Noto_Serif,
  Noto_Kufi_Arabic,
} from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { NextIntlClientProvider, useLocale } from "next-intl";

const notoSans = Noto_Sans({ variable: "--font-sans" });
const notoSerif = Noto_Serif({ variable: "--font-serif" });
const notoKufiArabic = Noto_Kufi_Arabic({
  variable: "--font-serif",
  subsets: ["arabic"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Korsify",
  description:
    " A Shopify-like platform for secure course selling. Korsify enables teachers to create their own branded storefronts with custom subdomains, sell courses with video lessons, and manage students with secure, watermarked video delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = useLocale();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${notoSans.variable} ${notoKufiArabic.variable}`}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${locale === "ar" ? notoKufiArabic.variable : notoSerif.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
