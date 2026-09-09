import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";

const CartSidebar = ({ isOpen, onClose }) => {
  const items = useSelector((state) => state.cart?.items) || [];
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Your bag {items.length > 0 && `(${items.length})`}
              </h2>
              <button
                onClick={onClose}
                aria-label="Close cart"
                className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-sm text-gray-500">Your bag is empty</p>
                  <button
                    onClick={onClose}
                    className="mt-4 text-sm font-medium text-gray-900 hover:underline"
                  >
                    Continue shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-16 rounded-xl object-cover"
                      />
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {item.name}
                          </p>
                          <button
                            aria-label="Remove item"
                            className="text-gray-400 hover:text-gray-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        {item.size && (
                          <p className="mt-0.5 text-xs text-gray-500">
                            Size: {item.size}
                          </p>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-3 rounded-full border border-gray-200 px-2 py-1">
                            <button
                              aria-label="Decrease quantity"
                              className="text-gray-500 hover:text-gray-900"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-price text-xs font-medium text-gray-900 tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              aria-label="Increase quantity"
                              className="text-gray-500 hover:text-gray-900"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <p className="font-price text-sm font-medium text-gray-900 tabular-nums">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-5">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-price font-medium text-gray-900 tabular-nums">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <button className="w-full rounded-xl bg-gray-900 py-3 text-sm font-medium text-white transition hover:bg-gray-800">
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
