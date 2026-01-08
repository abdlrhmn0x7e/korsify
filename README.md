# Korsify

A Shopify-like platform for secure course selling. Korsify enables teachers to create their own branded storefronts with custom subdomains, sell courses with video lessons, and manage students with secure, watermarked video delivery.

## Development

### Getting Started

1. **Install dependencies**

```bash
bun install
```

2. **Set up Convex**

```bash
# Login to Convex (first time only)
bunx convex login

# Initialize Convex dev server (creates .env.local with CONVEX_URL)
bunx convex dev
```

3. **Run the Next.js dev server** (in a separate terminal)

```bash
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## MVP Todo

### Phase 1: Teacher Foundation (Week 1-2)

#### Database & Backend

- [x] Create teachers table (userId, name, phone, email, subdomain, customDomain, branding, paymentInfo, status, createdAt)
- [x] Add indexes: by_userId, by_subdomain, by_customDomain
- [x] Create teachers DAL (queries + mutations)
- [x] Implement subdomain validation (uniqueness, reserved words, format rules)
- [x] Create teacher profile queries (getByUserId, getBySubdomain)
- [x] Create teacher mutations (create, update, updateBranding, updatePaymentInfo)

#### Subdomain Routing

- [x] Create Next.js middleware for subdomain detection
- [x] Set up route rewriting (subdomain → /storefront/subdomain/...)
- [x] Configure next.config.ts for wildcard subdomains in production
- [x] Handle localhost development (use query param or hosts file)

#### Teacher Onboarding Flow

- [x] Create onboarding page with multi-step wizard
- [x] Step 1: Profile form (name, phone, email)
- [x] Step 2: Subdomain picker with real-time availability check
- [x] Step 3: Branding upload (logo, cover image, primary color)
- [x] Step 4: Payment info form (Vodafone Cash, InstaPay, instructions)
- [x] Create onboarding completion mutation (creates teacher record)
- [x] Add redirect logic: after login → check if teacher exists → onboarding or dashboard

#### Teacher Dashboard Shell

- [x] Create teacher dashboard layout with sidebar
- [x] Add sidebar navigation (Home, Courses, Students, Payments, Storefront, Settings)
- [x] Build dashboard home page (placeholder for now)
- [ ] Create settings page with branding form
- [ ] Create settings page with payment info form

---

### Phase 2: Course Management (Week 2-3)

#### Database & Backend

- [x] Create courses table (teacherId, title, slug, description, thumbnailStorageId, pricing, seo, status, timestamps)
- [x] Add indexes: by_slug, by_teacherId_status
- [x] Create courses DAL (queries + mutations)
- [x] Create sections table (courseId, teacherId, title, order, status, timestamps)
- [x] Add indexes: by_courseId_order
- [x] Create sections DAL (queries + mutations)
- [x] Create section mutations (create, update, delete, reorder, publish, draft)
- [x] Create lessons table (courseId, sectionId, teacherId, title, description, pdfStorageId, order, isFree, timestamps)
- [x] Add indexes: by_sectionId_order, by_courseId
- [x] Create lessons DAL (queries + mutations)
- [x] Create course mutations (create, update, delete, publish, draft)
- [x] Create lesson mutations (create, update, delete, reorder)

#### Mux Video Integration

- [x] Set up Mux account and get API credentials
- [x] Create Mux API client (server-side action)
- [x] Add video field to lessons table (muxAssetId, muxPlaybackId, status, duration)
- [x] Implement direct upload URL generation (Mux direct uploads)
- [x] Create Convex action for getting upload credentials
- [x] Set up Mux webhook endpoint in convex/http.ts
- [x] Handle webhook: video.asset.ready → update lesson with playback ID
- [x] Handle webhook: video.asset.errored → update lesson status with error
- [x] Handle webhook: video.upload.asset_created → link upload to asset

#### Course Management UI

- [x] Build course list page with table view
- [x] Add create course button
- [x] Build course form (title, slug, description, price, thumbnail upload)
- [x] Build course edit page
- [x] Add course status badge (draft/published)
- [x] Add publish/unpublish toggle UI
- [x] Add delete course with confirmation dialog

#### Lesson Management UI

- [x] Build lesson list for a course (organized by sections)
- [x] Add create lesson button
- [x] Build lesson form (title, description, isFree toggle)
- [x] Build video uploader component with Mux direct upload
- [x] Show upload progress bar
- [x] Show video processing status (waiting/preparing/ready/errored)
- [x] Add PDF upload for lesson attachments
- [x] Add lesson reordering (drag-drop)
- [x] Add delete lesson with confirmation
- [x] Build lesson preview/edit page

---

### Phase 3: Student & Enrollment (Week 3-4)

#### Student Auth Component (Convex Component)

The student authentication is handled by a dedicated Convex component (`studentAuth`) using Better Auth, completely isolated from the teacher auth. This enables:

- **Per-teacher phone uniqueness** - Same phone can exist under different teachers (via generated emails: `{phone}@{subdomain}.korsify.com`)
- **White-label experience** - Students never see Korsify branding
- **Proper session management** - DB-backed sessions via Better Auth with httpOnly cookies
- **Subdomain-based access control** - Hooks validate that students can only sign in/up on their teacher's subdomain

Component Structure

- [x] Create `convex/components/studentAuth/` directory
- [x] Create `convex.config.ts` defining the studentAuth component
- [x] Register component in `convex/convex.config.ts` with `app.use(studentAuth)`

Schema (Isolated Tables via Better Auth)

- [x] Use Better Auth's generated schema (user, session, account, verification, jwks tables)
- [x] Add custom user fields: `teacherId`, `phoneNumber`
- [x] Add indexes: `by_teacherId`, `by_teacherId_email`, `by_teacherId_phoneNumber`

Auth Configuration

- [x] Create `convex/studentAuth.ts` with Better Auth configuration
- [x] Configure email/password authentication
- [x] Add subdomain validation hooks for sign-in (validates email subdomain matches request origin)
- [x] Add database hooks for sign-up (enforces teacherId, validates subdomain, checks uniqueness per teacher)
- [x] Configure cookie prefix (`student-auth`) to avoid conflicts with teacher auth

Auth Queries

- [x] Create `getCurrentStudent` query (uses Better Auth's `safeGetAuthUser`)

Client Wrapper

- [x] Create `lib/student-auth-client.ts` with Better Auth React client
- [x] Create `generateEmail()` helper function (`{phone}@{subdomain}.korsify.com`)
- [x] Configure with `convexClient()` plugin for Convex integration

Server Helpers

- [x] Create `lib/student-auth-server.ts` with Next.js server utilities
- [x] Implement `studentAuthHandler` for API routes
- [x] Implement `getCurrentStudent()` server function
- [x] Implement `getTeacherFromHeaders()` helper for storefront context
- [x] Add `fetchStudentAuthQuery`, `fetchStudentAuthMutation`, `fetchStudentAuthAction` helpers

API Routes

- [x] Create `/api/student-auth/[...all]/route.ts` for Better Auth endpoints

Storefront Integration

- [x] Create `StudentAuthProvider` component wrapping `ConvexBetterAuthProvider`
- [x] Integrate provider in storefront layout
- [x] Build login form component using `studentAuthClient.signIn.email`
- [x] Build signup form component using `studentAuthClient.signUp.email`
- [x] Add auth state checks in storefront pages (redirect if authenticated/unauthenticated)
- [x] Build profile dropdown with sign-out functionality

#### Enrollment & Payments Database

- [ ] Create enrollments table (studentId, courseId, teacherId, status, grantedBy, timestamps)
- [ ] Add indexes: by_studentId, by_courseId, by_studentId_courseId, by_teacherId_status
- [ ] Create enrollments DAL (queries + mutations)
- [ ] Create payments table (studentId, courseId, teacherId, amount, receiptUrl, status, rejectionReason, timestamps)
- [ ] Add indexes: by_teacherId, by_teacherId_status, by_studentId
- [ ] Create payments DAL (queries + mutations)

#### Student Storefront Pages

- [x] Create storefront layout (loads teacher branding, no Korsify branding)
- [x] Build student signup page (phone + password + name, email generated from phone)
- [x] Build student login page (phone + password)
- [x] Create StudentAuthProvider (wraps ConvexBetterAuthProvider)
- [ ] Build course catalog page (shows published courses)
- [ ] Build course detail page (title, description, price, lesson count)
- [ ] Show payment instructions (teacher's Vodafone/InstaPay info)
- [ ] Build receipt upload form
- [ ] Create payment submission mutation
- [ ] Show "pending approval" state after submission
- [ ] Build student dashboard (my enrolled courses)
- [ ] Show enrollment status per course (pending/active)

#### Teacher Student Management

- [ ] Build student list page (name, phone, enrolled courses, status)
- [ ] Add search/filter students
- [ ] Build student detail page
- [ ] Add block student mutation (updates status, invalidates all sessions)
- [ ] Add unblock student mutation
- [ ] Add manual enrollment action (grant access without payment)
- [ ] Add revoke enrollment action
- [ ] Build block/unblock UI with reason input

#### Teacher Payment Management

- [ ] Build payment queue page (pending payments)
- [ ] Show payment details (student, course, amount, receipt image)
- [ ] Add receipt image viewer/zoom
- [ ] Add approve payment action
- [ ] Add reject payment action with reason input
- [ ] Create approval mutation (updates payment + grants enrollment)
- [ ] Create rejection mutation (updates payment status)
- [ ] Add payment history tab (approved/rejected)

---

### Phase 4: Secure Video Player (Week 4-5)

#### Mux Security Configuration

- [x] Enable signed URLs in Mux dashboard
- [x] Configure playback restrictions (domain restriction)
- [x] Set up signing keys for secure playback
- [x] Configure Mux Data for analytics (optional)

#### Playback Backend

The playback backend uses the `studentAuth` component to validate sessions and retrieve student data for watermarking.

- [x] Create `getPlaybackUrl` query that:
  - Validates student session token (via studentAuth component)
  - Retrieves student record (name + phone for watermark)
  - Checks enrollment status for the requested lesson's course
  - Returns error if not enrolled (unless lesson is free preview)
- [x] Generate signed Mux playback URL with expiration (1 hour)
- [x] Include watermark data in response (student name + phone from studentAuth)

#### Video Player Component

- [x] Build secure player wrapper component using Mux Player React
- [x] Configure Mux Player with signed playback token
- [x] Add moving watermark overlay (student name + phone + timestamp)
- [ ] Watermark repositions every 30 seconds
- [x] Disable right-click on player container
- [ ] Block keyboard shortcuts (Ctrl+S, Ctrl+U, F12, Ctrl+Shift+I)
- [ ] Add basic DevTools detection (optional warning)

#### Lesson Player Page

- [ ] Build lesson player page layout
- [ ] Show course curriculum sidebar (lesson list)
- [ ] Highlight current lesson
- [ ] Mark free lessons with badge
- [ ] Show locked state for non-enrolled lessons
- [ ] Add next/previous lesson navigation
- [ ] Show PDF download button if lesson has attachment
- [ ] Verify enrollment on page load (redirect if not enrolled, uses studentAuth session)

---

### Phase 5: Teacher Storefront Builder (Week 5-6)

#### Database & Backend

- [ ] Create storefrontPages table (teacherId, sections array, metaTitle, metaDescription, updatedAt)
- [ ] Add index: by_teacherId
- [ ] Create storefrontPages DAL
- [ ] Create getPage query (by subdomain)
- [ ] Create updatePage mutation (saves sections)
- [ ] Create default template for new teachers

#### Section Types

- [ ] Define section type schemas (hero, features, courses, testimonials, about, cta, faq)
- [ ] Create section content templates (default values for each type)
- [ ] Define section settings schema (backgroundColor, textColor, padding, hidden)

#### Page Builder UI

- [ ] Build page builder page layout (sidebar + preview area)
- [ ] Create section list with drag handles
- [ ] Implement drag-drop reordering (@dnd-kit or similar)
- [ ] Build "Add Section" button and picker modal
- [ ] Show available section types with previews
- [ ] Build section editor panel (appears when section selected)
- [ ] Create editor for hero section (headline, subheadline, CTA, background image)
- [ ] Create editor for features section (title, feature items with icons)
- [ ] Create editor for courses section (title, layout, limit)
- [ ] Create editor for testimonials section (title, testimonial items)
- [ ] Create editor for about section (title, bio, image)
- [ ] Create editor for CTA section (headline, button text, link)
- [ ] Create editor for FAQ section (title, Q&A items)
- [ ] Add section settings panel (colors, padding)
- [ ] Add delete section button with confirmation
- [ ] Add hide/show section toggle
- [ ] Implement save button (calls updatePage mutation)
- [ ] Show unsaved changes indicator
- [ ] Add live preview toggle

#### Storefront Rendering

- [ ] Create TeacherThemeProvider (applies branding colors)
- [ ] Build DynamicRenderer component (loops through sections)
- [ ] Create HeroSection render component
- [ ] Create FeaturesSection render component
- [ ] Create CoursesSection render component (fetches published courses)
- [ ] Create TestimonialsSection render component
- [ ] Create AboutSection render component
- [ ] Create CTASection render component
- [ ] Create FAQSection render component
- [ ] Apply section settings (colors, padding) to rendered sections
- [ ] Handle empty state (no sections yet)

---

### Phase 6: Analytics & Polish (Week 6-7)

#### Analytics Backend

- [ ] Create getTeacherDashboard query
- [ ] Calculate pending payments count
- [ ] Calculate total students count (from studentAuth component)
- [ ] Calculate active students count (with enrollments)
- [ ] Calculate total revenue (approved payments sum)
- [ ] Get recent payments list (last 10-20)
- [ ] Get course stats (enrollments per course)
- [ ] Optimize queries with proper index usage

#### Dashboard UI

- [ ] Build stats cards row (pending payments, total students, active students, revenue)
- [ ] Add pending payments badge/alert if > 0
- [ ] Build recent payments table
- [ ] Add quick actions (view payment, go to payments page)
- [ ] Build course performance summary (enrollments per course)
- [ ] Add empty states for new teachers

#### Polish & UX

- [ ] Add loading skeletons for all data-fetching pages
- [ ] Add error boundaries with retry buttons
- [ ] Add toast notifications for all mutations (success/error)
- [ ] Review and fix mobile responsiveness (all pages)
- [ ] Add confirmation dialogs for destructive actions
- [ ] Add form validation error messages (Arabic + English)
- [ ] Add empty states for lists (no courses, no students, etc.)

#### Localization

- [ ] Add Arabic translations for all new pages
- [ ] Add Arabic translations for all form labels and buttons
- [ ] Add Arabic translations for error messages
- [ ] Add Arabic translations for success messages
- [ ] Review RTL layout for all new components

#### Testing & Performance

- [ ] Test complete teacher onboarding flow
- [ ] Test complete student signup → enroll → watch flow (using studentAuth)
- [ ] Test payment submission → approval → access granted flow
- [ ] Test video upload → processing → playback flow
- [ ] Test page builder save → render on storefront flow
- [ ] Run Lighthouse audit on key pages
- [ ] Fix any accessibility issues
- [ ] Test on mobile devices (iOS Safari, Android Chrome)

---

### Infrastructure & DevOps (Throughout)

- [x] Add MUX_TOKEN_ID to environment variables
- [x] Add MUX_TOKEN_SECRET to environment variables
- [x] Add MUX_SIGNING_KEY_ID to environment variables (for signed URLs)
- [x] Add MUX_SIGNING_KEY_PRIVATE to environment variables (for signed URLs)
- [ ] Configure Vercel for wildcard subdomain (\*.korsify.com)
- [x] Set up Mux webhook URL in Mux dashboard
- [ ] Test subdomain routing in production
- [ ] Set up error monitoring (Sentry or similar)
- [x] Document environment variables in README
