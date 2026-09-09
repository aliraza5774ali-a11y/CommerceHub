import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Heart, Loader2, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../api/commerceApi";
import { getApiErrorMessage } from "../../api/apiError";
import SectionHeader from "../../components/SectionHeader";

const errorText = (error) => getApiErrorMessage(error, "Couldn't load your wishlist. Please try again.");

const pick = (obj, keys, fallback = undefined) => {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return fallback;
};

function wishlistItemFields(entry) {
  // Entries may be product objects directly, or wrapper objects with a nested product.
  const product = entry.product && typeof entry.product === "object" ? entry.product : entry;
  const productId = pick(product, ["id", "_id", "productId"]) ?? pick(entry, ["productId"]);
  const name = pick(product, ["name", "title"], "Untitled product");
  const priceRaw = pick(product, ["price", "basePrice"]);
  const price = typeof priceRaw === "number" ? priceRaw : null;
  const currency = pick(product, ["currency", "currencyCode"], "USD");
  const image = pick(product, ["image", "thumbnail", "imageUrl"]) || product.images?.[0];
  const slug = pick(product, ["slug"]);
  return { productId, name, price, currency, image, slug };
}

function formatMoney(value, currency = "USD") {
  if (typeof value !== "number") return "—";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export default function AccountWishlist() {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const [refreshKey, setRefreshKey] = useState(0);
  const [removingId, setRemovingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .wishlist()
      .then((data) => !cancelled && setState({ loading: false, data, error: null }))
      .catch((e) => !cancelled && setState({ loading: false, data: null, error: errorText(e) }));
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const refresh = () => {
    setState((state) => ({ ...state, loading: true, error: null }));
    setRefreshKey((key) => key + 1);
  };

  const list = useMemo(() => {
    const arr = Array.isArray(state.data) ? state.data : Array.isArray(state.data?.items) ? state.data.items : [];
    return arr.map(wishlistItemFields);
  }, [state.data]);

  const remove = async (item) => {
    if (!item.productId) {
      setToast("Couldn't identify this item to remove it.");
      return;
    }
    setRemovingId(item.productId);
    try {
      await api.removeWishlist(item.productId);
      setToast(`${item.name} removed from wishlist.`);
      refresh();
    } catch (e) {
      setToast(errorText(e));
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader badge="Account" icon={<Heart size={12} strokeWidth={2} />} heading="Wishlist" />

      {state.loading && <WishlistSkeleton />}

      {!state.loading && state.error && (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle size={18} />
            <p className="font-medium">{state.error}</p>
          </div>
          <button
            onClick={refresh}
            className="inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            <RefreshCw size={14} />
            Try again
          </button>
        </div>
      )}

      {!state.loading && !state.error && list.length === 0 && (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-black/15 bg-white p-10">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/5 text-black/50">
            <Heart size={18} strokeWidth={1.75} />
          </span>
          <p className="font-display text-lg font-semibold text-black">Your wishlist is empty</p>
          <p className="max-w-md text-sm text-black/55">Save pieces you love while browsing to find them here later.</p>
          <Link
            to="/shops"
            className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Browse the shop
          </Link>
        </div>
      )}

      {!state.loading && !state.error && list.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((item, i) => (
            <div key={item.productId ?? i} className="group overflow-hidden rounded-2xl border border-black/8 bg-white">
              <div className="aspect-[4/5] w-full overflow-hidden bg-[#f8f8f8]">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-black/20">
                    <Heart size={28} strokeWidth={1.25} />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold text-black">{item.name}</p>
                  <p className="mt-0.5 font-price text-sm text-black/60">{formatMoney(item.price, item.currency)}</p>
                </div>
                <button
                  onClick={() => remove(item)}
                  disabled={removingId === item.productId}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full border border-black/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-black/55 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                >
                  {removingId === item.productId ? <Loader2 size={12} className="animate-spin" /> : "Remove"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-full bg-black px-4 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function WishlistSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-black/8 bg-white">
          <div className="aspect-[4/5] w-full animate-pulse bg-black/5" />
          <div className="space-y-2 p-4">
            <div className="h-3.5 w-28 animate-pulse rounded bg-black/10" />
            <div className="h-3 w-16 animate-pulse rounded bg-black/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
