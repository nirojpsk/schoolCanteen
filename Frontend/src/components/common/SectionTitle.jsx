function SectionTitle({ badge, title, subtitle, center = false }) {
    return (
        <div className={center ? "text-center" : "text-left"}>
            {badge && (
                <span className="section-badge">
                    {badge}
                </span>
            )}
            <h2 className="mt-5 text-4xl font-extrabold leading-[1.04] text-slate-950 md:text-5xl">
                {title}
            </h2>

            {subtitle && (
                <p
                    className={`mt-4 text-base leading-8 text-slate-600 md:text-[1.05rem] ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
                >
                    {subtitle}
                </p>
            )}
        </div>
    )
}

export default SectionTitle;
