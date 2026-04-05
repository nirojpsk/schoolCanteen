import SectionTitle from "../../components/common/SectionTitle";

const sampleItems = [
  { id: 1, name: "Veg Chowmein", price: 90 },
  { id: 2, name: "Chicken Momo", price: 120 },
  { id: 3, name: "Fresh Juice", price: 70 },
  { id: 4, name: "Samosa", price: 25 },
];



function PreorderPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <SectionTitle
        badge="Preorder"
        title="Place Your Meal Request Early"
        subtitle="Order in advance and collect your food quickly from the canteen counter."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <h3 className="text-2xl font-bold text-slate-900">Student Information</h3>

          <form className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" >Full Name</label>
              <input type="text" placeholder="Enter your Full name" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600" />
            </div>

            <div>
              <label className="mb-2 bllabelext-sm font-medium text-slate-700" >Class / Section</label>
              <input type="text" placeholder="Example: Grade 10 - A" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" >Phone Number</label>
              <input type="number" placeholder="Enter your phone number" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" >Select Item</label>
              <select className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600">
                <option>Select a menu item</option>
                {sampleItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} - Rs. {item.price}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" >Quantity</label>
              <input type="number" placeholder="Enter quantity" min="1" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" >Pickup Time</label>
              <input type="time" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" >Note</label>
              <textarea rows="4" placeholder="Enter any special instructions or notes" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600" />
            </div>

            <button type="submit" className="rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              Place Preorder
            </button>

          </form>
        </div>

        <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm md:p-8">
          <h3 className="text-2xl font-bold">Preorder Information</h3>
          <p className="mt-4 leading-7 text-slate-300">Students can place a meal request in advance to reduce waiting time during school breaks.</p>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl bg-white/5 p-5">
              <h4 className="font-semibold">Step 1</h4>
              <p className="mt-2 text-sm text-slate-300">
                Enter your details and choose the food item.
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 p-5">
              <h4 className="font-semibold">Step 2</h4>
              <p className="mt-2 text-sm text-slate-300">
                Select the quantity and pickup time.
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-5">
              <h4 className="font-semibold">Step 3</h4>
              <p className="mt-2 text-sm text-slate-300">
                Submit your preorder and collect your order from the counter.
              </p>
            </div>

            <div className="rounded-2xl bg-green-700/20 p-5">
              <p className="text-sm font-medium text-green-300">Payment Note</p>
              <p className="mt-2 text-sm text-slate-200">Online payment is not required. Payment can be made directly at the counter.</p>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
}

export default PreorderPage;