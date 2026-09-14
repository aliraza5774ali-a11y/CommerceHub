import { Link } from "react-router-dom";

export default function PromoStrip() {
  return (
    <section className="px-5 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl bg-sky-100 sm:grid-cols-2">
        <div className="relative min-h-[260px]">
          <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center px-6 py-10 sm:px-12">
          <h2 className="vibrant-display text-3xl leading-tight sm:text-4xl">Fresh Looks For Sunny Days</h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--ink-soft)]">
            From breezy suits to playful sets, this season is all about feeling good and looking better. Step into spring/summer with pieces that radiate confidence, color, and comfort.
          </p>
          <Link to="/shops" className="vibrant-btn vibrant-btn-solid mt-6 w-fit">Shop Now</Link>
        </div>
      </div>
    </section>
  );
}
