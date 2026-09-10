import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, RefreshCw, Search, Users } from "lucide-react";
import { api } from "../../api/commerceApi";
import { getApiErrorMessage } from "../../api/apiError";
import SectionHeader from "../../components/SectionHeader";

const errorText = (error) => getApiErrorMessage(error, "Couldn't load customers. Please try again.");

const pick = (obj, keys, fallback = undefined) => {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return fallback;
};

function customerFields(c) {
  const id = pick(c, ["id", "_id", "customerId"]);
  const name = [c.firstName, c.lastName].filter(Boolean).join(" ") || pick(c, ["name"], "—");
  const email = pick(c, ["email"], "—");
  const ordersRaw = pick(c, ["orderCount", "ordersCount", "totalOrders"]);
  const orders = typeof ordersRaw === "number" ? ordersRaw : Array.isArray(c.orders) ? c.orders.length : null;
  const spentRaw = pick(c, ["totalSpent", "lifetimeValue", "spent"]);
  const spent = typeof spentRaw === "number" ? spentRaw : null;
  const currency = pick(c, ["currency", "currencyCode"], "USD");
  const joined = pick(c, ["createdAt", "joinedAt"]);
  return { id, name, email, orders, spent, currency, joined };
}

function formatMoney(value, currency = "USD") {
  if (typeof value !== "number") return "—";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function initialsOf(name, email) {
  const source = name && name !== "—" ? name : email;
  if (!source || source === "—") return "?";
  return source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

export default function AdminCustomers() {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const [refreshKey, setRefreshKey] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .customers()
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
    const arr = Array.isArray(state.data) ? state.data : Array.isArray(state.data?.items) ? state.data.items : [];
    return arr.map(customerFields);
  }, [state.data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }, [list, query]);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader badge="Admin" icon={<Users size={12} strokeWidth={2} />} heading="Customers" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or email…"
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

      {state.loading && <CustomersSkeleton />}

      {!state.loading && state.error && (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-3 text-red-700">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle size={16} />
            </span>
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
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-black/15 bg-white p-8">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent-ink">
            <Users size={16} strokeWidth={1.75} />
          </span>
          <p className="font-display text-lg font-semibold text-black">No customers yet</p>
          <p className="max-w-md text-sm text-black/55">Anyone who creates an account on your storefront will show up here.</p>
        </div>
      )}

      {!state.loading && !state.error && list.length > 0 && filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-black/15 bg-white p-8 text-sm text-black/55">
          No customers match "{query}".
        </div>
      )}

      {!state.loading && !state.error && filtered.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/10 bg-[#f8f8f8] font-mono text-[10px] uppercase tracking-[0.14em] text-black/45">
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Orders</th>
                  <th className="px-5 py-3 font-medium">Lifetime spend</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id ?? i} className="border-b border-black/5 last:border-0 hover:bg-[#f8f8f8]/60">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-display text-xs font-semibold text-accent-ink">
                          {initialsOf(c.name, c.email)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-black">{c.name}</p>
                          <p className="truncate text-xs text-black/45">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-black/70">{c.orders ?? "—"}</td>
                    <td className="px-5 py-3.5 font-price text-black/80">{formatMoney(c.spent, c.currency)}</td>
                    <td className="px-5 py-3.5 text-black/50">{formatDate(c.joined)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomersSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-black/5 px-5 py-4 last:border-0">
          <div className="h-9 w-9 animate-pulse rounded-full bg-black/10" />
          <div className="h-4 w-40 animate-pulse rounded bg-black/10" />
          <div className="ml-auto h-4 w-16 animate-pulse rounded bg-black/10" />
        </div>
      ))}
    </div>
  );
}