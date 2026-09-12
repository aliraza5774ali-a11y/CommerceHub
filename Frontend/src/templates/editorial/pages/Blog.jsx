import { useMemo, useState } from "react";
import { getDummyHero } from "../data/heroContent";
import PageHero from "../components/PageHero";
import { editorialImages } from "../placeholderImages";

const posts = [
  { category: "Style Guide", title: "Building a kitchen that feels calmer", desc: "Fewer, better pieces make for a quieter countertop and a slower morning routine.", image: editorialImages.newsletterTileA, date: "Jan 29, 2026" },
  { category: "Materials", title: "Why we chose reclaimed walnut", desc: "A look at the sourcing behind our cutting boards and prep tools.", image: editorialImages.newsletterTileB, date: "Dec 30, 2025" },
  { category: "Style Guide", title: "A capsule kitchen that works year round", desc: "Invest in fewer, better pieces that mix effortlessly.", image: editorialImages.newsletterTileC, date: "Nov 22, 2025" },
  { category: "Studio Notes", title: "How Homedine started with one kettle", desc: "An origin story from a small studio to a global point of view.", image: editorialImages.newsletterTileD, date: "Oct 10, 2025" },
];

export default function EditorialBlog() {
  const hero = getDummyHero("blog");
  const [active, setActive] = useState("All posts");
  const categories = ["All posts", ...new Set(posts.map((p) => p.category))];
  const visible = useMemo(() => (active === "All posts" ? posts : posts.filter((p) => p.category === active)), [active]);

  return (
    <>
      <PageHero content={hero} eyebrow="Field notes" />
      <section className="px-5 py-14 sm:px-10 lg:px-16">
        <div className="editorial-scrollbar mb-10 flex gap-6 overflow-x-auto border-y border-[var(--forest)]/20 py-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActive(category)}
              className={`shrink-0 text-xs uppercase tracking-[.15em] ${active === category ? "text-[var(--coral)]" : "text-[var(--forest)]/55"}`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
          {visible.map((post, i) => (
            <article key={post.title} className={i === 0 ? "md:col-span-2 md:grid md:grid-cols-2 md:gap-8" : ""}>
              <img src={post.image} alt="" className="aspect-[16/10] h-full w-full rounded-xl object-cover" />
              <div className={i === 0 ? "self-center py-5" : "pt-4"}>
                <p className="text-xs uppercase tracking-[.16em] text-[var(--coral)]">{post.category} · {post.date}</p>
                <h2 className="editorial-display mt-3 text-3xl leading-tight">{post.title}</h2>
                <p className="mt-3 leading-7 text-[var(--forest)]/70">{post.desc}</p>
                <button className="mt-5 text-xs uppercase tracking-[.15em] underline underline-offset-4">Read story</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
