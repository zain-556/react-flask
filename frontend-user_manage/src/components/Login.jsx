import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000";

 function Login({ onSwitch }) {
  const { login } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const submit = async () => {
    if (!email || !password) return setError("Both fields are required.");
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      login(res.data.token);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm w-full max-w-sm p-8">

        <div className="mb-7">
          <h1 className="text-xl font-bold text-slate-800">👤 User Manager</h1>
          <p className="text-slate-400 text-xs mt-1">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:outline-none focus:border-slate-400"
          />
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            onKeyDown={e => e.key === "Enter" && submit()}
            className="px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:outline-none focus:border-slate-400"
          />
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="mt-5 w-full py-2 bg-slate-800 text-white text-sm font-semibold rounded-md hover:bg-slate-700 transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="mt-5 text-right text-xs text-slate-400">
          <button
            onClick={() => onSwitch("forgot")}
            className="hover:text-slate-700 transition"
          >
            Forgot password?
          </button>
        </div>

      </div>
    </div>
  );
}
export default Login;