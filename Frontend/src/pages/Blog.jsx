import { useMemo, useState } from "react";
import HeroSection from "../components/sections/HeroSection";
import blogHero from "../assets/blog_01.avif";
import blog1 from "../assets/blog_01.avif";
import blog2 from "../assets/blog_02.avif";
import blog3 from "../assets/blog_03.avif";
import BlogCard from "../components/BlogCard";

const CATEGORIES = ["All Blogs", "Style Guide", "Fashion Tips", "Brand Stories"];

const BLOGS = [
  { img: blog1, category: "Style Guide", title: "How to master the art of minimal street style", desc: "Build a timeless wardrobe with high-quality fabrics, muted tones, and effortless oversized fits.", read: "8 min read", date: "Jan 29, 2026" },
  { img: blog2, category: "Fashion Tips", title: "Elevate everyday outfits using modern minimalist styling", desc: "Simple changes to your daily outfit that make a dramatic difference in how you present yourself.", read: "6 min read", date: "Dec 30, 2025" },
  { img: blog3, category: "Style Guide", title: "Build a capsule wardrobe that works year round", desc: "Invest in fewer, better pieces that mix and match effortlessly across every season.", read: "5 min read", date: "Nov 22, 2025" },
  { img: blog1, category: "Brand Stories", title: "How Wearix started with one jacket and a vision", desc: "The origin story of Wearix — from a small studio in Lahore to a global minimal fashion brand.", read: "10 min read", date: "Oct 10, 2025" },
  { img: blog2, category: "Fashion Tips", title: "The only 5 colours you need in your wardrobe", desc: "A practical guide to building a neutral-forward palette that works for every occasion.", read: "4 min read", date: "Sep 5, 2025" },
  { img: blog3, category: "Brand Stories", title: "Behind the fabric — our sustainability promise", desc: "How we source, test, and choose the materials that go into every Wearix piece.", read: "7 min read", date: "Aug 18, 2025" },
  { img: blog1, category: "Style Guide", title: "Layering for winter without the bulk", desc: "Stay warm and sharp with these expert layering techniques for the colder months.", read: "6 min read", date: "Jul 30, 2025" },
  { img: blog2, category: "Fashion Tips", title: "How to dress for your body type in 2026", desc: "Modern guidance on finding silhouettes that complement your natural shape.", read: "8 min read", date: "Jun 12, 2025" },
  { img: blog3, category: "Brand Stories", title: "Meet the makers behind our AW 2025 collection", desc: "A look at the artisans and designers who brought Arctic Minimal to life.", read: "9 min read", date: "May 1, 2025" },
];

const Blog = () => {
  const [active, setActive] = useState("All Blogs");

  const filtered = useMemo(() => {
    return active === "All Blogs"
      ? BLOGS
      : BLOGS.filter((b) => b.category === active);
  }, [active]);

  const featured = filtered[0];
  const rest = filtered.slice(1);
  const mobileCards = filtered.slice(0, 3);

  return (
    <div className="bg-[#f8f8f8]">
           <HeroSection
  mode="blog"
  image={blogHero}
  badge={{ label: "Shop", text: "Curated for you" }}
  heading="Find your perfect fit"
  subtext="Browse our latest arrivals and timeless classics"
  primaryLabel="New Arrivals"
  secondaryLabel="Best Sellers"
/>

      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-12 lg:py-16 xl:px-20 2xl:px-28">
        <div className="w-full rounded-full bg-[#eeeeee] p-1.5">
  <div className="flex w-full gap-2 overflow-x-auto sm:overflow-visible">
    {CATEGORIES.map((cat) => (
      <button
        key={cat}
        onClick={() => setActive(cat)}
        className={`min-w-max flex-1 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-base ${
          active === cat
            ? "bg-black text-white shadow-sm"
            : "bg-white text-black hover:bg-black/5"
        }`}
      >
        {cat}
      </button>
    ))}
  </div>
</div>

        {filtered.length > 0 ? (
          <>
            <div className="hidden md:block">
              <div className="flex flex-col gap-4">
                {featured && <BlogCard blog={featured} large />}
                {rest.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {rest.map((blog, i) => (
                      <BlogCard key={i} blog={blog} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:hidden">
              {mobileCards.map((blog, i) => (
                <BlogCard key={i} blog={blog} large={i === 0} />
              ))}
            </div>

            {filtered.length > 3 && (
              <div className="md:hidden">
                <button className="mx-auto mt-2 block rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white">
                  View more
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 sm:py-28 md:py-32 gap-3">
            <p className="font-display text-xl font-medium text-black sm:text-2xl">
              No posts found
            </p>
            <p className="text-sm text-black/40">
              Try selecting a different category
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;