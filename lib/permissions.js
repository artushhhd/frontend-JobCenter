const RECRUITER_STATUS = "job_poster";

const STAFF_ROLES = ["moderator", "admin", "super_admin"];

export function canPostJobs(user) {
  return user?.status === RECRUITER_STATUS;
}

export function canAccessSettings(user) {
  return STAFF_ROLES.includes(user?.role);
}
