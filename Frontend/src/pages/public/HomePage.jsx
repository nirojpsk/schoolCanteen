import { Link } from "react-router-dom";
import SectionTitle from "../../components/common/SectionTitle";
import FeaturedItemCard from "../../components/home/FeaturedItemCard";
import SpecialHighlight from "../../components/home/SpecialHighlight";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import OpeningHours from "../../components/home/OpeningHours";
import HomeCTA from "../../components/home/HomeCTA";

const featuredItems = [
    {
        id: 1,
        name: "Veg Chowmein",
        price: 90,
        category: "Lunch",
        isVeg: true,
        description: "Freshly cooked noodles with vegetables and flavourful seasoning.",
        image:
            "https://images.unsplash.com/photo-1617622141675-d3005b9067c5?auto=format&fit=crop&w=1200&q=80",
    },
    {
        id: 2,
        name: "Chicken Momo",
        price: 120,
        category: "Snacks",
        isVeg: false,
        description: "Steamed momo served hot and perfect for school break time.",
        image:
            "https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=1200&q=80",
    },
    {
        id: 3,
        name: "Samosa Set",
        price: 50,
        category: "Snacks",
        isVeg: true,
        description: "Crispy and filling snack option loved by students.",
        image:
            "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
    },
    {
        id: 4,
        name: "Fresh Juice",
        price: 70,
        category: "Drinks",
        isVeg: true,
        description: "Refreshing drink choice to go with your favourite meal.",
        image:
            "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=1200&q=80",
    },
];

export default function HomePage() {
    return (
        <>
            <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
                <div className="grid items-center gap-10 lg:grid-cols-2">
                    <div>
                        <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
                            Welcome to Mechi School Canteen
                        </span>

                        <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
                            Fresh, Tasty and Student-Friendly Meals Every Day
                        </h1>

                        <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
                            Explore healthy meals, snacks, drinks, and daily specials from the
                            canteen in a modern and easy way.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                to="/menu"
                                className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
                            >
                                View Menu
                            </Link>
                            <Link
                                to="/preorder"
                                className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Preorder Now
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-3xl bg-white p-8 shadow-lg">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl bg-orange-100 p-6">
                                <h3 className="text-lg font-semibold text-slate-900">Daily Specials</h3>
                                <p className="mt-2 text-sm text-slate-600">
                                    Fresh dishes prepared for students every day.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-green-100 p-6">
                                <h3 className="text-lg font-semibold text-slate-900">Affordable Prices</h3>
                                <p className="mt-2 text-sm text-slate-600">
                                    Budget-friendly meals for all students.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-sky-100 p-6">
                                <h3 className="text-lg font-semibold text-slate-900">Quick Preorder</h3>
                                <p className="mt-2 text-sm text-slate-600">
                                    Order early and collect from the counter easily.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-rose-100 p-6">
                                <h3 className="text-lg font-semibold text-slate-900">Hygienic Food</h3>
                                <p className="mt-2 text-sm text-slate-600">
                                    Clean preparation and student-safe service.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4 lg:px-8">
                    <SectionTitle
                        badge="Featured Items"
                        title="Popular Choices from the Canteen"
                        subtitle="A few student favourites from our daily menu."
                        center
                    />

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {featuredItems.map((item) => (
                            <FeaturedItemCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </section>

            <SpecialHighlight />
            <WhyChooseUs />
            <OpeningHours />
            <HomeCTA />
        </>
    );
}