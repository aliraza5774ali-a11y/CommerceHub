import { useState } from "react";

const FACES = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
];

export default function NewsletterMembers() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <section className="border-t border-[var(--line)] px-5 py-16 text-center sm:px-10 lg:px-16">
      <h2 className="luxe-display text-3xl sm:text-4xl">Join & Get 10% Off</h2>
      <p className="mx-auto mt-3 max-w-sm text-sm text-[var(--ink-soft)]">
        Sign up now and enjoy early access, exclusive drops, and member-only pricing.
      </p>

      {!joined ? (
        <form
          onSubmit={(e) => { e.preventDefault(); if (email) setJoined(true); }}
          className="mx-auto mt-6 flex max-w-sm items-center gap-2"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full border border-[var(--line)] px-4 py-3 text-sm outline-none placeholder:text-[var(--ink-soft)]"
          />
          <button type="submit" className="luxe-btn luxe-btn-solid shrink-0">Become a member</button>
        </form>
      ) : (
        <p className="mt-6 text-sm text-[var(--ink-soft)]">Welcome in — your 10% code is on its way.</p>
      )}

      <div className="mx-auto mt-10 flex max-w-md justify-center -space-x-3">
        {FACES.map((src) => (
          <img key={src} src={src} alt="" className="h-12 w-12 rounded-full border-2 border-[var(--paper)] object-cover" />
        ))}
      </div>
    </section>
  );
}
