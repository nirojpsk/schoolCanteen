import SectionTitle from "../../components/common/SectionTitle";

const values = [
    {
        title: "Fresh Meals",
        description:
            "We serve food prepared with care to support students during the school day.",
    },
    {
        title: "Hygienic Service",
        description:
            "Clean food handling and preparation are important parts of our canteen service.",
    },
    {
        title: "Affordable Pricing",
        description:
            "Our menu is designed to stay practical and student-friendly.",
    },
    {
        title: "Quick Support",
        description:
            "Fast service helps students enjoy meals during short school breaks.",
    },
];

function AboutPage() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
            <SectionTitle
                badge="About Us"
                title="A friendly and Reliable School Canteen"
                subtitle="Our canteen is committed to serving fresh, hygenic, tasty and affordable food in a student-friendly school environment."
            />
            <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
                <div className="overflow-hidden rounded-3xl shadow-lg">
                    <img
                        src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80"
                        alt="School Canteen"
                        className="h-full w-full object-cover"
                    />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                        Food That Fits Student Life
                    </h3>
                    <p className="mt-4 text-lg leading-8 text-slate-600">
                        The goal of our canteen is to provide meals and snacks that are fresh, affordable, and suitable for students during school hours. We focus on maintaining a clean environment and a smooth service experience.
                    </p>
                    <p className="mt-4 leading-8 text-slate-600">
                        Whether it is a quick snack, a lunch plate, or a daily special, our canteen aims to make school meals easier and more enjoyable.
                    </p>
                </div>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {values.map((value) => (
                    <div key={value.title}
                    className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                        <h3 className="text-xl font-semibold text-slate-900">
                            {value.title}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            {value.description}
                        </p>
                    </div>

                ))}
            </div>
        </section>
    );
}

export default AboutPage;