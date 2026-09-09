import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  Lock,
  Mail,
  Sparkles,
  Store,
  User,
} from "lucide-react";
import { register } from "../../api/authApi";
import PlatformNavbar from "../../components/platform/PlatformNavbar";
import PlatformFooter from "../../components/platform/PlatformFooter";

const errorText = (e) =>
  e.response?.data?.message ||
  e.response?.data?.error?.message ||
  "Something went wrong. Please try again.";

const FIELDS = [
  { key: "storeName", label: "Store name", icon: Store, placeholder: "Ali Tech" },
  { key: "storeSlug", label: "Store slug", icon: Sparkles, placeholder: "ali-tech", hint: "This becomes your storefront address." },
  { key: "firstName", label: "Owner first name", icon: User, placeholder: "Ali" },
  { key: "lastName", label: "Owner last name", icon: User, placeholder: "Khan" },
  { key: "email", label: "Owner email", icon: Mail, placeholder: "you@example.com" },
  { key: "password", label: "Password", icon: Lock, placeholder: "••••••••" },
];

function InputField({ field, value, onChange }) {
  const Icon = field.icon;
  const type = field.key === "password" ? "password" : field.key === "email" ? "email" : "text";
  const pattern = field.key === "storeSlug" ? "[a-z0-9-]+" : undefined;

  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-black/70">
        {field.label}
      </span>
      <div className="group relative flex items-center rounded-xl border border-black/12 bg-white transition-colors duration-200 focus-within:border-black">
        <Icon
          size={16}
          strokeWidth={1.75}
          className="pointer-events-none absolute left-3.5 text-black/35 transition-colors duration-200 group-focus-within:text-black"
        />
        <input
          required
          value={value}
          type={type}
          pattern={pattern}
          placeholder={field.placeholder}
          onChange={onChange}
          className="w-full rounded-xl bg-transparent py-3 pl-10 pr-3.5 text-[14px] text-black placeholder:text-black/30 focus:outline-none"
        />
      </div>
      {field.hint && (
        <span className="mt-1.5 block text-xs text-black/40">{field.hint}</span>
      )}
    </label>
  );
}

function SuccessScreen({ storeName, storeSlug }) {
  const host = `${storeSlug}.localhost`;
  const url = `http://${host}:5173`;
  const [copied, setCopied] = useState(false);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard not available — ignore */
    }
  };

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 pb-24 pt-36 text-center sm:pt-40">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-[#cfff04]">
        <CheckCircle2 size={30} strokeWidth={1.75} />
      </span>

      <h1 className="mt-7 font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight tracking-tight text-black">
        {storeName} is ready
      </h1>
      <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-black/55">
        Your owner account has been created. Sign in from your store&apos;s
        own address any time to manage products, orders and customers.
      </p>

      <div className="mt-8 w-full rounded-2xl border border-black/10 bg-[#f8f8f8] p-2">
        <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3.5 shadow-sm">
          <span className="truncate font-mono text-[13px] text-black/70">
            {url}
          </span>
          <button
            type="button"
            onClick={copyUrl}
            aria-label="Copy store URL"
            className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full bg-black/5 px-3 py-1.5 text-xs font-medium text-black/60 transition hover:bg-black/10"
          >
            <Copy size={13} />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <a
        href={url}
        className="group mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-black px-7 py-3.5 text-[14px] font-semibold text-white transition-all duration-300 hover:bg-neutral-800 active:scale-[0.97]"
      >
        Go to your store
        <ExternalLink size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
      </a>

      <Link
        to="/"
        className="mt-5 text-xs font-medium text-black/40 transition hover:text-black/70"
      >
        Back to CommerceHub
      </Link>
    </div>
  );
}

const OpenStorePage = () => {
  const [form, setForm] = useState({
    storeName: "",
    storeSlug: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await register(form);
      setResult(response);
    } catch (e2) {
      setError(errorText(e2));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <PlatformNavbar />

      {result ? (
        <SuccessScreen storeName={form.storeName} storeSlug={form.storeSlug} />
      ) : (
        <main className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-12 px-4 pb-24 pt-32 sm:px-6 sm:pt-36 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-10 lg:pt-40">
          {/* Left: framing copy */}
          <div className="lg:sticky lg:top-32">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-black/40 transition hover:text-black/70"
            >
              <ArrowLeft size={14} />
              Back to CommerceHub
            </Link>

            <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white pl-1.5 pr-3 py-1.5 shadow-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#cfff04] text-black">
                <Sparkles size={12} strokeWidth={2.25} />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-black/70">
                Open a store
              </span>
            </span>

            <h1 className="mt-5 font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.05] tracking-tight text-black">
              Your store, live in minutes
            </h1>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-black/55">
              Tell us about your business and create your owner account. Your
              storefront and admin dashboard are ready as soon as you submit.
            </p>

            <ul className="mt-9 flex flex-col gap-4">
              {[
                "Full storefront on your own CommerceHub address",
                "Admin dashboard to manage products, orders and customers",
                "No setup calls, no waiting — start right away",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#cfff04]/15 text-[#cfff04]">
                    <CheckCircle2 size={13} strokeWidth={2.25} />
                  </span>
                  <span className="text-sm leading-relaxed text-black/65">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: form card */}
          <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-sm sm:p-9">
            <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {FIELDS.map((field) => (
                  <div
                    key={field.key}
                    className={
                      field.key === "storeName" || field.key === "email" || field.key === "password"
                        ? "sm:col-span-2"
                        : ""
                    }
                  >
                    <InputField
                      field={field}
                      value={form[field.key]}
                      onChange={updateField(field.key)}
                    />
                  </div>
                ))}
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 text-[14px] font-semibold text-white transition-all duration-300 hover:bg-neutral-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Creating your store…" : "Open your store"}
                {!submitting && (
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}
              </button>

              <p className="text-center text-xs text-black/40">
                Already have a store? Sign in from your store&apos;s URL.
              </p>
            </form>
          </div>
        </main>
      )}

      <PlatformFooter />
    </div>
  );
};

export default OpenStorePage;