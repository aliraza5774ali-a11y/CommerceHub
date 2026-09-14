import { Truck, ShieldCheck, RotateCcw, Headset } from "lucide-react";

const FEATURES = [
  [Truck, "Free Shipping", "For all orders over $100"],
  [ShieldCheck, "Secured Payment", "Payment cards accepted"],
  [RotateCcw, "30 Days Returns", "For an exchange product"],
  [Headset, "24/7 Support", "Contact us anytime"],
];

export default function FeatureBar() {
  return (
    <section className="px-5 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-4">
        {FEATURES.map(([Icon, title, sub]) => (
          <div key={title} className="flex flex-col items-center gap-2 rounded-xl border border-[var(--line)] bg-white p-5 text-center">
            <Icon size={22} className="text-[var(--sun)]" />
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-[var(--ink-soft)]">{sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
