import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function EditModal({ user, onClose, onSave }) {

  const [form, setForm] = useState({
    name:  user.name,
    email: user.email,
    phone: user.phone,
  });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const save = async () => {
    try {
      const res = await axios.put(`${API}/users/${user.id}`, form);
      onSave(res.data);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        <h2 className="text-base font-bold text-slate-800 mb-4">
          ✏️ Edit User
          <span className="ml-2 text-slate-400 font-normal text-sm">
            — User #{user.id}
          </span>
        </h2>

        <div className="flex flex-col gap-3">

          <input
            value={form.name}
            onChange={set("name")}
            placeholder="Name"
            className="px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50"
          />

          <input
            value={form.email}
            onChange={set("email")}
            placeholder="Email"
            type="email"
            className="px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50"
          />

          <input
            value={form.phone}
            onChange={set("phone")}
            placeholder="03001234567"
            type="tel"
            className="px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50"
          />

        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-5 py-2 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-400 rounded-md transition"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}

export default EditModal;