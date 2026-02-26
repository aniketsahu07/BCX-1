"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getLedgerTransactions } from "@/actions/actions";
import type { Transaction } from "@/lib/types";

export default function BuyerHistoryPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "buyer")) router.push("/login");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === "buyer") {
      getLedgerTransactions().then(({ transactions: txs }) => {
        // Filter to buyer's transactions (in mock, Tata Steel)
        const buyerTxs = txs.filter(
          (t) => t.to.includes("Tata") || t.from.includes("Tata")
        );
        setTransactions(buyerTxs);
        setLoading(false);
      });
    }
  }, [user]);

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Purchase & Retirement History</h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete transaction history for {user?.organization}
          </p>
        </div>

        <div className="bcx-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Type", "Project", "Quantity", "Price/Credit", "Total Value", "Date", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-3 bg-slate-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-slate-400 text-sm">
                      No transaction history found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`bcx-badge border text-[11px] ${
                          tx.type === "purchase" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          tx.type === "retirement" ? "bg-slate-50 text-slate-600 border-slate-200" :
                          "bg-green-50 text-green-700 border-green-200"
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium text-slate-800 max-w-40 truncate">{tx.projectName}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-700">{tx.quantity.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {tx.pricePerCredit ? `₹${tx.pricePerCredit.toLocaleString("en-IN")}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-900">
                        {tx.totalValue ? `₹${tx.totalValue.toLocaleString("en-IN")}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {new Date(tx.timestamp).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`bcx-badge ${tx.status === "confirmed" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
