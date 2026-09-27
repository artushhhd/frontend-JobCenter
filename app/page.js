import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        JobCenter
      </h1>
      <p className="max-w-md text-slate-600">
        Create an account, sign in, and manage your profile.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/Login"
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Login
        </Link>
        <Link
          href="/Register"
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-50"
        >
          Register
        </Link>
      </div>
    </main>
  );
}
