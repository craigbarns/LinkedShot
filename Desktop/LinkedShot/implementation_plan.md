# Implementation Plan - AI Pet Portraits for BARK STUDIO

## Architected for Scale & Safety (User Feedback Integrated)
- **Flow**: Payment -> Upload -> Processing -> Delivery
- **Stack**: Next.js, Supabase (DB + Storage), Stripe, Astria

## Phase 1: Foundation & Data Layer (Day 1 - REVISED)
- [x] **Setup**: Next.js + Premium Glassmorphism UI
- [ ] **Database Schema**: define `jobs` table in Supabase (SQL)
- [ ] **Storage Setup**: Configure Supabase Storage bucket `training-images`
- [ ] **Supabase Client**: Initialize `lib/supabase.ts`
- [ ] **Job Manager**: Create `createJob()` and `updateJobStatus()` utilities.

## Phase 2: Payment & Workflow (Day 2)
- [ ] **Stripe Checkout**:
  - [ ] Create Checkout Session
  - [ ] Webhook: `checkout.session.completed` -> Create Job (Status: 'PAID')
  - [ ] Redirection to `/upload/[jobId]`
- [ ] **Secure Upload**:
  - [ ] Upload Page verifies Job ID & Status ('PAID')
  - [ ] Direct Upload to Supabase Storage
  - [ ] Trigger: When 10 images uploaded -> Update Job Status ('UPLOADED') -> Trigger Astria

## Phase 3: AI Pipeline (Day 3)
- [ ] **Astria Integration**:
- [x] **Day 1**: Project Setup & Landing Page (UI)
- [x] **Day 2**: Database, Storage & Payments (Supabase + Stripe)
- [x] **Day 3**: AI Model Training (Fal.ai Integration)
- [ ] **Day 4**: Status Page & Image Generation
- [ ] **Day 5**: Delivery & Email
- [ ] **Day 6**: Polish & SEO
- [ ] **Day 7**: Launch Prep
- [ ] **Day 8**: Bulletproof Redo & Delivery Implementation

### 6.1 Database Schema Updates
- [ ] Execute `supabase/migrations/001_redo_and_bulletproof.sql`.
- [ ] Add `job_models` table for versioning models.
- [ ] Add `generations` table for robust delivery.
- [ ] Update `jobs` table with `redo_available`, `credits`, `plan`, `high_fidelity`.

### 6.2 API Endpoints
- [ ] `POST /api/jobs/[jobId]/redo`: Archives current model, resets status to `PAID`, bumps version.
- [ ] Update `/api/jobs/train`: Handle `version` parameter for storage paths.
- [ ] Update `/api/jobs/generate`: Write to `generations` table instead of array.
- [ ] Update `/api/webhooks/fal`: Update `generations` status and `job_models` status.

### 6.3 Dashboard Updates
- [ ] Show "Free Redo" button if `redo_available` is true.
- [ ] Show granular status (Analyzing -> Training -> Generating -> Finishing).
- [ ] Fetch images from `generations` table vs simple array.
