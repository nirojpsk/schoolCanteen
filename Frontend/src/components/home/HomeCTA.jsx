import { Link } from "react-router-dom";

export default function HomeCTA() {
  return (
    <section className="pb-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="rounded-3xl bg-green-700 px-6 py-12 text-center text-white md:px-10">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to Explore the Canteen Menu?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-green-50">
            View daily meals, check specials, and place a preorder for quick collection.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/menu"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-green-700 transition hover:bg-slate-100"
            >
              View Menu
            </Link>
            <Link
              to="/preorder"
              className="rounded-lg border border-white px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Preorder Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}