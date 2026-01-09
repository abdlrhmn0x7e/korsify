"use client";

import { IconStar } from "@tabler/icons-react";
import { MarqueeEffect } from "@/components/ui/marquee-effect";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface TestimonialCardProps {
  name: string;
  role: string;
  img?: string;
  description: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

const testimonials = [
  {
    name: "Jordan Hayes",
    role: "CTO at Quantum Innovations",
    img: "https://randomuser.me/api/portraits/men/22.jpg",
    description:
      "Bundui completely transformed our workflow. The component system saved us weeks of custom coding and design work, letting the team focus on business logic instead of UI details.",
  },
  {
    name: "Maya Rodriguez",
    role: "Lead Developer at Skyline Digital",
    img: "https://randomuser.me/api/portraits/women/33.jpg",
    description:
      "I was skeptical at first but Bundui exceeded expectations. Its accessibility features and responsive design are outstanding and it balances aesthetics with real functionality.",
  },
  {
    name: "Ethan Park",
    role: "Startup Founder at Elevate Labs",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    description:
      "As a non-technical founder, Bundui was a game-changer for our MVP. We launched months ahead of schedule thanks to modular components that enabled rapid iteration.",
  },
  {
    name: "Zoe Bennett",
    role: "UX Architect at Fusion Systems",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    description:
      "Bundui's attention to detail impressed us. The micro-interactions and animations give projects a polished feel, making it our go-to for tight-deadline client work.",
  },
  {
    name: "Victor Nguyen",
    role: "Product Lead at FinEdge",
    img: "https://randomuser.me/api/portraits/men/55.jpg",
    description:
      "Our financial dashboard needed an overhaul and Bundui delivered. The data visualization components are both attractive and practical, and engagement metrics improved significantly.",
  },
  {
    name: "Amara Johnson",
    role: "Frontend Specialist at Nimbus Tech",
    img: "https://randomuser.me/api/portraits/women/67.jpg",
    description:
      "The documentation is excellent. I implemented complex UI patterns in a few hours and the TypeScript support noticeably boosted productivity across the team.",
  },
  {
    name: "Leo Tanaka",
    role: "Creative Technologist at Prism Agency",
    img: "https://randomuser.me/api/portraits/men/78.jpg",
    description:
      "Bundui strikes the right balance between flexibility and structure. We keep brand consistency while still crafting unique experiences that delight clients.",
  },
  {
    name: "Sophia Martinez",
    role: "E-commerce Director at StyleHub",
    img: "https://randomuser.me/api/portraits/women/89.jpg",
    description:
      "Since adopting Bundui our conversion rates went up. The checkout components are optimized for both desktop and mobile, and dark mode was a customer favorite.",
  },
  {
    name: "Aiden Wilson",
    role: "Healthcare Solutions Architect",
    img: "https://randomuser.me/api/portraits/men/92.jpg",
    description:
      "Accessibility features were crucial for our healthcare platform. Bundui helped us meet compliance with minimal extra work; its form components handle complex data entry gracefully.",
  },
  {
    name: "Olivia Chen",
    role: "EdTech Product Manager at LearnSphere",
    img: "https://randomuser.me/api/portraits/women/29.jpg",
    description:
      "We needed a platform usable by students of all ages and abilities. Bundui's inclusive design principles made this possible, and interactive components boosted student engagement.",
  },
];

export function TestimonialCard({ item }: { item: TestimonialCardProps }) {
  return (
    <div className="bg-muted/50 hover:bg-muted mb-4 flex w-full cursor-pointer flex-col items-center justify-between gap-4 rounded-lg p-4 transition-colors">
      <div className="text-muted-foreground space-y-4">
        <p>{item.description}</p>
        <div className="flex flex-row gap-1">
          <IconStar className="size-4 fill-orange-500 text-orange-500" />
          <IconStar className="size-4 fill-orange-500 text-orange-500" />
          <IconStar className="size-4 fill-orange-500 text-orange-500" />
          <IconStar className="size-4 fill-orange-500 text-orange-500" />
          <IconStar className="size-4 fill-orange-500 text-orange-500" />
        </div>
      </div>

      <div className="flex w-full items-center justify-start gap-3">
        <Avatar>
          <AvatarImage src={item.img} />
        </Avatar>

        <div>
          <p className="text-foreground font-medium">{item.name}</p>
          <p className="text-muted-foreground text-xs">{item.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-12 lg:py-20">
      <div className="container mx-auto px-4">
        <header className="mx-auto mb-8 max-w-2xl text-center lg:mb-10">
          <Badge variant="outline" className="text-indigo-600">
            Testimonials
          </Badge>
          <h3 className="font-heading mt-4 mb-4 text-4xl sm:text-5xl lg:text-balance">
            Loved by Teams Worldwide
          </h3>
          <p className="text-muted-foreground text-balance lg:text-lg">
            {
              "Don't just take our word for it. See what our customers have to say about their experience."
            }
          </p>
        </header>
        <div className="grid h-60 grid-cols-1 gap-4 overflow-hidden mask-t-from-80% mask-b-from-80% md:grid-cols-2 lg:h-150 lg:grid-cols-3">
          {[
            {
              reverse: false,
            },
            {
              reverse: true,
            },
            {
              reverse: false,
            },
          ].map((mq, i) => (
            <div key={`mq-${i}`}>
              <MarqueeEffect
                gap={8}
                direction="vertical"
                reverse={mq.reverse}
                speed={30}
                speedOnHover={1}
              >
                {testimonials
                  .slice(i * 3, (i + 1) * 3)
                  .map((testimonial, index) => (
                    <TestimonialCard key={index} item={testimonial} />
                  ))}
              </MarqueeEffect>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
