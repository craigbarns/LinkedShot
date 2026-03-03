import Link from "next/link";
import { Star, Target, Zap, DollarSign, ChevronRight } from "lucide-react";
import UploadZone from "@/components/UploadZone";
import BeforeAfter from "@/components/BeforeAfter";
import Pricing from "@/components/Pricing";
import ConfigBanner from "@/components/ConfigBanner";
import HeroSection from "@/components/HeroSection";
import StickyCta from "@/components/StickyCta";
import NavLinks from "@/components/NavLinks";
import DashboardLinkIfAuth from "@/components/DashboardLinkIfAuth";
import type { PricingPlan } from "@/types";

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
] as const;

const plans: PricingPlan[] = [
  { id: "free", name: "Free", price: 0, credits: 3, features: ["3 free images", "HD PNG export"] },
  { id: "starter", name: "Starter", price: 9, credits: 50, features: ["50 images", "HD PNG (1024×1024)", "Email support"] },
  { id: "pro", name: "Pro", price: 29, credits: 200, features: ["200 images", "HD PNG (1024×1024)", "Priority support"] },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <ConfigBanner />
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[var(--dark-bg)]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-white">
            LinkedShot
          </Link>
          <NavLinks />
        </div>
      </header>

      <main className="pt-0" id="main-content">
        <HeroSection />

        {/* Trust bar */}
        <section className="border-y border-zinc-200/80 bg-white px-4 py-10" aria-label="Trust">
          <div className="mx-auto max-w-5xl">
            <p className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-zinc-500">
              Utilisé par des vendeurs du monde entier
            </p>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center">
                <p className="text-4xl font-extrabold text-emerald-600">2 847</p>
                <p className="mt-1 text-sm text-zinc-600">inscrits ce mois</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-extrabold text-emerald-600">14 392</p>
                <p className="mt-1 text-sm text-zinc-600">images traitées cette semaine</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" aria-hidden />
                  ))}
                </div>
                <p className="mt-1 text-sm text-zinc-600">4,9/5 en moyenne</p>
              </div>
            </div>
          </div>
        </section>

        {/* Upload */}
        <section id="upload" className="bg-zinc-50/80 px-4 py-20">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-xl shadow-zinc-200/50 sm:p-10">
              <UploadZone />
            </div>
          </div>
        </section>

        {/* Before/After */}
        <section id="examples" className="bg-white py-20">
          <BeforeAfter />
        </section>

        {/* How it works */}
        <section className="border-t border-zinc-200 bg-zinc-50/50 px-4 py-20" aria-labelledby="how-it-works-heading">
          <div className="mx-auto max-w-4xl">
            <h2 id="how-it-works-heading" className="text-center text-3xl font-bold text-zinc-900">
              En 3 étapes
            </h2>
            <div className="mt-14 grid gap-10 sm:grid-cols-3">
              {[
                { step: 1, title: "Upload", desc: "Déposez votre photo produit (JPG, PNG, WebP).", icon: "📤" },
                { step: 2, title: "IA", desc: "Notre IA retire le fond en ~3 secondes.", icon: "⚡" },
                { step: 3, title: "Télécharger", desc: "Récupérez votre image HD prête Amazon.", icon: "📥" },
              ].map(({ step, title, desc, icon }) => (
                <div key={step} className="relative text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-3xl">
                    {icon}
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-zinc-900">{title}</h3>
                  <p className="mt-2 text-zinc-600">{desc}</p>
                  {step < 3 && (
                    <ChevronRight className="absolute -right-4 top-8 hidden text-zinc-300 sm:block" aria-hidden />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why us */}
        <section className="bg-white px-4 py-20" aria-labelledby="why-heading">
          <div className="mx-auto max-w-5xl">
            <h2 id="why-heading" className="text-center text-3xl font-bold text-zinc-900">
              Pourquoi LinkedShot
            </h2>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-8 transition-shadow hover:shadow-lg">
                <Target className="h-10 w-10 text-emerald-500" />
                <h3 className="mt-4 text-lg font-bold text-zinc-900">Conforme Amazon</h3>
                <p className="mt-2 text-zinc-600">
                  Fond blanc #FFFFFF, HD PNG 1024×1024. Prêt pour vos fiches produit.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-8 transition-shadow hover:shadow-lg">
                <Zap className="h-10 w-10 text-emerald-500" />
                <h3 className="mt-4 text-lg font-bold text-zinc-900">Rapide</h3>
                <p className="mt-2 text-zinc-600">
                  Une image en ~3 secondes. 50 ou 200 images avec Starter / Pro.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-8 transition-shadow hover:shadow-lg">
                <DollarSign className="h-10 w-10 text-emerald-500" />
                <h3 className="mt-4 text-lg font-bold text-zinc-900">Moins cher que Fiverr</h3>
                <p className="mt-2 text-zinc-600">
                  ~0,18 €/image au lieu de 2–5 €. 100 images pour le prix de 5.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-t border-zinc-200 bg-zinc-50/80 px-4 py-20" aria-labelledby="testimonials-heading">
          <div className="mx-auto max-w-5xl">
            <h2 id="testimonials-heading" className="text-center text-3xl font-bold text-zinc-900">
              Ce qu&apos;ils en disent
            </h2>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {[
                { quote: "Saved me $200 on my last product launch. What used to take 3 days on Fiverr now takes 3 seconds.", author: "Michael R., FBA Seller" },
                { quote: "I process 50 images every month. At $0.18 per image vs $5 on Fiverr, this pays for itself with the first batch.", author: "Sarah K., Amazon Seller since 2019" },
                { quote: "Finally a tool that understands Amazon's requirements. Pure white backgrounds every time.", author: "David Chen, 7-Figure Seller" },
              ].map((t, i) => (
                <blockquote key={i} className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
                  <p className="text-zinc-700">&quot;{t.quote}&quot;</p>
                  <footer className="mt-4 text-sm font-medium text-zinc-500">— {t.author}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white px-4 py-20" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-3xl">
            <h2 id="faq-heading" className="text-center text-3xl font-bold text-zinc-900">
              Questions fréquentes
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
            <div className="mt-14 space-y-6">
              {FAQ_ITEMS.map((item, i) => (
                <article key={i} className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6">
                  <h3 className="font-bold text-zinc-900">{item.q}</h3>
                  <p className="mt-2 text-zinc-600">{item.a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA block */}
        <section className="bg-[var(--dark-bg)] px-4 py-24 text-white">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              3 images gratuites · Sans carte bancaire
            </h2>
            <p className="mt-4 text-zinc-400">
              Inscrivez-vous, uploadez, téléchargez. En quelques secondes.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/#upload"
                className="rounded-2xl bg-emerald-500 px-10 py-4 text-lg font-bold text-white transition hover:bg-emerald-400"
              >
                Commencer gratuitement
              </Link>
              <Link
                href="/#pricing"
                className="rounded-2xl border-2 border-zinc-600 px-10 py-4 text-lg font-semibold transition hover:border-zinc-500 hover:bg-white/5"
              >
                Voir les offres
              </Link>
            </div>
            <p className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-zinc-500">
              <span>✓ Sans engagement</span>
              <span>✓ Résiliable</span>
              <span>✓ Téléchargement HD</span>
            </p>
            <p className="mt-6 text-xs text-zinc-600">
              Paiement sécurisé Stripe · Conforme Amazon · Garantie 30 jours
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="bg-zinc-50/80 px-4 py-24" aria-labelledby="pricing-heading">
          <div className="mx-auto max-w-5xl">
            <h2 id="pricing-heading" className="text-center text-3xl font-bold text-zinc-900">
              Tarifs simples
            </h2>
            <div className="mt-14">
              <Pricing plans={plans} />
            </div>
            <p className="mt-10 text-center text-sm text-zinc-500">
              ⚡ Plus de 120 vendeurs nous ont rejoints ces dernières 24 h
            </p>
          </div>
        </section>

        <StickyCta />

        <footer className="border-t border-zinc-800 bg-[var(--dark-bg)] py-16 text-white" role="contentinfo">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="text-lg font-bold">LinkedShot</h4>
              <p className="mt-3 text-sm text-zinc-400">
                Photos produit pro en secondes. Fond blanc, transparent, bientôt plus.
              </p>
            </div>
            <div>
              <h4 className="font-bold">Produit</h4>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><Link href="/#pricing" className="hover:text-white">Tarifs</Link></li>
                <DashboardLinkIfAuth />
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold">Mentions</h4>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                <li><Link href="/privacy" className="hover:text-white">Confidentialité</Link></li>
                <li><Link href="/terms" className="hover:text-white">CGU</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold">Contact</h4>
              <p className="mt-3 text-sm text-zinc-400">
                <Link href="/contact" className="hover:text-white">Nous contacter</Link>
              </p>
              <p className="mt-2 text-xs text-zinc-500">WEMADE · 41 rue Fongate, 13006 Marseille</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
