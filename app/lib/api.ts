export const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("pronto_token");
}

export function setToken(token: string) {
  localStorage.setItem("pronto_token", token);
}

export function clearToken() {
  localStorage.removeItem("pronto_token");
}

export async function api(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as any)
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers, cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error?.message || json?.error || "Erro na API");
  return json;
}
