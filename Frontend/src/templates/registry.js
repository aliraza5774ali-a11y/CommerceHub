import ClassicMainLayout from "./classic/layout/MainLayout";
import ClassicHome from "./classic/pages/Home";
import ClassicShops from "./classic/pages/Shops";
import ClassicCollection from "./classic/pages/Collection";
import ClassicAbout from "./classic/pages/About";
import ClassicContact from "./classic/pages/Contact";
import ClassicBlog from "./classic/pages/Blog";
import ClassicProductDetails from "./classic/pages/ProductDetails";

import EditorialMainLayout from "./editorial/layout/MainLayout";
import EditorialHome from "./editorial/pages/Home";
import EditorialShops from "./editorial/pages/Shops";
import EditorialCollection from "./editorial/pages/Collection";
import EditorialAbout from "./editorial/pages/About";
import EditorialContact from "./editorial/pages/Contact";
import EditorialBlog from "./editorial/pages/Blog";
import EditorialProductDetails from "./editorial/pages/ProductDetails";

import LuxeMainLayout from "./luxe/layout/MainLayout";
import LuxeHome from "./luxe/pages/Home";
import LuxeShops from "./luxe/pages/Shops";
import LuxeCollection from "./luxe/pages/Collection";
import LuxeAbout from "./luxe/pages/About";
import LuxeContact from "./luxe/pages/Contact";
import LuxeBlog from "./luxe/pages/Blog";
import LuxeProductDetails from "./luxe/pages/ProductDetails";

import VibrantMainLayout from "./vibrant/layout/MainLayout";
import VibrantHome from "./vibrant/pages/Home";
import VibrantShops from "./vibrant/pages/Shops";
import VibrantCollection from "./vibrant/pages/Collection";
import VibrantAbout from "./vibrant/pages/About";
import VibrantContact from "./vibrant/pages/Contact";
import VibrantBlog from "./vibrant/pages/Blog";
import VibrantProductDetails from "./vibrant/pages/ProductDetails";

import TexartMainLayout from "./texart/layout/MainLayout";
import TexartHome from "./texart/pages/Home";
import TexartShops from "./texart/pages/Shops";
import TexartCollection from "./texart/pages/Collection";
import TexartAbout from "./texart/pages/About";
import TexartContact from "./texart/pages/Contact";
import TexartBlog from "./texart/pages/Blog";
import TexartProductDetails from "./texart/pages/ProductDetails";

// Each template must provide the same page keys, since App.jsx's storefront
// routes are keyed off this shape — Home/Shops/Collection/About/Contact/Blog/
// ProductDetails. Admin and Account routes are never templated; only the
// customer-facing storefront is.
export const TEMPLATES = {
  classic: {
    label: "Classic",
    layout: ClassicMainLayout,
    pages: {
      Home: ClassicHome,
      Shops: ClassicShops,
      Collection: ClassicCollection,
      About: ClassicAbout,
      Contact: ClassicContact,
      Blog: ClassicBlog,
      ProductDetails: ClassicProductDetails,
    },
  },
  editorial: {
    label: "Editorial",
    layout: EditorialMainLayout,
    pages: {
      Home: EditorialHome,
      Shops: EditorialShops,
      Collection: EditorialCollection,
      About: EditorialAbout,
      Contact: EditorialContact,
      Blog: EditorialBlog,
      ProductDetails: EditorialProductDetails,
    },
  },
  luxe: {
    label: "Luxe",
    layout: LuxeMainLayout,
    pages: {
      Home: LuxeHome,
      Shops: LuxeShops,
      Collection: LuxeCollection,
      About: LuxeAbout,
      Contact: LuxeContact,
      Blog: LuxeBlog,
      ProductDetails: LuxeProductDetails,
    },
  },
  vibrant: {
    label: "Vibrant",
    layout: VibrantMainLayout,
    pages: {
      Home: VibrantHome,
      Shops: VibrantShops,
      Collection: VibrantCollection,
      About: VibrantAbout,
      Contact: VibrantContact,
      Blog: VibrantBlog,
      ProductDetails: VibrantProductDetails,
    },
  },
  texart: {
    label: "Texart",
    layout: TexartMainLayout,
    pages: {
      Home: TexartHome,
      Shops: TexartShops,
      Collection: TexartCollection,
      About: TexartAbout,
      Contact: TexartContact,
      Blog: TexartBlog,
      ProductDetails: TexartProductDetails,
    },
  },
};

export function resolveTemplate(id) {
  return TEMPLATES[id] || TEMPLATES.classic;
}
