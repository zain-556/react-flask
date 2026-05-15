import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function ForgotPassword({ onSwitch }) {
  const [email,      setEmail]      = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [step,       setStep]       = useState(1); // 1 = email, 2 = reset
  const [msg,        setMsg]        = useState("");
  const [error,      setError]      = useState("");
  const [loading,    setLoading]    = useState(false);

  const sendForgot = async () => {
    if (!email) return setError("Email is required.");
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/auth/forgot-password`, { email });
      setResetToken(res.data.reset_token);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  const sendReset = async () => {
    if (!newPw) return setError("New password is required.");
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API}/auth/reset-password`, {
        reset_token: resetToken,
        new_password: newPw,
      });
      setMsg("Password reset! You can now sign in.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm w-full max-w-sm p-8">

        <div className="mb-7">
          <h1 className="text-xl font-bold text-slate-800">👤 User Manager</h1>
          <p className="text-slate-400 text-xs mt-1">
            {step === 1 && "Reset your password"}
            {step === 2 && "Enter your new password"}
            {step === 3 && "All done!"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
            {error}
          </div>
        )}

        {step === 1 && (
          <>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email"
              type="email"
              onKeyDown={e => e.key === "Enter" && sendForgot()}
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:outline-none focus:border-slate-400"
            />
            <button
              onClick={sendForgot}
              disabled={loading}
              className="mt-4 w-full py-2 bg-slate-800 text-white text-sm font-semibold rounded-md hover:bg-slate-700 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Get Reset Token"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-500 mb-3 break-all">
              Token: <span className="font-mono text-slate-700">{resetToken}</span>
            </div>
            <input
              value={newPw}
              onChange={e => setNewPw(e.target.value)}
              placeholder="New password"
              type="password"
              onKeyDown={e => e.key === "Enter" && sendReset()}
              className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 focus:outline-none focus:border-slate-400"
            />
            <button
              onClick={sendReset}
              disabled={loading}
              className="mt-4 w-full py-2 bg-slate-800 text-white text-sm font-semibold rounded-md hover:bg-slate-700 transition disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        {step === 3 && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3">
            {msg}
          </div>
        )}

        <div className="mt-5 text-center text-xs text-slate-400">
          <button onClick={() => onSwitch("login")} className="hover:text-slate-700 transition">
            ← Back to Sign In
          </button>
        </div>

      </div>
    </div>
  );
}
export default ForgotPassword;