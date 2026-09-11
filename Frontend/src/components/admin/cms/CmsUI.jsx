import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check } from "lucide-react";

export function StatusPill({ status }) {
  const published = status === "PUBLISHED";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
        published
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-amber-200 bg-amber-50 text-amber-700"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${published ? "bg-emerald-500" : "bg-amber-500"}`} />
      {published ? "Published" : "Draft / unpublished changes"}
    </span>
  );
}

export function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm shadow-lg ${
            toast.type === "error" ? "bg-red-600 text-white" : "bg-black text-white"
          }`}
        >
          {toast.type === "error" ? <AlertTriangle size={16} /> : <Check size={16} />}
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Field({ label, value, onChange, placeholder, textarea }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-black/60">{label}</span>
      <Tag
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={textarea ? 3 : undefined}
        className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black/40"
      />
    </label>
  );
}
