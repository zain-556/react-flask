// StockTable.jsx
// Shows all stock items in a table.
// Each row has: image · name · category · quantity badge · price · action buttons
// ✏️ = PATCH (partial edit)   🔄 = PUT (full edit)   🗑️ = delete

const API = "http://localhost:5000";

function StockTable({ stocks, onDelete, onEdit }) {

  // ── Empty state ───────────────────────────────────────────────────────────
  if (stocks.length === 0) {
    return (
      <p className="text-center text-slate-400 text-sm py-8">
        Out of Stock — add some items!
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">

        {/* Table header */}
        <thead>
          <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Qty</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        {/* Table rows */}
        <tbody className="divide-y divide-slate-100">
          {stocks.map((stock) => (
            <tr key={stock.id} className="hover:bg-slate-50 transition">

              {/* Image cell – shows uploaded image or a placeholder emoji */}
              <td className="px-4 py-3">
                {stock.image_url ? (
                  <img
                    src={`${API}${stock.image_url}`}
                    alt={stock.name}
                    className="h-10 w-10 object-cover rounded-lg border border-slate-200"
                  />
                ) : (
                  <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-lg">
                    📦
                  </div>
                )}
              </td>

              {/* Name */}
              <td className="px-4 py-3 font-medium text-slate-800">
                {stock.name}
              </td>

              {/* Category */}
              <td className="px-4 py-3 text-slate-500">
                {stock.category}
              </td>

              {/* Quantity – color badge based on stock level */}
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  stock.quantity === 0
                    ? "bg-red-100 text-red-600"       // out of stock
                    : stock.quantity < 10
                    ? "bg-yellow-100 text-yellow-700" // low stock
                    : "bg-green-100 text-green-700"   // normal
                }`}>
                  {stock.quantity}
                </span>
              </td>

              {/* Price */}
              <td className="px-4 py-3 text-slate-700">
                ${stock.price}
              </td>

              {/* Action buttons */}
              <td className="px-4 py-3">
                <div className="flex gap-1.5">


                  {/* PUT – full update (replace all fields) */}
                  <button
                    onClick={() => onEdit(stock, "put")}
                    title="EDIT"
                    className="text-xs px-2 py-1 border border-blue-200 text-blue-600 rounded hover:bg-blue-50 transition"
                  >
                    EDIT
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => onDelete(stock.id)}
                    title="Delete"
                    className="text-xs px-2 py-1 border border-red-200 text-red-500 rounded hover:bg-red-50 transition"
                  >
                    🗑️
                  </button>

                </div>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default StockTable;
