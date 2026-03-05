import Link from "next/link";

export default function Article1Content() {
  return (
    <article className="space-y-6 text-zinc-700 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-700">
      <h1>Amazon Product Photo Requirements 2025: The Complete Compliance Guide</h1>

      <p>
        Getting your Amazon listing suspended because of a non-compliant main image is a nightmare for any FBA seller. Amazon&apos;s algorithm is stricter than ever in 2025, rejecting photos that don&apos;t meet exact specifications.
      </p>

      <p>Here&apos;s everything you need to know to keep your listings live and converting.</p>

      <h2>The Non-Negotiable Technical Specs</h2>

      <h3>Image Size & Resolution</h3>
      <ul>
        <li><strong>Minimum:</strong> 1000 x 1000 pixels (Amazon enforces this strictly)</li>
        <li><strong>Recommended:</strong> 1024 x 1024px or 2000 x 2000px for zoom capability</li>
        <li><strong>Aspect ratio:</strong> 1:1 (square) preferred, though Amazon accepts up to 5:1</li>
      </ul>
      <p><em>Pro tip:</em> Images under 1000px won&apos;t have the zoom feature, killing your conversion rate by up to 30%.</p>

      <h3>The Pure White Background Rule</h3>
      <p>This is where most sellers fail.</p>
      <ul>
        <li><strong>Color:</strong> Pure white RGB (255, 255, 255) or HEX #FFFFFF</li>
        <li><strong>Not off-white:</strong> #F8F8F8 or light gray backgrounds get rejected</li>
        <li><strong>Main image only:</strong> Secondary images can have lifestyle backgrounds</li>
      </ul>

      <p><strong>Common mistake:</strong> Many suppliers provide photos with gray or beige backgrounds. These will get your listing flagged.</p>

      <h2>What Amazon Allows (And What Gets You Banned)</h2>

      <h3>✅ Allowed Elements</h3>
      <ul>
        <li>Natural shadows (soft, not graphic/drawn)</li>
        <li>Product reflections on glossy surfaces</li>
        <li>Product in use (for secondary images only)</li>
      </ul>

      <h3>❌ Strictly Forbidden on Main Image</h3>
      <ul>
        <li>Text, logos, or watermarks</li>
        <li>Multiple product views in one image</li>
        <li>Colored backgrounds (even light gray)</li>
        <li>Borders, frames, or mats</li>
        <li>Accessories not included in the sale</li>
      </ul>

      <h2>How to Ensure 100% Compliance</h2>

      <p>Manually editing 50 supplier photos to pure #FFFFFF white in Photoshop takes hours. One mistake in the color code and Amazon rejects your upload.</p>

      <p><strong>LinkedShot automates compliance:</strong></p>
      <ul>
        <li>Outputs exact <strong>#FFFFFF</strong> pure white background</li>
        <li>Resizes to <strong>1024×1024px</strong> automatically</li>
        <li>Preserves natural shadows (Amazon-approved)</li>
        <li>Delivers <strong>HD PNG</strong> in 3 seconds</li>
      </ul>

      <p>
        <Link href="https://www.linkedshot.com"><strong>Try 3 free images →</strong></Link> See if your current photos pass Amazon&apos;s requirements instantly.
      </p>

      <h3>File Formats That Work</h3>
      <p>Amazon accepts: JPEG, PNG, GIF, TIFF. We recommend <strong>PNG</strong> for the main image (lossless quality) and JPEG for faster-loading secondary images.</p>

      <h2>FAQ: Amazon Photo Compliance</h2>

      <h3>Does Amazon accept shadows?</h3>
      <p>Yes, but only natural shadows cast by the product itself. Don&apos;t add graphic shadows in post-production.</p>

      <h3>What happens if my background isn&apos;t pure white?</h3>
      <p>Amazon&apos;s bot will suppress your listing from search results or flag it for review. You won&apos;t get a warning email immediately, but your sales will drop.</p>

      <h3>Can I use my iPhone for Amazon photos?</h3>
      <p>Yes, if you have proper lighting and a pure white backdrop. However, editing the background to #FFFFFF perfectly is harder than shooting it right.</p>

      <hr className="my-8 border-zinc-200" />
      <p className="text-sm text-zinc-500">
        <em>Last updated: 2025. Amazon guidelines change frequently—always check Seller Central for the latest updates.</em>
      </p>
    </article>
  );
}
