import type { FaqContent } from "@/convex/db/storefronts/validators";

interface FaqTwoColumnProps {
  content: FaqContent;
}

export function FaqTwoColumn({ content }: FaqTwoColumnProps) {
  const { title, items } = content;

  return (
    <section className="py-20 px-4 @3xl:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto space-y-12">
        <h2 className="text-3xl @3xl:text-4xl font-bold text-center">{title}</h2>

        <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-6">
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
