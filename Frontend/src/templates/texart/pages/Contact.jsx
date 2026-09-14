import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { getTexartHero } from "../data/heroContent";
import PageHero from "../components/PageHero";

const details = [
  [Mail, "Email us", "hello@texart.com"],
  [Phone, "Call us", "+880 1XXX-XXXXXX"],
  [MapPin, "Visit us", "Dhaka, Bangladesh"],
];

export default function TexartContact() {
  const hero = getTexartHero("contact");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <>
      <PageHero content={hero} />
      <section className="grid gap-10 px-5 py-16 sm:grid-cols-2 sm:px-10 lg:px-16">
        <div className="space-y-4">
          {details.map(([Icon, label, value]) => (
            <div key={label} className="flex items-center gap-4 rounded-2xl border border-[var(--line)] p-5">
              <span className="texart-icon-btn h-11 w-11 bg-[var(--lime)]"><Icon size={18} /></span>
              <div>
                <p className="text-xs uppercase tracking-[.1em] text-[var(--ink-soft)]">{label}</p>
                <p className="mt-1 text-sm font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>
        <form className="rounded-2xl border border-[var(--line)] p-6" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <h2 className="texart-display text-2xl">Send us a message</h2>
          {sent ? (
            <p className="mt-5 text-sm text-[var(--ink-soft)]">Thanks — we'll be in touch shortly.</p>
          ) : (
            <>
              <input required name="name" value={form.name} onChange={update} placeholder="Your name" className="mt-6 w-full rounded-xl border border-[var(--line)] px-4 py-3 text-sm outline-none" />
              <input required type="email" name="email" value={form.email} onChange={update} placeholder="Your email" className="mt-4 w-full rounded-xl border border-[var(--line)] px-4 py-3 text-sm outline-none" />
              <textarea required name="message" rows="4" value={form.message} onChange={update} placeholder="Your message" className="mt-4 w-full resize-none rounded-xl border border-[var(--line)] px-4 py-3 text-sm outline-none" />
              <button className="texart-btn texart-btn-solid mt-5 w-full">Send message</button>
            </>
          )}
        </form>
      </section>
    </>
  );
}
