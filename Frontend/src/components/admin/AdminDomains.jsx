import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, Copy, Globe2, Loader2, Plus, RefreshCw, ShieldCheck, Star, Trash2, X } from "lucide-react";
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
  const [showAdd, setShowAdd] = useState(false);
  const [newHost, setNewHost] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [justCreated, setJustCreated] = useState(null); // { id, host, verificationToken }
  const [busyId, setBusyId] = useState(null);

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

  const addDomain = async () => {
    const host = newHost.trim().toLowerCase();
    if (!host) return;
    setAdding(true);
    setAddError("");
    try {
      const created = await api.addDomain({ host, domainType: "custom" });
      setJustCreated(created);
      setNewHost("");
      setShowAdd(false);
      refresh();
    } catch (e) {
      setAddError(errorText(e));
    } finally {
      setAdding(false);
    }
  };

  const verify = async (id) => {
    if (!justCreated?.verificationToken || justCreated.id !== id) return;
    setBusyId(id);
    try {
      await api.verifyDomain(id, justCreated.verificationToken);
      setJustCreated(null);
      refresh();
    } catch (e) {
      setAddError(errorText(e));
    } finally {
      setBusyId(null);
    }
  };

  const setPrimary = async (id) => {
    setBusyId(id);
    try {
      await api.setPrimaryDomain(id);
      refresh();
    } catch (e) {
      setAddError(errorText(e));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id) => {
    setBusyId(id);
    try {
      await api.deleteDomain(id);
      refresh();
    } catch (e) {
      setAddError(errorText(e));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader badge="Admin · Owner" icon={<Globe2 size={12} strokeWidth={2} />} heading="Domains" />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowAdd((s) => !s)}
          className="inline-flex w-fit items-center gap-1.5 rounded-full bg-black px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition hover:bg-neutral-800"
        >
          {showAdd ? <X size={13} /> : <Plus size={13} />}
          {showAdd ? "Cancel" : "Add domain"}
        </button>
        <button
          onClick={refresh}
          className="inline-flex w-fit items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-black/60 transition hover:border-black/20 hover:text-black"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {showAdd && (
        <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-black/60">Domain (e.g. yourbrand.com — no http:// or www)</span>
            <input
              value={newHost}
              onChange={(e) => setNewHost(e.target.value)}
              placeholder="yourbrand.com"
              className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black/40"
            />
          </label>
          {addError && <p className="text-sm text-red-600">{addError}</p>}
          <button
            onClick={addDomain}
            disabled={adding || !newHost.trim()}
            className="flex w-fit items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50"
          >
            {adding && <Loader2 size={14} className="animate-spin" />}
            Add domain
          </button>
        </div>
      )}

      {justCreated && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-semibold text-black">Verify {justCreated.host}</p>
          <p className="text-xs leading-relaxed text-black/60">
            Point this domain's DNS at us, then add a TXT record with the token below and verify — this token is
            only shown once, so verify now or copy it somewhere safe.
          </p>
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 font-mono">
              <span className="truncate">CNAME @ → storefront.commercehub.com</span>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 font-mono">
              <span className="truncate">TXT commercehub-verify = {justCreated.verificationToken}</span>
              <button
                onClick={() => copy(justCreated.verificationToken, "token")}
                className="flex shrink-0 items-center gap-1 rounded-full bg-black/5 px-2 py-1 text-[11px] font-medium text-black/60 hover:bg-black/10"
              >
                <Copy size={11} />
                {copied === "token" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <button
            onClick={() => verify(justCreated.id)}
            disabled={busyId === justCreated.id}
            className="flex w-fit items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-medium text-white hover:bg-black/90 disabled:opacity-50"
          >
            {busyId === justCreated.id ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheck size={13} />}
            I've added the DNS record — verify now
          </button>
        </div>
      )}

      {state.loading && <DomainsSkeleton />}

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
            <Globe2 size={16} strokeWidth={1.75} />
          </span>
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
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink">
                  <Globe2 size={16} strokeWidth={1.75} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-price text-sm text-black">{d.host}</p>
                    {d.primary && (
                      <span className="rounded-full border border-accent/40 bg-accent/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-accent-ink">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="mt-1">
                    <VerifiedPill verified={d.verified} />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {!d.primary && d.verified === true && (
                  <button
                    onClick={() => setPrimary(d.id)}
                    disabled={busyId === d.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-black/60 hover:border-black/25 hover:text-black disabled:opacity-50"
                  >
                    <Star size={12} /> Make primary
                  </button>
                )}
                {!d.primary && (
                  <button
                    onClick={() => remove(d.id)}
                    disabled={busyId === d.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                )}
                <button
                  onClick={() => copy(d.host, d.id ?? i)}
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.1em] transition ${
                    copied === (d.id ?? i)
                      ? "border-accent/40 bg-accent/15 text-accent-ink"
                      : "border-black/10 text-black/60 hover:border-black/25 hover:text-black"
                  }`}
                >
                  {copied === (d.id ?? i) ? <Check size={13} /> : <Copy size={13} />}
                  {copied === (d.id ?? i) ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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