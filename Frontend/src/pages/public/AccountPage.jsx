import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import EmptyState from "../../components/common/EmptyState";
import LoadingBlock from "../../components/common/LoadingBlock";
import SectionTitle from "../../components/common/SectionTitle";
import StatusBadge from "../../components/common/StatusBadge";
import { setCredentials } from "../../features/auth/authSlice";
import {
  useChangePasswordMutation,
  useUpdateProfileMutation,
} from "../../services/authApiSlice";
import { useGetMenuItemsQuery } from "../../services/menuApiSlice";
import {
  useCancelMyPreorderMutation,
  useGetMyPreordersQuery,
  useUpdateMyPreorderMutation,
} from "../../services/preorderApiSlice";
import {
  buildPickupSlots,
  formatCurrency,
  formatDateTime,
  getApiErrorMessage,
} from "../../utils/formatters";
import {
  getFirstValidationError,
  validatePasswordChangeForm,
  validatePreorderForm,
  validateProfileForm,
} from "../../utils/validators";

const pickupSlots = buildPickupSlots();

const createProfileState = (userInfo) => ({
  name: userInfo?.name || "",
  phone: userInfo?.phone || "",
  profileImage: userInfo?.profileImage || "",
  classSection: userInfo?.classSection || "",
});

const createOrderDraft = (order, userInfo) => ({
  studentName: order?.studentName || userInfo?.name || "",
  classSection: order?.classSection || userInfo?.classSection || "",
  phone: order?.phone || userInfo?.phone || "",
  pickupTime: order?.pickupTime || pickupSlots[6] || "10:30 AM",
  note: order?.note || "",
  cart:
    order?.items?.map((item) => ({
      menuItem: item?.menuItem?._id || item?.menuItem,
      name: item?.name || item?.menuItem?.name || "Menu item",
      priceAtOrderTime: Number(item?.priceAtOrderTime || item?.menuItem?.price || 0),
      quantity: Number(item?.quantity || 1),
    })) || [],
});

export default function AccountPage() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [profileForm, setProfileForm] = useState(createProfileState(userInfo));
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [orderError, setOrderError] = useState("");
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [orderDraft, setOrderDraft] = useState(createOrderDraft(null, userInfo));
  const [orderSelection, setOrderSelection] = useState({ menuItem: "", quantity: 1 });

  const [updateProfile, { isLoading: isSavingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [updateMyPreorder, { isLoading: isSavingOrder }] =
    useUpdateMyPreorderMutation();
  const [cancelMyPreorder, { isLoading: isCancellingOrder }] =
    useCancelMyPreorderMutation();

  const { data: ordersResponse, isLoading: isLoadingOrders } = useGetMyPreordersQuery();
  const { data: menuResponse, isLoading: isLoadingMenuItems } =
    useGetMenuItemsQuery({ available: true });

  const orders = useMemo(() => ordersResponse?.data ?? [], [ordersResponse]);
  const menuItems = useMemo(() => menuResponse?.data ?? [], [menuResponse]);
  const selectedMenuItem = useMemo(
    () => menuItems.find((item) => item._id === orderSelection.menuItem),
    [menuItems, orderSelection.menuItem]
  );
  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === "pending").length,
    [orders]
  );
  const totalSpent = useMemo(
    () =>
      orders.reduce(
        (sum, order) =>
          order.status === "cancelled" ? sum : sum + Number(order.totalAmount || 0),
        0
      ),
    [orders]
  );
  const draftTotal = useMemo(
    () =>
      orderDraft.cart.reduce(
        (sum, item) => sum + Number(item.priceAtOrderTime) * Number(item.quantity),
        0
      ),
    [orderDraft.cart]
  );

  useEffect(() => {
    setProfileForm(createProfileState(userInfo));
  }, [userInfo]);

  if (userInfo?.role === "admin") return <Navigate to="/" replace />;

  const initials =
    userInfo?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";

  const stopEditing = () => {
    setOrderError("");
    setEditingOrderId(null);
    setOrderDraft(createOrderDraft(null, userInfo));
    setOrderSelection({ menuItem: "", quantity: 1 });
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    const validationError = getFirstValidationError(validateProfileForm(profileForm));
    if (validationError) {
      setProfileError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      const response = await updateProfile(profileForm).unwrap();
      if (response?.data) dispatch(setCredentials(response.data));
      toast.success(response?.message || "Profile updated.");
    } catch (error) {
      const message = getApiErrorMessage(error, "Could not update profile.");
      setProfileError(message);
      toast.error(message);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    const validationError = getFirstValidationError(
      validatePasswordChangeForm(passwordForm)
    );
    if (validationError) {
      setPasswordError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      const response = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success(response?.message || "Password changed.");
    } catch (error) {
      const message = getApiErrorMessage(error, "Could not change password.");
      setPasswordError(message);
      toast.error(message);
    }
  };

  const startEditing = (order) => {
    setOrderError("");
    setEditingOrderId(order._id);
    setOrderDraft(createOrderDraft(order, userInfo));
    setOrderSelection({ menuItem: "", quantity: 1 });
  };

  const updateDraftCartQuantity = (menuItemId, quantity) => {
    setOrderDraft((previous) => ({
      ...previous,
      cart:
        quantity < 1
          ? previous.cart.filter((item) => item.menuItem !== menuItemId)
          : previous.cart.map((item) =>
              item.menuItem === menuItemId ? { ...item, quantity } : item
            ),
    }));
  };

  const handleAddDraftItem = () => {
    if (!selectedMenuItem) {
      toast.error("Please choose an available menu item.");
      return;
    }

    const quantity = Number(orderSelection.quantity || 1);
    setOrderDraft((previous) => {
      const existing = previous.cart.find((item) => item.menuItem === selectedMenuItem._id);

      if (existing) {
        return {
          ...previous,
          cart: previous.cart.map((item) =>
            item.menuItem === selectedMenuItem._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      return {
        ...previous,
        cart: [
          ...previous.cart,
          {
            menuItem: selectedMenuItem._id,
            name: selectedMenuItem.name,
            priceAtOrderTime: selectedMenuItem.price,
            quantity,
          },
        ],
      };
    });

    setOrderSelection({ menuItem: selectedMenuItem._id, quantity: 1 });
  };

  const handleSaveOrder = async (event) => {
    event.preventDefault();
    const validationError = getFirstValidationError(
      validatePreorderForm({
        student: {
          studentName: orderDraft.studentName,
          classSection: orderDraft.classSection,
          phone: orderDraft.phone,
          pickupTime: orderDraft.pickupTime,
          note: orderDraft.note,
        },
        cart: orderDraft.cart,
      })
    );

    if (validationError) {
      setOrderError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      const response = await updateMyPreorder({
        id: editingOrderId,
        studentName: orderDraft.studentName,
        classSection: orderDraft.classSection,
        phone: orderDraft.phone,
        pickupTime: orderDraft.pickupTime,
        note: orderDraft.note,
        items: orderDraft.cart.map((item) => ({
          menuItem: item.menuItem,
          quantity: item.quantity,
        })),
      }).unwrap();
      toast.success(response?.message || "Order updated.");
      stopEditing();
    } catch (error) {
      const message = getApiErrorMessage(error, "Could not update this order.");
      setOrderError(message);
      toast.error(message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order while it is still pending?")) return;

    try {
      const response = await cancelMyPreorder(orderId).unwrap();
      toast.success(response?.message || "Order cancelled.");
      if (editingOrderId === orderId) stopEditing();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not cancel this order."));
    }
  };

  return (
    <section className="page-section pt-10">
      <div className="content-shell">
        <SectionTitle
          badge="My Account"
          title="Your profile and account orders in one place"
          subtitle="You can review every signed-in preorder here, and pending orders stay editable until the canteen team updates their status."
        />

        <div className="mt-10 grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
          <aside className="soft-panel overflow-hidden p-6 md:p-8">
            <div className="rounded-[34px] bg-[linear-gradient(135deg,#0b5a42_0%,#137552_100%)] p-6 text-white">
              <div className="flex items-center gap-4">
                {userInfo?.profileImage ? (
                  <img
                    src={userInfo.profileImage}
                    alt={userInfo.name}
                    className="h-20 w-20 rounded-[24px] object-cover ring-4 ring-white/10"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-white/10 text-2xl font-extrabold text-white">
                    {initials}
                  </div>
                )}
                <div>
                  <h2 className="text-3xl font-extrabold text-white">{userInfo?.name}</h2>
                  <p className="mt-1 text-sm text-emerald-50/75">{userInfo?.email}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <StatusBadge value={userInfo?.role || "student"} />
                <StatusBadge
                  value={userInfo?.isActive ? "Active" : "Inactive"}
                  tone={userInfo?.isActive ? "active" : "inactive"}
                />
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="admin-muted-panel p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Total Orders
                </p>
                <p className="mt-3 text-lg font-extrabold text-slate-950">{orders.length}</p>
              </div>
              <div className="admin-muted-panel p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Pending Orders
                </p>
                <p className="mt-3 text-lg font-extrabold text-slate-950">{pendingOrders}</p>
              </div>
              <div className="admin-muted-panel p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Last Login
                </p>
                <p className="mt-3 text-lg font-extrabold text-slate-950">
                  {formatDateTime(userInfo?.lastLogin)}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <Link to="/menu" className="secondary-button w-full justify-center">
                Browse Menu
              </Link>
              <Link to="/preorder" className="primary-button w-full justify-center">
                Place Preorder
              </Link>
            </div>
          </aside>

          <div className="grid gap-8">
            <div id="profile-details" className="anchor-target soft-panel p-6 md:p-8">
              <p className="subtle-kicker">Profile Details</p>
              <h3 className="mt-3 text-3xl font-extrabold text-slate-950">Profile details</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Keep your saved details current so future preorders are faster.
              </p>

              <form onSubmit={handleProfileSubmit} className="mt-8 grid gap-5">
                {profileError ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {profileError}
                  </div>
                ) : null}

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="field-label">Full name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={(event) => {
                        setProfileError("");
                        setProfileForm((previous) => ({
                          ...previous,
                          [event.target.name]: event.target.value,
                        }));
                      }}
                      className="field-input"
                      minLength="2"
                      maxLength="60"
                      required
                    />
                  </div>
                  <div>
                    <label className="field-label">Email address</label>
                    <input
                      type="email"
                      value={userInfo?.email || ""}
                      className="field-input bg-slate-50"
                      disabled
                    />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="field-label">Phone number</label>
                    <input
                      type="text"
                      name="phone"
                      value={profileForm.phone}
                      onChange={(event) => {
                        setProfileError("");
                        setProfileForm((previous) => ({
                          ...previous,
                          [event.target.name]: event.target.value,
                        }));
                      }}
                      className="field-input"
                      pattern="^[0-9+\\-\\s]{7,20}$"
                    />
                  </div>
                  <div>
                    <label className="field-label">Class / Section</label>
                    <input
                      type="text"
                      name="classSection"
                      value={profileForm.classSection}
                      onChange={(event) => {
                        setProfileError("");
                        setProfileForm((previous) => ({
                          ...previous,
                          [event.target.name]: event.target.value,
                        }));
                      }}
                      className="field-input"
                      maxLength="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="field-label">Profile image URL</label>
                  <input
                    type="text"
                    name="profileImage"
                    value={profileForm.profileImage}
                    onChange={(event) => {
                      setProfileError("");
                      setProfileForm((previous) => ({
                        ...previous,
                        [event.target.name]: event.target.value,
                      }));
                    }}
                    className="field-input"
                  />
                </div>

                <button type="submit" disabled={isSavingProfile} className="primary-button w-full">
                  {isSavingProfile ? "Saving profile..." : "Save Profile"}
                </button>
              </form>
            </div>

            <div id="order-history" className="anchor-target soft-panel p-6 md:p-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="subtle-kicker">My Orders</p>
                  <h3 className="mt-3 text-3xl font-extrabold text-slate-950">
                    Your preorder history
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Pending orders can be updated or cancelled. Once staff change the
                    status, the order becomes read-only.
                  </p>
                </div>
                <div className="rounded-[22px] bg-[#eef8f1] px-4 py-3">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                    Total Spent
                  </p>
                  <p className="mt-2 text-2xl font-extrabold text-emerald-900">
                    {formatCurrency(totalSpent)}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                {isLoadingOrders ? (
                  <LoadingBlock label="Loading your orders..." />
                ) : orders.length ? (
                  <div className="grid gap-4">
                    {orders.map((order) => {
                      const isEditable = order.status === "pending";
                      return (
                        <div
                          key={order._id}
                          className={`rounded-[28px] border p-5 ${
                            editingOrderId === order._id
                              ? "border-emerald-200 bg-emerald-50/60"
                              : "border-slate-100 bg-slate-50"
                          }`}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-extrabold text-slate-950">
                                Order #{order._id.slice(-6).toUpperCase()}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {formatDateTime(order.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <StatusBadge value={order.status} tone={order.status} />
                              <span className="text-lg font-extrabold text-slate-950">
                                {formatCurrency(order.totalAmount)}
                              </span>
                            </div>
                          </div>

                          <p className="mt-4 text-sm leading-7 text-slate-700">
                            {order.items.map((item) => `${item.name} x${item.quantity}`).join(", ")}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                            <span>Pickup: {order.pickupTime}</span>
                            <span>Note: {order.note || "None"}</span>
                          </div>

                          {isEditable ? (
                            <div className="mt-5 flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => startEditing(order)}
                                className="secondary-button px-4 py-2 text-sm"
                              >
                                {editingOrderId === order._id ? "Editing Now" : "Edit Order"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCancelOrder(order._id)}
                                disabled={isCancellingOrder}
                                className="rounded-full bg-rose-50 px-4 py-2 text-sm font-extrabold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                {isCancellingOrder ? "Cancelling..." : "Cancel Order"}
                              </button>
                            </div>
                          ) : (
                            <p className="mt-5 text-xs text-slate-400">
                              This order is locked because staff already updated the status.
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState
                    title="No orders yet"
                    description="Place your first preorder while signed in and it will appear here."
                    action={
                      <Link to="/preorder" className="primary-button">
                        Place Your First Order
                      </Link>
                    }
                  />
                )}
              </div>

              {editingOrderId ? (
                <form onSubmit={handleSaveOrder} className="mt-8 rounded-[28px] border border-emerald-200 bg-[#f7fbf8] p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="subtle-kicker">Edit Pending Order</p>
                      <h4 className="mt-3 text-2xl font-extrabold text-slate-950">
                        Update this order before kitchen processing starts
                      </h4>
                    </div>
                    <button type="button" onClick={stopEditing} className="secondary-button px-4 py-3 text-sm">
                      Discard Changes
                    </button>
                  </div>

                  {orderError ? (
                    <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {orderError}
                    </div>
                  ) : null}

                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="field-label">Student name</label>
                      <input
                        type="text"
                        name="studentName"
                        value={orderDraft.studentName}
                        onChange={(event) =>
                          setOrderDraft((previous) => ({
                            ...previous,
                            [event.target.name]: event.target.value,
                          }))
                        }
                        className="field-input"
                        minLength="2"
                        maxLength="100"
                        required
                      />
                    </div>
                    <div>
                      <label className="field-label">Class / Section</label>
                      <input
                        type="text"
                        name="classSection"
                        value={orderDraft.classSection}
                        onChange={(event) =>
                          setOrderDraft((previous) => ({
                            ...previous,
                            [event.target.name]: event.target.value,
                          }))
                        }
                        className="field-input"
                        maxLength="50"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="field-label">Phone number</label>
                      <input
                        type="text"
                        name="phone"
                        value={orderDraft.phone}
                        onChange={(event) =>
                          setOrderDraft((previous) => ({
                            ...previous,
                            [event.target.name]: event.target.value,
                          }))
                        }
                        className="field-input"
                        pattern="^[0-9+\\-\\s]{7,20}$"
                        required
                      />
                    </div>
                    <div>
                      <label className="field-label">Pickup time</label>
                      <select
                        name="pickupTime"
                        value={orderDraft.pickupTime}
                        onChange={(event) =>
                          setOrderDraft((previous) => ({
                            ...previous,
                            [event.target.name]: event.target.value,
                          }))
                        }
                        className="field-input"
                        required
                      >
                        {pickupSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="field-label">Special note</label>
                    <textarea
                      name="note"
                      rows="3"
                      value={orderDraft.note}
                      onChange={(event) =>
                        setOrderDraft((previous) => ({
                          ...previous,
                          [event.target.name]: event.target.value,
                        }))
                      }
                      className="field-input"
                      maxLength="500"
                    />
                  </div>

                  <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-5">
                    <div className="grid gap-4 md:grid-cols-[1fr_110px_auto]">
                      <select
                        value={orderSelection.menuItem}
                        onChange={(event) =>
                          setOrderSelection((previous) => ({
                            ...previous,
                            menuItem: event.target.value,
                          }))
                        }
                        className="field-input"
                        disabled={isLoadingMenuItems}
                      >
                        <option value="">Choose an available item...</option>
                        {menuItems.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.name} - {formatCurrency(item.price)}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={orderSelection.quantity}
                        onChange={(event) =>
                          setOrderSelection((previous) => ({
                            ...previous,
                            quantity: Number(event.target.value) || 1,
                          }))
                        }
                        className="field-input"
                      />
                      <button type="button" onClick={handleAddDraftItem} className="primary-button">
                        Add Item
                      </button>
                    </div>

                    <div className="mt-5 grid gap-4">
                      {orderDraft.cart.length ? (
                        orderDraft.cart.map((item) => (
                          <div key={item.menuItem} className="rounded-[22px] border border-slate-100 bg-slate-50 p-4">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div>
                                <p className="font-extrabold text-slate-950">{item.name}</p>
                                <p className="mt-1 text-sm text-slate-500">
                                  {formatCurrency(item.priceAtOrderTime)} each
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => updateDraftCartQuantity(item.menuItem, 0)}
                                className="rounded-full bg-slate-200 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-700 hover:bg-slate-300"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="mt-4 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateDraftCartQuantity(item.menuItem, item.quantity - 1)}
                                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-lg font-bold text-slate-900"
                                >
                                  -
                                </button>
                                <span className="min-w-8 text-center text-sm font-extrabold text-slate-950">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateDraftCartQuantity(item.menuItem, item.quantity + 1)}
                                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-lg font-bold text-slate-900"
                                >
                                  +
                                </button>
                              </div>
                              <p className="text-lg font-extrabold text-slate-950">
                                {formatCurrency(Number(item.priceAtOrderTime) * Number(item.quantity))}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-[22px] border border-dashed border-slate-200 p-4 text-sm leading-7 text-slate-500">
                          Add at least one item before saving your updated order.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[24px] bg-white px-5 py-4">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                        Updated Total
                      </p>
                      <p className="mt-2 text-3xl font-extrabold text-slate-950">
                        {formatCurrency(draftTotal)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button type="button" onClick={stopEditing} className="secondary-button px-5 py-3 text-sm">
                        Cancel Editing
                      </button>
                      <button type="submit" disabled={isSavingOrder} className="primary-button px-5 py-3 text-sm">
                        {isSavingOrder ? "Saving order..." : "Save Order Changes"}
                      </button>
                    </div>
                  </div>
                </form>
              ) : null}
            </div>

            <div id="change-password" className="anchor-target soft-panel p-6 md:p-8">
              <p className="subtle-kicker">Security</p>
              <h3 className="mt-3 text-3xl font-extrabold text-slate-950">Security</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Update your password using the secure backend password endpoint.
              </p>

              <form onSubmit={handlePasswordSubmit} className="mt-8 grid gap-5">
                {passwordError ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {passwordError}
                  </div>
                ) : null}

                <div>
                  <label className="field-label">Current password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={(event) =>
                      setPasswordForm((previous) => ({
                        ...previous,
                        [event.target.name]: event.target.value,
                      }))
                    }
                    className="field-input"
                    autoComplete="current-password"
                    required
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="field-label">New password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={(event) =>
                        setPasswordForm((previous) => ({
                          ...previous,
                          [event.target.name]: event.target.value,
                        }))
                      }
                      className="field-input"
                      minLength="8"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  <div>
                    <label className="field-label">Confirm password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={(event) =>
                        setPasswordForm((previous) => ({
                          ...previous,
                          [event.target.name]: event.target.value,
                        }))
                      }
                      className="field-input"
                      minLength="8"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                <button type="submit" disabled={isChangingPassword} className="secondary-button w-full justify-center">
                  {isChangingPassword ? "Updating password..." : "Change Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
