"use client";

import AppHeader from "@/components/AppHeader";
import ProfileResume from "@/components/ProfileResume";
import useProfile from "@/hooks/useProfile";
import { roleLabel, statusLabel } from "@/lib/labels";

function DetailRow({ label, children }) {
  return (
    <div className="profile-row">
      <p className="profile-row-label">{label}</p>
      <div className="profile-row-value">{children}</div>
    </div>
  );
}

export default function Profile() {
  const { user, loading, error, signingOut, signOut, reload } = useProfile();

  const isSeeker = user?.status === "job_seeker";
  const cv = user?.cv ?? null;

  let screen;
  if (loading) {
    screen = (
      <section className="app-card">
        <h1 className="app-card-title">Profile</h1>
        <div className="mt-6 space-y-4">
          <span className="app-skeleton block h-4 w-32" />
          <span className="app-skeleton block h-4 w-56" />
          <span className="app-skeleton block h-4 w-40" />
        </div>
      </section>
    );
  } else if (error) {
    screen = (
      <section className="app-card">
        <h1 className="app-card-title">Profile</h1>
        <div className="auth-alert mt-5" role="alert">
          {error}
        </div>
      </section>
    );
  } else {
    screen = (
      <section className="app-card">
        <h1 className="app-card-title">Profile</h1>
        <p className="app-card-subtitle">Your account details.</p>
        <div className="mt-4">
          <DetailRow label="Name">{user.name}</DetailRow>
          <DetailRow label="Email">{user.email}</DetailRow>
          <DetailRow label="Role">
            <span className="app-badge app-badge-slate">{roleLabel(user.role)}</span>
          </DetailRow>
          <DetailRow label="Joining as">
            <span className="app-badge app-badge-indigo">{statusLabel(user.status)}</span>
          </DetailRow>
        </div>
        {isSeeker && <ProfileResume cv={cv} onChanged={reload} />}
      </section>
    );
  }

  return (
    <div className="app-page">
      <AppHeader user={user} signingOut={signingOut} onSignOut={signOut} />
      <main className="app-main">{screen}</main>
    </div>
  );
}
