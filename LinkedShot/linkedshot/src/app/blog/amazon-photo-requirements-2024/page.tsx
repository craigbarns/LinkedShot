import type { Metadata } from "next";
import Link from "next/link";
import Article1Content from "./content";

export const metadata: Metadata = {
  title: "Amazon Product Photo Requirements 2024: Complete Guide to Compliance",
  description:
    "Complete guide to Amazon image requirements 2024: size, pure white background (#FFFFFF), shadows, and formats. Avoid listing suppression with these rules.",
  openGraph: {
    title: "Amazon Product Photo Requirements 2024: Complete Guide to Compliance",
    description:
      "Complete guide to Amazon image requirements 2024: size, pure white background (#FFFFFF), shadows, and formats. Avoid listing suppression.",
    type: "article",
  },
  alternates: { canonical: "/blog/amazon-photo-requirements-2024" },
};

export default function Page() {
  return (
    <>
      <nav className="mb-8 text-sm text-zinc-500">
        <Link href="/blog" className="hover:text-zinc-900">
          ← Blog
        </Link>
      </nav>
      <Article1Content />
      <div className="mt-12 border-t border-zinc-200 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Try 3 free images →
        </Link>
      </div>
    </>
  );
}
