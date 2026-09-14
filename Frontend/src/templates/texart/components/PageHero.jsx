export default function PageHero({ content }) {
  return (
    <section className="bg-[var(--lime)] px-5 pb-14 pt-32 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs uppercase tracking-[.2em] text-[var(--ink-soft)]">{content.badgeText}</p>
        <h1 className="texart-display mt-4 text-4xl leading-tight sm:text-6xl">{content.heading}</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[var(--ink-soft)]">{content.subtext}</p>
      </div>
    </section>
  );
}
