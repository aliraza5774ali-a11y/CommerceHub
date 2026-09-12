import { useMemo, useState } from "react";
import { getLuxeHero } from "../data/heroContent";
import PageHero from "../components/PageHero";

const posts = [
  { category: "Style Guide", title: "How to master the art of minimal style", desc: "Build a timeless wardrobe with high-quality fabrics and effortless silhouettes.", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80", date: "Jan 29, 2026" },
  { category: "Fabric", title: "Why we choose wool over synthetics", desc: "The case for natural fiber in every core piece we make.", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80", date: "Dec 30, 2025" },
  { category: "Style Guide", title: "A capsule wardrobe that works year round", desc: "Invest in fewer, better pieces that mix effortlessly.", image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80", date: "Nov 22, 2025" },
  { category: "Studio", title: "How Luxe started with one coat", desc: "An origin story from a small studio to a considered point of view.", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80", date: "Oct 10, 2025" },
];

export default function LuxeBlog() {
  const hero = getLuxeHero("blog");
  const [active, setActive] = useState("All");
  const categories = ["All", ...new Set(posts.map((p) => p.category))];
  const visible = useMemo(() => (active === "All" ? posts : posts.filter((p) => p.category === active)), [active]);

  return (
    <>
      <PageHero content={hero} />
      <section className="px-5 py-14 sm:px-10 lg:px-16">
        <div className="luxe-scrollbar mb-10 flex gap-6 overflow-x-auto border-b border-[var(--line)] pb-4">
          {categories.map((c) => (
            <button key={c} onClick={() => setActive(c)} className={`shrink-0 text-sm ${active === c ? "text-[var(--ink)] underline underline-offset-4" : "text-[var(--ink-soft)]"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
          {visible.map((post) => (
            <article key={post.title}>
              <img src={post.image} alt="" className="aspect-[16/10] h-full w-full object-cover" />
              <div className="pt-4">
                <p className="text-xs uppercase tracking-[.14em] text-[var(--ink-soft)]">{post.category} · {post.date}</p>
                <h2 className="luxe-display mt-3 text-2xl leading-tight">{post.title}</h2>
                <p className="mt-3 leading-7 text-[var(--ink-soft)]">{post.desc}</p>
                <button className="mt-4 text-sm underline underline-offset-4">Read story</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
