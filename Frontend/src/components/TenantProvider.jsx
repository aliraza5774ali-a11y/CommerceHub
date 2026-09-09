/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { isPlatformHost } from "../api/apiClient";
import { resolveTenant } from "../api/commerceApi";
const TenantContext = createContext({ isPlatform: true, tenant: null, loading: true, error: null });
export const useTenant = () => useContext(TenantContext);
export function TenantProvider({ children }) {
  const platform = isPlatformHost();
  const [state, setState] = useState({ isPlatform: platform, tenant: null, loading: !platform, error: null });
  useEffect(() => {
    if (platform) return;
    resolveTenant().then((tenant) => setState({ isPlatform: false, tenant, loading: false, error: null }))
      .catch((error) => setState({ isPlatform: false, tenant: null, loading: false, error: error.response?.data?.message || "This store is unavailable." }));
  }, [platform]);
  return <TenantContext.Provider value={state}>{children}</TenantContext.Provider>;
}
