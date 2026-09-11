import { Link } from "react-router-dom";
import { FileText, ChevronRight } from "lucide-react";
import SectionHeader from "../SectionHeader";
import { SITE_PAGES } from "../../config/sitePages";

export default function AdminPagesList() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader badge="Website CMS" heading="Pages" />

      <div className="flex flex-col gap-2.5">
        {SITE_PAGES.map((page) => (
          <Link
            key={page.slug}
            to={page.adminPath}
            className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-5 py-4 transition hover:border-black/25"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5">
              <FileText size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-black">{page.label}</p>
              <p className="truncate text-xs text-black/45">/{page.slug === "home" ? "" : page.slug}</p>
            </div>
            <ChevronRight size={16} className="text-black/30" />
          </Link>
        ))}

        <Link
          to="/admin/footer"
          className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-5 py-4 transition hover:border-black/25"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5">
            <FileText size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-black">Footer</p>
            <p className="truncate text-xs text-black/45">Shown on every page</p>
          </div>
          <ChevronRight size={16} className="text-black/30" />
        </Link>
      </div>
    </div>
  );
}
