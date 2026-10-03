"use client";

import { useEffect, useState } from "react";
import { CommentIcon } from "@/components/icons";
import useComments from "@/hooks/useComments";
import { postedLabel } from "@/lib/jobs";
import { initials } from "@/lib/labels";
import { COMMENT_MAX_LENGTH, hasErrors, validateComment } from "@/lib/validation";
import { canAccessSettings } from "@/lib/permissions";

export default function JobComments({ jobId, user, onTotalChange }) {
  const {
    comments,
    total,
    loading,
    error,
    hasMore,
    showMore,
    addComment,
    updateComment,
    removeComment,
  } = useComments(jobId);
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState({});
  const [posting, setPosting] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingBody, setEditingBody] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    if (!loading) onTotalChange(jobId, total);
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

  function startEditing(comment) {
    setEditingId(comment.id);
    setEditingBody(comment.body);
    setErrors({});
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingBody("");
  }

  async function handleEdit(event, id) {
    event.preventDefault();
    if (savingEdit) return;

    const validation = validateComment(editingBody);
    if (hasErrors(validation)) {
      setErrors(validation);
      return;
    }

    setSavingEdit(true);
    try {
      await updateComment(id, editingBody.trim());
      cancelEditing();
      setErrors({});
    } catch (err) {
      setErrors(err.errors?.body ? { body: err.errors.body } : { body: [err.message] });
    } finally {
      setSavingEdit(false);
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

  return (
    <section className="job-comments" aria-label="Job discussion">
      <h3 className="job-comments-title">
        <CommentIcon className="job-comments-title-icon" />
        Discussion
        <span className="job-comments-count">{total}</span>
      </h3>

      {alertText && <div className="auth-alert" role="alert">{alertText}</div>}

      {loading && comments.length === 0 ? (
        <div className="job-comments-list">
          {[0, 1].map((key) => (
            <div key={key} className="job-comment">
              <span className="app-skeleton block h-9 w-9 rounded-xl" />
              <span className="app-skeleton mt-2 block h-3 w-2/5" />
              <span className="app-skeleton mt-3 block h-3 w-4/5" />
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="job-comments-list">
          {comments.map((comment) => {
            const canManage = comment.author.id === user?.id || canAccessSettings(user);

            return (
              <article key={comment.id} className="job-comment">
                <span className="job-comment-logo">{initials(comment.author.name)}</span>

                {editingId === comment.id ? (
                  <form className="job-comment-body" onSubmit={(event) => handleEdit(event, comment.id)}>
                    <textarea
                      className="jf-control"
                      rows={3}
                      maxLength={COMMENT_MAX_LENGTH}
                      value={editingBody}
                      onChange={(event) => setEditingBody(event.target.value)}
                      aria-label="Edit comment"
                    />
                    <div className="job-comment-actions">
                      <button type="submit" className="jf-primary" disabled={savingEdit}>
                        {savingEdit ? "Saving…" : "Save"}
                      </button>
                      <button type="button" className="jf-secondary" onClick={cancelEditing} disabled={savingEdit}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="job-comment-body">
                    <p className="job-comment-author">
                      {comment.author.name}
                      <span className="job-comment-ago">{postedLabel(comment.created_at)}</span>
                    </p>
                    <p className="job-comment-text">{comment.body}</p>
                    {comment.author.id === user?.id && (
                      <button type="button" className="job-comment-remove" onClick={() => startEditing(comment)}>
                        Edit
                      </button>
                    )}
                  </div>
                )}

                {canManage && (
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
            );
          })}
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
        <label className="auth-label" htmlFor={`comment-${jobId}`}>Add a comment</label>
        <textarea
          id={`comment-${jobId}`}
          className={errors.body ? "jf-control jf-control-error" : "jf-control"}
          rows={3}
          maxLength={COMMENT_MAX_LENGTH}
          value={body}
          onChange={handleChange}
          aria-invalid={errors.body ? "true" : undefined}
          aria-describedby={errors.body ? `comment-${jobId}-error` : undefined}
          placeholder="Ask a question or share your experience"
        />
        {errors.body ? (
          <p className="auth-error" id={`comment-${jobId}-error`}>{errors.body[0]}</p>
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
