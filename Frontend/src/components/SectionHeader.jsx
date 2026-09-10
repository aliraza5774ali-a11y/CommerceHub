import { Link } from "react-router-dom";

const SectionHeader = ({
  badge,
  icon,
  heading,
  ctaLabel,
  ctaLink,
  ctaOnClick,
}) => {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
      <div className="flex max-w-2xl flex-col gap-4">
        {badge && (
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white pl-1 pr-3 py-1 shadow-sm">
            {icon && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-black">
                {icon}
              </span>
            )}
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-black/80">
              {badge}
            </span>
          </span>
        )}

        <h2 className="font-display text-[clamp(2rem,4vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.01em] text-black">
          {heading}
        </h2>
      </div>

      {ctaLabel &&
        (ctaLink ? (
          <Link
            to={ctaLink}
            className="inline-flex w-fit shrink-0 items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            {ctaLabel}
          </Link>
        ) : (
          <button
            onClick={ctaOnClick}
            className="inline-flex w-fit shrink-0 items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            {ctaLabel}
          </button>
        ))}
    </div>
  );
};

export default SectionHeader;