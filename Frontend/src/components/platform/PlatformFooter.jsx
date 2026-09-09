import { BsFacebook, BsInstagram, BsTwitter, BsYoutube } from "react-icons/bs";
import { Link } from "react-router-dom";

const productLinks = [
  { name: "Features", href: "#features" },
  { name: "How it works", href: "#how-it-works" },
  { name: "Showcase", href: "#showcase" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

const companyLinks = [
  { name: "About", href: "#" },
  { name: "Careers", href: "#" },
  { name: "Blog", href: "#" },
];

const resourceLinks = [
  { name: "Help Center", href: "#" },
  { name: "Status", href: "#" },
  { name: "Contact", href: "#" },
];

const PlatformFooter = () => {
  return (
    <footer className="bg-[#f8f8f8] px-5 py-12 text-black sm:px-8 sm:pb-8 sm:pt-14 md:px-12 lg:px-20 xl:px-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 sm:gap-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="flex max-w-md flex-col gap-3 lg:col-span-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#cfff04] text-xs font-bold text-black">
                C
              </span>
              <h2 className="font-display text-2xl font-semibold tracking-wide">
                CommerceHub
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-black/55">
              The platform for launching and running fully functional online
              stores — storefront, orders and dashboard included.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8">
            <div className="flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.2em] text-black/40">Product</p>
              <ul className="flex flex-col gap-3 text-sm text-black/65">
                {productLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="transition hover:text-black">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.2em] text-black/40">Company</p>
              <ul className="flex flex-col gap-3 text-sm text-black/65">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="transition hover:text-black">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 flex flex-col gap-4 sm:col-span-1">
              <p className="text-xs uppercase tracking-[0.2em] text-black/40">Resources</p>
              <ul className="flex flex-col gap-3 text-sm text-black/65">
                {resourceLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="transition hover:text-black">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-black/8" />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-black/35">
            © {new Date().getFullYear()} CommerceHub. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <BsInstagram className="cursor-pointer text-black/40 transition hover:text-black" size={16} />
            <BsTwitter className="cursor-pointer text-black/40 transition hover:text-black" size={16} />
            <BsFacebook className="cursor-pointer text-black/40 transition hover:text-black" size={16} />
            <BsYoutube className="cursor-pointer text-black/40 transition hover:text-black" size={16} />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-black/35 sm:gap-6 md:justify-end">
            <span className="cursor-pointer transition hover:text-black/60">Privacy Policy</span>
            <span className="cursor-pointer transition hover:text-black/60">Terms of Use</span>
            <Link to="/open-store" className="cursor-pointer transition hover:text-black/60">
              Open a Store
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PlatformFooter;