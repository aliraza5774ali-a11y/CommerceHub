import { useTenant } from "../components/TenantProvider";

// Which full layout template (component set) the current storefront should
// render. Sourced from TenantProvider, which fetches/caches it alongside the
// color theme (see components/TenantProvider.jsx + api.publicLayoutTemplate).
export function useActiveTemplate() {
  const { layoutTemplate } = useTenant();
  return layoutTemplate || "classic";
}
