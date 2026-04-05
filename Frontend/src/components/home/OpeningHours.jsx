export default function OpeningHours() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="rounded-3xl bg-slate-900 px-6 py-10 text-white md:px-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-green-300">
                Opening Hours
              </span>
              <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                Ready to Serve During School Days
              </h2>
              <p className="mt-3 max-w-2xl text-lg text-slate-300">
                Students can enjoy meals, snacks, and drinks during regular school operating hours.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/5 p-5">
                <p className="text-sm text-slate-400">Sunday - Friday</p>
                <h3 className="mt-2 text-xl font-semibold">9:00 AM - 4:00 PM</h3>
              </div>

              <div className="rounded-2xl bg-white/5 p-5">
                <p className="text-sm text-slate-400">Lunch Service</p>
                <h3 className="mt-2 text-xl font-semibold">12:30 PM - 1:30 PM</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}