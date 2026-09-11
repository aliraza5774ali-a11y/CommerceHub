import { useEffect, useState } from "react";
import { AlertTriangle, Loader2, Rocket } from "lucide-react";
import { api } from "../../api/commerceApi";
import { getApiErrorMessage } from "../../api/apiError";
import SectionHeader from "../SectionHeader";
import { StatusPill, Toast, Field } from "./cms/CmsUI";
import { SITE_GLOBAL_SLUG, DEFAULT_FOOTER_CONTENT } from "../../config/sitePages";

const errorText = (error) => getApiErrorMessage(error);

export default function AdminFooter() {
  const [state, setState] = useState({ loading: true, page: null, section: null, error: null });
  const [refreshKey, setRefreshKey] = useState(0);
  const [form, setForm] = useState(DEFAULT_FOOTER_CONTENT);
  const [settingUp, setSettingUp] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    (async () => {
      try {
        const pages = await api.cmsPages();
        const list = Array.isArray(pages) ? pages : pages?.items || [];
        const match = list.find((p) => p.slug === SITE_GLOBAL_SLUG);
        if (!match) {
          if (!cancelled) setState({ loading: false, page: null, section: null, error: null });
          return;
        }
        const full = await api.cmsPage(match.id);
        const section = (full.sections || []).find((s) => s.sectionType === "footer");
        if (!cancelled) {
          setState({ loading: false, page: full, section: section || null, error: null });
          setForm({
            ...DEFAULT_FOOTER_CONTENT,
            ...(section?.content || {}),
            social: { ...DEFAULT_FOOTER_CONTENT.social, ...(section?.content?.social || {}) },
          });
        }
      } catch (e) {
        if (!cancelled) setState({ loading: false, page: null, section: null, error: errorText(e) });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setSocial = (key) => (e) => setForm((f) => ({ ...f, social: { ...f.social, [key]: e.target.value } }));

  const setupFooter = async () => {
    setSettingUp(true);
    try {
      const page = await api.createCmsPage({ title: "Site", slug: SITE_GLOBAL_SLUG });
      await api.addCmsSection(page.id, {
        sectionType: "footer",
        position: 0,
        enabled: true,
        content: DEFAULT_FOOTER_CONTENT,
      });
      notify("Footer set up — customize it below, then publish.");
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
      notify("Footer published — changes are now live on every page.");
      setRefreshKey((k) => k + 1);
    } catch (e) {
      notify(errorText(e), "error");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader badge="Website CMS" heading="Footer" />

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
          <p className="text-lg font-semibold text-black">The footer isn't set up yet</p>
          <p className="max-w-sm text-sm text-black/50">
            Set it up once to control the brand name, tagline, copyright text, and social links shown at the bottom of every page.
          </p>
          <button
            onClick={setupFooter}
            disabled={settingUp}
            className="flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-50"
          >
            {settingUp && <Loader2 size={14} className="animate-spin" />}
            Set up footer
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
            <Field label="Brand name" value={form.brandName} onChange={set("brandName")} />
            <Field label="Tagline" value={form.tagline} onChange={set("tagline")} textarea />
            <Field label="Copyright text" value={form.copyrightText} onChange={set("copyrightText")} />

            <label className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                checked={Boolean(form.newsletterEnabled)}
                onChange={(e) => setForm((f) => ({ ...f, newsletterEnabled: e.target.checked }))}
                className="h-4 w-4 rounded border-black/20"
              />
              <span className="text-sm text-black">Show newsletter signup</span>
            </label>

            <p className="pt-2 text-xs font-medium uppercase tracking-[0.14em] text-black/40">Social links</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Instagram URL" value={form.social?.instagram} onChange={setSocial("instagram")} />
              <Field label="Twitter / X URL" value={form.social?.twitter} onChange={setSocial("twitter")} />
              <Field label="Facebook URL" value={form.social?.facebook} onChange={setSocial("facebook")} />
              <Field label="YouTube URL" value={form.social?.youtube} onChange={setSocial("youtube")} />
            </div>
          </div>
        </>
      )}

      <Toast toast={toast} />
    </div>
  );
}
