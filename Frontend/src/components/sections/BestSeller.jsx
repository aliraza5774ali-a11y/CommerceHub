import { useEffect, useState } from "react";
import img01 from "../../assets/product_01.avif";
import img02 from "../../assets/product-01.avif";
import img11 from "../../assets/product_02.avif";
import img12 from "../../assets/product-02.avif";
import img21 from "../../assets/product_03.avif";
import img22 from "../../assets/produc_03.avif";
import img31 from "../../assets/product_04.avif";
import img32 from "../../assets/product-04.avif";
import img41 from "../../assets/product_05.avif";
import img42 from "../../assets/product-05.avif";
import img51 from "../../assets/product_06.avif";
import img52 from "../../assets/product-06.avif";
import SampleProduct from "../SampleProduct";
import SectionHeader from "../SectionHeader";
import { Crown } from "lucide-react";

const products = [
  {
    img1: img01,
    img2: img02,
    title: "Textured Knitted Shirt",
    price: "$59.00",
    discount: "$79.00",
  },
  {
    img1: img11,
    img2: img12,
    title: "Relaxed Linen Overshirt",
    price: "$69.00",
    discount: "$89.00",
  },
  {
    img1: img21,
    img2: img22,
    title: "Minimal Utility Jacket",
    price: "$99.00",
    discount: "$129.00",
  },
  {
    img1: img31,
    img2: img32,
    title: "Soft Fleece Pullover",
    price: "$79.00",
    discount: "$99.00",
  },
  {
    img1: img41,
    img2: img42,
    title: "Essential Cargo Trouser",
    price: "$89.00",
    discount: "$109.00",
  },
  {
    img1: img51,
    img2: img52,
    title: "Cotton Everyday Tee",
    price: "$39.00",
    discount: "$55.00",
  },
];

const BestSeller = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const visibleProducts = isMobile ? products.slice(0, 3) : products;

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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product, index) => (
            <SampleProduct key={index} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSeller;