import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";

const TRENDING = ["Winter coats", "Knitwear", "Denim", "Accessories"];

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
  if (isOpen) {
    inputRef.current?.focus();
  } else {
    setTimeout(() => setQuery(""), 0);
  }
}, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 p-4 pt-24 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <Search size={18} className="text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, collections..."
                className="flex-1 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="text-gray-400 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={onClose}
                aria-label="Close search"
                className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={18} />
              </button>
            </div>

            <div className="pt-4">
              {query ? (
                <p className="py-8 text-center text-sm text-gray-500">
                  No results yet — hook this up to your search logic
                </p>
              ) : (
                <>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Trending
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-700 transition hover:bg-gray-50"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
