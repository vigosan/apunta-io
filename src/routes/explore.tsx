import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useExplore, useCloneList, useExploreItems, useAcceptChallenge } from "@/hooks/useList";
import { useSession, signIn } from "@hono/auth-js/react";
import { AppNav } from "@/components/AppNav";
import type { ExploreItem } from "@/services/lists.service";

export const Route = createFileRoute("/explore")({
  component: ExplorePage,
});

const CARD_ACCENTS = [
  "from-violet-400 to-purple-500",
  "from-blue-400 to-cyan-500",
  "from-emerald-400 to-teal-500",
  "from-orange-400 to-amber-500",
  "from-rose-400 to-pink-500",
  "from-indigo-400 to-blue-500",
  "from-lime-400 to-emerald-500",
  "from-fuchsia-400 to-violet-500",
];

function accentFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return CARD_ACCENTS[hash % CARD_ACCENTS.length];
}

function ExploreListCard({ list, onAccept, onClone, acceptPending, clonePending }: {
  list: ExploreItem;
  onAccept: (id: string) => void;
  onClone: (id: string) => void;
  acceptPending: boolean;
  clonePending: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const { data: session } = useSession();
  const { data: exploreItems, isLoading: itemsLoading } = useExploreItems(list.id, expanded);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
      {list.coverUrl ? (
        <img src={list.coverUrl} alt="" className="w-full h-28 object-cover" />
      ) : (
        <div className={`h-1.5 bg-gradient-to-r ${accentFor(list.id)}`} />
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {list.ownerImage && (
            <img src={list.ownerImage} alt="" className="w-8 h-8 rounded-full shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-snug">{list.name}</p>
            {list.description && (
              <p className="text-sm text-gray-500 mt-1 leading-snug line-clamp-2">{list.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3">
          <span className="inline-flex items-center gap-1 text-xs text-gray-400 tabular-nums">
            <span className="text-gray-300">☰</span>
            {list.itemCount} {list.itemCount === 1 ? "elemento" : "elementos"}
          </span>
          {list.participantCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-400 tabular-nums">
              <span className="text-gray-300">◎</span>
              {list.participantCount} {list.participantCount === 1 ? "retando" : "retando"}
            </span>
          )}
          {list.completedCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-400 tabular-nums">
              <span className="text-gray-300">✓</span>
              {list.completedCount} {list.completedCount === 1 ? "completado" : "completados"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => {
              if (session?.user) {
                onAccept(list.id);
              } else {
                signIn("google");
              }
            }}
            disabled={acceptPending}
            data-testid={`accept-btn-${list.id}`}
            className="flex-1 px-3 py-2 text-xs font-medium bg-gray-900 text-white rounded-xl hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-[0.97]"
          >
            {session?.user ? "Aceptar el reto" : "Iniciar sesión"}
          </button>
          <button
            onClick={() => onClone(list.id)}
            disabled={clonePending}
            data-testid={`clone-btn-${list.id}`}
            className="px-3 py-2 text-xs font-medium border border-gray-200 text-gray-500 rounded-xl hover:border-gray-900 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-[0.97]"
          >
            Copiar lista
          </button>
          <button
            onClick={() => setExpanded((v) => !v)}
            data-testid={`expand-btn-${list.id}`}
            className="px-3 py-2 text-xs text-gray-400 border border-gray-100 rounded-xl hover:border-gray-300 hover:text-gray-600 transition"
          >
            {expanded ? "▲" : "▼"}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-50">
            {itemsLoading && (
              <p className="text-xs text-gray-400 py-1">Cargando…</p>
            )}
            {!itemsLoading && exploreItems && (
              <ul className="space-y-1.5">
                {exploreItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className={`w-3.5 h-3.5 rounded border shrink-0 ${item.done ? "bg-gray-200 border-gray-200" : "border-gray-300"}`} />
                    <span className={item.done ? "line-through text-gray-400" : ""}>{item.text}</span>
                  </li>
                ))}
                {exploreItems.length === 0 && (
                  <p className="text-xs text-gray-300">Sin elementos.</p>
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ExplorePage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useExplore(search || undefined);
  const cloneList = useCloneList();
  const acceptChallenge = useAcceptChallenge();

  const lists = data?.pages.flatMap((p) => p.items) ?? [];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(q.trim());
  }

  function handleAccept(listId: string) {
    acceptChallenge.mutate(listId, {
      onSuccess: (list) => navigate({ to: "/lists/$listId", params: { listId: list.id } }),
    });
  }

  function handleClone(listId: string) {
    cloneList.mutate(listId, {
      onSuccess: (list) => navigate({ to: "/lists/$listId", params: { listId: list.id } }),
    });
  }

  return (
    <div className="h-dvh bg-white flex flex-col">
      <AppNav />

      <div className="flex-1 flex flex-col w-full max-w-xl mx-auto overflow-hidden">
        <div className="px-4 pt-6 pb-4 shrink-0">
          <form onSubmit={handleSearch} className="flex gap-2 p-1.5 bg-gray-50 border border-gray-200 rounded-2xl focus-within:border-gray-400 transition-[border-color] duration-150">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar listas…"
              data-testid="explore-search-input"
              className="flex-1 pl-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium bg-gray-900 text-white rounded-xl hover:bg-black transition-[background-color] duration-150 active:scale-[0.96]"
            >
              Buscar
            </button>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {isLoading && (
            <p className="text-sm text-gray-400 text-center py-10">Cargando…</p>
          )}
          {!isLoading && lists.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-10">
              {search ? "No hay listas con ese nombre." : "Aún no hay listas públicas."}
            </p>
          )}
          <div className="flex flex-col gap-3">
            {lists.map((list) => (
              <ExploreListCard
                key={list.id}
                list={list}
                onAccept={handleAccept}
                onClone={handleClone}
                acceptPending={acceptChallenge.isPending}
                clonePending={cloneList.isPending}
              />
            ))}
          </div>

          {hasNextPage && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                data-testid="load-more-btn"
                className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:border-gray-400 hover:text-gray-700 disabled:opacity-40 transition"
              >
                {isFetchingNextPage ? "Cargando…" : "Cargar más"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
