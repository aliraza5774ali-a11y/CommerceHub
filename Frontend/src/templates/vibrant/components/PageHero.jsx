export default function PageHero({ content }) {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--sun)] px-5 pb-14 pt-32 text-white sm:px-10 lg:px-16">
      <img src={content.image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20" />
      <div className="mx-auto max-w-3xl text-center">
        <p className="vibrant-badge bg-white/15">{content.badgeText}</p>
        <h1 className="vibrant-display mt-4 text-4xl leading-tight sm:text-6xl">{content.heading}</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/85">{content.subtext}</p>
      </div>
    </section>
  );
}
