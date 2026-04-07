import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import SectionTitle from "../../components/common/SectionTitle";
import EmptyState from "../../components/common/EmptyState";
import LoadingBlock from "../../components/common/LoadingBlock";
import StatusBadge from "../../components/common/StatusBadge";
import { useGetMenuItemsQuery } from "../../services/menuApiSlice";
import { useCreatePreorderMutation } from "../../services/preorderApiSlice";
import {
  buildPickupSlots,
  formatCurrency,
  getApiErrorMessage,
} from "../../utils/formatters";
import { getFirstValidationError, validatePreorderForm } from "../../utils/validators";

const pickupSlots = buildPickupSlots();

function PreorderPage() {
  const { data, isLoading, isError } = useGetMenuItemsQuery({ available: true });
  const [createPreorder, { isLoading: isSubmitting }] = useCreatePreorderMutation();
  const userInfo = useSelector((state) => state.auth.userInfo);

  const menuItems = useMemo(() => data?.data ?? [], [data]);
  const quickPicks = menuItems.slice(0, 3);
  const [student, setStudent] = useState({
    studentName: "",
    classSection: "",
    phone: "",
    pickupTime: pickupSlots[6] || "10:30 AM",
    note: "",
  });
  const [selection, setSelection] = useState({
    menuItem: "",
    quantity: 1,
  });
  const [cart, setCart] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  const [formError, setFormError] = useState("");

  const selectedItem = useMemo(
    () => menuItems.find((item) => item._id === selection.menuItem),
    [menuItems, selection.menuItem]
  );

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + Number(item.priceAtOrderTime) * Number(item.quantity),
        0
      ),
    [cart]
  );

  const cartItemCount = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.quantity), 0),
    [cart]
  );

  const resolvedStudent = useMemo(
    () => ({
      ...student,
      studentName: student.studentName || userInfo?.name || "",
      classSection: student.classSection || userInfo?.classSection || "",
      phone: student.phone || userInfo?.phone || "",
    }),
    [student, userInfo]
  );

  const handleStudentChange = (event) => {
    const { name, value } = event.target;
    setFormError("");

    setStudent((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAddToCart = () => {
    if (!selectedItem) {
      toast.error("Please select a menu item first.");
      return;
    }

    const quantity = Number(selection.quantity);

    setCart((previous) => {
      const existingItem = previous.find((item) => item.menuItem === selectedItem._id);

      if (existingItem) {
        return previous.map((item) =>
          item.menuItem === selectedItem._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...previous,
        {
          menuItem: selectedItem._id,
          name: selectedItem.name,
          priceAtOrderTime: selectedItem.price,
          quantity,
        },
      ];
    });

    setSelection({
      menuItem: selectedItem._id,
      quantity: 1,
    });
  };

  const updateCartQuantity = (menuItemId, nextQuantity) => {
    if (nextQuantity < 1) {
      setCart((previous) => previous.filter((item) => item.menuItem !== menuItemId));
      return;
    }

    setCart((previous) =>
      previous.map((item) =>
        item.menuItem === menuItemId ? { ...item, quantity: nextQuantity } : item
      )
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = getFirstValidationError(
      validatePreorderForm({ student: resolvedStudent, cart })
    );

    if (validationError) {
      setFormError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      const response = await createPreorder({
        ...resolvedStudent,
        items: cart.map((item) => ({
          menuItem: item.menuItem,
          quantity: item.quantity,
        })),
      }).unwrap();

      setLastOrder(response?.data ?? null);
      toast.success(response?.message || "Preorder placed successfully.");
      setStudent({
        studentName: userInfo?.name || "",
        classSection: userInfo?.classSection || "",
        phone: userInfo?.phone || "",
        pickupTime: pickupSlots[6] || "10:30 AM",
        note: "",
      });
      setSelection({
        menuItem: "",
        quantity: 1,
      });
      setCart([]);
    } catch (error) {
      const message = getApiErrorMessage(error, "Could not place preorder.");
      setFormError(message);
      toast.error(message);
    }
  };

  return (
    <section className="page-section pt-10">
      <div className="content-shell">
        <div className="glass-panel overflow-hidden rounded-[40px] p-6 md:p-8">
          <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
            <div>
              <SectionTitle
                badge="Fast-track your lunch"
                title="Preorder before the break rush begins"
                subtitle="This flow stays connected to the live menu API, validates against backend rules, and gives staff the exact pickup details they need."
              />

              <div className="mt-7 flex flex-wrap gap-3">
                <span className="public-chip">Pickup slots built for school timing</span>
                <span className="public-chip">Live items only</span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
              <div className="metric-card">
                <p className="subtle-kicker">Available Dishes</p>
                <p className="mt-3 text-4xl font-extrabold text-slate-950">{menuItems.length}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Only currently available items appear here.
                </p>
              </div>
              <div className="metric-card">
                <p className="subtle-kicker">Current Cart</p>
                <p className="mt-3 text-4xl font-extrabold text-slate-950">{cartItemCount}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Items selected for this pickup request.
                </p>
              </div>
              <div className="metric-card">
                <p className="subtle-kicker">Pickup Target</p>
                <p className="mt-3 text-2xl font-extrabold text-slate-950">
                  {student.pickupTime}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Default slot can be changed before checkout.
                </p>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-10">
            <LoadingBlock label="Loading available menu items..." />
          </div>
        ) : isError ? (
          <div className="mt-10">
            <EmptyState
              title="The preorder form is unavailable"
              description="Available menu items could not be loaded from the backend."
            />
          </div>
        ) : !menuItems.length ? (
          <div className="mt-10">
            <EmptyState
              title="No available items right now"
              description="Once menu items are marked as available by the admin, students will be able to preorder them from here."
            />
          </div>
        ) : (
          <>
            {lastOrder ? (
              <div className="mt-8 rounded-[30px] border border-emerald-100 bg-[#dff7ea] px-5 py-4 text-emerald-950">
                <div>
                  <p className="text-lg font-extrabold">Order confirmed!</p>
                  <p className="text-sm font-semibold text-emerald-800">
                    Ready for pickup at {lastOrder.pickupTime}. Please show your ID at the counter.
                  </p>
                </div>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-10 grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
              <div className="grid gap-6">
                <div className="glass-panel rounded-[36px] p-6 md:p-8">
                  <div>
                    <p className="subtle-kicker">Step 01</p>
                    <h2 className="mt-3 text-2xl font-extrabold text-slate-950">Student information</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Add the details staff should see during pickup.
                    </p>
                  </div>

                  {userInfo ? (
                    <div className="mt-5 rounded-[24px] bg-[#eef8f1] px-4 py-4 text-sm text-emerald-950">
                      Signed in as <span className="font-extrabold">{userInfo.name || userInfo.email}</span>. Your saved account details will be used automatically unless you change them here.
                    </div>
                  ) : null}

                  {formError ? (
                    <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {formError}
                    </div>
                  ) : null}

                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="field-label">Student name</label>
                      <input
                        type="text"
                        name="studentName"
                        value={resolvedStudent.studentName}
                        onChange={handleStudentChange}
                        placeholder="e.g. Alex Johnson"
                        className="field-input"
                        minLength="2"
                        maxLength="100"
                        autoComplete="name"
                        required
                      />
                    </div>
                    <div>
                      <label className="field-label">Class / Section</label>
                      <input
                        type="text"
                        name="classSection"
                        value={resolvedStudent.classSection}
                        onChange={handleStudentChange}
                        placeholder="e.g. Grade 10 - B"
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
                        value={resolvedStudent.phone}
                        onChange={handleStudentChange}
                        placeholder="+977 9800000000"
                        className="field-input"
                        pattern="^[0-9+\\-\\s]{7,20}$"
                        autoComplete="tel"
                        required
                      />
                    </div>
                    <div>
                      <label className="field-label">Pickup time</label>
                      <select
                        name="pickupTime"
                        value={student.pickupTime}
                        onChange={handleStudentChange}
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
                      rows="4"
                      value={student.note}
                      onChange={handleStudentChange}
                      placeholder="Allergies, extra sauce, pickup note, or other instructions..."
                      className="field-input"
                      maxLength="500"
                    />
                  </div>
                </div>

                <div className="glass-panel rounded-[36px] p-6 md:p-8">
                  <div>
                    <p className="subtle-kicker">Step 02</p>
                    <h2 className="mt-3 text-2xl font-extrabold text-slate-950">Select items</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Choose from the live menu and build your order summary.
                    </p>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-[1fr_110px_auto]">
                    <select
                      value={selection.menuItem}
                      onChange={(event) =>
                        setSelection((previous) => ({
                          ...previous,
                          menuItem: event.target.value,
                        }))
                      }
                      className="field-input"
                    >
                      <option value="">Select a healthy meal...</option>
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
                      value={selection.quantity}
                      onChange={(event) =>
                        setSelection((previous) => ({
                          ...previous,
                          quantity: Number(event.target.value) || 1,
                        }))
                      }
                      className="field-input"
                    />

                    <button type="button" onClick={handleAddToCart} className="primary-button">
                      Add
                    </button>
                  </div>

                  {selectedItem ? (
                    <div className="mt-5 soft-panel p-5">
                      <div className="grid gap-4 md:grid-cols-[120px_1fr]">
                        <img
                          src={selectedItem.image}
                          alt={selectedItem.name}
                          className="h-28 w-full rounded-[24px] object-cover md:w-28"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge value={selectedItem.category?.name || "Menu"} />
                            <StatusBadge
                              value={selectedItem.isVeg ? "Veg" : "Non-Veg"}
                              tone={selectedItem.isVeg ? "veg" : "non-veg"}
                            />
                          </div>
                          <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                            {selectedItem.name}
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-slate-600">
                            {selectedItem.description}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500">
                            <span>{formatCurrency(selectedItem.price)}</span>
                            <span>Prep time: {selectedItem.preparationTime} mins</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-6">
                    <p className="field-label">Quick picks</p>
                    <div className="mt-3 grid gap-4 sm:grid-cols-3">
                      {quickPicks.map((item) => (
                        <button
                          key={item._id}
                          type="button"
                          onClick={() =>
                            setSelection((previous) => ({
                              ...previous,
                              menuItem: item._id,
                            }))
                          }
                          className={`overflow-hidden rounded-[28px] border p-3 text-left transition ${
                            selection.menuItem === item._id
                              ? "border-emerald-500 bg-emerald-50 shadow-[0_16px_30px_rgba(18,114,82,0.12)]"
                              : "border-slate-100 bg-white hover:border-emerald-200 hover:shadow-[0_14px_28px_rgba(15,23,42,0.06)]"
                          }`}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-28 w-full rounded-[22px] object-cover"
                          />
                          <h3 className="mt-3 text-base font-extrabold text-slate-950">{item.name}</h3>
                          <p className="mt-1 text-sm font-semibold text-slate-500">
                            {formatCurrency(item.price)}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="xl:sticky xl:top-28 xl:h-fit">
                <div className="overflow-hidden rounded-[38px] bg-[#063b2c] p-6 text-white shadow-[0_30px_60px_rgba(7,49,36,0.24)] md:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-3xl font-extrabold">Live summary</h2>
                      <p className="mt-2 text-sm leading-7 text-emerald-50/76">
                        Review your order before checkout and keep the counter handoff simple.
                      </p>
                    </div>
                    <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-extrabold text-[#ffc629]">
                      {cartItemCount} items
                    </span>
                  </div>

                  <div className="mt-5 rounded-[24px] bg-white/6 p-4 text-sm text-emerald-50/76">
                    Pickup target: <span className="font-extrabold text-white">{student.pickupTime}</span>
                  </div>

                  <div className="mt-6 space-y-3">
                    {cart.length ? (
                      cart.map((item) => (
                        <div
                          key={item.menuItem}
                          className="rounded-[24px] border border-white/10 bg-white/7 p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-extrabold text-white">{item.name}</h3>
                              <p className="mt-1 text-sm text-emerald-50/70">
                                {formatCurrency(item.priceAtOrderTime)} each
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.menuItem, 0)}
                              className="rounded-full bg-white/8 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-white/80 hover:bg-white/12 hover:text-white"
                              aria-label={`Remove ${item.name}`}
                            >
                              Remove
                            </button>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.menuItem, item.quantity - 1)}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white"
                              >
                                -
                              </button>
                              <span className="min-w-8 text-center text-sm font-extrabold">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.menuItem, item.quantity + 1)}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white"
                              >
                                +
                              </button>
                            </div>

                            <p className="text-lg font-extrabold text-[#ffc629]">
                              {formatCurrency(Number(item.priceAtOrderTime) * Number(item.quantity))}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[24px] border border-dashed border-white/18 p-5 text-sm leading-7 text-emerald-50/70">
                        Add one or more items from the live menu to build your preorder summary.
                      </div>
                    )}
                  </div>

                  <div className="mt-6 rounded-[26px] bg-white/6 p-5">
                    <div className="flex items-center justify-between text-sm text-emerald-50/74">
                      <span>Subtotal</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-emerald-50/74">
                      <span>Tax (Included)</span>
                      <span>{formatCurrency(0)}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-lg font-bold text-white">Total</span>
                      <span className="text-3xl font-extrabold text-[#ffc629]">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[24px] bg-[#0e4c39] p-4 text-sm leading-7 text-emerald-50/74">
                    Pickup instruction: head to the canteen counter at your selected time.
                    Payment still happens at the counter, so the digital flow stays quick and practical.
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || cart.length === 0}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#ffc629] px-6 py-4 text-base font-extrabold text-emerald-950 shadow-[0_16px_30px_rgba(255,198,41,0.24)] hover:-translate-y-0.5 hover:bg-[#ffd248] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? "Submitting preorder..." : "Confirm Preorder"}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

export default PreorderPage;
