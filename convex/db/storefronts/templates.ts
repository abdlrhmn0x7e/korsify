import type {
  StorefrontSection,
  StorefrontStyle,
  StorefrontTheme,
} from "./validators";

export interface StarterTemplate {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  preview: string;
  defaultTheme: StorefrontTheme;
  defaultStyle: StorefrontStyle;
  sections: Array<StorefrontSection>;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

const MINIMALIST_SECTIONS: Array<StorefrontSection> = [
  {
    id: generateId(),
    type: "hero" as const,
    variant: "centered" as const,
    visible: true,
    content: {
      headline: "Transform Your Skills with Expert-Led Courses",
      subheadline:
        "Join thousands of students learning from industry professionals",
      ctaText: "Browse Courses",
      ctaLink: "/courses",
    },
  },
  {
    id: generateId(),
    type: "courses" as const,
    variant: "grid" as const,
    visible: true,
    content: {
      title: "Featured Courses",
      subtitle: "Start your learning journey today",
      showPrice: true,
      showDuration: true,
      selectedCourseIds: [],
      viewAllLink: true,
    },
  },
  {
    id: generateId(),
    type: "about" as const,
    variant: "side-by-side" as const,
    visible: true,
    content: {
      title: "About Me",
      showStats: true,
    },
  },
  {
    id: generateId(),
    type: "cta" as const,
    variant: "simple" as const,
    visible: true,
    content: {
      headline: "Ready to Start Learning?",
      subheadline: "Join our community of learners today",
      buttonText: "Get Started",
      buttonLink: "/courses",
      showWhatsApp: false,
    },
  },
];

const ACADEMY_SECTIONS: Array<StorefrontSection> = [
  {
    id: generateId(),
    type: "hero" as const,
    variant: "split" as const,
    visible: true,
    content: {
      headline: "Learn From The Best, Become The Best",
      subheadline:
        "Professional courses designed to accelerate your career growth",
      ctaText: "Explore Programs",
      ctaLink: "/courses",
    },
  },
  {
    id: generateId(),
    type: "courses" as const,
    variant: "featured" as const,
    visible: true,
    content: {
      title: "Our Programs",
      subtitle: "Comprehensive courses for every skill level",
      showPrice: true,
      showDuration: true,
      selectedCourseIds: [],
      viewAllLink: true,
    },
  },
  {
    id: generateId(),
    type: "about" as const,
    variant: "side-by-side" as const,
    visible: true,
    content: {
      title: "Meet Your Instructor",
      showStats: true,
    },
  },
  {
    id: generateId(),
    type: "testimonials" as const,
    variant: "quotes" as const,
    visible: true,
    content: {
      title: "What Our Students Say",
      items: [
        {
          id: generateId(),
          name: "Sarah Johnson",
          role: "Software Developer",
          content:
            "This course completely transformed my career. The content is practical and the instructor explains concepts clearly.",
          rating: 5,
        },
        {
          id: generateId(),
          name: "Ahmed Hassan",
          role: "Marketing Manager",
          content:
            "Excellent course with real-world examples. I was able to apply what I learned immediately at work.",
          rating: 5,
        },
        {
          id: generateId(),
          name: "Maria Garcia",
          role: "Entrepreneur",
          content:
            "Worth every penny! The knowledge I gained helped me launch my own business.",
          rating: 5,
        },
      ],
    },
  },
  {
    id: generateId(),
    type: "faq" as const,
    variant: "accordion" as const,
    visible: true,
    content: {
      title: "Frequently Asked Questions",
      items: [
        {
          id: generateId(),
          question: "How long do I have access to the courses?",
          answer:
            "Once enrolled, you have lifetime access to all course materials.",
        },
        {
          id: generateId(),
          question: "Do I get a certificate upon completion?",
          answer:
            "Yes, you will receive a certificate of completion for each course.",
        },
        {
          id: generateId(),
          question: "What payment methods do you accept?",
          answer:
            "We accept various payment methods including credit cards and mobile payments.",
        },
        {
          id: generateId(),
          question: "Can I get a refund if I'm not satisfied?",
          answer:
            "Yes, we offer a satisfaction guarantee. Contact us within 7 days for a full refund.",
        },
      ],
    },
  },
  {
    id: generateId(),
    type: "cta" as const,
    variant: "gradient" as const,
    visible: true,
    content: {
      headline: "Start Your Learning Journey Today",
      subheadline: "Join thousands of successful students",
      buttonText: "Enroll Now",
      buttonLink: "/courses",
      showWhatsApp: true,
    },
  },
];

const COACH_SECTIONS: Array<StorefrontSection> = [
  {
    id: generateId(),
    type: "hero" as const,
    variant: "minimal" as const,
    visible: true,
    content: {
      headline: "Unlock Your Full Potential",
      subheadline: "Personal coaching and training programs that deliver results",
      ctaText: "Start Now",
      ctaLink: "/courses",
    },
  },
  {
    id: generateId(),
    type: "about" as const,
    variant: "stats-focus" as const,
    visible: true,
    content: {
      title: "Your Coach",
      showStats: true,
    },
  },
  {
    id: generateId(),
    type: "courses" as const,
    variant: "carousel" as const,
    visible: true,
    content: {
      title: "Training Programs",
      subtitle: "Choose the program that fits your goals",
      showPrice: true,
      showDuration: true,
      selectedCourseIds: [],
      viewAllLink: true,
    },
  },
  {
    id: generateId(),
    type: "testimonials" as const,
    variant: "carousel" as const,
    visible: true,
    content: {
      title: "Success Stories",
      items: [
        {
          id: generateId(),
          name: "Michael Chen",
          role: "Business Owner",
          content:
            "Working with this coach changed everything. My productivity has doubled and I finally achieved work-life balance.",
          rating: 5,
        },
        {
          id: generateId(),
          name: "Lisa Thompson",
          role: "Executive",
          content:
            "The coaching sessions were transformative. I gained clarity and confidence in my leadership.",
          rating: 5,
        },
        {
          id: generateId(),
          name: "Omar Khaled",
          role: "Athlete",
          content:
            "Best investment I ever made in myself. The training methodology is world-class.",
          rating: 5,
        },
      ],
    },
  },
  {
    id: generateId(),
    type: "cta" as const,
    variant: "image" as const,
    visible: true,
    content: {
      headline: "Ready to Transform Your Life?",
      subheadline: "Book a free consultation call",
      buttonText: "Book Now",
      buttonLink: "/courses",
      showWhatsApp: true,
    },
  },
];

const CREATIVE_SECTIONS: Array<StorefrontSection> = [
  {
    id: generateId(),
    type: "hero" as const,
    variant: "split" as const,
    visible: true,
    content: {
      headline: "Master Your Creative Craft",
      subheadline: "Learn design, art, and creativity from a working professional",
      ctaText: "View Courses",
      ctaLink: "/courses",
    },
  },
  {
    id: generateId(),
    type: "about" as const,
    variant: "centered" as const,
    visible: true,
    content: {
      title: "About the Artist",
      showStats: true,
    },
  },
  {
    id: generateId(),
    type: "courses" as const,
    variant: "grid" as const,
    visible: true,
    content: {
      title: "Creative Workshops",
      subtitle: "Hands-on courses for all skill levels",
      showPrice: true,
      showDuration: true,
      selectedCourseIds: [],
      viewAllLink: true,
    },
  },
  {
    id: generateId(),
    type: "testimonials" as const,
    variant: "cards" as const,
    visible: true,
    content: {
      title: "Student Work & Reviews",
      items: [
        {
          id: generateId(),
          name: "Emma Wilson",
          role: "Graphic Designer",
          content:
            "These courses took my design skills to the next level. The feedback was invaluable.",
          rating: 5,
        },
        {
          id: generateId(),
          name: "David Park",
          role: "Illustrator",
          content:
            "Finally found a teacher who explains complex techniques in a simple way.",
          rating: 5,
        },
        {
          id: generateId(),
          name: "Fatima Al-Rashid",
          role: "Art Student",
          content:
            "The course structure is perfect for beginners. I went from zero to creating my own artwork.",
          rating: 5,
        },
      ],
    },
  },
  {
    id: generateId(),
    type: "cta" as const,
    variant: "gradient" as const,
    visible: true,
    content: {
      headline: "Start Creating Today",
      subheadline: "Join our creative community",
      buttonText: "Join Now",
      buttonLink: "/courses",
      showWhatsApp: false,
    },
  },
];

const BOOTCAMP_SECTIONS: Array<StorefrontSection> = [
  {
    id: generateId(),
    type: "hero" as const,
    variant: "centered" as const,
    visible: true,
    content: {
      headline: "Intensive Tech Training",
      subheadline: "From beginner to job-ready in weeks, not years",
      ctaText: "Apply Now",
      ctaLink: "/courses",
    },
  },
  {
    id: generateId(),
    type: "courses" as const,
    variant: "grid" as const,
    visible: true,
    content: {
      title: "Bootcamp Programs",
      subtitle: "Intensive, project-based learning",
      showPrice: true,
      showDuration: true,
      selectedCourseIds: [],
      viewAllLink: true,
    },
  },
  {
    id: generateId(),
    type: "about" as const,
    variant: "stats-focus" as const,
    visible: true,
    content: {
      title: "Why Choose Us",
      showStats: true,
    },
  },
  {
    id: generateId(),
    type: "faq" as const,
    variant: "two-column" as const,
    visible: true,
    content: {
      title: "Common Questions",
      items: [
        {
          id: generateId(),
          question: "What prerequisites do I need?",
          answer:
            "No prior experience required. Just bring your laptop and willingness to learn.",
        },
        {
          id: generateId(),
          question: "How long is the bootcamp?",
          answer:
            "Our programs range from 4 to 12 weeks depending on the track you choose.",
        },
        {
          id: generateId(),
          question: "Will I be job-ready after completing?",
          answer:
            "Yes! Our curriculum is designed with industry requirements in mind. You'll build a portfolio of real projects.",
        },
        {
          id: generateId(),
          question: "Do you offer job placement assistance?",
          answer:
            "We provide career support including resume reviews, interview prep, and networking opportunities.",
        },
      ],
    },
  },
  {
    id: generateId(),
    type: "cta" as const,
    variant: "simple" as const,
    visible: true,
    content: {
      headline: "Limited Spots Available",
      subheadline: "Next cohort starts soon",
      buttonText: "Reserve Your Spot",
      buttonLink: "/courses",
      showWhatsApp: true,
    },
  },
];

export const STARTER_TEMPLATES: Record<string, StarterTemplate> = {
  minimalist: {
    id: "minimalist",
    name: "Minimalist",
    nameAr: "بسيط",
    description: "Clean and simple design with focus on content",
    descriptionAr: "تصميم نظيف وبسيط مع التركيز على المحتوى",
    preview: "/templates/minimalist.png",
    defaultTheme: "light",
    defaultStyle: {
      fontPair: "geist-geist",
      buttonStyle: "rounded",
      borderRadius: "0.5rem",
    },
    sections: MINIMALIST_SECTIONS,
  },
  academy: {
    id: "academy",
    name: "Academy",
    nameAr: "أكاديمية",
    description: "Professional and structured for educators",
    descriptionAr: "تصميم احترافي ومنظم للمعلمين",
    preview: "/templates/academy.png",
    defaultTheme: "light",
    defaultStyle: {
      fontPair: "inter-playfair",
      buttonStyle: "sharp",
      borderRadius: "0.25rem",
    },
    sections: ACADEMY_SECTIONS,
  },
  coach: {
    id: "coach",
    name: "Coach",
    nameAr: "مدرب",
    description: "Bold and action-oriented for coaches",
    descriptionAr: "تصميم جريء وموجه للعمل للمدربين",
    preview: "/templates/coach.png",
    defaultTheme: "dark",
    defaultStyle: {
      fontPair: "poppins-opensans",
      buttonStyle: "rounded",
      borderRadius: "0.75rem",
    },
    sections: COACH_SECTIONS,
  },
  creative: {
    id: "creative",
    name: "Creative",
    nameAr: "إبداعي",
    description: "Portfolio-style for artists and creators",
    descriptionAr: "تصميم معرض أعمال للفنانين والمبدعين",
    preview: "/templates/creative.png",
    defaultTheme: "soft",
    defaultStyle: {
      fontPair: "montserrat-lora",
      buttonStyle: "rounded",
      borderRadius: "1rem",
    },
    sections: CREATIVE_SECTIONS,
  },
  bootcamp: {
    id: "bootcamp",
    name: "Bootcamp",
    nameAr: "معسكر",
    description: "Tech-focused for intensive programs",
    descriptionAr: "تصميم تقني للبرامج المكثفة",
    preview: "/templates/bootcamp.png",
    defaultTheme: "dark",
    defaultStyle: {
      fontPair: "geist-geist",
      buttonStyle: "sharp",
      borderRadius: "0.25rem",
    },
    sections: BOOTCAMP_SECTIONS,
  },
};

export type StarterTemplateId = keyof typeof STARTER_TEMPLATES;

export const FONT_PAIRS: Record<
  string,
  { heading: string; body: string; name: string }
> = {
  "geist-geist": {
    heading: "var(--font-geist-sans)",
    body: "var(--font-geist-sans)",
    name: "Geist",
  },
  "inter-playfair": {
    heading: "Playfair Display",
    body: "Inter",
    name: "Inter + Playfair",
  },
  "cairo-tajawal": {
    heading: "Cairo",
    body: "Tajawal",
    name: "Cairo + Tajawal",
  },
  "poppins-opensans": {
    heading: "Poppins",
    body: "Open Sans",
    name: "Poppins + Open Sans",
  },
  "montserrat-lora": {
    heading: "Montserrat",
    body: "Lora",
    name: "Montserrat + Lora",
  },
};
