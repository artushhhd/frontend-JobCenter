"use client";

import { useState } from "react";
import { LockIcon, EyeIcon, EyeOffIcon } from "./icons";

export default function PasswordField({
  id,
  name,
  label,
  value,
  onChange,
  error,
  autoComplete = "current-password",
  help,
}) {
  const [show, setShow] = useState(false);
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="auth-label">
        {label}
      </label>
      <div className={`auth-field${error ? " auth-field-error" : ""}`}>
        <LockIcon />
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className="auth-field-input"
          placeholder="••••••••"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="auth-toggle"
          aria-label={show ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {error ? (
        <p id={errorId} className="auth-error" role="alert">
          {error[0]}
        </p>
      ) : (
        help && <p className="auth-help">{help}</p>
      )}
    </div>
  );
}
