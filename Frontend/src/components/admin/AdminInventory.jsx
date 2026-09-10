import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Boxes,
  Check,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Warehouse,
  X,
} from "lucide-react";
import { api } from "../../api/commerceApi";
import { getApiErrorMessage } from "../../api/apiError";
import SectionHeader from "../SectionHeader";

const errorText = (error) => getApiErrorMessage(error);

const pick = (obj, keys, fallback = undefined) => {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return fallback;
};

function stockFields(row) {
  const productId = pick(row, ["productId", "id"]);
  const name = pick(row, ["name", "title"], "Untitled product");
  const sku = pick(row, ["sku"]);
  const status = pick(row, ["status"]);
  const quantityRaw = pick(row, ["quantity"]);
  const quantity = typeof quantityRaw === "number" ? quantityRaw : null;
  const reservedRaw = pick(row, ["reservedQuantity"]);
  const reserved = typeof reservedRaw === "number" ? reservedRaw : 0;
  const version = pick(row, ["version"]);
  return { productId, name, sku, status, quantity, reserved, version, raw: row };
}

function warehouseFields(w) {
  const id = pick(w, ["id"]);
  const name = pick(w, ["name"], "Untitled warehouse");
  const address = pick(w, ["address"]);
  const active = pick(w, ["active"], true);
  const version = pick(w, ["version"]);
  return { id, name, address, active, version, raw: w };
}

function StockPill({ quantity, reserved }) {
  if (quantity === null) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-black/15 bg-black/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-black/50">
        Not tracked
      </span>
    );
  }
  const available = quantity - reserved;
  if (available <= 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-red-700">
        Out of stock
      </span>
    );
  }
  if (available <= 5) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-accent-ink">
        Low stock
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-700">
      In stock
    </span>
  );
}

export default function AdminInventory() {
  const [tab, setTab] = useState("stock"); // "stock" | "warehouses"

  const [stockState, setStockState] = useState({ loading: true, data: null, error: null });
  const [stockRefreshKey, setStockRefreshKey] = useState(0);
  const [query, setQuery] = useState("");
  const [adjustingFor, setAdjustingFor] = useState(null);

  const [warehouseState, setWarehouseState] = useState({ loading: true, data: null, error: null });
  const [warehouseRefreshKey, setWarehouseRefreshKey] = useState(0);
  const [warehouseFormOpen, setWarehouseFormOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [rowBusy, setRowBusy] = useState(null);

  const [toast, setToast] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .inventoryList()
      .then((data) => !cancelled && setStockState({ loading: false, data, error: null }))
      .catch((e) => !cancelled && setStockState({ loading: false, data: null, error: errorText(e) }));
    return () => {
      cancelled = true;
    };
  }, [stockRefreshKey]);

  useEffect(() => {
    let cancelled = false;
    api
      .warehouses()
      .then((data) => !cancelled && setWarehouseState({ loading: false, data, error: null }))
      .catch((e) => !cancelled && setWarehouseState({ loading: false, data: null, error: errorText(e) }));
    return () => {
      cancelled = true;
    };
  }, [warehouseRefreshKey]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const stockList = useMemo(() => {
    const arr = Array.isArray(stockState.data) ? stockState.data : Array.isArray(stockState.data?.items) ? stockState.data.items : [];
    return arr.map(stockFields);
  }, [stockState.data]);

  const filteredStock = useMemo(() => {
    if (!query.trim()) return stockList;
    const q = query.trim().toLowerCase();
    return stockList.filter((r) => r.name.toLowerCase().includes(q) || (r.sku || "").toLowerCase().includes(q));
  }, [stockList, query]);

  const warehouseList = useMemo(() => {
    const arr = Array.isArray(warehouseState.data) ? warehouseState.data : Array.isArray(warehouseState.data?.items) ? warehouseState.data.items : [];
    return arr.map(warehouseFields);
  }, [warehouseState.data]);

  const refreshStock = () => {
    setStockState((s) => ({ ...s, loading: true, error: null }));
    setStockRefreshKey((k) => k + 1);
  };
  const refreshWarehouses = () => {
    setWarehouseState((s) => ({ ...s, loading: true, error: null }));
    setWarehouseRefreshKey((k) => k + 1);
  };

  const handleDeleteWarehouse = async (warehouse) => {
    if (!warehouse.id) return;
    setRowBusy(warehouse.id);
    try {
      await api.deleteWarehouse(warehouse.id);
      setToast({ type: "success", message: `${warehouse.name} deleted.` });
      refreshWarehouses();
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
        icon={<Boxes size={12} strokeWidth={2} />}
        heading="Inventory"
        ctaLabel={tab === "warehouses" ? "New warehouse" : undefined}
        ctaOnClick={
          tab === "warehouses"
            ? () => {
                setEditingWarehouse(null);
                setWarehouseFormOpen(true);
              }
            : undefined
        }
      />

      <div className="inline-flex w-fit rounded-full border border-black/10 bg-white p-1">
        {[
          { key: "stock", label: "Stock levels" },
          { key: "warehouses", label: "Warehouses" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition ${
              tab === t.key ? "bg-black text-white" : "text-black/50 hover:text-black"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "stock" && (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/35" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-accent-dark focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <button
              onClick={refreshStock}
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-black/60 transition hover:border-black/20 hover:text-black"
            >
              <RefreshCw size={13} />
              Refresh
            </button>
          </div>

          {stockState.loading && <RowsSkeleton />}
          {!stockState.loading && stockState.error && <ErrorBlock message={stockState.error} onRetry={refreshStock} />}
          {!stockState.loading && !stockState.error && stockList.length === 0 && (
            <EmptyBlock icon={<Boxes size={16} strokeWidth={1.75} />} title="No products yet" description="Add products first — stock levels for each will show up here." />
          )}
          {!stockState.loading && !stockState.error && stockList.length > 0 && filteredStock.length === 0 && (
            <EmptyBlock icon={<Boxes size={16} strokeWidth={1.75} />} title="No matches" description={`Nothing matches "${query}".`} />
          )}
          {!stockState.loading && !stockState.error && filteredStock.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-black/10 bg-[#f8f8f8] font-mono text-[10px] uppercase tracking-[0.14em] text-black/45">
                      <th className="px-5 py-3 font-medium">Product</th>
                      <th className="px-5 py-3 font-medium">On hand</th>
                      <th className="px-5 py-3 font-medium">Reserved</th>
                      <th className="px-5 py-3 font-medium">Available</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStock.map((r) => (
                      <tr key={r.productId ?? r.name} className="border-b border-black/5 last:border-0 hover:bg-[#f8f8f8]/60">
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-black">{r.name}</p>
                          {r.sku && <p className="mt-0.5 font-mono text-[11px] text-black/40">SKU {r.sku}</p>}
                        </td>
                        <td className="px-5 py-3.5 font-price text-black/80">{r.quantity ?? "—"}</td>
                        <td className="px-5 py-3.5 font-price text-black/80">{r.quantity === null ? "—" : r.reserved}</td>
                        <td className="px-5 py-3.5 font-price text-black/80">{r.quantity === null ? "—" : r.quantity - r.reserved}</td>
                        <td className="px-5 py-3.5">
                          <StockPill quantity={r.quantity} reserved={r.reserved} />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => setAdjustingFor(r)}
                              className="rounded-full border border-black/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-black/60 transition hover:border-black/25 hover:text-black"
                            >
                              Adjust
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
        </>
      )}

      {tab === "warehouses" && (
        <>
          <div className="flex justify-end">
            <button
              onClick={refreshWarehouses}
              className="inline-flex w-fit items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-black/60 transition hover:border-black/20 hover:text-black"
            >
              <RefreshCw size={13} />
              Refresh
            </button>
          </div>

          {warehouseState.loading && <RowsSkeleton />}
          {!warehouseState.loading && warehouseState.error && <ErrorBlock message={warehouseState.error} onRetry={refreshWarehouses} />}
          {!warehouseState.loading && !warehouseState.error && warehouseList.length === 0 && (
            <EmptyBlock
              icon={<Warehouse size={16} strokeWidth={1.75} />}
              title="No warehouses yet"
              description="Add a warehouse or location to track stock transfers and fulfilment by location."
              actionLabel="Add your first warehouse"
              onAction={() => {
                setEditingWarehouse(null);
                setWarehouseFormOpen(true);
              }}
            />
          )}
          {!warehouseState.loading && !warehouseState.error && warehouseList.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {warehouseList.map((w) => (
                <div key={w.id} className="flex flex-col gap-3 rounded-2xl border border-black/8 bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent-ink">
                      <Warehouse size={16} strokeWidth={1.75} />
                    </span>
                    {w.active ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-700">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-black/15 bg-black/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-black/50">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-display text-base font-semibold text-black">{w.name}</p>
                    {w.address && (
                      <p className="mt-1 flex items-start gap-1.5 text-xs text-black/50">
                        <MapPin size={12} className="mt-0.5 shrink-0" />
                        <span className="line-clamp-2">
                          {typeof w.address === "string" ? w.address : Object.values(w.address).filter(Boolean).join(", ")}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingWarehouse(w);
                        setWarehouseFormOpen(true);
                      }}
                      className="rounded-full border border-black/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-black/60 transition hover:border-black/25 hover:text-black"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteWarehouse(w)}
                      disabled={rowBusy === w.id}
                      className="rounded-full border border-red-200 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-red-600 transition hover:border-red-300 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {adjustingFor && (
          <AdjustStockModal
            row={adjustingFor}
            onClose={() => setAdjustingFor(null)}
            onAdjusted={(message) => {
              setToast({ type: "success", message });
              refreshStock();
            }}
            onError={(message) => setToast({ type: "error", message })}
          />
        )}
        {warehouseFormOpen && (
          <WarehouseFormModal
            warehouse={editingWarehouse}
            onClose={() => setWarehouseFormOpen(false)}
            onSaved={(message) => {
              setWarehouseFormOpen(false);
              setToast({ type: "success", message });
              refreshWarehouses();
            }}
            onError={(message) => setToast({ type: "error", message })}
          />
        )}
      </AnimatePresence>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

function AdjustStockModal({ row, onClose, onAdjusted, onError }) {
  const [delta, setDelta] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!delta || submitting || !row.productId) return;
    setSubmitting(true);
    try {
      await api.adjustInventory(row.productId, { delta: Number(delta), reason: reason.trim() || "Manual adjustment" });
      onAdjusted(`Inventory for ${row.name} adjusted by ${delta}.`);
      onClose();
    } catch (e2) {
      onError(errorText(e2));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell onClose={onClose} title={`Adjust stock — ${row.name}`} icon={<Boxes size={15} strokeWidth={1.75} />}>
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-black/40">Current on hand</p>
      <p className="mt-1 font-price text-2xl font-medium text-black">{row.quantity ?? "—"}</p>
      <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
        <Field label="Adjustment (use a negative number to reduce stock)">
          <input
            required
            type="number"
            value={delta}
            onChange={(e) => setDelta(e.target.value)}
            className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm outline-none transition focus:border-accent-dark focus:ring-2 focus:ring-accent/30"
            placeholder="e.g. 10 or -5"
          />
        </Field>
        <Field label="Reason">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm outline-none transition focus:border-accent-dark focus:ring-2 focus:ring-accent/30"
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
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition hover:bg-accent-dark disabled:opacity-60"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            Apply adjustment
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function WarehouseFormModal({ warehouse, onClose, onSaved, onError }) {
  const isEdit = Boolean(warehouse?.id);
  const [name, setName] = useState(warehouse?.name && warehouse.name !== "Untitled warehouse" ? warehouse.name : "");
  const [line, setLine] = useState(
    warehouse?.address ? (typeof warehouse.address === "string" ? warehouse.address : Object.values(warehouse.address).filter(Boolean).join(", ")) : ""
  );
  const [active, setActive] = useState(warehouse ? Boolean(warehouse.active) : true);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!name.trim()) {
      onError("Enter a warehouse name.");
      return;
    }
    setSubmitting(true);
    const input = {
      name: name.trim(),
      ...(line.trim() ? { address: { line1: line.trim() } } : {}),
      active,
      ...(isEdit ? { version: warehouse.version } : {}),
    };
    try {
      if (isEdit) {
        await api.updateWarehouse(warehouse.id, input);
        onSaved(`${name.trim()} updated.`);
      } else {
        await api.createWarehouse(input);
        onSaved(`${name.trim()} created.`);
      }
    } catch (e2) {
      onError(errorText(e2));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell onClose={onClose} title={isEdit ? "Edit warehouse" : "New warehouse"} icon={<Warehouse size={15} strokeWidth={1.75} />}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Warehouse name">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm outline-none transition focus:border-accent-dark focus:ring-2 focus:ring-accent/30"
            placeholder="e.g. Main warehouse"
          />
        </Field>
        <Field label="Address (optional)">
          <input
            value={line}
            onChange={(e) => setLine(e.target.value)}
            className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm outline-none transition focus:border-accent-dark focus:ring-2 focus:ring-accent/30"
            placeholder="e.g. 12 Industrial Rd, Lahore"
          />
        </Field>

        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-black/10 bg-[#f8f8f8] px-4 py-3">
          <span>
            <span className="block text-sm font-medium text-black">Active</span>
            <span className="block text-xs text-black/50">Available for stock transfers and fulfilment.</span>
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
            {isEdit ? "Save changes" : "Create warehouse"}
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

function EmptyBlock({ icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-black/15 bg-white p-8">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent-ink">{icon}</span>
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

function RowsSkeleton() {
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
