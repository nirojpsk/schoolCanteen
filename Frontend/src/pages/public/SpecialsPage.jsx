import SectionTitle from "../../components/common/SectionTitle";

const specials = [
    {
        id: 1,
        title: "Student Combo Set",
        description:
            "A tasty combo with a snack and drink prepared specially for today.",
        price: 120,
        badge: "Available Today",
        image:
            "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
    },
    {
        id: 2,
        title: "Special Lunch Plate",
        description:
            "A filling lunch option prepared fresh for busy school hours.",
        price: 150,
        badge: "Limited Offer",
        image:
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    },
    {
        id: 3,
        title: "Refreshing Juice Combo",
        description:
            "A refreshing drink paired with a light snack for a quick break.",
        price: 90,
        badge: "Popular",
        image:
            "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=1200&q=80",
    },
];

function SpecialsPage() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
            <SectionTitle
                badge="Today's Specials"
                title="Fresh Offers and Student Favourites"
                subtitle="Check out special Meals and featured offers  available from the canteen."
            />
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
                {specials.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                        <div className="h-56 bg-slate-200">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="p-6">
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                                {item.badge}
                            </span>
                            <h3 className="mt-4 text-xl font-bold text-slate-900">
                                {item.title}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                {item.description}
                            </p>
                            <div className="mt-5 flex items-center justify-between">
                                <span className="text-lg font-bold text-green-700">
                                    RS. {item.price}
                                </span>
                                <button className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800">
                                    View Offer
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default SpecialsPage;