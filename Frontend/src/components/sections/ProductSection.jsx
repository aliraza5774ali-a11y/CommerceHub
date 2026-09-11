import { LuSparkles } from "react-icons/lu";
import { useEffect, useState } from "react";
import SampleProduct from "../SampleProduct";
import SectionHeader from "../SectionHeader";
import { api } from "../../api/commerceApi";
import { toDisplayProducts } from "../../utils/productDisplay";

const ProductSection = () => {
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .publicProducts()
      .then((items) => {
        if (!active) return;
        setVisibleProducts(toDisplayProducts(items));
      })
      .catch(() => {
        if (active) setVisibleProducts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (!loading && visibleProducts.length === 0) return null;

  return (
    <section className="bg-[#f8f8f8] px-5 py-12 sm:px-8 sm:py-14 md:px-12 lg:px-20 xl:px-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:gap-10">
        <SectionHeader
          badge="New Arrivals"
          icon={<LuSparkles size={13} />}
          heading={
            <>
              Fresh fits in <br /> our latest drop
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
            {visibleProducts.slice(0, 3).map((product) => (
              <SampleProduct key={product.slug} {...product} />
            ))}

            <div className="hidden sm:contents">
              {visibleProducts.slice(3).map((product) => (
                <SampleProduct key={product.slug} {...product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
