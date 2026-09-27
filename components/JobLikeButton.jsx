"use client";

import { useState } from "react";
import { HeartIcon } from "@/components/icons";
import { api } from "@/lib/api";

export default function JobLikeButton({ job, onUnlike }) {
  const [liked, setLiked] = useState(Boolean(job.liked));
  const [count, setCount] = useState(job.like_count ?? 0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    if (busy) return;

    setBusy(true);
    setError("");

    try {
      const data = liked ? await api.unlikeJob(job.id) : await api.likeJob(job.id);

      setLiked(data.liked);
      setCount(data.like_count);
      if (!data.liked) onUnlike?.(job.id);
    } catch (err) {
      setError(err.message || "Failed to update like.");
    } finally {
      setBusy(false);
    }
  }

  const buttonClass = liked ? "jobs-like-button jobs-like-button-liked" : "jobs-like-button";

  return (
    <span className="jobs-like">
      <button
        type="button"
        className={buttonClass}
        onClick={handleClick}
        disabled={busy}
        aria-pressed={liked}
      >
        <HeartIcon filled={liked} />
        {count}
        <span className="sr-only">likes</span>
      </button>
      {error && (
        <span className="jobs-like-error" role="alert">
          {error}
        </span>
      )}
    </span>
  );
}
