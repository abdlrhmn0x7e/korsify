import type { Metadata } from "next";
import {
  Instrument_Serif,
  Geist_Mono,
  Inter,
  Noto_Kufi_Arabic,
} from "next/font/google";
import "../globals.css";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { getStaticParams } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import { I18nProviderClient } from "@/locales/client";
import { AnchoredToastProvider, ToastProvider } from "@/components/ui/toast";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";

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
      className={`${inter.variable} ${instrumentSerif.variable} ${geistMono.variable} ${notoKufiArabic.variable}`}
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
        <ConvexClientProvider>
          <I18nProviderClient locale={locale}>
            <ToastProvider>
              <AnchoredToastProvider>
                <NuqsAdapter>{children}</NuqsAdapter>
              </AnchoredToastProvider>
            </ToastProvider>

            <Toaster richColors />
          </I18nProviderClient>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
