import { Shirt, Wind, Sparkles, Recycle } from "lucide-react";

const FEATURES = [
  [Wind, "Premium fabric", "Soft, breathable cotton with a weight that feels just right."],
  [Shirt, "Perfect fit", "Room to move, tailored where it counts."],
  [Sparkles, "Modern checks", "Timeless patterns remixed in colours made for right now."],
  [Recycle, "Made to last", "Reinforced seams and precise stitching, built for repeat wear."],
];

export default function FlexFeature() {
  return (
    <section className="grid sm:grid-cols-3">
      <div className="flex flex-col justify-center bg-[var(--lime)] px-8 py-16">
        <p className="text-xs uppercase tracking-[.2em] text-[var(--ink-soft)]">Why Texart / 02</p>
        <h2 className="texart-display mt-4 text-4xl leading-tight">
          Built for the <em>everyday flex</em>.
        </h2>
        <p className="mt-5 max-w-xs text-sm leading-6 text-[var(--ink-soft)]">
          Good shirts get better with every wear. We make the ones you reach for first, then keep on rotation.
        </p>
      </div>
      <div className="min-h-[280px] bg-[url('https://images.unsplash.com/photo-1618886614638-80e3c103d31a?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center" />
      <div className="grid grid-cols-2 gap-px bg-[var(--ink)]/10">
        {FEATURES.map(([Icon, title, desc]) => (
          <div key={title} className="flex flex-col gap-3 bg-[var(--violet)] p-6">
            <Icon size={20} />
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs leading-5 text-[var(--ink-soft)]">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
