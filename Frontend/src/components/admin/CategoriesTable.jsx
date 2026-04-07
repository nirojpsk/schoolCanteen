import StatusBadge from "../common/StatusBadge";

export default function CategoriesTable({
  categories,
  onEdit,
  onDelete,
}) {
  const activeCount = categories.filter((category) => category.isActive).length;
  const hiddenCount = categories.length - activeCount;

  return (
    <div className="admin-card overflow-hidden">
      <div className="border-b border-slate-100 p-6 md:p-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
              Menu Architecture
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-950">
              Category Directory
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Keep the public menu structured, easy to browse, and cleanly
              segmented for students, staff, and future content updates.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[24px] bg-slate-50 px-5 py-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
                Total
              </p>
              <p className="mt-2 text-2xl font-extrabold text-slate-950">
                {categories.length}
              </p>
            </div>
            <div className="rounded-[24px] bg-[#eef8f1] px-5 py-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
                Active
              </p>
              <p className="mt-2 text-2xl font-extrabold text-emerald-900">
                {activeCount}
              </p>
            </div>
            <div className="rounded-[24px] bg-[#fff5f2] px-5 py-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
                Hidden
              </p>
              <p className="mt-2 text-2xl font-extrabold text-slate-950">
                {hiddenCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-slate-50/90">
            <tr className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
              <th className="px-5 py-4 font-medium">Category</th>
              <th className="px-5 py-4 font-medium">Slug</th>
              <th className="px-5 py-4 font-medium">Description</th>
              <th className="px-5 py-4 font-medium">Visibility</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {categories.map((category) => (
              <tr
                key={category._id}
                className="text-sm text-slate-700 transition hover:bg-[#f9fcfa]"
              >
                <td className="px-5 py-5">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-2 h-3 w-3 rounded-full ${category.isActive ? "bg-emerald-400" : "bg-slate-300"}`}
                    />
                    <div>
                      <p className="font-extrabold text-slate-950">{category.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {category.isActive
                          ? "Visible on the public menu"
                          : "Currently hidden from students"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-5">
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                    /{category.slug}
                  </span>
                </td>
                <td className="max-w-xs px-5 py-5">
                  <p className="leading-7 text-slate-600">
                    {category.description || "No description added yet."}
                  </p>
                </td>
                <td className="px-5 py-5">
                  <StatusBadge
                    value={category.isActive ? "Active" : "Inactive"}
                    tone={category.isActive ? "active" : "inactive"}
                  />
                </td>
                <td className="px-5 py-5">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => onEdit(category)}
                      className="secondary-button px-4 py-2 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(category)}
                      className="rounded-full bg-rose-100 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="mx-auto max-w-md">
                    <p className="text-lg font-extrabold text-slate-950">
                      No categories yet
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-500">
                      Create the first category to start organizing the menu into
                      clear sections for students.
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
