import { useEffect, useState } from "react";
import { api } from "../../api/commerceApi";

// Real store name/email/phone for the Contact page, via the public
// /settings/contact/public endpoint. No address field exists in
// store_settings yet, so there is deliberately no fabricated "Visit us"
// location — only show what's actually configured for this store.
export function useStoreContact() {
  const [contact, setContact] = useState(null);
  useEffect(() => {
    let active = true;
    api
      .publicContact()
      .then((data) => active && setContact(data))
      .catch(() => {
        /* leave null — caller decides what to render when contact info isn't set */
      });
    return () => {
      active = false;
    };
  }, []);
  return contact;
}
