"use client";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function HeroSection() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 text-center">
      <h1 id="hero-heading" className="mb-6 text-5xl font-bold leading-tight text-zinc-900">
        Amazon Product Photos in Seconds
        <br />
        <span className="text-blue-600">No Photoshop Required</span>
      </h1>

      <p className="mx-auto mb-4 max-w-2xl text-xl text-gray-600">
        Turn supplier photos into Amazon-compliant white background images.
        Upload, get HD PNG in ~3 seconds.
      </p>
      <p className="mx-auto mb-8 text-sm font-medium text-green-700">
        No credit card for 3 free images
      </p>

        <div className="mb-10 flex flex-wrap justify-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={() => scrollTo("upload")}
            className="rounded-xl bg-black px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Upload photos and get 3 free credits"
          >
            Get 3 free images →
          </button>
          <span className="text-xs text-zinc-500">Quick sign-in, then upload. No credit card.</span>
        </div>
        <button
          type="button"
          onClick={() => scrollTo("examples")}
          className="rounded-xl border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="See before and after examples"
        >
          See before / after
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
        <span className="flex items-center gap-2">✓ Pure white #FFFFFF</span>
        <span className="flex items-center gap-2">✓ HD PNG</span>
        <span className="flex items-center gap-2">✓ No watermark</span>
        <span className="flex items-center gap-2">✓ ~3 sec per image</span>
      </div>
    </div>
  );
}
