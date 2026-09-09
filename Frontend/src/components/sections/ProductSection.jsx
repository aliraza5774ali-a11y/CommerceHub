import { LuSparkles } from "react-icons/lu";
import { useEffect, useState } from "react";
import SampleProduct from "../SampleProduct";
import SectionHeader from "../SectionHeader";
import { products } from "../../data/products";
import { api } from "../../api/commerceApi";


const ProductSection = () => {
  const [visibleProducts, setVisibleProducts] = useState([]);

  useEffect(() => {
    let active = true;
    api.publicProducts().then((items) => {
      if (!active) return;
      setVisibleProducts(items.map((item, index) => {
        const presentation = products.find((product) => product.slug === item.slug) || products[index % products.length];
        const regularPrice = Number(item.price).toFixed(2);
        const salePrice = item.salePrice === null || item.salePrice === undefined ? null : Number(item.salePrice).toFixed(2);
        return { ...presentation, slug: item.slug, title: item.name, description: item.description, price: `$${salePrice || regularPrice}`, discount: salePrice ? `$${regularPrice}` : "" };
      }));
    }).catch(() => { if (active) setVisibleProducts([]); });
    return () => { active = false; };
  }, []);

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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.slice(0, 3).map((product, index) => (
            <SampleProduct key={index} {...product} />
          ))}

          <div className="hidden sm:contents">
            {visibleProducts.slice(3).map((product, index) => (
              <SampleProduct key={index + 3} {...product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;