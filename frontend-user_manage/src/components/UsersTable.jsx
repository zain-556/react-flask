// FIX: onEdit was called as onEdit(user) — the second `mode` argument was
//      never passed, so App.jsx always received modal.mode = undefined.
//      Now both "put" (full replace) and "patch" (partial edit) are exposed,
//      matching the pattern already used in StockTable.

function UsersTable({ users, onDelete, onEdit }) {

  if (!users.length) {
    return (
      <p className="text-slate-400 text-sm py-4 text-center">
        No users yet — add one above.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">

        <thead>
          <tr className="bg-slate-800 text-white text-xs uppercase tracking-widest">
            <th className="text-left px-4 py-3 font-semibold">ID</th>
            <th className="text-left px-4 py-3 font-semibold">Name</th>
            <th className="text-left px-4 py-3 font-semibold">Email</th>
            <th className="text-left px-4 py-3 font-semibold">Phone</th>
            <th className="text-left px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.id}
              className={`border-b border-slate-100 ${
                index % 2 === 0 ? "bg-white" : "bg-slate-50"
              } hover:bg-blue-50 transition`}
            >
              <td className="px-4 py-3 text-slate-400 font-mono">{user.id}</td>
              <td className="px-4 py-3 font-medium text-slate-800">{user.name}</td>
              <td className="px-4 py-3 text-slate-600">{user.email}</td>
              <td className="px-4 py-3 text-slate-600">{user.phone}</td>

              <td className="px-4 py-3">
                <div className="flex gap-2">

                  {/* Full replace — PUT */}
                  <button
                    onClick={() => onEdit(user, "put")}
                    className="px-3 py-1 text-xs font-bold bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition"
                    title="Full edit (PUT)"
                  >
                    EDIT
                  </button>

                  {/* Partial update — PATCH */}
                  <button
                    onClick={() => onEdit(user, "patch")}
                    className="px-3 py-1 text-xs font-bold bg-sky-100 text-sky-700 rounded hover:bg-sky-200 transition"
                    title="Partial edit (PATCH)"
                  >
                    PATCH
                  </button>

                  <button
                    onClick={() => onDelete(user.id)}
                    className="px-3 py-1 text-xs font-bold bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                  >
                    DELETE
                  </button>

                </div>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default UsersTable;
