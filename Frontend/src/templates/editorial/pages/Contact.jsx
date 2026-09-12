import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { getDummyHero } from "../data/heroContent";
import PageHero from "../components/PageHero";
import { editorialImages } from "../placeholderImages";

const details = [
  [Mail, "Email us", "hello@homedine.com"],
  [Phone, "Call us", "+92 300 000 0000"],
  [MapPin, "Visit us", "Lahore, Pakistan"],
];

export default function EditorialContact() {
  const hero = getDummyHero("contact");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <PageHero content={hero} eyebrow="Correspondence" />
      <section className="grid gap-10 px-5 py-16 sm:grid-cols-2 sm:px-10 lg:px-16">
        <div>
          <img src={hero.image || editorialImages.newsletterTileB} alt="" className="h-80 w-full rounded-xl object-cover" />
          <div className="mt-7 space-y-5">
            {details.map(([Icon, label, value]) => (
              <div key={label} className="flex gap-4 border-b border-[var(--forest)]/20 pb-4">
                <Icon size={18} className="text-[var(--coral)]" />
                <div>
                  <p className="text-xs uppercase tracking-[.15em] text-[var(--forest)]/55">{label}</p>
                  <p className="mt-1">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <form className="self-center" onSubmit={submit}>
          <p className="text-xs uppercase tracking-[.2em] text-[var(--coral)]">Write to us</p>
          <h2 className="editorial-display mt-3 text-5xl">A good conversation starts here.</h2>
          {sent ? (
            <p className="mt-8 leading-7 text-[var(--forest)]/75">Thanks — we've received your message and will reply soon.</p>
          ) : (
            <>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {[["name", "Name"], ["email", "Email"]].map(([name, label]) => (
                  <label key={name} className="border-b border-[var(--forest)]/30 pb-2 text-xs uppercase tracking-[.14em]">
                    {label}
                    <input required name={name} type={name === "email" ? "email" : "text"} value={form[name]} onChange={update} className="mt-2 block w-full bg-transparent text-base normal-case tracking-normal outline-none" />
                  </label>
                ))}
              </div>
              <label className="mt-6 block border-b border-[var(--forest)]/30 pb-2 text-xs uppercase tracking-[.14em]">
                Subject
                <input required name="subject" value={form.subject} onChange={update} className="mt-2 block w-full bg-transparent text-base normal-case tracking-normal outline-none" />
              </label>
              <label className="mt-6 block border-b border-[var(--forest)]/30 pb-2 text-xs uppercase tracking-[.14em]">
                Message
                <textarea required name="message" rows="4" value={form.message} onChange={update} className="mt-2 block w-full resize-none bg-transparent text-base normal-case tracking-normal outline-none" />
              </label>
              <button className="mt-7 bg-[var(--forest)] px-6 py-4 text-xs uppercase tracking-[.15em] text-[var(--paper)] hover:bg-[var(--coral)]">
                Send message
              </button>
            </>
          )}
        </form>
      </section>
    </>
  );
}
