import { Outlet } from "react-router-dom";
import "../editorial.css";
import EditorialNavbar from "./EditorialNavbar";
import EditorialFooter from "./EditorialFooter";

// Editorial's own shell — its own Navbar and Footer, independent from the
// Classic template's shared components, so this template can be restyled
// on its own without touching Classic.
export default function EditorialMainLayout() {
  return (
    <div className="editorial-theme min-h-screen">
      <EditorialNavbar />
      <main><Outlet /></main>
      <EditorialFooter />
    </div>
  );
}
