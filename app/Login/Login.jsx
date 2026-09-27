"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, setToken } from "@/lib/api";
import { validateLogin, hasErrors } from "@/lib/validation";
import AuthLayout from "@/components/AuthLayout";
import PasswordField from "@/components/PasswordField";
import { MailIcon } from "@/components/icons";

export default function Login() {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const clientErrors = validateLogin(values);
    if (hasErrors(clientErrors)) {
      setErrors(clientErrors);
      setMessage("");
      return;
    }

    setErrors({});
    setMessage("");
    setLoading(true);
    try {
      const data = await api.login(values);
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
      title="Welcome back"
      subtitle="Sign in to your JobCenter account."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/Register" className="auth-link">Create one</Link>
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

        <PasswordField
          id="password"
          name="password"
          label="Password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        <button type="submit" disabled={loading} className="auth-submit">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}
