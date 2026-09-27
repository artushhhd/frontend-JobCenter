export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="mb-6">
          <h1 className="auth-title">{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        </div>
        {children}
        {footer && <p className="auth-footer">{footer}</p>}
      </div>
    </main>
  );
}
