"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getAdminStats, getComplianceAlerts } from "@/actions/actions";
import type { AdminStats, ComplianceAlert } from "@/lib/types";

// ─── Mini Chart (pure CSS/SVG) ────────────────────────────────────────────────
function SparkLine({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120;
  const h = 36;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  unit,
  sub,
  trend,
  color,
  sparkData,
}: {
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  trend?: { val: string; up: boolean };
  color: string;
  sparkData?: number[];
}) {
  return (
    <div className="bcx-card p-5 animate-fade-in-up">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-slate-900">
            {value}
            {unit && <span className="text-base font-medium text-slate-500 ml-1">{unit}</span>}
          </p>
          {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      </div>

      {sparkData && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <SparkLine data={sparkData} />
        </div>
      )}

      {trend && (
        <div className="mt-2 flex items-center gap-1">
          <span className={`text-xs font-medium ${trend.up ? "text-green-600" : "text-red-500"}`}>
            {trend.up ? "▲" : "▼"} {trend.val}
          </span>
          <span className="text-xs text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  );
}

// ─── Alert Badge ──────────────────────────────────────────────────────────────
function AlertBadge({ type }: { type: ComplianceAlert["type"] }) {
  const styles = {
    critical: "bg-red-50 text-red-700 border-red-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={`bcx-badge border ${styles[type]}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === "admin") {
      Promise.all([getAdminStats(), getComplianceAlerts()]).then(
        ([s, a]) => {
          setStats(s);
          setAlerts(a);
          setLoading(false);
        }
      );
    }
  }, [user]);

  if (isLoading || loading || !stats) {
    return (
      <AppShell>
        <div className="p-6 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </AppShell>
    );
  }

  const sparkVolumes = stats.monthlyVolume.map((m) => m.volume);

  return (
    <AppShell>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Registry Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            BCX National Carbon Registry · Updated {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          <StatCard
            label="Credits Issued"
            value={stats.totalCreditsIssued.toLocaleString("en-IN")}
            sub="Total verified issuances"
            color="bg-green-100 text-green-600"
            trend={{ val: "12.4%", up: true }}
            sparkData={sparkVolumes}
          />
          <StatCard
            label="Credits Traded"
            value={stats.totalCreditsTraded.toLocaleString("en-IN")}
            sub="Secondary market volume"
            color="bg-blue-100 text-blue-600"
            trend={{ val: "8.1%", up: true }}
          />
          <StatCard
            label="Credits Retired"
            value={stats.totalCreditsRetired.toLocaleString("en-IN")}
            sub="Permanent offset claims"
            color="bg-purple-100 text-purple-600"
            trend={{ val: "3.2%", up: false }}
          />
          <StatCard
            label="Pending Approvals"
            value={stats.pendingApprovals}
            sub="Projects awaiting review"
            color="bg-amber-100 text-amber-600"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Active Projects", value: stats.activeProjects, icon: "📋" },
            { label: "Registered Developers", value: stats.registeredDevelopers, icon: "🏗️" },
            { label: "Registered Buyers", value: stats.registeredBuyers, icon: "🏢" },
          ].map((s) => (
            <div key={s.label} className="bcx-card p-4 flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Volume Chart */}
        <div className="bcx-card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Monthly Trading Volume (Credits)</h3>
          <div className="flex items-end gap-3 h-32">
            {stats.monthlyVolume.map((m, i) => {
              const maxVol = Math.max(...stats.monthlyVolume.map((x) => x.volume));
              const pct = (m.volume / maxVol) * 100;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <p className="text-[10px] font-medium text-slate-600">{m.volume.toLocaleString("en-IN")}</p>
                  <div className="w-full flex flex-col justify-end" style={{ height: "80px" }}>
                    <div
                      className={`w-full rounded-t transition-all duration-700 ${
                        i === stats.monthlyVolume.length - 1
                          ? "bg-green-500"
                          : "bg-green-200"
                      }`}
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">{m.month}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compliance Alerts */}
        <div className="bcx-card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Compliance Alerts</h3>
            <span className="text-xs text-slate-500">{alerts.filter((a) => !a.resolved).length} active</span>
          </div>
          <div className="divide-y divide-slate-100">
            {alerts.map((alert) => (
              <div key={alert.id} className={`px-5 py-4 flex items-start gap-3 ${alert.resolved ? "opacity-50" : ""}`}>
                <div
                  className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    alert.type === "critical"
                      ? "bg-red-500"
                      : alert.type === "warning"
                      ? "bg-amber-400"
                      : "bg-blue-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-slate-900">{alert.entity}</p>
                    <AlertBadge type={alert.type} />
                    {alert.resolved && (
                      <span className="bcx-badge bg-slate-100 text-slate-500">Resolved</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{alert.message}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {new Date(alert.timestamp).toLocaleString("en-IN")}
                  </p>
                </div>
                {!alert.resolved && (
                  <button className="flex-shrink-0 text-xs text-green-600 hover:text-green-700 font-medium">
                    Review →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
