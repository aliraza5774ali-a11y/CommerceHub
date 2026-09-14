import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { getVibrantHero } from "../data/heroContent";
import PageHero from "../components/PageHero";

const details = [
  [Mail, "Email us", "hello@frolax.com"],
  [Phone, "Call us", "+92 300 000 0000"],
  [MapPin, "Visit us", "Lahore, Pakistan"],
];

export default function VibrantContact() {
  const hero = getVibrantHero("contact");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <>
      <PageHero content={hero} />
      <section className="grid gap-10 px-5 py-16 sm:grid-cols-2 sm:px-10 lg:px-16">
        <div className="space-y-4">
          {details.map(([Icon, label, value]) => (
            <div key={label} className="flex items-center gap-4 rounded-2xl bg-white p-5">
              <span className="vibrant-icon-btn h-11 w-11 bg-[var(--sun)]/10 text-[var(--sun)]"><Icon size={18} /></span>
              <div>
                <p className="text-xs uppercase tracking-[.1em] text-[var(--ink-soft)]">{label}</p>
                <p className="mt-1 text-sm font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>
        <form className="rounded-2xl bg-white p-6" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <h2 className="vibrant-display text-2xl">Send us a message</h2>
          {sent ? (
            <p className="mt-5 text-sm text-[var(--ink-soft)]">Thanks — we'll be in touch shortly.</p>
          ) : (
            <>
              <input required name="name" value={form.name} onChange={update} placeholder="Your name" className="mt-6 w-full rounded-xl border border-[var(--line)] px-4 py-3 text-sm outline-none" />
              <input required type="email" name="email" value={form.email} onChange={update} placeholder="Your email" className="mt-4 w-full rounded-xl border border-[var(--line)] px-4 py-3 text-sm outline-none" />
              <textarea required name="message" rows="4" value={form.message} onChange={update} placeholder="Your message" className="mt-4 w-full resize-none rounded-xl border border-[var(--line)] px-4 py-3 text-sm outline-none" />
              <button className="vibrant-btn vibrant-btn-solid mt-5 w-full">Send message</button>
            </>
          )}
        </form>
      </section>
    </>
  );
}
