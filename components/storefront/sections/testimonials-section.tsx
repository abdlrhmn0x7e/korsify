"use client";

import type {
  TestimonialsContent,
  TestimonialsVariant,
} from "@/convex/db/storefronts/validators";
import { TestimonialsCards } from "./testimonials/testimonials-cards";
import { TestimonialsCarousel } from "./testimonials/testimonials-carousel";
import { TestimonialsWall } from "./testimonials/testimonials-wall";

interface TestimonialsSectionProps {
  content: TestimonialsContent;
  variant: TestimonialsVariant;
}

export function TestimonialsSection({
  content,
  variant,
}: TestimonialsSectionProps) {
  switch (variant) {
    case "carousel":
      return <TestimonialsCarousel content={content} />;
    case "quotes":
      return <TestimonialsWall content={content} />;
    case "cards":
    default:
      return <TestimonialsCards content={content} />;
  }
}
