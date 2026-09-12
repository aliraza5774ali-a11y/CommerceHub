import { Heart, Search, ShoppingBag, User, List, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openCart, closeCart, openSearch, closeSearch } from "../../../store/slice/Uislice";
import CartSidebar from "../../../components/cart/CartSidebar";
import SearchModal from "../../../components/searchModal";
import { useTenant } from "../../../components/TenantProvider";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Clothing", path: "/shops" },
  { name: "Bags", path: "/collections" },
  { name: "Shoes", path: "/shops" },
  { name: "Accessories", path: "/collections" },
];

// Luxe's own navbar — a slim promo utility bar above a white nav, matching
// the reference's "Free shipping..." strip + serif wordmark layout.
export default function LuxeNavbar() {
  const { tenant } = useTenant();
  const location = useLocation();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart.items.reduce((total, item) => total + item.quantity, 0));
  const isCartOpen = useSelector((state) => state.ui.isCartOpen);
  const isSearchOpen = useSelector((state) => state.ui.isSearchOpen);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <div className="flex items-center justify-between bg-[var(--blush)] px-4 py-2 text-[11px] uppercase tracking-[.08em] text-[var(--ink)] sm:px-8">
        <span>Free shipping over $200 — Returns within 30 days</span>
        <div className="hidden items-center gap-4 sm:flex">
          <span>English</span>
          <span>USD</span>
        </div>
      </div>

      <nav className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--paper)] px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-8">
            <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
              <List size={20} />
            </button>
            <div className="hidden items-center gap-6 lg:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm transition-colors ${
                    location.pathname === link.path ? "text-[var(--ink)]" : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/" className="luxe-display absolute left-1/2 -translate-x-1/2 text-2xl tracking-[.15em]">
            {(tenant?.name || "Luxe").toUpperCase()}
          </Link>

          <div className="flex items-center gap-4">
            <button onClick={() => dispatch(openSearch())} className="hidden items-center gap-2 rounded-full border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--ink-soft)] sm:flex" aria-label="Search">
              <Search size={14} /> Search
            </button>
            <button onClick={() => dispatch(openSearch())} className="luxe-icon-btn sm:hidden" aria-label="Search">
              <Search size={18} />
            </button>
            <Link to="/account/wishlist" className="luxe-icon-btn" aria-label="Wishlist">
              <Heart size={18} />
            </Link>
            <button onClick={() => dispatch(openCart())} className="luxe-icon-btn relative" aria-label="Open bag">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--ink)] px-1 text-[10px] font-bold leading-none text-[var(--paper)]">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
            <Link
              to={auth.isAuthenticated ? (auth.user?.roleName === "Owner" ? "/admin" : "/account") : "/login"}
              className="hidden items-center gap-1 text-sm sm:flex"
            >
              <User size={16} /> {auth.isAuthenticated ? "Account" : "Login"}
            </Link>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-[var(--ink)]/40" onClick={closeMobileMenu} />
        <div
          className={`absolute left-0 top-0 flex h-full w-full max-w-[340px] flex-col bg-[var(--paper)] transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-5">
            <span className="luxe-display text-xl tracking-[.1em]">{(tenant?.name || "Luxe").toUpperCase()}</span>
            <button onClick={closeMobileMenu} aria-label="Close menu"><X size={20} /></button>
          </div>
          <div className="flex flex-col gap-1 px-5 py-6">
            {NAV_LINKS.map((link) => (
              <Link key={link.name} to={link.path} onClick={closeMobileMenu} className="border-b border-[var(--line)] py-3 text-sm uppercase tracking-[.08em]">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => dispatch(closeCart())} />
      <SearchModal isOpen={isSearchOpen} onClose={() => dispatch(closeSearch())} />
    </>
  );
}
