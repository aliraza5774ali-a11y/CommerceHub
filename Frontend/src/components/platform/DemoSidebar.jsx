import { motion } from "framer-motion";
import { DEMO_STEPS } from "./steps";

const DemoSidebar = ({ activeKey }) => {
  return (
    <div className="hidden w-[124px] shrink-0 flex-col gap-1 border-r border-black/8 bg-[#f8f8f8] p-2.5 sm:flex sm:w-[148px]">
      <div className="mb-2 flex items-center gap-1.5 px-2 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-black/20" />
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-black/35">
          Admin
        </span>
      </div>

      {DEMO_STEPS.map((step) => {
        const isActive = step.key === activeKey;
        const Icon = step.icon;
        return (
          <div key={step.key} className="relative">
            {isActive && (
              <motion.div
                layoutId="demo-active-pill"
                className="absolute inset-0 rounded-xl bg-[#cfff04]/15"
                transition={{ type: "spring", stiffness: 350, damping: 32 }}
              />
            )}
            <div
              className={`relative flex items-center gap-2 rounded-lg px-2.5 py-2 transition-colors duration-300 ${
                isActive ? "text-black" : "text-black/35"
              }`}
            >
              <Icon size={13} strokeWidth={1.75} />
              <span className="text-[11px] font-medium">{step.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DemoSidebar;