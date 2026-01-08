# Storefront Builder - Implementation Plan

## Overview

A visual storefront builder that allows teachers to customize their homepage. Teachers select a starter template for quick setup, then customize individual sections by choosing variants, editing content, and reordering. Global style settings (fonts, buttons, theme) apply across the entire storefront.

**Scope**: This plan covers the homepage builder only. Courses catalog and course detail pages are out of scope and will be implemented separately.

**Global styles** (theme, fonts, buttons, border radius, CSS variables) are stored in the storefront table and will be used by other storefront pages when they are built.

---

## 1. Data Model

### 1.0 Design Principles

1. **No data duplication** - Teacher table owns branding and contact info; storefront only stores presentation config
2. **Type-safe sections** - Discriminated union with explicit validators per section type (no `v.any()`)
3. **Per-section variants** - Each section type has its own layout/style variants, not monolithic site templates
4. **Starter templates** - Pre-configured section combinations for quick start, but sections are independently customizable after
5. **Single source of truth** - Branding fields live in `teacher.branding`, storefront references them

### 1.1 Extended Teacher Branding (modify existing table)

Add these fields to the existing `brandingValidator` in `convex/db/teachers/validators.ts`:

```typescript
// convex/db/teachers/validators.ts

export const socialLinkValidator = v.object({
  platform: v.union(
    v.literal("facebook"),
    v.literal("instagram"),
    v.literal("twitter"),
    v.literal("youtube"),
    v.literal("tiktok"),
    v.literal("linkedin")
  ),
  url: v.string(),
});

export const brandingValidator = v.object({
  // Existing fields
  logoStorageId: v.optional(v.id("_storage")),
  coverStorageId: v.optional(v.id("_storage")),
  primaryColor: v.optional(v.string()),

  // NEW: Extended branding fields
  faviconStorageId: v.optional(v.id("_storage")),
  accentColor: v.optional(v.string()),
  bio: v.optional(v.string()),

  // NEW: Contact & Social
  whatsappNumber: v.optional(v.string()),
  socialLinks: v.optional(v.array(socialLinkValidator)),
  footerText: v.optional(v.string()),
});
```

### 1.2 New Table: `storefronts`

```typescript
// convex/db/storefronts/index.ts

storefrontsTable = defineTable({
  teacherId: v.id("teachers"),

  // Theme (light/dark/soft)
  theme: v.union(v.literal("light"), v.literal("dark"), v.literal("soft")),

  // Global Style (applies to all sections)
  style: v.object({
    fontPair: v.string(),
    buttonStyle: v.union(v.literal("rounded"), v.literal("sharp")),
    borderRadius: v.optional(v.string()),
  }),

  // Sections (ordered, toggleable, typed with per-section variants)
  sections: v.array(storefrontSectionValidator),

  // Advanced CSS Variables (power users only)
  cssVariables: v.optional(v.record(v.string(), v.string())),

  updatedAt: v.number(),
}).index("by_teacherId", ["teacherId"]);
```

Note: `templateId` is removed from the stored document. Starter templates are only used during initial creation to populate the sections array. After that, sections are independently editable.

### 1.3 Typed Section Validators with Variants

Each section type has a `variant` field that controls its layout/style. The content schema is the same across variants; only the rendering differs.

```typescript
// convex/db/storefronts/validators.ts

const baseSectionFields = {
  id: v.string(),
  visible: v.boolean(),
};

// Hero Section - 4 variants
const heroSectionValidator = v.object({
  ...baseSectionFields,
  type: v.literal("hero"),
  variant: v.union(
    v.literal("centered"),     // Text centered, optional background image
    v.literal("split"),        // Image on one side, text on other
    v.literal("minimal"),      // Just headline and CTA, no image
    v.literal("video")         // Background video (future)
  ),
  content: v.object({
    headline: v.string(),
    subheadline: v.string(),
    ctaText: v.string(),
    ctaLink: v.string(),
    backgroundImageStorageId: v.optional(v.id("_storage")),
  }),
});

// Courses Section - 4 variants (homepage preview of recent courses)
const coursesSectionValidator = v.object({
  ...baseSectionFields,
  type: v.literal("courses"),
  variant: v.union(
    v.literal("grid"),         // Card grid (2-3 columns)
    v.literal("list"),         // Horizontal cards, stacked
    v.literal("carousel"),     // Swipeable horizontal scroll
    v.literal("featured")      // One large featured + smaller grid
  ),
  content: v.object({
    title: v.string(),
    subtitle: v.optional(v.string()),
    showPrice: v.boolean(),
    showDuration: v.boolean(),
    limit: v.optional(v.number()),        // Max courses to show (default: 3-6)
    viewAllLink: v.optional(v.boolean()), // Show "View All Courses" link to /courses
  }),
});

// About Section - 3 variants
const aboutSectionValidator = v.object({
  ...baseSectionFields,
  type: v.literal("about"),
  variant: v.union(
    v.literal("side-by-side"), // Image left, text right (or RTL flipped)
    v.literal("centered"),     // Image above, text below centered
    v.literal("stats-focus")   // Minimal text, prominent stats cards
  ),
  content: v.object({
    title: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    showStats: v.boolean(),
  }),
});

// Testimonials Section - 3 variants
const testimonialsSectionValidator = v.object({
  ...baseSectionFields,
  type: v.literal("testimonials"),
  variant: v.union(
    v.literal("cards"),        // Card grid
    v.literal("carousel"),     // Swipeable testimonials
    v.literal("quotes")        // Large quote style, one at a time
  ),
  content: v.object({
    title: v.string(),
    items: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        role: v.optional(v.string()),
        content: v.string(),
        avatarStorageId: v.optional(v.id("_storage")),
        rating: v.optional(v.number()),
      })
    ),
  }),
});

// FAQ Section - 2 variants
const faqSectionValidator = v.object({
  ...baseSectionFields,
  type: v.literal("faq"),
  variant: v.union(
    v.literal("accordion"),    // Collapsible accordion
    v.literal("two-column")    // Q&A in two columns
  ),
  content: v.object({
    title: v.string(),
    items: v.array(
      v.object({
        id: v.string(),
        question: v.string(),
        answer: v.string(),
      })
    ),
  }),
});

// CTA Section - 3 variants
const ctaSectionValidator = v.object({
  ...baseSectionFields,
  type: v.literal("cta"),
  variant: v.union(
    v.literal("simple"),       // Solid background, centered text
    v.literal("gradient"),     // Gradient background
    v.literal("image")         // Background image with overlay
  ),
  content: v.object({
    headline: v.string(),
    subheadline: v.optional(v.string()),
    buttonText: v.string(),
    buttonLink: v.string(),
    showWhatsApp: v.boolean(),
    backgroundImageStorageId: v.optional(v.id("_storage")),
  }),
});

// Combined discriminated union
export const storefrontSectionValidator = v.union(
  heroSectionValidator,
  coursesSectionValidator,
  aboutSectionValidator,
  testimonialsSectionValidator,
  faqSectionValidator,
  ctaSectionValidator
);

export type StorefrontSection = Infer<typeof storefrontSectionValidator>;
```

### 1.4 Variant Summary Table

| Section Type   | Variants                                      |
| -------------- | --------------------------------------------- |
| Hero           | centered, split, minimal, video               |
| Courses        | grid, list, carousel, featured                |
| About          | side-by-side, centered, stats-focus           |
| Testimonials   | cards, carousel, quotes                       |
| FAQ            | accordion, two-column                         |
| CTA            | simple, gradient, image                       |

### 1.5 Starter Templates

Starter templates are pre-configured section combinations used only during initial storefront creation. They set up the sections array with recommended variants and placeholder content. After creation, sections are fully independent.

```typescript
// convex/db/storefronts/templates.ts

interface StarterTemplate {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  preview: string;
  defaultTheme: "light" | "dark" | "soft";
  defaultStyle: {
    fontPair: string;
    buttonStyle: "rounded" | "sharp";
    borderRadius: string;
  };
  sections: StorefrontSection[];
}

const STARTER_TEMPLATES: Record<string, StarterTemplate> = {
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
    sections: [
      { id: "hero-1", type: "hero", variant: "centered", visible: true, content: { ... } },
      { id: "courses-1", type: "courses", variant: "grid", visible: true, content: { ... } },
      { id: "about-1", type: "about", variant: "side-by-side", visible: true, content: { ... } },
      { id: "cta-1", type: "cta", variant: "simple", visible: true, content: { ... } },
    ],
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
    sections: [
      { id: "hero-1", type: "hero", variant: "split", visible: true, content: { ... } },
      { id: "courses-1", type: "courses", variant: "featured", visible: true, content: { ... } },
      { id: "about-1", type: "about", variant: "side-by-side", visible: true, content: { ... } },
      { id: "testimonials-1", type: "testimonials", variant: "quotes", visible: true, content: { ... } },
      { id: "faq-1", type: "faq", variant: "accordion", visible: true, content: { ... } },
      { id: "cta-1", type: "cta", variant: "gradient", visible: true, content: { ... } },
    ],
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
    sections: [
      { id: "hero-1", type: "hero", variant: "minimal", visible: true, content: { ... } },
      { id: "about-1", type: "about", variant: "stats-focus", visible: true, content: { ... } },
      { id: "courses-1", type: "courses", variant: "carousel", visible: true, content: { ... } },
      { id: "testimonials-1", type: "testimonials", variant: "carousel", visible: true, content: { ... } },
      { id: "cta-1", type: "cta", variant: "image", visible: true, content: { ... } },
    ],
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
    sections: [
      { id: "hero-1", type: "hero", variant: "split", visible: true, content: { ... } },
      { id: "about-1", type: "about", variant: "centered", visible: true, content: { ... } },
      { id: "courses-1", type: "courses", variant: "grid", visible: true, content: { ... } },
      { id: "testimonials-1", type: "testimonials", variant: "cards", visible: true, content: { ... } },
      { id: "cta-1", type: "cta", variant: "gradient", visible: true, content: { ... } },
    ],
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
    sections: [
      { id: "hero-1", type: "hero", variant: "centered", visible: true, content: { ... } },
      { id: "courses-1", type: "courses", variant: "grid", visible: true, content: { ... } },
      { id: "about-1", type: "about", variant: "stats-focus", visible: true, content: { ... } },
      { id: "faq-1", type: "faq", variant: "two-column", visible: true, content: { ... } },
      { id: "cta-1", type: "cta", variant: "simple", visible: true, content: { ... } },
    ],
  },
};

export type StarterTemplateId = keyof typeof STARTER_TEMPLATES;
```

### 1.6 Font Pairs

```typescript
const FONT_PAIRS = {
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
```

### 1.7 Data Flow

The teacher table stores identity and branding data: name, email, subdomain, logo, colors, bio, social links, and WhatsApp number.

The storefront table stores presentation config: theme, global style (fonts, buttons, radius), and the sections array with per-section variants and content.

During homepage rendering:
- Navbar and Footer read from `teacher.branding` for logo, social links, and footer text
- About section reads bio from `teacher.branding.bio`
- CTA section reads WhatsApp from `teacher.branding.whatsappNumber` when `showWhatsApp` is true
- Courses section fetches recent published courses from the database (not stored in section content)
- All other section content comes from the sections array in the storefront table

---

## 2. Backend (Convex Functions)

### 2.1 File Structure

```
convex/
├── db/
│   └── storefronts/
│       ├── index.ts           # Table definition + DAL export
│       ├── validators.ts      # Section validators with variants
│       ├── queries.ts         # getByTeacherId (joins teacher branding)
│       ├── mutations.ts       # CRUD operations
│       └── templates.ts       # Starter template definitions
```

### 2.2 Queries

| Function           | Arguments       | Returns                              | Purpose                         |
| ------------------ | --------------- | ------------------------------------ | ------------------------------- |
| `getByTeacherId`   | `{ teacherId }` | `{ storefront, branding }` with URLs | For builder and public render   |

### 2.3 Mutations

| Function                  | Arguments                                   | Returns             | Purpose                           |
| ------------------------- | ------------------------------------------- | ------------------- | --------------------------------- |
| `createFromTemplate`      | `{ starterTemplateId }`                     | `Id<"storefronts">` | Initialize from starter template  |
| `updateStyle`             | `{ theme?, style? }`                        | `null`              | Update global style settings      |
| `updateSection`           | `{ sectionId, variant?, content? }`         | `null`              | Update section variant or content |
| `reorderSections`         | `{ sectionIds[] }`                          | `null`              | Change section order              |
| `toggleSectionVisibility` | `{ sectionId, visible }`                    | `null`              | Show/hide section                 |
| `addSection`              | `{ type, variant, afterSectionId? }`        | `null`              | Add new section                   |
| `removeSection`           | `{ sectionId }`                             | `null`              | Delete section                    |
| `updateCssVariables`      | `{ cssVariables }`                          | `null`              | Update advanced CSS overrides     |

---

## 3. Frontend Architecture

### 3.1 Page Structure

```
app/[locale]/(main)/dashboard/(main)/storefront/
├── page.tsx
├── loading.tsx
└── _components/
    ├── builder/
    │   ├── storefront-builder.tsx      # Main layout (sidebar + preview)
    │   ├── builder-sidebar.tsx         # Sidebar with slide-in navigation
    │   ├── builder-preview.tsx         # Live preview iframe/component
    │   └── builder-context.tsx         # State management for builder
    ├── sidebar/
    │   ├── sidebar-menu.tsx            # Main menu (level 1)
    │   ├── sidebar-panel.tsx           # Slide-in panel wrapper (level 2)
    │   └── section-list.tsx            # Draggable section list
    ├── forms/
    │   ├── template-form.tsx           # Starter template picker
    │   ├── theme-form.tsx              # Light/Dark/Soft selector
    │   ├── typography-form.tsx         # Font pair selector
    │   ├── buttons-form.tsx            # Button style + border radius
    │   ├── css-variables-form.tsx      # Advanced CSS overrides
    │   └── sections/
    │       ├── hero-form.tsx
    │       ├── courses-form.tsx
    │       ├── about-form.tsx
    │       ├── testimonials-form.tsx
    │       ├── faq-form.tsx
    │       └── cta-form.tsx
    └── preview/
        ├── preview-frame.tsx           # Preview container with viewport controls
        └── preview-renderer.tsx        # Renders storefront for preview

app/[locale]/storefront/[subdomain]/_components/sections/
├── dynamic-section.tsx
├── hero/
│   ├── hero-centered.tsx
│   ├── hero-split.tsx
│   ├── hero-minimal.tsx
│   └── hero-video.tsx
├── courses/
│   ├── courses-grid.tsx
│   ├── courses-list.tsx
│   ├── courses-carousel.tsx
│   └── courses-featured.tsx
├── about/
│   ├── about-side-by-side.tsx
│   ├── about-centered.tsx
│   └── about-stats-focus.tsx
├── testimonials/
│   ├── testimonials-cards.tsx
│   ├── testimonials-carousel.tsx
│   └── testimonials-quotes.tsx
├── faq/
│   ├── faq-accordion.tsx
│   └── faq-two-column.tsx
└── cta/
    ├── cta-simple.tsx
    ├── cta-gradient.tsx
    └── cta-image.tsx
```

Branding (logo, colors, bio, social links, WhatsApp) is edited in Dashboard Settings, not the storefront builder. The builder controls presentation: theme, style, sections, and variants.

### 3.2 Builder UI Layout

The builder has a split layout with a sidebar on the left (approximately 320px wide) and a live preview on the right.

**Header**: Shows "Storefront Builder" title with Preview button on the right (opens storefront in new tab).

**Sidebar**: Two-level navigation with slide-in panels for configuration forms.

**Preview Area**: Shows the rendered storefront with viewport controls at the bottom (Desktop, Tablet, Mobile buttons) to test responsiveness.

**Footer**: Shows auto-save status ("All changes saved" or "Saving...").

### 3.3 Sidebar Structure

The sidebar uses a slide-in pattern: clicking any button slides the main menu out and slides in a configuration form. Each form is pre-filled with current values from the backend and submits changes on save.

**Main Menu (Level 1):**

```
┌─────────────────────────────┐
│  APPEARANCE                 │
├─────────────────────────────┤
│  [Template]           →     │
│  [Theme]              →     │
│  [Typography]         →     │
│  [Buttons]            →     │
├─────────────────────────────┤
│  SECTIONS                   │
├─────────────────────────────┤
│  [Hero]               →     │
│  [Courses]            →     │
│  [About]              →     │
│  [Testimonials]       →     │
│  [FAQ]                →     │
│  [CTA]                →     │
│  + Add Section              │
├─────────────────────────────┤
│  ADVANCED                   │
├─────────────────────────────┤
│  [CSS Variables]      →     │
├─────────────────────────────┤
│  Edit branding in Settings  │
└─────────────────────────────┘
```

**Configuration Panel (Level 2):**

When a button is clicked, the sidebar slides to show the configuration form:

```
┌─────────────────────────────┐
│  ← Back          Theme      │
├─────────────────────────────┤
│                             │
│  Theme Mode                 │
│  ○ Light  ○ Dark  ○ Soft    │
│                             │
│  [Preview updates live]     │
│                             │
├─────────────────────────────┤
│  [Save Changes]             │
└─────────────────────────────┘
```

### 3.4 Sidebar Sections

**APPEARANCE Section:**

| Button | Configuration Form |
|--------|-------------------|
| Template | Grid of starter templates. Warning if storefront exists. Selecting applies template. |
| Theme | Radio group: Light / Dark / Soft |
| Typography | Font pair dropdown with preview text showing heading + body fonts |
| Buttons | Button style toggle (Rounded / Sharp) + Border radius slider (0 to 1.5rem) |

**SECTIONS Section:**

Shows list of current sections in order. Each section button shows:
- Section type name
- Current variant in muted text
- Eye icon indicating visibility (filled = visible, outline = hidden)

Clicking a section opens its configuration form:
- Visibility toggle at top
- Variant selector (visual cards or segmented control)
- Content fields specific to section type
- Delete section button at bottom (with confirmation)

Sections can be reordered via drag handles (visible on hover).

"+ Add Section" button opens a picker showing available section types to add.

**ADVANCED Section:**

| Button | Configuration Form |
|--------|-------------------|
| CSS Variables | Grouped inputs for color overrides, spacing, etc. Reset to Defaults button. |

### 3.5 Configuration Form Behavior

Each configuration form follows the same pattern:

1. **Pre-fill**: Form loads with current values from backend (via the storefront query)
2. **Live Preview**: Changes update the preview immediately (optimistic UI)
3. **Save**: "Save Changes" button submits to backend mutation
4. **Cancel**: "← Back" navigates back without saving (reverts preview to saved state)
5. **Validation**: Form validates before allowing save
6. **Loading States**: Save button shows loading spinner during mutation

### 3.6 Section Editor Forms

**Hero Section:**
- Visibility toggle
- Variant selector: Centered | Split | Minimal | Video
- Headline (text input)
- Subheadline (text input)
- CTA Text (text input)
- CTA Link (text input or page picker)
- Background Image (upload with preview)

**Courses Section:**
- Visibility toggle
- Variant selector: Grid | List | Carousel | Featured
- Section Title (text input)
- Subtitle (optional text input)
- Show Price toggle
- Show Duration toggle
- Limit (number input, default 4)
- Show "View All" Link toggle

**About Section:**
- Visibility toggle
- Variant selector: Side-by-side | Centered | Stats Focus
- Section Title (text input)
- Image (upload with preview)
- Show Stats toggle
- Note: Bio text comes from teacher.branding.bio (link to Settings)

**Testimonials Section:**
- Visibility toggle
- Variant selector: Cards | Carousel | Quotes
- Section Title (text input)
- Testimonials list (add/edit/remove/reorder items)
  - Each item: Name, Role (optional), Content, Avatar (optional), Rating (optional)

**FAQ Section:**
- Visibility toggle
- Variant selector: Accordion | Two-column
- Section Title (text input)
- FAQ items list (add/edit/remove/reorder)
  - Each item: Question, Answer

**CTA Section:**
- Visibility toggle
- Variant selector: Simple | Gradient | Image
- Headline (text input)
- Subheadline (optional text input)
- Button Text (text input)
- Button Link (text input or page picker)
- Show WhatsApp toggle
- Background Image (for "image" variant only)

---

## 4. Storefront Rendering

### 4.1 Layout

The storefront layout fetches both the storefront config and teacher branding in a single query. It generates CSS variables from the combined data (branding colors + storefront style + custom overrides) and wraps the page in a theme provider.

**Shared layout elements:**
- Navbar (logo, navigation links)
- Footer (social links, footer text)
- Theme provider with CSS variables
- Font loading based on selected font pair

### 4.2 Homepage - Dynamic Section Rendering

The homepage maps over the visible sections and renders each through a DynamicSection component. This component uses a type-safe switch statement on `section.type` to select the section component, then another switch on `section.variant` within each section type to select the specific variant component.

Example flow for a hero section with "split" variant:
1. DynamicSection receives `{ type: "hero", variant: "split", content: {...} }`
2. Switches on type, matches "hero"
3. Passes to HeroSection component
4. HeroSection switches on variant, matches "split"
5. Renders HeroSplit component with the content

### 4.3 Homepage - Section Components

Each section type has a folder containing variant components:
- `hero/hero-centered.tsx`, `hero/hero-split.tsx`, etc.
- All variants share the same content props interface
- Variants only differ in layout and styling

The parent section component (e.g., `HeroSection`) handles the variant switching and passes content + branding props to the appropriate variant component.

### 4.4 Courses Section Behavior

The courses section on the homepage is a **preview/showcase** of recent courses:
- Fetches recent published courses from the database (ordered by createdAt desc)
- Respects `limit` from content (default: 4-6 courses)
- Shows "View All Courses" link when `viewAllLink` is true, linking to `/courses`
- Course data is fetched at render time, not stored in section content

---

## 5. Placeholder Content

Each starter template includes contextual placeholder content in both English and Arabic.

**Hero placeholders vary by variant:**
- Centered: "Transform Your Skills with Expert-Led Courses" / "طوّر مهاراتك مع دورات يقودها خبراء"
- Split: "Learn From The Best, Become The Best" / "تعلم من الأفضل، كن الأفضل"
- Minimal: "Start Learning Today" / "ابدأ التعلم اليوم"

**Testimonial placeholders** include 3 sample testimonials with names, roles, and content in both languages.

**FAQ placeholders** include 4-5 common questions about course access, payment, certificates, etc.

---

## 6. Implementation Phases

### Phase 1: Database & Backend (2-3 days)

1. Extend `brandingValidator` in teachers table with bio, socialLinks, whatsappNumber, etc.
2. Create `storefronts` table with typed section validators including variants
3. Define all 5 starter templates with their default configurations
4. Implement storefront mutations (createFromTemplate, updateSection, reorderSections, etc.)
5. Create query that joins storefront with teacher branding
6. Add migration to create default storefront for existing teachers

### Phase 2: Builder Shell (2-3 days)

1. Create builder page layout with sidebar and preview area
2. Implement BuilderContext for state management (current panel, form state, mutations)
3. Create sidebar-menu with grouped buttons (Appearance, Sections, Advanced)
4. Create sidebar-panel component for slide-in navigation
5. Add preview viewport controls (Desktop, Tablet, Mobile)
6. Add "Edit branding in Settings" link

### Phase 3: Appearance & Advanced Forms (2-3 days)

1. **Template Form**: Starter template grid with preview images, apply confirmation
2. **Theme Form**: Light/Dark/Soft radio group
3. **Typography Form**: Font pair dropdown with live preview
4. **Buttons Form**: Button style toggle + border radius slider
5. **CSS Variables Form**: Grouped color/spacing inputs with reset button
6. Wire up all forms to mutations with optimistic updates

### Phase 4: Section Forms (3-4 days)

1. Create section-list component with drag-drop reordering
2. Create base section form wrapper (visibility toggle, variant selector, delete)
3. Build hero-form with all content fields
4. Build courses-form with limit and view-all options
5. Build about-form with image upload
6. Build testimonials-form with list management (add/edit/remove/reorder items)
7. Build faq-form with list management
8. Build cta-form with conditional background image field

### Phase 5: Section Variant Components (3-4 days)

1. Build all hero variants (4 components)
2. Build all courses variants (4 components)
3. Build all about variants (3 components)
4. Build all testimonials variants (3 components)
5. Build all FAQ variants (2 components)
6. Build all CTA variants (3 components)

### Phase 6: Polish & Testing (2 days)

1. Add loading states and skeletons
2. Implement error handling and toast notifications
3. Add Arabic translations for all builder UI
4. Test all starter templates and variants
5. Mobile responsiveness for builder interface

---

## 7. File Inventory

### New Files to Create

**Backend (Convex):**

```
convex/db/storefronts/
├── index.ts              # Table definition + DAL export
├── validators.ts         # Section validators with variants
├── queries.ts            # getByTeacherId with branding join
├── mutations.ts          # All mutation handlers
└── templates.ts          # Starter template definitions
```

**Frontend - Builder:**

```
app/[locale]/(main)/dashboard/(main)/storefront/
├── page.tsx
├── loading.tsx
└── _components/
    ├── builder/
    │   ├── storefront-builder.tsx
    │   ├── builder-sidebar.tsx
    │   ├── builder-preview.tsx
    │   └── builder-context.tsx
    ├── sidebar/
    │   ├── sidebar-menu.tsx
    │   ├── sidebar-panel.tsx
    │   └── section-list.tsx
    ├── forms/
    │   ├── template-form.tsx
    │   ├── theme-form.tsx
    │   ├── typography-form.tsx
    │   ├── buttons-form.tsx
    │   ├── css-variables-form.tsx
    │   └── sections/
    │       ├── hero-form.tsx
    │       ├── courses-form.tsx
    │       ├── about-form.tsx
    │       ├── testimonials-form.tsx
    │       ├── faq-form.tsx
    │       └── cta-form.tsx
    └── preview/
        ├── preview-frame.tsx
        └── preview-renderer.tsx
```

**Frontend - Storefront Sections (19 variant components):**

```
app/[locale]/storefront/[subdomain]/_components/sections/
├── dynamic-section.tsx
├── hero/
│   ├── hero-centered.tsx
│   ├── hero-split.tsx
│   ├── hero-minimal.tsx
│   └── hero-video.tsx
├── courses/
│   ├── courses-grid.tsx
│   ├── courses-list.tsx
│   ├── courses-carousel.tsx
│   └── courses-featured.tsx
├── about/
│   ├── about-side-by-side.tsx
│   ├── about-centered.tsx
│   └── about-stats-focus.tsx
├── testimonials/
│   ├── testimonials-cards.tsx
│   ├── testimonials-carousel.tsx
│   └── testimonials-quotes.tsx
├── faq/
│   ├── faq-accordion.tsx
│   └── faq-two-column.tsx
└── cta/
    ├── cta-simple.tsx
    ├── cta-gradient.tsx
    └── cta-image.tsx
```

**Translations:**

```
locales/messages/en/storefront-builder.ts
locales/messages/ar/storefront-builder.ts
```

### Files to Modify

1. `convex/db/teachers/validators.ts` - Extend brandingValidator
2. `convex/db/index.ts` - Add storefronts table export
3. `convex/schema.ts` - Include storefronts in schema
4. `app/[locale]/storefront/[subdomain]/layout.tsx` - Apply theme and CSS variables
5. `app/[locale]/storefront/[subdomain]/(app)/page.tsx` - Render dynamic sections (homepage)
6. `app/[locale]/storefront/[subdomain]/_components/navbar.tsx` - Use teacher.branding
7. `app/[locale]/storefront/[subdomain]/_components/footer.tsx` - Use teacher.branding
