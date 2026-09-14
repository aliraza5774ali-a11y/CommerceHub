import { getTexartHero } from "../data/heroContent";
import PageHero from "../components/PageHero";

const posts = [
  { title: "How to wear a check shirt three ways", desc: "One shirt, weekend to office to hangout.", image: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?auto=format&fit=crop&w=800&q=80", date: "Jan 29, 2026" },
  { title: "Why 150 GSM cotton is the sweet spot", desc: "The fabric science behind our everyday weight.", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80", date: "Dec 30, 2025" },
  { title: "Behind the Collection 02 colourway", desc: "How we picked this season's limited palette.", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80", date: "Nov 22, 2025" },
];

export default function TexartBlog() {
  const hero = getTexartHero("blog");

  return (
    <>
      <PageHero content={hero} />
      <section className="px-5 py-14 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
          {posts.map((post) => (
            <article key={post.title} className="overflow-hidden rounded-2xl border border-[var(--line)]">
              <img src={post.image} alt="" className="aspect-[4/3] h-full w-full object-cover" />
              <div className="p-5">
                <p className="text-xs uppercase tracking-[.1em] text-[var(--ink-soft)]">{post.date}</p>
                <h2 className="texart-display mt-2 text-xl leading-tight">{post.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{post.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
