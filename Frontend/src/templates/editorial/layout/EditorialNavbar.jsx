import { Handbag, Search, User, List, X, Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openCart, closeCart, openSearch, closeSearch } from "../../../store/slice/Uislice";
import CartSidebar from "../../../components/cart/CartSidebar";
import SearchModal from "../../../components/searchModal";
import { BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";
import { useTenant } from "../../../components/TenantProvider";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shops" },
  { name: "Collections", path: "/collections" },
  { name: "About", path: "/about" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

// Editorial's own navbar — independent from the Classic template's Navbar.
// Same underlying cart/search/auth/tenant wiring, but its own markup,
// typography (serif wordmark) and forest/cream/gold styling.
export default function EditorialNavbar() {
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
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const iconBtn = `flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 ${
    navbarSolid
      ? "bg-[var(--forest)]/10 text-[var(--forest)] hover:bg-[var(--forest)]/15"
      : "bg-[var(--paper)]/15 text-[var(--paper)] hover:bg-[var(--paper)]/25"
  }`;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 z-50 w-full px-4 py-4 transition-all duration-300 md:px-8 md:py-5 ${
          navbarSolid ? "bg-[var(--paper)] text-[var(--forest)] shadow-sm backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            to="/"
            className={`editorial-display flex items-center gap-2 text-[22px] tracking-wide transition-colors duration-200 md:text-[26px] ${
              navbarSolid ? "text-[var(--forest)]" : "text-[var(--paper)]"
            }`}
          >
            <Leaf size={20} className="text-[var(--gold)]" />
            {tenant?.name || "Homedine"}
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-2 text-[13px] font-medium uppercase tracking-[0.1em] transition-colors duration-200 after:absolute after:bottom-1 after:left-4 after:right-4 after:h-px after:origin-left after:bg-[var(--gold)] after:transition-transform after:duration-200 after:content-[''] ${
                    isActive
                      ? `after:scale-x-100 ${navbarSolid ? "text-[var(--forest)]" : "text-[var(--paper)]"}`
                      : `after:scale-x-0 hover:after:scale-x-100 ${
                          navbarSolid ? "text-[var(--forest)]/70 hover:text-[var(--forest)]" : "text-[var(--paper)]/80 hover:text-[var(--paper)]"
                        }`
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => dispatch(openSearch())} className={iconBtn} aria-label="Open search">
              <Search size={16} />
            </button>
            <button onClick={() => dispatch(openCart())} className={`${iconBtn} relative`} aria-label="Open cart">
              <Handbag size={16} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--gold)] px-1 text-[10px] font-bold leading-none text-[var(--forest-dark)]">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
            <Link
              to={auth.isAuthenticated ? (auth.user?.roleName === "Owner" ? "/admin" : "/account") : "/login"}
              className={iconBtn}
              aria-label={auth.isAuthenticated ? "Open account" : "Open login"}
            >
              <User size={16} />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className={`${iconBtn} lg:hidden`}
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
          isMobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-[var(--forest-dark)]/50 backdrop-blur-sm" onClick={closeMobileMenu} />

        <div
          className={`absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-[var(--paper)] shadow-2xl transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-[var(--forest)]/10 px-5 py-5">
            <Link to="/" onClick={closeMobileMenu} className="editorial-display text-[20px] text-[var(--forest)]">
              {tenant?.name || "Homedine"}
            </Link>
            <button onClick={closeMobileMenu} className="rounded-full bg-[var(--forest)]/5 p-2 text-[var(--forest)] hover:bg-[var(--forest)]/10" aria-label="Close menu">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6">
            <p className="mb-6 text-[11px] uppercase tracking-[0.3em] text-[var(--forest)]/40">Navigate</p>
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={closeMobileMenu}
                    style={{ transitionDelay: isMobileMenuOpen ? `${i * 50}ms` : "0ms" }}
                    className={`group flex items-center justify-between rounded-2xl border px-4 py-4 text-[13px] font-medium uppercase tracking-[0.1em] transition-all duration-300 ${
                      isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"
                    } ${
                      isActive
                        ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--forest)]"
                        : "border-[var(--forest)]/10 bg-white text-[var(--forest)]/70 hover:border-[var(--forest)]/20 hover:text-[var(--forest)]"
                    }`}
                  >
                    <span>{link.name}</span>
                    <span className={`h-2 w-2 rounded-full ${isActive ? "bg-[var(--gold)]" : "bg-[var(--forest)]/20 group-hover:bg-[var(--forest)]/40"}`} />
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 rounded-3xl bg-[var(--forest)] px-5 py-5 text-[var(--paper)]">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[var(--gold)]">New season</p>
              <p className="editorial-display mt-3 text-lg leading-6">Planet-friendly kitchenware for a greener home.</p>
              <div className="mt-5 flex items-center gap-3">
                <a href="/" className="rounded-full bg-[var(--paper)]/10 p-2 hover:bg-[var(--paper)]/20" aria-label="Instagram"><BsInstagram size={16} /></a>
                <a href="/" className="rounded-full bg-[var(--paper)]/10 p-2 hover:bg-[var(--paper)]/20" aria-label="Facebook"><BsFacebook size={16} /></a>
                <a href="/" className="rounded-full bg-[var(--paper)]/10 p-2 hover:bg-[var(--paper)]/20" aria-label="Twitter"><BsTwitter size={16} /></a>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--forest)]/10 px-5 py-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--forest)]/40">Free shipping on orders over $150</p>
          </div>
        </div>
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => dispatch(closeCart())} />
      <SearchModal isOpen={isSearchOpen} onClose={() => dispatch(closeSearch())} />
    </>
  );
}
