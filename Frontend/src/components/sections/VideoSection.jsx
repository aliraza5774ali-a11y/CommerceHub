import { useEffect, useRef } from "react";
import video from "../../assets/video_shop.mp4";
import { Link } from "react-router-dom";

const VideoSection = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={video}
        loop
        preload="auto"
        playsInline
        muted
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "50% 50%" }}
      />

      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-5 py-14 text-center sm:min-h-[75vh] sm:px-6 md:min-h-[80vh] md:px-8 lg:px-12">
        <div className="inline-flex max-w-full flex-wrap items-center gap-1 rounded-full border border-white/15 bg-white/10 px-1 py-1 backdrop-blur-md">
          <div className="rounded-full bg-white px-3 py-1">
            <span className="font-display text-xs font-medium tracking-tight text-black">
              Wearix
            </span>
          </div>
          <span className="px-2 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white/90 sm:text-[12px]">
            Since 2014
          </span>
        </div>

        <div className="mt-6 max-w-2xl">
          <h2
            className="font-display text-[clamp(2rem,5vw,4.25rem)] font-semibold leading-[1.05] tracking-tight text-white"
            style={{ textWrap: "balance" }}
          >
            Defining modern style
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/78 sm:text-base md:text-lg">
            A decade ago, we set out to redefine the modern silhouette. Today,
            we merge urban utility with high-end aesthetics in a resilient,
            beautiful collection.
          </p>
        </div>

        <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          <Link
            to="/about"
            className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-[15px] font-medium tracking-tight text-black transition-all duration-300 hover:bg-white/90 sm:w-auto"
          >
            More About Us
          </Link>

          <Link
            to="/contact"
            className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-6 py-3 text-[15px] font-medium tracking-tight text-white backdrop-blur-md transition-all duration-300 hover:bg-white/15 sm:w-auto"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.10)" }}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;