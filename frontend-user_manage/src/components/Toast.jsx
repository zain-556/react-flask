function Toast({ msg, type, onClear }) {
  if (!msg) return null;

  const base = "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium mb-4 border";
  const colors =
    type === "error"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

  return (
    <div className={`${base} ${colors}`}>
      <span>{msg}</span>
      <button onClick={onClear} className="ml-4 opacity-60 hover:opacity-100 text-lg leading-none">
        ✕
      </button>
    </div>
  );
}

export default Toast;