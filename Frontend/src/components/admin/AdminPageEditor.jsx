import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  AlertTriangle,
  ImagePlus,
  Loader2,
  Rocket,
  ArrowLeft,
} from "lucide-react";
import { api } from "../../api/commerceApi";
import { getApiErrorMessage } from "../../api/apiError";
import SectionHeader from "../SectionHeader";
import { StatusPill, Toast, Field } from "./cms/CmsUI";
import { getPageDef } from "../../config/sitePages";

const errorText = (error) => getApiErrorMessage(error);

export default function AdminPageEditor() {
  const { slug } = useParams();
  const pageDef = getPageDef(slug);

  const [state, setState] = useState({ loading: true, page: null, section: null, error: null });
  const [refreshKey, setRefreshKey] = useState(0);
  const [form, setForm] = useState(pageDef?.defaults || {});
  const [settingUp, setSettingUp] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!pageDef) return;
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    (async () => {
      try {
        const pages = await api.cmsPages();
        const list = Array.isArray(pages) ? pages : pages?.items || [];
        const match = list.find((p) => p.slug === pageDef.slug);
        if (!match) {
          if (!cancelled) setState({ loading: false, page: null, section: null, error: null });
          return;
        }
        const full = await api.cmsPage(match.id);
        const section = (full.sections || []).find((s) => s.sectionType === "hero");
        if (!cancelled) {
          setState({ loading: false, page: full, section: section || null, error: null });
          setForm({ ...pageDef.defaults, ...(section?.content || {}) });
        }
      } catch (e) {
        if (!cancelled) setState({ loading: false, page: null, section: null, error: errorText(e) });
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageDef?.slug, refreshKey]);

  if (!pageDef) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <AlertTriangle className="text-black/30" />
        <p className="text-sm text-black/50">Unknown page.</p>
        <Link to="/admin/pages" className="text-sm text-black underline">
          Back to Pages
        </Link>
      </div>
    );
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const media = await api.uploadMedia(file);
      setForm((f) => ({ ...f, image: media.fileUrl }));
    } catch (e) {
      notify(errorText(e), "error");
    } finally {
      setUploading(false);
    }
  };

  const setupPage = async () => {
    setSettingUp(true);
    try {
      const page = await api.createCmsPage({ title: pageDef.label, slug: pageDef.slug });
      await api.addCmsSection(page.id, { sectionType: "hero", position: 0, enabled: true, content: pageDef.defaults });
      notify(`${pageDef.label} page set up — customize it below, then publish.`);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      notify(errorText(e), "error");
    } finally {
      setSettingUp(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.updateCmsSection(state.section.id, { content: form, version: state.section.version });
      notify("Saved.");
      setRefreshKey((k) => k + 1);
    } catch (e) {
      notify(errorText(e), "error");
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    setPublishing(true);
    try {
      await api.publishCmsPage(state.page.id);
      notify(`${pageDef.label} page published — changes are now live.`);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      notify(errorText(e), "error");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Link to="/admin/pages" className="flex w-fit items-center gap-1.5 text-xs text-black/50 hover:text-black">
        <ArrowLeft size={13} /> All pages
      </Link>

      <SectionHeader badge="Website CMS" heading={`${pageDef.label} page`} />

      {state.loading ? (
        <div className="flex items-center justify-center py-20 text-black/40">
          <Loader2 size={22} className="animate-spin" />
        </div>
      ) : state.error ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <AlertTriangle className="text-red-500" />
          <p className="text-sm text-red-700">{state.error}</p>
        </div>
      ) : !state.page ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-black/15 bg-white px-6 py-16 text-center">
          <p className="text-lg font-semibold text-black">This page isn't set up yet</p>
          <p className="max-w-sm text-sm text-black/50">
            Set it up once to control the {pageDef.label.toLowerCase()} page's banner — right now it's using the built-in defaults.
          </p>
          <button
            onClick={setupPage}
            disabled={settingUp}
            className="flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50"
          >
            {settingUp && <Loader2 size={14} className="animate-spin" />}
            Set up {pageDef.label.toLowerCase()} page
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white px-5 py-4">
            <StatusPill status={state.page.status} />
            <div className="flex items-center gap-2">
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm font-medium text-black hover:bg-black/5 disabled:opacity-50"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                Save draft
              </button>
              <button
                onClick={publish}
                disabled={publishing}
                className="flex items-center gap-2 rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50"
              >
                {publishing ? <Loader2 size={14} className="animate-spin" /> : <Rocket size={14} />}
                Publish changes
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-black/60">Banner image</label>
              <div className="relative flex aspect-video max-w-md items-center justify-center overflow-hidden rounded-xl bg-[#f2f2f2]">
                {form.image ? (
                  <img src={form.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <p className="text-xs text-black/40">No image selected — using default</p>
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
              <Field label="Badge label" value={form.badgeLabel} onChange={set("badgeLabel")} />
              <Field label="Badge text" value={form.badgeText} onChange={set("badgeText")} />
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
        </>
      )}

      <Toast toast={toast} />
    </div>
  );
}
