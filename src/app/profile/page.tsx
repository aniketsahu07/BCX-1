"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";

const ROLE_LABELS = { admin: "Registry Admin", developer: "Project Developer", buyer: "Credit Buyer" };
const ROLE_COLORS = { admin: "bg-purple-100 text-purple-700", developer: "bg-green-100 text-green-700", buyer: "bg-blue-100 text-blue-700" };

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  if (!user) return null;

  return (
    <AppShell>
      <div className="p-6 max-w-2xl mx-auto space-y-5">
        <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>

        <div className="bcx-card p-6 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-green-700">
              {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{user.name}</h2>
              <span className={`bcx-badge ${ROLE_COLORS[user.role]}`}>{ROLE_LABELS[user.role]}</span>
            </div>
          </div>

          <div className="grid gap-4">
            {[
              { label: "Full Name", value: user.name },
              { label: "Email Address", value: user.email },
              { label: "Organization", value: user.organization ?? "—" },
              { label: "User ID", value: user.id, mono: true },
              { label: "Account Type", value: ROLE_LABELS[user.role] },
              { label: "Member Since", value: new Date(user.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" }) },
            ].map((f) => (
              <div key={f.label} className="grid grid-cols-3 gap-2 items-center">
                <label className="text-xs font-medium text-slate-500 col-span-1">{f.label}</label>
                <div className={`col-span-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm ${f.mono ? "font-mono text-slate-600" : "text-slate-800"}`}>
                  {f.value}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-3">
            <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
              Save Changes
            </button>
            <button
              onClick={() => { logout(); router.push("/login"); }}
              className="px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bcx-card p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Security</h3>
          <div className="space-y-3">
            {[
              { label: "Two-Factor Authentication", status: "Not configured", action: "Enable" },
              { label: "API Access Token", status: "Not generated", action: "Generate" },
              { label: "Login Activity", status: "Last login: Just now", action: "View" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-800">{s.label}</p>
                  <p className="text-xs text-slate-400">{s.status}</p>
                </div>
                <button className="text-xs text-green-600 hover:text-green-700 font-medium">{s.action} →</button>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-center text-slate-400">
          BCX Platform v1.0.0 · Phase 1 · 🇮🇳 Bharat Carbon Exchange
        </p>
      </div>
    </AppShell>
  );
}
