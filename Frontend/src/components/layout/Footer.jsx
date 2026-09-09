import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsYoutube,
} from "react-icons/bs";
import { Link } from "react-router-dom";

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
  return (
    <footer className="bg-black text-white px-5 py-12 sm:px-8 md:px-12 lg:px-20 xl:px-28 sm:pt-14 sm:pb-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 sm:gap-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4 flex flex-col gap-6 max-w-md">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-semibold tracking-wide">VELOUR</h2>
              <p className="text-sm leading-relaxed text-white/55">
                Minimal luxury for those who dress with intention. Curated drops,
                timeless pieces.
              </p>
            </div>

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
            © 2026 VELOUR. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <BsInstagram className="cursor-pointer text-white/40 transition hover:text-white" size={16} />
            <BsTwitter className="cursor-pointer text-white/40 transition hover:text-white" size={16} />
            <BsFacebook className="cursor-pointer text-white/40 transition hover:text-white" size={16} />
            <BsYoutube className="cursor-pointer text-white/40 transition hover:text-white" size={16} />
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