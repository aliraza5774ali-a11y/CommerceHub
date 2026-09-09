import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Boxes,
  Check,
  Loader2,
  Package,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { api } from "../../api/commerceApi";
import { getApiErrorMessage } from "../../api/apiError";
import SectionHeader from "../SectionHeader";

const errorText = (error) => getApiErrorMessage(error);

// Defensive field readers — the exact shape of a product record isn't
// documented, so we read common aliases instead of assuming one schema.
const pick = (obj, keys, fallback = undefined) => {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return fallback;
};

function productFields(p) {
  const id = pick(p, ["id", "_id", "productId"]);
  const name = pick(p, ["name", "title"], "Untitled product");
  const priceRaw = pick(p, ["price", "basePrice", "amount"]);
  const price = typeof priceRaw === "number" ? priceRaw : null;
  const currency = pick(p, ["currency", "currencyCode"], "USD");
  const status = pick(p, ["status", "state"]);
  const published = pick(p, ["published", "isPublished"], status ? String(status).toLowerCase() === "published" : false);
  const stockRaw = pick(p, ["stock", "quantity", "inventoryCount", "stockCount"]);
  const stock = typeof stockRaw === "number" ? stockRaw : null;
  const sku = pick(p, ["sku"]);
  return { id, name, price, currency, status, published, stock, sku, raw: p };
}

function formatMoney(value, currency = "USD") {
  if (typeof value !== "number") return "—";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function StatusPill({ published, status }) {
  if (published) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-700">
        Published
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-[#f8f8f8] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-black/55">
      {status || "Draft"}
    </span>
  );
}

export default function AdminProducts() {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const [refreshKey, setRefreshKey] = useState(0);
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [inventoryFor, setInventoryFor] = useState(null);
  const [rowBusy, setRowBusy] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .products()
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
    return arr.map(productFields);
  }, [state.data]);

  const filtered = useMemo(() => {
    if (!query.trim()) return list;
    const q = query.trim().toLowerCase();
    return list.filter((p) => p.name.toLowerCase().includes(q) || (p.sku || "").toLowerCase().includes(q));
  }, [list, query]);

  const refresh = () => {
    setState((state) => ({ ...state, loading: true, error: null }));
    setRefreshKey((key) => key + 1);
  };

  const handlePublish = async (product) => {
    if (!product.id) return;
    setRowBusy(product.id);
    try {
      await api.publishProduct(product.id);
      setToast({ type: "success", message: `${product.name} published.` });
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
        icon={<Package size={12} strokeWidth={2} />}
        heading="Products"
        ctaLabel="New product"
        ctaOnClick={() => {
          setEditingProduct(null);
          setFormOpen(true);
        }}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-black/30"
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

      {state.loading && <ProductsSkeleton />}

      {!state.loading && state.error && (
        <ErrorBlock message={state.error} onRetry={refresh} />
      )}

      {!state.loading && !state.error && list.length === 0 && (
        <EmptyBlock
          title="No products yet"
          description="Products you create will show up here, ready to publish to your storefront."
          actionLabel="Add your first product"
          onAction={() => {
            setEditingProduct(null);
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
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Stock</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id ?? p.name} className="border-b border-black/5 last:border-0 hover:bg-[#f8f8f8]/60">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-black">{p.name}</p>
                      {p.sku && <p className="mt-0.5 font-mono text-[11px] text-black/40">SKU {p.sku}</p>}
                    </td>
                    <td className="px-5 py-3.5 font-price text-black/80">{formatMoney(p.price, p.currency)}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setInventoryFor(p)}
                        className="font-price text-black/80 underline decoration-black/20 underline-offset-2 hover:decoration-black/50"
                      >
                        {p.stock === null ? "View" : p.stock}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusPill published={p.published} status={p.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setFormOpen(true);
                          }}
                          className="rounded-full border border-black/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-black/60 transition hover:border-black/25 hover:text-black"
                        >
                          Edit
                        </button>
                        {!p.published && (
                          <button
                            onClick={() => handlePublish(p)}
                            disabled={rowBusy === p.id}
                            className="inline-flex items-center gap-1 rounded-full bg-black px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-white transition hover:bg-neutral-800 disabled:opacity-50"
                          >
                            {rowBusy === p.id ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                            Publish
                          </button>
                        )}
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
          <ProductFormModal
            product={editingProduct}
            onClose={() => setFormOpen(false)}
            onSaved={(message) => {
              setFormOpen(false);
              setToast({ type: "success", message });
              refresh();
            }}
            onError={(message) => setToast({ type: "error", message })}
          />
        )}
        {inventoryFor && (
          <InventoryModal
            product={inventoryFor}
            onClose={() => setInventoryFor(null)}
            onAdjusted={(message) => {
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

function ProductFormModal({ product, onClose, onSaved, onError }) {
  const isEdit = Boolean(product?.id);
  const [name, setName] = useState(product?.name && product.name !== "Untitled product" ? product.name : "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const input = {
      name: name.trim(),
      ...(price !== "" ? { price: Number(price) } : {}),
      ...(sku.trim() ? { sku: sku.trim() } : {}),
    };
    try {
      if (isEdit) {
        await api.updateProduct(product.id, input);
        onSaved(`${name.trim()} updated.`);
      } else {
        await api.createProduct(input);
        onSaved(`${name.trim()} created.`);
      }
    } catch (e2) {
      onError(errorText(e2));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell onClose={onClose} title={isEdit ? "Edit product" : "New product"}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Product name">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm outline-none transition focus:border-black/40"
            placeholder="e.g. Wool Overcoat"
          />
        </Field>
        <Field label="Price (optional)">
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm outline-none transition focus:border-black/40"
            placeholder="0.00"
          />
        </Field>
        <Field label="SKU (optional)">
          <input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm outline-none transition focus:border-black/40"
            placeholder="e.g. WOL-100"
          />
        </Field>
        <div className="mt-2 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm text-black/55 hover:text-black">
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {isEdit ? "Save changes" : "Create product"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function InventoryModal({ product, onClose, onAdjusted, onError }) {
  const [state, setState] = useState(() => ({
    loading: Boolean(product.id),
    data: null,
    error: product.id ? null : "This product has no ID to look up inventory for.",
  }));
  const [delta, setDelta] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!product.id) return undefined;
    api
      .inventory(product.id)
      .then((data) => !cancelled && setState({ loading: false, data, error: null }))
      .catch((e) => !cancelled && setState({ loading: false, data: null, error: errorText(e) }));
    return () => {
      cancelled = true;
    };
  }, [product.id]);

  const currentStock = pick(state.data || {}, ["stock", "quantity", "available", "onHand"]);

  const submit = async (e) => {
    e.preventDefault();
    if (!delta || submitting) return;
    setSubmitting(true);
    try {
      await api.adjustInventory(product.id, { delta: Number(delta), reason: reason.trim() || undefined });
      onAdjusted(`Inventory for ${product.name} adjusted by ${delta}.`);
      onClose();
    } catch (e2) {
      onError(errorText(e2));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell onClose={onClose} title={`Inventory — ${product.name}`} icon={<Boxes size={16} />}>
      {state.loading && (
        <div className="flex items-center gap-2 py-6 text-sm text-black/50">
          <Loader2 size={16} className="animate-spin" /> Loading inventory…
        </div>
      )}
      {!state.loading && state.error && <p className="py-4 text-sm text-red-700">{state.error}</p>}
      {!state.loading && !state.error && (
        <>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-black/40">Current stock</p>
          <p className="mt-1 font-price text-2xl font-medium text-black">
            {typeof currentStock === "number" ? currentStock : product.stock ?? "—"}
          </p>
          <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
            <Field label="Adjustment (use a negative number to reduce stock)">
              <input
                required
                type="number"
                value={delta}
                onChange={(e) => setDelta(e.target.value)}
                className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm outline-none transition focus:border-black/40"
                placeholder="e.g. 10 or -5"
              />
            </Field>
            <Field label="Reason (optional)">
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm outline-none transition focus:border-black/40"
                placeholder="e.g. Restock, damaged goods"
              />
            </Field>
            <div className="mt-1 flex items-center justify-end gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm text-black/55 hover:text-black">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                Apply adjustment
              </button>
            </div>
          </form>
        </>
      )}
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
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-black">
            {icon}
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
      <div className="flex items-center gap-2 text-red-700">
        <AlertTriangle size={18} />
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
      <p className="font-display text-lg font-semibold text-black">{title}</p>
      <p className="max-w-md text-sm text-black/55">{description}</p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          <Plus size={14} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function ProductsSkeleton() {
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
