import img11 from "../../assets/collection_01.avif";
import img12 from "../../assets/collection_02.avif";
import img13 from "../../assets/collection_03.avif";
import img14 from "../../assets/collection_04.avif";
import img15 from "../../assets/collection_05.avif";
import img21 from "../../assets/collection_11.avif";
import img31 from "../../assets/collection_21.avif";
import CollectionCard from "../CollectionCard";
import SectionHeader from "../SectionHeader";
import { BsCollection } from "react-icons/bs";

const IMAGES1 = [img11, img12, img13, img14, img15];
const IMAGES2 = [img21];
const IMAGES3 = [img31];

const CollectionSection = () => {
  return (
    <section className="bg-[#f8f8f8] px-4 py-10 sm:px-6 md:px-10 lg:px-16 xl:px-28">
      <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10">
        <SectionHeader
          badge="Our Collections"
          icon={<BsCollection size={13} />}
          heading={
            <>
              Modern collections <br className="hidden sm:block" />
              defined by simplicity
            </>
          }
          ctaLabel="Shop all items"
          ctaLink="/shops"
        />

        <CollectionCard
          images={IMAGES1}
          wearType="Men's Wear"
          wearBadge="New"
          title1="Premium modern"
          title2="collection for men"
          priceFrom="$45.00"
          priceTo="$79.00"
        />

        <CollectionCard
          images={IMAGES2}
          wearType="Women's Wear"
          wearBadge="New"
          title1="Modern daily"
          title2="wear for women"
          priceFrom="$35.00"
          priceTo="$150.00"
          reverse={true}
        />

        <CollectionCard
          images={IMAGES3}
          wearType="Children's Wear"
          wearBadge="2026"
          title1="Modern easy"
          title2="stylish for children"
          priceFrom="$25.00"
          priceTo="$90.00"
        />
      </div>
    </section>
  );
};

export default CollectionSection;