import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { CtaContent } from "@/convex/db/storefronts/validators";

interface CtaSimpleProps {
  content: CtaContent;
  whatsappNumber?: string;
}

export function CtaSimple({ content, whatsappNumber }: CtaSimpleProps) {
  const { headline, subheadline, buttonText, buttonLink, showWhatsApp } =
    content;

  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`
    : "#";

  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="bg-muted/50 flex w-full flex-col gap-6 rounded-lg p-8 md:rounded-xl lg:flex-row lg:items-center lg:p-10">
          <div className="flex-1">
            <h3 className="font-heading mb-4 text-3xl text-balance md:text-4xl">
              {headline}
            </h3>
            {subheadline && (
              <p className="text-muted-foreground text-balance lg:text-lg">
                {subheadline}
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:gap-4">
            {showWhatsApp && whatsappNumber && (
              <Button
                variant="outline"
                render={<Link href={whatsappLink} target="_blank" />}
              >
                Chat on WhatsApp
              </Button>
            )}
            <Button
              render={<Link href={buttonLink} />}
              variant="default"
              size="lg"
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
