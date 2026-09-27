export const JOIN_OPTIONS = [
  { value: "job_seeker", title: "Job seeker", desc: "Find your next role" },
  { value: "job_poster", title: "Seller / Recruiter", desc: "Hire exceptional talent" },
];

const STATUS_LABELS = Object.fromEntries(
  JOIN_OPTIONS.map((option) => [option.value, option.title])
);

const ROLE_LABELS = {
  user: "User",
  moderator: "Moderator",
  admin: "Admin",
  super_admin: "Super admin",
};

export const APP_SECTIONS = [
  { key: "overview", label: "Overview", href: "/Profile" },
  { key: "jobs", label: "Jobs", href: "/Jobs" },
  { key: "likes", label: "Likes", href: "/Likes" },
  { key: "candidates", label: "Candidates", href: null },
  { key: "messages", label: "Messages", href: null },
  { key: "settings", label: "Settings", href: "/Settings", staffOnly: true },
];

export function statusLabel(status) {
  return STATUS_LABELS[status] ?? status;
}

export function roleLabel(role) {
  return ROLE_LABELS[role] ?? role;
}

export function initials(text) {
  return (text || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
