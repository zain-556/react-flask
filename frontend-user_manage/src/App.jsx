import { useState, useEffect, useCallback } from "react";
import Toast         from "./components/Toast";
import AddUserForm   from "./components/AddUserForm";
import GetByIdBar    from "./components/GetByIdBar";
import SpotlightCard from "./components/SpotlightCard";
import UsersTable    from "./components/UsersTable";
import EditModal     from "./components/EditModal";

import Login          from "./components/Login";
import Register       from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";

import StockManager from "./components/StockManager";

import { useAuth } from "./context/AuthContext";

const API = "http://localhost:5000";

function App() {

  const { token, logout } = useAuth();

  // ─────────────────────────────────────────────
  // AUTH PAGES
  // ─────────────────────────────────────────────
  const [authPage, setAuthPage] = useState("login");

  // ─────────────────────────────────────────────
  // MAIN PAGE TAB
  // users | stock
  // ─────────────────────────────────────────────
  const [page, setPage] = useState("users");

  // ─────────────────────────────────────────────
  // USER STATE
  // ─────────────────────────────────────────────
  const [users,     setUsers]     = useState([]);
  const [toast,     setToast]     = useState({ msg: "", type: "ok" });
  const [modal,     setModal]     = useState(null);
  const [spotlight, setSpotlight] = useState(null);
  const [showTable, setShowTable] = useState(true);

  const [showRegister, setShowRegister] = useState(false);

  const notify = (msg, type = "ok") => {
    setToast({ msg, type });
  };

  // ─────────────────────────────────────────────
  // LOAD USERS
  // ─────────────────────────────────────────────
const loadUsers = useCallback(async () => {

  try {
    const res = await fetch(`${API}/users`);
    const data = await res.json();

    setUsers(data);

  } catch {

    notify("Failed to load users", "error");
  }

}, []);

useEffect(() => {

  if (token) {
    loadUsers();
  }

}, [token, loadUsers]);

  // ─────────────────────────────────────────────
  // AUTH SCREENS
  // ─────────────────────────────────────────────
  if (!token) {

    if (authPage === "forgot") {
      return <ForgotPassword onSwitch={setAuthPage} />;
    }

    return (
      <Login
        onSwitch={setAuthPage}
      />
      );  
  }

  // ─────────────────────────────────────────────
  // USER CRUD HANDLERS
  // ─────────────────────────────────────────────
  const handleAdd = (user, err) => {

    if (err) {
      return notify(err, "error");
    }

    setUsers((prev) => [...prev, user]);

    notify(`User "${user.name}" added successfully.`);
  };

  const handleDelete = async (id) => {

    await fetch(`${API}/users/${id}`, {
      method: "DELETE",
    });

    setUsers((prev) =>
      prev.filter((u) => u.id !== id)
    );

    notify(`User #${id} deleted.`);
  };

  const handleSave = (updated) => {

    setUsers((prev) =>
      prev.map((u) =>
        u.id === updated.id ? updated : u
      )
    );

    setModal(null);

    notify(`User #${updated.id} updated.`);
  };

  const handleGetById = (user, err) => {

    if (err) {
      return notify(err, "error");
    }

    setSpotlight(user);
  };

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  return (

    <div className="min-h-screen bg-slate-100 font-sans">

      {/* HEADER */}
      <header className="bg-slate-800 text-white px-6 py-4 shadow-md">

        <div className="flex items-center justify-between">

          <div className="flex flex-col gap-0.5 text-center ">
            <h1 className="text-xl font-bold tracking-tight">
              ⚙️ Management Dashboard
            </h1>

            <p className="text-slate-400 text-xs mt-0.5 ">
               Solution for systems.
            </p>
          </div>
          
          <div className="absolute left-1/2 -translate-x-1/2">
            <button
              onClick={() => setShowRegister(true)}
              className="text-xs border border-blue-500 text-blue-300 px-3 py-1.5 rounded hover:bg-blue-700 transition "
            >
              ➕ Create Admin


            </button>
          </div>

          <button
            onClick={logout}
            className="text-xs border border-slate-600 text-slate-300 px-3 py-1.5 rounded hover:bg-slate-700 transition"
          >
            Sign Out
          </button>

        </div>

        {/* NAVIGATION */}
        <div className="flex justify-center gap-2 mt-4">

          <button
            onClick={() => setPage("users")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              page === "users"
                ? "bg-white text-slate-800"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            👤 Users
          </button>

          <button
            onClick={() => setPage("stock")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              page === "stock"
                ? "bg-white text-slate-800"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            📦 Stock
          </button>

        </div>

      </header>

      {/* ───────────────────────────────────────── */}
      {/* USERS PAGE */}
      {/* ───────────────────────────────────────── */}
      {page === "users" && (

        <main className="max-w-4xl mx-auto px-4 py-7">

          <Toast
            msg={toast.msg}
            type={toast.type}
            onClear={() => setToast({ msg: "" })}
          />

          <AddUserForm onAdd={handleAdd} />

          <GetByIdBar onResult={handleGetById} />

          <SpotlightCard
            user={spotlight}
            onDismiss={() => setSpotlight(null)}
          />

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

            {/* TABLE HEADER */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">

              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                📋 All Users
                <span className="ml-2 text-slate-300">
                  ({users.length})
                </span>
              </h2>

              <div className="flex gap-2">

                <button
                  onClick={() => setShowTable(!showTable)}
                  className="text-xs text-slate-500 border border-slate-200 px-3 py-1 rounded hover:bg-slate-50 transition"
                >
                  {showTable ? "▼ Hide" : "▶ Show"}
                </button>

                <button
                  onClick={loadUsers}
                  className="text-xs text-slate-500 border border-slate-200 px-3 py-1 rounded hover:bg-slate-50 transition"
                >
                  ↻ Refresh
                </button>

              </div>
            </div>

            {/* USERS TABLE */}
            {showTable && (
              <UsersTable
                users={users}
                onDelete={handleDelete}
                onEdit={(u, mode) =>
                  setModal({ user: u, mode })
                }
              />
            )}

          </div>

        </main>
      )}

      {/* ───────────────────────────────────────── */}
      {/* STOCK PAGE */}
      {/* ───────────────────────────────────────── */}
      {page === "stock" && (
        <StockManager token={token} />
      )}

      {/* EDIT MODAL */}
      {modal && (
        <EditModal
          user={modal.user}
          mode={modal.mode}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* REGISTER MODAL */}
      {showRegister && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <Register
            onClose={() => setShowRegister(false)}
          />
        </div>
      )}

      

    </div>
  );
}

export default App;