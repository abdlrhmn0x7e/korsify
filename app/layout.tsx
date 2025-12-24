import type { Metadata } from "next";
import {
  Instrument_Sans,
  Instrument_Serif,
  Geist_Mono,
  Noto_Kufi_Arabic,
} from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { Toaster } from "@/components/ui/sonner";

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});
const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

const notoKufiArabic = Noto_Kufi_Arabic({
  variable: "--font-serif",
  subsets: ["arabic"],
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
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${geistMono.variable} ${notoKufiArabic.variable}`}
    >
      <body
        className={`${locale === "ar" ? notoKufiArabic.variable : instrumentSerif.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </NextIntlClientProvider>

        <Toaster richColors />
      </body>
    </html>
  );
}
