import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "LinkedShot privacy policy and personal data handling.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Link
            href="/"
            className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            LinkedShot
          </Link>
          <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900">
            Back to home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-8 text-2xl font-bold text-zinc-900">
          Privacy Policy
        </h1>
        <p className="mb-4 text-sm text-zinc-600">
          Last updated: February 2025
        </p>
        <div className="space-y-6 text-sm text-zinc-700">
          <section>
            <h2 className="mb-2 font-semibold text-zinc-900">1. Who we are</h2>
            <p>
              LinkedShot is operated by WEMADE, 41 rue Fongate, 13006 Marseille,
              France. This policy describes how we collect and use your
              information when you use our service.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-semibold text-zinc-900">
              2. Information we collect
            </h2>
            <p>
              We collect: (a) account information you provide when signing in
              (e.g. email via Google OAuth or magic link); (b) images you upload
              for processing; (c) usage data (credits, processing history); (d)
              payment information processed by Stripe (we do not store card
              numbers). We use Supabase for authentication and storage, and FAL
              for image processing.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-semibold text-zinc-900">
              3. How we use your data
            </h2>
            <p>
              We use your data to provide the service (authentication, image
              processing, credit management, payments), to improve the product,
              and to comply with legal obligations. We do not sell your personal
              data to third parties.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-semibold text-zinc-900">
              4. Data retention and deletion
            </h2>
            <p>
              We retain your account data and processed images for as long as
              your account is active. You may request deletion of your account
              and associated data by contacting us at contact@linkedshot.com.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-semibold text-zinc-900">5. Your rights</h2>
            <p>
              You have the right to access, correct, or delete your personal
              data, and to object to or restrict certain processing. For
              requests, contact us at contact@linkedshot.com. If you are in the
              EEA, you may also lodge a complaint with your supervisory authority.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-semibold text-zinc-900">6. Contact</h2>
            <p>
              For privacy-related questions: contact@linkedshot.com. Operator:
              WEMADE, 41 rue Fongate, 13006 Marseille, France.
            </p>
          </section>
        </div>
        <p className="mt-12">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
