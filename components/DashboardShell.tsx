"use client";

import type { ReactNode } from "react";
import { useState } from "react";

type DashboardShellProps = {
  employeeName: string;
  employeeId: string;
  role: "employee" | "admin";
  children: ReactNode;
};

export function DashboardShell({ employeeName, employeeId, role, children }: DashboardShellProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const initials = employeeName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  async function signOut() {
    setIsSigningOut(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Sign out failed.");
      window.location.assign("/");
    } catch {
      setIsSigningOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8fb] font-sans text-slate-800">
      <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-[42px]">
        <a aria-label="FA Workforce home" className="inline-flex items-center gap-3 font-sans text-[15px] font-bold tracking-tight text-slate-800 max-[680px]:gap-2 max-[680px]:text-xs" href="/">
          <span className="grid size-[34px] place-items-center rounded-xl bg-gradient-to-br from-violet-400 to-violet-700 text-[11px] font-extrabold text-white shadow-lg shadow-violet-900/20 max-[680px]:size-[30px]">FA</span>
          <span>FA Workforce</span>
        </a>

        <div className="flex items-center gap-3 sm:gap-[18px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-2 text-[10px] font-bold text-violet-800 max-[680px]:px-2 max-[680px]:text-[8px]">
            <span className="size-[7px] rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(83,184,132,0.12)]" />
            {role === "admin" ? "Administrator" : "Employee"}
          </span>
          <div className="h-6 w-px bg-slate-200 max-[680px]:hidden" />
          <div className="flex items-center gap-2">
            <span className="grid size-[31px] place-items-center rounded-full bg-violet-100 text-[9px] font-bold text-violet-800">{initials || "FA"}</span>
            <span className="max-w-[150px] truncate text-[11px] font-semibold text-slate-600 max-[680px]:hidden">{employeeName}</span>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[10px] font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-800 disabled:cursor-wait disabled:opacity-60 max-[680px]:gap-1 max-[680px]:px-2"
            disabled={isSigningOut}
            onClick={signOut}
            type="button"
          >
            {isSigningOut ? "Signing out…" : "Sign out"}<span aria-hidden="true">↗</span>
          </button>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-72px)] grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[232px_minmax(0,1fr)]">
        <aside className="hidden flex-col border-r border-slate-200 bg-white px-4 py-8 md:flex">
          <div className="px-3 text-[9px] font-bold tracking-[1.25px] text-slate-400">WORKSPACE</div>
          <a className="mt-3 flex h-[41px] items-center gap-3 rounded-lg bg-violet-50 px-3 text-[11px] font-semibold text-violet-800" href="/dashboard">
            <span aria-hidden="true" className="w-[17px] text-center text-base text-violet-700">▦</span>
            Dashboard
          </a>

          <div className="mt-9 px-3 text-[9px] font-bold tracking-[1.25px] text-slate-400">ACCOUNT</div>
          <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-[#fafafe] p-2.5">
            <span aria-hidden="true" className="grid size-[31px] place-items-center rounded-lg bg-violet-100 text-lg text-violet-700">◎</span>
            <span className="min-w-0">
              <strong className="block truncate text-[10px] text-slate-600">{employeeName}</strong>
              <small className="mt-1 block text-[9px] tracking-[.6px] text-slate-400">{employeeId}</small>
            </span>
          </div>

          <div className="mt-auto flex items-center gap-2.5 border-t border-slate-100 px-2 pt-4">
            <span aria-hidden="true" className="grid size-[25px] place-items-center rounded-full border border-violet-100 text-xs font-bold text-violet-700">?</span>
            <span><strong className="block text-[9px] text-slate-600">Need a hand?</strong><small className="mt-1 block text-[8px] text-slate-400">Contact your administrator</small></span>
          </div>
        </aside>

        <main className="mx-auto w-full max-w-[1120px] px-5 py-8 sm:px-7 lg:px-12 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
