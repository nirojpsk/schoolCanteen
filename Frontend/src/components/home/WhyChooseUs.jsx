const features = [
  {
    title: "Fresh Food",
    description: "Meals and snacks prepared with care for daily student needs.",
  },
  {
    title: "Affordable Pricing",
    description: "Student-friendly prices that keep food accessible and practical.",
  },
  {
    title: "Quick Service",
    description: "Fast serving system to reduce waiting during school breaks.",
  },
  {
    title: "Hygienic Preparation",
    description: "Clean handling and preparation focused on student safety.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
            Why Choose Us
          </span>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
            A Better Canteen Experience for Students
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg leading-8 text-slate-600">
            We focus on quality, affordability, speed, and a school-friendly food experience.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}