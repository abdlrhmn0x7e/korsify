# Agent Guidelines for Korsify

Korsify is a Shopify-like platform for course selling. Teachers create branded storefronts with custom subdomains, sell video courses with Mux integration, and manage students.

## Commands
```bash
bun dev                  # Next.js dev server (localhost:3000)
bunx convex dev          # Convex backend dev server (run in separate terminal)
bun run build            # Production build
bun run lint             # ESLint (next/core-web-vitals + typescript)
```

## Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4, Shadcn UI, Base UI
- **Backend**: Convex (real-time database + serverless functions)
- **Auth**: Better Auth (teacher + isolated student auth per subdomain)
- **Video**: Mux (upload, processing, signed playback URLs)
- **Forms**: react-hook-form + zod | **i18n**: next-international | **State**: nuqs

## Path Aliases
- `@/*` → project root | `@storefront/*` → `./app/[locale]/storefront/[subdomain]/*`

---

## TypeScript Guidelines
- **Strict mode**; prefer `interface` over `type`; avoid enums (use const maps)
- Use `Id<"tableName">` from Convex, not `string`; use `as const` for literals
- **Naming**: directories `lowercase-with-dashes`, variables `isLoading/hasError`
- Use `function` keyword for pure functions; named exports for components

---

## React/Next.js Guidelines
- **Default to RSC**; use `'use client'` only for browser APIs/hooks
- Wrap client components in `<Suspense>`; dynamic imports for non-critical code
- Forms: `react-hook-form` + `zodResolver` + Shadcn form components
- URL state: `useQueryState` from `nuqs`

---

## Convex Backend Guidelines

### Function Syntax (ALWAYS use)
```typescript
export const getById = query({
  args: { id: v.id("courses") },
  returns: v.union(v.object({ ... }), v.null()),
  handler: async (ctx, args) => await ctx.db.get(args.id),
});
```

### Key Rules
- **ALWAYS include `args` AND `returns` validators**; use `v.null()` for void
- **Never use `.filter()`**; use `.withIndex()` with schema indexes
- Actions: add `"use node";` for Node.js; cannot access `ctx.db`
- `query/mutation/action` = public | `internal*` = private

### DAL Pattern
Database operations in `convex/db/{table}/` (queries.ts, mutations.ts, validators.ts)
```typescript
import { db } from "@/convex/db";
db.courses.queries.getById(ctx, id);
```

### Teacher Mutations
```typescript
import { teacherMutation } from "../../utils";
export const create = teacherMutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    // ctx.teacherId available
    return db.courses.mutations.create(ctx, { ...args, teacherId: ctx.teacherId });
  },
});
```

### Schema & Indexes
- Index naming: `by_field1_and_field2`; query fields in same order as index

---

## Error Handling
```typescript
// Convex: throw typed errors
import { ConvexError } from "convex/values";
if (!course) throw new ConvexError("course not found");

// Client: use toast
import { toast } from "sonner";
toast.error(error instanceof Error ? error.message : "Something went wrong");
```

---

## Styling
- Tailwind CSS 4 (mobile-first) | Shadcn UI (`@/components/ui/`) | Base UI
- Use `cn()` for conditional classes: `cn("base", isActive && "active")`

---

## File Storage & Mux
```typescript
// Storage
const uploadUrl = await ctx.storage.generateUploadUrl();
const url = await ctx.storage.getUrl(storageId);

// Mux: webhooks in convex/http.ts, signed playback URLs
// Lessons: muxAssetId, muxPlaybackId, status, duration
```

---

## Localization
```tsx
// Client: useScopedI18n("dashboard.courses")
// Server: await getScopedI18n("dashboard.courses")
// Files: locales/{en,ar}.ts - RTL support for Arabic
```

---

## Project Structure
```
app/[locale]/
├── (main)/dashboard/     # Teacher dashboard
├── (main)/admin/         # Admin panel
└── storefront/[subdomain]/ # Student storefronts

convex/
├── db/                   # DAL (Data Access Layer)
├── teachers/             # Teacher-scoped API
├── components/           # betterAuth, studentAuth
└── mux/                  # Video integration
```

---

## Cursor Rules Reference
- `.cursor/rules/ts_rules.mdc` - TypeScript/React conventions
- `.cursor/rules/convex_rules.mdc` - Convex patterns with examples
