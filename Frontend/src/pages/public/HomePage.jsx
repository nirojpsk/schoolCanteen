import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SectionTitle from "../../components/common/SectionTitle";
import EmptyState from "../../components/common/EmptyState";
import LoadingBlock from "../../components/common/LoadingBlock";
import StatusBadge from "../../components/common/StatusBadge";
import FeaturedItemCard from "../../components/home/FeaturedItemCard";
import { siteConfig } from "../../constants/siteConfig";
import { useGetCategoriesQuery } from "../../services/categoryApiSlice";
import { useGetMenuItemsQuery } from "../../services/menuApiSlice";
import { useGetActiveSpecialsQuery } from "../../services/specialApiSlice";
import {
  formatCurrency,
  formatDateRange,
  getDiscountAmount,
  getDiscountPercent,
} from "../../utils/formatters";

const MotionDiv = motion.div;

const steps = [
  {
    title: "Browse the live menu",
    description: "Students see current dishes, pricing, and availability without needing to ask at the counter first.",
  },
  {
    title: "Preorder in under a minute",
    description: "Choose a pickup slot, confirm your details, and send the order straight into the kitchen workflow.",
  },
  {
    title: "Collect with less queue stress",
    description: "The handoff becomes simpler for students and much easier for the canteen team during busy break periods.",
  },
];

const valuePoints = [
  "Live menu availability from the backend",
  "Student-friendly ordering flow for short breaks",
  "Daily specials surfaced automatically",
];

export default function HomePage() {
  const { data: menuResponse, isLoading: isLoadingMenu } = useGetMenuItemsQuery({
    available: true,
  });
  const { data: categoryResponse } = useGetCategoriesQuery();
  const { data: specialResponse, isLoading: isLoadingSpecials } =
    useGetActiveSpecialsQuery();

  const availableItems = menuResponse?.data ?? [];
  const featuredItems = availableItems.filter((item) => item.isFeatured);
  const displayItems = featuredItems.length ? featuredItems : availableItems;
  const categories = categoryResponse?.data ?? [];
  const activeSpecials = specialResponse?.data ?? [];
  const heroSpecial = activeSpecials[0] ?? null;
  const heroItem = heroSpecial?.menuItem ?? displayItems[0] ?? null;
  const averagePrep = displayItems.length
    ? Math.round(
        displayItems.reduce(
          (total, item) => total + Number(item.preparationTime || 10),
          0
        ) / displayItems.length
      )
    : 15;
  const featuredCount = featuredItems.length;

  return (
    <>
      <section className="page-section pb-6 pt-10 md:pt-14">
        <div className="content-shell">
          <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
            <MotionDiv
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <div className="flex flex-wrap items-center gap-4">
                <img
                  src={siteConfig.logoPath}
                  alt={`${siteConfig.name} logo`}
                  className="h-16 w-16 rounded-[22px] border border-emerald-100 bg-white object-cover shadow-[0_18px_36px_rgba(15,23,42,0.08)]"
                />
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-emerald-700">
                    {siteConfig.name}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Smart school meal ordering and faster pickup flow.
                  </p>
                </div>
              </div>

              <span className="section-badge mt-6">Freshly prepared daily</span>
              <h1 className="mt-6 max-w-4xl text-5xl font-extrabold leading-[0.96] text-slate-950 md:text-6xl xl:text-[4.35rem]">
                A calmer, fresher school canteen experience for every break.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                {siteConfig.name} helps students browse lunch faster, notice live
                specials sooner, and preorder before the canteen gets busy.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {valuePoints.map((point) => (
                  <span key={point} className="public-chip">
                    {point}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/preorder" className="primary-button">
                  Preorder Today
                </Link>
                <Link to="/menu" className="secondary-button">
                  View Today&apos;s Menu
                </Link>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="metric-card">
                  <p className="subtle-kicker">Live Menu Items</p>
                  <p className="mt-3 text-4xl font-extrabold text-slate-950">
                    {availableItems.length}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Ready for students to browse and preorder.
                  </p>
                </div>
                <div className="metric-card">
                  <p className="subtle-kicker">Average Prep</p>
                  <p className="mt-3 text-4xl font-extrabold text-slate-950">
                    {averagePrep} min
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    A practical pace for short school breaks.
                  </p>
                </div>
                <div className="metric-card">
                  <p className="subtle-kicker">Live Specials</p>
                  <p className="mt-3 text-4xl font-extrabold text-slate-950">
                    {activeSpecials.length}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Updated directly from the admin workspace.
                  </p>
                </div>
              </div>
            </MotionDiv>

            <MotionDiv
              className="glass-panel overflow-hidden rounded-[40px] p-5 md:p-6"
              initial={{ opacity: 0, scale: 0.97, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
            >
              <div className="grid gap-5">
                <div className="relative overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,#d7c79c_0%,#efe7d6_100%)] p-4">
                  <div className="relative overflow-hidden rounded-[30px]">
                    <img
                      src={
                        heroSpecial?.bannerImage ||
                        heroItem?.image ||
                        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=80"
                      }
                      alt={heroSpecial?.title || heroItem?.name || "School canteen meal"}
                      className="h-[360px] w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/58 via-slate-950/8 to-transparent" />

                    <div className="absolute left-4 top-4">
                      <span className="section-badge bg-white/86 text-emerald-900">
                        {heroSpecial ? "Today&apos;s highlight" : "Student favourite"}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
                      <div className="max-w-md rounded-[24px] bg-white/90 px-4 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                        <p className="subtle-kicker">Currently Featured</p>
                        <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
                          {heroSpecial?.title || heroItem?.name || "Fresh campus meals"}
                        </h2>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          {heroSpecial?.description ||
                            heroItem?.description ||
                            "Live menu cards, specials, and student-friendly pickup flow all in one place."}
                        </p>
                      </div>

                      <div className="rounded-[24px] bg-[#063b2c]/92 px-5 py-4 text-white shadow-[0_18px_36px_rgba(7,49,36,0.24)]">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#ffc629]">
                          Lunch Window
                        </p>
                        <p className="mt-2 text-2xl font-extrabold">{siteConfig.hours.lunch}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
                  <div className="soft-panel p-5">
                    <p className="subtle-kicker">At A Glance</p>
                    <div className="mt-4 grid gap-3 text-sm text-slate-700">
                      <div className="rounded-[20px] bg-slate-50 px-4 py-3">
                        {categories.length} menu groups keep browsing simple.
                      </div>
                      <div className="rounded-[20px] bg-slate-50 px-4 py-3">
                        Average pickup-ready timing is around {averagePrep} minutes.
                      </div>
                      <div className="rounded-[20px] bg-slate-50 px-4 py-3">
                        {featuredCount} highlighted items are ready to surface first.
                      </div>
                    </div>
                  </div>

                  <div className="soft-panel p-5">
                    <p className="subtle-kicker">Why It Feels Better</p>
                    <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                      Designed for real school-day lunch flow
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Students get clarity before they queue. Staff get cleaner orders.
                      The whole canteen feels more organized when the digital layer is simple.
                    </p>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>
      </section>

      <section className="page-section py-6">
        <div className="content-shell">
          <div className="grid gap-6 lg:grid-cols-3">
            {steps.map((step, index) => {
              return (
                <div key={step.title} className="soft-panel p-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="subtle-kicker">Step 0{index + 1}</p>
                    <span className="text-3xl font-extrabold text-slate-200">
                      0{index + 1}
                    </span>
                  </div>
                  <h2 className="mt-6 text-2xl font-extrabold text-slate-950">
                    {step.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="page-section pt-6">
        <div className="content-shell">
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="overflow-hidden rounded-[38px] bg-[linear-gradient(135deg,#0a4d39_0%,#0e6a4b_100%)] text-white shadow-[0_30px_60px_rgba(7,49,36,0.22)]">
              <div className="grid gap-6 p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge value="Daily spotlight" tone="active" />
                  {heroSpecial ? (
                    <StatusBadge
                      value={`${getDiscountPercent(heroSpecial)}% saved`}
                      tone="featured"
                    />
                  ) : null}
                </div>

                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#ffc629]">
                    Today&apos;s Special
                  </p>
                  <h2 className="mt-4 text-4xl font-extrabold leading-tight">
                    {heroSpecial?.title || heroItem?.name || "Healthy lunch made simple"}
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-8 text-emerald-50/78">
                    {heroSpecial?.description ||
                      heroItem?.description ||
                      "The homepage spotlight is ready to surface a strong daily offer the moment the canteen team activates one."}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[26px] bg-white/10 p-5">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-emerald-50/54">
                      Offer Price
                    </p>
                    <p className="mt-3 text-3xl font-extrabold text-white">
                      {formatCurrency(heroSpecial?.specialPrice || heroItem?.price || 0)}
                    </p>
                  </div>
                  <div className="rounded-[26px] bg-white/10 p-5">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-emerald-50/54">
                      Student Savings
                    </p>
                    <p className="mt-3 text-3xl font-extrabold text-[#ffc629]">
                      {formatCurrency(getDiscountAmount(heroSpecial))}
                    </p>
                  </div>
                  <div className="rounded-[26px] bg-white/10 p-5">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-emerald-50/54">
                      Live Window
                    </p>
                    <p className="mt-3 text-lg font-extrabold text-white">
                      {heroSpecial
                        ? formatDateRange(heroSpecial.startDate, heroSpecial.endDate)
                        : siteConfig.hours.weekdays}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link to="/preorder" className="secondary-button border-white/12 bg-white text-emerald-950">
                    Add To Preorder
                  </Link>
                  <Link to="/specials" className="secondary-button border-white/16 bg-transparent text-white">
                    View All Specials
                  </Link>
                </div>
              </div>
            </div>

            <div className="glass-panel overflow-hidden rounded-[38px] p-5">
              {isLoadingSpecials ? (
                <LoadingBlock label="Loading today&apos;s special..." />
              ) : heroSpecial || heroItem ? (
                <div className="grid gap-5">
                  <img
                    src={
                      heroSpecial?.bannerImage ||
                      heroItem?.image ||
                      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=80"
                    }
                    alt={heroSpecial?.title || heroItem?.name || "Featured meal"}
                    className="h-[320px] w-full rounded-[30px] object-cover"
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="soft-panel p-5">
                      <p className="subtle-kicker">Menu Highlight</p>
                      <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                        {heroSpecial?.menuItem?.name || heroItem?.name || "Fresh pick"}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        Featured cards stay synchronized with the backend so pricing and visibility always stay current.
                      </p>
                    </div>
                    <div className="soft-panel p-5">
                      <p className="subtle-kicker">Best Use</p>
                      <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                        Short break ordering
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        Ideal for students who want lunch sorted before the counter gets crowded.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="No live special yet"
                  description="The homepage spotlight is ready to feature the first active special as soon as staff publish one."
                  action={
                    <Link to="/menu" className="secondary-button">
                      Browse Menu
                    </Link>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="page-section pt-8">
        <div className="content-shell">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <SectionTitle
              badge="Fresh From The Kitchen"
              title="Popular dishes pulled straight from the live menu"
              subtitle="These cards stay connected to the backend, so availability, pricing, and featured highlights remain current without manual homepage edits."
            />
            <Link to="/menu" className="secondary-button">
              Explore Full Menu
            </Link>
          </div>

          {isLoadingMenu ? (
            <LoadingBlock label="Loading menu items..." />
          ) : displayItems.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {displayItems.slice(0, 6).map((item) => (
                <FeaturedItemCard key={item._id} item={item} compact />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No live menu items yet"
              description="As soon as the admin publishes menu items, the public homepage will start showing them here."
            />
          )}
        </div>
      </section>

      <section className="page-section pt-8">
        <div className="bg-[#07533c] py-14 text-white">
          <div className="content-shell">
            <div className="grid gap-8 xl:grid-cols-[1fr_0.9fr] xl:items-center">
              <div>
                <span className="section-badge bg-white/10 text-emerald-50">
                  How Preordering Works
                </span>
                <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.04] text-white md:text-5xl">
                  A simple canteen flow built for short school breaks
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-emerald-50/76 md:text-[1.05rem]">
                  The experience stays quick for students and practical for staff,
                  with each preorder moving straight into the admin operations panel.
                </p>

                <div className="mt-10 grid gap-5 md:grid-cols-3">
                  {steps.map((step, index) => {
                    return (
                      <div
                        key={step.title}
                        className="rounded-[32px] border border-white/10 bg-white/6 p-6"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-sm font-extrabold text-[#ffc629]">
                          0{index + 1}
                        </div>
                        <p className="mt-5 text-sm font-extrabold uppercase tracking-[0.18em] text-emerald-100/46">
                          Step 0{index + 1}
                        </p>
                        <h3 className="mt-3 text-2xl font-extrabold text-white">{step.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-emerald-50/76">
                          {step.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[36px] border border-white/10 bg-white/8 p-6 shadow-[0_30px_60px_rgba(7,49,36,0.18)] md:p-8">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#ffc629]">
                  Service Snapshot
                </p>
                <h2 className="mt-4 text-4xl font-extrabold text-white">
                  Ready for real lunch-hour traffic
                </h2>
                <p className="mt-4 text-sm leading-8 text-emerald-50/78">
                  The public ordering flow is shaped to reduce queue pressure while keeping the canteen team in control of menu content, specials, and live availability.
                </p>

                <div className="mt-6 grid gap-4">
                  <div className="rounded-[26px] bg-white/8 p-5">
                    <p className="subtle-kicker text-emerald-100/46">Student Benefit</p>
                    <p className="mt-2 text-lg font-extrabold text-white">
                      Less waiting, clearer choices, faster pickup.
                    </p>
                  </div>
                  <div className="rounded-[26px] bg-white/8 p-5">
                    <p className="subtle-kicker text-emerald-100/46">Staff Benefit</p>
                    <p className="mt-2 text-lg font-extrabold text-white">
                      More structured demand and better order visibility.
                    </p>
                  </div>
                </div>

                <Link
                  to="/preorder"
                  className="secondary-button mt-6 border-white/12 bg-white text-emerald-950"
                >
                  Start A Preorder
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section pt-8">
        <div className="content-shell">
          <SectionTitle
            badge="Flash Specials"
            title="Live offers that help students spot extra value quickly"
            subtitle="When the canteen team activates a promotion, it appears here automatically with the connected menu item and discount."
          />

          <div className="mt-10">
            {isLoadingSpecials ? (
              <LoadingBlock label="Loading active offers..." />
            ) : activeSpecials.length ? (
              <div className="grid gap-4">
                {activeSpecials.slice(0, 3).map((special) => (
                  <div
                    key={special._id}
                    className="glass-panel flex flex-col gap-5 rounded-[32px] p-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={special.menuItem?.image || special.bannerImage}
                        alt={special.title}
                        className="h-16 w-16 rounded-[20px] object-cover"
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge value="Active" tone="active" />
                          <StatusBadge
                            value={`${getDiscountPercent(special)}% saved`}
                            tone="featured"
                          />
                        </div>
                        <h3 className="mt-2 text-xl font-extrabold text-slate-950">
                          {special.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">{special.menuItem?.name}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <p className="text-lg font-extrabold text-slate-950">
                        {formatCurrency(special.specialPrice)}
                      </p>
                      <Link to="/preorder" className="primary-button px-5 py-3 text-sm">
                        Order Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No flash specials right now"
                description="The section is ready for the next promotion as soon as staff activate it from the admin workspace."
              />
            )}
          </div>
        </div>
      </section>

      <section className="page-section pt-6">
        <div className="content-shell">
          <div className="overflow-hidden rounded-[38px] bg-[linear-gradient(135deg,#0b5a42_0%,#116d4d_100%)] px-6 py-9 text-white shadow-[0_30px_60px_rgba(7,49,36,0.24)] md:px-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#ffc629]">
                  Hungry For Something Fresh?
                </p>
                <h2 className="mt-4 text-4xl font-extrabold leading-tight">
                  Explore today&apos;s menu and reserve lunch before the queue builds.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-emerald-50/78">
                  Browse the menu, check the current specials, and submit a preorder
                  in a few calm steps that actually fit the school day.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/menu" className="secondary-button border-white/12 bg-white text-emerald-950">
                  View Today&apos;s Menu
                </Link>
                <Link to="/preorder" className="secondary-button border-white/20 bg-transparent text-white">
                  Start Preorder
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
