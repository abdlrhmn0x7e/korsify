import { HeroSection } from "./hero-section";
import { CoursesSection } from "./courses-section";
import { AboutSection } from "./about-section";
import { TestimonialsSection } from "./testimonials-section";
import { FaqSection } from "./faq-section";
import { CtaSection } from "./cta-section";
import type { StorefrontSection } from "@/convex/db/storefronts/validators";

interface Course {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  duration?: number;
}

interface DynamicSectionProps {
  section: StorefrontSection;
  courses?: Array<Course>;
  whatsappNumber?: string;
}

export function DynamicSection({ section, courses = [], whatsappNumber }: DynamicSectionProps) {
  if (!section.visible) return null;

  switch (section.type) {
    case "hero":
      return <HeroSection content={section.content} variant={section.variant} />;
    case "courses":
      return (
        <CoursesSection
          content={section.content}
          variant={section.variant}
          courses={courses}
        />
      );
    case "about":
      return <AboutSection content={section.content} variant={section.variant} />;
    case "testimonials":
      return (
        <TestimonialsSection
          content={section.content}
          variant={section.variant}
        />
      );
    case "faq":
      return <FaqSection content={section.content} variant={section.variant} />;
    case "cta":
      return <CtaSection content={section.content} variant={section.variant} whatsappNumber={whatsappNumber} />;
    default:
      return null;
  }
}
