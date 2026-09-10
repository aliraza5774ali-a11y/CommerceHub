import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, RefreshCw, Settings as SettingsIcon } from "lucide-react";
import { api } from "../../api/commerceApi";
import { getApiErrorMessage } from "../../api/apiError";
import SectionHeader from "../SectionHeader";

const errorText = (error) => getApiErrorMessage(error, "Couldn't load settings. Please try again.");

function labelize(key) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

function displayValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function BooleanPill({ value }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${
        value ? "border-accent/40 bg-accent/15 text-accent-ink" : "border-black/10 bg-[#f8f8f8] text-black/50"
      }`}
    >
      {value ? "Enabled" : "Disabled"}
    </span>
  );
}

function SettingValue({ value }) {
  if (typeof value === "boolean") return <BooleanPill value={value} />;
  return <span className="font-price text-sm text-black/85">{displayValue(value)}</span>;
}

export default function AdminSettings() {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    api
      .settings()
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

  const entries = useMemo(() => {
    if (!state.data || typeof state.data !== "object") return [];
    return Object.entries(state.data).filter(([, v]) => typeof v !== "object" || v === null || Array.isArray(v));
  }, [state.data]);

  const nestedGroups = useMemo(() => {
    if (!state.data || typeof state.data !== "object") return [];
    return Object.entries(state.data).filter(([, v]) => v && typeof v === "object" && !Array.isArray(v));
  }, [state.data]);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader badge="Admin · Owner" icon={<SettingsIcon size={12} strokeWidth={2} />} heading="Settings" />

      <div className="flex justify-end">
        <button
          onClick={refresh}
          className="inline-flex w-fit items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-black/60 transition hover:border-black/20 hover:text-black"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {state.loading && <SettingsSkeleton />}

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

      {!state.loading && !state.error && entries.length === 0 && nestedGroups.length === 0 && (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-black/15 bg-white p-8">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent-ink">
            <SettingsIcon size={16} strokeWidth={1.75} />
          </span>
          <p className="font-display text-lg font-semibold text-black">No settings returned</p>
          <p className="max-w-md text-sm text-black/55">
            The settings endpoint didn't return any fields to display.
          </p>
        </div>
      )}

      {!state.loading && !state.error && entries.length > 0 && (
        <div className="rounded-2xl border border-black/8 bg-white p-6">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-black">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Store settings
          </h3>
          <dl className="mt-4 divide-y divide-black/5">
            {entries.map(([key, value]) => (
              <div key={key} className="flex items-center justify-between gap-4 py-3.5">
                <dt className="text-sm text-black/60">{labelize(key)}</dt>
                <dd>
                  <SettingValue value={value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {!state.loading &&
        !state.error &&
        nestedGroups.map(([groupKey, group]) => (
          <div key={groupKey} className="rounded-2xl border border-black/8 bg-white p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-black">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {labelize(groupKey)}
            </h3>
            <dl className="mt-4 divide-y divide-black/5">
              {Object.entries(group).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="text-sm text-black/60">{labelize(key)}</dt>
                  <dd>
                    <SettingValue value={value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}

      {!state.loading && !state.error && (entries.length > 0 || nestedGroups.length > 0) && (
        <p className="text-xs text-black/35">
          Settings are read-only for now — editing will be available once an update endpoint is added.
        </p>
      )}
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="rounded-2xl border border-black/8 bg-white p-6">
      <div className="h-5 w-40 animate-pulse rounded bg-black/10" />
      <div className="mt-5 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="h-3.5 w-32 animate-pulse rounded bg-black/10" />
            <div className="h-3.5 w-20 animate-pulse rounded bg-black/10" />
          </div>
        ))}
      </div>
    </div>
  );
}