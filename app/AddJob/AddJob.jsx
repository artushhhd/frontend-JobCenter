"use client";

import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import JobForm from "@/components/JobForm";
import { InboxIcon } from "@/components/icons";
import useProfile from "@/hooks/useProfile";
import { canPostJobs } from "@/lib/permissions";

function Forbidden() {
  return (
    <div className="app-empty">
      <InboxIcon />
      <p className="app-empty-title">Recruiter accounts only</p>
      <p className="app-empty-hint">
        Your account joined as a job seeker, so you cannot post listings.
      </p>
      <p className="job-form-forbidden">
        <Link href="/Jobs" className="auth-link">
          Back to jobs
        </Link>
      </p>
    </div>
  );
}

export default function AddJob() {
  const { user, loading, error, signingOut, signOut } = useProfile();

  let body;

  if (loading) {
    body = (
      <div className="mt-6 space-y-4">
        <span className="app-skeleton block h-10 w-2/3" />
        <span className="app-skeleton block h-4 w-1/3" />
        <span className="app-skeleton block h-32 w-full" />
      </div>
    );
  } else if (error) {
    body = (
      <div className="auth-alert mt-5" role="alert">
        {error}
      </div>
    );
  } else if (!canPostJobs(user)) {
    body = <Forbidden />;
  } else {
    body = <JobForm />;
  }

  return (
    <div className="app-page">
      <AppHeader user={user} signingOut={signingOut} onSignOut={signOut} />

      <main className="app-main">
        <section className="app-card">
          <h1 className="app-card-title">Add a new job</h1>
          <p className="app-card-subtitle">
            Publish to the marketplace or keep it as a draft for now.
          </p>
          {body}
        </section>
      </main>
    </div>
  );
}
