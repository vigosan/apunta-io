export interface ApiError extends Error {
  response: Response;
}

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!res.ok) {
    const body: unknown = await res.json().catch(() => ({}));
    let message = res.statusText;
    if (typeof body === "object" && body !== null && "error" in body) {
      const { error } = body as { error: unknown };
      if (typeof error === "string") message = error;
    }
    const err = Object.assign(new Error(message), { response: res }) as ApiError;
    throw err;
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
