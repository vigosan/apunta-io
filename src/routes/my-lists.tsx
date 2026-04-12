import { createFileRoute, Link } from "@tanstack/react-router";
import { useMyLists } from "@/hooks/useList";
import { AppNav } from "@/components/AppNav";

export const Route = createFileRoute("/my-lists")({
  component: MyListsPage,
});

function MyListsPage() {
  const { data: lists = [], isLoading } = useMyLists();

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      <AppNav />

      <div className="flex-1 w-full max-w-xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Mis listas</h1>

        {isLoading && (
          <div className="space-y-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}
        {!isLoading && lists.length === 0 && (
          <p className="text-sm text-gray-400 py-10 text-center">Aún no tienes listas.</p>
        )}
        {!isLoading && lists.length > 0 && (
          <div>
            {lists.map((list) => (
              <Link
                key={list.id}
                to="/lists/$listId"
                params={{ listId: list.slug ?? list.id }}
                className="flex items-center justify-between py-3 px-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg transition-colors duration-150 group"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{list.name}</p>
                  {list.description && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">{list.description}</p>
                  )}
                </div>
                <span className="shrink-0 text-gray-300 text-xs ml-3 group-hover:text-gray-500 transition-colors duration-150">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
