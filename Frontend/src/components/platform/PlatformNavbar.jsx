import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { List, X } from "lucide-react";

const NAV_LINKS = [
  { name: "Features", href: "#features" },
  { name: "How it works", href: "#how-it-works" },
  { name: "Showcase", href: "#showcase" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

const PlatformNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isSolid = isScrolled || isMobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 z-50 w-full px-4 py-3.5 transition-all duration-300 sm:px-6 lg:px-10 lg:py-4 xl:px-16 ${
          isSolid
            ? "border-b border-black/8 bg-white/95 shadow-sm backdrop-blur-xl"
            : "border-b border-transparent bg-white/80 backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            className="flex items-center gap-2 font-display text-[20px] font-semibold tracking-wide text-black transition-colors duration-200 hover:text-black/70 md:text-[22px]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-black">
              C
            </span>
            CommerceHub
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative px-3.5 py-2 font-sans text-[12.5px] font-medium uppercase tracking-[0.06em] text-black/60 no-underline transition-colors duration-200 after:absolute after:bottom-1 after:left-3.5 after:right-3.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-200 after:content-[''] hover:text-black hover:after:scale-x-100"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <Link
              to="/login"
              className="font-sans text-[12.5px] font-medium uppercase tracking-[0.08em] text-black/60 no-underline transition-colors duration-200 hover:text-black"
            >
              Sign in
            </Link>
            <Link
              to="/open-store"
              className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-[13px] font-semibold text-black transition-all duration-200 hover:bg-[#bce800] active:scale-[0.97]"
            >
              Open a Store
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="ml-1 cursor-pointer rounded-full bg-black/5 p-2 text-black transition-colors duration-200 hover:bg-black/10 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={18} /> : <List size={18} />}
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />

        <div
          className={`absolute right-0 top-0 flex h-full w-full max-w-[380px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-black/8 px-5 py-5">
            <span className="font-display text-[20px] font-semibold tracking-wide text-black">
              CommerceHub
            </span>
            <button
              onClick={closeMobileMenu}
              className="rounded-full bg-black/5 p-2 text-black transition-colors hover:bg-black/10"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6">
            <p className="mb-6 font-sans text-[11px] font-medium uppercase tracking-[0.35em] text-black/40">
              Navigate
            </p>
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="rounded-3xl border border-black/8 bg-black/[0.02] px-4 py-4 font-sans text-[13px] font-medium uppercase tracking-[0.12em] text-black/70 shadow-sm transition-all duration-200 hover:border-black/15 hover:text-black"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <Link
              to="/open-store"
              onClick={closeMobileMenu}
              className="mt-8 flex items-center justify-center rounded-full bg-accent px-5 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-[#bce800]"
            >
              Open a Store
            </Link>
            <Link
              to="/login"
              onClick={closeMobileMenu}
              className="mt-3 flex items-center justify-center rounded-full border border-black/12 px-5 py-3.5 text-sm font-semibold text-black transition-colors hover:border-black/25"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlatformNavbar;