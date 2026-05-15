import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function GetIdBar({ onResult }) {

  const [id, setId] = useState("");

  const fetchUser = async () => {
    if (!id) return;

    try {
      const res = await axios.get(`${API}/users/${id}`);
      onResult(res.data);

    } catch (err) {
      onResult(null, `No user found with ID ${id}.`);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-sm">
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
        🔍 Get User by ID
      </h2>
      <div className="flex flex-wrap gap-3 items-end">

        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Enter user ID"
          type="e.g. 123"
          className="px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50"
        />

        <button
          onClick={fetchUser}
          className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-500 transition self-end"
        >
          Fetch
        </button>

      </div>
    </div>
  );
}
export default GetIdBar;