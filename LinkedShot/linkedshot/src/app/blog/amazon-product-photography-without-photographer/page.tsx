import type { Metadata } from "next";
import Link from "next/link";
import Article2Content from "./content";

export const metadata: Metadata = {
  title: "How to Shoot Amazon Product Photos Without a Photographer (Under $10)",
  description:
    "Professional Amazon photos without hiring a photographer. DIY setup vs AI tools. Get studio-quality white backgrounds from your supplier mess.",
  openGraph: {
    title: "How to Shoot Amazon Product Photos Without a Photographer (Under $10)",
    description:
      "Professional Amazon photos without hiring a photographer. DIY setup vs AI tools. Get studio-quality white backgrounds from supplier photos.",
    type: "article",
  },
  alternates: { canonical: "/blog/amazon-product-photography-without-photographer" },
};

export default function Page() {
  return (
    <>
      <nav className="mb-8 text-sm text-zinc-500">
        <Link href="/blog" className="hover:text-zinc-900">
          ← Blog
        </Link>
      </nav>
      <Article2Content />
      <div className="mt-12 border-t border-zinc-200 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Upload your worst supplier photo →
        </Link>
      </div>
    </>
  );
}
