export default function LoadingBlock({
  label = "Loading...",
  className = "",
}) {
  return (
    <div
      className={`soft-panel overflow-hidden p-6 ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.2s]" />
          <span className="h-3 w-3 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.1s]" />
          <span className="h-3 w-3 animate-bounce rounded-full bg-amber-400" />
        </div>
        <span className="text-sm font-semibold text-slate-600">{label}</span>
      </div>
    </div>
  );
}
