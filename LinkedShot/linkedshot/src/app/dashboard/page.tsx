"use client";

import { Suspense, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Upload,
  Download,
  ImageIcon,
  CreditCard,
  LogOut,
  FileText,
  Gift,
} from "lucide-react";

interface Job {
  id: string;
  original_path: string;
  processed_path: string;
  status: string;
  created_at: string;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  currency: string;
  plan: string;
  receipt_url: string | null;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [credits, setCredits] = useState(0);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [referralUrl, setReferralUrl] = useState("");
  const checkoutSuccess = searchParams.get("checkout") === "success";

  useEffect(() => {
    if (typeof window !== "undefined" && user) {
      setReferralUrl(`${window.location.origin}/?ref=${user.id}`);
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      if (!u) {
        router.push("/");
        return;
      }
      setUser(u);

      const { data: creditsData } = await supabase
        .from("credits")
        .select("amount")
        .eq("user_id", u.id)
        .single();

      if (creditsData) setCredits(creditsData.amount);

      const { data: jobsData } = await supabase
        .from("jobs")
        .select("*")
        .eq("user_id", u.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (jobsData) setJobs(jobsData);

      const invRes = await fetch("/api/invoices", { credentials: "include" });
      if (invRes.ok) {
        const { invoices: invData } = await invRes.json();
        setInvoices(invData ?? []);
      }
    } catch (err) {
      console.error(err);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  // Envoyer l’événement "purchase" à Google Analytics / Google Ads après paiement
  useEffect(() => {
    if (!checkoutSuccess || typeof window === "undefined") return;
    const sessionId = searchParams.get("session_id");
    const value = searchParams.get("value");
    const currency = (searchParams.get("currency") || "eur").toUpperCase();
    if (!sessionId || !value) return;
    const sentKey = `linkedshot_purchase_${sessionId}`;
    if (sessionStorage.getItem(sentKey)) return;
    sessionStorage.setItem(sentKey, "1");
    const numValue = parseFloat(value);
    if (typeof (window as unknown as { gtag?: (a: string, b: string, c: object) => void }).gtag === "function") {
      (window as unknown as { gtag: (a: string, b: string, c: object) => void }).gtag("event", "purchase", {
        currency,
        value: numValue,
        transaction_id: sessionId,
      });
    }
  }, [checkoutSuccess, searchParams]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (credits <= 0) {
      alert("No credits left!");
      return;
    }

    setUploading(true);

    try {
      const supabase = createClient();
      const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : ".jpg";
      const filePath = `${user.id}/${Date.now()}${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("raw")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("raw")
        .getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;

      const res = await fetch("/api/process", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: publicUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Processing error");
      }

      await fetchData();
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Upload error"
      );
    } finally {
      setUploading(false);
    }
  };

  const getProcessedUrl = (path: string) => {
    const supabase = createClient();
    const { data } = supabase.storage.from("processed").getPublicUrl(path);
    return data.publicUrl;
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-zinc-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xl font-bold text-zinc-900 hover:text-zinc-700"
            >
              LinkedShot
            </Link>
            <h1 className="text-lg font-semibold text-zinc-700">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <CreditCard className="h-4 w-4" />
              {credits} credits remaining
            </div>
            <button
              type="button"
              onClick={signOut}
              className="text-zinc-600 hover:text-zinc-900"
              aria-label="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {checkoutSuccess && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-800">
            Payment successful! Your credits have been added.
          </div>
        )}

        {user && (
          <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-zinc-900">
              <Gift className="h-5 w-5 text-emerald-600" />
              Give 5, get 5 — Refer a friend
            </h2>
            <p className="mb-3 text-sm text-zinc-600">
              Share your link. When they sign up, you each get 5 free credits.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <code className="flex-1 rounded-lg bg-white px-3 py-2 text-sm text-zinc-800 break-all">
                {referralUrl || "…"}
              </code>
              <button
                type="button"
                onClick={() => {
                  if (referralUrl) {
                    navigator.clipboard.writeText(referralUrl);
                    alert("Link copied!");
                  }
                }}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
              >
                Copy link
              </button>
            </div>
          </div>
        )}

        <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            New processing
          </h2>
          <label
            className={`block cursor-pointer rounded-xl border-2 border-dashed border-zinc-300 p-12 text-center transition hover:border-blue-500 hover:bg-blue-50 ${
              uploading ? "opacity-50" : ""
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
            <Upload className="mx-auto mb-4 h-12 w-12 text-zinc-400" />
            <p className="font-medium text-zinc-700">
              {uploading
                ? "Processing…"
                : "Drag an image or click to select"}
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              JPG, PNG, WebP • 1 credit per image
            </p>
          </label>
        </div>

        <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            Recent history
        </h2>

        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center text-zinc-500">
            <ImageIcon className="mx-auto mb-4 h-12 w-12 text-zinc-300" />
            <p>No images processed yet</p>
            <p className="mt-2 text-sm">
              Upload your first photo to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
              >
                <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-t-xl bg-white">
                  {job.processed_path ? (
                    <img
                      src={getProcessedUrl(job.processed_path)}
                      alt="Result"
                      className="max-h-full max-w-full object-contain bg-white"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-zinc-400">
                      Processing…
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        job.status === "done"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {job.status === "done" ? "Done" : "In progress"}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {job.status === "done" && job.processed_path && (
                    <a
                      href={getProcessedUrl(job.processed_path)}
                      download
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="mb-4 mt-12 text-lg font-semibold text-zinc-900">
          Invoices & receipts
        </h2>
        {invoices.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-zinc-500">
            <FileText className="mx-auto mb-3 h-10 w-10 text-zinc-300" />
            <p>No invoices yet</p>
            <p className="mt-1 text-sm">
              Your receipts will appear here after a purchase.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="px-6 py-3 font-medium text-zinc-700">Date</th>
                  <th className="px-6 py-3 font-medium text-zinc-700">Amount</th>
                  <th className="px-6 py-3 font-medium text-zinc-700">Plan</th>
                  <th className="px-6 py-3 font-medium text-zinc-700">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-zinc-100 hover:bg-zinc-50"
                  >
                    <td className="px-6 py-3 text-zinc-600">{inv.date}</td>
                    <td className="px-6 py-3 font-medium text-zinc-900">
                      {inv.currency === "USD"
                        ? `$${inv.amount.toFixed(2)}`
                        : `€${inv.amount.toFixed(2)}`}
                    </td>
                    <td className="px-6 py-3 text-zinc-600 capitalize">
                      {inv.plan}
                    </td>
                    <td className="px-6 py-3">
                      {inv.receipt_url ? (
                        <a
                          href={inv.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          View receipt
                        </a>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50">
          <p className="text-zinc-500">Loading…</p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
