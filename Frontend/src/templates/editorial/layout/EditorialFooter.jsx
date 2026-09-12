import { BsFacebook, BsInstagram, BsTwitter, BsYoutube } from "react-icons/bs";
import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const shopLinks = [
  { name: "Shop all", path: "/shops" },
  { name: "Collections", path: "/collections" },
];
const companyLinks = [
  { name: "Our story", path: "/about" },
  { name: "Journal", path: "/blog" },
];
const supportLinks = [{ name: "Contact", path: "/contact" }];

const DUMMY_FOOTER = {
  brandName: "Homedine",
  tagline: "Eco-friendly kitchenware for a greener home — natural materials, thoughtfully sourced.",
  copyrightText: "© 2026 Homedine. All rights reserved.",
  social: {
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
  },
};

// Fully standalone footer — dummy brand copy and social links, no CMS fetch.
export default function EditorialFooter() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const content = DUMMY_FOOTER;
  const social = content.social;

  return (
    <footer className="bg-[var(--forest)] px-5 py-14 text-[var(--paper)] sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="flex max-w-md flex-col gap-5 lg:col-span-4">
            <div className="flex items-center gap-2">
              <Leaf size={20} className="text-[var(--gold)]" />
              <h2 className="editorial-display text-2xl">{content.brandName}</h2>
            </div>
            <p className="text-sm leading-relaxed text-[var(--paper)]/60">{content.tagline}</p>

            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--paper)]/40">Stay in the loop</p>
              {joined ? (
                <p className="text-sm text-[var(--gold)]">You're on the list — welcome aboard.</p>
              ) : (
                <form
                  className="flex border-b border-[var(--paper)]/25 pb-1"
                  onSubmit={(e) => { e.preventDefault(); if (email) setJoined(true); }}
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-[var(--paper)]/35"
                  />
                  <button type="submit" className="text-xs uppercase tracking-[0.15em] text-[var(--gold)]">
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8">
            <div className="flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--paper)]/40">Shop</p>
              <ul className="flex flex-col gap-3 text-sm text-[var(--paper)]/75">
                {shopLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="transition hover:text-[var(--gold)]">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--paper)]/40">Studio</p>
              <ul className="flex flex-col gap-3 text-sm text-[var(--paper)]/75">
                {companyLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="transition hover:text-[var(--gold)]">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 flex flex-col gap-4 sm:col-span-1">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--paper)]/40">Support</p>
              <ul className="flex flex-col gap-3 text-sm text-[var(--paper)]/75">
                {supportLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="transition hover:text-[var(--gold)]">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--paper)]/10" />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-[var(--paper)]/40">{content.copyrightText}</p>

          <div className="flex items-center gap-4">
            <a href={social.instagram} target="_blank" rel="noreferrer"><BsInstagram className="text-[var(--paper)]/50 transition hover:text-[var(--gold)]" size={16} /></a>
            <a href={social.twitter} target="_blank" rel="noreferrer"><BsTwitter className="text-[var(--paper)]/50 transition hover:text-[var(--gold)]" size={16} /></a>
            <a href={social.facebook} target="_blank" rel="noreferrer"><BsFacebook className="text-[var(--paper)]/50 transition hover:text-[var(--gold)]" size={16} /></a>
            <a href={social.youtube} target="_blank" rel="noreferrer"><BsYoutube className="text-[var(--paper)]/50 transition hover:text-[var(--gold)]" size={16} /></a>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--paper)]/40 sm:gap-6 md:justify-end">
            <span className="cursor-pointer transition hover:text-[var(--paper)]/70">Privacy Policy</span>
            <span className="cursor-pointer transition hover:text-[var(--paper)]/70">Terms of Use</span>
            <span className="cursor-pointer transition hover:text-[var(--paper)]/70">Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
