import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import type { List } from "@/db/schema";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const createList = useMutation({
    mutationFn: (listName: string) =>
      apiClient<List>("/api/lists", { method: "POST", body: JSON.stringify({ name: listName }) }),
    onSuccess: (list) => navigate({ to: "/lists/$listId", params: { listId: list.id } }),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) createList.mutate(trimmed);
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-950">Todo</h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Crea una lista, comparte el enlace.<br />Todos pueden añadir, editar y marcar cosas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="¿Cómo se llama tu lista?"
            data-testid="list-name-input"
            className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all placeholder-gray-300"
          />
          <button
            type="submit"
            disabled={!name.trim() || createList.isPending}
            data-testid="create-list-btn"
            className="w-full px-4 py-3 text-sm font-medium bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {createList.isPending ? "Creando…" : "Crear lista →"}
          </button>
        </form>
      </div>
    </div>
  );
}
