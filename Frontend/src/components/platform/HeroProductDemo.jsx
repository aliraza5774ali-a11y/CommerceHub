import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DEMO_STEPS, STEP_HOLD_MS } from "./demo/steps";
import DemoSidebar from "./demo/DemoSidebar";
import DemoDashboard from "./demo/DemoDashboard";
import DemoProducts from "./demo/DemoProducts";
import DemoOrders from "./demo/DemoOrders";
import DemoInventory from "./demo/DemoInventory";
import DemoCustomers from "./demo/DemoCustomers";
import DemoAnalytics from "./demo/DemoAnalytics";

const PANELS = {
  dashboard: DemoDashboard,
  products: DemoProducts,
  orders: DemoOrders,
  inventory: DemoInventory,
  customers: DemoCustomers,
  analytics: DemoAnalytics,
};

// Pure visual product demonstration — this never touches the router,
// never navigates the browser, and never leaves "/".
const HeroProductDemo = () => {
  const prefersReducedMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const wrapperRef = useRef(null);
  const isFinePointer = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(pointer: fine)").matches,
    []
  );

  useEffect(() => {
    const id = setInterval(
      () => setStepIndex((i) => (i + 1) % DEMO_STEPS.length),
      STEP_HOLD_MS
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !isFinePointer) return;
    const node = wrapperRef.current;
    if (!node) return;

    const handleMove = (e) => {
      const rect = node.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setParallax({ x: nx, y: ny });
    };
    const handleLeave = () => setParallax({ x: 0, y: 0 });

    window.addEventListener("mousemove", handleMove);
    node.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      node.removeEventListener("mouseleave", handleLeave);
    };
  }, [prefersReducedMotion, isFinePointer]);

  const activeStep = DEMO_STEPS[stepIndex];

  return (
    <div
      ref={wrapperRef}
      className="relative mx-auto w-full max-w-2xl lg:max-w-none"
      style={{ perspective: "1400px" }}
    >
      <motion.div
        initial={
          prefersReducedMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.94, y: 80, rotateX: 8, rotateY: -4 }
        }
        animate={
          prefersReducedMotion
            ? { opacity: 1 }
            : {
                opacity: 1,
                scale: 1,
                y: [80, 0, 0],
                rotateX: [8, 0, 0],
                rotateY: [-4, 0, 0],
              }
        }
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* continuous idle float */}
        <motion.div
          animate={
            prefersReducedMotion
              ? {}
              : { y: [0, -4, 0] }
          }
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            transform:
              !prefersReducedMotion && isFinePointer
                ? `rotateX(${parallax.y * -3}deg) rotateY(${parallax.x * 4}deg) translate3d(${parallax.x * 6}px, ${parallax.y * 6}px, 0)`
                : undefined,
            transition: "transform 0.3s ease-out",
          }}
          className="relative"
        >
          {/* border glow */}
          <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-b from-accent/20 to-transparent opacity-60 blur-[1px]" />

          <div className="relative overflow-hidden rounded-3xl border border-black/8 bg-white shadow-md">
            {/* window chrome */}
            <div className="flex items-center gap-1.5 border-b border-black/8 bg-black/[0.02] px-4 py-2.5">
              <span className="h-2 w-2 rounded-full bg-black/10" />
              <span className="h-2 w-2 rounded-full bg-black/10" />
              <span className="h-2 w-2 rounded-full bg-black/10" />
              <span className="ml-3 flex-1 truncate rounded-full bg-black/[0.04] px-3 py-1 text-center font-mono text-[9px] tracking-wide text-black/35">
                commercehub.app/admin
              </span>
            </div>

            <div className="flex h-[340px] sm:h-[380px] lg:h-[420px]">
              <DemoSidebar activeKey={activeStep.key} />

              <div className="relative flex-1 overflow-hidden">
                {DEMO_STEPS.map((step) => {
                  const Panel = PANELS[step.key];
                  const isCurrent = step.key === activeStep.key;
                  return (
                    <div
                      key={step.key}
                      aria-hidden={!isCurrent}
                      className={`absolute inset-0 transition-all duration-500 ease-out ${
                        isCurrent
                          ? "translate-y-0 opacity-100"
                          : "pointer-events-none translate-y-2 opacity-0"
                      }`}
                    >
                      <Panel isActive={isCurrent} reduceMotion={!!prefersReducedMotion} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroProductDemo;