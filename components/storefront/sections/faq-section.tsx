"use client";

import type { FaqContent, FaqVariant } from "@/convex/db/storefronts/validators";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqSectionProps {
  content: FaqContent;
  variant: FaqVariant;
}

export function FaqSection({ content, variant }: FaqSectionProps) {
  const { title, items } = content;

  if (variant === "two-column") {
    return (
      <section className="py-20 px-4 md:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center">{title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-background p-6 rounded-lg shadow-sm space-y-3">
                <h3 className="font-semibold text-lg">{item.question}</h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 md:px-8 bg-muted/30">
      <div className="max-w-3xl mx-auto space-y-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center">{title}</h2>

        <Accordion className="w-full space-y-4">
          {items.map((item) => (
            <AccordionItem 
              key={item.id}
              className="bg-background px-6 rounded-lg border-none shadow-sm"
            >
              <AccordionTrigger className="text-lg font-medium py-6 hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 text-base">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
