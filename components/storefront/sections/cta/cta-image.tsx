import { IconChevronRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { CtaContent } from "@/convex/db/storefronts/validators";
import { LazyStorageImage } from "@/components/lazy-storage-image";

interface CtaImageProps {
  content: CtaContent;
  whatsappNumber?: string;
}

export function CtaImage({ content, whatsappNumber }: CtaImageProps) {
  const {
    headline,
    subheadline,
    buttonText,
    buttonLink,
    showWhatsApp,
    backgroundImageStorageId,
  } = content;

  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`
    : "#";

  return (
    <section className="py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="bg-muted relative grid grid-cols-1 flex-col justify-between gap-4 overflow-hidden rounded-lg text-center lg:grid-cols-2 lg:flex-row lg:gap-10 lg:text-start">
          <header className="flex flex-col px-4 py-10 lg:px-10">
            <div className="mb-4 space-y-4">
              <h3 className="font-heading text-3xl text-balance md:text-4xl">
                {headline}
              </h3>
              {subheadline && (
                <p className="text-muted-foreground md:text-lg">{subheadline}</p>
              )}
            </div>
            <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row! lg:justify-start">
              <Button render={<Link href={buttonLink} />}>
                {buttonText}
                <IconChevronRight />
              </Button>
              {showWhatsApp && whatsappNumber && (
                <Button
                  variant="outline"
                  render={<Link href={whatsappLink} target="_blank" />}
                >
                  Chat on WhatsApp
                </Button>
              )}
            </div>
          </header>
          <figure className="relative lg:mt-10 lg:self-end">
            {backgroundImageStorageId ? (
              <LazyStorageImage
                storageId={backgroundImageStorageId}
                alt={headline}
                className="lg:rounded-te-none aspect-video w-full rounded-tl-lg rounded-tr-lg lg:rounded-tr-none"
                fallback={
                  <div className="lg:rounded-te-none aspect-video w-full rounded-tl-lg rounded-tr-lg lg:rounded-tr-none bg-muted-foreground/10" />
                }
              />
            ) : (
              <div className="lg:rounded-te-none aspect-video w-full rounded-tl-lg rounded-tr-lg lg:rounded-tr-none bg-muted-foreground/10" />
            )}
          </figure>
        </div>
      </div>
    </section>
  );
}
