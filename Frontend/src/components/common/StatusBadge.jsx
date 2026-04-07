import { formatStatus } from "../../utils/formatters";

const toneMap = {
  pending: "bg-amber-100 text-amber-800 ring-amber-200",
  preparing: "bg-sky-100 text-sky-800 ring-sky-200",
  ready: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  completed: "bg-slate-200 text-slate-800 ring-slate-300",
  cancelled: "bg-rose-100 text-rose-800 ring-rose-200",
  active: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  inactive: "bg-slate-200 text-slate-700 ring-slate-300",
  featured: "bg-amber-100 text-amber-800 ring-amber-200",
  normal: "bg-slate-200 text-slate-700 ring-slate-300",
  available: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  unavailable: "bg-rose-100 text-rose-800 ring-rose-200",
  veg: "bg-lime-100 text-lime-800 ring-lime-200",
  "non-veg": "bg-orange-100 text-orange-800 ring-orange-200",
};

export default function StatusBadge({ value, tone, className = "" }) {
  const normalized = String(tone ?? value ?? "")
    .toLowerCase()
    .trim();

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${toneMap[normalized] || "bg-slate-100 text-slate-700 ring-slate-200"} ${className}`}
    >
      {formatStatus(String(value ?? "").trim() || normalized)}
    </span>
  );
}
