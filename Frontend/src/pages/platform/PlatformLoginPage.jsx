import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { login, persistSession, selectBusiness, verifyTwoFactor } from "../../api/authApi";
import { authFailed, authStarted, authSucceeded } from "../../features/auth/authSlice";
import PlatformNavbar from "../../components/platform/PlatformNavbar";
import PlatformFooter from "../../components/platform/PlatformFooter";

const errorText = (e) =>
  e.response?.data?.message ||
  e.response?.data?.error?.message ||
  "Something went wrong. Please try again.";

function CardShell({ eyebrow, title, subtitle, children }) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-160px)] max-w-md flex-col justify-center px-4 pb-16 pt-32 sm:pt-36">
      <Link
        to="/"
        className="mb-6 inline-flex w-fit items-center gap-1.5 text-xs font-medium text-black/40 transition hover:text-black/70"
      >
        <ArrowLeft size={14} />
        Back to CommerceHub
      </Link>

      <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white pl-1.5 pr-3 py-1.5 shadow-sm">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-black">
          <Sparkles size={12} strokeWidth={2.25} />
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-black/70">
          {eyebrow}
        </span>
      </span>

      <h1 className="font-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold leading-tight tracking-tight text-black">
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-[14px] leading-relaxed text-black/55">{subtitle}</p>}

      <div className="mt-8 rounded-3xl border border-black/8 bg-white p-6 shadow-sm sm:p-8">
        {children}
      </div>
    </main>
  );
}

function IconInput({ icon: Icon, ...props }) {
  return (
    <div className="group relative flex items-center rounded-xl border border-black/12 bg-white transition-colors duration-200 focus-within:border-black">
      <Icon
        size={16}
        strokeWidth={1.75}
        className="pointer-events-none absolute left-3.5 text-black/35 transition-colors duration-200 group-focus-within:text-black"
      />
      <input
        {...props}
        className="w-full rounded-xl bg-transparent py-3 pl-10 pr-3.5 text-[14px] text-black placeholder:text-black/30 focus:outline-none"
      />
    </div>
  );
}

function SubmitButton({ children, submitting, disabled }) {
  return (
    <button
      type="submit"
      disabled={submitting || disabled}
      className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 text-[14px] font-semibold text-white transition-all duration-300 hover:bg-neutral-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
      {!submitting && <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />}
    </button>
  );
}

function ErrorNote({ error }) {
  if (!error) return null;
  return (
    <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {error}
    </p>
  );
}

const PlatformLoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // stage: "credentials" -> optionally "select-business" -> optionally "2fa"
  const [stage, setStage] = useState("credentials");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loginTicket, setLoginTicket] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const finishLogin = (session) => {
    persistSession(session);
    dispatch(authSucceeded(session));
    navigate("/admin");
  };

  const handleLoginResponse = (response) => {
    if (response.requiresBusinessSelection) {
      setLoginTicket(response.loginTicket);
      setBusinesses(response.businesses);
      setStage("select-business");
      return;
    }
    if (response.requires2FA) {
      setLoginTicket(response.loginTicket);
      setDevCode(response.devCode || "");
      setStage("2fa");
      return;
    }
    finishLogin(response);
  };

  const submitCredentials = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    dispatch(authStarted());
    try {
      const response = await login(form);
      dispatch(authSucceeded(response.user ? response : { user: null }));
      handleLoginResponse(response);
    } catch (e2) {
      const message = errorText(e2);
      setError(message);
      dispatch(authFailed(message));
    } finally {
      setSubmitting(false);
    }
  };

  const submitBusinessSelection = async (businessId) => {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await selectBusiness({ loginTicket, businessId });
      handleLoginResponse(response);
    } catch (e2) {
      setError(errorText(e2));
    } finally {
      setSubmitting(false);
    }
  };

  const submitTwoFactor = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await verifyTwoFactor({ loginTicket, code });
      finishLogin(response);
    } catch (e2) {
      setError(errorText(e2));
    } finally {
      setSubmitting(false);
    }
  };

  if (stage === "select-business") {
    return (
      <div className="min-h-screen bg-[#fafaf9]">
        <PlatformNavbar />
        <CardShell
          eyebrow="Select business"
          title="Which store are you signing into?"
          subtitle="This email is linked to more than one CommerceHub business."
        >
          <div className="flex flex-col gap-3">
            {businesses.map((business) => (
              <button
                key={business.id}
                type="button"
                disabled={submitting}
                onClick={() => submitBusinessSelection(business.id)}
                className="flex items-center gap-3 rounded-2xl border border-black/10 px-4 py-3.5 text-left transition hover:border-black/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Building2 size={16} strokeWidth={2} />
                </span>
                <span>
                  <span className="block text-[14px] font-medium text-black">{business.name}</span>
                  <span className="block text-xs text-black/40">{business.slug}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="mt-5">
            <ErrorNote error={error} />
          </div>
        </CardShell>
        <PlatformFooter />
      </div>
    );
  }

  if (stage === "2fa") {
    return (
      <div className="min-h-screen bg-[#fafaf9]">
        <PlatformNavbar />
        <CardShell
          eyebrow="Two-factor authentication"
          title="Enter your verification code"
          subtitle="We've sent a 6-digit code to the contact method on file for this account."
        >
          <form onSubmit={submitTwoFactor} className="flex flex-col gap-5" noValidate>
            <IconInput
              icon={KeyRound}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              inputMode="numeric"
              autoFocus
            />
            {devCode && (
              <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-xs text-black/60">
                Dev mode — your code is <span className="font-mono font-semibold text-black">{devCode}</span>
              </p>
            )}
            <ErrorNote error={error} />
            <SubmitButton submitting={submitting} disabled={code.length !== 6}>
              {submitting ? "Verifying…" : "Verify and continue"}
            </SubmitButton>
          </form>
        </CardShell>
        <PlatformFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <PlatformNavbar />
      <CardShell
        eyebrow="Business login"
        title="Sign in to your dashboard"
        subtitle="Manage products, orders, customers and your storefront."
      >
        <form onSubmit={submitCredentials} className="flex flex-col gap-5" noValidate>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-black/70">Email</span>
            <IconInput
              icon={Mail}
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="you@example.com"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-black/70">Password</span>
            <IconInput
              icon={Lock}
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="••••••••"
            />
          </label>

          <ErrorNote error={error} />

          <SubmitButton submitting={submitting}>{submitting ? "Signing in…" : "Sign in"}</SubmitButton>

          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-black/40">
            <ShieldCheck size={13} />
            Two-factor authentication is used automatically if enabled on your account.
          </p>
          <p className="text-center text-xs text-black/40">
            Don&apos;t have a store yet?{" "}
            <Link to="/open-store" className="font-medium text-black/70 underline-offset-2 hover:underline">
              Open one
            </Link>
          </p>
        </form>
      </CardShell>
      <PlatformFooter />
    </div>
  );
};

export default PlatformLoginPage;
