import { useState } from "react";
import type { Item } from "@/hooks/useItems";

interface Props {
  item: Item;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (text: string) => void;
}

export function ItemRow({ item, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(item.text);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = text.trim();
    if (trimmed && trimmed !== item.text) onEdit(trimmed);
    setEditing(false);
  }

  return (
    <div
      data-testid={`item-row-${item.id}`}
      className="group flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
    >
      <button
        onClick={onToggle}
        data-testid={`item-checkbox-${item.id}`}
        className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          item.done
            ? "bg-indigo-500 border-indigo-500"
            : "border-gray-300 hover:border-indigo-400"
        }`}
        aria-label={item.done ? "Marcar como pendiente" : "Marcar como hecho"}
      >
        {item.done && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {editing ? (
        <form onSubmit={handleSubmit} className="flex-1">
          <input
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => handleSubmit()}
            data-testid={`item-edit-input-${item.id}`}
            className="w-full text-sm text-gray-900 outline-none bg-transparent"
          />
        </form>
      ) : (
        <span
          data-testid={`item-text-${item.id}`}
          onDoubleClick={() => !item.done && setEditing(true)}
          className={`flex-1 text-sm transition-colors ${
            item.done ? "line-through text-gray-400" : "text-gray-800"
          }`}
        >
          {item.text}
        </span>
      )}

      <button
        onClick={onDelete}
        data-testid={`item-delete-${item.id}`}
        className="shrink-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all"
        aria-label="Eliminar"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
