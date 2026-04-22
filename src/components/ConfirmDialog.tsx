import { useEffect, useRef } from "react";

interface Props {
  open: boolean;
  title: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      const rafId = requestAnimationFrame(() => cancelRef.current?.focus());
      return () => cancelAnimationFrame(rafId);
    }
  }, [open]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onCancel();
    if (e.key === "Tab") {
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        "button"
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  if (!open) return null;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: backdrop overlay dismisses on click
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={dialogRef}
        className="relative w-full max-w-xs bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {title}
        </p>
        <div className="flex gap-2 justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="cursor-pointer px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-xl hover:border-gray-900 hover:text-gray-900 dark:hover:border-gray-400 dark:hover:text-gray-100 transition active:scale-[0.96]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="cursor-pointer px-3 py-1.5 text-sm bg-gray-900 text-white rounded-xl hover:bg-black dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white transition active:scale-[0.96]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
