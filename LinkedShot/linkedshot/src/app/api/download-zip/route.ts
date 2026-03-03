import { NextRequest, NextResponse } from "next/server";
import archiver from "archiver";
import { PassThrough } from "stream";
import { Readable } from "stream";

const MAX_URLS = 50;
const MAX_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB total

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urls } = body as { urls?: string[] };
    if (!Array.isArray(urls) || urls.length < 2 || urls.length > MAX_URLS) {
      return NextResponse.json(
        { error: `Send 2–${MAX_URLS} image URLs.` },
        { status: 400 }
      );
    }

    const archive = archiver("zip", { zlib: { level: 6 } });
    const pass = new PassThrough();
    archive.pipe(pass);

    (async () => {
      try {
        let totalSize = 0;
        for (let i = 0; i < urls.length; i++) {
          const url = urls[i];
          if (typeof url !== "string" || !url.startsWith("http")) continue;
          const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
          if (!res.ok) continue;
          const buf = Buffer.from(await res.arrayBuffer());
          totalSize += buf.length;
          if (totalSize > MAX_SIZE_BYTES) break;
          archive.append(buf, { name: `image-${i + 1}.png` });
        }
        await archive.finalize();
      } catch (e) {
        archive.abort();
      }
    })();

    const webStream = Readable.toWeb(pass) as ReadableStream;
    return new NextResponse(webStream, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=linkedshot-images.zip",
      },
    });
  } catch (e) {
    console.error("Download ZIP error:", e);
    return NextResponse.json({ error: "Failed to create ZIP" }, { status: 500 });
  }
}
