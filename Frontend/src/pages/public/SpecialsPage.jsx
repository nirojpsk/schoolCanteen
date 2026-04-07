import { Link } from "react-router-dom";
import SectionTitle from "../../components/common/SectionTitle";
import EmptyState from "../../components/common/EmptyState";
import LoadingBlock from "../../components/common/LoadingBlock";
import StatusBadge from "../../components/common/StatusBadge";
import { useGetSpecialsQuery } from "../../services/specialApiSlice";
import {
  formatCurrency,
  formatDateRange,
  getDiscountAmount,
  getDiscountPercent,
  isSpecialRunning,
} from "../../utils/formatters";

function SpecialsPage() {
  const { data, isLoading, isError } = useGetSpecialsQuery();
  const specials = data?.data ?? [];

  const activeSpecials = specials.filter((special) => isSpecialRunning(special));
  const upcomingSpecials = specials.filter((special) => {
    const start = new Date(special.startDate);
    return Boolean(special.isActive) && start > new Date();
  });
  const featuredSpecial = activeSpecials[0] ?? specials[0] ?? null;

  return (
    <section className="page-section pt-10">
      <div className="content-shell">
        <SectionTitle
          badge="Live Specials"
          title="Fresh offers that feel worth noticing"
          subtitle="Each special is tied to a real menu item, so pricing, dates, and availability stay connected to the backend instead of drifting out of date."
        />

        {isLoading ? (
          <div className="mt-10">
            <LoadingBlock label="Loading specials..." />
          </div>
        ) : isError ? (
          <div className="mt-10">
            <EmptyState
              title="Specials could not be loaded"
              description="Please check the backend server or try again in a moment."
            />
          </div>
        ) : specials.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="No specials have been published yet"
              description="Once a special is added from the admin panel, it will automatically appear here with its dates and pricing."
              action={
                <Link to="/menu" className="secondary-button">
                  Browse Menu
                </Link>
              }
            />
          </div>
        ) : (
          <>
            {featuredSpecial ? (
              <div className="mt-10 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
                <div className="overflow-hidden rounded-[38px] bg-[linear-gradient(135deg,#0b5a42_0%,#147954_100%)] text-white shadow-[0_30px_60px_rgba(7,49,36,0.2)]">
                  <div className="grid gap-6 p-6 md:grid-cols-[1.05fr_0.95fr] md:p-8">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge
                          value={isSpecialRunning(featuredSpecial) ? "Active now" : "Scheduled"}
                          tone={isSpecialRunning(featuredSpecial) ? "active" : "featured"}
                        />
                        <StatusBadge
                          value={`${getDiscountPercent(featuredSpecial)}% saved`}
                          tone="featured"
                        />
                      </div>
                      <h2 className="mt-5 text-4xl font-extrabold leading-tight">
                        {featuredSpecial.title}
                      </h2>
                      <p className="mt-4 text-sm leading-7 text-emerald-50/78">
                        {featuredSpecial.description}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-emerald-50/82">
                        <span>{featuredSpecial.menuItem?.name}</span>
                        <span>{formatDateRange(featuredSpecial.startDate, featuredSpecial.endDate)}</span>
                      </div>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                          to="/preorder"
                          className="secondary-button border-white/10 bg-white text-emerald-950"
                        >
                          Add To Preorder
                        </Link>
                        <Link
                          to="/menu"
                          className="secondary-button border-white/20 bg-transparent text-white"
                        >
                          Explore Menu
                        </Link>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-[28px] bg-white/10">
                      <img
                        src={featuredSpecial.bannerImage}
                        alt={featuredSpecial.title}
                        className="h-full min-h-[280px] w-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="soft-panel p-6">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                    Special Snapshot
                  </p>
                  <div className="mt-5 grid gap-4">
                    <div className="admin-muted-panel p-5">
                      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                        Offer Price
                      </p>
                      <p className="mt-3 text-3xl font-extrabold text-slate-950">
                        {formatCurrency(featuredSpecial.specialPrice)}
                      </p>
                    </div>
                    <div className="admin-muted-panel p-5">
                      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                        Student Savings
                      </p>
                      <p className="mt-3 text-3xl font-extrabold text-emerald-900">
                        {formatCurrency(getDiscountAmount(featuredSpecial))}
                      </p>
                    </div>
                    <div className="admin-muted-panel p-5">
                      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                        Promotion Window
                      </p>
                      <p className="mt-3 text-lg font-extrabold text-slate-950">
                        {formatDateRange(featuredSpecial.startDate, featuredSpecial.endDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-16">
              <SectionTitle
                badge="Offer Calendar"
                title={
                  upcomingSpecials.length
                    ? "Current and upcoming promotions"
                    : "All published specials"
                }
                subtitle="The canteen can communicate what is live, what is upcoming, and what has already run without needing a redesign each time."
              />

              <div className="mt-10 grid gap-5">
                {specials.map((special) => {
                  const start = new Date(special.startDate);
                  const isUpcoming = Boolean(special.isActive) && start > new Date();
                  const isLive = isSpecialRunning(special);
                  const tone = isLive ? "active" : isUpcoming ? "featured" : "inactive";
                  const label = isLive ? "Active" : isUpcoming ? "Upcoming" : "Ended";

                  return (
                    <div
                      key={special._id}
                      className="soft-panel grid gap-5 p-5 md:grid-cols-[220px_1fr]"
                    >
                      <img
                        src={special.bannerImage}
                        alt={special.title}
                        className="h-44 w-full rounded-[24px] object-cover"
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge value={label} tone={tone} />
                          <StatusBadge value={special.menuItem?.category?.name || "Menu"} />
                        </div>
                        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h3 className="text-2xl font-extrabold text-slate-950">
                              {special.title}
                            </h3>
                            <p className="mt-3 text-sm leading-7 text-slate-600">
                              {special.description}
                            </p>
                          </div>
                          <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-extrabold text-emerald-900">
                            {formatCurrency(special.specialPrice)}
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-slate-500">
                          <span>{special.menuItem?.name}</span>
                          <span>Save {formatCurrency(getDiscountAmount(special))}</span>
                          <span>{formatDateRange(special.startDate, special.endDate)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default SpecialsPage;
