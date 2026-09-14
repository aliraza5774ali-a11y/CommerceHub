import { Link } from "react-router-dom";
import { useState } from "react";
import { useTenant } from "../../../components/TenantProvider";

const columns = [
  { title: "Product", links: ["Accessories", "Sneakers", "T-Shirts & Pants", "Jackets & Blazers"] },
  { title: "Support", links: ["Support Center", "FAQs", "Troubleshooting", "Feedback"] },
  { title: "Company", links: ["About Us", "Careers", "Blog", "Contact"] },
  { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Compliance"] },
];

export default function VibrantFooter() {
  const { tenant } = useTenant();
  const name = tenant?.name || "Frolax";
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <footer className="bg-[var(--ink)] text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="max-w-sm">
            <h2 className="vibrant-display text-2xl">Level Up Your Outfits with {name}</h2>
            <p className="mt-4 text-sm leading-6 text-white/60">
              Subscribe to our newsletter for news, exclusive offers, and community events. Don't miss updates!
            </p>
            {!joined ? (
              <form
                onSubmit={(e) => { e.preventDefault(); if (email) setJoined(true); }}
                className="mt-6 flex max-w-sm items-center gap-2 rounded-full bg-white/10 p-1.5"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-transparent px-3 py-2 text-sm outline-none placeholder:text-white/40"
                />
                <button type="submit" className="vibrant-btn vibrant-btn-solid shrink-0">Subscribe</button>
              </form>
            ) : (
              <p className="mt-6 text-sm text-white/70">You're subscribed — welcome to the list.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:justify-items-end">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold text-white/80">{col.title}</p>
                <ul className="mt-4 space-y-3 text-sm text-white/50">
                  {col.links.map((l) => (
                    <li key={l}><Link to="/" className="hover:text-white">{l}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-white/40">© 2026 {name}. All rights reserved.</p>
        </div>
      </div>

      <div className="overflow-hidden border-t border-white/10 px-5 py-6">
        <p
          className="vibrant-display select-none whitespace-nowrap text-center text-[16vw] leading-none sm:text-[9rem]"
          style={{ WebkitTextStroke: "1.5px #f2711c", color: "transparent" }}
        >
          {name} ©
        </p>
      </div>
    </footer>
  );
}
