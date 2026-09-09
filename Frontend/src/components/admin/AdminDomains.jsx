import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, Copy, Globe2, RefreshCw } from "lucide-react";
import { api } from "../../api/commerceApi";
import { getApiErrorMessage } from "../../api/apiError";
import SectionHeader from "../SectionHeader";

const errorText = (error) => getApiErrorMessage(error, "Couldn't load domains. Please try again.");

const pick = (obj, keys, fallback = undefined) => {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return fallback;
};

function domainFields(d) {
  const id = pick(d, ["id", "_id", "domainId"]);
  const host = pick(d, ["domain", "host", "hostname", "url"], "—");
  const primary = pick(d, ["isPrimary", "primary"], false);
  const status = pick(d, ["status", "verificationStatus", "state"]);
  const verified = pick(d, ["verified", "isVerified"], status ? String(status).toLowerCase() === "verified" : null);
  return { id, host, primary, status, verified };
}

function VerifiedPill({ verified }) {
  if (verified === true) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-emerald-700">
        <Check size={11} /> Verified
      </span>
    );
  }
  if (verified === false) {
    return (
      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-amber-700">
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-black/10 bg-[#f8f8f8] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-black/55">
      —
    </span>
  );
}

export default function AdminDomains() {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const [refreshKey, setRefreshKey] = useState(0);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .domains()
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
    return arr.map(domainFields);
  }, [state.data]);

  const copy = async (host, id) => {
    try {
      await navigator.clipboard.writeText(host);
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // clipboard unavailable — silently ignore, non-critical
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader badge="Admin · Owner" icon={<Globe2 size={12} strokeWidth={2} />} heading="Domains" />

      <div className="flex justify-end">
        <button
          onClick={refresh}
          className="inline-flex w-fit items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-black/60 transition hover:border-black/20 hover:text-black"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {state.loading && <DomainsSkeleton />}

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
        <div className="flex flex-col items-start gap-2 rounded-2xl border border-dashed border-black/15 bg-white p-8">
          <p className="font-display text-lg font-semibold text-black">No domains configured</p>
          <p className="max-w-md text-sm text-black/55">
            Your store's default address will appear here once available from the domains endpoint.
          </p>
        </div>
      )}

      {!state.loading && !state.error && list.length > 0 && (
        <div className="flex flex-col gap-3">
          {list.map((d, i) => (
            <div
              key={d.id ?? i}
              className="flex flex-col gap-3 rounded-2xl border border-black/8 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white">
                  <Globe2 size={16} strokeWidth={1.75} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-price text-sm text-black">{d.host}</p>
                    {d.primary && (
                      <span className="rounded-full border border-[#cfff04]/40 bg-[#cfff04]/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-black">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="mt-1">
                    <VerifiedPill verified={d.verified} />
                  </div>
                </div>
              </div>
              <button
                onClick={() => copy(d.host, d.id ?? i)}
                className="inline-flex w-fit items-center gap-1.5 rounded-full border border-black/10 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-black/60 transition hover:border-black/25 hover:text-black"
              >
                {copied === (d.id ?? i) ? <Check size={13} /> : <Copy size={13} />}
                {copied === (d.id ?? i) ? "Copied" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-black/35">
        Connecting a new custom domain isn't available yet — this view will support it once the domains API supports creation.
      </p>
    </div>
  );
}

function DomainsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-2xl border border-black/8 bg-white p-5">
          <div className="h-10 w-10 animate-pulse rounded-full bg-black/10" />
          <div className="h-4 w-48 animate-pulse rounded bg-black/10" />
          <div className="ml-auto h-6 w-20 animate-pulse rounded-full bg-black/10" />
        </div>
      ))}
    </div>
  );
}