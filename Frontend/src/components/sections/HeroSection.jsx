import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const HeroSection = ({
  image = "",
  badge,
  heading,
  subtext,
  primaryLink = "/shops",
  primaryLabel = "See Collection",
  secondaryLink = "/contact",
  secondaryLabel = "Contact us",
  mode = "hero",
  showScrollCue = true,
  children,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mode !== "hero") return;
    const handleMouseMove = (e) => {
      if (!sectionRef.current || window.innerWidth < 1024) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePos({ x: x * 10, y: y * 10 });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mode]);

  // ─── HERO MODE (REDESIGNED) ─────────────────────────────────────────────
  if (mode === "hero") {
    return (
      <section
        ref={sectionRef}
        className="relative flex min-h-[100dvh] w-full overflow-hidden bg-[#050505]"
      >
        {/* Full-bleed background image with subtle zoom on load */}
        <div className="absolute inset-0 z-0">
          <img
            src={image}
            alt=""
            className={`h-full w-full object-cover transition-all duration-[1.4s] ease-out ${
              isLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
            }`}
            style={{
              transform: isLoaded
                ? `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px) scale(1)`
                : "scale(1.1)",
              transition: "transform 0.6s ease-out, opacity 1.4s ease-out",
            }}
            onLoad={() => setIsLoaded(true)}
          />
        </div>

        {/* Gradient overlays for text readability */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to right, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.5) 45%, rgba(5,5,5,0.2) 70%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to top, rgba(5,5,5,0.7) 0%, transparent 40%)",
          }}
        />
        {/* Bottom fade for scroll transition */}
        <div
          className="absolute bottom-0 left-0 right-0 z-[1] h-32"
          style={{
            background:
              "linear-gradient(to top, rgba(5,5,5,0.8) 0%, transparent 100%)",
          }}
        />

        {/* Content container - left aligned, vertically centered */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-6 pt-20 sm:px-10 lg:px-16 xl:px-20">
          <div className="max-w-xl lg:max-w-2xl">
            {/* Badge */}
            {badge && (
              <div
                className={`mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 px-1.5 py-1.5 backdrop-blur-md transition-all duration-700 ${
                  isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  transitionDelay: "150ms",
                }}
              >
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-900">
                  {badge.label}
                </span>
                <span className="pr-3 text-[11px] font-medium text-white/70">
                  {badge.text}
                </span>
              </div>
            )}

            {/* Heading - massive, tight leading */}
            <h1
              className={`font-display text-balance text-[clamp(2.8rem,7vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-white transition-all duration-1000 ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              {heading}
            </h1>

            {/* Accent line */}
            <div
              className={`my-8 h-[2px] w-20 rounded-full bg-white/20 transition-all duration-700 ${
                isLoaded ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
              }`}
              style={{
                transitionDelay: "500ms",
                transformOrigin: "left",
              }}
            />

            {/* Subtext */}
            {subtext && (
              <p
                className={`max-w-md text-[15px] leading-[1.7] text-white/50 transition-all duration-700 ${
                  isLoaded
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: "550ms" }}
              >
                {subtext}
              </p>
            )}

            {/* CTA Buttons */}
            <div
              className={`mt-10 flex flex-col gap-3 sm:flex-row sm:items-center ${
                isLoaded
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "700ms" }}
            >
              <Link
                to={primaryLink}
                className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-[13px] font-semibold text-neutral-900 transition-all duration-300 hover:bg-neutral-100 hover:shadow-[0_0_40px_rgba(255,255,255,0.12)] active:scale-[0.97]"
              >
                {primaryLabel}
                <svg
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
              <Link
                to={secondaryLink}
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-3.5 text-[13px] font-medium text-white/60 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/5 hover:text-white/90 active:scale-[0.97]"
              >
                {secondaryLabel}
              </Link>
            </div>

            {/* Scroll cue */}
            {showScrollCue && (
              <div
                className={`mt-16 hidden items-center gap-3 lg:flex transition-all duration-700 ${
                  isLoaded ? "opacity-100" : "opacity-0"
                }`}
                style={{ transitionDelay: "900ms" }}
              >
                <div className="h-10 w-px overflow-hidden bg-white/15">
                  <div
                    className="h-full w-full bg-white/50"
                    style={{
                      animation: "scrollDown 2.2s ease-in-out infinite",
                    }}
                  />
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                  Scroll
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Decorative floating glass element (desktop only) */}
        <div
          className={`pointer-events-none absolute right-[10%] top-1/4 z-[2] hidden h-56 w-56 rounded-full lg:block ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
            backdropFilter: "blur(60px)",
            transform: `translate(${mousePos.x * -2}px, ${
              mousePos.y * -2
            }px)`,
            transition: "transform 0.5s ease-out, opacity 1s ease-out",
            transitionDelay: "opacity 200ms",
          }}
        />

        <style>{`
          @keyframes scrollDown {
            0% { transform: translateY(-100%); }
            50% { transform: translateY(0%); }
            100% { transform: translateY(100%); }
          }
        `}</style>
      </section>
    );
  }

  // ─── BLOG MODE ────────────────────────────────────────────────────────────
  if (mode === "blog") {
    return (
      <section className="relative flex min-h-[55dvh] w-full items-end overflow-hidden bg-[#080808] sm:min-h-[60dvh]">
        <div className="absolute inset-0 z-0">
          <img src={image} alt="" className={`h-full w-full object-cover object-top transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`} onLoad={() => setIsLoaded(true)} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,8,8,0.4) 0%, rgba(8,8,8,0.55) 50%, rgba(8,8,8,0.85) 100%)" }} />
        </div>
        <div className="relative z-10 w-full px-6 pb-14 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl text-center">
            {badge && (
              <p className={`mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-white/35 transition-all duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "100ms" }}>Blog</p>
            )}
            <h1 className={`font-display text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.0] tracking-[-0.03em] text-white transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "200ms" }}>{heading}</h1>
            {subtext && <p className={`mx-auto mt-4 max-w-sm text-[14px] text-white/40 transition-all duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "400ms" }}>{subtext}</p>}
            {children && (
              <div className={`mt-8 transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "550ms" }}>{children}</div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ─── CONTACT MODE ─────────────────────────────────────────────────────────
  if (mode === "contact") {
    return (
      <section className="relative flex min-h-[55dvh] w-full items-end overflow-hidden bg-[#080808] sm:min-h-[60dvh]">
        <div className="absolute inset-0 z-0">
          <img src={image} alt="" className={`h-full w-full object-cover transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`} onLoad={() => setIsLoaded(true)} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,8,8,0.4) 0%, rgba(8,8,8,0.55) 50%, rgba(8,8,8,0.85) 100%)" }} />
        </div>
        <div className="relative z-10 w-full px-6 pb-14 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl text-center">
            {badge && (
              <p className={`mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-white/35 transition-all duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "100ms" }}>Contact</p>
            )}
            <h1 className={`font-display text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.0] tracking-[-0.03em] text-white transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "200ms" }}>{heading}</h1>
            {subtext && <p className={`mx-auto mt-4 max-w-sm text-[14px] text-white/40 transition-all duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "400ms" }}>{subtext}</p>}
            {children && (
              <div className={`mt-8 transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "550ms" }}>{children}</div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ─── ABOUT MODE ───────────────────────────────────────────────────────────
  if (mode === "about") {
    return (
      <section className="relative flex min-h-[55dvh] w-full items-end overflow-hidden bg-[#080808] sm:min-h-[60dvh]">
        <div className="absolute inset-0 z-0">
          <img src={image} alt="" className={`h-full w-full object-cover transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`} onLoad={() => setIsLoaded(true)} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,8,8,0.4) 0%, rgba(8,8,8,0.55) 50%, rgba(8,8,8,0.85) 100%)" }} />
        </div>
        <div className="relative z-10 w-full px-6 pb-14 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl text-center">
            {badge && (
              <p className={`mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-white/35 transition-all duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "100ms" }}>ABOUT</p>
            )}
            <h1 className={`font-display text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.0] tracking-[-0.03em] text-white transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "200ms" }}>{heading}</h1>
            {subtext && <p className={`mx-auto mt-4 max-w-sm text-[14px] text-white/40 transition-all duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "400ms" }}>{subtext}</p>}
            {children && (
              <div className={`mt-8 transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "550ms" }}>{children}</div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ─── SHOP MODE ────────────────────────────────────────────────────────────
  if (mode === "shop") {
    return (
      <section className="relative flex min-h-[55dvh] w-full items-end overflow-hidden bg-[#080808] sm:min-h-[60dvh]">
        <div className="absolute inset-0 z-0">
          <img src={image} alt="" className={`h-full w-full object-cover transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`} onLoad={() => setIsLoaded(true)} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,8,8,0.4) 0%, rgba(8,8,8,0.55) 50%, rgba(8,8,8,0.85) 100%)" }} />
        </div>
        <div className="relative z-10 w-full px-6 pb-14 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl text-center">
            {badge && (
              <p className={`mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-white/35 transition-all duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "100ms" }}>{badge.label}</p>
            )}
            <h1 className={`font-display text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.0] tracking-[-0.03em] text-white transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "200ms" }}>{heading}</h1>
            {subtext && <p className={`mx-auto mt-4 max-w-sm text-[14px] text-white/40 transition-all duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "400ms" }}>{subtext}</p>}
            {children && (
              <div className={`mt-8 transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "550ms" }}>{children}</div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // ─── COLLECTION MODE ──────────────────────────────────────────────────────
  if (mode === "collection") {
    return (
      <section className="relative flex min-h-[50dvh] w-full items-center overflow-hidden bg-[#080808] sm:min-h-[55dvh]">
        <div className="absolute inset-0 z-0">
          <img src={image} alt="" className={`h-full w-full object-cover transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`} onLoad={() => setIsLoaded(true)} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(8,8,8,0.25) 0%, rgba(8,8,8,0.6) 100%)" }} />
        </div>
        <div className="relative z-10 w-full px-6 text-center sm:px-10 lg:px-16">
          {badge && (
            <p className={`mb-5 text-[10px] font-medium uppercase tracking-[0.3em] text-white/40 transition-all duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "150ms" }}>{badge.label}</p>
          )}
          <h1 className={`font-display text-[clamp(2.5rem,6vw,5rem)] font-medium tracking-[0.05em] text-white transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: "250ms" }}>{heading}</h1>
          {subtext && <p className={`mx-auto mt-4 max-w-sm text-[12px] uppercase tracking-[0.15em] text-white/70 transition-all duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "450ms" }}>{subtext}</p>}
          <div className={`mt-8 transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "600ms" }}>
            <Link to={primaryLink} className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/8 px-7 py-3 text-[13px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/15 active:scale-[0.97]">
              {primaryLabel}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default HeroSection;