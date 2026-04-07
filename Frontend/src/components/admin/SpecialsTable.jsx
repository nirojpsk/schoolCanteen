import StatusBadge from "../common/StatusBadge";
import {
  formatCurrency,
  formatDateRange,
  getDiscountPercent,
  isSpecialRunning,
} from "../../utils/formatters";

export default function SpecialsTable({
  specials,
  onEdit,
  onDelete,
  onToggleActive,
}) {
  const runningCount = specials.filter((special) => isSpecialRunning(special)).length;
  const inactiveCount = specials.filter((special) => !special.isActive).length;

  return (
    <div className="admin-card overflow-hidden">
      <div className="border-b border-slate-100 p-6 md:p-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
              Promotions Hub
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-950">
              Specials Directory
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Promotions here drive attention on the homepage and can quickly
              shape lunch demand, so timing and presentation matter.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] bg-slate-50 px-5 py-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
                Total
              </p>
              <p className="mt-2 text-2xl font-extrabold text-slate-950">
                {specials.length}
              </p>
            </div>
            <div className="rounded-[24px] bg-[#eef8f1] px-5 py-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
                Running
              </p>
              <p className="mt-2 text-2xl font-extrabold text-emerald-900">
                {runningCount}
              </p>
            </div>
            <div className="rounded-[24px] bg-[#fff5f2] px-5 py-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
                Inactive
              </p>
              <p className="mt-2 text-2xl font-extrabold text-slate-950">
                {inactiveCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="w-full min-w-[980px] text-left">
          <thead className="bg-slate-50/90">
            <tr className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
              <th className="px-5 py-4 font-medium">Special</th>
              <th className="px-5 py-4 font-medium">Linked Item</th>
              <th className="px-5 py-4 font-medium">Price</th>
              <th className="px-5 py-4 font-medium">Campaign Window</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {specials.map((special) => (
              <tr
                key={special._id}
                className="text-sm text-slate-700 transition hover:bg-[#f9fcfa]"
              >
                <td className="px-5 py-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        special.bannerImage ||
                        special.menuItem?.image ||
                        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80"
                      }
                      alt={special.title}
                      className="h-14 w-14 rounded-[18px] object-cover shadow-[0_10px_24px_rgba(15,23,42,0.12)]"
                    />
                    <div>
                      <p className="font-extrabold text-slate-950">{special.title}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                        {special.description || "No description added."}
                      </p>
                      {getDiscountPercent(special) > 0 ? (
                        <p className="mt-1 text-xs font-semibold text-amber-700">
                          Save {getDiscountPercent(special)}%
                        </p>
                      ) : null}
                    </div>
                  </div>
                </td>

                <td className="px-5 py-5">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {special.menuItem?.name || "Unknown"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Base price: {formatCurrency(special.menuItem?.price || 0)}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-5">
                  <p className="font-extrabold text-slate-950">
                    {formatCurrency(special.specialPrice)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Promotional price</p>
                </td>
                <td className="px-5 py-5">
                  <p className="font-semibold text-slate-900">
                    {formatDateRange(special.startDate, special.endDate)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {isSpecialRunning(special) ? "Running now" : "Outside live window"}
                  </p>
                </td>

                <td className="px-5 py-5">
                  <button
                    onClick={() => onToggleActive(special)}
                    className="rounded-full transition hover:scale-[1.02]"
                  >
                    <StatusBadge
                      value={special.isActive ? "Active" : "Inactive"}
                      tone={special.isActive ? "active" : "inactive"}
                    />
                  </button>
                </td>

                <td className="px-5 py-5">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => onEdit(special)}
                      className="secondary-button px-4 py-2 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(special)}
                      className="rounded-full bg-rose-100 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {specials.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="mx-auto max-w-md">
                    <p className="text-lg font-extrabold text-slate-950">
                      No specials yet
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-500">
                      Create a promotion to spotlight a favorite item and bring
                      more energy to the homepage.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
