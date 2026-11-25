import { DashboardShell } from "@/components/DashboardShell";
import { requireCurrentEmployee } from "@/lib/authorization";
import { listEmployees } from "@/lib/employees";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

export default async function DashboardPage() {
  const employee = await requireCurrentEmployee();
  // Only admins fetch the directory. Employees never receive that data.
  const employees = employee.role === "admin" ? await listEmployees() : null;
  const firstName = employee.employeeName.trim().split(/\s+/)[0] || "there";

  return (
    <DashboardShell
      employeeId={employee.employeeId}
      employeeName={employee.employeeName}
      role={employee.role}
    >
      {employee.role === "admin" && employees ? (
        <>
          <div className="flex items-center gap-2 text-[9px] font-bold tracking-[1.5px] text-violet-500">
            <span className="h-px w-[18px] bg-violet-400" /> SHARED WORKSPACE · ADMIN VIEW
          </div>

          <div className="mt-3 flex items-center justify-between gap-5">
            <div>
              <h1 className="font-sans text-2xl font-bold tracking-[-1.4px] text-slate-800 sm:text-[32px]">Admin workspace</h1>
              <p className="mt-2 text-[11px] text-slate-500">Manage access and see who belongs to your team.</p>
            </div>
            <div className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[9px] font-semibold text-slate-500 max-[680px]:hidden">
              <span aria-hidden="true" className="text-sm text-violet-500">▣</span> Administrator access
            </div>
          </div>

          <section className="relative mt-7 flex min-h-[143px] items-center justify-between overflow-hidden rounded-[13px] bg-gradient-to-r from-[#30324e] via-[#4a4b7c] to-[#6359a0] px-6 py-7 text-white shadow-lg shadow-indigo-950/10 sm:px-8">
            <div className="relative z-10 max-w-[430px]">
              <span className="text-[9px] font-bold tracking-[1.5px] text-violet-200">ADMINISTRATOR ACCESS</span>
              <h2 className="mt-2.5 font-sans text-xl font-bold tracking-tight">People, at a glance.</h2>
              <p className="mt-2 max-w-[370px] text-[10px] leading-relaxed text-indigo-100/80">Review registered accounts and their access roles from one place.</p>
            </div>
            <div aria-hidden="true" className="absolute right-6 top-7 grid size-[72px] place-items-center bg-gradient-to-br from-violet-100/30 to-violet-300/10 text-2xl text-violet-100 [clip-path:polygon(50%_0,93%_16%,86%_70%,50%_100%,14%_70%,7%_16%)] sm:right-[74px] sm:size-[84px]">✦</div>
          </section>

          <section aria-label="Account totals" className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard label="TOTAL ACCOUNTS" value={employees.length} note="Registered in the portal" />
            <StatCard label="EMPLOYEES" value={employees.filter((row) => row.role === "employee").length} note="Standard employee access" />
            <StatCard label="ADMINISTRATORS" value={employees.filter((row) => row.role === "admin").length} note="Portal management access" />
          </section>

          <section className="mt-7">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-sans text-[15px] font-bold text-slate-700">Employee directory</h2>
                <p className="mt-1 text-[10px] text-slate-400">Accounts registered in the employee portal.</p>
              </div>
              <span className="text-[8px] font-bold tracking-[1px] text-slate-400">{employees.length} {employees.length === 1 ? "ACCOUNT" : "ACCOUNTS"}</span>
            </div>

            {employees.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-7 text-center text-[11px] text-slate-500">No accounts have been registered yet.</div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full min-w-[620px] border-collapse text-left">
                  <thead>
                    <tr className="h-[38px] border-b border-slate-100 bg-slate-50 text-[8px] font-bold tracking-[.9px] text-slate-400">
                      <th className="px-4">EMPLOYEE</th>
                      <th className="px-4">EMPLOYEE ID</th>
                      <th className="px-4">ROLE</th>
                      <th className="px-4">JOINED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((row) => {
                      const initials = row.employeeName
                        .split(/\s+/)
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0]?.toUpperCase())
                        .join("");

                      return (
                        <tr className="h-[54px] border-b border-slate-100 last:border-0" key={row.employeeId}>
                          <td className="px-4">
                            <div className="flex items-center gap-2.5">
                              <span className="grid size-[27px] place-items-center rounded-full bg-violet-50 text-[8px] font-bold text-violet-800">{initials || "FA"}</span>
                              <span className="text-[10px] font-semibold text-slate-700">{row.employeeName}</span>
                            </div>
                          </td>
                          <td className="px-4 text-[9px] font-bold tracking-[.6px] text-slate-600">{row.employeeId}</td>
                          <td className="px-4">
                            <span className={`inline-flex rounded-full px-2 py-1 text-[8px] font-bold capitalize ${row.role === "employee" ? "bg-emerald-50 text-emerald-800" : "bg-violet-50 text-violet-800"}`}>
                              {row.role}
                            </span>
                          </td>
                          <td className="px-4 text-[9px] text-slate-500">{formatDate(row.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 text-[9px] font-bold tracking-[1.5px] text-violet-500">
            <span className="h-px w-[18px] bg-violet-400" /> SHARED WORKSPACE · EMPLOYEE VIEW
          </div>

          <div className="mt-3 flex items-center justify-between gap-5">
            <div>
              <h1 className="font-sans text-2xl font-bold tracking-[-1.4px] text-slate-800 sm:text-[32px]">Good to see you, {firstName}.</h1>
              <p className="mt-2 text-[11px] text-slate-500">Here&apos;s your employee workspace at a glance.</p>
            </div>
            <div className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[9px] font-semibold text-slate-500 max-[680px]:hidden">
              <span aria-hidden="true" className="text-sm text-violet-500">▣</span> Employee access
            </div>
          </div>

          <section className="relative mt-7 flex min-h-[165px] items-center justify-between overflow-hidden rounded-[13px] bg-gradient-to-r from-[#343254] via-[#4d487f] to-[#59539a] px-6 py-7 text-white shadow-lg shadow-indigo-950/10 sm:px-8">
            <div className="relative z-10 max-w-[430px]">
              <span className="text-[9px] font-bold tracking-[1.5px] text-violet-200">YOUR PROFILE</span>
              <h2 className="mt-2.5 font-sans text-lg font-bold tracking-tight sm:text-[21px]">Welcome to your workspace.</h2>
              <p className="mt-2 max-w-[370px] text-[10px] leading-relaxed text-indigo-100/80">Your account is active. You can use your employee ID to sign in any time.</p>
            </div>
            <div aria-hidden="true" className="absolute -right-6 top-4 grid size-[128px] place-items-center rounded-full border border-violet-100/25 bg-violet-200/10 text-xl font-extrabold tracking-wider text-white/90 shadow-[0_0_0_16px_rgba(210,203,255,0.035),0_0_0_32px_rgba(210,203,255,0.025)] sm:right-[69px]">FA</div>
            <span aria-hidden="true" className="absolute right-4 top-7 text-xl text-violet-100 sm:right-11">✳</span>
            <span aria-hidden="true" className="absolute bottom-6 right-[100px] text-sm text-violet-200 sm:right-[210px]">✦</span>
          </section>

          <div className="mt-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-sans text-[15px] font-bold text-slate-700">Account overview</h2>
              <p className="mt-1 text-[10px] text-slate-400">Your current access and employee details.</p>
            </div>
            <span className="text-[8px] font-bold tracking-[1px] text-slate-400 max-[680px]:hidden">SECURE WORKSPACE</span>
          </div>

          <section aria-label="Account overview" className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <OverviewCard color="violet" icon="◉" label="EMPLOYEE NAME" value={employee.employeeName} note="Registered profile name" />
            <OverviewCard color="emerald" icon="⌗" label="EMPLOYEE ID" value={employee.employeeId} note="Your unique account ID" />
            <OverviewCard color="amber" icon="✓" label="ACCOUNT STATUS" value="Active" note="Employee access enabled" active />
          </section>

          <section className="mt-4 flex items-center gap-3 rounded-xl border border-violet-100 bg-[#fcfbff] p-4">
            <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-lg bg-violet-100 text-base text-violet-700">✧</span>
            <div>
              <h3 className="font-sans text-[10px] font-bold text-[#4a456f]">You&apos;re all set</h3>
              <p className="mt-1 text-[9px] leading-relaxed text-slate-500">Your employee account is ready. Contact your administrator if you need help with access.</p>
            </div>
            <span aria-hidden="true" className="ml-auto grid size-5 shrink-0 place-items-center rounded-full bg-emerald-50 text-[10px] text-emerald-700">✓</span>
          </section>
        </>
      )}
    </DashboardShell>
  );
}

function OverviewCard({
  color,
  icon,
  label,
  value,
  note,
  active = false,
}: {
  color: "violet" | "emerald" | "amber";
  icon: string;
  label: string;
  value: string;
  note: string;
  active?: boolean;
}) {
  const iconStyles = {
    violet: "bg-violet-50 text-violet-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
  }[color];

  return (
    <article className="flex min-h-[143px] flex-col items-start rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/[0.02]">
      <div aria-hidden="true" className={`mb-3 grid size-7 place-items-center rounded-lg text-sm ${iconStyles}`}>{icon}</div>
      <span className="text-[8px] font-bold tracking-[1px] text-slate-400">{label}</span>
      <strong className={`mt-1 max-w-full truncate font-sans text-sm font-bold ${active ? "flex items-center gap-2 text-emerald-700" : "text-slate-700"}`}>
        {active && <span className="size-[7px] rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(83,184,132,0.12)]" />}
        {value}
      </strong>
      <span className="mt-auto pt-2 text-[9px] text-slate-400">{note}</span>
    </article>
  );
}

function StatCard({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <article className="flex min-h-[109px] flex-col items-start rounded-xl border border-slate-200 bg-white p-4">
      <span className="text-[8px] font-bold tracking-[1px] text-slate-400">{label}</span>
      <strong className="mt-2 font-sans text-[22px] leading-none text-slate-700">{value}</strong>
      <span className="mt-auto pt-2 text-[9px] text-slate-400">{note}</span>
    </article>
  );
}
