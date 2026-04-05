export default function SpecialsTable({
  specials,
  onEdit,
  onDelete,
  onToggleActive,
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Specials List</h2>
        <p className="mt-1 text-sm text-slate-600">
          View and manage all special offers and daily promotions.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 text-sm text-slate-500">
              <th className="pb-3 font-medium">Special</th>
              <th className="pb-3 font-medium">Menu Item</th>
              <th className="pb-3 font-medium">Price</th>
              <th className="pb-3 font-medium">Start Date</th>
              <th className="pb-3 font-medium">End Date</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {specials.map((special) => (
              <tr
                key={special.id}
                className="border-b border-slate-100 text-sm text-slate-700"
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={special.bannerImage}
                      alt={special.title}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{special.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {special.description}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-4">{special.menuItem}</td>
                <td className="py-4 font-semibold">Rs. {special.specialPrice}</td>
                <td className="py-4">{special.startDate}</td>
                <td className="py-4">{special.endDate}</td>

                <td className="py-4">
                  <button
                    onClick={() => onToggleActive(special.id)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      special.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {special.isActive ? "Active" : "Inactive"}
                  </button>
                </td>

                <td className="py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => onEdit(special)}
                      className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(special.id)}
                      className="rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {specials.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="py-8 text-center text-sm text-slate-500"
                >
                  No specials found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}