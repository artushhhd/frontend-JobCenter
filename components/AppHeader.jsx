"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellIcon, BriefcaseIcon } from "@/components/icons";
import { canAccessSettings } from "@/lib/permissions";
import { APP_SECTIONS, initials, roleLabel, statusLabel } from "@/lib/labels";

export default function AppHeader({ user, signingOut, onSignOut }) {
  const pathname = usePathname();
  const sections = APP_SECTIONS.filter(
    (section) => !section.staffOnly || canAccessSettings(user)
  );

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link href="/Profile" className="app-brand">
          <span className="app-brand-mark">
            <BriefcaseIcon className="h-4 w-4" />
          </span>
          JobCenter
        </Link>

        <nav className="app-nav" aria-label="Sections">
          {sections.map((section) => {
            if (!section.href) {
              return (
                <span
                  key={section.key}
                  className="app-nav-item app-nav-item-disabled"
                  title="Not available yet"
                >
                  {section.label}
                </span>
              );
            }

            const active = pathname === section.href;

            return (
              <Link
                key={section.key}
                href={section.href}
                aria-current={active ? "page" : undefined}
                className={`app-nav-item${active ? " app-nav-item-active" : ""}`}
              >
                {section.label}
              </Link>
            );
          })}
        </nav>

        <div className="app-header-actions">
          <span className="app-bell">
            <BellIcon />
          </span>

          {user ? (
            <span className="app-chip">
              <span className="app-chip-avatar">{initials(user.name)}</span>
              <span className="app-chip-text">
                <span className="app-chip-name">{user.name}</span>
                <span className="app-chip-role">
                  {roleLabel(user.role)} · {statusLabel(user.status)}
                </span>
              </span>
            </span>
          ) : (
            <span className="app-chip" aria-hidden="true">
              <span className="app-skeleton h-8 w-8 rounded-full" />
              <span className="app-skeleton hidden h-3 w-24 sm:block" />
            </span>
          )}

          <button
            type="button"
            onClick={onSignOut}
            disabled={signingOut || !user}
            className="app-signout"
          >
            {signingOut ? "Signing out…" : "Log out"}
          </button>
        </div>
      </div>
    </header>
  );
}
