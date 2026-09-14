import { Heart, Settings, ShoppingBag, List, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openCart, closeCart, openSearch, closeSearch } from "../../../store/slice/Uislice";
import CartSidebar from "../../../components/cart/CartSidebar";
import SearchModal from "../../../components/searchModal";
import { useTenant } from "../../../components/TenantProvider";

const NAV_LINKS = [
  { name: "Shop", path: "/shops" },
  { name: "New in", path: "/shops" },
  { name: "Our story", path: "/about" },
  { name: "Journal", path: "/blog" },
];

export default function TexartNavbar() {
  const { tenant } = useTenant();
  const location = useLocation();
  const dispatch = useDispatch();
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
      <nav className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--paper)] px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6">
            <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu"><List size={20} /></button>
            <div className="hidden items-center gap-6 lg:flex">
              {NAV_LINKS.map((link) => (
                <Link key={link.name} to={link.path} className={`text-sm ${location.pathname === link.path ? "text-[var(--ink)]" : "text-[var(--ink-soft)] hover:text-[var(--ink)]"}`}>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/" className="texart-display absolute left-1/2 -translate-x-1/2 text-2xl italic">
            {tenant?.name || "Texart"}
          </Link>

          <div className="flex items-center gap-2">
            <button onClick={() => dispatch(openSearch())} className="texart-icon-btn bg-[var(--lime)]" aria-label="Search"><Settings size={16} /></button>
            <Link to="/account/wishlist" className="texart-icon-btn bg-[var(--lime)]" aria-label="Wishlist"><Heart size={16} /></Link>
            <button onClick={() => dispatch(openCart())} className="texart-btn texart-btn-solid !py-2" aria-label="Open bag">
              <ShoppingBag size={15} /> Bag ({cartCount})
            </button>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}>
        <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute left-0 top-0 flex h-full w-full max-w-[320px] flex-col bg-[var(--paper)] transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between px-5 py-5">
            <span className="texart-display text-xl italic">{tenant?.name || "Texart"}</span>
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
