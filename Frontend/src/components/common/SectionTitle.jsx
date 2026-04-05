function SectionTitle({ badge, title, subtitle, center = false }) {
    return (
        <div className={center ? "text-center" : "text-left"}>
            {badge && (
                <span className="inline-block rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
                    {badge}
                </span>
            )}
            <h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">
                {title}
            </h2>

            {subtitle && (
                <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
                    {subtitle}
                </p>
            )}
        </div>
    )
}

export default SectionTitle;