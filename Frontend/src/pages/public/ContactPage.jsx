import SectionTitle from "../../components/common/SectionTitle";

function ContactPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <SectionTitle
        badge="Contact Us"
        title="Get in Touch with the Canteen Team"
        subtitle="Reach out for food information, timings, or general canteen queries."
      />
      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">
              Location
            </h3>
            <p className="mt-3 text-slate-600">
              Shivastakshi-10, Maidhar, Jhapa
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">
              Opening Hours
            </h3>
            <p className="mt-3 text-slate-600">
              Sunday - Friday
            </p>
            <p className="text-slate-600">
              8:00 AM - 4:00 PM
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Contact Number</h3>
            <p className="mt-3 text-slate-600">+977 9800000000
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-slate-900">Send a Message
          </h3>
          <form className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input type="text" placeholder="Enter your name" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <input type="email" placeholder="Enter your email" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Subject
              </label>
              <input type="text" placeholder="Enter the subject" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Message
              </label>
              <textarea placeholder="Write your message here" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600" rows="5"></textarea>
            </div>
            <button type="submit" className="w-full rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;