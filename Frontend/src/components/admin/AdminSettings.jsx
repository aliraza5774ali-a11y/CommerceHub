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
  if (typeof value === "boolean") return value ? "Enabled" : "Disabled";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
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

      {!state.loading && !state.error && entries.length === 0 && nestedGroups.length === 0 && (
        <div className="flex flex-col items-start gap-2 rounded-2xl border border-dashed border-black/15 bg-white p-8">
          <p className="font-display text-lg font-semibold text-black">No settings returned</p>
          <p className="max-w-md text-sm text-black/55">
            The settings endpoint didn't return any fields to display.
          </p>
        </div>
      )}

      {!state.loading && !state.error && entries.length > 0 && (
        <div className="rounded-2xl border border-black/8 bg-white p-6">
          <h3 className="font-display text-lg font-semibold text-black">Store settings</h3>
          <dl className="mt-4 divide-y divide-black/5">
            {entries.map(([key, value]) => (
              <div key={key} className="flex items-center justify-between gap-4 py-3.5">
                <dt className="text-sm text-black/60">{labelize(key)}</dt>
                <dd className="font-price text-sm text-black/85">{displayValue(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {!state.loading &&
        !state.error &&
        nestedGroups.map(([groupKey, group]) => (
          <div key={groupKey} className="rounded-2xl border border-black/8 bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-black">{labelize(groupKey)}</h3>
            <dl className="mt-4 divide-y divide-black/5">
              {Object.entries(group).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="text-sm text-black/60">{labelize(key)}</dt>
                  <dd className="font-price text-sm text-black/85">{displayValue(value)}</dd>
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
