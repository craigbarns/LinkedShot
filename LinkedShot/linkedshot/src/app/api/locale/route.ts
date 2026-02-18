import { NextRequest, NextResponse } from "next/server";

/** US (and territories) → USD, rest → EUR. Same number: $9 / €9. */
const USD_COUNTRIES = new Set(["US", "UM", "GU", "PR", "VI", "AS", "MP"]);

export async function GET(request: NextRequest) {
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("X-Vercel-IP-Country") ??
    "";
  const useUsd = country && USD_COUNTRIES.has(country.toUpperCase());
  const currency = useUsd ? "usd" : "eur";
  const symbol = useUsd ? "$" : "€";
  return NextResponse.json({ currency, symbol, country: country || null });
}
