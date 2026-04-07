export default function EmptyState({
  title,
  description,
  action,
  className = "",
}) {
  return (
    <div
      className={`soft-panel overflow-hidden p-8 text-center ${className}`}
    >
      <p className="subtle-kicker">Nothing here yet</p>
      <h3 className="mt-5 text-2xl font-extrabold text-slate-950">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
