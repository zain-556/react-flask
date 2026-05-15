// StockManager.jsx
// The main container for stock management.
// This file only handles: state, API calls, and layout.
// All UI pieces are imported from their own files (same pattern as App.jsx).

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import Toast          from "./Toast";           // reuse existing Toast component
import AddStockForm   from "./AddStockForm";
import StockTable     from "./StockTable";
import StockEditModal from "./StockEditModal";

const API = "http://localhost:5000";

function StockManager({ token }) {

  // ── State ─────────────────────────────────────────────────────────────────
  const [stocks,    setStocks]    = useState([]);               // all stock items
  const [toast,     setToast]     = useState({ msg: "", type: "ok" });
  const [modal,     setModal]     = useState(null);             // { stock, mode } or null
  const [showTable, setShowTable] = useState(true);             // toggle table visibility
  const [searchName, setSearchName] = useState("");             // search-by-name input
  const [spotlight, setSpotlight] = useState(null);             // single search result

  // ── Helper: show a toast message ─────────────────────────────────────────
  const notify = useCallback((msg, type = "ok") => {
    setToast({ msg, type });
  }, []);

  // ── Load all stocks from the backend ─────────────────────────────────────
  const loadStocks = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/stocks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStocks(res.data);
    } catch {
      notify("Could not load stock items", "error");
    }
  }, [token, notify]);

  // Run once when component mounts
  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  // ── Handle: stock added ───────────────────────────────────────────────────
  const handleAdd = (stock, err) => {
    if (err) return notify(err, "error");
    setStocks((prev) => [...prev, stock]);
    notify(`"${stock.name}" added to stock.`);
  };

  // ── Handle: stock deleted ─────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/stocks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStocks((prev) => prev.filter((s) => s.id !== id));
      notify(`Stock #${id} deleted.`);
    } catch {
      notify("Delete failed", "error");
    }
  };

  // ── Handle: stock updated (from modal) ───────────────────────────────────
  const handleSave = (updatedStock) => {
    // Replace the old version in the list with the updated one
    setStocks((prev) =>
      prev.map((s) => (s.id === updatedStock.id ? updatedStock : s))
    );
    setModal(null);
    notify(`Stock #${updatedStock.id} updated.`);
  };

  // ── Handle: search by name ───────────────────────────────────────────────
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchName.trim()) return;

    try {
      const res = await axios.get(`${API}/stocks/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { name: searchName },
      });
      setSpotlight(res.data);  // show result in spotlight card
      setSearchName("");        // clear search input after successful search
    } catch {
      notify("Stock item not found", "error");
      setSpotlight(null);
    }
  };

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 py-7">

      {/* Section heading */}
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
          🏷️ Stock Manager
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Add · Search · Edit (PUT / PATCH) · Delete · Image Upload
        </p>
      </div>

      {/* Toast notification */}
      <Toast
        msg={toast.msg}
        type={toast.type}
        onClear={() => setToast({ msg: "" })}
      />

      {/* Add new stock form */}
      <AddStockForm token={token} onAdd={handleAdd} />

      {/* ── Get by name bar ── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 mb-5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
          🔍 Find by Name
        </h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Enter stock name (e.g., Laptop)"
            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* ── Spotlight card – shows a single search result ── */}
      {spotlight && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5 flex gap-4 items-start">

          {/* Image or placeholder */}
          {spotlight.image_url ? (
            <img
              src={`${API}${spotlight.image_url}`}
              alt={spotlight.name}
              className="h-16 w-16 object-cover rounded-lg border border-blue-200 flex-shrink-0"
            />
          ) : (
            <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
              📦
            </div>
          )}

          {/* Details */}
          <div className="flex-1 text-sm">
            <p className="font-bold text-slate-800">{spotlight.name}</p>
            <p className="text-slate-500 text-xs">
              {spotlight.category} · ID #{spotlight.id}
            </p>
            <p className="text-slate-600 text-xs mt-1">
              Qty: <span className="font-semibold">{spotlight.quantity}</span>
              {" · "}
              Price: <span className="font-semibold">${spotlight.price}</span>
            </p>
            {spotlight.description && (
              <p className="text-slate-400 text-xs mt-1 italic">
                {spotlight.description}
              </p>
            )}
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setSpotlight(null)}
            className="text-blue-400 hover:text-blue-600 text-xl leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* ── All stock items table ── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        {/* Table header bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            📋 All Stock Items
            <span className="ml-2 text-slate-300">({stocks.length})</span>
          </h2>
          <div className="flex gap-2">
            {/* Toggle table visibility */}
            <button
              onClick={() => setShowTable(!showTable)}
              className="text-xs text-slate-500 border border-slate-200 px-3 py-1 rounded hover:bg-slate-50 transition"
            >
              {showTable ? "▼ Hide" : "▶ Show"}
            </button>
            {/* Refresh list */}
            <button
              onClick={loadStocks}
              className="text-xs text-slate-500 border border-slate-200 px-3 py-1 rounded hover:bg-slate-50 transition"
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Stock table (collapsible) */}
        {showTable && (
          <StockTable
            stocks={stocks}
            onDelete={handleDelete}
            onEdit={(stock, mode) => setModal({ stock, mode })}
          />
        )}
      </div>

      {/* Edit modal – shown when user clicks ✏️ or 🔄 in the table */}
      {modal && (
        <StockEditModal
          stock={modal.stock}
          mode={modal.mode}
          token={token}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

    </div>
  );
}

export default StockManager;
