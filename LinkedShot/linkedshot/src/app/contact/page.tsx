import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact LinkedShot and company information.",
  openGraph: {
    title: "Contact Us | LinkedShot",
    description: "Contact LinkedShot and company information.",
    type: "website",
  },
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
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
          Contact Us
        </h1>
        <div className="space-y-8 text-sm text-zinc-700">
          <section>
            <h2 className="mb-2 font-semibold text-zinc-900">Email</h2>
            <p>
              <a
                href="mailto:contact@linkedshot.com"
                className="text-blue-600 hover:underline"
              >
                contact@linkedshot.com
              </a>
            </p>
            <p className="mt-2 text-zinc-600">
              For support, billing, privacy, or general inquiries.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-semibold text-zinc-900">
              Company Information
            </h2>
            <p>
              LinkedShot is operated by:
              <br />
              <strong className="text-zinc-900">WEMADE</strong>
              <br />
              41 rue Fongate
              <br />
              13006 Marseille, France
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
