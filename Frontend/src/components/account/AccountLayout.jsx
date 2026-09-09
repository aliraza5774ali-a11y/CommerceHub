import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, LogOut, Menu, Package, ShoppingBag, User, X } from "lucide-react";
import { logout } from "../../api/authApi";
import { sessionCleared } from "../../features/auth/authSlice";
import { useTenant } from "../../components/TenantProvider";

const NAV_ITEMS = [
  { label: "My Orders", to: "/account", end: true, icon: Package },
  { label: "Wishlist", to: "/account/wishlist", icon: Heart },
  { label: "Bag", to: "/account/cart", icon: ShoppingBag },
  { label: "Profile", to: "/account/profile", icon: User },
];

function initialsOf(user) {
  const source = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email;
  if (!source) return "?";
  return source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

export default function AccountLayout() {
  const { tenant } = useTenant();
  const auth = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const signOut = async () => {
    await logout();
    dispatch(sessionCleared());
    navigate("/");
  };

  const displayName = auth.user?.firstName
    ? `${auth.user.firstName} ${auth.user.lastName || ""}`.trim()
    : auth.user?.email;

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f8f8f8]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="font-display text-lg font-semibold text-black sm:text-xl">
            {tenant?.name || "CommerceHub"}
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map(({ label, to, end, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors duration-150 ${
                    isActive ? "bg-black text-white" : "text-black/60 hover:bg-black/5 hover:text-black"
                  }`
                }
              >
                <Icon size={15} strokeWidth={1.75} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2.5 sm:flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black font-display text-xs text-white">
                {initialsOf(auth.user)}
              </span>
              <span className="max-w-[140px] truncate text-sm text-black/70">{displayName}</span>
            </div>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-black/60 transition hover:border-black/20 hover:text-black"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-full border border-black/10 bg-white p-2 text-black md:hidden"
              aria-label="Open menu"
            >
              <Menu size={17} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute inset-y-0 right-0 flex w-72 max-w-[80vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black font-display text-xs text-white">
                {initialsOf(auth.user)}
              </span>
              <span className="max-w-[140px] truncate text-sm text-black/70">{displayName}</span>
            </div>
            <button onClick={() => setMobileOpen(false)} className="rounded-full p-1.5 text-black/40 hover:bg-black/5 hover:text-black" aria-label="Close menu">
              <X size={18} />
            </button>
          </div>
          <nav className="flex flex-col gap-1 px-3 py-4">
            {NAV_ITEMS.map(({ label, to, end, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors duration-150 ${
                    isActive ? "bg-black text-white" : "text-black/65 hover:bg-black/5"
                  }`
                }
              >
                <Icon size={16} strokeWidth={1.75} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}