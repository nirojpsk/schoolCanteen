import { useState } from "react";
import { toast } from "react-toastify";
import CategoryForm from "../../components/admin/CategoryForm";
import CategoriesTable from "../../components/admin/CategoriesTable";
import AdminHeader from "../../components/admin/AdminHeader";
import LoadingBlock from "../../components/common/LoadingBlock";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../services/categoryApiSlice";
import { getApiErrorMessage } from "../../utils/formatters";

export default function CategoriesPage() {
  const { data, isLoading } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [editingCategory, setEditingCategory] = useState(null);

  const categories = data?.data ?? [];

  const handleAddOrUpdateCategory = async (formData) => {
    try {
      if (editingCategory) {
        const response = await updateCategory({
          id: editingCategory._id,
          ...formData,
        }).unwrap();
        toast.success(response?.message || "Category updated.");
        setEditingCategory(null);
        return;
      }

      const response = await createCategory(formData).unwrap();
      toast.success(response?.message || "Category created.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not save category."));
    }
  };

  const handleDeleteCategory = async (category) => {
    const isConfirmed = window.confirm(
      `Delete the category "${category.name}"?`
    );

    if (!isConfirmed) return;

    try {
      const response = await deleteCategory(category._id).unwrap();
      toast.success(response?.message || "Category deleted.");

      if (editingCategory?._id === category._id) {
        setEditingCategory(null);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete category."));
    }
  };

  return (
    <section className="space-y-8">
      <AdminHeader
        title="Manage Categories"
        description="Create and organize the public menu structure that powers the frontend filters."
      />

      {isLoading ? (
        <LoadingBlock label="Loading categories..." />
      ) : (
        <div className="grid gap-8 xl:grid-cols-5">
          <div className="xl:col-span-2">
            <CategoryForm
              onSubmit={handleAddOrUpdateCategory}
              editingCategory={editingCategory}
              onCancelEdit={() => setEditingCategory(null)}
              isSubmitting={isCreating || isUpdating}
            />
          </div>

          <div className="xl:col-span-3">
            <CategoriesTable
              categories={categories}
              onEdit={setEditingCategory}
              onDelete={handleDeleteCategory}
            />
          </div>
        </div>
      )}
    </section>
  );
}
