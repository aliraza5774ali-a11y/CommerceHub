import { useEffect, useState } from "react";
import { api } from "../api/commerceApi";
import { getPageDef } from "../config/sitePages";

// Fetches the published hero banner content for a storefront page (by CMS
// slug) and merges it over that page's built-in defaults. Falls back to
// defaults entirely if nothing has been published yet, so a fresh store
// never shows a broken page.
export function useCmsHero(slug) {
  const pageDef = getPageDef(slug);
  const [hero, setHero] = useState(pageDef?.defaults || {});

  useEffect(() => {
    let active = true;
    api
      .storefrontPage(slug)
      .then((page) => {
        if (!active) return;
        const section = (page?.sections || []).find((s) => s.sectionType === "hero" && s.enabled !== false);
        if (section?.content) setHero({ ...pageDef.defaults, ...section.content });
      })
      .catch(() => {
        // No published page yet — keep defaults.
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return hero;
}
