export default function PageHero({ content, eyebrow = "" }) {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--sand)] px-5 pb-14 pt-32 sm:px-10 lg:px-16">
      <img
        src={content.image}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
      />
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs uppercase tracking-[.25em] text-[var(--ink-soft)]">
          {content.badgeText || eyebrow}
        </p>
        <h1 className="luxe-display mt-4 text-4xl leading-tight sm:text-6xl">
          {content.heading}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[var(--ink-soft)]">
          {content.subtext}
        </p>
      </div>
    </section>
  );
}
