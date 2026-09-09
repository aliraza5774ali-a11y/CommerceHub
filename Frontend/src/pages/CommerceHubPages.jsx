import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { login, persistSession, register } from "../api/authApi";
import { authFailed, authStarted, authSucceeded } from "../features/auth/authSlice";
import { useTenant } from "../components/TenantProvider";

const errorText = (e) => e.response?.data?.message || e.response?.data?.error?.message || "Something went wrong. Please try again.";
const isOwner = (user) => user?.roleName === "Owner";
const canAccessAdmin = (user) => ["Owner", "Admin", "Staff"].includes(user?.roleName);
export { default as PlatformHome } from "./platform/PlatformHome";
export { default as Admin } from "./admin/AdminHome";
export { default as Account } from "./account/AccountHome";
export { default as OpenStore } from "./platform/OpenStorePage";
export function AuthPage({ mode }) { const tenant=useTenant(); const dispatch=useDispatch(); const nav=useNavigate(); const [form,setForm]=useState({firstName:"",lastName:"",email:"",password:""}); const [error,setError]=useState(""); const [submitting,setSubmitting]=useState(false); const submit=async(e)=>{e.preventDefault(); if(submitting)return; setSubmitting(true); dispatch(authStarted()); try { const response=mode === "login" ? await login({email:form.email,password:form.password}) : await register(form); persistSession(response); dispatch(authSucceeded(response)); nav(response.user?.roleName === "Owner" ? "/admin" : "/account"); } catch(e2) { const message=errorText(e2); setError(message); dispatch(authFailed(message)); } finally { setSubmitting(false); }};
 if(tenant.isPlatform) return <Navigate to="/open-store" replace/>; return <Form title={mode === "login" ? "Sign in to your store" : "Create customer account"} form={form} setForm={setForm} onSubmit={submit} error={error} submitting={submitting} fields={mode === "login" ? [['email','Email'],['password','Password']] : [['firstName','First name'],['lastName','Last name'],['email','Email'],['password','Password']]}/>; }
function Form({title,form,setForm,onSubmit,error,submitting=false,fields}) { return <main className="mx-auto max-w-md px-6 pb-12 pt-28"><h1 className="font-display text-3xl">{title}</h1><form className="mt-7 space-y-4" onSubmit={onSubmit}>{fields.map(([key,label])=><label className="block" key={key}><span className="text-sm">{label}</span><input required value={form[key]} type={key === "password" ? "password" : key === "email" ? "email" : "text"} pattern={key === "storeSlug" ? "[a-z0-9-]+" : undefined} onChange={(e)=>setForm({...form,[key]:e.target.value})} className="mt-1 w-full rounded border border-black/20 px-3 py-2"/></label>)}{error&&<p className="text-sm text-red-700">{error}</p>}<button disabled={submitting} className="w-full rounded bg-black py-3 text-white">{submitting ? "Logging in..." : "Continue"}</button></form></main>; }
export function RequireAuth({ admin=false, owner=false }) { const auth=useSelector(s=>s.auth); if(!auth.isAuthenticated) return <Navigate to="/login" replace/>; if(admin&&!canAccessAdmin(auth.user)) return <Navigate to="/account" replace/>; if(owner&&!isOwner(auth.user)) return <Navigate to="/admin" replace/>; return <Outlet/>; }
export { default as AccountLayout } from "../components/account/AccountLayout";
export { default as AccountOrders } from "../components/account/AccountOrders";
export { default as AccountWishlist } from "../components/account/AccountWishlist";
export { default as AccountCart } from "../components/account/AccountCart";
export { default as AccountProfile } from "../components/account/AccountProfile";
export { default as AdminLayout } from "../components/admin/AdminLayout";
export { default as AdminOverview } from "../components/admin/AdminOverview";
export { default as AdminProducts } from "../components/admin/AdminProducts";
export { default as AdminOrders } from "../components/admin/AdminOrders";
export { default as AdminCustomers } from "../components/admin/AdminCustomers";
export { default as AdminDomains } from "../components/admin/AdminDomains";
export { default as AdminSettings } from "../components/admin/AdminSettings";
export function TenantUnavailable() { const {loading,error}=useTenant(); return <main className="grid min-h-screen place-items-center p-6"><div><h1 className="font-display text-3xl">{loading?"Opening store…":"Store unavailable"}</h1>{error&&<p className="mt-3 text-black/60">{error}</p>}</div></main>; }