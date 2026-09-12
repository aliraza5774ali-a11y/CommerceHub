/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { isPlatformHost } from "../api/apiClient";
import { resolveTenant, api } from "../api/commerceApi";
import { applyCachedTheme, applyTheme, cacheTheme } from "../theme/applyTheme";

const TenantContext = createContext({ isPlatform: true, tenant: null, loading: true, error: null, layoutTemplate: "classic", refreshTenant: () => {} });
export const useTenant = () => useContext(TenantContext);

const LAYOUT_TEMPLATE_CACHE_PREFIX = "commercehub-layout-template:";
function layoutTemplateCacheKey() {
  return `${LAYOUT_TEMPLATE_CACHE_PREFIX}${window.location.hostname}`;
}
// Same reasoning as applyCachedTheme: read whatever layout template was
// cached for this hostname last time, so repeat visits render the right
// template immediately instead of flashing Classic before the fetch below
// resolves. A brand-new store still briefly shows Classic on its very first
// visit until the fetch completes.
function cachedLayoutTemplate() {
  try {
    return localStorage.getItem(layoutTemplateCacheKey()) || "classic";
  } catch {
    return "classic";
  }
}
function cacheLayoutTemplate(id) {
  try {
    localStorage.setItem(layoutTemplateCacheKey(), id);
  } catch {
    /* storage unavailable (private browsing, quota, etc.) — non-fatal */
  }
}

// Apply whatever theme is cached for this hostname straight away, before the
// tenant/theme network calls resolve — this is what prevents a flash of the
// default (untitled) theme on repeat visits. First-ever visit to a store
// still briefly shows the default theme until the fetch below completes.
if (!isPlatformHost()) applyCachedTheme();

export function TenantProvider({ children }) {
  const platform = isPlatformHost();
  const [state, setState] = useState({
    isPlatform: platform,
    tenant: null,
    loading: !platform,
    error: null,
    layoutTemplate: platform ? "classic" : cachedLayoutTemplate(),
  });

  useEffect(() => {
    if (platform) return;
    let cancelled = false;
    resolveTenant()
      .then((tenant) => {
        if (cancelled) return;
        setState((s) => ({ ...s, isPlatform: false, tenant, loading: false, error: null }));
        // The theme and layout template are fetched separately from tenant
        // resolution (they live in store_themes/businesses, not the
        // domains/business row alone) so a slow fetch never blocks the
        // tenant-not-found/inactive checks above.
        applyThemeForTenant();
        applyLayoutTemplateForTenant(setState, cancelled);
      })
      .catch((error) => setState((s) => ({ ...s, isPlatform: false, tenant: null, loading: false, error: error.response?.data?.message || "This store is unavailable." })));
    return () => {
      cancelled = true;
    };
  }, [platform]);

  // Re-fetches theme + layout template without a full page reload — used
  // right after an admin changes either in Settings, so the change is
  // reflected immediately (e.g. in the "current" highlight on the picker).
  const refreshTenant = () => {
    if (platform) return;
    applyThemeForTenant();
    applyLayoutTemplateForTenant(setState, false);
  };

  return <TenantContext.Provider value={{ ...state, refreshTenant }}>{children}</TenantContext.Provider>;
}

function applyThemeForTenant() {
  api
    .publicTheme()
    .then((theme) => {
      applyTheme(theme);
      cacheTheme(theme);
    })
    .catch(() => {
      /* keep whatever cached/default theme is already applied */
    });
}

function applyLayoutTemplateForTenant(setState, cancelledAtCallTime) {
  api
    .publicLayoutTemplate()
    .then(({ layoutTemplate }) => {
      if (cancelledAtCallTime || !layoutTemplate) return;
      cacheLayoutTemplate(layoutTemplate);
      setState((s) => ({ ...s, layoutTemplate }));
    })
    .catch(() => {
      /* keep whatever cached/default layout template is already applied */
    });
}
