import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to LinkedShot to process product photos with AI. Get white background images for Amazon in seconds.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/login" },
};

export default function LoginLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
