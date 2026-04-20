import { useEffect, useMemo, useRef, useState } from "react";
import type { Item } from "@/db/schema";
import { parseItemText } from "@/lib/item-text";
import { getPartialPlace, parsePlaces } from "@/lib/places";
import { getPartialTag, parseTags } from "@/lib/tags";

const REORDER_DELAY_MS = 600;

interface Options {
  items: Item[];
  itemsLoading: boolean;
  statusFilter: "all" | "pending" | "done" | undefined;
  activeTag: string | undefined;
  activePlace?: string;
  searchQuery: string;
  newItemText: string;
}

export function useItemsFilter({
  items,
  itemsLoading,
  statusFilter,
  activeTag,
  activePlace,
  searchQuery,
  newItemText,
}: Options) {
  const [sortedIds, setSortedIds] = useState<string[] | null>(null);
  const initializedRef = useRef(false);
  const reorderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Delayed snapshot of items used for ordering — only updated after REORDER_DELAY_MS
  const [delayedItems, setDelayedItems] = useState<Item[]>(items);

  useEffect(() => {
    if (itemsLoading) return;
    if (reorderTimerRef.current) clearTimeout(reorderTimerRef.current);
    reorderTimerRef.current = setTimeout(
      () => setDelayedItems(items),
      REORDER_DELAY_MS
    );
    return () => {
      if (reorderTimerRef.current) clearTimeout(reorderTimerRef.current);
    };
  }, [items, itemsLoading]);

  const stableItems = useMemo(() => {
    if (itemsLoading) return items;
    let ids = sortedIds;
    if (ids === null && delayedItems.length > 0 && !initializedRef.current) {
      ids = [...delayedItems]
        .sort((a, b) => Number(a.done) - Number(b.done))
        .map((i) => i.id);
      initializedRef.current = true;
      setSortedIds(ids);
    }
    if (!ids) return items;
    // Order by sortedIds but use live items for done state
    const liveById = new Map(items.map((i) => [i.id, i]));
    const delayedById = new Map(delayedItems.map((i) => [i.id, i]));
    const sortedSet = new Set(ids);
    const inOrder = ids.flatMap((id) => {
      // biome-ignore lint/style/noNonNullAssertion: id presence verified by has() check
      return liveById.has(id) ? [liveById.get(id)!] : [];
    });
    const newItems = items.filter((i) => !sortedSet.has(i.id));
    const all = [...inOrder, ...newItems];
    // Sort by done state using delayed snapshot so position updates after the delay
    return [
      ...all.filter((i) => !delayedById.get(i.id)?.done),
      ...all.filter((i) => delayedById.get(i.id)?.done),
    ];
  }, [items, delayedItems, itemsLoading, sortedIds]);

  const allTags = useMemo(() => {
    const seen = new Set<string>();
    stableItems.forEach((i) => {
      parseTags(i.text).tags.forEach((t) => {
        seen.add(t);
      });
    });
    return [...seen].sort();
  }, [stableItems]);

  const allPlaces = useMemo(() => {
    const seen = new Set<string>();
    stableItems.forEach((i) => {
      parsePlaces(i.text).places.forEach((p) => {
        seen.add(p);
      });
    });
    return [...seen].sort();
  }, [stableItems]);

  const partialTag = useMemo(() => getPartialTag(newItemText), [newItemText]);
  const partialPlace = useMemo(
    () => getPartialPlace(newItemText),
    [newItemText]
  );

  const tagSuggestions = useMemo(
    () =>
      partialTag !== null
        ? allTags.filter((t) => t.startsWith(partialTag))
        : [],
    [partialTag, allTags]
  );

  const placeSuggestions = useMemo(
    () =>
      partialPlace !== null
        ? allPlaces.filter((p) =>
            p.toLowerCase().startsWith(partialPlace.toLowerCase())
          )
        : [],
    [partialPlace, allPlaces]
  );

  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredItems = useMemo(
    () =>
      stableItems
        .filter(
          (i) =>
            !statusFilter ||
            statusFilter === "all" ||
            (statusFilter === "pending" ? !i.done : i.done)
        )
        .filter((i) => !activeTag || parseTags(i.text).tags.includes(activeTag))
        .filter(
          (i) =>
            !activePlace || parseItemText(i.text).places.includes(activePlace)
        )
        .filter(
          (i) =>
            !normalizedSearch || i.text.toLowerCase().includes(normalizedSearch)
        ),
    [stableItems, statusFilter, activeTag, activePlace, normalizedSearch]
  );

  function resetOrder() {
    initializedRef.current = false;
    setSortedIds(null);
  }

  function setOrder(ids: string[]) {
    setSortedIds(ids);
  }

  return {
    stableItems,
    allTags,
    allPlaces,
    partialTag,
    partialPlace,
    tagSuggestions,
    placeSuggestions,
    filteredItems,
    resetOrder,
    setOrder,
  };
}
