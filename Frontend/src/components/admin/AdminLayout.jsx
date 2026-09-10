import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutGrid,
  Package,
  FolderTree,
  Boxes,
  Receipt,
  Users,
  Globe2,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Store,
} from "lucide-react";
import { logout } from "../../api/authApi";
import { sessionCleared } from "../../features/auth/authSlice";
import { useTenant } from "../TenantProvider";

const isOwner = (user) => user?.roleName === "Owner";

const NAV_ITEMS = [
  { label: "Overview", to: "/admin", end: true, icon: LayoutGrid, roles: ["Owner", "Admin", "Staff"] },
  { label: "Products", to: "/admin/products", icon: Package, roles: ["Owner", "Admin", "Staff"] },
  { label: "Categories", to: "/admin/categories", icon: FolderTree, roles: ["Owner", "Admin", "Staff"] },
  { label: "Inventory", to: "/admin/inventory", icon: Boxes, roles: ["Owner", "Admin", "Staff"] },
  { label: "Orders", to: "/admin/orders", icon: Receipt, roles: ["Owner", "Admin", "Staff"] },
  { label: "Customers", to: "/admin/customers", icon: Users, roles: ["Owner", "Admin", "Staff"] },
  { label: "Domains", to: "/admin/domains", icon: Globe2, roles: ["Owner"] },
  { label: "Settings", to: "/admin/settings", icon: Settings, roles: ["Owner"] },
];

const ROLE_STYLES = {
  Owner: "bg-accent/15 text-black border-accent/40",
  Admin: "bg-black/8 text-black/70 border-black/15",
  Staff: "bg-black/5 text-black/55 border-black/10",
};

function RoleBadge({ role }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
        ROLE_STYLES[role] || ROLE_STYLES.Staff
      }`}
    >
      {role || "Member"}
    </span>
  );
}

function SidebarContent({ user, items, onNavigate }) {
  const initial = (user?.firstName || user?.email || "?").charAt(0).toUpperCase();
  return (
    <div className="flex h-full flex-col bg-black text-white">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-6 py-6">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-black">
          <Store size={16} strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-semibold leading-tight">Admin</p>
          <p className="truncate font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            Control panel
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <ul className="flex flex-col gap-1">
          {items.map(({ label, to, end, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors duration-150 ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/55 hover:bg-white/5 hover:text-white/90"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={17} strokeWidth={1.75} className={isActive ? "text-accent" : ""} />
                    <span className="font-medium">{label}</span>
                    {isActive && <ChevronRight size={14} className="ml-auto text-white/30" />}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 font-display text-sm">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-white/90">
              {user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user?.email}
            </p>
            <div className="mt-0.5">
              <RoleBadge role={user?.roleName} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { tenant } = useTenant();
  const auth = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = NAV_ITEMS.filter((item) => item.roles.includes(auth.user?.roleName));
  const ownerOnlyHidden = !isOwner(auth.user);

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

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <SidebarContent user={auth.user} items={items} />
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div
          className={`absolute inset-y-0 left-0 w-72 max-w-[80vw] transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent user={auth.user} items={items} onNavigate={() => setMobileOpen(false)} />
        </div>
      </div>

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-black/10 bg-[#f8f8f8]/90 px-4 py-3.5 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-full border border-black/10 bg-white p-2 text-black transition hover:bg-black/5 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={17} />
            </button>
            <Link to="/" className="font-display text-base font-semibold text-black sm:text-lg">
              {tenant?.name || "CommerceHub"}
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="hidden rounded-full border border-black/10 bg-white px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-black/70 transition hover:border-black/20 hover:text-black sm:inline-flex"
            >
              View store
            </Link>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-full bg-black px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white transition hover:bg-neutral-800"
            >
              <LogOut size={13} strokeWidth={2} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        {mobileOpen && (
          <button
            className="fixed right-4 top-4 z-50 rounded-full bg-white p-2 text-black shadow-md lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}

        <main className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          {ownerOnlyHidden && (
            <p className="mb-6 hidden font-mono text-[11px] uppercase tracking-[0.14em] text-black/30 lg:block">
              Domains and Settings are visible to store owners only.
            </p>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}