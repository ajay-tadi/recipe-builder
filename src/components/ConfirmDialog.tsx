import { Trash2, X } from "lucide-react";
export default function ConfirmDialog({
  onCancel,
  onConfirm,
  busy = false,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  busy?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-stone-950/50 px-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
        className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
      >
        <div className="flex justify-between">
          <span className="grid size-12 place-items-center rounded-xl bg-red-50 text-red-600">
            <Trash2 />
          </span>
          <button
            aria-label="Close dialog"
            onClick={onCancel}
            className="self-start rounded-lg p-2 hover:bg-stone-100"
          >
            <X size={18} />
          </button>
        </div>
        <h2 id="delete-title" className="mt-5 font-display text-3xl">
          Delete this recipe?
        </h2>
        <p
          id="delete-description"
          className="mt-2 text-sm leading-relaxed text-stone-500"
        >
          This recipe will be permanently removed from your collection. This
          action cannot be undone.
        </p>
        <div className="mt-7 flex justify-end gap-3">
          <button className="btn-light" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button
            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Deleting..." : "Delete recipe"}
          </button>
        </div>
      </div>
    </div>
  );
}
