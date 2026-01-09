import type {
  TestimonialsContent,
  TestimonialsVariant,
  TestimonialItem,
} from "@/convex/db/storefronts/validators";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IconQuote, IconStar } from "@tabler/icons-react";

interface TestimonialItemWithUrl extends TestimonialItem {
  avatarUrl?: string;
}

interface TestimonialsSectionProps {
  content: Omit<TestimonialsContent, "items"> & {
    items: Array<TestimonialItemWithUrl>;
  };
  variant: TestimonialsVariant;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-yellow-400">
      {Array.from({ length: rating }).map((_, i) => (
        <IconStar key={i} className="w-4 h-4 fill-current" />
      ))}
    </div>
  );
}

export function TestimonialsSection({
  content,
  variant,
}: TestimonialsSectionProps) {
  const { title, items } = content;

  if (variant === "quotes") {
    return (
      <section className="py-20 px-4 md:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            {title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative p-8 bg-background rounded-lg shadow-sm"
              >
                <IconQuote className="absolute top-4 left-4 w-8 h-8 text-primary/20" />
                <div className="pt-6 space-y-4">
                  <p className="text-lg text-muted-foreground italic">
                    {`"${item.content}"`}
                  </p>
                  <div className="flex items-center gap-3 pt-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={item.avatarUrl} />
                      <AvatarFallback>{item.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      {item.role && (
                        <div className="text-sm text-muted-foreground">
                          {item.role}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "carousel") {
    return (
      <section className="py-20 px-4 md:px-8 bg-background">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            {title}
          </h2>

          <div className="space-y-8">
            {items.slice(0, 1).map((item) => (
              <div key={item.id} className="text-center space-y-6">
                <Avatar className="w-20 h-20 mx-auto">
                  <AvatarImage src={item.avatarUrl} />
                  <AvatarFallback className="text-2xl">
                    {item.name[0]}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xl text-muted-foreground italic max-w-2xl mx-auto">
                  {`"${item.content}"`}
                </p>
                <div>
                  <div className="font-semibold text-lg">{item.name}</div>
                  {item.role && (
                    <div className="text-muted-foreground">{item.role}</div>
                  )}
                </div>
                {item.rating && (
                  <div className="flex justify-center">
                    <StarRating rating={item.rating} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {items.length > 1 && (
            <div className="flex justify-center gap-2">
              {items.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === 0 ? "bg-primary" : "bg-muted-foreground/30"}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center">{title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <Card key={item.id} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={item.avatarUrl} />
                    <AvatarFallback>{item.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    {item.role && (
                      <div className="text-sm text-muted-foreground">
                        {item.role}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {item.rating && <StarRating rating={item.rating} />}
                <p className="text-muted-foreground italic">{`"${item.content}"`}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
