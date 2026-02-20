import type { Metadata } from "next";
import Link from "next/link";
import Article3Content from "./content";

export const metadata: Metadata = {
  title: "Amazon Photos: Fiverr vs Photoshop vs AI Tools (2024 Comparison)",
  description:
    "Fiverr ($5/image), Photoshop (hours), or AI ($0.18/image)? Honest comparison for Amazon product photography. Which is best for bulk editing?",
  openGraph: {
    title: "Amazon Photos: Fiverr vs Photoshop vs AI Tools (2024 Comparison)",
    description:
      "Fiverr ($5/image), Photoshop (hours), or AI ($0.18/image)? Honest comparison for Amazon product photography. Best for bulk editing?",
    type: "article",
  },
  alternates: { canonical: "/blog/fiverr-vs-software-vs-ai-amazon-photos" },
};

export default function Page() {
  return (
    <>
      <nav className="mb-8 text-sm text-zinc-500">
        <Link href="/blog" className="hover:text-zinc-900">
          ← Blog
        </Link>
      </nav>
      <Article3Content />
      <div className="mt-12 border-t border-zinc-200 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Process 50 images for $9 vs $250 on Fiverr →
        </Link>
      </div>
    </>
  );
}
