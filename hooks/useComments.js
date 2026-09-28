"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function useComments(jobId) {
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [settledFor, setSettledFor] = useState(null);
  const [error, setError] = useState("");
  const requestKey = `${jobId}:${page}`;

  useEffect(() => {
    let active = true;
    const firstPage = page === 1;

    api
      .comments(jobId, { page })
      .then((data) => {
        if (!active) return;
        setComments((previous) => (firstPage ? data.comments : [...previous, ...data.comments]));
        setTotal(data.total);
        setLastPage(data.last_page);
        setError("");
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load comments.");
      })
      .finally(() => {
        if (active) setSettledFor(requestKey);
      });

    return () => {
      active = false;
    };
  }, [jobId, page, requestKey]);

  const addComment = useCallback(
    async (body) => {
      const data = await api.addComment(jobId, { body });

      setComments((previous) => [...previous, data.comment]);
      setTotal(data.total);

      return data;
    },
    [jobId]
  );

  const removeComment = useCallback(async (id) => {
    const data = await api.deleteComment(id);

    setComments((previous) => previous.filter((comment) => comment.id !== id));
    setTotal(data.total);

    return data;
  }, []);

  return {
    comments,
    total,
    loading: settledFor !== requestKey,
    error,
    hasMore: page < lastPage,
    showMore: () => setPage((previous) => previous + 1),
    addComment,
    removeComment,
  };
}
