"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function useUsers(filters) {
  const [result, setResult] = useState({ users: [], total: 0, lastPage: 1 });
  const [settledFor, setSettledFor] = useState(null);
  const [error, setError] = useState("");
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((previous) => previous + 1), []);

  useEffect(() => {
    if (!filters) {
      return undefined;
    }

    let active = true;
    const firstPage = filters.page === 1;

    api
      .adminUsers(filters)
      .then((data) => {
        if (!active) return;
        setResult((previous) => ({
          users: firstPage ? data.users : [...previous.users, ...data.users],
          total: data.total,
          lastPage: data.last_page,
        }));
        setError("");
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load users.");
      })
      .finally(() => {
        if (active) setSettledFor(filters);
      });

    return () => {
      active = false;
    };
  }, [filters, nonce]);

  return {
    ...result,
    loading: Boolean(filters) && settledFor !== filters,
    error,
    hasMore: filters ? filters.page < result.lastPage : false,
    reload,
  };
}
