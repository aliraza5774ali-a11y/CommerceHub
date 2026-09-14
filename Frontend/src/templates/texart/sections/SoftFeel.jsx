const SPECS = [
  ["150 GSM", "Perfect everyday weight"],
  ["Breathable", "All-day air flow"],
  ["Pre-shrunk", "True fit, wash after wash"],
];

export default function SoftFeel() {
  return (
    <section className="grid sm:grid-cols-2">
      <div className="min-h-[320px] bg-[url('https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center" />
      <div className="flex flex-col justify-center bg-[var(--lime)] px-8 py-16">
        <p className="text-xs uppercase tracking-[.2em] text-[var(--ink-soft)]">The Feel / 04</p>
        <h2 className="texart-display mt-4 text-4xl leading-tight">
          Soft enough to <em>live in</em>.
        </h2>
        <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--ink-soft)]">
          Made from breathable combed cotton that gets softer with every wash. The kind of comfort you notice — then forget you're wearing.
        </p>
        <dl className="mt-8 max-w-sm divide-y divide-[var(--ink)]/15 border-y border-[var(--ink)]/15">
          {SPECS.map(([term, desc]) => (
            <div key={term} className="flex items-center justify-between py-3 text-sm">
              <dt className="font-semibold">{term}</dt>
              <dd className="text-[var(--ink-soft)]">{desc}</dd>
            </div>
          ))}
        </dl>
        <button className="texart-btn texart-btn-solid mt-8 w-fit">Feel the difference</button>
      </div>
    </section>
  );
}
