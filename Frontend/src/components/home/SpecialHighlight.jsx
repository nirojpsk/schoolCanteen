import { Link } from "react-router-dom";
import SectionTitle from "../common/SectionTitle";

function SpecialHighlight() {
    return (
        <section className="bg-white py-16">
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 lg: grid-cols-2 lg:px-8">
                <div className="overflow-hidden rounded-3xl shadow-lg">
                    <img
                        src="https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80"
                        alt="Today's Special"
                        className="h-full w-full object-cover"
                    />
                </div>

                <div>
                    <SectionTitle
                        badge="Today's Special"
                        title="Fresh Combo Set for Students"
                        subtitle="A tasty and affordable special combo prepared for today's school break. Perfect for quick service and student-friendly pricing."
                    />
                    <div className="mt-6 flex-wrap items-center gap-3">
                        <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
                            Special Price: Rs.120
                        </span>
                        <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                            Available Today
                        </span>
                    </div>

                    <p className="mt-5 text-slate-600">
                        Includes a filling snack item and a refreshing drink. Freshly prepared and served quickly during school hours.
                    </p>
                    <Link
                        to="/specials"
                        className="mt-8 inline-block rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
                    >
                        View All Specials
                    </Link>
                </div>
            </div>

        </section>
    );
}

export default SpecialHighlight;