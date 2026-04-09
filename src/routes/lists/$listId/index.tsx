import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useItems, useAddItem, useToggleItem, useDeleteItem, useUpdateItem } from "@/hooks/useItems";
import { ItemRow } from "@/components/items/ItemRow";
import type { List } from "@/db/schema";

export const Route = createFileRoute("/lists/$listId/")({
  component: ListDetailPage,
});

function ListDetailPage() {
  const { listId } = Route.useParams();
  const [newItem, setNewItem] = useState("");
  const [copied, setCopied] = useState(false);

  const { data: list } = useQuery({
    queryKey: ["list", listId],
    queryFn: () => apiClient<List>(`/api/lists/${listId}`),
  });

  const { data: items = [] } = useItems(listId);
  const addItem = useAddItem(listId);
  const toggleItem = useToggleItem(listId);
  const deleteItem = useDeleteItem(listId);
  const updateItem = useUpdateItem(listId);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newItem.trim();
    if (!trimmed) return;
    addItem.mutate({ text: trimmed }, { onSuccess: () => setNewItem("") });
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const doneCount = items.filter((i) => i.done).length;
  const progress = items.length > 0 ? (doneCount / items.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="bg-white border-b border-gray-100 px-6 py-5 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-gray-950 truncate">{list?.name ?? "…"}</h1>
            {items.length > 0 && (
              <p className="text-xs text-gray-400 mt-0.5">{doneCount} de {items.length} completados</p>
            )}
          </div>
          <button
            onClick={handleShare}
            data-testid="share-btn"
            className="shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            {copied ? (
              <>
                <span>✓</span> Copiado
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Compartir
              </>
            )}
          </button>
        </div>

        {items.length > 0 && (
          <div className="max-w-lg mx-auto mt-3">
            <div className="h-0.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </header>

      <main className="max-w-lg mx-auto px-6 py-6">
        {items.length === 0 && (
          <p className="text-sm text-gray-400 py-8 text-center">Añade el primer elemento a tu lista.</p>
        )}

        <div className="space-y-1">
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onToggle={() => toggleItem.mutate(item.id)}
              onDelete={() => deleteItem.mutate(item.id)}
              onEdit={(text) => updateItem.mutate({ id: item.id, text })}
            />
          ))}
        </div>

        <form onSubmit={handleAdd} className="flex gap-3 mt-6">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Añadir elemento…"
            data-testid="add-item-input"
            className="flex-1 px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all placeholder-gray-300"
          />
          <button
            type="submit"
            disabled={!newItem.trim() || addItem.isPending}
            data-testid="add-item-submit"
            className="px-4 py-2.5 text-sm font-medium bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-40 transition-colors"
          >
            Añadir
          </button>
        </form>
      </main>
    </div>
  );
}
