const FAL_KEY = process.env.FAL_KEY;
const FAL_BASE = "https://queue.fal.run";

export async function runFalModel<T = unknown>(
  path: string,
  body: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`${FAL_BASE}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${FAL_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`FAL error: ${res.status} ${err}`);
  }
  return res.json() as Promise<T>;
}
