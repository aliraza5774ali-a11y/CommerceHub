import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, RefreshCw, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../api/commerceApi";
import { getApiErrorMessage } from "../../api/apiError";
import SectionHeader from "../../components/SectionHeader";

const errorText = (error) => getApiErrorMessage(error, "Couldn't load your bag. Please try again.");

const pick = (obj, keys, fallback = undefined) => {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return fallback;
};

function cartItemFields(entry) {
  const product = entry.product && typeof entry.product === "object" ? entry.product : entry;
  const id = pick(entry, ["id", "_id"]) ?? pick(product, ["id", "_id", "productId"]);
  const name = pick(product, ["name", "title"], "Item");
  const priceRaw = pick(entry, ["price"]) ?? pick(product, ["price", "basePrice"]);
  const price = typeof priceRaw === "number" ? priceRaw : null;
  const currency = pick(entry, ["currency"]) ?? pick(product, ["currency", "currencyCode"], "USD");
  const quantityRaw = pick(entry, ["quantity", "qty"]);
  const quantity = typeof quantityRaw === "number" ? quantityRaw : 1;
  const image = pick(product, ["image", "thumbnail", "imageUrl"]) || product.images?.[0];
  return { id, name, price, currency, quantity, image };
}

function formatMoney(value, currency = "USD") {
  if (typeof value !== "number") return "—";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export default function AccountCart() {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    api
      .cart()
      .then((data) => !cancelled && setState({ loading: false, data, error: null }))
      .catch((e) => !cancelled && setState({ loading: false, data: null, error: errorText(e) }));
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const refresh = () => {
    setState((state) => ({ ...state, loading: true, error: null }));
    setRefreshKey((key) => key + 1);
  };

  const list = useMemo(() => {
    const arr = Array.isArray(state.data)
      ? state.data
      : Array.isArray(state.data?.items)
        ? state.data.items
        : [];
    return arr.map(cartItemFields);
  }, [state.data]);

  const subtotalRaw = pick(state.data || {}, ["subtotal", "total", "totalAmount"]);
  const computedSubtotal = list.reduce((sum, item) => (typeof item.price === "number" ? sum + item.price * item.quantity : sum), 0);
  const subtotal = typeof subtotalRaw === "number" ? subtotalRaw : list.length ? computedSubtotal : null;
  const currency = pick(state.data || {}, ["currency", "currencyCode"], list[0]?.currency || "USD");

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader badge="Account" icon={<ShoppingBag size={12} strokeWidth={2} />} heading="Bag" />

      {state.loading && <CartSkeleton />}

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
            <ShoppingBag size={18} strokeWidth={1.75} />
          </span>
          <p className="font-display text-lg font-semibold text-black">Your bag is empty</p>
          <p className="max-w-md text-sm text-black/55">Items you add to your bag while shopping will appear here.</p>
          <Link
            to="/shops"
            className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Continue shopping
          </Link>
        </div>
      )}

      {!state.loading && !state.error && list.length > 0 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-3 lg:col-span-2">
            {list.map((item, i) => (
              <div key={item.id ?? i} className="flex items-center gap-4 rounded-2xl border border-black/8 bg-white p-4">
                <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f8f8f8]">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-black/20">
                      <ShoppingBag size={18} strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-semibold text-black">{item.name}</p>
                  <p className="mt-1 text-xs text-black/45">Qty {item.quantity}</p>
                </div>
                <p className="shrink-0 font-price text-sm font-medium text-black">
                  {typeof item.price === "number" ? formatMoney(item.price * item.quantity, item.currency) : "—"}
                </p>
              </div>
            ))}
            <p className="text-xs text-black/35">
              Changing quantities or removing items isn't available yet — this view will support it once cart-update endpoints are added.
            </p>
          </div>

          <div className="h-fit rounded-2xl border border-black/8 bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-black">Summary</h3>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-black/55">Subtotal</span>
              <span className="font-price font-medium text-black">{formatMoney(subtotal, currency)}</span>
            </div>
            <button
              disabled
              title="Checkout isn't available yet"
              className="mt-5 w-full cursor-not-allowed rounded-full bg-black/20 py-3 text-sm font-medium text-white"
            >
              Checkout
            </button>
            <p className="mt-2 text-center text-xs text-black/35">Checkout is pending backend support.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-2xl border border-black/8 bg-white p-4">
          <div className="h-20 w-16 animate-pulse rounded-xl bg-black/10" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-32 animate-pulse rounded bg-black/10" />
            <div className="h-3 w-16 animate-pulse rounded bg-black/10" />
          </div>
          <div className="h-4 w-14 animate-pulse rounded bg-black/10" />
        </div>
      ))}
    </div>
  );
}
