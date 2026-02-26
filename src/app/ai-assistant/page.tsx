"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { validateProjectFlow, integrityScoreFlow } from "@/lib/ai-flows";
import type { AIValidationResult } from "@/lib/types";

type Mode = "validate" | "score" | "price";

export default function AIAssistantPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("score");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIValidationResult | null>(null);
  const [validateResult, setValidateResult] = useState<{
    isValid: boolean;
    issues: string[];
    suggestions: string[];
    estimatedScore: number;
  } | null>(null);

  // Form state
  const [projectName, setProjectName] = useState("Rajasthan Wind Power Initiative");
  const [sector, setSector] = useState("Renewable Energy");
  const [methodology, setMethodology] = useState("ACM0002");
  const [co2, setCo2] = useState("180000");
  const [vintage, setVintage] = useState("2024");
  const [location, setLocation] = useState("Jaisalmer, Rajasthan");

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  const handleScore = async () => {
    setLoading(true);
    setResult(null);
    try {
      const r = await integrityScoreFlow({
        projectId: "demo-001",
        methodology,
        co2Reduction: parseInt(co2) || 50000,
        vintage: parseInt(vintage) || 2024,
        location,
        sector,
      });
      setResult(r);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    setLoading(true);
    setValidateResult(null);
    try {
      const r = await validateProjectFlow({
        project: {
          name: projectName,
          sector: sector as any,
          methodology,
          co2Reduction: parseInt(co2) || 50000,
          vintage: parseInt(vintage) || 2024,
          sdgGoals: [7, 13],
        },
      });
      setValidateResult(r);
    } finally {
      setLoading(false);
    }
  };

  const riskColor = {
    low: "text-green-600",
    medium: "text-amber-600",
    high: "text-red-600",
  };

  const scoreColor = (score: number) =>
    score >= 85
      ? "text-green-600 bg-green-50 border-green-200"
      : score >= 70
      ? "text-amber-600 bg-amber-50 border-amber-200"
      : "text-red-600 bg-red-50 border-red-200";

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">BCX AI Assistant</h1>
          </div>
          <p className="text-sm text-slate-500">
            Powered by BCX Integrity Engine (Genkit/VertexAI ready) · Mock outputs in Phase 1
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-2">
          {[
            { id: "score" as Mode, label: "🎯 Integrity Score", desc: "AI-score a project" },
            { id: "validate" as Mode, label: "✅ Validate Project", desc: "Pre-submission check" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setResult(null); setValidateResult(null); }}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                mode === m.id
                  ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bcx-card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">Project Details</h3>

            {mode === "validate" && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Project Name</label>
                <input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Sector</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                {["Renewable Energy", "Afforestation", "Methane Capture", "Energy Efficiency", "Blue Carbon", "Soil Carbon", "Waste Management"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Methodology Code</label>
              <input
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
                placeholder="e.g. ACM0002, AR-AM0014"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">CO₂ Reduction (t)</label>
                <input
                  type="number"
                  value={co2}
                  onChange={(e) => setCo2(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Vintage Year</label>
                <input
                  type="number"
                  value={vintage}
                  onChange={(e) => setVintage(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={mode === "score" ? handleScore : handleValidate}
              disabled={loading}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  AI Analyzing…
                </>
              ) : mode === "score" ? (
                "🎯 Run Integrity Analysis"
              ) : (
                "✅ Validate Project"
              )}
            </button>

            <p className="text-[11px] text-center text-slate-400">
              Phase 1: Mock AI output · Future: Genkit + Vertex AI Gemini Pro
            </p>
          </div>

          {/* Output */}
          <div className="space-y-4">
            {!result && !validateResult && !loading && (
              <div className="bcx-card p-8 text-center h-full flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">AI Analysis Ready</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill in project details and run the AI analysis to get integrity scores, findings, and recommendations.
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="bcx-card p-8 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-purple-50 flex items-center justify-center">
                  <svg className="animate-spin w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-600 font-medium animate-pulse-soft">
                  AI analyzing project parameters…
                </p>
                <p className="text-xs text-slate-400">
                  Checking methodology, baselines, and greenwashing indicators
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-4 animate-fade-in-up">
                {/* Score Card */}
                <div className="bcx-card p-5">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Integrity Score</h4>
                  <div className="flex items-center gap-4">
                    <div className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center flex-shrink-0 ${scoreColor(result.integrityScore)}`}>
                      <span className="text-2xl font-bold">{result.integrityScore}</span>
                      <span className="text-[10px]">/100</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Risk Level:{" "}
                        <span className={`font-bold ${riskColor[result.riskLevel]}`}>
                          {result.riskLevel.toUpperCase()}
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Model: {result.model}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(result.validatedAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        result.integrityScore >= 85
                          ? "bg-green-500"
                          : result.integrityScore >= 70
                          ? "bg-amber-400"
                          : "bg-red-400"
                      }`}
                      style={{ width: `${result.integrityScore}%` }}
                    />
                  </div>
                </div>

                {/* Findings */}
                <div className="bcx-card p-5">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">AI Findings</h4>
                  <ul className="space-y-2">
                    {result.findings.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="text-green-500 mt-0.5 flex-shrink-0">→</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="bcx-card p-5">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="text-blue-500 mt-0.5 flex-shrink-0">💡</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {validateResult && (
              <div className="space-y-4 animate-fade-in-up">
                <div className={`bcx-card p-5 border-l-4 ${validateResult.isValid ? "border-l-green-500" : "border-l-amber-500"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{validateResult.isValid ? "✅" : "⚠️"}</span>
                    <h4 className="text-sm font-semibold text-slate-900">
                      {validateResult.isValid ? "Project Valid" : "Issues Found"}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Estimated Integrity Score:{" "}
                    <strong className={validateResult.estimatedScore >= 80 ? "text-green-600" : "text-amber-600"}>
                      {validateResult.estimatedScore}/100
                    </strong>
                  </p>
                </div>

                {validateResult.issues.length > 0 && (
                  <div className="bcx-card p-5">
                    <h4 className="text-sm font-semibold text-red-700 mb-3">⚠ Issues</h4>
                    <ul className="space-y-2">
                      {validateResult.issues.map((issue, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-red-700">
                          <span className="flex-shrink-0">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {validateResult.suggestions.length > 0 && (
                  <div className="bcx-card p-5">
                    <h4 className="text-sm font-semibold text-blue-700 mb-3">💡 Suggestions</h4>
                    <ul className="space-y-2">
                      {validateResult.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <span className="text-blue-400 flex-shrink-0">→</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
