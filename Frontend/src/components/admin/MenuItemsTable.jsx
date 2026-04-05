export default function MenuItemsTable({
  items,
  onEdit,
  onDelete,
  onToggleAvailability,
  onToggleFeatured,
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Menu Items List</h2>
        <p className="mt-1 text-sm text-slate-600">
          View and manage all food and drink items in the canteen.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-250 text-left">
          <thead>
            <tr className="border-b border-slate-200 text-sm text-slate-500">
              <th className="pb-3 font-medium">Item</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Price</th>
              <th className="pb-3 font-medium">Type</th>
              <th className="pb-3 font-medium">Available</th>
              <th className="pb-3 font-medium">Featured</th>
              <th className="pb-3 font-medium">Prep Time</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 text-sm text-slate-700"
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.slug}</p>
                    </div>
                  </div>
                </td>

                <td className="py-4">{item.category}</td>
                <td className="py-4 font-semibold">Rs. {item.price}</td>

                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.isVeg
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {item.isVeg ? "Veg" : "Non-Veg"}
                  </span>
                </td>

                <td className="py-4">
                  <button
                    onClick={() => onToggleAvailability(item.id)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </button>
                </td>

                <td className="py-4">
                  <button
                    onClick={() => onToggleFeatured(item.id)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.isFeatured
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.isFeatured ? "Featured" : "Normal"}
                  </button>
                </td>

                <td className="py-4">{item.preparationTime} min</td>

                <td className="py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => onEdit(item)}
                      className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="py-8 text-center text-sm text-slate-500"
                >
                  No menu items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}