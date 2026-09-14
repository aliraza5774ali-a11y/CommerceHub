import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useTenant } from "../../../components/TenantProvider";

const MainLayout = () => {
  const { tenant } = useTenant();
  const templateId = tenant?.themeId || "classic";
  return (
    <div className={`storefront-template storefront-template--${templateId}`}>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
