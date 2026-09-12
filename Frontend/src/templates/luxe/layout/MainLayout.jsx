import { Outlet } from "react-router-dom";
import "../luxe.css";
import LuxeNavbar from "./LuxeNavbar";
import LuxeFooter from "./LuxeFooter";

export default function LuxeMainLayout() {
  return (
    <div className="luxe-theme min-h-screen">
      <LuxeNavbar />
      <main><Outlet /></main>
      <LuxeFooter />
    </div>
  );
}
