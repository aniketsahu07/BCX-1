"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getLedgerTransactions } from "@/actions/actions";
import type { Transaction, TransactionType } from "@/lib/types";

const TX_CONFIG: Record<
  TransactionType,
  { label: string; color: string; icon: string }
> = {
  issuance: { label: "Issuance", color: "bg-green-50 text-green-700 border-green-200", icon: "🌱" },
  purchase: { label: "Purchase", color: "bg-blue-50 text-blue-700 border-blue-200", icon: "💰" },
  transfer: { label: "Transfer", color: "bg-purple-50 text-purple-700 border-purple-200", icon: "↔️" },
  retirement: { label: "Retirement", color: "bg-slate-50 text-slate-600 border-slate-200", icon: "✅" },
};

export default function LedgerPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      getLedgerTransactions().then(({ transactions: txs }) => {
        setTransactions(txs);
        setLoading(false);
      });
    }
  }, [user]);

  const filtered = transactions.filter(
    (t) =>
      search === "" ||
      t.projectName.toLowerCase().includes(search.toLowerCase()) ||
      t.from.toLowerCase().includes(search.toLowerCase()) ||
      t.to.toLowerCase().includes(search.toLowerCase()) ||
      (t.blockHash && t.blockHash.includes(search))
  );

  const stats = {
    totalTx: transactions.length,
    totalVolume: transactions.reduce((s, t) => s + t.quantity, 0),
    totalValue: transactions.reduce((s, t) => s + (t.totalValue ?? 0), 0),
    confirmed: transactions.filter((t) => t.status === "confirmed").length,
  };

  return (
    <AppShell>
      <div className="p-6 max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Public Carbon Ledger</h1>
          <p className="text-sm text-slate-500 mt-1">
            Immutable record of all BCX carbon credit transactions · Publicly verifiable
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Transactions", value: stats.totalTx, icon: "📊" },
            { label: "Credits Transacted", value: stats.totalVolume.toLocaleString("en-IN"), icon: "🌱" },
            { label: "Total Value", value: `₹${(stats.totalValue / 10000000).toFixed(2)}Cr`, icon: "💎" },
            { label: "Confirmed", value: stats.confirmed, icon: "✅" },
          ].map((s) => (
            <div key={s.label} className="bcx-card p-4 flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-lg font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by project, entity, hash…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-soft" />
            Live · {filtered.length} records
          </div>
        </div>

        {/* Table */}
        <div className="bcx-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Tx ID
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Project
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    From → To
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Credits
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Value (₹)
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Block Hash
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(9)].map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-3 bg-slate-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-slate-400 text-sm">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((tx) => {
                    const cfg = TX_CONFIG[tx.type];
                    return (
                      <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-slate-500 uppercase">
                            {tx.id.slice(0, 8)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`bcx-badge border ${cfg.color}`}>
                            {cfg.icon} {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs font-medium text-slate-800 max-w-36 truncate">
                            {tx.projectName}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-slate-600 max-w-48">
                            <span className="text-slate-400 truncate block max-w-36">{tx.from}</span>
                            <span className="text-green-600">↓</span>
                            <span className="text-slate-400 truncate block max-w-36">{tx.to}</span>
                          </p>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-slate-700 text-xs">
                          {tx.quantity.toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 text-right text-xs text-slate-700 font-medium">
                          {tx.totalValue
                            ? `₹${tx.totalValue.toLocaleString("en-IN")}`
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-[10px] text-slate-400">
                            {tx.blockHash ?? "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`bcx-badge ${
                              tx.status === "confirmed"
                                ? "bg-green-50 text-green-700"
                                : tx.status === "pending"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">
                          {new Date(tx.timestamp).toLocaleString("en-IN", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-center text-slate-400">
          🔒 All transactions are cryptographically signed and immutable · BCX Distributed Ledger v1.2
        </p>
      </div>
    </AppShell>
  );
}
