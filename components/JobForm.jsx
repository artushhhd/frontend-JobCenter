"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckboxField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/JobFields";
import { CheckCircleIcon } from "@/components/icons";
import { api } from "@/lib/api";
import {
  APPLICATION_METHODS,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  PAY_PERIODS,
  WORK_MODES,
} from "@/lib/jobs";
import { hasErrors, validateJob } from "@/lib/validation";

const EMPTY_JOB = {
  title: "",
  company: "",
  department: "",
  category: "",
  employment_type: "full_time",
  experience_level: "mid",
  description: "",
  responsibilities: "",
  requirements: "",
  skills: "",
  salary_min: "",
  salary_max: "",
  pay_period: "annual",
  show_salary_range: true,
  work_mode: "hybrid",
  location: "",
  location_note: "",
  application_method: "platform",
  deadline: "",
  publish_to_marketplace: true,
  notify_matching_candidates: false,
};

export function jobToFormValues(job) {
  return {
    title: job.title ?? "",
    company: job.company ?? "",
    department: job.department ?? "",
    category: job.category ?? "",
    employment_type: job.employment_type ?? "full_time",
    experience_level: job.experience_level ?? "mid",
    description: job.description ?? "",
    responsibilities: (job.responsibilities ?? []).join("\n"),
    requirements: (job.requirements ?? []).join("\n"),
    skills: (job.skills ?? []).join(", "),
    salary_min: job.salary_min ?? "",
    salary_max: job.salary_max ?? "",
    pay_period: job.pay_period ?? "annual",
    show_salary_range: job.show_salary_range ?? true,
    work_mode: job.work_mode ?? "hybrid",
    location: job.location ?? "",
    location_note: job.location_note ?? "",
    application_method: job.application_method ?? "platform",
    deadline: job.deadline ?? "",
    publish_to_marketplace: job.publish_to_marketplace ?? true,
    notify_matching_candidates: job.notify_matching_candidates ?? false,
  };
}

function toLines(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function toSkills(text) {
  return text
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function toAmount(value) {
  return value === "" ? null : Number(value);
}

function toOrNull(value) {
  const trimmed = value.trim();

  return trimmed === "" ? null : trimmed;
}

function toPayload(values, status) {
  return {
    title: values.title.trim(),
    company: values.company.trim(),
    department: toOrNull(values.department),
    category: toOrNull(values.category),
    employment_type: values.employment_type,
    experience_level: values.experience_level,
    description: values.description.trim(),
    responsibilities: toLines(values.responsibilities),
    requirements: toLines(values.requirements),
    skills: toSkills(values.skills),
    salary_min: toAmount(values.salary_min),
    salary_max: toAmount(values.salary_max),
    pay_period: values.pay_period,
    show_salary_range: values.show_salary_range,
    work_mode: values.work_mode,
    location: toOrNull(values.location),
    location_note: toOrNull(values.location_note),
    application_method: values.application_method,
    deadline: values.deadline || null,
    status,
    publish_to_marketplace: values.publish_to_marketplace,
    notify_matching_candidates: values.notify_matching_candidates,
  };
}

function Section({ title, children }) {
  return (
    <section className="job-form-section">
      <h2 className="job-form-section-title">{title}</h2>
      <div className="job-form-grid">{children}</div>
    </section>
  );
}

function SavedDraft({ job, onReset }) {
  return (
    <div className="job-form-saved">
      <CheckCircleIcon />
      <div>
        <p className="app-card-title">Draft saved</p>
        <p className="app-card-subtitle">
          {job.title} at {job.company} is not visible to candidates yet.
        </p>
      </div>
      <div className="job-form-saved-actions">
        <button type="button" onClick={onReset} className="jf-secondary">
          Post another job
        </button>
        <Link href="/Jobs" className="jf-primary">
          Browse jobs
        </Link>
      </div>
    </div>
  );
}

export default function JobForm({ jobId = null, initialValues = null, onSaved = null }) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues ?? EMPTY_JOB);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState("");
  const [saved, setSaved] = useState(null);

  const editing = jobId !== null;
  const disabled = saving !== "";

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setValues((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  }

  async function save(status) {
    if (disabled) return;

    const payload = toPayload(values, status);
    const clientErrors = validateJob(payload);

    if (hasErrors(clientErrors)) {
      setErrors(clientErrors);
      setMessage("Please fix the highlighted fields.");
      return;
    }

    setErrors({});
    setMessage("");
    setSaving(status);

    try {
      const data = editing
        ? await api.updateJob(jobId, payload)
        : await api.createJob(payload);

      if (onSaved) {
        onSaved(data.job);
        return;
      }

      if (status === "published") {
        router.replace("/Jobs");
        return;
      }
      setSaved(data.job);
    } catch (err) {
      setErrors(err.errors || {});
      setMessage(err.message || "Unable to save this job. Please try again.");
    } finally {
      setSaving("");
    }
  }

  function handlePublish(event) {
    event.preventDefault();
    save("published");
  }

  function resetForm() {
    setSaved(null);
    setValues(EMPTY_JOB);
    setErrors({});
    setMessage("");
  }

  if (saved) {
    return <SavedDraft job={saved} onReset={resetForm} />;
  }

  return (
    <form className="job-form" onSubmit={handlePublish} noValidate>
      {message && (
        <div className="auth-alert" role="alert">
          {message}
        </div>
      )}

      <Section title="Core information">
        <TextField
          id="title"
          label="Job title"
          required
          value={values.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="Senior Product Designer"
          disabled={disabled}
        />
        <TextField
          id="company"
          label="Company"
          required
          value={values.company}
          onChange={handleChange}
          error={errors.company}
          placeholder="Northwind Labs"
          disabled={disabled}
        />
        <TextField
          id="department"
          label="Department"
          value={values.department}
          onChange={handleChange}
          error={errors.department}
          placeholder="Design"
          disabled={disabled}
        />
        <TextField
          id="category"
          label="Category"
          value={values.category}
          onChange={handleChange}
          error={errors.category}
          placeholder="Product"
          disabled={disabled}
        />
      </Section>

      <Section title="Role details">
        <SelectField
          id="employment_type"
          label="Employment type"
          required
          value={values.employment_type}
          onChange={handleChange}
          options={EMPLOYMENT_TYPES}
          error={errors.employment_type}
          disabled={disabled}
        />
        <SelectField
          id="experience_level"
          label="Experience level"
          required
          value={values.experience_level}
          onChange={handleChange}
          options={EXPERIENCE_LEVELS}
          error={errors.experience_level}
          disabled={disabled}
        />
        <TextAreaField
          id="description"
          className="jf-wide"
          label="Job description"
          required
          rows={5}
          value={values.description}
          onChange={handleChange}
          error={errors.description}
          placeholder="What the team does and why this role exists."
          help="At least 30 characters."
          disabled={disabled}
        />
        <TextAreaField
          id="responsibilities"
          className="jf-wide"
          label="Responsibilities"
          value={values.responsibilities}
          onChange={handleChange}
          error={errors.responsibilities}
          placeholder={"Own the design system\nReview product work"}
          help="One per line."
          disabled={disabled}
        />
        <TextAreaField
          id="requirements"
          className="jf-wide"
          label="Requirements"
          value={values.requirements}
          onChange={handleChange}
          error={errors.requirements}
          placeholder={"5+ years in product design\nPortfolio required"}
          help="One per line."
          disabled={disabled}
        />
        <TextField
          id="skills"
          className="jf-wide"
          label="Skills"
          value={values.skills}
          onChange={handleChange}
          error={errors.skills}
          placeholder="Figma, Design systems, Prototyping"
          help="Comma separated, up to 10."
          disabled={disabled}
        />
      </Section>

      <Section title="Compensation and location">
        <SelectField
          id="work_mode"
          label="Work mode"
          required
          value={values.work_mode}
          onChange={handleChange}
          options={WORK_MODES}
          error={errors.work_mode}
          disabled={disabled}
        />
        <TextField
          id="location"
          label="Location"
          value={values.location}
          onChange={handleChange}
          error={errors.location}
          placeholder="New York, NY"
          help="Leave empty for remote roles."
          disabled={disabled}
        />
        <TextField
          id="location_note"
          label="Location note"
          value={values.location_note}
          onChange={handleChange}
          error={errors.location_note}
          placeholder="Two days per week in office"
          disabled={disabled}
        />
        <TextField
          id="salary_min"
          label="Minimum salary (USD)"
          type="number"
          value={values.salary_min}
          onChange={handleChange}
          error={errors.salary_min}
          placeholder="120000"
          disabled={disabled}
        />
        <TextField
          id="salary_max"
          label="Maximum salary (USD)"
          type="number"
          value={values.salary_max}
          onChange={handleChange}
          error={errors.salary_max}
          placeholder="160000"
          disabled={disabled}
        />
        <SelectField
          id="pay_period"
          label="Pay period"
          required
          value={values.pay_period}
          onChange={handleChange}
          options={PAY_PERIODS}
          error={errors.pay_period}
          disabled={disabled}
        />
        <CheckboxField
          id="show_salary_range"
          label="Show the salary range on the listing"
          checked={values.show_salary_range}
          onChange={handleChange}
          disabled={disabled}
        />
      </Section>

      <Section title="Publishing">
        <SelectField
          id="application_method"
          label="How candidates apply"
          required
          value={values.application_method}
          onChange={handleChange}
          options={APPLICATION_METHODS}
          error={errors.application_method}
          disabled={disabled}
        />
        <TextField
          id="deadline"
          label="Application deadline"
          type="date"
          value={values.deadline}
          onChange={handleChange}
          error={errors.deadline}
          disabled={disabled}
        />
        <CheckboxField
          id="publish_to_marketplace"
          label="List on the public job marketplace"
          checked={values.publish_to_marketplace}
          onChange={handleChange}
          disabled={disabled}
        />
        <CheckboxField
          id="notify_matching_candidates"
          label="Notify matching candidates"
          checked={values.notify_matching_candidates}
          onChange={handleChange}
          disabled={disabled}
        />
      </Section>

      <div className="job-form-actions">
        <button type="button" className="jf-secondary" disabled={disabled} onClick={() => save("draft")}>
          {saving === "draft"
            ? "Saving draft…"
            : editing
              ? "Save as draft"
              : "Save draft"}
        </button>
        <button type="submit" className="jf-primary" disabled={disabled}>
          {saving === "published"
            ? "Saving…"
            : editing
              ? "Save changes"
              : "Publish job"}
        </button>
      </div>
    </form>
  );
}
