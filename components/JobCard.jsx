import { memo } from "react";
import {
  BookmarkIcon,
  ClockIcon,
  CommentIcon,
  MapPinIcon,
  WalletIcon,
} from "@/components/icons";
import JobLikeButton from "@/components/JobLikeButton";
import { employmentLabel, locationLabel, postedLabel, salaryLabel } from "@/lib/jobs";
import { initials } from "@/lib/labels";

function JobCard({ job, commentsOpen, commentCount, onToggleComments, onUnlike }) {
  return (
    <article className={`jobs-card${job.featured ? " jobs-card-featured" : ""}`}>
      <div className="jobs-card-top">
        <span className="jobs-logo">{initials(job.company)}</span>
        <div className="jobs-card-heading">
          <div className="jobs-card-title-row">
            <h2 className="jobs-card-title">{job.title}</h2>
            {job.featured && <span className="jobs-badge">Featured</span>}
          </div>
          <p className="jobs-card-company">{job.company}</p>
        </div>
        <span className="jobs-bookmark">
          <BookmarkIcon />
        </span>
      </div>

      <div className="jobs-card-meta">
        <span className="jobs-meta">
          <MapPinIcon />
          {locationLabel(job)}
        </span>
        <span className="jobs-meta">
          <WalletIcon />
          {salaryLabel(job)}
        </span>
        <span className="jobs-meta">
          <ClockIcon />
          {employmentLabel(job)}
        </span>
      </div>

      <p className="jobs-card-desc">{job.description}</p>

      <div className="jobs-card-tags">
        {job.skills.map((skill) => (
          <span key={skill} className="jobs-tag">
            {skill}
          </span>
        ))}
      </div>

      <div className="jobs-card-foot">
        <span className="jobs-card-ago">{postedLabel(job.created_at)}</span>
        <JobLikeButton job={job} onUnlike={onUnlike} />
        {onToggleComments && (
          <button
            type="button"
            className={`jobs-comments-toggle${commentsOpen ? " jobs-comments-toggle-open" : ""}`}
            onClick={() => onToggleComments(job.id)}
            aria-expanded={commentsOpen}
          >
            <CommentIcon />
            {commentCount}
            <span className="sr-only">comments</span>
          </button>
        )}
        <button onClick={()=>{alert("job added")}} type="button" className="jobs-apply">
          Apply
        </button>
      </div>
    </article>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="jobs-card">
      <span className="app-skeleton block h-12 w-12 rounded-xl" />
      <span className="app-skeleton mt-4 block h-4 w-1/2" />
      <span className="app-skeleton mt-3 block h-3 w-1/3" />
      <span className="app-skeleton mt-5 block h-3 w-4/5" />
    </div>
  );
}

export default memo(JobCard);
