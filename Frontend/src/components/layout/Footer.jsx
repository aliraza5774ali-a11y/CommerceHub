import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsYoutube,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../api/commerceApi";
import { SITE_GLOBAL_SLUG, DEFAULT_FOOTER_CONTENT } from "../../config/sitePages";

const shopLinks = [
  { name: "Shop All", path: "/shops" },
  { name: "Collections", path: "/collections" },
];

const companyLinks = [
  { name: "About Us", path: "/about" },
  { name: "Blog", path: "/blog" },
];

const supportLinks = [
  { name: "Contact", path: "/contact" },
];

const Footer = () => {
  const [content, setContent] = useState(DEFAULT_FOOTER_CONTENT);

  useEffect(() => {
    let active = true;
    api
      .storefrontPage(SITE_GLOBAL_SLUG)
      .then((page) => {
        if (!active) return;
        const section = (page?.sections || []).find((s) => s.sectionType === "footer" && s.enabled !== false);
        if (section?.content) {
          setContent({
            ...DEFAULT_FOOTER_CONTENT,
            ...section.content,
            social: { ...DEFAULT_FOOTER_CONTENT.social, ...(section.content.social || {}) },
          });
        }
      })
      .catch(() => {
        // No published footer yet — keep defaults.
      });
    return () => {
      active = false;
    };
  }, []);

  const social = content.social || {};

  return (
    <footer className="bg-black text-white px-5 py-12 sm:px-8 md:px-12 lg:px-20 xl:px-28 sm:pt-14 sm:pb-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 sm:gap-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4 flex flex-col gap-6 max-w-md">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-semibold tracking-wide">{content.brandName}</h2>
              <p className="text-sm leading-relaxed text-white/55">
                {content.tagline}
              </p>
            </div>

            {content.newsletterEnabled && (
              <div className="flex flex-col gap-3">
                <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                  Stay in the loop
                </p>

                <form className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/30"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8">
            <div className="flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                Shop
              </p>
              <ul className="flex flex-col gap-3 text-sm text-white/70">
  {shopLinks.map((link) => (
    <li key={link.path}>
      <Link to={link.path} className="transition hover:text-white">
        {link.name}
      </Link>
    </li>
  ))}
</ul>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                Company
              </p>
              <ul className="flex flex-col gap-3 text-sm text-white/70">
  {companyLinks.map((link) => (
    <li key={link.path}>
      <Link to={link.path} className="transition hover:text-white">
        {link.name}
      </Link>
    </li>
  ))}
</ul>
            </div>

            <div className="col-span-2 flex flex-col gap-4 sm:col-span-1">
              <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                Support
              </p>
              <ul className="flex flex-col gap-3 text-sm text-white/70">
  {supportLinks.map((link) => (
    <li key={link.path}>
      <Link to={link.path} className="transition hover:text-white">
        {link.name}
      </Link>
    </li>
  ))}
</ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10" />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-white/30">
            {content.copyrightText}
          </p>

          <div className="flex items-center gap-4">
            {social.instagram && (
              <a href={social.instagram} target="_blank" rel="noreferrer">
                <BsInstagram className="cursor-pointer text-white/40 transition hover:text-white" size={16} />
              </a>
            )}
            {social.twitter && (
              <a href={social.twitter} target="_blank" rel="noreferrer">
                <BsTwitter className="cursor-pointer text-white/40 transition hover:text-white" size={16} />
              </a>
            )}
            {social.facebook && (
              <a href={social.facebook} target="_blank" rel="noreferrer">
                <BsFacebook className="cursor-pointer text-white/40 transition hover:text-white" size={16} />
              </a>
            )}
            {social.youtube && (
              <a href={social.youtube} target="_blank" rel="noreferrer">
                <BsYoutube className="cursor-pointer text-white/40 transition hover:text-white" size={16} />
              </a>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-white/30 sm:gap-6 md:justify-end">
            <span className="cursor-pointer transition hover:text-white/60">
              Privacy Policy
            </span>
            <span className="cursor-pointer transition hover:text-white/60">
              Terms of Use
            </span>
            <span className="cursor-pointer transition hover:text-white/60">
              Cookie Settings
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;