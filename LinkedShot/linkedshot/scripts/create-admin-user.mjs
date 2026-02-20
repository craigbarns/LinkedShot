#!/usr/bin/env node
/**
 * One-time script to create the admin user in Supabase.
 * Run from linkedshot folder: node scripts/create-admin-user.mjs
 * Requires .env.local with SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL.
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const envPath = existsSync(resolve(root, ".env.local"))
  ? resolve(root, ".env.local")
  : resolve(root, "..", ".env.local");

if (!existsSync(envPath)) {
  console.error("Missing .env.local. Create it in linkedshot/ or LinkedShot/ from .env.local.example.");
  process.exit(1);
}
console.log("Reading .env from:", envPath);

const envContent = readFileSync(envPath, "utf8");
const env = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const eq = trimmed.indexOf("=");
    if (eq > 0) {
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      value = value.replace(/\s*#.*$/, "").trim();
      value = value.replace(/^["']|["']$/g, "").trim();
      value = value.replace(/^\uFEFF/, ""); // BOM
      env[key] = value;
    }
  }
}
// .env.local always wins (ignore shell / parent .env)
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
const email = env.ADMIN_EMAIL || env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@linkedshot.com";

if (!url || !serviceRoleKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}
const isLegacyJwt = serviceRoleKey.startsWith("eyJ");
const isNewSecret = serviceRoleKey.startsWith("sb_secret_");
if (!isLegacyJwt && !isNewSecret) {
  console.error("SUPABASE_SERVICE_ROLE_KEY must be either:");
  console.error("  - Legacy: click 'Reveal' next to 'service_role' (JWT starting with eyJ), or");
  console.error("  - New: a Secret key from 'Secret keys' (starts with sb_secret_).");
  const preview = serviceRoleKey.slice(0, 20).replace(/./g, (c) => c === " " ? "<space>" : c);
  console.error("  In .env.local the value has " + serviceRoleKey.length + " chars; first chars: " + JSON.stringify(preview));
  process.exit(1);
}
console.log("Using Supabase URL:", url);

const password = "Linkedshot2302";
const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });

async function main() {
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    if (error.message.includes("already been registered")) {
      console.log("Admin user already exists:", email);
      console.log("You can use ADMIN / Linkedshot2302 on /admin/login.");
      return;
    }
    console.error("Error:", error.message);
    process.exit(1);
  }
  console.log("Admin user created:", email);
  console.log("Sign in at /admin/login with username ADMIN and password Linkedshot2302");
}

main();
