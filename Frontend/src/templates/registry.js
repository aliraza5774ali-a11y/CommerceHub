import ClassicMainLayout from "../components/layout/MainLayout";
import ClassicHome from "../pages/Home";
import ClassicShops from "../pages/Shops";
import ClassicCollection from "../pages/Collection";
import ClassicAbout from "../pages/About";
import ClassicContact from "../pages/Contact";
import ClassicBlog from "../pages/Blog";
import ClassicProductDetails from "../pages/ProductDetails";

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
      // Not yet built with bespoke Editorial designs (Codex's pass only
      // covered the homepage sections) — reuse Classic's page logic so the
      // rest of the storefront still works end-to-end inside the Editorial
      // shell (its Navbar/Footer/typography). Swap these for real Editorial
      // pages as they're built; see TEMPLATES.md.
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
};

export function resolveTemplate(id) {
  return TEMPLATES[id] || TEMPLATES.classic;
}
