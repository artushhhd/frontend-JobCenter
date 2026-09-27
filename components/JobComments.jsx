"use client";

import { useEffect, useState } from "react";
import { CommentIcon } from "@/components/icons";
import useComments from "@/hooks/useComments";
import { postedLabel } from "@/lib/jobs";
import { initials } from "@/lib/labels";
import { COMMENT_MAX_LENGTH, hasErrors, validateComment } from "@/lib/validation";

export default function JobComments({ jobId, user, onTotalChange }) {
  const { comments, total, loading, error, hasMore, showMore, addComment, removeComment } =
    useComments(jobId);
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState({});
  const [posting, setPosting] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (loading) return;

    onTotalChange(jobId, total);
  }, [jobId, total, loading, onTotalChange]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (posting) return;

    const validation = validateComment(body);

    if (hasErrors(validation)) {
      setErrors(validation);
      return;
    }

    setPosting(true);
    try {
      await addComment(body.trim());
      setBody("");
      setErrors({});
    } catch (err) {
      setErrors(err.errors?.body ? { body: err.errors.body } : { body: [err.message] });
    } finally {
      setPosting(false);
    }
  }

  async function handleRemove(id) {
    if (removingId) return;

    setRemovingId(id);
    try {
      await removeComment(id);
    } catch (err) {
      setErrors({ thread: [err.message] });
    } finally {
      setRemovingId(null);
    }
  }

  function handleChange(event) {
    setBody(event.target.value);
    if (errors.body) setErrors((previous) => ({ ...previous, body: undefined }));
  }

  const alertText = errors.thread ? errors.thread[0] : error;
  const controlClass = errors.body ? "jf-control jf-control-error" : "jf-control";

  return (
    <section className="job-comments" aria-label="Job discussion">
      <h3 className="job-comments-title">
        <CommentIcon className="job-comments-title-icon" />
        Discussion
        <span className="job-comments-count">{total}</span>
      </h3>

      {alertText && (
        <div className="auth-alert" role="alert">
          {alertText}
        </div>
      )}

      {loading && comments.length === 0 ? (
        <div className="job-comments-list">
          <div className="job-comment">
            <span className="app-skeleton block h-9 w-9 rounded-xl" />
            <span className="app-skeleton mt-2 block h-3 w-2/5" />
            <span className="app-skeleton mt-3 block h-3 w-4/5" />
          </div>
          <div className="job-comment">
            <span className="app-skeleton block h-9 w-9 rounded-xl" />
            <span className="app-skeleton mt-2 block h-3 w-2/5" />
            <span className="app-skeleton mt-3 block h-3 w-4/5" />
          </div>
        </div>
      ) : comments.length > 0 ? (
        <div className="job-comments-list">
          {comments.map((comment) => (
            <article key={comment.id} className="job-comment">
              <span className="job-comment-logo">{initials(comment.author.name)}</span>
              <div className="job-comment-body">
                <p className="job-comment-author">
                  {comment.author.name}
                  <span className="job-comment-ago">{postedLabel(comment.created_at)}</span>
                </p>
                <p className="job-comment-text">{comment.body}</p>
              </div>
              {comment.author.id === user?.id && (
                <button
                  type="button"
                  className="job-comment-remove"
                  disabled={removingId !== null}
                  onClick={() => handleRemove(comment.id)}
                >
                  {removingId === comment.id ? "Removing…" : "Remove"}
                </button>
              )}
            </article>
          ))}
        </div>
      ) : (
        <p className="job-comments-empty">No comments yet. Share the first thought.</p>
      )}

      {hasMore && (
        <button type="button" className="job-comments-more" disabled={loading} onClick={showMore}>
          {loading ? "Loading…" : "Show more comments"}
        </button>
      )}

      <form className="job-comment-form" onSubmit={handleSubmit}>
        <label className="auth-label" htmlFor={`comment-${jobId}`}>
          Add a comment
        </label>
        <textarea
          id={`comment-${jobId}`}
          className={controlClass}
          rows={3}
          maxLength={COMMENT_MAX_LENGTH}
          value={body}
          onChange={handleChange}
          aria-invalid={errors.body ? "true" : undefined}
          aria-describedby={errors.body ? `comment-${jobId}-error` : undefined}
          placeholder="Ask a question or share your experience"
        />
        {errors.body ? (
          <p className="auth-error" id={`comment-${jobId}-error`}>
            {errors.body[0]}
          </p>
        ) : (
          <p className="auth-help">Up to {COMMENT_MAX_LENGTH} characters.</p>
        )}
        <button type="submit" className="jf-primary" disabled={posting}>
          {posting ? "Posting…" : "Post comment"}
        </button>
      </form>
    </section>
  );
}
