import Link from "next/link";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link
            href="/"
            className="text-xl font-bold text-zinc-900 hover:text-zinc-700"
          >
            LinkedShot
          </Link>
          <nav className="flex gap-6">
            <Link
              href="/blog"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Blog
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Home
            </Link>
            <Link
              href="/#upload"
              className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Try free
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12">{children}</main>
    </div>
  );
}
