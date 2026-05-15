function SpotlightCard({ user, onDismiss }) {
  
  if (!user) return null;

  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-bold uppercase tracking-widest text-blue-500">
          📋 Found User
        </h2>
        <button
          onClick={onDismiss}
          className="text-xs text-slate-400 hover:text-slate-700 transition"
        >
          Dismiss ✕
        </button>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-700">
        <span><span className="font-semibold">ID:</span> {user.id}</span>
        <span><span className="font-semibold">Name:</span> {user.name}</span>
        <span><span className="font-semibold">Email:</span> {user.email}</span>
      </div>
    </div>
  );
}
export default SpotlightCard;