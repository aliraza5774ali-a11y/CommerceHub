import { useEffect, useState } from "react";
import SampleProduct from "../SampleProduct";
import SectionHeader from "../SectionHeader";
import { Crown } from "lucide-react";
import { api } from "../../api/commerceApi";
import { toDisplayProducts } from "../../utils/productDisplay";

const BestSeller = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .publicProducts()
      .then((items) => {
        if (!active) return;
        // No dedicated "best seller" flag exists yet on the catalog — until
        // one is added, show published products here too (newest first).
        setAllProducts(toDisplayProducts(items));
      })
      .catch(() => {
        if (active) setAllProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const products = isMobile ? allProducts.slice(0, 3) : allProducts.slice(0, 6);

  if (!loading && products.length === 0) return null;

  return (
    <section className="bg-[#f8f8f8] px-5 py-12 sm:px-8 sm:py-14 md:px-12 lg:px-20 xl:px-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:gap-10">
        <SectionHeader
          badge="Best Seller"
          icon={<Crown size={13} />}
          heading={
            <>
              Our Signature <br /> best selling pieces
            </>
          }
          ctaLabel="See all collections"
          ctaLink="/collections"
        />

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="aspect-4/5 animate-pulse rounded-3xl bg-[#ededed]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <SampleProduct key={product.slug} {...product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSeller;
