"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, clearToken } from "@/lib/api";

export default function useProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((previous) => previous + 1), []);

  useEffect(() => {
    let active = true;

    api
      .profile()
      .then((data) => {
        if (!active) return;
        setUser(data.user);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        if (err.status === 401) {
          clearToken();
          router.replace("/Login");
          return;
        }
        setError(err.message || "Failed to load your profile.");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router, nonce]);

  const signOut = useCallback(async () => {
    setSigningOut(true);
    await api.logout().catch(() => {});
    clearToken();
    router.replace("/Login");
  }, [router]);

  return { user, loading, error, signingOut, signOut, reload };
}
