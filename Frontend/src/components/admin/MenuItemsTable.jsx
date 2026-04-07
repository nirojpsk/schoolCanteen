import StatusBadge from "../common/StatusBadge";
import { formatCurrency } from "../../utils/formatters";

export default function MenuItemsTable({
  items,
  onEdit,
  onDelete,
  onToggleAvailability,
  onToggleFeatured,
}) {
  const availableCount = items.filter((item) => item.isAvailable).length;
  const featuredCount = items.filter((item) => item.isFeatured).length;

  return (
    <div className="admin-card overflow-hidden">
      <div className="border-b border-slate-100 p-6 md:p-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
              Menu Library
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-950">
              Live Menu Items
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Everything here powers the public menu, homepage highlights, and
              preorder picker, so clarity and freshness matter.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] bg-slate-50 px-5 py-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
                Total
              </p>
              <p className="mt-2 text-2xl font-extrabold text-slate-950">
                {items.length}
              </p>
            </div>
            <div className="rounded-[24px] bg-[#eef8f1] px-5 py-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
                Available
              </p>
              <p className="mt-2 text-2xl font-extrabold text-emerald-900">
                {availableCount}
              </p>
            </div>
            <div className="rounded-[24px] bg-[#fff8ea] px-5 py-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
                Featured
              </p>
              <p className="mt-2 text-2xl font-extrabold text-amber-800">
                {featuredCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="w-full min-w-[1100px] text-left">
          <thead className="bg-slate-50/90">
            <tr className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
              <th className="px-5 py-4 font-medium">Item</th>
              <th className="px-5 py-4 font-medium">Category</th>
              <th className="px-5 py-4 font-medium">Price</th>
              <th className="px-5 py-4 font-medium">Type</th>
              <th className="px-5 py-4 font-medium">Availability</th>
              <th className="px-5 py-4 font-medium">Featured</th>
              <th className="px-5 py-4 font-medium">Prep Time</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr
                key={item._id}
                className="text-sm text-slate-700 transition hover:bg-[#f9fcfa]"
              >
                <td className="px-5 py-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={item.name}
                      className="h-14 w-14 rounded-[18px] object-cover shadow-[0_10px_24px_rgba(15,23,42,0.12)]"
                    />
                    <div>
                      <p className="font-extrabold text-slate-950">{item.name}</p>
                      <p className="mt-1 text-xs text-slate-500">/{item.slug}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                        {item.description || "No description added."}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-5">
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                    {item.category?.name || "Unknown"}
                  </span>
                </td>
                <td className="px-5 py-5 font-extrabold text-slate-950">
                  {formatCurrency(item.price)}
                </td>

                <td className="px-5 py-5">
                  <StatusBadge
                    value={item.isVeg ? "Veg" : "Non-Veg"}
                    tone={item.isVeg ? "veg" : "non-veg"}
                  />
                </td>

                <td className="px-5 py-5">
                  <button
                    onClick={() => onToggleAvailability(item)}
                    className="rounded-full transition hover:scale-[1.02]"
                  >
                    <StatusBadge
                      value={item.isAvailable ? "Available" : "Unavailable"}
                      tone={item.isAvailable ? "available" : "unavailable"}
                    />
                  </button>
                </td>

                <td className="px-5 py-5">
                  <button
                    onClick={() => onToggleFeatured(item)}
                    className="rounded-full transition hover:scale-[1.02]"
                  >
                    <StatusBadge
                      value={item.isFeatured ? "Featured" : "Normal"}
                      tone={item.isFeatured ? "featured" : "normal"}
                    />
                  </button>
                </td>

                <td className="px-5 py-5">
                  <p className="font-semibold text-slate-900">
                    {item.preparationTime} min
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Kitchen estimate</p>
                </td>

                <td className="px-5 py-5">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => onEdit(item)}
                      className="secondary-button px-4 py-2 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="rounded-full bg-rose-100 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center">
                  <div className="mx-auto max-w-md">
                    <p className="text-lg font-extrabold text-slate-950">
                      No menu items yet
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-500">
                      Add your first item to start powering the menu cards,
                      specials, and preorder flow.
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
