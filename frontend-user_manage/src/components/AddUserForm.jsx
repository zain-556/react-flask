import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function AddUserForm({ onAdd }) {
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const submit = async () => {
    if (!name || !email || !phone) {
      return onAdd(null, "Please fill in all fields.");
    }

    try {
      const res = await axios.post(`${API}/users`, { name, email, phone });
      setName("");
      setEmail("");
      setPhone("");
      onAdd(res.data);
    } catch (err) {
      onAdd(null, err.response?.data?.error || "Failed to add user.");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-sm">
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
        ➕ Add New User
      </h2>
      <div className="flex flex-wrap gap-3 items-end">

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          type="text"
          className="px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="zain@abc.com"
          type="email"
          className="px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50"
        />

        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="03001234567"
          type="tel"
          className="px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50"
        />

        <button
          onClick={submit}
          className="px-5 py-2 bg-slate-800 text-white text-sm font-semibold rounded-md hover:bg-slate-700 transition self-end"
        >
          Add User
        </button>

      </div>
    </div>
  );
}

export default AddUserForm;
