import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase";

/**
 * GET /api/jobs — liste des jobs de l'utilisateur connecté.
 * Lit la session via cookies, ou via Authorization: Bearer <token> si les cookies ne passent pas (ex. prod).
 */
export async function GET(request: NextRequest) {
  try {
    let user: { id: string } | null = null;

    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {},
        },
      }
    );
    const { data: { user: cookieUser } } = await supabaseAuth.auth.getUser();
    if (cookieUser) {
      user = cookieUser;
    }

    if (!user) {
      const authHeader = request.headers.get("authorization");
      const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
      if (token) {
        const supabaseWithToken = createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          { global: { headers: { Authorization: `Bearer ${token}` } } }
        );
        const { data: { user: tokenUser } } = await supabaseWithToken.auth.getUser();
        if (tokenUser) user = tokenUser;
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createServiceRoleClient();
    const { data: jobs, error } = await admin
      .from("jobs")
      .select("id, user_id, original_path, processed_path, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("API jobs fetch error:", error);
      return NextResponse.json({ error: "Failed to load jobs" }, { status: 500 });
    }

    return NextResponse.json({ jobs: jobs ?? [] });
  } catch (e) {
    console.error("API jobs error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
