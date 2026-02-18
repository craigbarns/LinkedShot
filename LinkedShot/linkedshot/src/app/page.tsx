import Link from "next/link";
import UploadZone from "@/components/UploadZone";
import BeforeAfter from "@/components/BeforeAfter";
import Pricing from "@/components/Pricing";
import ConfigBanner from "@/components/ConfigBanner";
import HeroSection from "@/components/HeroSection";
import StickyCta from "@/components/StickyCta";
import type { PricingPlan } from "@/types";

const FAQ_ITEMS = [
  {
    q: "Does it keep natural shadows?",
    a: "Yes, our AI preserves natural shadows while removing the background, perfect for Amazon's 'shadow allowed' policy.",
  },
  {
    q: "How many images can I process?",
    a: "Each plan gives you credits: 3 free, 50 with Starter (€9), 200 with Pro (€29). One credit = one image. Process them one by one from the dashboard or the homepage.",
  },
  {
    q: "What format should I upload?",
    a: "JPG, PNG, or WebP. We recommend high-resolution photos (1000px+ width) for best results.",
  },
  {
    q: "Is it really Amazon compliant?",
    a: "We output pure white (#FFFFFF) HD PNG (1024×1024), which meets Amazon's minimum size (1000px). Ideal for main and secondary images.",
  },
] as const;

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    credits: 3,
    features: ["3 free images", "HD PNG export"],
  },
  {
    id: "starter",
    name: "Starter",
    price: 9,
    credits: 50,
    features: ["50 images", "HD PNG (1024×1024)", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    credits: 200,
    features: ["200 images", "HD PNG (1024×1024)", "Priority support"],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      <ConfigBanner />
      <header className="fixed top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link
            href="/"
            className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            LinkedShot
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link
              href="/#upload"
              className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-16" id="main-content">
        <section className="animate-fade-in" aria-labelledby="hero-heading">
          <HeroSection />
        </section>

        <section id="upload" className="mx-auto max-w-3xl px-4 py-12" aria-label="Upload and process your photos">
          <UploadZone />
        </section>

        <section id="examples" aria-labelledby="examples-heading">
          <BeforeAfter />
        </section>

        <section className="border-t border-zinc-200 bg-white px-4 py-16 animate-slide-up" aria-labelledby="how-it-works-heading">
          <div className="mx-auto max-w-4xl">
            <h2 id="how-it-works-heading" className="text-center text-2xl font-bold text-zinc-900">
              How it works
            </h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                  1
                </div>
                <h3 className="mt-3 font-semibold text-zinc-900">Upload</h3>
                <p className="mt-1 text-sm text-zinc-600">
                  Drop your supplier photo (JPG, PNG or WebP).
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                  2
                </div>
                <h3 className="mt-3 font-semibold text-zinc-900">AI Processing</h3>
                <p className="mt-1 text-sm text-zinc-600">
                  Our AI removes the background in about 3 seconds.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                  3
                </div>
                <h3 className="mt-3 font-semibold text-zinc-900">Download</h3>
                <p className="mt-1 text-sm text-zinc-600">
                  Get your Amazon-ready white background image.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 py-16" aria-labelledby="why-linkedshot-heading">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 id="why-linkedshot-heading" className="mb-8 text-2xl font-bold text-zinc-900">
              Why Amazon Sellers Choose LinkedShot
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <div className="mb-4 text-3xl">🎯</div>
                <h3 className="mb-2 font-bold text-zinc-900">Amazon-Optimized</h3>
                <p className="text-sm text-gray-600">
                  Not just &quot;remove bg&quot; — we output pure white #FFFFFF
                  HD PNG (1024×1024), ready for Amazon listings.
                </p>
              </div>
              <div>
                <div className="mb-4 text-3xl">⚡</div>
                <h3 className="mb-2 font-bold text-zinc-900">Simple & Fast</h3>
                <p className="text-sm text-gray-600">
                  One click per image, ~3 seconds each. Process 50 or 200 images
                  with Starter or Pro credits.
                </p>
              </div>
              <div>
                <div className="mb-4 text-3xl">💰</div>
                <h3 className="mb-2 font-bold text-zinc-900">Cheaper Than Fiverr</h3>
                <p className="text-sm text-gray-600">
                  €0.18 per image vs €2-5 on Fiverr. Process 100 images for the
                  price of 5.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="mb-8 text-center text-2xl font-bold text-zinc-900">
            Common Questions
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
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: item.a,
                  },
                })),
              }),
            }}
          />
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <article key={i} className="border-b border-gray-200 pb-4">
                <h3 className="mb-2 font-semibold text-zinc-900">{item.q}</h3>
                <p className="text-sm text-gray-600">{item.a}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-gradient-to-br from-zinc-900 to-zinc-800 px-4 py-16 text-white">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-3 text-2xl font-bold">
              Try 3 free images — no credit card
            </h2>
            <p className="mb-8 text-zinc-300">
              Join Amazon sellers who list faster. Upload now and see the result in seconds.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/#upload"
                className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-zinc-900 transition hover:bg-zinc-100"
              >
                Start free
              </Link>
              <Link
                href="/#pricing"
                className="rounded-xl border-2 border-zinc-500 px-8 py-4 text-lg font-semibold transition hover:border-white hover:bg-white/10"
              >
                See pricing
              </Link>
            </div>
            <p className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-zinc-400">
              <span>✓ No commitment</span>
              <span>✓ Cancel anytime</span>
              <span>✓ HD download</span>
            </p>
          </div>
        </section>

        <section id="pricing" className="animate-slide-up px-4 py-16" aria-labelledby="pricing-heading">
          <div className="mx-auto max-w-5xl">
            <h2 id="pricing-heading" className="text-center text-2xl font-bold text-zinc-900">
              Simple, transparent pricing
            </h2>
            <div className="mt-10">
              <Pricing plans={plans} />
            </div>
          </div>
        </section>

        <StickyCta />

        <footer className="mt-20 bg-gray-900 py-12 text-white" role="contentinfo">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="mb-4 font-bold">LinkedShot</h4>
              <p className="text-sm text-gray-400">
                Turn your supplier photos into perfect Amazon packshots.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-bold">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/#pricing">Pricing</Link>
                </li>
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Terms</li>
                <li>Privacy</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold">Contact</h4>
              <p className="text-sm text-gray-400">contact@linkedshot.com</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
