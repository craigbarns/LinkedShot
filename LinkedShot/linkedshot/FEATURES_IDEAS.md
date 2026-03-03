# Features to make LinkedShot crush it

Prioritized ideas to boost conversion, retention, and revenue.

---

## 🔥 High impact, do first

### 1. **"Process another" right after result**
- After showing the result, add a button **"Process another image"** next to "Download HD".
- Resets the view so the dropzone is visible again without scrolling.
- **Done** ✓ (implemented in UploadZone).

### 2. **One free image without account (anonymous trial)**
- Allow 1 processing per IP per 24h without sign-up.
- Show result with watermark or low-res, then: **"Sign up to download HD and get 2 more free."**
- Huge conversion lever: try before commit.
- Needs: API route that accepts unauthenticated request with IP rate limit, then store result in session/temp storage; after signup, attach to user and grant 3 credits.

### 3. **Referral: Give credits, get credits**
- "Give 5 credits to a friend, get 5 when they sign up."
- Share link: `?ref=USER_ID`. On first signup via link, add 5 credits to both.
- Needs: referral table or field on user, track signup source, webhook or post-signup job to add credits.

### 4. **Bulk upload (queue)**
- Let user select 5–20 images; process one by one (or 2–3 in parallel if FAL allows), show progress "3/10 done".
- Same credits (1 per image), but much better UX for sellers with many products.
- Needs: queue state in UI, loop over files with existing /api/process.

---

## 📈 Conversion & trust

### 5. **Exit-intent popup with real discount**
- On mouse leave (top of viewport), show: "Wait — 10% off your first paid plan."
- Create a Stripe coupon (e.g. `WELCOME10`) and pass it in checkout session.
- Only show once per session / per device.

### 6. **Live or “recent activity” ticker**
- "John from UK just processed 3 images" or "127 images processed in the last hour."
- Can be from real `jobs` table (count last 24h) or a believable animated counter.
- Builds FOMO and trust.

### 7. **Video testimonial or 30s demo**
- One short Loom or YouTube: upload → result → download.
- Embed above the fold or in the "How it works" section.
- Strong for cold traffic.

### 8. **Trust badges near CTA**
- Stripe, "Amazon compliant", "30-day guarantee" with small icons right next to "Get 3 free images" and pricing buttons.
- You have some in footer; duplicating near CTAs can lift conversion.

---

## 🚀 Product expansion (from FAL)

### 9. **Headshot mode (LinkedIn)**
- FAL `fal-ai/image-apps-v2/headshot-photo`: one photo in → pro headshot.
- New tab or page "LinkedIn headshots"; same credit system.
- Targets different audience (job seekers, freelancers).

### 10. **Lifestyle product shot**
- FAL `fal-ai/bria/product-shot`: product on marble, in room, etc.
- Input: image + text prompt or ref image. One more mode in the upload flow.
- Great for A+ content and social.

### 11. **Upscale**
- FAL ESRGAN or creative-upscaler: improve resolution of product or headshot.
- "Enhance resolution" option after download or as separate mode.
- Adds perceived value without changing core flow much.

---

## 📧 Retention & lifecycle

### 12. **Post-signup email**
- Welcome: "Your 3 free credits are ready" + link to upload.
- After 1st image: "Tips for best results" or "Upgrade to 50 images for €9."
- After free credits used: "You've used your 3 free — upgrade to keep going."
- Needs: Resend (or similar) + simple triggers (e.g. Supabase trigger or Vercel serverless).

### 13. **Dashboard: download all as ZIP**
- In dashboard, "Download all my images (ZIP)" for users with many jobs.
- One-click backup; increases perceived value of the product.

### 14. **"Copy link" to share result**
- After processing, button "Copy link" to the result image (public URL).
- Useful for sharing with VA or client without sending the file.

---

## 🔧 Quick wins (no backend)

- **Process another** ✓ (done).
- **Keyboard / drag anywhere**: allow drag-and-drop on the whole page when upload section is in view.
- **Better error message** when FAL is slow: "This one is taking longer — we'll keep trying" + optional "Cancel".
- **Pricing tooltip**: "€0.18 per image" under Starter, "~€0.15 per image" under Pro.

---

## Suggested order

1. ✅ Process another (done).
2. Referral (give 5, get 5) — high viral potential.
3. One free image without account — biggest conversion lever.
4. Exit-intent with real 10% off.
5. Bulk upload (queue).
6. Headshot or Lifestyle mode (product expansion).

Pick 2–3 for the next sprint and ship; measure signup rate and credits used per user.
