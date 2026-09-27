"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, setToken } from "@/lib/api";
import { validateRegister, hasErrors } from "@/lib/validation";
import AuthLayout from "@/components/AuthLayout";
import PasswordField from "@/components/PasswordField";
import { UserIcon, MailIcon, BriefcaseIcon, CheckCircleIcon } from "@/components/icons";
import { JOIN_OPTIONS } from "@/lib/labels";

const OPTION_ICONS = {
  job_seeker: UserIcon,
  job_poster: BriefcaseIcon,
};

export default function Register() {
  const router = useRouter();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    status: "job_seeker",
  });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function selectRole(value) {
    setValues((prev) => ({ ...prev, status: value }));
    setErrors((prev) => ({ ...prev, status: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const clientErrors = validateRegister(values);
    if (!terms) {
      clientErrors.terms = ["You must agree to the Terms of Service and Privacy Policy."];
    }
    if (hasErrors(clientErrors)) {
      setErrors(clientErrors);
      setMessage("");
      return;
    }

    setErrors({});
    setMessage("");
    setLoading(true);
    try {
      const data = await api.register(values);
      setToken(data.token);
      router.replace("/Profile");
    } catch (err) {
      setErrors(err.errors || {});
      setMessage(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands building their next career move."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/Login" className="auth-link">Sign in</Link>
        </>
      }
    >
      {message && (
        <div className="auth-alert" role="alert">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="name" className="auth-label">Full name</label>
          <div className={`auth-field${errors.name ? " auth-field-error" : ""}`}>
            <UserIcon />
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={handleChange}
              className="auth-field-input"
              placeholder="Alex Morgan"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
          </div>
          {errors.name && (
            <p id="name-error" className="auth-error" role="alert">{errors.name[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="auth-label">Email address</label>
          <div className={`auth-field${errors.email ? " auth-field-error" : ""}`}>
            <MailIcon />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              className="auth-field-input"
              placeholder="alex@company.com"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
          </div>
          {errors.email && (
            <p id="email-error" className="auth-error" role="alert">{errors.email[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <PasswordField
            id="password"
            name="password"
            label="Password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
            help="At least 5 characters, with letters and numbers"
          />
          <PasswordField
            id="password_confirmation"
            name="password_confirmation"
            label="Confirm password"
            value={values.password_confirmation}
            onChange={handleChange}
            error={errors.password_confirmation}
            autoComplete="new-password"
          />
        </div>

        <div>
          <span className="auth-label">I&apos;m joining as</span>
          <div className="role-group">
            {JOIN_OPTIONS.map(({ value, title, desc }) => {
              const Icon = OPTION_ICONS[value];
              const active = values.status === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => selectRole(value)}
                  aria-pressed={active}
                  className={`role-card${active ? " role-card-active" : ""}`}
                >
                  <span className="role-card-icon"><Icon /></span>
                  <span>
                    <span className="role-card-title">{title}</span>
                    <span className="role-card-desc">{desc}</span>
                  </span>
                  {active && <CheckCircleIcon />}
                </button>
              );
            })}
          </div>
          {errors.status && (
            <p className="auth-error" role="alert">{errors.status[0]}</p>
          )}
        </div>

        <div>
          <label className="auth-terms">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => {
                setTerms(e.target.checked);
                setErrors((prev) => ({ ...prev, terms: undefined }));
              }}
              aria-describedby={errors.terms ? "terms-error" : undefined}
            />
            <span>
              I agree to the <span className="auth-muted">Terms of Service</span> and{" "}
              <span className="auth-muted">Privacy Policy</span>
            </span>
          </label>
          {errors.terms && (
            <p id="terms-error" className="auth-error" role="alert">{errors.terms[0]}</p>
          )}
        </div>

        <button type="submit" disabled={loading} className="auth-submit">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
