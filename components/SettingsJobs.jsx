"use client";

import { useState } from "react";
import JobForm, { jobToFormValues } from "@/components/JobForm";
import { api } from "@/lib/api";

export default function SettingsJobs({ jobs, loading, error, hasMore, onLoadMore, onChanged }) {
  const [pendingId, setPendingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [openingId, setOpeningId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [note, setNote] = useState("");

  async function openEditor(job) {
    setOpeningId(job.id);
    setNote("");

    try {
      const data = await api.job(job.id);

      setEditing(data.job);
    } catch (err) {
      setNote(err.message || "Unable to open this job.");
    } finally {
      setOpeningId(null);
    }
  }

  async function confirmDelete(job) {
    setBusyId(job.id);
    setNote("");

    try {
      const data = await api.deleteJob(job.id);

      setPendingId(null);
      setNote(data.message || "Job deleted.");
      onChanged();
    } catch (err) {
      setNote(err.message || "Unable to delete this job.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="settings-panel">
      <p className="settings-note" role="status">
        {note || "\u00a0"}
      </p>

      {error && (
        <div className="auth-alert" role="alert">
          {error}
        </div>
      )}

      <table className="settings-table">
        <thead>
          <tr>
            <th>Job</th>
            <th>Author</th>
            <th>Status</th>
            <th>Comments</th>
            <th>Likes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>
                <span className="settings-job-title">{job.title}</span>
                <span className="settings-job-company">{job.company}</span>
              </td>
              <td>{job.author ? job.author.name : "No author"}</td>
              <td>
                <span className={`settings-status settings-status-${job.status}`}>{job.status}</span>
              </td>
              <td>{job.comment_count}</td>
              <td>{job.like_count}</td>
              <td className="settings-actions">
                {job.editable && (
                  <button
                    type="button"
                    className="settings-ghost"
                    disabled={openingId === job.id}
                    onClick={() => openEditor(job)}
                  >
                    {openingId === job.id ? "Opening…" : "Edit"}
                  </button>
                )}
                {job.deletable && pendingId !== job.id && (
                  <button
                    type="button"
                    className="settings-ghost settings-ghost-danger"
                    onClick={() => setPendingId(job.id)}
                  >
                    Delete
                  </button>
                )}
                {job.deletable && pendingId === job.id && (
                  <>
                    <button
                      type="button"
                      className="settings-danger"
                      disabled={busyId === job.id}
                      onClick={() => confirmDelete(job)}
                    >
                      {busyId === job.id ? "Deleting…" : "Confirm delete"}
                    </button>
                    <button
                      type="button"
                      className="settings-ghost"
                      onClick={() => setPendingId(null)}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && jobs.length === 0 && <p className="settings-muted">Loading jobs…</p>}

      {hasMore && (
        <button type="button" className="jobs-more" disabled={loading} onClick={onLoadMore}>
          {loading ? "Loading…" : "Show more jobs"}
        </button>
      )}

      {editing && (
        <div className="settings-modal" role="dialog" aria-modal="true" aria-label="Edit job">
          <div className="settings-modal-head">
            <h2 className="app-card-title">Edit “{editing.title}”</h2>
            <button type="button" className="settings-ghost" onClick={() => setEditing(null)}>
              Close
            </button>
          </div>
          <JobForm
            jobId={editing.id}
            initialValues={jobToFormValues(editing)}
            onSaved={() => {
              setEditing(null);
              onChanged();
            }}
          />
        </div>
      )}
    </section>
  );
}
