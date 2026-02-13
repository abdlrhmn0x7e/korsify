"use client";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqContent, FaqItem } from "@/convex/db/storefronts/validators";

interface FaqAccordionProps {
  content: FaqContent;
  className?: string;
}

export function FaqAccordion({ content, className }: FaqAccordionProps) {
  const { title, items } = content;

  return (
    <section className={cn("py-20 px-4 @3xl:px-8 bg-muted/30", className)}>
      <div className="container max-w-3xl mx-auto">
        <h2 className="mb-4 text-3xl font-semibold md:mb-11 md:text-4xl text-center">
          {title}
        </h2>
        <Accordion className="w-full space-y-4">
          {items.map((item: FaqItem, index: number) => (
            <AccordionItem
              key={item.id}
              value={`item-${index}`}
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
