export const SORT_OPTIONS = [
  { value: "relevant", label: "Most relevant" },
  { value: "recent", label: "Newest" },
  { value: "salary", label: "Highest salary" },
];

export const DEFAULT_FILTERS = { q: "", location: "", sort: "relevant", page: 1 };

export const EMPLOYMENT_TYPES = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

export const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry" },
  { value: "mid", label: "Mid-level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
];

export const WORK_MODES = [
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
  { value: "remote", label: "Remote" },
];

export const PAY_PERIODS = [
  { value: "hourly", label: "Per hour" },
  { value: "daily", label: "Per day" },
  { value: "weekly", label: "Per week" },
  { value: "monthly", label: "Per month" },
  { value: "annual", label: "Per year" },
];

export const APPLICATION_METHODS = [
  { value: "platform", label: "Apply through JobCenter" },
  { value: "email", label: "Apply by email" },
  { value: "link", label: "Apply on our website" },
];

const EMPLOYMENT_LABELS = Object.fromEntries(
  EMPLOYMENT_TYPES.map((option) => [option.value, option.label])
);

const WORK_MODE_LABELS = Object.fromEntries(
  WORK_MODES.map((option) => [option.value, option.label])
);

const PAY_PERIOD_SUFFIXES = {
  hourly: "/hr",
  daily: "/day",
  weekly: "/wk",
  monthly: "/mo",
};

const RELATIVE_UNITS = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

const compactUsd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function employmentLabel(job) {
  return EMPLOYMENT_LABELS[job.employment_type] ?? job.employment_type;
}

export function locationLabel(job) {
  const mode = WORK_MODE_LABELS[job.work_mode] ?? job.work_mode;

  return job.location ? `${job.location} · ${mode}` : mode;
}

export function salaryLabel(job) {
  if (!job.show_salary_range || !job.salary_min || !job.salary_max) {
    return "Salary not disclosed";
  }

  const suffix = PAY_PERIOD_SUFFIXES[job.pay_period] ?? "";

  return `${compactUsd.format(job.salary_min)}–${compactUsd.format(job.salary_max)}${suffix}`;
}

export function postedLabel(createdAt) {
  if (!createdAt) return "Recently posted";

  const seconds = Math.max(60, Math.round((Date.now() - new Date(createdAt).getTime()) / 1000));
  const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [unit, secondsInUnit] of RELATIVE_UNITS) {
    if (seconds >= secondsInUnit) {
      return relative.format(-Math.round(seconds / secondsInUnit), unit);
    }
  }

  return relative.format(-seconds, "second");
}
