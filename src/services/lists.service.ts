import { apiClient } from "@/lib/api-client";
import type { List } from "@/db/schema";

export type ExploreItem = Pick<List, "id" | "name" | "slug" | "createdAt"> & { itemCount: number };

export const listsService = {
  get: (listId: string) =>
    apiClient<List>(`/api/lists/${listId}`),

  create: (name: string) =>
    apiClient<List>("/api/lists", { method: "POST", body: JSON.stringify({ name }) }),

  update: (listId: string, patch: { name?: string; slug?: string | null; public?: boolean }) =>
    apiClient<List>(`/api/lists/${listId}`, { method: "PATCH", body: JSON.stringify(patch) }),

  explore: (q?: string) =>
    apiClient<ExploreItem[]>(`/api/explore${q ? `?q=${encodeURIComponent(q)}` : ""}`),

  clone: (listId: string) =>
    apiClient<List>(`/api/lists/${listId}/clone`, { method: "POST" }),
};
