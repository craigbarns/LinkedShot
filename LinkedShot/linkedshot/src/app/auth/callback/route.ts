import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const NEW_USER_MAX_AGE_MS = 2 * 60 * 1000; // 2 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const origin = request.nextUrl.origin;

  if (code) {
    const response = NextResponse.redirect(new URL("/", origin));
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );
    await supabase.auth.exchangeCodeForSession(code);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;
    const email = user?.email;
    const createdAt = user?.created_at;
    const secret = process.env.NEW_USER_WEBHOOK_SECRET;
    if (
      email &&
      secret &&
      createdAt &&
      Date.now() - new Date(createdAt).getTime() < NEW_USER_MAX_AGE_MS
    ) {
      try {
        await fetch(`${origin}/api/webhooks/new-user`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${secret}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
      } catch {
        // non-blocking: don't fail redirect if notify fails
      }
    }

    return response;
  }

  return NextResponse.redirect(new URL("/", origin));
}
