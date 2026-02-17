import type { Metadata } from "next";
import {
  Instrument_Serif,
  Geist_Mono,
  Inter,
  Noto_Kufi_Arabic,
  Geist,
  Playfair,
  Cairo,
  Tajawal,
  Poppins,
  Open_Sans,
  Montserrat,
  Lora,
} from "next/font/google";
import "../globals.css";
import { getStaticParams } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import { I18nProviderClient } from "@/locales/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

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

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const playfair = Playfair({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["latin"],
  weight: "400",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "400",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
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
      className={cn(
        inter.variable,
        instrumentSerif.variable,
        geistMono.variable,
        notoKufiArabic.variable,
        geist.variable,
        playfair.variable,
        cairo.variable,
        tajawal.variable,
        poppins.variable,
        openSans.variable,
        montserrat.variable,
        lora.variable
      )}
      style={
        {
          "--font-sans": isArabic ? "var(--font-arabic)" : "var(--font-sans)",
          "--font-serif": isArabic
            ? "var(--font-arabic)"
            : "var(--font-serif-latin)",
        } as React.CSSProperties
      }
    >
      <body className="antialiased">
        <I18nProviderClient locale={locale}>
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster richColors />
        </I18nProviderClient>
      </body>
    </html>
  );
}
