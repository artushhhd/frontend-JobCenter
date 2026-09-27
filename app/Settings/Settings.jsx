"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import SettingsJobs from "@/components/SettingsJobs";
import SettingsUsers from "@/components/SettingsUsers";
import useJobs from "@/hooks/useJobs";
import useProfile from "@/hooks/useProfile";
import useUsers from "@/hooks/useUsers";
import { roleLabel } from "@/lib/labels";
import { canAccessSettings } from "@/lib/permissions";

const TABS = [
  { key: "users", label: "Accounts" },
  { key: "jobs", label: "Jobs" },
];

const JOB_STATUSES = [
  { value: "", label: "Any status" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
];

export default function Settings() {
  const { user, signingOut, signOut } = useProfile();
  const router = useRouter();
  const staff = canAccessSettings(user);

  const [tab, setTab] = useState("users");
  const [userFilters, setUserFilters] = useState({ q: "", page: 1 });
  const [jobFilters, setJobFilters] = useState({ q: "", status: "", page: 1 });
  const [userDraft, setUserDraft] = useState("");
  const [jobDraft, setJobDraft] = useState("");

  const users = useUsers(staff ? userFilters : null);
  const jobs = useJobs(staff ? jobFilters : null, "managedJobs");

  useEffect(() => {
    if (user && !staff) router.replace("/Jobs");
  }, [user, staff, router]);

  function submitUserSearch(event) {
    event.preventDefault();
    setUserFilters((previous) => ({ ...previous, q: userDraft.trim(), page: 1 }));
  }

  function submitJobSearch(event) {
    event.preventDefault();
    setJobFilters((previous) => ({ ...previous, q: jobDraft.trim(), page: 1 }));
  }

  if (!user || !staff) return null;

  const total = tab === "users" ? users.total : jobs.total;

  return (
    <div className="app-page">
      <AppHeader user={user} signingOut={signingOut} onSignOut={signOut} />

      <main className="jobs-main">
        <section className="jobs-hero">
          <h1 className="jobs-hero-title">Settings</h1>
          <p className="jobs-hero-subtitle">
            Signed in as {roleLabel(user.role)}. Deleting an account also removes its jobs,
            comments and likes.
          </p>
        </section>

        <div className="settings-tabs">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`settings-tab${tab === item.key ? " settings-tab-active" : ""}`}
              aria-pressed={tab === item.key}
              onClick={() => setTab(item.key)}
            >
              {item.label}
            </button>
          ))}
          <p className="settings-count">
            <strong>{total}</strong> {tab === "users" ? "accounts" : "jobs"}
          </p>
        </div>

        {tab === "users" ? (
          <>
            <form className="settings-filter" onSubmit={submitUserSearch}>
              <label className="settings-filter-field">
                <span className="sr-only">Search accounts</span>
                <input
                  className="settings-filter-input"
                  type="search"
                  value={userDraft}
                  onChange={(event) => setUserDraft(event.target.value)}
                  placeholder="Name or email"
                />
              </label>
              <button type="submit" className="jf-secondary">
                Search accounts
              </button>
            </form>

            <SettingsUsers
              users={users.users}
              loading={users.loading}
              error={users.error}
              hasMore={users.hasMore}
              onLoadMore={() => setUserFilters((previous) => ({ ...previous, page: previous.page + 1 }))}
              onChanged={users.reload}
            />
          </>
        ) : (
          <>
            <form className="settings-filter" onSubmit={submitJobSearch}>
              <label className="settings-filter-field">
                <span className="sr-only">Search jobs</span>
                <input
                  className="settings-filter-input"
                  type="search"
                  value={jobDraft}
                  onChange={(event) => setJobDraft(event.target.value)}
                  placeholder="Title or company"
                />
              </label>
              <select
                className="jobs-sort"
                value={jobFilters.status}
                onChange={(event) =>
                  setJobFilters((previous) => ({ ...previous, status: event.target.value, page: 1 }))
                }
                aria-label="Filter jobs by status"
              >
                {JOB_STATUSES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button type="submit" className="jf-secondary">
                Search jobs
              </button>
            </form>

            <SettingsJobs
              jobs={jobs.jobs}
              loading={jobs.loading}
              error={jobs.error}
              hasMore={jobs.hasMore}
              onLoadMore={() => setJobFilters((previous) => ({ ...previous, page: previous.page + 1 }))}
              onChanged={jobs.reload}
            />
          </>
        )}
      </main>
    </div>
  );
}
