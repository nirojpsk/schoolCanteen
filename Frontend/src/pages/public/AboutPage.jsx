import { Link } from "react-router-dom";
import SectionTitle from "../../components/common/SectionTitle";
import { siteConfig } from "../../constants/siteConfig";
import { useGetCategoriesQuery } from "../../services/categoryApiSlice";
import { useGetMenuItemsQuery } from "../../services/menuApiSlice";
import { useGetActiveSpecialsQuery } from "../../services/specialApiSlice";

const values = [
  {
    title: "Fresh daily service",
    description:
      "Menus are built around what is genuinely available each day, not a static poster that gets outdated by lunchtime.",
  },
  {
    title: "Student-first clarity",
    description:
      "A small-school canteen works best when students can spot the right meal quickly and order without stress.",
  },
  {
    title: "Staff-friendly control",
    description:
      "Categories, menu items, specials, and preorders stay manageable from one calm admin workspace.",
  },
  {
    title: "School-time fit",
    description:
      "The whole experience is shaped around short breaks, simple pickup flow, and reliable service windows.",
  },
];

const principles = [
  "Clear menu structure so younger students can choose faster.",
  "Simple preorder steps that respect real school break timing.",
  "Live specials and availability updates without redesign work.",
];

function AboutPage() {
  const { data: categoryResponse } = useGetCategoriesQuery();
  const { data: menuResponse } = useGetMenuItemsQuery({ available: true });
  const { data: specialsResponse } = useGetActiveSpecialsQuery();

  const stats = [
    { label: "Active categories", value: categoryResponse?.data?.length ?? 0 },
    { label: "Available items", value: menuResponse?.data?.length ?? 0 },
    { label: "Live specials", value: specialsResponse?.data?.length ?? 0 },
  ];

  return (
    <section className="page-section pt-10">
      <div className="content-shell">
        <div className="grid items-center gap-10 xl:grid-cols-[1.02fr_0.98fr]">
          <div>
            <SectionTitle
              badge="About The Canteen"
              title="A small-school canteen should feel calm, clear, and dependable"
              subtitle="This website is designed around real school-day rhythm: simple choices, faster ordering, and cleaner communication between students and staff."
            />

            <div className="mt-8 grid gap-4">
              {principles.map((item, index) => (
                <div key={item} className="soft-panel flex items-start gap-4 p-4">
                  <div className="mt-0.5 text-base font-extrabold text-emerald-800">
                    0{index + 1}
                  </div>
                  <p className="text-sm font-semibold leading-7 text-slate-700">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/menu" className="primary-button">
                Explore Menu
              </Link>
              <Link to="/preorder" className="secondary-button">
                Start Preorder
              </Link>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="soft-panel overflow-hidden p-4">
              <img
                src="/mechi.jpg"
                alt="Mechi School campus"
                className="h-[340px] w-full rounded-[28px] object-cover"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="soft-panel p-5">
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-4xl font-extrabold text-slate-950">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 overflow-hidden rounded-[38px] bg-[linear-gradient(135deg,#0b5a42_0%,#137552_100%)] px-6 py-8 text-white shadow-[0_30px_60px_rgba(7,49,36,0.2)] md:px-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#ffc629]">
                Why It Works
              </p>
              <h2 className="mt-4 text-4xl font-extrabold leading-tight">
                Better ordering is really better school flow.
              </h2>
            </div>
            <p className="text-base leading-8 text-emerald-50/78">
              {siteConfig.name} helps students spend less time deciding in a rush and helps staff run the canteen with clearer demand, cleaner updates, and fewer repeated questions at the counter.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {values.map((value, index) => (
            <div key={value.title} className="soft-panel p-6">
              <p className="subtle-kicker">0{index + 1}</p>
              <h3 className="mt-5 text-2xl font-extrabold text-slate-950">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutPage;
