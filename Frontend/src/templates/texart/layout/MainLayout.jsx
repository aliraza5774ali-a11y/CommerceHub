import { Outlet } from "react-router-dom";
import "../texart.css";
import TexartNavbar from "./TexartNavbar";
import TexartFooter from "./TexartFooter";

export default function TexartMainLayout() {
  return (
    <div className="texart-theme min-h-screen">
      <TexartNavbar />
      <main><Outlet /></main>
      <TexartFooter />
    </div>
  );
}
