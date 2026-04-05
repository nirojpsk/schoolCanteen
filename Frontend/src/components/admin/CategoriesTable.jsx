export default function CategoriesTable({
  categories,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Category List</h2>
        <p className="mt-1 text-sm text-slate-600">
          View and manage all existing canteen categories.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-175 text-left">
          <thead>
            <tr className="border-b border-slate-200 text-sm text-slate-500">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Slug</th>
              <th className="pb-3 font-medium">Description</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-b border-slate-100 text-sm text-slate-700"
              >
                <td className="py-4 font-semibold text-slate-900">
                  {category.name}
                </td>
                <td className="py-4">{category.slug}</td>
                <td className="py-4 max-w-xs">{category.description}</td>
                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      category.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => onEdit(category)}
                      className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(category.id)}
                      className="rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="py-8 text-center text-sm text-slate-500"
                >
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}