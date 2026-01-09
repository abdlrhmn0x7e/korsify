import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const testimonials = [
  {
    quote:
      "This product has revolutionized the way we work. The intuitive interface and powerful features have significantly boosted our productivity.",
    name: "Sarah Chen",
    title: "CEO, Tech Solutions",
    avatar:
      "https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=200",
  },
  {
    quote:
      "Outstanding customer support and a truly robust platform. We've seen remarkable improvements since integrating this into our workflow.",
    name: "Michael Lee",
    title: "Lead Developer, Innovate Corp",
    avatar:
      "https://plus.unsplash.com/premium_photo-1658527049634-15142565537a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=200",
  },
  {
    quote:
      "A game-changer for our business! The scalability and reliability are unmatched, allowing us to focus on growth without technical worries.",
    name: "Jessica Kim",
    title: "Marketing Director, Global Brands",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=200",
  },
  {
    quote:
      "The best investment we've made this year. It's incredibly user-friendly and has exceeded all our expectations.",
    name: "David Miller",
    title: "Operations Manager, Future Systems",
    avatar:
      "https://images.unsplash.com/photo-1599566147214-ce487862ea4f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=200",
  },
  {
    quote:
      "Seamless integration and powerful analytics. This tool has given us insights we never had before.",
    name: "Emily White",
    title: "Data Scientist, Analytics Hub",
    avatar:
      "https://images.unsplash.com/photo-1649123245135-4db6ead931b5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=200",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-muted w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <header className="mx-auto max-w-xl space-y-2 text-center">
          <h2 className="font-heading text-4xl text-balance sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-balance lg:text-lg">
            Hear directly from the people who have experienced the impact of our
            product.
          </p>
        </header>
        <div className="mx-auto max-w-5xl py-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="flex h-full flex-col">
                    <CardContent className="flex grow flex-col items-center justify-center p-6 text-center">
                      <blockquote className="text-lg leading-snug lg:leading-normal">
                        &ldquo;{testimonial.quote}&rdquo;
                      </blockquote>
                      <div className="mt-6 flex flex-col items-center">
                        <Avatar className="size-12 border">
                          <AvatarImage
                            src={testimonial.avatar}
                            alt={`Avatar of ${testimonial.name}`}
                          />
                          <AvatarFallback>
                            {testimonial.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="mt-4">
                          <div className="font-semibold">
                            {testimonial.name}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            {testimonial.title}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
