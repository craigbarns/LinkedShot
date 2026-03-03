import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createServiceRoleClient } from "@/lib/supabase";

/** POST /api/referral/apply — apply referral credits (give 5, get 5). Body: { referrerId: string } */
export async function POST(request: NextRequest) {
  try {
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: () => {},
        },
      }
    );
    const {
      data: { user: currentUser },
    } = await supabaseAuth.auth.getUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const referrerId = body.referrerId as string | undefined;
    if (!referrerId || referrerId === currentUser.id) {
      return NextResponse.json({ error: "Invalid referrer" }, { status: 400 });
    }

    const admin = createServiceRoleClient();
    const { data: existing } = await admin
      .from("referral_applied")
      .select("referred_user_id")
      .eq("referred_user_id", currentUser.id)
      .single();
    if (existing) {
      return NextResponse.json({ ok: true, message: "Already applied" });
    }

    await admin.from("referral_applied").insert({
      referred_user_id: currentUser.id,
      referrer_user_id: referrerId,
    });

    const { data: myCredits } = await admin
      .from("credits")
      .select("amount")
      .eq("user_id", currentUser.id)
      .single();
    await admin
      .from("credits")
      .update({
        amount: (myCredits?.amount ?? 0) + 5,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", currentUser.id);

    const { data: refCredits } = await admin
      .from("credits")
      .select("amount")
      .eq("user_id", referrerId)
      .single();
    if (refCredits) {
      await admin
        .from("credits")
        .update({
          amount: refCredits.amount + 5,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", referrerId);
    } else {
      await admin.from("credits").insert({
        user_id: referrerId,
        amount: 5,
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ ok: true, message: "You and your referrer each received 5 credits!" });
  } catch (e) {
    console.error("Referral apply error:", e);
    return NextResponse.json(
      { error: "Referral not available. Make sure the referral_applied table exists (run migration 003_referral.sql)." },
      { status: 500 }
    );
  }
}
