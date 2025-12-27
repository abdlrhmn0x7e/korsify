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

- [ ] Create teachers table (userId, name, phone, email, subdomain, customDomain, branding, paymentInfo, status, createdAt)
- [ ] Add indexes: by_userId, by_subdomain, by_customDomain
- [ ] Create teachers DAL (queries + mutations)
- [ ] Implement subdomain validation (uniqueness, reserved words, format rules)
- [ ] Create teacher profile queries (getByUserId, getBySubdomain)
- [ ] Create teacher mutations (create, update, updateBranding, updatePaymentInfo)

#### Subdomain Routing

- [ ] Create Next.js middleware for subdomain detection
- [ ] Set up route rewriting (subdomain → /storefront/subdomain/...)
- [ ] Configure next.config.ts for wildcard subdomains in production
- [ ] Handle localhost development (use query param or hosts file)

#### Teacher Onboarding Flow

- [ ] Create onboarding page with multi-step wizard
- [ ] Step 1: Profile form (name, phone, email)
- [ ] Step 2: Subdomain picker with real-time availability check
- [ ] Step 3: Branding upload (logo, cover image, primary color)
- [ ] Step 4: Payment info form (Vodafone Cash, InstaPay, instructions)
- [ ] Create onboarding completion mutation (creates teacher record)
- [ ] Add redirect logic: after login → check if teacher exists → onboarding or dashboard

#### Teacher Dashboard Shell

- [ ] Create teacher dashboard layout with sidebar
- [ ] Add sidebar navigation (Home, Courses, Students, Payments, Storefront, Settings)
- [ ] Create TeacherContext provider (loads teacher data, provides to children)
- [ ] Build dashboard home page (placeholder for now)
- [ ] Create settings page with branding form
- [ ] Create settings page with payment info form
- [ ] Add image upload component using Convex file storage

---

### Phase 2: Course Management (Week 2-3)

#### Database & Backend

- [ ] Create courses table (teacherId, title, description, price, thumbnailUrl, status, order, timestamps)
- [ ] Add indexes: by_teacherId, by_teacherId_status
- [ ] Create courses DAL
- [ ] Create lessons table (courseId, teacherId, title, description, video object, pdfUrl, order, isFree, createdAt)
- [ ] Add indexes: by_courseId, by_teacherId
- [ ] Create lessons DAL
- [ ] Create course mutations (create, update, delete, reorder, publish, unpublish, archive)
- [ ] Create lesson mutations (create, update, delete, reorder)

#### Bunny.net Integration

- [ ] Set up Bunny.net account and Stream library
- [ ] Create Bunny API client (server-side)
- [ ] Implement video creation endpoint (calls Bunny API)
- [ ] Implement signed upload URL generation (TUS protocol)
- [ ] Create Convex action for getting upload credentials
- [ ] Set up Bunny webhook endpoint in convex/http.ts
- [ ] Handle webhook: video processing complete → update lesson status
- [ ] Handle webhook: video failed → update lesson status with error

#### Course Management UI

- [ ] Build course list page with grid/table view
- [ ] Add create course button and modal/page
- [ ] Build course form (title, description, price, thumbnail upload)
- [ ] Build course edit page
- [ ] Add course status badge (draft/published/archived)
- [ ] Add publish/unpublish toggle
- [ ] Add delete course with confirmation
- [ ] Add course reordering (drag-drop or arrows)

#### Lesson Management UI

- [ ] Build lesson list for a course (ordered list)
- [ ] Add create lesson button
- [ ] Build lesson form (title, description, isFree toggle)
- [ ] Build video uploader component with TUS client
- [ ] Show upload progress bar
- [ ] Show video processing status (processing/ready/failed)
- [ ] Add PDF upload for lesson attachments
- [ ] Add lesson reordering (drag-drop)
- [ ] Add delete lesson with confirmation
- [ ] Build lesson preview/edit page

---

### Phase 3: Student & Enrollment (Week 3-4)

#### Student Auth Component (Convex Component)

The student authentication is handled by a dedicated Convex component (`studentAuth`) that is completely isolated from the teacher auth (Better Auth). This enables:

- **Per-teacher phone uniqueness** - Same phone can exist under different teachers
- **White-label experience** - Students never see Korsify branding
- **Proper session management** - DB-backed sessions with revocation support
- **Phone verification via WhatsApp OTP** - Using Twilio WhatsApp API

Component Structure

- [ ] Create `convex/components/studentAuth/` directory
- [ ] Create `convex.config.ts` defining the studentAuth component
- [ ] Register component in `convex/convex.config.ts` with `app.use(studentAuth)`

Schema (Isolated Tables)

- [ ] Create `student` table (teacherId, phone, phoneVerified, passwordHash, name, status, blockReason, createdAt, updatedAt)
- [ ] Add indexes: by_teacherId, by_teacherId_phone (unique per teacher), by_teacherId_status
- [ ] Create `studentSession` table (studentId, token, expiresAt, ipAddress, userAgent, createdAt)
- [ ] Add indexes: by_token, by_studentId, by_expiresAt
- [ ] Create `studentVerification` table (phone, teacherId, code, expiresAt, attempts, createdAt)
- [ ] Add indexes: by_phone_teacherId, by_expiresAt

Auth Mutations

- [ ] Create `sendOtp` mutation (generates 6-digit code, stores in verification table, calls Twilio WhatsApp action)
- [ ] Create `verifyOtp` mutation (validates code, marks phone as verified, handles brute force protection)
- [ ] Create `signUp` mutation (validates phone verified, hashes password with argon2, creates student)
- [ ] Create `signIn` mutation (verifies credentials, checks blocked status, creates session, returns token)
- [ ] Create `signOut` mutation (invalidates session by token)
- [ ] Create `refreshSession` mutation (extends session expiry if valid)

Auth Queries

- [ ] Create `getSession` query (validates token, returns student + session if valid)
- [ ] Create `getStudent` query (returns student by ID)
- [ ] Create `getCurrentStudent` query (uses session token from context)

Twilio WhatsApp Integration

- [ ] Create Convex action `sendWhatsAppOtp` (calls Twilio API to send OTP via WhatsApp)
- [ ] Add TWILIO_ACCOUNT_SID to environment variables
- [ ] Add TWILIO_AUTH_TOKEN to environment variables
- [ ] Add TWILIO_WHATSAPP_FROM to environment variables (e.g., "whatsapp:+14155238886")
- [ ] Create OTP message template (Arabic + English)

Client Wrapper

- [ ] Create `StudentAuthClient` class wrapping component API
- [ ] Implement `signUp()`, `signIn()`, `signOut()`, `sendOtp()`, `verifyOtp()` methods
- [ ] Handle session token storage (httpOnly cookie via API route)
- [ ] Create `useStudentSession()` React hook
- [ ] Create `StudentAuthProvider` context provider

Session Middleware

- [ ] Create `getStudentSession()` helper for server components
- [ ] Create middleware pattern for storefront protected routes
- [ ] Handle session cookie parsing and validation
- [ ] Implement automatic session refresh on valid requests

#### Enrollment & Payments Database

- [ ] Create enrollments table (studentId, courseId, teacherId, status, grantedBy, timestamps)
- [ ] Add indexes: by_studentId, by_courseId, by_studentId_courseId, by_teacherId_status
- [ ] Create enrollments DAL (queries + mutations)
- [ ] Create payments table (studentId, courseId, teacherId, amount, receiptUrl, status, rejectionReason, timestamps)
- [ ] Add indexes: by_teacherId, by_teacherId_status, by_studentId
- [ ] Create payments DAL (queries + mutations)

#### Student Storefront Pages

- [ ] Create storefront layout (loads teacher branding, no Korsify branding)
- [ ] Build student signup page (phone input → OTP verification → password + name)
- [ ] Build student login page (phone + password)
- [ ] Create StudentContext provider (wraps useStudentSession)
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

#### Bunny.net Security Configuration

- [ ] Enable token authentication in Bunny library settings
- [ ] Set up allowed referers (your domain only)
- [ ] Configure URL token authentication key
- [ ] Enable watermarking in Bunny player settings

#### Playback Backend

The playback backend uses the `studentAuth` component to validate sessions and retrieve student data for watermarking.

- [ ] Create `getPlaybackUrl` query that:
  - Validates student session token (via studentAuth component)
  - Retrieves student record (name + phone for watermark)
  - Checks enrollment status for the requested lesson's course
  - Returns error if not enrolled (unless lesson is free preview)
- [ ] Generate signed Bunny URL with expiration (1 hour)
- [ ] Include watermark data in response (student name + phone from studentAuth)

#### Video Player Component

- [ ] Build secure player wrapper component
- [ ] Embed Bunny iframe with signed URL
- [ ] Add moving watermark overlay (student name + phone + timestamp)
- [ ] Watermark repositions every 30 seconds
- [ ] Disable right-click on player container
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

- [ ] Add BUNNY_API_KEY to environment variables
- [ ] Add BUNNY_LIBRARY_ID to environment variables
- [ ] Add BUNNY_TOKEN_AUTH_KEY to environment variables
- [ ] Add TWILIO_ACCOUNT_SID to environment variables
- [ ] Add TWILIO_AUTH_TOKEN to environment variables
- [ ] Add TWILIO_WHATSAPP_FROM to environment variables
- [ ] Configure Vercel for wildcard subdomain (\*.korsify.com)
- [ ] Set up Bunny webhook URL in Bunny dashboard
- [ ] Test subdomain routing in production
- [ ] Set up error monitoring (Sentry or similar)
- [ ] Document environment variables in README
