export const BLOG_POSTS = [
  {
    slug: "amazon-photo-requirements-2024",
    title: "Amazon Product Photo Requirements 2024: Complete Guide to Compliance",
    description:
      "Complete guide to Amazon image requirements 2024: size, pure white background (#FFFFFF), shadows, and formats. Avoid listing suppression with these rules.",
    date: "2024-02-18",
  },
  {
    slug: "amazon-product-photography-without-photographer",
    title: "How to Shoot Amazon Product Photos Without a Photographer (Under $10)",
    description:
      "Professional Amazon photos without hiring a photographer. DIY setup vs AI tools. Get studio-quality white backgrounds from your supplier mess.",
    date: "2024-02-18",
  },
  {
    slug: "fiverr-vs-software-vs-ai-amazon-photos",
    title: "Amazon Photos: Fiverr vs Photoshop vs AI Tools (2024 Comparison)",
    description:
      "Fiverr ($5/image), Photoshop (hours), or AI ($0.18/image)? Honest comparison for Amazon product photography. Which is best for bulk editing?",
    date: "2024-02-18",
  },
] as const;

export type BlogSlug = (typeof BLOG_POSTS)[number]["slug"];
