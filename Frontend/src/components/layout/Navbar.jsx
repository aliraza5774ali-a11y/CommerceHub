import { Handbag, Search, User, List, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  openCart,
  closeCart,
  openSearch,
  closeSearch,
} from "../../store/slice/Uislice";
import CartSidebar from "../cart/CartSidebar";
import SearchModal from "../searchModal";
import { BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";
import { useTenant } from "../TenantProvider";

const NAV_LINKS = [
  { name: "HOME", path: "/" },
  { name: "ABOUT", path: "/about" },
  { name: "SHOP", path: "/shops" },
  { name: "COLLECTION", path: "/collections" },
  { name: "BLOG", path: "/blog" },
  { name: "CONTACT", path: "/contact" },
];

const Navbar = () => {
  const { tenant } = useTenant();
  const location = useLocation();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart.items.reduce((total, item) => total + item.quantity, 0));
  const isCartOpen = useSelector((state) => state.ui.isCartOpen);
  const isSearchOpen = useSelector((state) => state.ui.isSearchOpen);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const whiteNavbarPages = ["/checkout", "/cart", "/product", "/shop/:slug"];

const isWhiteNavbar = whiteNavbarPages.some((pattern) => {
  const regexStr = "^" + pattern.replace(/:[^/]+/g, "[^/]+") + "(/.*)?$";
  return new RegExp(regexStr).test(location.pathname);
});

const navbarSolid = isWhiteNavbar || isScrolled || isMobileMenuOpen;
 useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

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

  const iconClass = (variant = "default") => {
    if (variant === "ghost") {
      return `cursor-pointer rounded-full p-2 backdrop-blur-lg transition-colors duration-200 ${
        navbarSolid
          ? "bg-black/10 text-black hover:bg-black/15"
          : "bg-white/15 text-white hover:bg-white/25"
      }`;
    }
    return `cursor-pointer rounded-full p-2 transition-colors duration-200 ${
      navbarSolid
        ? "bg-black text-white hover:bg-black/80"
        : "bg-white text-black hover:bg-white/90"
    }`;
  };

  return (
    <>
      <nav
  className={`fixed top-0 left-0 z-50 w-full px-4 py-4 transition-all duration-300 md:px-7 md:py-6 ${
    navbarSolid
      ? "bg-[#f8f8f8] text-black shadow-sm backdrop-blur-xl"
      : "bg-transparent"
  }`}
>
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            to="/"
            className={`cursor-pointer font-display text-[22px] font-semibold tracking-wide transition-all duration-200 md:text-[24px] ${
              navbarSolid
                ? "text-black hover:text-black/60"
                : "text-white hover:text-white/70"
            }`}
          >
            {tenant?.name || "CommerceHub"}
          </Link>

          <div className="hidden items-center lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-2 font-sans text-[13px] font-medium uppercase tracking-[0.06em] no-underline transition-colors duration-200 after:absolute after:bottom-1 after:left-4 after:right-4 after:h-px after:origin-left after:bg-accent after:transition-transform after:duration-200 after:content-[''] ${
  isActive
    ? `after:scale-x-100 ${navbarSolid ? "text-black" : "text-white"}`
    : `after:scale-x-0 ${navbarSolid ? "text-black/70 hover:text-black" : "text-white/80 hover:text-white"} hover:after:scale-x-100`
}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => dispatch(openSearch())}
              className={iconClass("ghost")}
              aria-label="Open search"
            >
              <Search size={16} />
            </button>
            <button
              onClick={() => dispatch(openCart())}
              className={`${iconClass()} relative`}
              aria-label="Open cart"
            >
              <Handbag size={16} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-accent-ink">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
            <Link
              to={auth.isAuthenticated ? (auth.user?.roleName === "Owner" ? "/admin" : "/account") : "/login"}
              className={iconClass()}
              aria-label={auth.isAuthenticated ? "Open account" : "Open login"}
            >
              <User size={16} />
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className={`ml-1 cursor-pointer rounded-full p-2 transition-colors duration-200 lg:hidden ${
                navbarSolid
                  ? "bg-black/10 text-black hover:bg-black/15"
                  : "bg-black/20 text-white hover:bg-black/30"
              }`}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={18} /> : <List size={18} />}
            </button>
          </div>
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
          className="absolute inset-0 bg-black/35 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />

        <div
          className={`absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-[#f8f8f8] shadow-2xl transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-5">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="font-display text-[20px] font-semibold tracking-wide text-black"
            >
              {tenant?.name || "CommerceHub"}
            </Link>

            <button
              onClick={closeMobileMenu}
              className="rounded-full bg-black/5 p-2 text-black transition-colors hover:bg-black/10"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6">
            <div className="mb-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-black/40">
                Navigate
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={closeMobileMenu}
                    style={{
                      transitionDelay: isMobileMenuOpen ? `${i * 50}ms` : "0ms",
                    }}
                    className={`group flex items-center justify-between rounded-2xl border px-4 py-4 font-sans text-[13px] font-medium uppercase tracking-[0.12em] transition-all duration-300 ${
                      isMobileMenuOpen
                        ? "translate-x-0 opacity-100"
                        : "translate-x-3 opacity-0"
                    } ${
                      isActive
                        ? "border-accent bg-accent/10 text-black"
                        : "border-black/10 bg-white text-black/70 hover:border-black/20 hover:bg-white hover:text-black"
                    }`}
                  >
                    <span>{link.name}</span>
                    <span
                      className={`h-2 w-2 rounded-full transition-all duration-200 ${
                        isActive
                          ? "bg-accent"
                          : "bg-black/20 group-hover:bg-black/40"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 rounded-3xl bg-black px-5 py-5 text-white">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
                New season
              </p>
              <p className="mt-3 text-[15px] leading-6 text-white/90">
                Explore elevated essentials, curated drops, and timeless pieces.
              </p>

              <div className="mt-5 flex items-center gap-3">
                <a href="/" className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20" aria-label="Instagram">
                  <BsInstagram size={16} />
                </a>
                <a href="/" className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20" aria-label="Facebook">
                  <BsFacebook size={16} />
                </a>
                <a href="/" className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20" aria-label="Twitter">
                  <BsTwitter size={16} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-black/10 px-5 py-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-black/40">
              Free shipping on orders over $150
            </p>
          </div>
        </div>
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => dispatch(closeCart())} />
      <SearchModal isOpen={isSearchOpen} onClose={() => dispatch(closeSearch())} />
    </>
  );
};

export default Navbar;
