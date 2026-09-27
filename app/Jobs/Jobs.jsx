"use client";

import { useCallback, useState } from "react";
import AppHeader from "@/components/AppHeader";
import AddJobButton from "@/components/AddJobButton";
import JobCard, { JobCardSkeleton } from "@/components/JobCard";
import JobComments from "@/components/JobComments";
import JobsSearch from "@/components/JobsSearch";
import { InboxIcon } from "@/components/icons";
import useJobs from "@/hooks/useJobs";
import useProfile from "@/hooks/useProfile";
import { DEFAULT_FILTERS, SORT_OPTIONS } from "@/lib/jobs";

export default function Jobs() {
  const { user, signingOut, signOut } = useProfile();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [openJobId, setOpenJobId] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const { jobs, total, loading, error, hasMore } = useJobs(filters);

  const patchFilters = (patch) => {
    setOpenJobId(null);
    setFilters((previous) => ({ ...previous, page: 1, ...patch }));
  };

  const handleTotalChange = useCallback((jobId, threadTotal) => {
    setCommentCounts((previous) =>
      previous[jobId] === threadTotal ? previous : { ...previous, [jobId]: threadTotal }
    );
  }, []);

  const toggleComments = useCallback(
    (jobId) => setOpenJobId((previous) => (previous === jobId ? null : jobId)),
    []
  );

  return (
    <div className="app-page">
      <AppHeader user={user} signingOut={signingOut} onSignOut={signOut} />

      <main className="jobs-main">
        <section className="jobs-hero">
          <h1 className="jobs-hero-title">Find work that moves you forward</h1>
          <p className="jobs-hero-subtitle">
            Browse {total} opportunities from teams hiring right now.
          </p>
          <JobsSearch onSearch={patchFilters} />
        </section>

        <div className="jobs-toolbar">
          <p className="jobs-count">
            <strong>{total}</strong> matching jobs
          </p>
          <div className="jobs-toolbar-actions">
            <label className="jobs-sort-label">
              Sort by
              <select
                className="jobs-sort"
                value={filters.sort}
                onChange={(event) => patchFilters({ sort: event.target.value })}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <AddJobButton user={user} />
          </div>
        </div>

        {error && (
          <div className="auth-alert" role="alert">
            {error}
          </div>
        )}

        {loading && jobs.length === 0 ? (
          <div className="jobs-list">
            {[0, 1, 2].map((key) => (
              <JobCardSkeleton key={key} />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="jobs-list">
            {jobs.map((job) => (
              <div key={job.id} className="jobs-item">
                <JobCard
                  job={job}
                  commentsOpen={openJobId === job.id}
                  commentCount={commentCounts[job.id] ?? job.comment_count ?? 0}
                  onToggleComments={toggleComments}
                />
                {openJobId === job.id && (
                  <JobComments
                    jobId={job.id}
                    user={user}
                    onTotalChange={handleTotalChange}
                  />
                )}
              </div>
            ))} 
          </div>
        ) : (
          <div className="app-empty">
            <InboxIcon />
            <p className="app-empty-title">No matching jobs</p>
            <p className="app-empty-hint">Try a different title, skill or location.</p>
          </div>
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
            {loading ? "Loading…" : "Show more jobs"}
          </button>
        )}
      </main>
    </div>
  );
}
