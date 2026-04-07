import { useState } from "react";
import { toast } from "react-toastify";
import SpecialForm from "../../components/admin/SpecialForm";
import SpecialsTable from "../../components/admin/SpecialsTable";
import AdminHeader from "../../components/admin/AdminHeader";
import LoadingBlock from "../../components/common/LoadingBlock";
import { useGetMenuItemsQuery } from "../../services/menuApiSlice";
import {
  useCreateSpecialMutation,
  useDeleteSpecialMutation,
  useGetSpecialsQuery,
  useUpdateSpecialMutation,
} from "../../services/specialApiSlice";
import { getApiErrorMessage } from "../../utils/formatters";

const toSpecialPayload = (special, overrides = {}) => ({
  title: special.title,
  description: special.description,
  menuItem: special.menuItem?._id || special.menuItem,
  specialPrice: Number(special.specialPrice),
  startDate: special.startDate?.slice(0, 10) || special.startDate,
  endDate: special.endDate?.slice(0, 10) || special.endDate,
  bannerImage: special.bannerImage,
  isActive: special.isActive,
  ...overrides,
});

export default function SpecialsManagePage() {
  const { data: specialsResponse, isLoading: isLoadingSpecials } =
    useGetSpecialsQuery();
  const { data: menuResponse, isLoading: isLoadingMenuItems } =
    useGetMenuItemsQuery();
  const [createSpecial, { isLoading: isCreating }] = useCreateSpecialMutation();
  const [updateSpecial, { isLoading: isUpdating }] = useUpdateSpecialMutation();
  const [deleteSpecial] = useDeleteSpecialMutation();
  const [editingSpecial, setEditingSpecial] = useState(null);

  const specials = specialsResponse?.data ?? [];
  const menuItems = menuResponse?.data ?? [];

  const handleAddOrUpdateSpecial = async (formData) => {
    try {
      if (editingSpecial) {
        const response = await updateSpecial({
          id: editingSpecial._id,
          ...formData,
          specialPrice: Number(formData.specialPrice),
        }).unwrap();
        toast.success(response?.message || "Special updated.");
        setEditingSpecial(null);
        return;
      }

      const response = await createSpecial({
        ...formData,
        specialPrice: Number(formData.specialPrice),
      }).unwrap();
      toast.success(response?.message || "Special created.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not save special."));
    }
  };

  const handleDeleteSpecial = async (special) => {
    const isConfirmed = window.confirm(`Delete "${special.title}"?`);

    if (!isConfirmed) return;

    try {
      const response = await deleteSpecial(special._id).unwrap();
      toast.success(response?.message || "Special deleted.");

      if (editingSpecial?._id === special._id) {
        setEditingSpecial(null);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete special."));
    }
  };

  const handleToggleActive = async (special) => {
    try {
      const response = await updateSpecial({
        id: special._id,
        ...toSpecialPayload(special, { isActive: !special.isActive }),
      }).unwrap();
      toast.success(response?.message || "Special status updated.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update special status."));
    }
  };

  return (
    <section className="space-y-8">
      <AdminHeader
        title="Manage Specials"
        description="Run timely promotions that automatically surface on the public homepage and specials page."
      />

      {isLoadingSpecials || isLoadingMenuItems ? (
        <LoadingBlock label="Loading special management data..." />
      ) : (
        <div className="grid gap-8 xl:grid-cols-5">
          <div className="xl:col-span-2">
            <SpecialForm
              onSubmit={handleAddOrUpdateSpecial}
              editingSpecial={editingSpecial}
              onCancelEdit={() => setEditingSpecial(null)}
              menuItems={menuItems}
              isSubmitting={isCreating || isUpdating}
            />
          </div>

          <div className="xl:col-span-3">
            <SpecialsTable
              specials={specials}
              onEdit={setEditingSpecial}
              onDelete={handleDeleteSpecial}
              onToggleActive={handleToggleActive}
            />
          </div>
        </div>
      )}
    </section>
  );
}
