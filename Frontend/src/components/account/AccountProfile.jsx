import { useSelector } from "react-redux";
import { Mail, ShieldCheck, User as UserIcon } from "lucide-react";
import SectionHeader from "../../components/SectionHeader";

const ROLE_STYLES = {
  Owner: "bg-[#cfff04]/15 text-black border-[#cfff04]/40",
  Admin: "bg-black/8 text-black/70 border-black/15",
  Staff: "bg-black/5 text-black/55 border-black/10",
};

function initialsOf(user) {
  const source = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email;
  if (!source) return "?";
  return source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

export default function AccountProfile() {
  const auth = useSelector((s) => s.auth);
  const user = auth.user;

  if (!user) {
    return (
      <div className="flex flex-col gap-6">
        <SectionHeader badge="Account" icon={<UserIcon size={12} strokeWidth={2} />} heading="Profile" />
        <div className="rounded-2xl border border-dashed border-black/15 bg-white p-8 text-sm text-black/55">
          We couldn't find your profile details for this session.
        </div>
      </div>
    );
  }

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "—";
  const roleStyle = ROLE_STYLES[user.roleName] || "bg-black/5 text-black/55 border-black/10";

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader badge="Account" icon={<UserIcon size={12} strokeWidth={2} />} heading="Profile" />

      <div className="rounded-2xl border border-black/8 bg-white p-6 sm:p-8">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-black font-display text-xl text-white">
            {initialsOf(user)}
          </span>
          <div>
            <p className="font-display text-xl font-semibold text-black">{displayName}</p>
            {user.roleName && (
              <span
                className={`mt-2 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${roleStyle}`}
              >
                <ShieldCheck size={11} />
                {user.roleName}
              </span>
            )}
          </div>
        </div>

        <dl className="mt-8 divide-y divide-black/5 border-t border-black/5">
          <div className="flex items-center justify-between gap-4 py-4">
            <dt className="flex items-center gap-2 text-sm text-black/55">
              <Mail size={14} strokeWidth={1.75} />
              Email
            </dt>
            <dd className="text-sm text-black/85">{user.email || "—"}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-4">
            <dt className="text-sm text-black/55">First name</dt>
            <dd className="text-sm text-black/85">{user.firstName || "—"}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-4">
            <dt className="text-sm text-black/55">Last name</dt>
            <dd className="text-sm text-black/85">{user.lastName || "—"}</dd>
          </div>
        </dl>

        <p className="mt-6 text-xs text-black/35">
          Editing your profile isn't available yet — this view will support it once a profile-update endpoint is added.
        </p>
      </div>
    </div>
  );
}