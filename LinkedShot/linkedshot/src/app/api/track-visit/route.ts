import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createServiceRoleClient } from "@/lib/supabase";

/** Enregistre une visite pour les stats admin (visiteurs journaliers). Idempotent côté client (1 appel par session). */
export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  try {
    const supabaseAuth = createServerClient(
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
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();

    const admin = createServiceRoleClient();
    await admin.from("visits").insert({
      user_id: user?.id ?? null,
    });
  } catch {
    // Ne pas faire échouer la page si le tracking échoue
  }
  return new NextResponse(null, { status: 204 });
}
