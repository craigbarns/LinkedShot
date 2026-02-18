import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
  description: "LinkedShot terms of service and use.",
};

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="mb-6 text-sm text-zinc-600">
          Last updated: February 2025
        </p>
        <div className="space-y-6 text-sm text-zinc-700">
          <section>
            <h2 className="mb-2 font-semibold text-zinc-900">
              1. Agreement to terms
            </h2>
            <p>
              By using LinkedShot (“Service”), you agree to these Terms of
              Service. The Service is operated by WEMADE, 41 rue Fongate, 13006
              Marseille, France. If you do not agree, do not use the Service.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-semibold text-zinc-900">
              2. Description of service
            </h2>
            <p>
              LinkedShot provides AI-powered background removal and
              Amazon-optimized image processing. You upload images, we process
              them and deliver results. Usage is metered by credits (free tier and
              paid plans). We do not guarantee specific quality or compatibility
              with every image or platform.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-semibold text-zinc-900">
              3. Account and conduct
            </h2>
            <p>
              You must provide accurate information and keep your account
              secure. You may not use the Service for illegal purposes, to
              infringe others’ rights, or to upload content you do not have the
              right to use. We may suspend or terminate accounts that violate
              these terms.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-semibold text-zinc-900">
              4. Payments and refunds
            </h2>
            <p>
              Paid plans are charged via Stripe. Credits are consumed when you
              process images. Refunds are handled in accordance with applicable
              law and our refund policy; contact us at contact@linkedshot.com for
              requests.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-semibold text-zinc-900">
              5. Intellectual property and your content
            </h2>
            <p>
              You retain ownership of the images you upload. By using the
              Service, you grant us the rights necessary to process and store
              your content to provide the Service. Our technology, branding, and
              materials remain our property.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-semibold text-zinc-900">
              6. Limitation of liability
            </h2>
            <p>
              The Service is provided “as is.” To the maximum extent permitted
              by law, we are not liable for indirect, incidental, or
              consequential damages, or for loss of data or business. Our total
              liability is limited to the amount you paid us in the twelve
              months preceding the claim.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-semibold text-zinc-900">7. Contact</h2>
            <p>
              For questions about these terms: contact@linkedshot.com. Operator:
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
