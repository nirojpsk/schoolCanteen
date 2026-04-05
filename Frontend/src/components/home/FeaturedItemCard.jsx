function FeaturedCardItem({ item }) {
    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover: -translate-y-1 hover:shadow-lg">
            <div className="h-44 bg-slate-200">
                <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-900">
                        {item.name}
                    </h3>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                        Rs. {item.price}
                    </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {item.category}
                    </span>
                    {item.isVeg ? (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                            Veg
                        </span>
                    ) : (
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                            Non-Veg
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FeaturedCardItem;