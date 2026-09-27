"use client";

import { useCallback, useState } from "react";
import AppHeader from "@/components/AppHeader";
import JobCard, { JobCardSkeleton } from "@/components/JobCard";
import { HeartIcon } from "@/components/icons";
import useJobs from "@/hooks/useJobs";
import useProfile from "@/hooks/useProfile";
import { DEFAULT_FILTERS } from "@/lib/jobs";

export default function Likes() {
  const { user, signingOut, signOut } = useProfile();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [removedIds, setRemovedIds] = useState([]);
  const { jobs, loading, error, hasMore } = useJobs(filters, "likedJobs");

  const handleUnlike = useCallback((jobId) => {
    setRemovedIds((previous) => [...previous, jobId]);
  }, []);

  const visibleJobs = jobs.filter((job) => !removedIds.includes(job.id));

  return (
    <div className="app-page">
      <AppHeader user={user} signingOut={signingOut} onSignOut={signOut} />

      <main className="jobs-main">
        <section className="jobs-hero">
          <h1 className="jobs-hero-title">Jobs you liked</h1>
          <p className="jobs-hero-subtitle">
            Hearts you tapped stay here until you tap them again.
          </p>
        </section>

        <div className="jobs-toolbar">
          <p className="jobs-count">
            <strong>{visibleJobs.length}</strong> liked jobs
          </p>
        </div>

        {error && (
          <div className="auth-alert" role="alert">
            {error}
          </div>
        )}

        {loading && visibleJobs.length === 0 ? (
          <div className="jobs-list">
            {[0, 1].map((key) => (
              <JobCardSkeleton key={key} />
            ))}
          </div>
        ) : visibleJobs.length > 0 ? (
          <div className="jobs-list">
            {visibleJobs.map((job) => (
              <JobCard key={job.id} job={job} onUnlike={handleUnlike} />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="app-empty">
              <HeartIcon className="app-empty-icon" />
              <p className="app-empty-title">No liked jobs yet</p>
              <p className="app-empty-hint">
                Open Jobs and tap the heart on a listing to keep it here.
              </p>
            </div>
          )
        )}

        {hasMore && (
          <button
            type="button"
            className="jobs-more"
            disabled={loading}
            onClick={() =>
              setFilters((previous) => ({ ...previous, page: previous.page + 1 }))
            }
          >
            {loading ? "Loading…" : "Show more liked jobs"}
          </button>
        )}
      </main>
    </div>
  );
}
