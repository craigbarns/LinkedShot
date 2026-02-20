import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from =
  process.env.RESEND_FROM ?? "LinkedShot <onboarding@resend.dev>";

function getResend() {
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not set. Add it in .env.local and Vercel."
    );
  }
  return new Resend(apiKey);
}

const NOTIFY_EMAIL = "gregory@linkedshot.com";

export async function sendNewUserNotification(newUserEmail: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const resend = getResend();
    const { error } = await resend.emails.send({
      from,
      to: NOTIFY_EMAIL,
      subject: `Nouveau compte LinkedShot : ${newUserEmail}`,
      text: `Un nouveau client s'est inscrit sur LinkedShot.\n\nEmail du client : ${newUserEmail}\n\nTu peux voir les utilisateurs dans Supabase (Authentication → Users).`,
    });
    if (error) {
      console.error("Resend error:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("sendNewUserNotification failed:", message);
    return { ok: false, error: message };
  }
}
