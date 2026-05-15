// StockEditModal.jsx
// A popup modal to edit a stock item.
// mode = "put"   → full update  (all fields sent)
// mode = "patch" → partial update (only filled fields sent)

import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function StockEditModal({ stock, mode, token, onClose, onSave }) {

  // ── Pre-fill form with the stock item's current values ────────────────────
  const [form, setForm] = useState({
    name:        stock.name        || "",
    category:    stock.category    || "",
    quantity:    stock.quantity    || "",
    price:       stock.price       || "",
    description: stock.description || "",
  });

  // For showing the current or new image
  const [image,   setImage]   = useState(null);
  const [preview, setPreview] = useState(
    stock.image_url ? `${API}${stock.image_url}` : null
  );

  const [loading, setLoading] = useState(false);

  // ── Update a text field ───────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ── When user picks a replacement image ──────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ── Submit edit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Use FormData so we can include an image if the user changed it
    const fd = new FormData();
    fd.append("name",        form.name);
    fd.append("category",    form.category);
    fd.append("quantity",    form.quantity);
    fd.append("price",       form.price);
    fd.append("description", form.description);
    if (image) fd.append("image", image);

    // Choose PUT or PATCH based on the mode prop
    const method = mode === "put" ? "put" : "patch";

    try {
      const res = await axios[method](`${API}/stocks/${stock.id}`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSave(res.data); // pass updated stock back to parent
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    // Dark backdrop
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-700">
            {mode === "put" ? "🔄 Full Edit (PUT)" : "✏️ Partial Edit (PATCH)"}
            <span className="ml-2 text-slate-400 font-normal text-xs">
              #{stock.id} — {stock.name}
            </span>
          </h3>
          {/* Close button */}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Modal form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3">

          {/* Name + Category */}
          <div className="grid grid-cols-2 gap-3">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product name"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Quantity + Price */}
          <div className="grid grid-cols-2 gap-3">
            <input
              name="quantity"
              type="number"
              min="0"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleChange}
              placeholder="Price ($)"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Description */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={2}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          {/* Image replacement */}
          <div className="flex items-center gap-3">
            <label className="cursor-pointer text-xs bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 px-3 py-2 rounded-lg transition">
              📎 Replace Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Show current or new image preview */}
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="h-10 w-10 object-cover rounded-lg border border-slate-200"
              />
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-sm border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default StockEditModal;
