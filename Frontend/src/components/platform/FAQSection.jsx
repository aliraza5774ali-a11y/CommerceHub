import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import PlatformSectionHeader from "./PlatformSectionHeader";

const FAQS = [
  {
    q: "What is CommerceHub?",
    a: "CommerceHub is a platform for creating and running an online store — a customer-facing storefront plus an admin dashboard to manage products, orders, customers and inventory, all in one place.",
  },
  {
    q: "How do I create a store?",
    a: "Open a store from the homepage, name your store and set up your owner account. Your storefront is provisioned instantly on its own CommerceHub address.",
  },
  {
    q: "Can I manage products?",
    a: "Yes. The admin dashboard lets you create, edit and publish products, and adjust stock levels as orders come in.",
  },
  {
    q: "Can I manage orders?",
    a: "Yes. Every order placed on your storefront appears in your admin dashboard, where you can track it through fulfillment.",
  },
  {
    q: "Can I manage inventory?",
    a: "Yes. Inventory is tracked per product and can be adjusted directly from the admin dashboard.",
  },
  {
    q: "How does my store URL work?",
    a: "Each store gets its own CommerceHub address as soon as it's created, ready to be connected to a custom domain.",
  },
  {
    q: "Can I customize my store?",
    a: "Your storefront ships with a polished default theme, and product content, collections and store details are managed from your dashboard.",
  },
];

const FAQItem = ({ item, isOpen, onToggle }) => {
  return (
    <div className="border-b border-black/8 py-5">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        aria-expanded={isOpen}
      >
        <span className="font-display text-base font-medium text-black sm:text-lg">
          {item.q}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-black/35 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl text-sm leading-relaxed text-black/55">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="faq"
      className="scroll-mt-24 w-full bg-[#f8f8f8] px-4 py-16 sm:px-6 sm:py-20 md:px-10 lg:px-16 xl:px-28"
    >
      <div className="mx-auto max-w-4xl">
        <PlatformSectionHeader
          badge="FAQ"
          icon={<HelpCircle size={12} strokeWidth={2} />}
          heading="Common questions"
        />

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 rounded-3xl border border-black/8 bg-white px-6 shadow-sm sm:px-8"
        >
          {FAQS.map((item, i) => (
            <FAQItem
              key={item.q}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;