export const BLOG_POSTS = [
  {
    slug: "amazon-photo-requirements-2024",
    title: "Amazon Product Photo Requirements 2026: Complete Guide to Compliance",
    description:
      "Complete guide to Amazon image requirements 2026: size, pure white background (#FFFFFF), shadows, and formats. Avoid listing suppression with these rules.",
    date: "2026-01-10",
    updatedDate: "2026-03-10",
    readingTime: 6,
    category: "Amazon Compliance",
    tags: ["amazon photo requirements", "white background amazon", "FBA photos"],
  },
  {
    slug: "amazon-product-photography-without-photographer",
    title: "How to Shoot Amazon Product Photos Without a Photographer (Under $10)",
    description:
      "Professional Amazon photos without hiring a photographer. DIY setup vs AI tools. Get studio-quality white backgrounds from your supplier mess.",
    date: "2026-01-20",
    updatedDate: "2026-03-10",
    readingTime: 7,
    category: "Product Photography",
    tags: ["amazon product photography", "DIY product photos", "white background"],
  },
  {
    slug: "fiverr-vs-software-vs-ai-amazon-photos",
    title: "Amazon Photos: Fiverr vs Photoshop vs AI Tools (2026 Comparison)",
    description:
      "Fiverr ($5/image), Photoshop (hours), or AI ($0.18/image)? Honest comparison for Amazon product photography. Which is best for bulk editing in 2026?",
    date: "2026-02-15",
    updatedDate: "2026-03-10",
    readingTime: 8,
    category: "Tools & Comparison",
    tags: ["fiverr amazon photos", "AI background removal", "remove background amazon"],
  },
] as const;

export type BlogSlug = (typeof BLOG_POSTS)[number]["slug"];
