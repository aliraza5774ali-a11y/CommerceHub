import { useState } from "react";
import { editorialImages } from "../placeholderImages";

// Sustainability strip + email capture — mirrors the reference's closing
// "sustainable materials, ethical sourcing, greener kitchen" banner.
export default function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section className="grid overflow-hidden bg-[var(--coral)] text-[var(--paper)] sm:grid-cols-2">
      <img src={editorialImages.newsletterTileA} alt="" className="h-64 w-full object-cover sm:h-full" />
      <div className="p-8 sm:p-14">
        <p className="text-xs uppercase tracking-[.2em]">Join the studio</p>
        <h2 className="editorial-display mt-4 text-3xl leading-tight sm:text-4xl">
          Sustainable materials, ethical sourcing, a greener kitchen.
        </h2>
        <p className="mt-4 max-w-md leading-7 text-[var(--paper)]/85">
          Discover our commitment to low-impact production and thoughtful
          partnerships — every piece crafted to support a healthier planet.
        </p>
        {submitted ? (
          <p className="mt-8 text-sm">You're on the list — welcome aboard.</p>
        ) : (
          <form onSubmit={submit} className="mt-8 flex border-b border-[var(--paper)]/70">
            <input
              type="email"
              required
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full bg-transparent py-3 outline-none placeholder:text-[var(--paper)]/60"
            />
            <button className="text-xs uppercase tracking-[.15em]">Join</button>
          </form>
        )}
      </div>
    </section>
  );
}
