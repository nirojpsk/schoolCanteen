import { useState } from "react";
import { toast } from "react-toastify";
import MenuItemForm from "../../components/admin/MenuItemForm";
import MenuItemsTable from "../../components/admin/MenuItemsTable";
import AdminHeader from "../../components/admin/AdminHeader";
import LoadingBlock from "../../components/common/LoadingBlock";
import { useGetCategoriesQuery } from "../../services/categoryApiSlice";
import {
  useCreateMenuItemMutation,
  useDeleteMenuItemMutation,
  useGetMenuItemsQuery,
  useUpdateMenuItemMutation,
} from "../../services/menuApiSlice";
import { getApiErrorMessage } from "../../utils/formatters";

const toMenuPayload = (item, overrides = {}) => ({
  name: item.name,
  slug: item.slug,
  description: item.description,
  price: Number(item.price),
  image: item.image,
  category: item.category?._id || item.category,
  isAvailable: item.isAvailable,
  isFeatured: item.isFeatured,
  isVeg: item.isVeg,
  preparationTime: Number(item.preparationTime),
  ...overrides,
});

export default function MenuItemsPage() {
  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useGetCategoriesQuery();
  const { data: itemsResponse, isLoading: isLoadingItems } = useGetMenuItemsQuery();
  const [createMenuItem, { isLoading: isCreating }] = useCreateMenuItemMutation();
  const [updateMenuItem, { isLoading: isUpdating }] = useUpdateMenuItemMutation();
  const [deleteMenuItem] = useDeleteMenuItemMutation();
  const [editingItem, setEditingItem] = useState(null);

  const categories = categoriesResponse?.data ?? [];
  const items = itemsResponse?.data ?? [];

  const handleAddOrUpdateItem = async (formData) => {
    try {
      if (editingItem) {
        const response = await updateMenuItem({
          id: editingItem._id,
          ...formData,
        }).unwrap();
        toast.success(response?.message || "Menu item updated.");
        setEditingItem(null);
        return;
      }

      const response = await createMenuItem({
        ...formData,
        price: Number(formData.price),
        preparationTime: Number(formData.preparationTime),
      }).unwrap();
      toast.success(response?.message || "Menu item created.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not save menu item."));
    }
  };

  const handleDeleteItem = async (item) => {
    const isConfirmed = window.confirm(`Delete "${item.name}" from the menu?`);

    if (!isConfirmed) return;

    try {
      const response = await deleteMenuItem(item._id).unwrap();
      toast.success(response?.message || "Menu item deleted.");

      if (editingItem?._id === item._id) {
        setEditingItem(null);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete menu item."));
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      const response = await updateMenuItem({
        id: item._id,
        ...toMenuPayload(item, { isAvailable: !item.isAvailable }),
      }).unwrap();
      toast.success(response?.message || "Availability updated.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update availability."));
    }
  };

  const handleToggleFeatured = async (item) => {
    try {
      const response = await updateMenuItem({
        id: item._id,
        ...toMenuPayload(item, { isFeatured: !item.isFeatured }),
      }).unwrap();
      toast.success(response?.message || "Featured state updated.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update featured state."));
    }
  };

  return (
    <section className="space-y-8">
      <AdminHeader
        title="Manage Menu Items"
        description="Control the live menu cards, pricing, availability, and featured highlights shown on the public site."
      />

      {isLoadingCategories || isLoadingItems ? (
        <LoadingBlock label="Loading menu management data..." />
      ) : (
        <div className="grid gap-8 xl:grid-cols-5">
          <div className="xl:col-span-2">
            <MenuItemForm
              onSubmit={handleAddOrUpdateItem}
              editingItem={editingItem}
              onCancelEdit={() => setEditingItem(null)}
              categories={categories}
              isSubmitting={isCreating || isUpdating}
            />
          </div>

          <div className="xl:col-span-3">
            <MenuItemsTable
              items={items}
              onEdit={setEditingItem}
              onDelete={handleDeleteItem}
              onToggleAvailability={handleToggleAvailability}
              onToggleFeatured={handleToggleFeatured}
            />
          </div>
        </div>
      )}
    </section>
  );
}
