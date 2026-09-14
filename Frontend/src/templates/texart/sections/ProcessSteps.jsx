import { Binoculars, Shirt, MousePointerClick, PackageOpen, Repeat } from "lucide-react";

const STEPS = [
  [Binoculars, "Pick your check", "Find the colour that feels like you."],
  [Shirt, "Choose your fit", "Relaxed, regular, or oversized."],
  [MousePointerClick, "Tap to order", "Quick checkout, done fast."],
  [PackageOpen, "Unbox the good stuff", "Fast delivery, wherever in BD."],
  [Repeat, "Wear on repeat", "This one is up to you."],
];

export default function ProcessSteps() {
  return (
    <section className="px-5 py-16 text-center sm:px-10 lg:px-16">
      <p className="text-xs uppercase tracking-[.2em] text-[var(--ink-soft)]">As Easy As / 06</p>
      <h2 className="texart-display mt-2 text-4xl">
        Find it. Wear it.<br /><em>Make it yours.</em>
      </h2>
      <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-5">
        {STEPS.map(([Icon, title, desc], i) => (
          <div key={title} className="relative flex flex-col items-center gap-3">
            {i < STEPS.length - 1 && (
              <span className="absolute left-1/2 top-6 hidden h-px w-full bg-[var(--ink)]/20 sm:block" />
            )}
            <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--lime)]">
              <Icon size={18} />
            </span>
            <p className="text-xs text-[var(--ink-soft)]">0{i + 1}</p>
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs leading-5 text-[var(--ink-soft)]">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
