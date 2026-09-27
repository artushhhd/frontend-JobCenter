const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{5,}$/;

export function validateRegister(values) {
  const errors = {};

  if (!values.name?.trim()) {
    errors.name = ["Name is required."];
  }

  if (!values.email?.trim()) {
    errors.email = ["Email is required."];
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = ["Enter a valid email address."];
  }

  if (!values.password) {
    errors.password = ["Password is required."];
  } else if (!PASSWORD_RE.test(values.password)) {
    errors.password = [
      "Password must be at least 5 characters and contain letters and numbers.",
    ];
  }

  if (values.password !== values.password_confirmation) {
    errors.password_confirmation = ["The password confirmation does not match."];
  }

  if (!values.status) {
    errors.status = ["Please choose how you are joining."];
  }

  return errors;
}

export function validateLogin(values) {
  const errors = {};

  if (!values.email?.trim()) {
    errors.email = ["Email is required."];
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = ["Enter a valid email address."];
  }

  if (!values.password) {
    errors.password = ["Password is required."];
  }

  return errors;
}

export function validateJob(job) {
  const errors = {};

  if (!job.title?.trim()) {
    errors.title = ["Job title is required."];
  } else if (job.title.length > 120) {
    errors.title = ["Keep the title under 120 characters."];
  }

  if (!job.company?.trim()) {
    errors.company = ["Company name is required."];
  } else if (job.company.length > 120) {
    errors.company = ["Keep the company name under 120 characters."];
  }

  if (!job.description?.trim()) {
    errors.description = ["Job description is required."];
  } else if (job.description.trim().length < 30) {
    errors.description = ["Describe the role in at least 30 characters."];
  }

  if (job.work_mode !== "remote" && !job.location?.trim()) {
    errors.location = ["Add a city, or choose Remote to leave it empty."];
  }

  if (job.skills.length > 10) {
    errors.skills = ["List up to 10 skills."];
  }

  [job.salary_min, job.salary_max].forEach((value, index) => {
    const field = index === 0 ? "salary_min" : "salary_max";

    if (value !== null && !Number.isInteger(value)) {
      errors[field] = ["Enter a whole number."];
    }
  });

  if (
    !errors.salary_min &&
    !errors.salary_max &&
    job.salary_min !== null &&
    job.salary_max !== null &&
    job.salary_max < job.salary_min
  ) {
    errors.salary_max = ["Maximum pay must be at or above the minimum."];
  }

  return errors;
}

export const COMMENT_MAX_LENGTH = 2000;

export function validateComment(body) {
  const errors = {};
  const text = body?.trim() ?? "";

  if (!text) {
    errors.body = ["Write a comment before posting."];
  } else if (text.length < 2) {
    errors.body = ["Comments need at least 2 characters."];
  } else if (text.length > COMMENT_MAX_LENGTH) {
    errors.body = [`Keep comments under ${COMMENT_MAX_LENGTH} characters.`];
  }

  return errors;
}

export const CV_MAX_MB = 5;
export const CV_ACCEPT = ".pdf,.doc,.docx";

const CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function validateCv(file) {
  const errors = {};

  if (!file) {
    errors.file = ["Choose a file to upload."];
  } else if (!CV_TYPES.includes(file.type)) {
    errors.file = ["Attach a PDF, DOC or DOCX file."];
  } else if (file.size > CV_MAX_MB * 1024 * 1024) {
    errors.file = [`Keep the resume under ${CV_MAX_MB} MB.`];
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
