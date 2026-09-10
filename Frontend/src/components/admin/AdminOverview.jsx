import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  Clock,
  Receipt,
  RefreshCw,
  Sparkle,
  Users,
  Wallet,
} from "lucide-react";
import { api } from "../../api/commerceApi";
import { getApiErrorMessage } from "../../api/apiError";
import SectionHeader from "../../components/SectionHeader";

const errorText = (error) => getApiErrorMessage(error, "Couldn't load your store overview. Please try again.");

// The shape of GET /analytics/overview isn't documented here, so we read it
// defensively: we look for a handful of common field name variants and only
// render a metric card when the field is actually present in the response.
// Nothing below is invented — every number shown comes straight from the API.
const METRIC_DEFS = [
  {
    key: "revenue",
    label: "Revenue",
    icon: Wallet,
    aliases: ["totalRevenue", "revenue", "grossRevenue", "totalSales", "salesTotal"],
    format: (value, currency) => formatCurrency(value, currency),
  },
  {
    key: "orders",
    label: "Orders",
    icon: Receipt,
    aliases: ["totalOrders", "orderCount", "ordersCount"],
    format: (value) => formatCount(value),
  },
  {
    key: "customers",
    label: "Customers",
    icon: Users,
    aliases: ["totalCustomers", "customerCount", "customersCount"],
    format: (value) => formatCount(value),
  },
  {
    key: "products",
    label: "Products",
    icon: Boxes,
    aliases: ["totalProducts", "productCount", "productsCount"],
    format: (value) => formatCount(value),
  },
];

const SECONDARY_DEFS = [
  {
    key: "pendingOrders",
    label: "Pending orders",
    icon: Clock,
    tone: "neutral",
    aliases: ["pendingOrders", "pendingOrderCount", "pendingOrdersCount"],
  },
  {
    key: "lowStock",
    label: "Low stock items",
    icon: AlertTriangle,
    tone: "warning",
    aliases: ["lowStockCount", "lowStockItems", "lowStockProducts"],
  },
];

// Maps common order/status strings to a visual tone. Falls back to neutral
// for anything unrecognized, so an unfamiliar status from the API never
// breaks the layout — it just renders plainly instead of guessing.
function statusTone(status) {
  const s = String(status || "").toLowerCase();
  if (["paid", "completed", "delivered", "fulfilled", "success", "active"].some((k) => s.includes(k))) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (["pending", "processing", "awaiting", "in progress"].some((k) => s.includes(k))) {
    return "border-accent/40 bg-accent/15 text-accent-ink";
  }
  if (["cancelled", "canceled", "failed", "refunded", "declined"].some((k) => s.includes(k))) {
    return "border-red-200 bg-red-50 text-red-700";
  }
  return "border-black/10 bg-black/[0.03] text-black/60";
}

const RECENT_LIST_ALIASES = ["recentOrders", "latestOrders", "recentActivity", "activity"];

function formatCount(value) {
  if (typeof value !== "number") return String(value);
  return new Intl.NumberFormat("en-US").format(value);
}

function formatCurrency(value, currency = "USD") {
  if (typeof value !== "number") return String(value);
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function readAlias(source, aliases) {
  for (const key of aliases) {
    if (source && Object.prototype.hasOwnProperty.call(source, key) && source[key] !== null && source[key] !== undefined) {
      return { key, value: source[key] };
    }
  }
  return null;
}

function pickNumeric(source, aliases) {
  const found = readAlias(source, aliases);
  if (!found) return null;
  if (typeof found.value === "number") return found.value;
  if (Array.isArray(found.value)) return found.value.length;
  return null;
}

function pickList(source, aliases) {
  for (const key of aliases) {
    const value = source?.[key];
    if (Array.isArray(value) && value.length) return value;
  }
  return null;
}

function StatCard({ icon: Icon, label, value, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="soft-lift relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-black/8 bg-white p-6 shadow-sm"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-accent/15 blur-2xl" />
      <div className="relative flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-ink">
          <Icon size={16} strokeWidth={1.75} />
        </span>
      </div>
      <div className="relative">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-black/45">{label}</p>
        <p className="mt-1.5 font-price text-3xl font-medium text-black">{value}</p>
      </div>
    </motion.div>
  );
}

function activityFields(entry) {
  const id = entry.id ?? entry.orderNumber ?? entry.number ?? entry._id ?? "—";
  const customer =
    entry.customerName ||
    entry.customer?.name ||
    [entry.customer?.firstName, entry.customer?.lastName].filter(Boolean).join(" ") ||
    entry.customerEmail ||
    "—";
  const amountRaw = entry.total ?? entry.amount ?? entry.totalAmount ?? null;
  const amount = typeof amountRaw === "number" ? formatCurrency(amountRaw, entry.currency) : amountRaw;
  const status = entry.status || entry.state || null;
  const date = entry.createdAt || entry.date || entry.placedAt || null;
  return { id, customer, amount, status, date };
}

export default function AdminOverview() {
  const auth = useSelector((s) => s.auth);
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    api
      .overview()
      .then((data) => !cancelled && setState({ loading: false, data, error: null }))
      .catch((e) => !cancelled && setState({ loading: false, data: null, error: errorText(e) }));
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const { loading, data, error } = state;

  const refresh = () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    setRefreshKey((key) => key + 1);
  };

  const currency = data?.currency || data?.currencyCode || "USD";

  const metrics = useMemo(() => {
    if (!data) return [];
    return METRIC_DEFS.map((def) => {
      const found = readAlias(data, def.aliases);
      if (!found) return null;
      const numeric = typeof found.value === "number" ? found.value : Array.isArray(found.value) ? found.value.length : null;
      if (numeric === null) return null;
      return {
        ...def,
        display: def.format(numeric, currency),
      };
    }).filter(Boolean);
  }, [data, currency]);

  const secondary = useMemo(() => {
    if (!data) return [];
    return SECONDARY_DEFS.map((def) => {
      const value = pickNumeric(data, def.aliases);
      if (value === null) return null;
      return { ...def, value };
    }).filter(Boolean);
  }, [data]);

  const recentList = useMemo(() => (data ? pickList(data, RECENT_LIST_ALIASES) : null), [data]);

  const recognizedKeys = useMemo(() => {
    const keys = new Set();
    [...METRIC_DEFS, ...SECONDARY_DEFS].forEach((def) => {
      const found = readAlias(data || {}, def.aliases);
      if (found) keys.add(found.key);
    });
    RECENT_LIST_ALIASES.forEach((k) => {
      if (data && Array.isArray(data[k])) keys.add(k);
    });
    return keys;
  }, [data]);

  const leftoverEntries = useMemo(() => {
    if (!data || typeof data !== "object") return [];
    return Object.entries(data).filter(
      ([key, value]) =>
        !recognizedKeys.has(key) &&
        key !== "currency" &&
        key !== "currencyCode" &&
        (typeof value === "number" || typeof value === "string")
    );
  }, [data, recognizedKeys]);

  const hasAnyRecognized = metrics.length > 0 || secondary.length > 0 || (recentList && recentList.length > 0);

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader
        badge="Admin"
        icon={<Sparkle size={12} strokeWidth={2} />}
        heading={`Welcome back${auth.user?.firstName ? `, ${auth.user.firstName}` : ""}`}
        ctaLabel={!loading ? "Refresh" : undefined}
        ctaOnClick={refresh}
      />

      {loading && <OverviewSkeleton />}

      {!loading && error && (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-3 text-red-700">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle size={16} />
            </span>
            <p className="font-medium">{error}</p>
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

      {!loading && !error && data && (
        <>
          {metrics.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((m, i) => (
                <StatCard key={m.key} icon={m.icon} label={m.label} value={m.display} index={i} />
              ))}
            </div>
          )}

          {secondary.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {secondary.map((s) => {
                const Icon = s.icon;
                const isWarning = s.tone === "warning" && s.value > 0;
                return (
                  <div
                    key={s.key}
                    className="soft-lift flex items-center justify-between gap-4 rounded-2xl border border-black/8 bg-white px-6 py-5"
                  >
                    <div className="flex items-center gap-3">
                      {Icon && (
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            isWarning ? "bg-amber-100 text-amber-700" : "bg-accent/15 text-accent-ink"
                          }`}
                        >
                          <Icon size={15} strokeWidth={1.75} />
                        </span>
                      )}
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-black/45">{s.label}</p>
                    </div>
                    <p className={`font-price text-xl font-medium ${isWarning ? "text-amber-700" : "text-black"}`}>
                      {formatCount(s.value)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {recentList && recentList.length > 0 && (
            <div className="rounded-2xl border border-black/8 bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-black">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Recent activity
                  </h3>
                  <p className="mt-1 text-sm text-black/45">Latest orders placed across your store.</p>
                </div>
                <span className="hidden items-center gap-1 rounded-full border border-black/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-black/50 sm:inline-flex">
                  Last {Math.min(recentList.length, 8)}
                  <ArrowUpRight size={12} />
                </span>
              </div>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-black/10 font-mono text-[10px] uppercase tracking-[0.14em] text-black/40">
                      <th className="pb-3 pr-4 font-medium">Order</th>
                      <th className="pb-3 pr-4 font-medium">Customer</th>
                      <th className="pb-3 pr-4 font-medium">Amount</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentList.slice(0, 8).map((entry, i) => {
                      const f = activityFields(entry);
                      return (
                        <tr
                          key={f.id ?? i}
                          className="border-b border-black/5 transition-colors duration-150 last:border-0 hover:bg-black/[0.02]"
                        >
                          <td className="py-3 pr-4 font-price text-black/80">{String(f.id)}</td>
                          <td className="py-3 pr-4 text-black/70">{f.customer}</td>
                          <td className="py-3 pr-4 font-price text-black/80">{f.amount ?? "—"}</td>
                          <td className="py-3 pr-4">
                            {f.status ? (
                              <span
                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${statusTone(
                                  f.status
                                )}`}
                              >
                                {f.status}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {leftoverEntries.length > 0 && (
            <div className="rounded-2xl border border-black/8 bg-white p-6">
              <h3 className="font-display text-lg font-semibold text-black">Other figures</h3>
              <p className="mt-1 text-sm text-black/50">
                Additional fields returned by the overview endpoint that don't map to a known metric.
              </p>
              <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {leftoverEntries.map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between rounded-xl bg-[#f8f8f8] px-4 py-3">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-black/45">{key}</dt>
                    <dd className="font-price text-sm text-black/80">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {!hasAnyRecognized && leftoverEntries.length === 0 && <EmptyOverview />}
        </>
      )}

      {!loading && !error && !data && <EmptyOverview />}
    </div>
  );
}

function EmptyOverview() {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-black/15 bg-white p-8">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent-ink">
        <Sparkle size={16} strokeWidth={1.75} />
      </span>
      <p className="font-display text-lg font-semibold text-black">Nothing to show yet</p>
      <p className="max-w-md text-sm text-black/55">
        Your overview will populate here once your store has orders, products, and customers to report on.
      </p>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-4 rounded-2xl border border-black/8 bg-white p-6">
          <div className="h-10 w-10 animate-pulse rounded-full bg-black/10" />
          <div className="space-y-2">
            <div className="h-2.5 w-20 animate-pulse rounded bg-black/10" />
            <div className="h-6 w-24 animate-pulse rounded bg-black/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
