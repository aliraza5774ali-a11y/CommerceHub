import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe2,
  Lock,
  Mail,
  Phone,
  Sparkles,
  Store,
  User,
} from "lucide-react";
import { register, themeOptions } from "../../api/authApi";
import PlatformNavbar from "../../components/platform/PlatformNavbar";
import PlatformFooter from "../../components/platform/PlatformFooter";

const errorText = (e) =>
  e.response?.data?.message ||
  e.response?.data?.error?.message ||
  "Something went wrong. Please try again.";

const NICHE_OPTIONS = [
  "Fashion & Apparel",
  "Electronics",
  "Beauty & Personal Care",
  "Home & Living",
  "Food & Grocery",
  "Sports & Outdoors",
  "Books & Stationery",
  "Other",
];

const COUNTRY_OPTIONS = [
  "Pakistan",
  "United Arab Emirates",
  "Saudi Arabia",
  "United Kingdom",
  "United States",
  "India",
  "Other",
];

// Fallback templates shown before /auth/theme-options resolves, or if the
// request fails — keeps the picker usable without blocking on the network.
const FALLBACK_TEMPLATES = [
  { id: "classic", label: "Classic", description: "A bold, image-led storefront with a floating navigation bar.", previewImage: "/template-previews/classic-storefront.svg" },
  { id: "editorial", label: "Editorial", description: "A refined magazine-style storefront with serif typography and warm surfaces.", previewImage: "/template-previews/editorial-storefront.svg" },
  { id: "luxe", label: "Luxe", description: "A quiet-luxury fashion storefront with a promo utility bar and a bento-style new-arrivals grid.", previewImage: "/template-previews/luxe-storefront.svg" },
  { id: "vibrant", label: "Vibrant", description: "A bold, high-energy storefront with a pill navbar, bento categories, and a giant wordmark feature banner.", previewImage: "/template-previews/vibrant-storefront.svg" },
  { id: "texart", label: "Texart", description: "A playful lime-and-violet fashion storefront with a marquee strip, countdown banner, and step-by-step process section.", previewImage: "/template-previews/texart-storefront.svg" },
];

const FIELDS = [
  { key: "storeName", label: "Business name", icon: Store, placeholder: "Ali Tech", span: true },
  { key: "storeSlug", label: "Store slug", icon: Sparkles, placeholder: "ali-tech", hint: "Your store works here immediately, e.g. ali-tech.commercehub.com" },
  { key: "customDomain", label: "Your domain (optional)", icon: Globe2, placeholder: "alitech.com", span: true, required: false, hint: "Already own a domain? Add it now — point its DNS at us afterward and it becomes your store's main address." },
  { key: "phone", label: "Phone", icon: Phone, placeholder: "+92 300 1234567" },
  { key: "firstName", label: "Owner first name", icon: User, placeholder: "Ali" },
  { key: "lastName", label: "Owner last name", icon: User, placeholder: "Khan" },
  { key: "email", label: "Owner email", icon: Mail, placeholder: "you@example.com", span: true },
  { key: "password", label: "Password", icon: Lock, placeholder: "••••••••", span: true },
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
          required={field.required !== false}
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

function SelectField({ label, icon: Icon, value, onChange, options, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-black/70">{label}</span>
      <div className="group relative flex items-center rounded-xl border border-black/12 bg-white transition-colors duration-200 focus-within:border-black">
        <Icon
          size={16}
          strokeWidth={1.75}
          className="pointer-events-none absolute left-3.5 text-black/35 transition-colors duration-200 group-focus-within:text-black"
        />
        <select
          required
          value={value}
          onChange={onChange}
          className="w-full appearance-none rounded-xl bg-transparent py-3 pl-10 pr-3.5 text-[14px] text-black focus:outline-none"
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </label>
  );
}

function TemplateStep({ templates, selected, onSelect, onBack, onSubmit, submitting, error }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <span className="text-[13px] font-medium text-black/70">Choose a starter template</span>
        <p className="mt-1 text-xs text-black/40">
          Choose the storefront layout you want. Your pages, products and CMS content stay editable after launch.
        </p>
      </div>

      <div className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
        {templates.map((template) => {
          const isSelected = selected === template.id;
          return (
            <button
              type="button"
              key={template.id}
              onClick={() => onSelect(template.id)}
              className={`group relative aspect-[4/5] w-[150px] shrink-0 snap-start overflow-hidden rounded-2xl border transition-all duration-200 sm:w-[170px] ${
                isSelected ? "border-black shadow-md" : "border-black/10 hover:border-black/30"
              }`}
            >
              <img
                src={template.previewImage}
                alt={`${template.label} template preview`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent px-3 pb-2.5 pt-8">
                <span className="text-[13px] font-semibold text-white">{template.label}</span>
              </div>
              {isSelected && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-black">
                  <CheckCircle2 size={12} strokeWidth={2.5} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <p className="text-xs leading-relaxed text-black/45">
          {templates.find((t) => t.id === selected)?.description}
        </p>
      )}

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-full border border-black/12 px-5 py-3 text-[13px] font-medium text-black/60 transition hover:border-black/25 hover:text-black"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-black py-3.5 text-[14px] font-semibold text-white transition-all duration-300 hover:bg-neutral-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Creating your store…" : "Open your store"}
          {!submitting && (
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          )}
        </button>
      </div>
    </div>
  );
}

function SuccessScreen({ storeName, storeSlug, pendingDomain }) {
  const host = `${storeSlug}.localhost`;
  const url = `http://${host}:5173`;
  const [copied, setCopied] = useState(null);

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* clipboard not available — ignore */
    }
  };

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 pb-24 pt-36 text-center sm:pt-40">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-accent">
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
            onClick={() => copy(url, "sub")}
            aria-label="Copy store URL"
            className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full bg-black/5 px-3 py-1.5 text-xs font-medium text-black/60 transition hover:bg-black/10"
          >
            <Copy size={13} />
            {copied === "sub" ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {pendingDomain && (
        <div className="mt-4 w-full rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left">
          <p className="text-sm font-semibold text-black">
            Connect {pendingDomain.host}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-black/55">
            Your store is live on the address above right now. To make{" "}
            <span className="font-medium text-black/70">{pendingDomain.host}</span>{" "}
            work too, add these DNS records with your domain provider, then
            verify it from Admin → Domains:
          </p>
          <div className="mt-3 flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 font-mono">
              <span className="truncate">CNAME @ → storefront.commercehub.com</span>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 font-mono">
              <span className="truncate">TXT commercehub-verify = {pendingDomain.verificationToken}</span>
              <button
                type="button"
                onClick={() => copy(pendingDomain.verificationToken, "token")}
                className="flex shrink-0 items-center gap-1 rounded-full bg-black/5 px-2 py-1 text-[11px] font-medium text-black/60 hover:bg-black/10"
              >
                <Copy size={11} />
                {copied === "token" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}

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
  const [step, setStep] = useState("details"); // "details" | "template"
  const [form, setForm] = useState({
    storeName: "",
    storeSlug: "",
    customDomain: "",
    phone: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    niche: "",
    country: "",
    themeId: "classic",
  });
  const [templates, setTemplates] = useState(FALLBACK_TEMPLATES);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    themeOptions()
      .then((options) => { if (options?.length) setTemplates(options); })
      .catch(() => { /* keep fallback templates */ });
  }, []);

  const updateField = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const goToTemplateStep = (e) => {
    e.preventDefault();
    setError("");
    setStep("template");
  };

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const payload = { ...form };
      if (!payload.customDomain?.trim()) delete payload.customDomain;
      const response = await register(payload);
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
        <SuccessScreen storeName={form.storeName} storeSlug={form.storeSlug} pendingDomain={result.pendingDomain} />
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
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-black">
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
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <CheckCircle2 size={13} strokeWidth={2.25} />
                  </span>
                  <span className="text-sm leading-relaxed text-black/65">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex items-center gap-2">
              {["details", "template"].map((s, i) => (
                <span
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    step === s || i === 0 ? "bg-accent" : "bg-black/10"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right: form card */}
          <div className="rounded-3xl border border-black/8 bg-white p-6 shadow-sm sm:p-9">
            {step === "details" ? (
              <form onSubmit={goToTemplateStep} className="flex flex-col gap-5" noValidate>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {FIELDS.map((field) => (
                    <div key={field.key} className={field.span ? "sm:col-span-2" : ""}>
                      <InputField field={field} value={form[field.key]} onChange={updateField(field.key)} />
                    </div>
                  ))}
                  <SelectField
                    label="Business niche"
                    icon={Building2}
                    value={form.niche}
                    onChange={updateField("niche")}
                    options={NICHE_OPTIONS}
                    placeholder="Select a niche"
                  />
                  <SelectField
                    label="Country"
                    icon={Globe2}
                    value={form.country}
                    onChange={updateField("country")}
                    options={COUNTRY_OPTIONS}
                    placeholder="Select a country"
                  />
                </div>

                {error && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 text-[14px] font-semibold text-white transition-all duration-300 hover:bg-neutral-800 active:scale-[0.98]"
                >
                  Continue
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <p className="text-center text-xs text-black/40">
                  Already have a store? Sign in from your store&apos;s URL.
                </p>
              </form>
            ) : (
              <TemplateStep
                templates={templates}
                selected={form.themeId}
                onSelect={(id) => setForm((prev) => ({ ...prev, themeId: id }))}
                onBack={() => setStep("details")}
                onSubmit={submit}
                submitting={submitting}
                error={error}
              />
            )}
          </div>
        </main>
      )}

      <PlatformFooter />
    </div>
  );
};

export default OpenStorePage;
