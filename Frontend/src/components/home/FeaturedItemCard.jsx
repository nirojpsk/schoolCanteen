import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
import { formatCurrency } from "../../utils/formatters";

export default function FeaturedItemCard({ item, compact = false }) {
  const categoryLabel =
    typeof item?.category === "string"
      ? item.category
      : item?.category?.name || "Menu item";
  const fallbackImage =
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80";

  return (
    <article className="glass-panel group flex h-full flex-col overflow-hidden rounded-[32px] p-4">
      <div className={`relative overflow-hidden rounded-[28px] bg-[#dbe4d8] ${compact ? "h-56" : "h-64"}`}>
        <img
          src={item.image || fallbackImage}
          alt={item.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />

        <div className="absolute left-3 right-3 top-3 flex flex-wrap items-center gap-2">
          <StatusBadge value={categoryLabel} />
          <StatusBadge
            value={item.isVeg ? "Veg" : "Non-Veg"}
            tone={item.isVeg ? "veg" : "non-veg"}
          />
          {item.isFeatured ? <StatusBadge value="Featured" tone="featured" /> : null}
        </div>

        <div className="absolute bottom-3 right-3 rounded-full bg-white/92 px-4 py-2 text-sm font-extrabold text-emerald-950 shadow-[0_14px_28px_rgba(15,23,42,0.14)]">
          {formatCurrency(item.price)}
        </div>

        {!item.isAvailable ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/58">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-extrabold text-slate-950">
              Sold Out
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
        <div className="flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className={`${compact ? "text-[1.55rem]" : "text-3xl"} font-extrabold text-slate-950`}>
                {item.name}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
                {item.description}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-[#eef8f1] px-4 py-2 text-sm font-extrabold text-emerald-900">
              Freshly prepared
            </span>
            <span className="font-semibold text-slate-500">
              {item.preparationTime || 10} mins prep
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
              Kitchen Ready
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              Best for short break pickup
            </p>
          </div>

          {item.isAvailable ? (
            <Link to="/preorder" className="primary-button px-5 py-3 text-sm">
              Add To Order
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="secondary-button cursor-not-allowed px-5 py-3 text-sm opacity-70"
            >
              Not Available
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
