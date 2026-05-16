import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// ── Helper: decode JWT payload without verifying signature ───────────────────
// We only use this to read the `exp` claim on the client side.
// The server still validates the signature on every request.
function getTokenExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ?? null;   // Unix timestamp in seconds
  } catch {
    return null;
  }
}

// FIX: check whether a stored token is still valid before trusting it.
//      Previously an expired token kept the user "logged in" until the first
//      API call returned 401 — which could leave the UI in a broken state.
function loadValidToken() {
  const t = localStorage.getItem("token");
  if (!t) return null;

  const exp = getTokenExpiry(t);
  if (exp && Date.now() / 1000 > exp) {
    // Token is already expired — clean it up immediately
    localStorage.removeItem("token");
    return null;
  }
  return t;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(loadValidToken);

  // ── Proactive expiry check ─────────────────────────────────────────────────
  // If the user leaves the tab open, we schedule a logout exactly when the
  // JWT expires so the UI transitions cleanly instead of breaking on the next
  // API call.
  useEffect(() => {
    if (!token) return;

    const exp = getTokenExpiry(token);
    if (!exp) return;

    const msUntilExpiry = exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      // Already expired (edge case — loadValidToken should have caught this)
      logout();
      return;
    }

    const timer = setTimeout(() => {
      localStorage.removeItem("token");
      setToken(null);
    }, msUntilExpiry);

    return () => clearTimeout(timer);
  }, [token]);

  const login = (t) => {
    localStorage.setItem("token", t);
    setToken(t);
  };

  const logout = async () => {
    const t = localStorage.getItem("token");
    if (t) {
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${t}` },
      }).catch(() => {});
    }
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
