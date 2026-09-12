import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ScrollToTop from "./components/ScrollToTop";
import { TenantProvider, useTenant } from "./components/TenantProvider";
import { me, persistSession } from "./api/authApi";
import { storedSession } from "./api/apiClient";
import { authSucceeded, sessionCleared } from "./features/auth/authSlice";
import PlatformLoginPage from "./pages/platform/PlatformLoginPage";
import { resolveTemplate } from "./templates/registry";
import { useActiveTemplate } from "./templates/useActiveTemplate";
import { AccountLayout, AccountOrders, AccountWishlist, AccountCart, AccountProfile, AdminLayout, AdminOverview, AdminProducts, AdminHomepage, AdminPagesList, AdminPageEditor, AdminFooter, AdminCategories, AdminInventory, AdminOrders, AdminCustomers, AdminDomains, AdminSettings, AuthPage, OpenStore, PlatformHome, RequireAuth, TenantUnavailable } from "./pages/CommerceHubPages";

function SessionBootstrap({ children }) {
  const dispatch = useDispatch(); const auth = useSelector((s) => s.auth);
  useEffect(() => { let cancelled = false; const tokenAtStart = auth.accessToken; const clear = () => dispatch(sessionCleared()); window.addEventListener("commercehub:logout", clear);
    if (tokenAtStart) me().then((user) => { const current = storedSession(); if (cancelled || !current?.accessToken || (current.accessToken !== tokenAtStart && current.user?.id !== user?.id)) return; const next = { ...current, user }; persistSession(next); dispatch(authSucceeded(next)); }).catch(() => { if (!cancelled && storedSession()?.accessToken === tokenAtStart) clear(); });
    return () => { cancelled = true; window.removeEventListener("commercehub:logout", clear); }; }, [auth.accessToken, dispatch]);
  return children;
}
function TenantRoutes() { const { isPlatform, loading, error } = useTenant();
  const activeTemplateId = useActiveTemplate();
  const template = resolveTemplate(activeTemplateId);
  const { Home, Shops, Collection, About, Contact, Blog, ProductDetails } = template.pages;
  const StorefrontLayout = template.layout;
  if (!isPlatform && (loading || error)) return <TenantUnavailable />;
  if (isPlatform) return <Routes><Route path="/" element={<PlatformHome/>}/><Route path="/open-store" element={<OpenStore/>}/><Route path="/login" element={<PlatformLoginPage/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes>;
  return <Routes><Route element={<StorefrontLayout/>}><Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/shops" element={<Shops/>}/><Route path="/shop/:slug" element={<ProductDetails/>}/><Route path="/collections" element={<Collection/>}/><Route path="/blog" element={<Blog/>}/><Route path="/contact" element={<Contact/>}/><Route path="/cart" element={<AccountCart/>}/></Route><Route path="/login" element={<AuthPage mode="login"/>}/><Route path="/register" element={<AuthPage mode="register"/>}/><Route element={<RequireAuth/>}><Route path="/account" element={<AccountLayout/>}><Route index element={<AccountOrders/>}/><Route path="wishlist" element={<AccountWishlist/>}/><Route path="cart" element={<AccountCart/>}/><Route path="profile" element={<AccountProfile/>}/></Route></Route><Route element={<RequireAuth admin/>}><Route path="/admin" element={<AdminLayout/>}><Route index element={<AdminOverview/>}/><Route path="products" element={<AdminProducts/>}/><Route path="homepage" element={<AdminHomepage/>}/><Route path="pages" element={<AdminPagesList/>}/><Route path="pages/:slug" element={<AdminPageEditor/>}/><Route path="footer" element={<AdminFooter/>}/><Route path="categories" element={<AdminCategories/>}/><Route path="inventory" element={<AdminInventory/>}/><Route path="orders" element={<AdminOrders/>}/><Route path="customers" element={<AdminCustomers/>}/><Route element={<RequireAuth admin owner/>}><Route path="domains" element={<AdminDomains/>}/><Route path="settings" element={<AdminSettings/>}/></Route></Route></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>;
}
export default function App() { return <BrowserRouter><SessionBootstrap><TenantProvider><ScrollToTop/><TenantRoutes/></TenantProvider></SessionBootstrap></BrowserRouter>; }
