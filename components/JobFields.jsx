"use client";

function FieldError({ id, error }) {
  if (!error) return null;

  return (
    <p id={id} className="auth-error" role="alert">
      {error[0]}
    </p>
  );
}

function Label({ htmlFor, label, required }) {
  return (
    <label htmlFor={htmlFor} className="auth-label">
      {label}
      {required && <span className="jf-required"> *</span>}
    </label>
  );
}

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  help,
  required,
  disabled,
  className,
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} label={label} required={required} />
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`jf-control${error ? " jf-control-error" : ""}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {help && !error && <p className="auth-help">{help}</p>}
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  error,
  required,
  disabled,
  className,
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} label={label} required={required} />
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`jf-control${error ? " jf-control-error" : ""}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  error,
  rows = 4,
  placeholder,
  help,
  required,
  disabled,
  className,
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} label={label} required={required} />
      <textarea
        id={id}
        name={id}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`jf-control${error ? " jf-control-error" : ""}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {help && !error && <p className="auth-help">{help}</p>}
      <FieldError id={`${id}-error`} error={error} />
    </div>
  );
}

export function CheckboxField({ id, label, help, checked, onChange, disabled }) {
  return (
    <div className="jf-check">
      <label className="auth-terms" htmlFor={id}>
        <input id={id} name={id} type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
        <span>{label}</span>
      </label>
      {help && <p className="auth-help">{help}</p>}
    </div>
  );
}
