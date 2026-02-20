import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Upload product photos and get Amazon-compliant white background images. Use your LinkedShot credits and manage your generations.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/dashboard" },
};

export default function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
