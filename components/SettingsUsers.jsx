"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { initials, roleLabel, statusLabel } from "@/lib/labels";

export default function SettingsUsers({ users, loading, error, hasMore, onLoadMore, onChanged }) {
  const [pendingId, setPendingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [note, setNote] = useState("");

  async function confirmDelete(user) {
    setBusyId(user.id);
    setNote("");

    try {
      const data = await api.deleteUser(user.id);

      setPendingId(null);
      setNote(data.message || "Account deleted.");
      onChanged();
    } catch (err) {
      setNote(err.message || "Unable to delete this account.");
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
            <th>Account</th>
            <th>Role</th>
            <th>Joining as</th>
            <th>Posts</th>
            <th>Comments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <span className="settings-account">
                  <span className="app-chip-avatar">{initials(user.name)}</span>
                  <span className="settings-account-text">
                    <span className="settings-account-name">{user.name}</span>
                    <span className="settings-account-email">{user.email}</span>
                  </span>
                </span>
              </td>
              <td>{roleLabel(user.role)}</td>
              <td>{statusLabel(user.status)}</td>
              <td>{user.job_count}</td>
              <td>{user.comment_count}</td>
              <td className="settings-actions">
                {!user.deletable && <span className="settings-muted">Protected</span>}
                {user.deletable && pendingId !== user.id && (
                  <button
                    type="button"
                    className="settings-ghost settings-ghost-danger"
                    onClick={() => setPendingId(user.id)}
                  >
                    Delete
                  </button>
                )}
                {user.deletable && pendingId === user.id && (
                  <>
                    <button
                      type="button"
                      className="settings-danger"
                      disabled={busyId === user.id}
                      onClick={() => confirmDelete(user)}
                    >
                      {busyId === user.id ? "Deleting…" : "Confirm delete"}
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

      {loading && users.length === 0 && <p className="settings-muted">Loading accounts…</p>}

      {hasMore && (
        <button type="button" className="jobs-more" disabled={loading} onClick={onLoadMore}>
          {loading ? "Loading…" : "Show more accounts"}
        </button>
      )}
    </section>
  );
}
