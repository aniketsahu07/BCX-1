"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getProjects, issueCredits } from "@/actions/actions";
import type { CarbonProject } from "@/lib/types";

export default function AdminCreditsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<CarbonProject[]>([]);
  const [selected, setSelected] = useState("");
  const [quantity, setQuantity] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ serials: string[]; projectId: string } | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) router.push("/login");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === "admin") {
      getProjects({ status: "approved" }).then(setProjects);
    }
  }, [user]);

  const handleIssue = async () => {
    if (!selected) return;
    setLoading(true);
    setResult(null);
    const res = await issueCredits(selected, quantity);
    setLoading(false);
    if (res.success) {
      setResult({ serials: res.serialNumbers ?? [], projectId: selected });
    }
  };

  const approvedProjects = projects.filter((p) => p.status === "approved" || p.status === "active");

  return (
    <AppShell>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Credit Issuance</h1>
          <p className="text-sm text-slate-500 mt-1">
            Issue verified carbon credits to approved projects
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Issue Form */}
          <div className="bcx-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Issue Credits</h3>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Select Approved Project
              </label>
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="">Choose project…</option>
                {approvedProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {approvedProjects.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  No approved projects. Approve projects first from the Projects page.
                </p>
              )}
            </div>

            {selected && (
              <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-700 space-y-1">
                {(() => {
                  const p = projects.find((x) => x.id === selected);
                  if (!p) return null;
                  return (
                    <>
                      <p><span className="text-slate-500">Sector:</span> {p.sector}</p>
                      <p><span className="text-slate-500">Location:</span> {p.location}</p>
                      <p><span className="text-slate-500">Total Credits:</span> {p.totalCredits.toLocaleString("en-IN")}</p>
                      <p><span className="text-slate-500">Available:</span> {p.availableCredits.toLocaleString("en-IN")}</p>
                      <p><span className="text-slate-500">Integrity Score:</span> {p.integrityScore}/100</p>
                    </>
                  );
                })()}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Quantity to Issue
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
              />
              <p className="text-xs text-slate-400 mt-1">Each credit represents 1 tCO₂e reduction</p>
            </div>

            <button
              onClick={handleIssue}
              disabled={!selected || loading}
              className="w-full py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:bg-green-300 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Issuing Credits…
                </>
              ) : (
                `🌱 Issue ${quantity.toLocaleString("en-IN")} Credits`
              )}
            </button>
          </div>

          {/* Result */}
          <div className="space-y-4">
            {result ? (
              <div className="bcx-card p-5 border-l-4 border-l-green-500 animate-fade-in-up space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <div>
                    <h4 className="text-sm font-semibold text-green-800">Credits Issued Successfully</h4>
                    <p className="text-xs text-green-600">{quantity.toLocaleString("en-IN")} credits added to registry</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-600 mb-2">Sample Serial Numbers (first 5):</p>
                  <div className="space-y-1">
                    {result.serials.map((s) => (
                      <div
                        key={s}
                        className="font-mono text-xs bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-slate-700"
                      >
                        {s}
                      </div>
                    ))}
                    {quantity > 5 && (
                      <p className="text-xs text-slate-400 text-center">
                        + {(quantity - 5).toLocaleString("en-IN")} more serials generated
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  Transaction recorded in BCX Ledger · Credits now available for trading
                </p>
              </div>
            ) : (
              <div className="bcx-card p-8 text-center h-full flex flex-col items-center justify-center gap-3">
                <span className="text-4xl">🌱</span>
                <p className="text-sm text-slate-500">
                  Select a project and quantity to issue carbon credits
                </p>
              </div>
            )}

            {/* Credit Process Info */}
            <div className="bcx-card p-4 space-y-3">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Issuance Process
              </h4>
              {[
                { step: "1", label: "Project Approved", desc: "BCX Registry validates project" },
                { step: "2", label: "Credits Issued", desc: "Serial numbers generated & recorded" },
                { step: "3", label: "Credits Traded", desc: "Available on marketplace" },
                { step: "4", label: "Credits Retired", desc: "Permanent offset claim filed" },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-800">{s.label}</p>
                    <p className="text-xs text-slate-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
