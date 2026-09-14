import { Link } from "react-router-dom";
import { useState } from "react";
import { useTenant } from "../../../components/TenantProvider";

const columns = [
  { title: "Shop", links: ["All shirts", "New arrivals", "Best sellers", "Limited collection"] },
  { title: "Help", links: ["Track order", "Shipping & returns", "Exchange policy", "FAQs"] },
  { title: "About", links: ["Our story", "Journal", "Careers", "Contact"] },
];
const follow = ["Instagram", "TikTok", "Pinterest"];

export default function TexartFooter() {
  const { tenant } = useTenant();
  const name = tenant?.name || "Texart";
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <footer className="bg-[var(--ink)] text-[var(--paper)]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="texart-display text-4xl italic text-[var(--lime)]">{name}</p>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[var(--paper)]/55">
              Check shirts for the wonderfully unpredictable.
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--paper)]/70">Get the good stuff in your inbox.</p>
            {!joined ? (
              <form
                onSubmit={(e) => { e.preventDefault(); if (email) setJoined(true); }}
                className="mt-3 flex max-w-sm items-center gap-2 rounded-full bg-white/10 p-1.5"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[var(--paper)]/35"
                />
                <button type="submit" className="texart-btn shrink-0 bg-[var(--lime)] text-[var(--ink)]">Join</button>
              </form>
            ) : (
              <p className="mt-3 text-sm text-[var(--lime)]">You're on the list.</p>
            )}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs uppercase tracking-[.15em] text-[var(--paper)]/40">{col.title}</p>
              <ul className="mt-4 space-y-3 text-sm text-[var(--paper)]/70">
                {col.links.map((l) => (
                  <li key={l}><Link to="/" className="hover:text-white">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="text-xs uppercase tracking-[.15em] text-[var(--paper)]/40">Follow</p>
            <ul className="mt-4 space-y-3 text-sm text-[var(--paper)]/70">
              {follow.map((l) => <li key={l}><a href="/" className="hover:text-white">{l}</a></li>)}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-[var(--paper)]/40 sm:flex-row sm:items-center">
          <p>© 2026 {name}. Made with love in Bangladesh.</p>
          <p>Visa · Mastercard · bKash · Nagad</p>
        </div>
      </div>
    </footer>
  );
}
