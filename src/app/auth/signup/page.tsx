import Link from "next/link";
import { redirect } from "next/navigation";
import { signUpAction } from "../actions";
import { getAuthErrorMessage, getCurrentUser } from "@/lib/supabase/auth";

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const params = await searchParams;
  const errorMessage = params.error
    ? getAuthErrorMessage(new Error(params.error))
    : "";

  return (
    <main
      className="min-h-screen px-5 py-8 text-black sm:px-8"
      style={{
        background:
          "linear-gradient(105deg, #ecfbfa 0%, #f8fbfa 50%, #fff7f2 100%)",
      }}
    >
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[380px] items-center">
        <div className="min-h-[550px] w-full rounded-[1.5rem] border-2 border-black bg-white px-6 py-6 shadow-[10px_10px_0_#000000] sm:h-[550px]">
          <Link
            href="/"
            className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-600"
          >
            Nutropx Lab
          </Link>
          <h1 className="mt-5 font-display text-2xl font-black leading-tight">
            Create account
          </h1>
          <p className="mt-2 text-xs font-normal leading-5 text-muted">
            Save your brain-test scores, XP, streaks, and training history.
          </p>

          {errorMessage ? (
            <p className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-700">
              {errorMessage}
            </p>
          ) : null}
          {params.message ? (
            <p className="mt-3 rounded-2xl border border-cyan/30 bg-cyan/10 px-4 py-2 text-xs font-medium text-black">
              {params.message}
            </p>
          ) : null}

          <form action={signUpAction} className="mt-5 space-y-3">
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.16em]">
                Email
              </span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                className="mt-1.5 h-10 w-full rounded-[0.9rem] border-2 border-black px-4 text-xs font-medium outline-none focus:ring-4 focus:ring-cyan/30"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.16em]">
                Password
              </span>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="mt-1.5 h-10 w-full rounded-[0.9rem] border-2 border-black px-4 text-xs font-medium outline-none focus:ring-4 focus:ring-cyan/30"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-[0.16em]">
                Confirm password
              </span>
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat password"
                required
                minLength={6}
                className="mt-1.5 h-10 w-full rounded-[0.9rem] border-2 border-black px-4 text-xs font-medium outline-none focus:ring-4 focus:ring-cyan/30"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-[0.9rem] bg-orange-500 px-6 py-3 text-xs font-black uppercase text-black transition hover:translate-y-0.5"
            >
              Create account
            </button>
          </form>

          <p className="mt-4 text-center text-xs font-medium text-muted">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-black text-black underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
