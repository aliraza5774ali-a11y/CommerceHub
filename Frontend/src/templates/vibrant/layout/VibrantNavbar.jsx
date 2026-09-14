import { Leaf, Search, ShoppingBag, User, List, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openCart, closeCart, openSearch, closeSearch } from "../../../store/slice/Uislice";
import CartSidebar from "../../../components/cart/CartSidebar";
import SearchModal from "../../../components/searchModal";
import { useTenant } from "../../../components/TenantProvider";

const NAV_LINKS = [
  { name: "About", path: "/about" },
  { name: "Shop", path: "/shops" },
  { name: "Collection", path: "/collections" },
  { name: "Blog", path: "/blog" },
  { name: "Reviews", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

export default function VibrantNavbar() {
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

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[var(--cream)] px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="vibrant-display flex items-center gap-1.5 text-xl">
            <Leaf size={18} className="text-[var(--sun)]" />
            {tenant?.name || "Frolax"}
          </Link>

          <div className="hidden items-center gap-1 rounded-full bg-white px-2 py-1.5 shadow-sm lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  location.pathname === link.path ? "bg-[var(--sun)] text-white" : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => dispatch(openSearch())} className="vibrant-icon-btn" aria-label="Search"><Search size={16} /></button>
            <button onClick={() => dispatch(openCart())} className="vibrant-icon-btn relative" aria-label="Open bag">
              <ShoppingBag size={16} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--ink)] px-1 text-[10px] font-bold leading-none text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
            <Link
              to={auth.isAuthenticated ? (auth.user?.roleName === "Owner" ? "/admin" : "/account") : "/login"}
              className="vibrant-icon-btn"
              aria-label={auth.isAuthenticated ? "Account" : "Login"}
            >
              <User size={16} />
            </Link>
            <button onClick={() => setIsMobileMenuOpen(true)} className="vibrant-icon-btn lg:hidden" aria-label="Menu"><List size={16} /></button>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}>
        <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute right-0 top-0 flex h-full w-full max-w-[320px] flex-col bg-[var(--cream)] transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between px-5 py-5">
            <span className="vibrant-display text-lg">{tenant?.name || "Frolax"}</span>
            <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close"><X size={20} /></button>
          </div>
          <div className="flex flex-col gap-1 px-5">
            {NAV_LINKS.map((link) => (
              <Link key={link.name} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className="border-b border-[var(--line)] py-3 text-sm">
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
