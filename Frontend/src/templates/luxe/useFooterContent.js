import { useEffect, useState } from "react";
import { api } from "../../api/commerceApi";
import { DEFAULT_FOOTER_CONTENT, SITE_GLOBAL_SLUG } from "../../config/sitePages";

// Same pattern as templates/editorial/useFooterContent.js — real footer CMS
// content (brand name, tagline, copyright, social links, newsletter toggle),
// not hardcoded. Duplicated per-template rather than shared, to keep each
// template folder self-contained and independently swappable.
export function useFooterContent() {
  const [content, setContent] = useState(DEFAULT_FOOTER_CONTENT);
  useEffect(() => {
    let active = true;
    api
      .storefrontPage(SITE_GLOBAL_SLUG)
      .then((page) => {
        const section = (page?.sections || []).find((item) => item.sectionType === "footer" && item.enabled !== false);
        if (active && section?.content) {
          setContent({
            ...DEFAULT_FOOTER_CONTENT,
            ...section.content,
            social: { ...DEFAULT_FOOTER_CONTENT.social, ...(section.content.social || {}) },
          });
        }
      })
      .catch(() => {
        /* keep defaults */
      });
    return () => {
      active = false;
    };
  }, []);
  return content;
}
