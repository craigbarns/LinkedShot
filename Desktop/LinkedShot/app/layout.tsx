import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://linkedshot.com'),
  title: "Professional LinkedIn Photo by AI | LinkedShot™ | $29 — 24h",
  description: "Get your professional LinkedIn headshot in 2 minutes with LinkedShot. AI + Human Touch. 2,847 reviews 4.9/5. 30-day money-back guarantee. US-Based 🇺🇸",
  openGraph: {
    title: "I Transformed My LinkedIn Profile in 2 Minutes",
    description: "Pro AI headshot, stunning results!",
    images: ["/og-image.jpeg"], // Generated AI image
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        {children}
      </body>
    </html>
  );
}
