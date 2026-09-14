import { useMemo, useState } from "react";
import { getVibrantHero } from "../data/heroContent";
import PageHero from "../components/PageHero";

const posts = [
  { category: "Style Guide", title: "5 ways to style a denim jacket", desc: "From casual weekends to smart-casual dinners — one jacket, five looks.", image: "https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?auto=format&fit=crop&w=800&q=80", date: "Jan 29, 2026" },
  { category: "Reviews", title: "Reader favorites this month", desc: "The pieces our community couldn't stop talking about.", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80", date: "Dec 30, 2025" },
  { category: "Style Guide", title: "Building a capsule closet on a budget", desc: "Fewer, better pieces that still feel like you.", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80", date: "Nov 22, 2025" },
  { category: "Studio Notes", title: "Behind the Frolax spring drop", desc: "A look at how each season's collection comes together.", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80", date: "Oct 10, 2025" },
];

export default function VibrantBlog() {
  const hero = getVibrantHero("blog");
  const [active, setActive] = useState("All");
  const categories = ["All", ...new Set(posts.map((p) => p.category))];
  const visible = useMemo(() => (active === "All" ? posts : posts.filter((p) => p.category === active)), [active]);

  return (
    <>
      <PageHero content={hero} />
      <section className="px-5 py-14 sm:px-10 lg:px-16">
        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button key={c} onClick={() => setActive(c)} className={`rounded-full px-4 py-2 text-sm ${active === c ? "bg-[var(--sun)] text-white" : "bg-white text-[var(--ink-soft)]"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
          {visible.map((post) => (
            <article key={post.title} className="overflow-hidden rounded-2xl bg-white">
              <img src={post.image} alt="" className="aspect-[16/10] h-full w-full object-cover" />
              <div className="p-5">
                <p className="text-xs uppercase tracking-[.1em] text-[var(--sun)]">{post.category} · {post.date}</p>
                <h2 className="vibrant-display mt-3 text-xl leading-tight">{post.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{post.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
