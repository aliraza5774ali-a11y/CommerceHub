import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { getLuxeHero } from "../data/heroContent";
import PageHero from "../components/PageHero";

const details = [
  [Mail, "Email us", "hello@luxe.com"],
  [Phone, "Call us", "+92 300 000 0000"],
  [MapPin, "Visit us", "Lahore, Pakistan"],
];

export default function LuxeContact() {
  const hero = getLuxeHero("contact");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <>
      <PageHero content={hero} />
      <section className="grid gap-10 px-5 py-16 sm:grid-cols-2 sm:px-10 lg:px-16">
        <div className="space-y-5">
          {details.map(([Icon, label, value]) => (
            <div key={label} className="flex gap-4 border-b border-[var(--line)] pb-4">
              <Icon size={18} className="text-[var(--ink-soft)]" />
              <div>
                <p className="text-xs uppercase tracking-[.15em] text-[var(--ink-soft)]">{label}</p>
                <p className="mt-1 text-sm">{value}</p>
              </div>
            </div>
          ))}
        </div>
        <form className="self-center" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <h2 className="luxe-display text-4xl">Send us a message.</h2>
          {sent ? (
            <p className="mt-6 leading-7 text-[var(--ink-soft)]">Thanks — we'll be in touch shortly.</p>
          ) : (
            <>
              <label className="mt-8 block border-b border-[var(--line)] pb-2 text-xs uppercase tracking-[.1em]">
                Name
                <input required name="name" value={form.name} onChange={update} className="mt-2 block w-full bg-transparent text-base normal-case tracking-normal outline-none" />
              </label>
              <label className="mt-6 block border-b border-[var(--line)] pb-2 text-xs uppercase tracking-[.1em]">
                Email
                <input required type="email" name="email" value={form.email} onChange={update} className="mt-2 block w-full bg-transparent text-base normal-case tracking-normal outline-none" />
              </label>
              <label className="mt-6 block border-b border-[var(--line)] pb-2 text-xs uppercase tracking-[.1em]">
                Message
                <textarea required name="message" rows="4" value={form.message} onChange={update} className="mt-2 block w-full resize-none bg-transparent text-base normal-case tracking-normal outline-none" />
              </label>
              <button className="luxe-btn luxe-btn-solid mt-7">Send message</button>
            </>
          )}
        </form>
      </section>
    </>
  );
}
