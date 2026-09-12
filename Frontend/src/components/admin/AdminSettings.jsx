import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, Loader2, RefreshCw, Settings as SettingsIcon } from "lucide-react";
import { api } from "../../api/commerceApi";
import { getApiErrorMessage } from "../../api/apiError";
import SectionHeader from "../SectionHeader";
import { useTenant } from "../TenantProvider";

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

function LayoutTemplateSection({ layoutTemplate, onApplied, onTemplateChanged }) {
  const [templates, setTemplates] = useState([]);
  const [applyingId, setApplyingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .layoutTemplates()
      .then((options) => setTemplates(Array.isArray(options) ? options : []))
      .catch(() => setTemplates([]));
  }, []);

  const apply = async (template) => {
    setApplyingId(template.id);
    setError("");
    try {
      await api.updateLayoutTemplate({ layoutTemplate: template.id });
      await onTemplateChanged();
      onApplied();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setApplyingId(null);
    }
  };

  if (!templates.length) return null;

  return (
    <div className="rounded-2xl border border-black/8 bg-white p-6">
      <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-black">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        Store template
      </h3>
      <p className="mt-1.5 text-sm text-black/50">
        Switch between full storefront designs — different layout, sections and typography for
        each. Your homepage, pages and footer content (edited in CMS) carry over exactly as-is.
      </p>

      <div className="mt-5 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        {templates.map((template) => {
          const selected = layoutTemplate === template.id;
          const busy = applyingId === template.id;
          return (
            <button
              key={template.id}
              onClick={() => apply(template)}
              disabled={applyingId !== null}
              className={`flex flex-col gap-2.5 rounded-2xl border p-3 text-left transition-all duration-200 disabled:opacity-60 ${
                selected ? "border-black shadow-sm" : "border-black/10 hover:border-black/25"
              }`}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#f2f2f2]">
                <img
                  src={template.previewImage}
                  alt={`${template.label} template preview`}
                  className="h-full w-full object-cover"
                />
                {busy && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                    <Loader2 size={16} className="animate-spin text-black/60" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-black">{template.label}</span>
                {selected && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-black">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
              </div>
              <p className="-mt-1 text-xs leading-relaxed text-black/50">{template.description}</p>
            </button>
          );
        })}
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function AdminSettings() {
  const { refreshTenant } = useTenant();
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
    // theme/layoutTemplate/layoutTemplateChosen already have dedicated UI
    // above (or, for theme, are deliberately not shown — see LayoutTemplateSection).
    return Object.entries(state.data).filter(
      ([k, v]) => !["theme", "layoutTemplate", "layoutTemplateChosen"].includes(k) && (typeof v !== "object" || v === null || Array.isArray(v))
    );
  }, [state.data]);

  const nestedGroups = useMemo(() => {
    if (!state.data || typeof state.data !== "object") return [];
    return Object.entries(state.data).filter(([k, v]) => k !== "theme" && v && typeof v === "object" && !Array.isArray(v));
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

      {!state.loading && !state.error && <LayoutTemplateSection layoutTemplate={state.data?.layoutTemplate} onApplied={refresh} onTemplateChanged={refreshTenant} />}

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
