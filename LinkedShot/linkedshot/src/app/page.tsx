import Link from "next/link";
import { Star, Target, Zap, DollarSign, ChevronRight, Shield, Award, TrendingUp } from "lucide-react";
import UploadZone from "@/components/UploadZone";
import BeforeAfter from "@/components/BeforeAfter";
import Pricing from "@/components/Pricing";
import ConfigBanner from "@/components/ConfigBanner";
import HeroSection from "@/components/HeroSection";
import StickyCta from "@/components/StickyCta";
import LiveActivity from "@/components/LiveActivity";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import ReferralApply from "@/components/ReferralApply";
import TrustBadges from "@/components/TrustBadges";
import NavLinks from "@/components/NavLinks";
import DashboardLinkIfAuth from "@/components/DashboardLinkIfAuth";
import type { PricingPlan } from "@/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.linkedshot.com";

export const metadata = {
  title: "Amazon Product Photos in Seconds | White Background AI – LinkedShot",
  description:
    "Create Amazon-compliant product photos in seconds: white background (#FFFFFF), remove background, HD PNG. 3 free images, no credit card. Try 1 free without sign-up.",
  openGraph: {
    title: "Amazon Product Photos in Seconds | White Background AI – LinkedShot",
    description:
      "Create Amazon-compliant product photos in seconds. White background, remove background, HD PNG. 3 free images.",
    url: siteUrl,
  },
  alternates: { canonical: siteUrl },
};

const FAQ_ITEMS = [
  {
    q: "Does it keep natural shadows?",
    a: "Yes, our AI preserves natural shadows while removing the background, perfect for Amazon's 'shadow allowed' policy.",
  },
  {
    q: "How many images can I process?",
    a: "Each plan gives you credits: 3 free, 50 with Starter (9€ or $9), 200 with Pro (29€ or $29). One credit = one image.",
  },
  {
    q: "What format should I upload?",
    a: "JPG, PNG, or WebP. We recommend high-resolution photos (1000px+ width) for best results.",
  },
  {
    q: "Is it really Amazon compliant?",
    a: "We output pure white (#FFFFFF) HD PNG (1024×1024), which meets Amazon's minimum size (1000px).",
  },
  {
    q: "How do I get a white background for my Amazon product photos?",
    a: "Upload your product photo to LinkedShot. Our AI removes the background and outputs a pure white (#FFFFFF) or transparent PNG in about 3 seconds. No Photoshop or photographer needed.",
  },
  {
    q: "Do I need a subscription?",
    a: "No. LinkedShot is pay-once, keep forever. Buy 50 or 200 credits, use them at your own pace. No monthly fees.",
  },
  {
    q: "What if I'm not satisfied?",
    a: "You're covered by our 30-day money-back guarantee. If you're not happy with the results, we'll refund you — no questions asked.",
  },
] as const;

const plans: PricingPlan[] = [
  { id: "free", name: "Free", price: 0, credits: 3, features: ["3 free images", "HD PNG export", "No credit card"] },
  { id: "starter", name: "Starter", price: 9, credits: 50, features: ["50 images", "HD PNG (1024×1024)", "Email support"] },
  { id: "pro", name: "Pro", price: 29, credits: 200, features: ["200 images", "HD PNG (1024×1024)", "Priority support"] },
];

const TESTIMONIALS = [
  {
    quote: "Saved me $200 on my last product launch. What used to take 3 days on Fiverr now takes 3 seconds.",
    author: "Michael R.",
    role: "FBA Seller · 6-figures/year",
    stars: 5,
    highlight: "$200 saved",
  },
  {
    quote: "I process 50 images every month. At $0.18 per image vs $5 on Fiverr, this pays for itself with the first batch.",
    author: "Sarah K.",
    role: "Amazon seller since 2019",
    stars: 5,
    highlight: "27x cheaper",
  },
  {
    quote: "Finally a tool that understands Amazon's requirements. Pure white backgrounds every time — zero rejections.",
    author: "David Chen",
    role: "7-Figure Amazon Seller",
    stars: 5,
    highlight: "0 rejections",
  },
];

const FEATURES = [
  { icon: Target, title: "Amazon-compliant", desc: "Pure white #FFFFFF, HD PNG 1024×1024. Pass Amazon's image requirements every time.", badge: "Guaranteed" },
  { icon: Zap, title: "Results in ~3 seconds", desc: "One image in ~3 seconds. 50 or 200 images with Starter / Pro plans.", badge: "3s avg." },
  { icon: DollarSign, title: "27× cheaper than Fiverr", desc: "~€0.18 per image vs €2–5. Process your entire catalog for the price of a single Fiverr gig.", badge: "Save 90%" },
  { icon: Award, title: "No watermark ever", desc: "Your images are 100% yours. No hidden branding or watermarks on any plan.", badge: "Always" },
  { icon: TrendingUp, title: "Bulk processing", desc: "Upload up to 10 images at once and download everything as a ZIP file.", badge: "Up to 10" },
  { icon: Shield, title: "30-day money-back", desc: "If you're not delighted with the results, we'll refund you. No questions asked.", badge: "Risk-free" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <ConfigBanner />

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[var(--dark-bg)]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-white tracking-tight">
            LinkedShot
          </Link>
          <NavLinks />
        </div>
      </header>

      <ReferralApply />

      <main className="pt-0" id="main-content">
        {/* HERO — includes before/after slider + social proof */}
        <HeroSection />

        {/* SEO: keyword-rich intro — visually minimal */}
        <section className="border-b border-zinc-100 bg-white px-4 py-6" aria-label="About">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm text-zinc-500 leading-relaxed">
              <strong className="text-zinc-700">Amazon product photography</strong> made simple: upload any product photo, get a{" "}
              <strong className="text-zinc-700">white background</strong> or <strong className="text-zinc-700">transparent PNG</strong> that meets Amazon&apos;s image requirements. Our AI{" "}
              <strong className="text-zinc-700">removes the background</strong> in seconds — no photographer or Photoshop needed. Perfect for FBA sellers and Amazon listings.
            </p>
          </div>
        </section>

        {/* === UPLOAD ZONE === */}
        <section id="upload" className="bg-zinc-50/80 px-4 py-20" aria-labelledby="upload-heading">
          <div className="mx-auto max-w-3xl">
            <h2 id="upload-heading" className="mb-2 text-center text-3xl font-extrabold text-zinc-900">
              Try it now — free
            </h2>
            <p className="mb-8 text-center text-zinc-500">Upload your product photo. Get a white background or transparent PNG in ~3 seconds.</p>
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-xl shadow-zinc-200/50 sm:p-10">
              <UploadZone />
            </div>
            <p className="mt-4 text-center text-xs text-zinc-400">
              ✓ No credit card · ✓ 3 free images · ✓ Amazon-compliant output
            </p>
          </div>
        </section>

        {/* === BEFORE/AFTER GALLERY === */}
        <section id="examples" className="bg-white py-20">
          <BeforeAfter />
        </section>

        {/* === HOW IT WORKS === */}
        <section className="border-t border-zinc-100 bg-zinc-50/50 px-4 py-20" aria-labelledby="how-it-works-heading">
          <div className="mx-auto max-w-4xl">
            <h2 id="how-it-works-heading" className="text-center text-3xl font-extrabold text-zinc-900">
              3 steps to Amazon-ready photos
            </h2>
            <p className="mt-3 text-center text-zinc-500">No learning curve. No Photoshop. Just results.</p>
            <div className="mt-14 grid gap-8 sm:grid-cols-3">
              {[
                { step: 1, title: "Upload", desc: "Drop your product photo (JPG, PNG, WebP). Up to 10 at once.", icon: "📤", detail: "Any quality, any background" },
                { step: 2, title: "AI processes", desc: "Our AI removes the background and outputs white or transparent in ~3 seconds.", icon: "⚡", detail: "State-of-the-art result quality" },
                { step: 3, title: "Download & list", desc: "Get your Amazon-ready HD image (1024×1024, pure white #FFFFFF).", icon: "🚀", detail: "100% Amazon-compliant" },
              ].map(({ step, title, desc, icon, detail }) => (
                <div key={step} className="relative text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl shadow-sm">
                    {icon}
                  </div>
                  <div className="absolute -top-2 right-1/2 translate-x-12 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white shadow">
                    {step}
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">{title}</h3>
                  <p className="mt-2 text-zinc-600">{desc}</p>
                  <p className="mt-2 text-xs font-medium text-emerald-600">{detail}</p>
                  {step < 3 && (
                    <ChevronRight className="absolute -right-4 top-8 hidden text-zinc-300 sm:block" aria-hidden />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === FEATURES / WHY US === */}
        <section className="bg-white px-4 py-20" aria-labelledby="features-heading">
          <div className="mx-auto max-w-5xl">
            <h2 id="features-heading" className="text-center text-3xl font-extrabold text-zinc-900">
              Why 2,800+ sellers choose LinkedShot
            </h2>
            <p className="mt-3 text-center text-zinc-500 max-w-xl mx-auto">
              Every feature built for Amazon sellers who need speed, quality, and compliance.
            </p>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, desc, badge }) => (
                <div
                  key={title}
                  className="group relative rounded-2xl border border-zinc-100 bg-zinc-50/50 p-7 transition-all hover:border-emerald-200 hover:bg-emerald-50/30 hover:shadow-lg"
                >
                  <div className="absolute right-4 top-4 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600 border border-emerald-100">
                    {badge}
                  </div>
                  <Icon className="h-9 w-9 text-emerald-500" />
                  <h3 className="mt-4 text-lg font-bold text-zinc-900">{title}</h3>
                  <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === TESTIMONIALS === */}
        <section className="border-t border-zinc-100 bg-zinc-50/80 px-4 py-20" aria-labelledby="testimonials-heading">
          <div className="mx-auto max-w-5xl">
            <h2 id="testimonials-heading" className="text-center text-3xl font-extrabold text-zinc-900">
              Real sellers, real results
            </h2>
            <p className="mt-3 text-center text-zinc-500">Thousands of FBA sellers use LinkedShot every month.</p>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <blockquote key={i} className="relative flex flex-col rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm">
                  {/* Highlight badge */}
                  <div className="absolute -top-3 left-6 rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-bold text-white shadow">
                    {t.highlight}
                  </div>

                  {/* Stars */}
                  <div className="flex mb-4">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="flex-1 text-zinc-700 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>

                  <footer className="mt-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{t.author}</p>
                      <p className="text-xs text-zinc-500">{t.role}</p>
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>

            {/* Rating summary */}
            <div className="mt-10 flex flex-col items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" aria-hidden />
                ))}
                <span className="ml-2 text-lg font-bold text-zinc-900">4.9/5</span>
              </div>
              <p className="text-sm text-zinc-500">Based on 200+ seller reviews</p>
            </div>
          </div>
        </section>

        {/* HowTo schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              name: "How to get Amazon-compliant product photos with white background",
              description: "Use LinkedShot to turn any product photo into an Amazon-ready image with pure white background in seconds.",
              step: [
                { "@type": "HowToStep", name: "Upload", text: "Upload your product photo (JPG, PNG or WebP)." },
                { "@type": "HowToStep", name: "AI processing", text: "Our AI removes the background and outputs white (#FFFFFF) or transparent PNG in ~3 seconds." },
                { "@type": "HowToStep", name: "Download", text: "Download your HD PNG (1024×1024) ready for Amazon listings." },
              ],
            }),
          }}
        />

        {/* === BIG CTA BLOCK === */}
        <section className="bg-[var(--dark-bg)] px-4 py-24 text-white">
          <div className="mx-auto max-w-2xl text-center">
            {/* Glow effect */}
            <div className="pointer-events-none absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[100px]" style={{ background: "var(--accent)" }} aria-hidden />

            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
              <Zap className="h-3.5 w-3.5" />
              No credit card required
            </p>
            <h2 className="text-4xl font-extrabold sm:text-5xl">
              Start getting{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                results today
              </span>
            </h2>
            <p className="mt-5 text-lg text-zinc-400">
              Upload your first product photo. See a professional white background in 3 seconds.{" "}
              <strong className="text-white">Free, no credit card.</strong>
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/#upload"
                className="btn-glow btn-shimmer relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-emerald-500 px-10 py-4 text-lg font-bold text-white transition hover:bg-emerald-400"
              >
                <Zap className="h-5 w-5" />
                Get 3 free images
              </Link>
              <Link
                href="/#pricing"
                className="rounded-2xl border-2 border-zinc-600 px-10 py-4 text-lg font-semibold transition hover:border-zinc-500 hover:bg-white/5"
              >
                See pricing
              </Link>
            </div>
            <p className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-zinc-500">
              <span>✓ No commitment</span>
              <span>✓ 30-day money-back</span>
              <span>✓ HD download</span>
              <span>✓ Amazon-compliant</span>
            </p>
            <div className="mt-6 text-center">
              <TrustBadges variant="dark" compact />
            </div>
          </div>
        </section>

        {/* === PRICING === */}
        <section id="pricing" className="bg-zinc-50/80 px-4 py-24" aria-labelledby="pricing-heading">
          <div className="mx-auto max-w-5xl">
            <h2 id="pricing-heading" className="text-center text-3xl font-extrabold text-zinc-900">
              Simple, one-time pricing
            </h2>
            <p className="mt-3 text-center text-zinc-500 max-w-lg mx-auto">
              No subscription. No hidden fees. Buy credits once, use them whenever you need.
            </p>

            {/* Comparison pill */}
            <div className="mt-6 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm">
                <span className="text-zinc-600">vs Fiverr</span>
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-600">€2–5/image</span>
                <span className="mx-1 text-zinc-300">→</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600">€0.18/image here</span>
              </div>
            </div>

            <div className="mt-10">
              <Pricing plans={plans} />
            </div>
            <div className="mt-10 flex flex-col items-center gap-2">
              <LiveActivity />
              <p className="text-center text-sm text-zinc-500">
                127 sellers joined in the last 24 hours
              </p>
            </div>
          </div>
        </section>

        {/* === FAQ === */}
        <section className="bg-white px-4 py-20" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-3xl">
            <h2 id="faq-heading" className="text-center text-3xl font-extrabold text-zinc-900">
              Frequently asked questions
            </h2>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: FAQ_ITEMS.map((item) => ({
                    "@type": "Question",
                    name: item.q,
                    acceptedAnswer: { "@type": "Answer", text: item.a },
                  })),
                }),
              }}
            />
            <div className="mt-10 space-y-4">
              {FAQ_ITEMS.map((item, i) => (
                <article key={i} className="rounded-2xl border border-zinc-100 bg-zinc-50/60 p-6 transition hover:border-zinc-200 hover:bg-zinc-50">
                  <h3 className="font-bold text-zinc-900">{item.q}</h3>
                  <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{item.a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <ExitIntentPopup />
        <StickyCta />

        <footer className="border-t border-zinc-800 bg-[var(--dark-bg)] py-16 text-white" role="contentinfo">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="text-lg font-bold">LinkedShot</h4>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                Pro product photos in seconds. White background, transparent PNG — Amazon-compliant every time.
              </p>
              <div className="mt-4 flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                <span className="ml-1 text-xs text-zinc-500">4.9/5 · 200+ reviews</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold">Product</h4>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><Link href="/#pricing" className="hover:text-white transition">Pricing</Link></li>
                <DashboardLinkIfAuth />
                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold">Legal</h4>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold">Contact</h4>
              <p className="mt-3 text-sm text-zinc-400">
                <Link href="/contact" className="hover:text-white transition">Contact Us</Link>
              </p>
              <p className="mt-2 text-xs text-zinc-600">WEMADE · 41 rue Fongate, 13006 Marseille, France</p>
            </div>
          </div>
          <div className="mt-12 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-600">
            © {new Date().getFullYear()} LinkedShot · All rights reserved
          </div>
        </footer>
      </main>
    </div>
  );
}
