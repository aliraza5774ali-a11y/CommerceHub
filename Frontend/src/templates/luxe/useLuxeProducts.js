import { useEffect, useState } from "react";
import { api } from "../../api/commerceApi";
import { toDisplayProducts } from "../../utils/productDisplay";

// Same live catalog every other template uses (api.publicProducts +
// toDisplayProducts) — no template-specific dummy data.
export function useLuxeProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .publicProducts()
      .then((items) => active && setProducts(toDisplayProducts(items)))
      .catch(() => active && setProducts([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { products, loading };
}
