# Agent Guidelines for Korsify

## Commands
- **Dev**: `bun dev` (Next.js) + `bunx convex dev` (Convex backend)
- **Build**: `bun run build`
- **Lint**: `bun run lint`

## Code Style
- TypeScript strict mode; prefer `interface` over `type`; avoid `enums` (use maps)
- Functional/declarative patterns; no classes; named exports for components
- Directories: lowercase-with-dashes (e.g., `components/auth-wizard`)
- Variables: descriptive with auxiliary verbs (`isLoading`, `hasError`)
- Use `function` keyword for pure functions; avoid unnecessary braces in conditionals

## React/Next.js
- Favor React Server Components; minimize `'use client'`, `useEffect`, `setState`
- Wrap client components in `Suspense`; use dynamic imports for non-critical code
- Use `nuqs` for URL search params; Shadcn UI + Radix + Tailwind for styling
- Path alias: `@/*` maps to project root

## Convex Backend
- All functions require `args` + `returns` validators; use `v.null()` for void returns
- Use `query`/`mutation`/`action` (public) vs `internalQuery`/`internalMutation`/`internalAction` (private)
- Never use `.filter()` in queries; use `.withIndex()` with proper schema indexes
- Index naming: `by_field1_and_field2` matching field order
- Actions needing Node.js: add `"use node";` at file top; actions cannot use `ctx.db`

## Cursor Rules
See `.cursor/rules/ts_rules.mdc` and `.cursor/rules/convex_rules.mdc` for detailed patterns.
