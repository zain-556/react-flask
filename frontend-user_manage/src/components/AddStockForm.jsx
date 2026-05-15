// AddStockForm.jsx
// Lets the user fill in stock details and optionally attach an image.
// Uses FormData (not JSON) so we can send a file along with the text fields.

import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function AddStockForm({ token, onAdd }) {

  // ── Form state (one object for all text fields) ───────────────────────────
  const [form, setForm] = useState({
    name:        "",
    category:    "",
    quantity:    "",
    price:       "",
    description: "",
  });

  const [image,   setImage]   = useState(null);  // the actual File object
  const [preview, setPreview] = useState(null);  // local URL just for showing thumbnail
  const [loading, setLoading] = useState(false);

  // ── Update any text field by its name attribute ───────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ── When user picks a file, store it and show a preview ──────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file)); // creates a temporary local URL
  };

  // ── Submit the form ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category) return;

    setLoading(true);

    // FormData lets us send text + file together in one request
    const fd = new FormData();
    fd.append("name",        form.name);
    fd.append("category",    form.category);
    fd.append("quantity",    form.quantity);
    fd.append("price",       form.price);
    fd.append("description", form.description);
    if (image) fd.append("image", image); // only attach if user picked one

    try {
      const res = await axios.post(`${API}/stocks`, fd, {
        headers: { Authorization: `Bearer ${token}` },
        // Don't set Content-Type here — axios handles multipart automatically
      });

      onAdd(res.data, null); // pass new stock up to parent

      // Clear the form after success
      setForm({ name: "", category: "", quantity: "", price: "", description: "" });
      setImage(null);
      setPreview(null);

    } catch (err) {
      onAdd(null, err.response?.data?.error || "Failed to add stock item");
    } finally {
      setLoading(false);
    }
  };

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 mb-5">

      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
        📦 Add Stock Item
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">

        {/* Row 1 – Name + Category */}
        <div className="grid grid-cols-2 gap-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product name *"
            required
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category *"
            required
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Row 2 – Quantity + Price */}
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
            placeholder="Unit price ($)"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          rows={2}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        {/* Image upload + thumbnail preview */}
        <div className="flex items-center gap-3">

          {/* Hidden file input triggered by the label */}
          <label className="cursor-pointer text-xs bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 px-3 py-2 rounded-lg transition">
            📎 Attach Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {/* Show thumbnail once image is picked */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="h-10 w-10 object-cover rounded-lg border border-slate-200"
            />
          )}

          {/* Show file name */}
          {image && (
            <span className="text-xs text-slate-400 truncate max-w-[160px]">
              {image.name}
            </span>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Adding…" : "Add Stock Item"}
        </button>

      </form>
    </div>
  );
}

export default AddStockForm;
