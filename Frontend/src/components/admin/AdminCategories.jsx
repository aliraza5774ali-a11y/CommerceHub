import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Check,
  FolderTree,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { api } from "../../api/commerceApi";
import { getApiErrorMessage } from "../../api/apiError";
import SectionHeader from "../SectionHeader";

const errorText = (error) => getApiErrorMessage(error);

// Defensive field readers — mirrors the pattern used across admin pages so we
// don't assume one exact response shape.
const pick = (obj, keys, fallback = undefined) => {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return fallback;
};

function categoryFields(c) {
  const id = pick(c, ["id", "_id", "categoryId"]);
  const parentId = pick(c, ["parentId", "parent_id"], null);
  const name = pick(c, ["name"], "Untitled category");
  const slug = pick(c, ["slug"], "");
  const active = pick(c, ["active"], true);
  const version = pick(c, ["version"]);
  return { id, parentId, name, slug, active, version, raw: c };
}

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function StatusPill({ active }) {
  if (active) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-700">
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-black/15 bg-black/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-black/50">
      Inactive
    </span>
  );
}

export default function AdminCategories() {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const [refreshKey, setRefreshKey] = useState(0);
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [rowBusy, setRowBusy] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .categories()
      .then((data) => !cancelled && setState({ loading: false, data, error: null }))
      .catch((e) => !cancelled && setState({ loading: false, data: null, error: errorText(e) }));
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const list = useMemo(() => {
    const arr = Array.isArray(state.data) ? state.data : Array.isArray(state.data?.items) ? state.data.items : [];
    return arr.map(categoryFields);
  }, [state.data]);

  const byId = useMemo(() => new Map(list.map((c) => [String(c.id), c])), [list]);

  const filtered = useMemo(() => {
    if (!query.trim()) return list;
    const q = query.trim().toLowerCase();
    return list.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
  }, [list, query]);

  const refresh = () => {
    setState((state) => ({ ...state, loading: true, error: null }));
    setRefreshKey((key) => key + 1);
  };

  const handleToggleActive = async (category) => {
    if (!category.id) return;
    setRowBusy(category.id);
    try {
      await api.updateCategory(category.id, {
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
        active: !category.active,
        version: category.version,
      });
      setToast({ type: "success", message: `${category.name} ${category.active ? "deactivated" : "activated"}.` });
      refresh();
    } catch (e) {
      setToast({ type: "error", message: errorText(e) });
    } finally {
      setRowBusy(null);
    }
  };

  const handleDelete = async (category) => {
    if (!category.id) return;
    setRowBusy(category.id);
    try {
      await api.deleteCategory(category.id);
      setToast({ type: "success", message: `${category.name} deleted.` });
      refresh();
    } catch (e) {
      setToast({ type: "error", message: errorText(e) });
    } finally {
      setRowBusy(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        badge="Admin"
        icon={<FolderTree size={12} strokeWidth={2} />}
        heading="Categories"
        ctaLabel="New category"
        ctaOnClick={() => {
          setEditingCategory(null);
          setFormOpen(true);
        }}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories…"
            className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-accent-dark focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <button
          onClick={refresh}
          className="inline-flex w-fit items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-black/60 transition hover:border-black/20 hover:text-black"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {state.loading && <CategoriesSkeleton />}

      {!state.loading && state.error && <ErrorBlock message={state.error} onRetry={refresh} />}

      {!state.loading && !state.error && list.length === 0 && (
        <EmptyBlock
          title="No categories yet"
          description="Organize your products into categories and collections your customers can browse."
          actionLabel="Add your first category"
          onAction={() => {
            setEditingCategory(null);
            setFormOpen(true);
          }}
        />
      )}

      {!state.loading && !state.error && list.length > 0 && filtered.length === 0 && (
        <EmptyBlock title="No matches" description={`Nothing matches "${query}".`} />
      )}

      {!state.loading && !state.error && filtered.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/10 bg-[#f8f8f8] font-mono text-[10px] uppercase tracking-[0.14em] text-black/45">
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Parent</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id ?? c.name} className="border-b border-black/5 last:border-0 hover:bg-[#f8f8f8]/60">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-black">{c.name}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-black/40">/{c.slug}</p>
                    </td>
                    <td className="px-5 py-3.5 text-black/70">
                      {c.parentId ? byId.get(String(c.parentId))?.name || `#${c.parentId}` : <span className="text-black/35">Top level</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusPill active={c.active} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingCategory(c);
                            setFormOpen(true);
                          }}
                          className="rounded-full border border-black/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-black/60 transition hover:border-black/25 hover:text-black"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleActive(c)}
                          disabled={rowBusy === c.id}
                          className="inline-flex items-center gap-1 rounded-full border border-black/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-black/60 transition hover:border-black/25 hover:text-black disabled:opacity-50"
                        >
                          {rowBusy === c.id ? <Loader2 size={11} className="animate-spin" /> : null}
                          {c.active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDelete(c)}
                          disabled={rowBusy === c.id}
                          className="rounded-full border border-red-200 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-red-600 transition hover:border-red-300 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {formOpen && (
          <CategoryFormModal
            category={editingCategory}
            categories={list}
            onClose={() => setFormOpen(false)}
            onSaved={(message) => {
              setFormOpen(false);
              setToast({ type: "success", message });
              refresh();
            }}
            onError={(message) => setToast({ type: "error", message })}
          />
        )}
      </AnimatePresence>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

function CategoryFormModal({ category, categories, onClose, onSaved, onError }) {
  const isEdit = Boolean(category?.id);
  const [name, setName] = useState(category?.name && category.name !== "Untitled category" ? category.name : "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [slugEdited, setSlugEdited] = useState(Boolean(category?.slug));
  const [parentId, setParentId] = useState(category?.parentId ? String(category.parentId) : "");
  const [active, setActive] = useState(category ? Boolean(category.active) : true);
  const [submitting, setSubmitting] = useState(false);

  const parentOptions = categories.filter((c) => c.id !== category?.id);

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    const normalizedSlug = slugify(slug || name);
    if (!name.trim() || !normalizedSlug) {
      onError("Enter a category name and a URL handle.");
      return;
    }
    setSubmitting(true);
    const input = {
      name: name.trim(),
      slug: normalizedSlug,
      parentId: parentId ? Number(parentId) : null,
      active,
      ...(isEdit ? { version: category.version } : {}),
    };
    try {
      if (isEdit) {
        await api.updateCategory(category.id, input);
        onSaved(`${name.trim()} updated.`);
      } else {
        await api.createCategory(input);
        onSaved(`${name.trim()} created.`);
      }
    } catch (e2) {
      onError(errorText(e2));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell onClose={onClose} title={isEdit ? "Edit category" : "New category"} icon={<FolderTree size={15} strokeWidth={1.75} />}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Category name">
          <input
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugEdited) setSlug(slugify(e.target.value));
            }}
            className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm outline-none transition focus:border-accent-dark focus:ring-2 focus:ring-accent/30"
            placeholder="e.g. Outerwear"
          />
        </Field>
        <Field label="URL handle">
          <input
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugEdited(true);
            }}
            className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm outline-none transition focus:border-accent-dark focus:ring-2 focus:ring-accent/30"
            placeholder="e.g. outerwear"
          />
          <span className="mt-1 block text-xs text-black/45">Lowercase letters, numbers, and hyphens only.</span>
        </Field>
        <Field label="Parent category (optional)">
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-accent-dark focus:ring-2 focus:ring-accent/30"
          >
            <option value="">Top level</option>
            {parentOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>

        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-black/10 bg-[#f8f8f8] px-4 py-3">
          <span>
            <span className="block text-sm font-medium text-black">Active</span>
            <span className="block text-xs text-black/50">Show this category on your storefront.</span>
          </span>
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="peer sr-only" />
          <span
            aria-hidden="true"
            className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-black/15 transition-colors duration-200 peer-checked:bg-accent"
          >
            <span className="inline-block h-[18px] w-[18px] translate-x-[3px] transform rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-[22px]" />
          </span>
        </label>

        <div className="mt-2 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm text-black/55 hover:text-black">
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition hover:bg-accent-dark disabled:opacity-60"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {isEdit ? "Save changes" : "Create category"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function ModalShell({ title, icon, onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="flex items-center gap-2.5 font-display text-lg font-semibold text-black">
            {icon && (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink">
                {icon}
              </span>
            )}
            {title}
          </h3>
          <button onClick={onClose} className="rounded-full p-1.5 text-black/40 hover:bg-black/5 hover:text-black">
            <X size={16} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.1em] text-black/45">{label}</span>
      {children}
    </label>
  );
}

function ErrorBlock({ message, onRetry }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-6">
      <div className="flex items-center gap-3 text-red-700">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle size={16} />
        </span>
        <p className="font-medium">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
      >
        <RefreshCw size={14} />
        Try again
      </button>
    </div>
  );
}

function EmptyBlock({ title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-black/15 bg-white p-8">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent-ink">
        <FolderTree size={16} strokeWidth={1.75} />
      </span>
      <p className="font-display text-lg font-semibold text-black">{title}</p>
      <p className="max-w-md text-sm text-black/55">{description}</p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition hover:bg-accent-dark"
        >
          <Plus size={14} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-black/5 px-5 py-4 last:border-0">
          <div className="h-4 w-40 animate-pulse rounded bg-black/10" />
          <div className="h-4 w-16 animate-pulse rounded bg-black/10" />
          <div className="ml-auto h-6 w-20 animate-pulse rounded-full bg-black/10" />
        </div>
      ))}
    </div>
  );
}

function Toast({ toast, onDismiss }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-3 text-sm shadow-lg ${
            toast.type === "error" ? "bg-red-600 text-white" : "bg-black text-white"
          }`}
        >
          {toast.type === "error" ? <AlertTriangle size={15} /> : <Check size={15} />}
          {toast.message}
          <button onClick={onDismiss} className="ml-1 text-white/70 hover:text-white">
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
