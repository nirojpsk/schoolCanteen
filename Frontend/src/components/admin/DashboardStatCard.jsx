export default function DashboardStatCard({
  title,
  value,
  subtitle,
  accent = "emerald",
  icon: Icon = null,
  badge = null,
}) {
  const accentMap = {
    emerald: "bg-[#e8f7ef] text-emerald-900",
    amber: "bg-[#fff3db] text-amber-900",
    sky: "bg-[#eaf2ff] text-sky-900",
    rose: "bg-[#ffe8e6] text-rose-900",
  };

  return (
    <div className="admin-card p-5 transition hover:-translate-y-0.5 hover:shadow-[0_22px_36px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentMap[accent] || accentMap.emerald}`}>
          {Icon ? <Icon className="text-2xl" /> : null}
        </div>
        {badge ? (
          <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </p>
      <h3 className="mt-2 text-4xl font-extrabold text-slate-950">{value}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{subtitle}</p>
    </div>
  );
}
