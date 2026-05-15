import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function AddUserForm({ onAdd }) {

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [phone, setphone] = useState("");

    const submit = async () => {
    if (!name || !email || !phone) {
      return onAdd(null, "Kindly fill all fields.");
    }

    try {
      const res = await axios.post(`${API}/users`, {
        name,
        email,
        phone
      });

      const user = res.data;

      setName("");
      setEmail("");
      setphone("");

      onAdd(user);

    }
    catch (err) {
      onAdd(null, "Failed to add user.");
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
          onChange={event => setName(event.target.value)} 
          placeholder="ZAIN"
          className="px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50"
        />

        <input
          value={email}
          onChange={event => setEmail(event.target.value)}
          placeholder="zain@abc.com"
          type="email"
          className="px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50"
        />

        <input
          value={phone}
          onChange={event => setphone(event.target.value)}
          placeholder="03001234567"
          type="phone"
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