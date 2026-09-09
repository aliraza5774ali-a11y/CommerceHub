import { useState } from "react";
import HeroSection from "../components/sections/HeroSection";
import hero01 from "../assets/contactHero.avif";
import contactSide from "../assets/contactSide.avif";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";

const FAQS = [
  { q: "How long does shipping take?", a: "Standard shipping takes 5–7 business days. Express shipping (2–3 days) is available at checkout." },
  { q: "What is your return policy?", a: "We offer a 30-day hassle-free return policy. Items must be unworn and in original packaging." },
  { q: "Do you ship internationally?", a: "Yes, we ship to over 40 countries. International delivery takes 10–14 business days." },
  { q: "How do I find my size?", a: "Each product page includes a detailed size guide. When in doubt, size up for an oversized fit." },
  { q: "Can I modify or cancel my order?", a: "Orders can be modified or cancelled within 12 hours of placement. Contact us immediately if needed." },
  { q: "Are your fabrics sustainably sourced?", a: "Every fabric we use is ethically sourced and tested for sustainability before it reaches our collections." },
];

const INFO = [
  { icon: <Mail size={18} strokeWidth={1.5} />, label: "Email Us", value: "hello@velour.com", sub: "We reply within 24 hours" },
  { icon: <Phone size={18} strokeWidth={1.5} />, label: "Call Us", value: "+92 300 000 0000", sub: "Mon–Fri, 9am to 6pm" },
  { icon: <MapPin size={18} strokeWidth={1.5} />, label: "Visit Us", value: "Lahore, Pakistan", sub: "By appointment only" },
];

const Contact = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="bg-white">
      <HeroSection
  mode="contact"
  image={hero01}
  badge={{ label: "Hello", text: "We'd love to hear from you" }}
  heading="Let's start a conversation"
  subtext="Have a question, collaboration idea, or just want to say hi? Our team is here to help."
  primaryLabel="Send a Message"
  secondaryLabel="Visit Our Store"
/>

      <section className="bg-[#FAFAF7] px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-12 lg:py-20 xl:px-20 2xl:px-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 lg:mb-14 lg:flex-row lg:items-end">
            <div>
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#7A2331] sm:text-[11px]">
                Velour — Get in touch
              </span>
              <h2 className="mt-3 font-display text-[30px] leading-[1.05] font-medium text-black sm:text-[40px] md:text-[50px] lg:text-[54px]">
                Let's start a
                <br />
                conversation.
              </h2>
            </div>
            <p className="max-w-xs pb-1 text-sm leading-relaxed text-black/50">
              Questions about an order, a fitting, or a future collection — our studio replies within a day.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
            <div className="relative min-h-[420px] overflow-hidden rounded-[24px] sm:min-h-[520px] lg:min-h-[640px]">
              <img
                src={contactSide}
                alt="Get in touch with Velour"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/5" />

              <div className="absolute left-4 top-4 z-10 flex flex-col items-center sm:left-6 sm:top-6">
                <div className="h-3 w-px bg-black/30" />
                <div className="mt-0 flex items-center gap-2 rounded-sm border border-black/10 bg-[#FAFAF7] px-3 py-2 shadow-md sm:px-4">
                  <span className="h-2 w-2 rounded-full border border-black/40" />
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/70 sm:text-[10px]">
                    VELOUR · Lahore, PK
                  </span>
                </div>
              </div>

              <div className="absolute right-4 top-4 z-10 flex gap-2 sm:right-6 sm:top-6 lg:flex-col">
                {[BsInstagram, BsTwitter, BsFacebook].map((Icon, i) => (
                  <button
                    key={i}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition-all duration-300 hover:bg-white hover:text-black"
                  >
                    <Icon size={16} strokeWidth={1.5} />
                  </button>
                ))}
              </div>

              <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-3 sm:bottom-6 sm:left-6 sm:right-6">
                {INFO.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-2xl border border-black/6 bg-white/95 p-3 backdrop-blur sm:p-4"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-black text-white">
                      {item.icon}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-[10px] tracking-widest uppercase text-black/30">
                        {item.label}
                      </span>
                      <span className="text-sm font-semibold text-black sm:text-base">
                        {item.value}
                      </span>
                      <span className="text-xs text-black/40">{item.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-black/6 bg-white p-5 sm:p-6 md:p-8 lg:p-10">
              <div className="flex flex-col gap-6 sm:gap-7">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField index="01" label="Your name" name="name" value={form.name} onChange={handleChange} placeholder="First & last name" />
                  <FormField index="02" label="Email address" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
                </div>

                <FormField index="03" label="Subject" name="subject" value={form.subject} onChange={handleChange} placeholder="What's this about?" />

                <FormArea index="04" label="Message" name="message" value={form.message} onChange={handleChange} placeholder="Tell us more..." rows={5} />

                <button className="group mt-1 flex items-center justify-between border-t border-black/10 pt-5">
                  <span className="font-display text-xl font-medium text-black sm:text-2xl">
                    Send message
                  </span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white transition-colors duration-300 group-hover:bg-[#7A2331] sm:h-12 sm:w-12">
                    <Send size={16} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-12 lg:py-20 xl:px-20 2xl:px-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 lg:mb-10 lg:flex-row lg:items-end">
            <div>
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#7A2331] sm:text-[11px]">
                Frequently asked
              </span>
              <h2 className="mt-3 font-display text-[30px] leading-[1.05] font-medium text-black sm:text-[40px] md:text-[50px] lg:text-[54px]">
                Questions we get
                <br />
                asked often.
              </h2>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <button
                key={i}
                type="button"
                className="cursor-pointer overflow-hidden rounded-2xl border border-black/6 bg-[#FAFAF7] text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
                  <span className="text-sm font-semibold text-black sm:text-base">
                    {faq.q}
                  </span>
                  <span
                    className={`text-[#7A2331] transition-transform duration-300 ${
                      openFaq === i ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </div>
                {openFaq === i && (
                  <div className="px-4 pb-4 sm:px-6 sm:pb-5">
                    <p className="text-sm leading-relaxed text-black/50">
                      {faq.a}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const FormField = ({ index, label, ...props }) => (
  <div className="flex flex-col gap-2 border-b border-black/10 pb-3 transition-colors duration-300 focus-within:border-[#7A2331]">
    <label className="flex items-baseline gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-black/35">
      <span className="text-[#7A2331]">{index}</span>
      {label}
    </label>
    <input
      {...props}
      className="w-full bg-transparent py-1 text-base text-black outline-none placeholder:text-black/25"
    />
  </div>
);

const FormArea = ({ index, label, ...props }) => (
  <div className="flex min-h-[160px] flex-1 flex-col gap-2 border-b border-black/10 pb-3 transition-colors duration-300 focus-within:border-[#7A2331]">
    <label className="flex items-baseline gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-black/35">
      <span className="text-[#7A2331]">{index}</span>
      {label}
    </label>
    <textarea
      {...props}
      className="h-full w-full resize-none bg-transparent py-1 text-base text-black outline-none placeholder:text-black/25"
    />
  </div>
);

export default Contact;