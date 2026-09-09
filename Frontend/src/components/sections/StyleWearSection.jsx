import {
  AlertCircle,
  Calendar,
  CombineIcon,
  FingerprintIcon,
  Hexagon,
  Pentagon,
  Shirt,
  Sparkles,
  Star,
} from "lucide-react";
import { GiClothesline, GiTiger } from "react-icons/gi";
import style01 from "../../assets/style_01.avif";
import style02 from "../../assets/style_02.avif";
import style11 from "../../assets/style_11.avif";
import style12 from "../../assets/style_12.avif";
import style21 from "../../assets/style_21.avif";
import style22 from "../../assets/style_22.avif";
import style31 from "../../assets/style_31.avif";
import style32 from "../../assets/style_32.avif";
import style41 from "../../assets/style_41.avif";
import style42 from "../../assets/style_42.avif";
import style51 from "../../assets/style_51.avif";
import style52 from "../../assets/style_52.avif";
import StyleCard from "../StyleCard";
import { BsInfinity } from "react-icons/bs";
import { IoAnalyticsSharp } from "react-icons/io5";
import { MdDashboard, MdDoubleArrow } from "react-icons/md";
import { PiFunction } from "react-icons/pi";
import { FcTreeStructure } from "react-icons/fc";
import { BiColorFill } from "react-icons/bi";

const styleCards1 = [
  {
    id: 1,
    title: "Everyday Comfort",
    description: "Designed to feel natural on the body throughout long, active days.",
    style01,
    style02,
    features: [
      { icon: Shirt, content: "All day wear" },
      { icon: Star, content: "Comfort" },
      { icon: Sparkles, content: "Relaxed fit" },
    ],
  },
  {
    id: 2,
    title: "Modern Silhouettes",
    description:
      "Contemporary shapes balance structure & ease for confident everyday styling.",
    style01: style11,
    style02: style12,
    features: [
      { icon: BiColorFill, content: "Balance fit" },
      { icon: Pentagon, content: "Modern" },
      { icon: FcTreeStructure, content: "Structured" },
    ],
  },
  {
    id: 3,
    title: "Effortless Styling",
    description:
      "Pieces work together naturally, making daily outfit choices simple & intuitive.",
    style01: style21,
    style02: style22,
    features: [
      { icon: MdDashboard, content: "Versatile" },
      { icon: Star, content: "Easy to Style" },
      { icon: CombineIcon, content: "Layered" },
    ],
  },
];

const styleCards2 = [
  {
    id: 1,
    title: "Daily Essentials",
    description: "Core clothing pieces designed for frequent wear across everyday routines.",
    style01: style31,
    style02: style32,
    features: [
      { icon: Hexagon, content: "Core pieces" },
      { icon: Calendar, content: "Everyday" },
      { icon: GiClothesline, content: "Wearable" },
    ],
  },
  {
    id: 2,
    title: "Wearable Design",
    description:
      "Design decisions focused on comfort, fit, and real-life wearability.",
    style01: style41,
    style02: style42,
    features: [
      { icon: FingerprintIcon, content: "Practical" },
      { icon: PiFunction, content: "Functional" },
      { icon: MdDoubleArrow, content: "Adaptable" },
    ],
  },
  {
    id: 3,
    title: "Clean Aesthetic",
    description:
      "Designed to feel natural on the body throughout long, active days.",
    style01: style51,
    style02: style52,
    features: [
      { icon: IoAnalyticsSharp, content: "Clean Lines" },
      { icon: AlertCircle, content: "Minimal" },
      { icon: BsInfinity, content: "Timeless" },
    ],
  },
];

const StyleWearSection = () => {
  return (
    <section className="bg-[#f8f8f8] px-4 py-10 sm:px-6 md:px-10 lg:px-16 xl:px-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:gap-10">
        <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white text-xs font-medium text-black shadow-sm overflow-hidden">
            <span className="bg-black rounded-full p-2 text-white">
              <GiTiger size={13} />
            </span>
            <span className="pr-3">What defines our wear</span>
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight tracking-wide text-black">
            Where style meets ease
          </h2>

          <p className="max-w-2xl text-sm sm:text-base text-black/50 leading-relaxed">
            Thoughtful design blending modern style, comfort, and versatility for
            everyday living across lifestyles.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:gap-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {styleCards1.map((card) => (
              <StyleCard key={card.id} card={card} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-3">
            {styleCards2.map((card) => (
              <StyleCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StyleWearSection;