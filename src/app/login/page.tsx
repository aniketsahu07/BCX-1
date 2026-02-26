"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/actions/actions";
import type { UserRole } from "@/lib/types";

const DEMO_ACCOUNTS = [
  {
    role: "admin" as UserRole,
    email: "admin@bcx.gov.in",
    password: "Admin@123",
    label: "Registry Admin",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    dot: "bg-purple-500",
  },
  {
    role: "developer" as UserRole,
    email: "dev@greenenergy.in",
    password: "Dev@123",
    label: "Project Developer",
    color: "bg-green-50 border-green-200 text-green-700",
    dot: "bg-green-500",
  },
  {
    role: "buyer" as UserRole,
    email: "buyer@tatasteel.com",
    password: "Buyer@123",
    label: "Credit Buyer",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    dot: "bg-blue-500",
  },
];

const ROLE_REDIRECT: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  developer: "/developer/dashboard",
  buyer: "/buyer/dashboard",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await loginUser(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        router.push(ROLE_REDIRECT[result.user.role]);
      } else {
        setError(result.error ?? "Login failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (account: (typeof DEMO_ACCOUNTS)[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Panel */}
        <div className="hidden lg:flex flex-col gap-6 pr-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center shadow-lg shadow-green-200">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">BCX</p>
              <p className="text-sm text-slate-500">Bharat Carbon Exchange</p>
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-slate-900 leading-tight">
              India's Official<br />
              <span className="text-green-600">Carbon Credit</span><br />
              Registry
            </h1>
            <p className="mt-4 text-slate-600 leading-relaxed">
              A secure, transparent platform for registering carbon projects,
              trading verified credits, and meeting India's NDC commitments under
              the Paris Agreement.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Credits Issued", value: "1.16L" },
              { label: "Active Projects", value: "47" },
              { label: "tCO₂e Offset", value: "58K" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
                <p className="text-lg font-bold text-green-600">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="flex flex-wrap gap-2">
            {["MoEFCC Certified", "BIS Standards", "ISO 14064", "Paris Agreement"].map((c) => (
              <span key={c} className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                {c}
              </span>
            ))}
          </div>

          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <span>🇮🇳</span>
            Government of India | Ministry of Environment, Forest & Climate Change
          </p>
        </div>

        {/* Right Panel — Login Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 p-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900">BCX Platform</span>
          </div>

          <h2 className="text-xl font-bold text-slate-900">Sign in to BCX</h2>
          <p className="text-sm text-slate-500 mt-1">Access your role-based dashboard</p>

          {/* Demo Account Buttons */}
          <div className="mt-5 space-y-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  onClick={() => fillDemo(acc)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border text-xs font-medium transition-all hover:shadow-sm ${acc.color}`}
                >
                  <span className={`w-2 h-2 rounded-full ${acc.dot}`} />
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-slate-400">or enter credentials</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-slate-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-slate-400"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm shadow-sm shadow-green-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating…
                </>
              ) : (
                "Sign In to BCX"
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-400">
            Secured by BCX Identity Services · CERT-In Compliant
          </p>
        </div>
      </div>
    </div>
  );
}
