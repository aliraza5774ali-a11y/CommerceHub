import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { api } from "../../api/commerceApi";
import { useTenant } from "../TenantProvider";

// Shown once to the store owner, the first time they open the admin panel
// after no explicit layout-template choice has been made yet (see
// businesses.layout_template_selected_at on the backend). Dismissing without
// choosing just keeps the default (Classic) and the popup won't show again,
// since "shown" and "chosen" aren't tracked separately here — picking Skip
// still needs an explicit choice server-side to avoid asking every login.
export default function TemplateChoicePopup() {
  const { refreshTenant } = useTenant();
  const [visible, setVisible] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [applyingId, setApplyingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .settings()
      .then((data) => {
        if (cancelled) return;
        if (!data?.layoutTemplateChosen) {
          setVisible(true);
          api
            .layoutTemplates()
            .then((options) => !cancelled && setTemplates(Array.isArray(options) ? options : []))
            .catch(() => {});
        }
      })
      .catch(() => {
        /* if settings can't load, skip the popup rather than block admin access */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const choose = async (template) => {
    setApplyingId(template.id);
    try {
      await api.updateLayoutTemplate({ layoutTemplate: template.id });
      refreshTenant();
      setVisible(false);
    } catch {
      // leave the popup open so the owner can retry
    } finally {
      setApplyingId(null);
    }
  };

  if (!visible || !templates.length) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8">
        <p className="font-display text-xl font-semibold text-black">Pick your store's design</p>
        <p className="mt-1.5 text-sm text-black/50">
          Choose a starting template for your storefront — you can switch anytime from Settings.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {templates.map((template) => {
            const busy = applyingId === template.id;
            return (
              <button
                key={template.id}
                onClick={() => choose(template)}
                disabled={applyingId !== null}
                className="flex flex-col gap-2.5 rounded-2xl border border-black/10 p-3 text-left transition hover:border-black/30 disabled:opacity-60"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#f2f2f2]">
                  <img src={template.previewImage} alt={`${template.label} preview`} className="h-full w-full object-cover" />
                  {busy && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                      <Loader2 size={18} className="animate-spin text-black/60" />
                    </div>
                  )}
                </div>
                <span className="flex items-center gap-1.5 text-sm font-medium text-black">
                  {template.label}
                  {busy && <Check size={12} />}
                </span>
                <p className="-mt-1 text-xs leading-relaxed text-black/50">{template.description}</p>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setVisible(false)}
          className="mt-6 w-full rounded-full border border-black/10 py-2.5 text-sm font-medium text-black/60 hover:bg-black/5"
        >
          Decide later
        </button>
      </div>
    </div>
  );
}
