import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Pencil,
  RefreshCw,
  Rocket,
  X,
} from "lucide-react";
import { api } from "../../api/commerceApi";
import { getApiErrorMessage } from "../../api/apiError";
import SectionHeader from "../SectionHeader";
import { StatusPill, Toast, Field } from "./cms/CmsUI";
import {
  HOMEPAGE_SLUG,
  SECTION_LABELS,
  SECTION_DESCRIPTIONS,
  EDITABLE_SECTION_TYPES,
  DEFAULT_HOMEPAGE_SECTIONS,
  DEFAULT_HERO_CONTENT,
} from "../../config/homepageSections";

const errorText = (error) => getApiErrorMessage(error);


// ─── Hero content editor modal ───────────────────────────────────────────
function HeroEditor({ initial, saving, onSave, onClose }) {
  const [form, setForm] = useState({ ...DEFAULT_HERO_CONTENT, ...initial });
  const [uploading, setUploading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const media = await api.uploadMedia(file);
      setForm((f) => ({ ...f, image: media.fileUrl }));
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <p className="font-semibold text-black">Edit Hero Banner</p>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-black/5">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-black/60">Banner image</label>
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-[#f2f2f2]">
              {form.image ? (
                <img src={form.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <p className="text-xs text-black/40">No image selected</p>
              )}
              <label className="absolute bottom-2 right-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-black/5">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                {uploading ? "Uploading…" : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Badge label" value={form.badgeLabel} onChange={set("badgeLabel")} placeholder="New" />
            <Field label="Badge text" value={form.badgeText} onChange={set("badgeText")} placeholder="Summer Collection 2026" />
          </div>

          <Field label="Heading" value={form.heading} onChange={set("heading")} />
          <Field label="Subtext" value={form.subtext} onChange={set("subtext")} textarea />

          <div className="grid grid-cols-2 gap-3">
            <Field label="Primary button label" value={form.primaryLabel} onChange={set("primaryLabel")} />
            <Field label="Primary button link" value={form.primaryLink} onChange={set("primaryLink")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Secondary button label" value={form.secondaryLabel} onChange={set("secondaryLabel")} />
            <Field label="Secondary button link" value={form.secondaryLink} onChange={set("secondaryLink")} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-black/10 px-6 py-4">
          <button onClick={onClose} className="rounded-full px-4 py-2 text-sm font-medium text-black/60 hover:bg-black/5">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || uploading}
            className="flex items-center gap-2 rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Save changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────
export default function AdminHomepage() {
  const [state, setState] = useState({ loading: true, page: null, error: null });
  const [refreshKey, setRefreshKey] = useState(0);
  const [busyId, setBusyId] = useState(null);
  const [settingUp, setSettingUp] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [savingHero, setSavingHero] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const load = async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const pages = await api.cmsPages();
      const list = Array.isArray(pages) ? pages : pages?.items || [];
      const homePage = list.find((p) => p.slug === HOMEPAGE_SLUG);
      if (!homePage) {
        setState({ loading: false, page: null, error: null });
        return;
      }
      const full = await api.cmsPage(homePage.id);
      setState({ loading: false, page: full, error: null });
    } catch (e) {
      setState({ loading: false, page: null, error: errorText(e) });
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const sections = (state.page?.sections || []).slice().sort((a, b) => a.position - b.position);

  const setupHomepage = async () => {
    setSettingUp(true);
    try {
      const page = await api.createCmsPage({ title: "Home", slug: HOMEPAGE_SLUG });
      for (const section of DEFAULT_HOMEPAGE_SECTIONS) {
        await api.addCmsSection(page.id, section);
      }
      notify("Homepage set up — customize it below, then publish.");
      setRefreshKey((k) => k + 1);
    } catch (e) {
      notify(errorText(e), "error");
    } finally {
      setSettingUp(false);
    }
  };

  const toggleEnabled = async (section) => {
    setBusyId(section.id);
    try {
      await api.updateCmsSection(section.id, { enabled: !section.enabled, version: section.version });
      setRefreshKey((k) => k + 1);
    } catch (e) {
      notify(errorText(e), "error");
    } finally {
      setBusyId(null);
    }
  };

  const move = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const a = sections[index];
    const b = sections[target];
    setBusyId(a.id);
    try {
      await api.reorderCmsSections([
        { id: a.id, position: b.position },
        { id: b.id, position: a.position },
      ]);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      notify(errorText(e), "error");
    } finally {
      setBusyId(null);
    }
  };

  const saveHero = async (content) => {
    setSavingHero(true);
    try {
      await api.updateCmsSection(editingSection.id, { content, version: editingSection.version });
      notify("Hero banner updated.");
      setEditingSection(null);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      notify(errorText(e), "error");
    } finally {
      setSavingHero(false);
    }
  };

  const publish = async () => {
    setPublishing(true);
    try {
      await api.publishCmsPage(state.page.id);
      notify("Homepage published — changes are now live.");
      setRefreshKey((k) => k + 1);
    } catch (e) {
      notify(errorText(e), "error");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        badge="Website CMS"
        heading="Homepage"
      />

      {state.loading ? (
        <div className="flex items-center justify-center py-20 text-black/40">
          <Loader2 size={22} className="animate-spin" />
        </div>
      ) : state.error ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <AlertTriangle className="text-red-500" />
          <p className="text-sm text-red-700">{state.error}</p>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="flex items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-medium text-white"
          >
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      ) : !state.page ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-black/15 bg-white px-6 py-16 text-center">
          <p className="text-lg font-semibold text-black">Your homepage isn't set up yet</p>
          <p className="max-w-sm text-sm text-black/50">
            Set it up once to control the hero banner and which sections show on your store's homepage — right now it's using the built-in defaults.
          </p>
          <button
            onClick={setupHomepage}
            disabled={settingUp}
            className="flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50"
          >
            {settingUp && <Loader2 size={14} className="animate-spin" />}
            Set up homepage
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white px-5 py-4">
            <div className="flex items-center gap-3">
              <StatusPill status={state.page.status} />
              <span className="text-xs text-black/40">
                {sections.filter((s) => s.enabled).length} of {sections.length} sections enabled
              </span>
            </div>
            <button
              onClick={publish}
              disabled={publishing}
              className="flex items-center gap-2 rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50"
            >
              {publishing ? <Loader2 size={14} className="animate-spin" /> : <Rocket size={14} />}
              Publish changes
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {sections.map((section, index) => {
              const label = SECTION_LABELS[section.sectionType] || section.sectionType;
              const description = SECTION_DESCRIPTIONS[section.sectionType] || "";
              const editable = EDITABLE_SECTION_TYPES.has(section.sectionType);
              const busy = busyId === section.id;
              return (
                <div
                  key={section.id}
                  className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 transition-opacity ${
                    section.enabled ? "border-black/10" : "border-black/5 opacity-60"
                  }`}
                >
                  <div className="flex flex-col">
                    <button
                      onClick={() => move(index, -1)}
                      disabled={index === 0 || busy}
                      className="rounded p-0.5 text-black/30 hover:text-black disabled:opacity-20"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => move(index, 1)}
                      disabled={index === sections.length - 1 || busy}
                      className="rounded p-0.5 text-black/30 hover:text-black disabled:opacity-20"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-black">{label}</p>
                    <p className="truncate text-xs text-black/45">{description}</p>
                  </div>

                  {editable && (
                    <button
                      onClick={() => setEditingSection(section)}
                      className="flex items-center gap-1.5 rounded-full border border-black/15 px-3 py-1.5 text-xs font-medium text-black hover:bg-black/5"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                  )}

                  <button
                    onClick={() => toggleEnabled(section)}
                    disabled={busy}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      section.enabled
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-black/5 text-black/50 hover:bg-black/10"
                    }`}
                  >
                    {busy ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : section.enabled ? (
                      <Eye size={12} />
                    ) : (
                      <EyeOff size={12} />
                    )}
                    {section.enabled ? "Shown" : "Hidden"}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      <AnimatePresence>
        {editingSection && (
          <HeroEditor
            initial={editingSection.content}
            saving={savingHero}
            onSave={saveHero}
            onClose={() => setEditingSection(null)}
          />
        )}
      </AnimatePresence>

      <Toast toast={toast} />
    </div>
  );
}
