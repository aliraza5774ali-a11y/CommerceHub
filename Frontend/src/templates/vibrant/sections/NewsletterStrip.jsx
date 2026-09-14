import { useState } from "react";

export default function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <section className="px-5 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 to-[var(--sun)] sm:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-12 text-white sm:px-12">
          <h2 className="vibrant-display text-3xl leading-tight sm:text-4xl">Get 15% Off On Your First Purchase</h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/85">
            Subscribe now to stay in the loop on new arrivals, exclusive offers, and members-only deals.
          </p>
          {!joined ? (
            <form
              onSubmit={(e) => { e.preventDefault(); if (email) setJoined(true); }}
              className="mt-6 flex max-w-sm items-center gap-2 rounded-full bg-white p-1.5"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent px-3 py-2 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-soft)]"
              />
              <button type="submit" className="vibrant-btn vibrant-btn-solid shrink-0">Subscribe</button>
            </form>
          ) : (
            <p className="mt-6 text-sm">You're subscribed — check your inbox for the code.</p>
          )}
        </div>
        <div className="relative min-h-[220px]">
          <img src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80" alt="" className="h-full w-full object-cover" />
        </div>
      </div>
    </section>
  );
}
