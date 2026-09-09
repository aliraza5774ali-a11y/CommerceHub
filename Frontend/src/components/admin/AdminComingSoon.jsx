import { Construction } from "lucide-react";
import SectionHeader from "../../components/SectionHeader";

// Placeholder for admin sections that haven't been designed yet in this pass.
// Swap each usage out for its real page component as it's built.
export default function AdminComingSoon({ title }) {
  return (
    <div className="flex flex-col gap-8">
      <SectionHeader badge="Admin" heading={title} />
      <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-black/15 bg-white p-8">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-black/60">
          <Construction size={17} strokeWidth={1.75} />
        </span>
        <p className="font-display text-lg font-semibold text-black">This page is being built</p>
        <p className="max-w-md text-sm text-black/55">
          The {title.toLowerCase()} view is under construction and will land here soon.
        </p>
      </div>
    </div>
  );
}