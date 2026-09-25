import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw, Trash2, Database, Search } from "lucide-react";
import { themes, defaultTheme, type ThemeName } from "../theme/theme";

export interface ColumnDef<T = any> {
  header: string;
  accessorKey?: keyof T | string;
  className?: string;
  render?: (item: T, index: number) => React.ReactNode;
}

export interface CleanTableProps<T = any> {
  title?: string;
  subtitle?: string;
  endpoint?: string;
  data?: T[];
  columns?: ColumnDef<T>[];
  refreshTrigger?: number;
  themeColor?: ThemeName;
  onDelete?: (id: string) => Promise<void> | void;
  searchable?: boolean;
}

export function CleanTable<
  T extends { id?: string | number; [key: string]: any },
>({
  title = "System Records",
  subtitle = "Live synchronization with database records.",
  endpoint = "http://localhost:5000/api/deployments",
  data: externalData,
  columns,
  refreshTrigger,
  themeColor,
  onDelete,
  searchable = true,
}: CleanTableProps<T>) {
  const activeTokens = themes[themeColor || defaultTheme];

  const [items, setItems] = useState<T[]>(externalData || []);
  const [loading, setLoading] = useState(!externalData);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Default columns if none provided
  const defaultColumns: ColumnDef<T>[] = [
    {
      header: "ID",
      accessorKey: "id",
      render: (row) => (
        <span className={`font-mono text-xs ${activeTokens.accent}`}>
          {row.id || "-"}
        </span>
      ),
    },
    {
      header: "Name",
      accessorKey: "name",
      render: (row) => (
        <span className="font-medium text-slate-200">
          {row.name || row.title || "Untitled"}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      render: (row) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${activeTokens.badge}`}
        >
          {row.status || "Active"}
        </span>
      ),
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      render: (row) => (
        <span className="text-xs text-slate-400">
          {row.createdAt || row.date || "Just now"}
        </span>
      ),
    },
  ];

  const effectiveColumns = columns || defaultColumns;

  const fetchData = useCallback(async () => {
    if (externalData) {
      setItems(externalData);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(endpoint, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setItems(result.data);
      } else if (Array.isArray(result)) {
        setItems(result);
      }
    } catch (err) {
      console.error("Table fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, externalData]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  const handleDelete = async (rawId: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    setDeletingId(rawId);

    try {
      if (onDelete) {
        await onDelete(rawId);
      } else {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${endpoint}/${rawId}`, {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Delete failed");
      }
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredItems = items.filter((item) => {
    if (!searchQuery.trim()) return true;
    return JSON.stringify(item)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl`}
    >
      {/* Header bar */}
      <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Database size={16} className={activeTokens.accent} />
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {searchable && (
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-2.5 text-slate-500 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none ${activeTokens.ring}`}
              />
            </div>
          )}

          <button
            onClick={fetchData}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Table content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {effectiveColumns.map((col, idx) => (
                <th key={idx} className={`py-3 px-5 ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {filteredItems.length === 0 ? (
              <tr>
                <td
                  colSpan={effectiveColumns.length + 1}
                  className="py-10 text-center text-xs text-slate-500"
                >
                  {loading
                    ? "Loading table records..."
                    : "No matching records found."}
                </td>
              </tr>
            ) : (
              filteredItems.map((row, rowIdx) => {
                const rowId = String(row.id || row._id || rowIdx);
                return (
                  <tr
                    key={rowId}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    {effectiveColumns.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className={`py-3.5 px-5 ${col.className || ""}`}
                      >
                        {col.render
                          ? col.render(row, rowIdx)
                          : col.accessorKey
                            ? String(row[col.accessorKey] ?? "-")
                            : "-"}
                      </td>
                    ))}

                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleDelete(rowId)}
                        disabled={deletingId === rowId}
                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
