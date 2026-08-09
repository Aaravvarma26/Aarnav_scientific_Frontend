const backendUrl = (process.env.BACKEND_URL || "https://api.aarnavscientific.co.in").replace(/\/$/, "");

export function getBackendUrl() {
  return backendUrl;
}

export async function backendFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(`${backendUrl}${normalizedPath}`, {
    ...init,
    cache: init.cache || "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Backend request failed (${res.status}) ${normalizedPath}${body ? `: ${body}` : ""}`);
  }
  return res.json() as Promise<T>;
}
