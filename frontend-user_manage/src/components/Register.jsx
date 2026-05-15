import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000";

function Register({ onClose }) {

  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {

    if (!name || !email || !password) {
      return setError("All fields are required.");
    }

    setError("");
    setLoading(true);

    try {

      await axios.post(`${API}/auth/register`, {
        name,
        email,
        password,
      });

      const res = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });

      login(res.data.token);

      if (onClose) onClose();

    } catch (err) {

      setError(
        err.response?.data?.error || "Registration failed."
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm w-full max-w-sm p-8">

      <div className="mb-7">
        <h1 className="text-xl font-bold text-slate-800">
          👤 Create Admin
        </h1>

        <p className="text-slate-400 text-xs mt-1">
          Create a new admin account
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3">

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:outline-none focus:border-slate-400"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:outline-none focus:border-slate-400"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:outline-none focus:border-slate-400"
        />

      </div>

      <button
        onClick={submit}
        disabled={loading}
        className="mt-5 w-full py-2 bg-slate-800 text-white text-sm font-semibold rounded-md hover:bg-slate-700 transition disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Admin"}
      </button>

      <button
        onClick={onClose}
        className="mt-3 w-full py-2 border border-slate-200 text-slate-600 text-sm rounded-md hover:bg-slate-50 transition"
      >
        Close
      </button>

    </div>
  );
}

export default Register;