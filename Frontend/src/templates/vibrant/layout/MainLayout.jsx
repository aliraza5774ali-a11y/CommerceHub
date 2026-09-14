import { Outlet } from "react-router-dom";
import "../vibrant.css";
import VibrantNavbar from "./VibrantNavbar";
import VibrantFooter from "./VibrantFooter";

export default function VibrantMainLayout() {
  return (
    <div className="vibrant-theme min-h-screen">
      <VibrantNavbar />
      <main><Outlet /></main>
      <VibrantFooter />
    </div>
  );
}
