import type { Metadata } from "next";
import {
  Instrument_Sans,
  Instrument_Serif,
  Geist_Mono,
  Noto_Kufi_Arabic,
} from "next/font/google";
import "../globals.css";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Toaster } from "@/components/ui/sonner";
import { getStaticParams } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import { I18nProviderClient } from "@/locales/client";

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});
const instrumentSerif = Instrument_Serif({
  variable: "--font-serif-latin",
  subsets: ["latin"],
  weight: "400",
});

const notoKufiArabic = Noto_Kufi_Arabic({
  variable: "--font-arabic",
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

export async function generateStaticParams() {
  return getStaticParams();
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const isArabic = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${geistMono.variable} ${notoKufiArabic.variable}`}
      style={{
        "--font-serif": isArabic
          ? "var(--font-arabic)"
          : "var(--font-serif-latin)",
      } as React.CSSProperties}
    >
      <body className="antialiased">
        <ConvexClientProvider>
          <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
        </ConvexClientProvider>

        <Toaster richColors />
      </body>
    </html>
  );
}
