import { BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useState } from "react";

const shopLinks = [
  { name: "Clothing", path: "/shops" },
  { name: "Bags", path: "/collections" },
  { name: "Shoes", path: "/shops" },
  { name: "Accessories", path: "/collections" },
];
const helpLinks = [
  { name: "Contact us", path: "/contact" },
  { name: "Shipping & returns", path: "/contact" },
  { name: "Size guide", path: "/contact" },
];
const aboutLinks = [
  { name: "Our story", path: "/about" },
  { name: "Journal", path: "/blog" },
];

export default function LuxeFooter() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--paper)] px-5 py-14 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-2">
            <span className="luxe-display text-2xl tracking-[.12em]">LUXE</span>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[var(--ink-soft)]">
              Premium clothing and statement accessories, curated for every season.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="/" aria-label="Instagram" className="luxe-icon-btn border border-[var(--line)]"><BsInstagram size={14} /></a>
              <a href="/" aria-label="Facebook" className="luxe-icon-btn border border-[var(--line)]"><BsFacebook size={14} /></a>
              <a href="/" aria-label="Twitter" className="luxe-icon-btn border border-[var(--line)]"><BsTwitter size={14} /></a>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[.15em] text-[var(--ink-soft)]">Shop</p>
            <ul className="mt-4 space-y-3 text-sm">
              {shopLinks.map((l) => (
                <li key={l.name}><Link to={l.path} className="text-[var(--ink-soft)] hover:text-[var(--ink)]">{l.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[.15em] text-[var(--ink-soft)]">About</p>
            <ul className="mt-4 space-y-3 text-sm">
              {aboutLinks.map((l) => (
                <li key={l.name}><Link to={l.path} className="text-[var(--ink-soft)] hover:text-[var(--ink)]">{l.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[.15em] text-[var(--ink-soft)]">Help</p>
            <ul className="mt-4 space-y-3 text-sm">
              {helpLinks.map((l) => (
                <li key={l.name}><Link to={l.path} className="text-[var(--ink-soft)] hover:text-[var(--ink)]">{l.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[var(--line)] pt-6">
          {!joined ? (
            <form
              onSubmit={(e) => { e.preventDefault(); if (email) setJoined(true); }}
              className="flex max-w-sm items-center gap-2 border-b border-[var(--ink)] pb-1"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Join & get 10% off"
                className="w-full bg-transparent py-1 text-sm outline-none placeholder:text-[var(--ink-soft)]"
              />
              <button type="submit" className="text-xs uppercase tracking-[.1em]">Join</button>
            </form>
          ) : (
            <p className="text-sm text-[var(--ink-soft)]">You're on the list — check your inbox for 10% off.</p>
          )}
          <p className="mt-6 text-xs text-[var(--ink-soft)]">© 2026 Luxe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
