"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { getBuyerPortfolio, getMarketplaceData } from "@/actions/actions";
import type { BuyerPortfolio, CarbonProject } from "@/lib/types";

export default function BuyerDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<BuyerPortfolio | null>(null);
  const [featured, setFeatured] = useState<CarbonProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "buyer")) router.push("/login");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === "buyer") {
      Promise.all([
        getBuyerPortfolio(user.id),
        getMarketplaceData(),
      ]).then(([p, m]) => {
        setPortfolio(p);
        setFeatured(m.slice(0, 3));
        setLoading(false);
      });
    }
  }, [user]);

  if (isLoading || loading || !portfolio) {
    return (
      <AppShell>
        <div className="p-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </AppShell>
    );
  }

  const netPosition = portfolio.totalCreditsOwned;
  const gainLoss = portfolio.holdings.reduce(
    (s, h) => s + h.quantity * (h.currentPrice - h.avgPrice),
    0
  );

  return (
    <AppShell>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Carbon Portfolio</h1>
            <p className="text-sm text-slate-500 mt-1">
              {user?.organization} · Net Zero Progress
            </p>
          </div>
          <Link
            href="/marketplace"
            className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-sm shadow-green-200"
          >
            Browse Marketplace
          </Link>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          {[
            {
              label: "Credits Owned",
              value: portfolio.totalCreditsOwned.toLocaleString("en-IN"),
              icon: "🌱",
              sub: "Active holdings",
              color: "text-green-600",
            },
            {
              label: "Credits Retired",
              value: portfolio.totalCreditsRetired.toLocaleString("en-IN"),
              icon: "✅",
              sub: "Permanently offset",
              color: "text-teal-600",
            },
            {
              label: "Total Invested",
              value: `₹${(portfolio.totalSpent / 100000).toFixed(1)}L`,
              icon: "💰",
              sub: "All time",
              color: "text-blue-600",
            },
            {
              label: "CO₂ Offset",
              value: `${portfolio.carbonOffset.toLocaleString("en-IN")} t`,
              icon: "🌍",
              sub: "tCO₂e retired",
              color: "text-purple-600",
            },
          ].map((s) => (
            <div key={s.label} className="bcx-card p-4 animate-fade-in-up">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{s.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
                </div>
                <span className="text-2xl">{s.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Holdings */}
        <div className="bcx-card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Current Holdings</h3>
            <span className={`text-sm font-medium ${gainLoss >= 0 ? "text-green-600" : "text-red-500"}`}>
              {gainLoss >= 0 ? "+" : ""}₹{Math.abs(gainLoss).toLocaleString("en-IN")} unrealized P&L
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Project</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Sector</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Qty</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Avg Price</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Current</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">P&L</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {portfolio.holdings.map((h) => {
                  const pl = h.quantity * (h.currentPrice - h.avgPrice);
                  return (
                    <tr key={h.projectId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">{h.projectName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Purchased {new Date(h.purchasedAt).toLocaleDateString("en-IN")}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="bcx-badge bg-green-50 text-green-700 border border-green-200 text-[11px]">{h.sector}</span>
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-slate-700">{h.quantity.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-4 text-right text-slate-600">₹{h.avgPrice.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-4 text-right font-medium text-slate-900">₹{h.currentPrice.toLocaleString("en-IN")}</td>
                      <td className={`px-4 py-4 text-right font-medium ${pl >= 0 ? "text-green-600" : "text-red-500"}`}>
                        {pl >= 0 ? "+" : ""}₹{Math.abs(pl).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                          Retire →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Net Zero Progress */}
        <div className="bcx-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-900">Net Zero Progress</h3>
            <span className="text-xs text-slate-500">Target: 12,000 tCO₂e/year</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Carbon Offset Achievement</span>
              <span className="font-semibold text-green-600">
                {portfolio.carbonOffset.toLocaleString("en-IN")} / 12,000 t
                <span className="text-slate-400 font-normal ml-1">
                  ({Math.round((portfolio.carbonOffset / 12000) * 100)}%)
                </span>
              </span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000"
                style={{ width: `${Math.min((portfolio.carbonOffset / 12000) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">
              {12000 - portfolio.carbonOffset > 0
                ? `${(12000 - portfolio.carbonOffset).toLocaleString("en-IN")} tCO₂e remaining to achieve annual net zero target`
                : "🎉 Annual net zero target achieved!"}
            </p>
          </div>
        </div>

        {/* Featured from Marketplace */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Featured Projects</h2>
            <Link href="/marketplace" className="text-xs text-green-600 hover:text-green-700 font-medium">
              View all →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {featured.map((p) => (
              <div key={p.id} className="bcx-card p-4 space-y-3">
                <div>
                  <span className="text-xs text-slate-400">{p.sector}</span>
                  <h4 className="text-sm font-semibold text-slate-900 mt-1">{p.name}</h4>
                  <p className="text-xs text-slate-500">📍 {p.location}</p>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-lg font-bold text-green-600">₹{p.pricePerCredit.toLocaleString("en-IN")}</p>
                    <p className="text-xs text-slate-400">per credit</p>
                  </div>
                  <Link
                    href="/marketplace"
                    className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Buy Credits
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
