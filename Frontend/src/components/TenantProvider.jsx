/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { isPlatformHost } from "../api/apiClient";
import { resolveTenant, api } from "../api/commerceApi";
import { applyCachedTheme, applyTheme, cacheTheme } from "../theme/applyTheme";

const TenantContext = createContext({ isPlatform: true, tenant: null, loading: true, error: null });
export const useTenant = () => useContext(TenantContext);

// Apply whatever theme is cached for this hostname straight away, before the
// tenant/theme network calls resolve — this is what prevents a flash of the
// default (untitled) theme on repeat visits. First-ever visit to a store
// still briefly shows the default theme until the fetch below completes.
if (!isPlatformHost()) applyCachedTheme();

export function TenantProvider({ children }) {
  const platform = isPlatformHost();
  const [state, setState] = useState({ isPlatform: platform, tenant: null, loading: !platform, error: null });

  useEffect(() => {
    if (platform) return;
    let cancelled = false;
    resolveTenant()
      .then((tenant) => {
        if (cancelled) return;
        setState({ isPlatform: false, tenant, loading: false, error: null });
        // The theme is fetched separately from tenant resolution (it lives in
        // store_themes, not the domains/business row) so a slow theme fetch
        // never blocks the tenant-not-found/inactive checks above.
        applyThemeForTenant();
      })
      .catch((error) => setState({ isPlatform: false, tenant: null, loading: false, error: error.response?.data?.message || "This store is unavailable." }));
    return () => {
      cancelled = true;
    };
  }, [platform]);

  return <TenantContext.Provider value={state}>{children}</TenantContext.Provider>;
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
