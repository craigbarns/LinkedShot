import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createServiceRoleClient } from "@/lib/supabase";

/**
 * GET /api/jobs — liste des jobs de l'utilisateur connecté.
 * Côté serveur (cookies + service role) pour éviter les soucis RLS/session côté client.
 */
export async function GET(request: NextRequest) {
  try {
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

    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();
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
