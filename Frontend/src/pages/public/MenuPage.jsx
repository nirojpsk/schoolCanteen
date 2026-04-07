import { useDeferredValue, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HiSearch } from "react-icons/hi";
import EmptyState from "../../components/common/EmptyState";
import LoadingBlock from "../../components/common/LoadingBlock";
import FeaturedItemCard from "../../components/home/FeaturedItemCard";
import { useGetCategoriesQuery } from "../../services/categoryApiSlice";
import { useGetMenuItemsQuery } from "../../services/menuApiSlice";

const availabilityFilters = [
  { label: "All Items", value: "all" },
  { label: "Available", value: "true" },
  { label: "Sold Out", value: "false" },
];

const dietOptions = [
  { label: "All", value: "all" },
  { label: "Veg", value: "veg" },
  { label: "Non-Veg", value: "non-veg" },
];

export default function MenuPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("true");
  const [diet, setDiet] = useState("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const deferredSearch = useDeferredValue(search.trim());
  const queryParams = useMemo(() => {
    const params = {};

    if (deferredSearch) params.search = deferredSearch;
    if (category) params.category = category;
    if (availability !== "all") params.available = availability;
    if (featuredOnly) params.featured = true;

    return params;
  }, [availability, category, deferredSearch, featuredOnly]);

  const { data: categoryResponse } = useGetCategoriesQuery();
  const { data: allItemsResponse } = useGetMenuItemsQuery();
  const {
    data: menuResponse,
    isLoading,
    isFetching,
    isError,
  } = useGetMenuItemsQuery(queryParams);

  const categories = categoryResponse?.data ?? [];
  const allItems = useMemo(() => allItemsResponse?.data ?? [], [allItemsResponse]);
  const rawItems = menuResponse?.data ?? [];
  const menuItems =
    diet === "all"
      ? rawItems
      : rawItems.filter((item) => (diet === "veg" ? item.isVeg : !item.isVeg));

  const categoryCounts = useMemo(
    () =>
      allItems.reduce((counts, item) => {
        const slug =
          typeof item.category === "string" ? item.category : item.category?.slug;

        if (slug) {
          counts[slug] = (counts[slug] || 0) + 1;
        }

        return counts;
      }, {}),
    [allItems]
  );

  const availableCount = allItems.filter((item) => item.isAvailable).length;
  const featuredCount = allItems.filter((item) => item.isFeatured).length;
  const averagePrep = allItems.length
    ? Math.round(
        allItems.reduce(
          (total, item) => total + Number(item.preparationTime || 10),
          0
        ) / allItems.length
      )
    : 0;

  const activeChips = [
    search ? `Search: ${search}` : null,
    category
      ? `Category: ${categories.find((item) => item.slug === category)?.name || category}`
      : null,
    availability !== "all"
      ? availability === "true"
        ? "Available only"
        : "Sold out only"
      : null,
    diet !== "all" ? `Diet: ${diet === "veg" ? "Veg" : "Non-Veg"}` : null,
    featuredOnly ? "Featured only" : null,
  ].filter(Boolean);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setAvailability("true");
    setDiet("all");
    setFeaturedOnly(false);
  };

  return (
    <section className="page-section pt-10">
      <div className="content-shell">
        <div className="glass-panel overflow-hidden rounded-[40px] p-6 md:p-8">
          <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
            <div>
              <span className="section-badge">Freshly prepared daily</span>
              <h1 className="mt-6 max-w-3xl text-5xl font-extrabold leading-[0.96] text-slate-950 md:text-6xl">
                Browse a menu that feels clear, current, and easy to trust.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Search favourite dishes, scan categories quickly, and move from
                discovery to preorder without getting lost in clutter.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <span className="public-chip">Live availability</span>
                <span className="public-chip">Avg. prep {averagePrep || 0} min</span>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/preorder" className="primary-button">
                  Start Preorder
                </Link>
                <button type="button" onClick={clearFilters} className="secondary-button">
                  Reset Filters
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <div className="metric-card">
                <p className="subtle-kicker">Total Dishes</p>
                <p className="mt-3 text-4xl font-extrabold text-slate-950">{allItems.length}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Pulled directly from the live backend menu.
                </p>
              </div>
              <div className="metric-card">
                <p className="subtle-kicker">Available Now</p>
                <p className="mt-3 text-4xl font-extrabold text-slate-950">{availableCount}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Ready for students to order today.
                </p>
              </div>
              <div className="metric-card">
                <p className="subtle-kicker">Featured Picks</p>
                <p className="mt-3 text-4xl font-extrabold text-slate-950">{featuredCount}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Highlighted dishes worth noticing first.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="glass-panel h-fit rounded-[36px] p-5 md:sticky md:top-28 md:p-6">
            <div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="subtle-kicker">Categories</p>
                  <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
                    Explore the menu
                  </h2>
                </div>
                <button type="button" onClick={clearFilters} className="ghost-button px-0 text-sm">
                  Clear
                </button>
              </div>

              <div className="mt-5 grid gap-2">
                <button
                  type="button"
                  onClick={() => setCategory("")}
                  className={`flex items-center justify-between rounded-[22px] px-4 py-3 text-sm font-extrabold transition ${
                    !category
                      ? "bg-emerald-100 text-emerald-900"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>All Items</span>
                  <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-500">
                    {allItems.length}
                  </span>
                </button>

                {categories.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => setCategory(item.slug)}
                    className={`flex items-center justify-between rounded-[22px] px-4 py-3 text-sm font-extrabold transition ${
                      category === item.slug
                        ? "bg-emerald-100 text-emerald-900"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-500">
                      {categoryCounts[item.slug] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[30px] bg-[#eef4ff] p-5">
              <p className="subtle-kicker">Dietary preference</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {dietOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDiet(option.value)}
                    className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
                      diet === option.value
                        ? "bg-emerald-900 text-white"
                        : "bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[30px] bg-[#fff1d4] p-5">
              <p className="subtle-kicker">Quick shortcut</p>
              <h3 className="mt-3 text-2xl font-extrabold text-slate-950">
                Need faster picks?
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Use featured-only mode to surface the dishes the canteen team wants students to notice first.
              </p>
              <button
                type="button"
                onClick={() => setFeaturedOnly((previous) => !previous)}
                className="secondary-button mt-4 w-full justify-center text-sm"
              >
                {featuredOnly ? "Showing Featured Picks" : "Show Featured Picks"}
              </button>
            </div>
          </aside>

          <div>
            <div className="glass-panel rounded-[36px] p-5 md:p-6">
              <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-center">
                <label className="relative block">
                  <HiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search for your favourite dish..."
                    className="field-input pl-11"
                  />
                </label>

                <div className="flex flex-wrap gap-2">
                  {availabilityFilters.map((filter) => (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => setAvailability(filter.value)}
                      className={`rounded-full px-4 py-3 text-sm font-extrabold transition ${
                        availability === filter.value
                          ? "bg-emerald-900 text-white"
                          : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {activeChips.length ? (
                    activeChips.map((chip) => (
                      <span key={chip} className="public-chip px-4 py-2 text-sm">
                        {chip}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm font-semibold text-slate-500">
                      No extra filters applied.
                    </span>
                  )}
                </div>

                <p className="text-sm font-semibold text-slate-500">
                  {isFetching ? "Refreshing menu..." : `${menuItems.length} dishes found`}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[26px] bg-[#f7faf8] px-4 py-4">
                <label className="inline-flex items-center gap-3 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(event) => setFeaturedOnly(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Show only featured items
                </label>

                <Link to="/preorder" className="secondary-button px-4 py-3 text-sm">
                  Go To Preorder
                </Link>
              </div>
            </div>

            <div className="mt-8">
              {isLoading ? (
                <LoadingBlock label="Loading menu items..." />
              ) : isError ? (
                <EmptyState
                  title="Menu could not be loaded"
                  description="Please check the backend connection and try again."
                />
              ) : menuItems.length ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {menuItems.map((item) => (
                    <FeaturedItemCard key={item._id} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No menu items match these filters"
                  description="Try clearing the search or switching the category, availability, and diet filters to reveal more dishes."
                  action={
                    <button type="button" onClick={clearFilters} className="secondary-button">
                      Clear Filters
                    </button>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
