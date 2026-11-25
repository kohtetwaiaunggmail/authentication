"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type AuthMode = "login" | "signup";

const tabBase = "h-10 rounded-lg text-xs font-semibold transition-colors";
const inputClass = "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

export function AuthPanel() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === "signup";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, employeeName, password }),
      });
      const result = (await response.json()) as { message?: string; redirectTo?: string };

      if (!response.ok || !result.redirectTo) {
        setError(result.message ?? "Something went wrong. Please try again.");
        return;
      }

      window.location.assign(result.redirectTo);
    } catch {
      setError("Could not connect. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
    setPassword("");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-[#f5f6fa] via-white to-[#e5e7ff] p-[22px] font-sans max-[680px]:p-0">
      <section
        aria-label="Employee portal sign in"
        className="grid min-h-[680px] w-full max-w-[1200px] grid-cols-1 overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_28px_80px_rgba(27,36,57,0.12)] md:grid-cols-[0.94fr_1.06fr] max-[680px]:min-h-screen max-[680px]:rounded-none max-[680px]:border-0 max-[680px]:shadow-none"
      >
        <div className="relative hidden min-h-[700px] flex-col overflow-hidden bg-gradient-to-br from-[#161b2b] via-[#20233a] to-[#34345f] px-[42px] py-[34px] text-white md:flex max-[900px]:px-[30px] max-[680px]:hidden">
          <div className="pointer-events-none absolute -right-44 bottom-[72px] size-[470px] rounded-full border border-violet-200/10" />
          <div className="pointer-events-none absolute -right-28 bottom-[134px] size-[346px] rounded-full border border-violet-200/10" />

          <BrandLockup />

          <div className="relative z-10 my-auto max-w-[420px] py-12">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[1.7px] text-indigo-200/70">
              <span className="size-[7px] rounded-full bg-violet-300 shadow-[0_0_12px_rgba(169,155,255,0.8)]" />
              PEOPLE OPERATIONS
            </div>
            <h1 className="mt-6 font-sans text-[clamp(40px,5vw,60px)] font-semibold leading-[1.11] tracking-[-3.3px]">
              Your workday,<br />in one place.
            </h1>
            <p className="mt-5 max-w-[355px] text-sm leading-8 text-indigo-100/75">
              Sign in to your team workspace to manage your employee profile and access the tools you need.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 text-[11px] text-indigo-100/70">
            <div aria-hidden="true" className="flex pl-1">
              <span className="grid size-[26px] place-items-center rounded-full border-2 border-[#22253c] bg-[#7566c6] text-[8px] font-bold">ML</span>
              <span className="-ml-1 grid size-[26px] place-items-center rounded-full border-2 border-[#22253c] bg-[#bd7d80] text-[8px] font-bold">JD</span>
              <span className="-ml-1 grid size-[26px] place-items-center rounded-full border-2 border-[#22253c] bg-[#568e8a] text-[8px] font-bold">AR</span>
              <span className="-ml-1 grid size-[26px] place-items-center rounded-full border-2 border-[#22253c] bg-[#41445f] text-[8px] font-bold">+</span>
            </div>
            <span>Built for the people who move us forward.</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_97%_0%,rgba(240,239,255,0.8),transparent_32%),white] px-14 py-12 max-[900px]:px-[34px] max-[680px]:min-h-screen max-[680px]:items-stretch max-[680px]:px-[25px] max-[680px]:py-7">
          <div className="w-full max-w-[390px]">
            <div className="mb-10 inline-flex items-center gap-2.5 font-sans text-[15px] font-bold tracking-tight text-[#17202e] md:hidden">
              <span className="grid size-[34px] place-items-center rounded-xl bg-gradient-to-br from-violet-400 to-violet-700 text-[11px] font-extrabold text-white shadow-lg shadow-violet-900/20">FA</span>
              <span>FA Workforce</span>
            </div>

            <div className="mb-7">
              <div className="text-[9px] font-bold tracking-[1.65px] text-violet-500">EMPLOYEE PORTAL</div>
              <h2 className="mt-3 font-sans text-[29px] font-bold tracking-[-1.15px] text-slate-800">
                {isSignup ? "Create your account" : "Welcome back"}
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-500">
                {isSignup ? "Set up your employee access to get started." : "Enter your details to access your workspace."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1" role="tablist" aria-label="Account access">
              <button
                aria-selected={!isSignup}
                className={`${tabBase} ${!isSignup ? "bg-white text-violet-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                onClick={() => changeMode("login")}
                role="tab"
                type="button"
              >
                Sign in
              </button>
              <button
                aria-selected={isSignup}
                className={`${tabBase} ${isSignup ? "bg-white text-violet-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                onClick={() => changeMode("signup")}
                role="tab"
                type="button"
              >
                Create account
              </button>
            </div>

            <form className="mt-6 grid gap-[17px]" onSubmit={handleSubmit}>
              {isSignup && (
                <label className="grid gap-2 text-xs font-bold text-slate-700">
                  Employee name
                  <input
                    autoComplete="name"
                    className={inputClass}
                    maxLength={80}
                    minLength={2}
                    name="employeeName"
                    onChange={(event) => setEmployeeName(event.target.value)}
                    placeholder="Your full name"
                    required
                    value={employeeName}
                  />
                </label>
              )}

              <label className="grid gap-2 text-xs font-bold text-slate-700">
                Employee ID
                <input
                  autoCapitalize="characters"
                  autoComplete="username"
                  className={`${inputClass} font-bold tracking-[1.25px]`}
                  maxLength={8}
                  name="employeeId"
                  onChange={(event) => setEmployeeId(event.target.value.toUpperCase().replace(/\s/g, ""))}
                  pattern="FA[0-9]{6}"
                  placeholder="FA123456"
                  required
                  title="Use FA followed by 6 digits, for example FA123456."
                  value={employeeId}
                />
                {isSignup && <span className="-mt-1 text-[10px] font-normal text-slate-400">8 characters: FA followed by 6 digits</span>}
              </label>

              <label className="grid gap-2 text-xs font-bold text-slate-700">
                Password
                <input
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  className={inputClass}
                  maxLength={72}
                  minLength={isSignup ? 10 : undefined}
                  name="password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={isSignup ? "At least 10 characters" : "Enter your password"}
                  required
                  type="password"
                  value={password}
                />
              </label>

              {error && <p className="-mt-1 text-[11px] leading-relaxed text-rose-700" role="alert">{error}</p>}

              <button
                className="mt-1 flex min-h-[47px] w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-500 to-violet-700 px-4 text-xs font-bold text-white shadow-lg shadow-violet-900/20 transition hover:-translate-y-px hover:shadow-xl disabled:cursor-wait disabled:opacity-70"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Please wait…" : isSignup ? "Create employee account" : "Sign in to workspace"}
                {!isSubmitting && <span aria-hidden="true" className="text-base">↗</span>}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <span aria-hidden="true" className="text-base text-violet-500">⌑</span>
              <span>Your account is protected with secure sign in.</span>
            </div>
          </div>
          <p className="mt-8 w-full max-w-[390px] text-center text-[9px] text-slate-400">
            By continuing, you agree to your organization&apos;s acceptable use policy.
          </p>
        </div>
      </section>
    </main>
  );
}

function BrandLockup() {
  return (
    <div className="relative z-10 inline-flex items-center gap-3 font-sans text-[15px] font-bold tracking-tight">
      <span className="grid size-[34px] place-items-center rounded-xl bg-gradient-to-br from-violet-400 to-violet-700 text-[11px] font-extrabold text-white shadow-lg shadow-violet-900/30">FA</span>
      <span>FA Workforce</span>
    </div>
  );
}
