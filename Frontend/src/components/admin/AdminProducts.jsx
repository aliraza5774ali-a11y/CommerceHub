import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Boxes,
  Check,
  ImagePlus,
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
  const slug = pick(p, ["slug"]);
  const description = pick(p, ["description"], "");
  const version = pick(p, ["version"]);
  const categoryId = pick(p, ["categoryId", "category_id"]);
  return { id, name, price, currency, status, published, stock, sku, slug, description, version, categoryId, raw: p };
}

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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
    <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-accent-ink">
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
                            className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-accent-ink transition hover:bg-accent-dark disabled:opacity-50"
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
  const [slug, setSlug] = useState(product?.slug || "");
  const [slugEdited, setSlugEdited] = useState(Boolean(product?.slug));
  const [price, setPrice] = useState(product?.price ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [stock, setStock] = useState(product?.stock ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ? String(product.categoryId) : "");
  const [published, setPublished] = useState(Boolean(product?.published));
  const [submitting, setSubmitting] = useState(false);

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]); // [{id?, imageUrl, altText, isPrimary, uploading?}]
  const [imagesLoading, setImagesLoading] = useState(isEdit);

  useEffect(() => {
    let cancelled = false;
    api.categories().then((data) => {
      if (cancelled) return;
      const arr = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setCategories(arr);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    api.productImages(product.id)
      .then((data) => {
        if (cancelled) return;
        const arr = Array.isArray(data) ? data : [];
        setImages(arr.map((img) => ({ id: img.id, imageUrl: img.imageUrl, altText: img.altText || "", isPrimary: Boolean(img.isPrimary) })));
      })
      .catch(() => {})
      .finally(() => !cancelled && setImagesLoading(false));
    return () => { cancelled = true; };
  }, [isEdit, product?.id]);

  const updateImageAlt = (index, value) => {
    setImages((prev) => {
      const next = [...prev];
      next[index] = { ...(next[index] || { imageUrl: "", isPrimary: false }), altText: value };
      return next;
    });
  };

  // Uploads the file to disk (see media.routes.js) and gets back a real URL.
  // If the product already exists, attach the image right away so "set as
  // cover" and delete work against a real image id immediately; otherwise
  // hold the uploaded URL locally and attach it once the product is created.
  const handleFileSelect = async (index, file) => {
    if (!file) return;
    setImages((prev) => {
      const next = [...prev];
      next[index] = { ...(next[index] || { altText: "", isPrimary: false }), uploading: true };
      return next;
    });
    try {
      const media = await api.uploadMedia(file);
      const wantsPrimary = index === 0 && !images.some((img) => img?.isPrimary);
      if (isEdit && product?.id) {
        const created = await api.addProductImage(product.id, {
          imageUrl: media.fileUrl,
          altText: images[index]?.altText?.trim() || undefined,
          sortOrder: index,
          isPrimary: wantsPrimary,
        });
        setImages((prev) => {
          const next = [...prev];
          next[index] = { id: created.id, imageUrl: created.imageUrl, altText: created.altText || "", isPrimary: Boolean(created.isPrimary) };
          return next;
        });
      } else {
        setImages((prev) => {
          const next = [...prev];
          next[index] = { imageUrl: media.fileUrl, altText: prev[index]?.altText || "", isPrimary: wantsPrimary };
          return next;
        });
      }
    } catch (e) {
      onError(errorText(e));
      setImages((prev) => {
        const next = [...prev];
        if (next[index]) next[index] = { ...next[index], uploading: false };
        return next;
      });
    }
  };

  const setCover = async (index) => {
    const entry = images[index];
    if (!entry?.imageUrl || entry.isPrimary) return;
    if (entry.id) {
      try {
        await api.setPrimaryImage(entry.id);
      } catch (e) {
        onError(errorText(e));
        return;
      }
    }
    setImages((prev) => prev.map((img, i) => (img ? { ...img, isPrimary: i === index } : img)));
  };

  const removeImageSlot = async (index) => {
    const entry = images[index];
    if (entry?.id) {
      try { await api.deleteProductImage(entry.id); } catch (e) { onError(errorText(e)); return; }
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const normalizedSlug = slugify(slug || name);
    const numericPrice = Number(price);
    if (!name.trim() || !normalizedSlug || price === "" || !Number.isFinite(numericPrice) || numericPrice < 0) {
      onError("Enter a product name, URL handle, and a valid price.");
      setSubmitting(false);
      return;
    }
    const input = {
      name: name.trim(),
      slug: normalizedSlug,
      price: numericPrice,
      categoryId: categoryId ? Number(categoryId) : null,
      ...(sku.trim() ? { sku: sku.trim() } : {}),
      ...(description.trim() ? { description: description.trim() } : {}),
      ...(isEdit ? { version: product.version } : {}),
    };
    try {
      let productId = product?.id;
      if (isEdit) {
        await api.updateProduct(product.id, input);
        if (stock !== "") await api.adjustInventory(product.id, { delta: Number(stock) - Number(product.stock || 0), reason: "Product edit" });
      } else {
        const created = await api.createProduct(input);
        productId = created.id;
        if (published) {
          await api.publishProduct(created.id);
          if (stock !== "" && Number(stock) > 0) await api.adjustInventory(created.id, { delta: Number(stock), reason: "Initial stock" });
        }
      }

      // Save up to 3 images: for a brand-new product, images were only held
      // locally (no id yet) since there was nothing to attach them to — do
      // that now. In edit mode images are already attached at upload time.
      const validImages = images.filter((img) => img.imageUrl?.trim());
      for (let i = 0; i < validImages.length; i += 1) {
        const img = validImages[i];
        if (img.id) continue;
        await api.addProductImage(productId, {
          imageUrl: img.imageUrl.trim(),
          altText: img.altText?.trim() || undefined,
          sortOrder: i,
          isPrimary: Boolean(img.isPrimary) || (i === 0 && !validImages.some((v) => v.isPrimary)),
        });
      }

      onSaved(isEdit ? `${name.trim()} updated.` : `${name.trim()} created.`);
    } catch (e2) {
      onError(errorText(e2));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell onClose={onClose} title={isEdit ? "Edit product" : "New product"} icon={<Package size={15} strokeWidth={1.75} />} size="lg">
      <form onSubmit={submit} id="product-form" className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-black/35">Details</p>
          <Field label="Product name">
            <input
              required
              autoFocus
              value={name}
              onChange={(e) => { setName(e.target.value); if (!slugEdited) setSlug(slugify(e.target.value)); }}
              className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm outline-none transition focus:border-accent-dark focus:ring-2 focus:ring-accent/30"
              placeholder="e.g. Wool Overcoat"
            />
          </Field>
          <Field label="URL handle">
            <input
              required
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
              className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm outline-none transition focus:border-accent-dark focus:ring-2 focus:ring-accent/30"
              placeholder="e.g. wool-overcoat"
            />
            <span className="mt-1 block text-xs text-black/45">Lowercase letters, numbers, and hyphens only.</span>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price">
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-black/35">$</span>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl border border-black/15 py-2.5 pl-7 pr-3.5 text-sm outline-none transition focus:border-accent-dark focus:ring-2 focus:ring-accent/30"
                  placeholder="0.00"
                />
              </div>
            </Field>
            <Field label="Stock">
              <input
                type="number"
                step="1"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm outline-none transition focus:border-accent-dark focus:ring-2 focus:ring-accent/30"
                placeholder="0"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="SKU">
              <input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm outline-none transition focus:border-accent-dark focus:ring-2 focus:ring-accent/30"
                placeholder="e.g. WOL-100"
              />
            </Field>
            <Field label="Category">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-accent-dark focus:ring-2 focus:ring-accent/30"
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full resize-y rounded-xl border border-black/15 px-3.5 py-2.5 text-sm leading-relaxed outline-none transition focus:border-accent-dark focus:ring-2 focus:ring-accent/30"
              placeholder="A short description for your storefront"
            />
          </Field>

          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-black/10 bg-[#f8f8f8] px-4 py-3">
            <span>
              <span className="block text-sm font-medium text-black">Publish immediately</span>
              <span className="block text-xs text-black/50">Make this product visible on your storefront right away.</span>
            </span>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-black/15 transition-colors duration-200 peer-checked:bg-accent"
            >
              <span className="inline-block h-[18px] w-[18px] translate-x-[3px] transform rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-[22px]" />
            </span>
          </label>
        </div>

        <div className="flex flex-col gap-3 lg:border-l lg:border-black/8 lg:pl-8">
          <div className="flex items-center gap-1.5">
            <ImagePlus size={13} className="text-black/40" />
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-black/35">Images — up to 3</p>
          </div>
          {imagesLoading ? (
            <p className="flex items-center gap-2 py-2 text-xs text-black/40">
              <Loader2 size={12} className="animate-spin" /> Loading images…
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {[0, 1, 2].map((index) => {
                const img = images[index] || { imageUrl: "", altText: "" };
                return (
                  <div key={index} className={`flex items-center gap-3 rounded-xl border p-2.5 transition-colors ${img.isPrimary ? "border-accent-dark bg-accent/5" : "border-black/10"}`}>
                    <label className="relative flex h-16 w-14 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#f8f8f8] text-black/30 hover:bg-black/5">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        onChange={(e) => { handleFileSelect(index, e.target.files?.[0]); e.target.value = ""; }}
                      />
                      {img.uploading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : img.imageUrl ? (
                        <img src={img.imageUrl} alt="" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />
                      ) : (
                        <ImagePlus size={18} strokeWidth={1.75} />
                      )}
                    </label>
                    <div className="min-w-0 flex-1">
                      <input
                        value={img.altText || ""}
                        onChange={(e) => updateImageAlt(index, e.target.value)}
                        className="w-full rounded-lg border border-black/15 px-3 py-2 text-xs outline-none transition focus:border-accent-dark focus:ring-2 focus:ring-accent/30"
                        placeholder={`Alt text ${index + 1} (optional)`}
                      />
                      {img.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setCover(index)}
                          disabled={img.isPrimary}
                          className={`mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium ${
                            img.isPrimary ? "text-accent-ink" : "text-black/40 hover:text-black"
                          } disabled:cursor-default`}
                        >
                          <Check size={11} className={img.isPrimary ? "opacity-100" : "opacity-0"} />
                          {img.isPrimary ? "Shown on home page" : "Use as home page image"}
                        </button>
                      )}
                    </div>
                    {(img.imageUrl || img.id) && (
                      <button type="button" onClick={() => removeImageSlot(index)} className="shrink-0 rounded-full p-1.5 text-black/35 hover:bg-black/5 hover:text-black">
                        <X size={13} />
                      </button>
                    )}
                  </div>
                );
              })}
              <p className="text-[11px] text-black/35">JPEG, PNG, WEBP or GIF, up to 5MB each. Click a tile to upload.</p>
            </div>
          )}
        </div>
      </form>
      <div className="sticky bottom-0 -mx-6 -mb-5 mt-6 flex items-center justify-end gap-3 border-t border-black/8 bg-white px-6 py-4">
        <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm text-black/55 hover:text-black">
          Cancel
        </button>
        <button
          type="submit"
          form="product-form"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition hover:bg-accent-dark disabled:opacity-60"
        >
          {submitting && <Loader2 size={14} className="animate-spin" />}
          {isEdit ? "Save changes" : "Create product"}
        </button>
      </div>
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
                className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm outline-none transition focus:border-accent-dark focus:ring-2 focus:ring-accent/30"
                placeholder="e.g. 10 or -5"
              />
            </Field>
            <Field label="Reason (optional)">
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
        </>
      )}
    </ModalShell>
  );
}

function ModalShell({ title, icon, onClose, size = "md", children }) {
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
        className={`relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ${
          size === "lg" ? "max-w-3xl" : "max-w-md"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-black/8 px-6 py-4">
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
        <div className="overflow-y-auto px-6 py-5">{children}</div>
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
        <Package size={16} strokeWidth={1.75} />
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
