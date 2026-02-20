import { NextRequest, NextResponse } from "next/server";
import { sendNewUserNotification } from "@/lib/resend";

/**
 * Webhook appelé quand un nouveau compte est créé (Supabase Auth ou Database Webhook).
 * Envoie un email à gregory@linkedshot.com.
 *
 * Body accepté :
 * - { email: string }
 * - { record: { email?: string } }  (format Supabase Database Webhook)
 */
export async function POST(request: NextRequest) {
  const secret = process.env.NEW_USER_WEBHOOK_SECRET;
  if (!secret) {
    console.error("NEW_USER_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (bearer !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const email: string | undefined =
      typeof body?.email === "string"
        ? body.email
        : typeof body?.record?.email === "string"
          ? body.record.email
          : undefined;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Missing or invalid email in body" },
        { status: 400 }
      );
    }

    const result = await sendNewUserNotification(email);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error ?? "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("new-user webhook error:", e);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
