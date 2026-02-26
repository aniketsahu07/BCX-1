/**
 * BCX GenAI Flows (Genkit-ready structure)
 *
 * Currently returns mock AI outputs.
 * Structured for future Genkit / Vertex AI / OpenAI integration.
 *
 * Usage:
 *   import { validateProjectFlow, integrityScoreFlow } from '@/lib/ai-flows'
 */

import type { AIValidationResult, CarbonProject } from "./types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ValidateProjectInput {
  project: Partial<CarbonProject>;
  documents?: string[]; // file URLs / base64
}

export interface ValidateProjectOutput {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
  estimatedScore: number;
}

export interface IntegrityScoreInput {
  projectId: string;
  methodology: string;
  co2Reduction: number;
  vintage: number;
  location: string;
  sector: string;
}

export interface IntegrityScoreOutput extends AIValidationResult {}

// ─── Flow: validateProjectFlow ────────────────────────────────────────────────
/**
 * Validates a carbon project registration for completeness and credibility.
 *
 * Future: Replace mock with Genkit flow calling Vertex AI / Claude / GPT-4
 *
 * Example Genkit structure:
 * const validateProjectFlow = defineFlow(
 *   { name: 'validateProject', inputSchema: z.object({...}), outputSchema: z.object({...}) },
 *   async (input) => {
 *     const response = await generate({ model: gemini15Flash, prompt: buildPrompt(input) });
 *     return parseResponse(response);
 *   }
 * );
 */
export async function validateProjectFlow(
  input: ValidateProjectInput
): Promise<ValidateProjectOutput> {
  // Simulate AI processing time
  await new Promise((r) => setTimeout(r, 1200));

  const { project } = input;

  // Mock logic: score based on completeness
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (!project.methodology) issues.push("Methodology not specified.");
  if (!project.co2Reduction || project.co2Reduction < 1000)
    issues.push("CO₂ reduction estimate appears too low for the project scale.");
  if (!project.sdgGoals || project.sdgGoals.length === 0)
    suggestions.push("Map project to relevant UN SDG goals to improve market appeal.");
  if (project.vintage && project.vintage < 2020)
    issues.push("Vintage year is older than 5 years — may face market discount.");

  if (project.sector === "Blue Carbon")
    suggestions.push(
      "Blue carbon projects have premium pricing. Consider Verra VCS + CCBS dual certification."
    );

  const estimatedScore =
    Math.max(40, 100 - issues.length * 15 - (suggestions.length > 2 ? 5 : 0));

  return {
    isValid: issues.length === 0,
    issues,
    suggestions,
    estimatedScore,
  };
}

// ─── Flow: integrityScoreFlow ─────────────────────────────────────────────────
/**
 * Computes an AI-based integrity score for a project.
 * Checks for greenwashing indicators, methodology alignment, and data consistency.
 *
 * Future: Multi-modal analysis using satellite imagery, MRV data, and LLM reasoning.
 */
export async function integrityScoreFlow(
  input: IntegrityScoreInput
): Promise<IntegrityScoreOutput> {
  await new Promise((r) => setTimeout(r, 1500));

  const sectorScores: Record<string, number> = {
    "Blue Carbon": 95,
    Afforestation: 88,
    "Renewable Energy": 90,
    "Methane Capture": 80,
    "Energy Efficiency": 85,
    "Soil Carbon": 78,
    "Waste Management": 72,
  };

  const baseScore = sectorScores[input.sector] ?? 75;
  const vintageBonus = input.vintage >= 2023 ? 3 : 0;
  const scaleRisk = input.co2Reduction > 200000 ? -5 : 0; // Very large projects get scrutiny

  const finalScore = Math.min(100, Math.max(0, baseScore + vintageBonus + scaleRisk));

  const riskLevel =
    finalScore >= 85 ? "low" : finalScore >= 70 ? "medium" : "high";

  return {
    projectId: input.projectId,
    integrityScore: finalScore,
    riskLevel,
    findings: [
      `Methodology ${input.methodology} is recognized under BIS/MoEFCC framework.`,
      `Location ${input.location} has verifiable land-use change records.`,
      `CO₂ reduction of ${input.co2Reduction.toLocaleString("en-IN")} tCO₂e is within plausible range for sector.`,
      riskLevel === "high"
        ? "⚠ Additional third-party verification recommended before credit issuance."
        : "No major greenwashing indicators detected.",
    ],
    recommendations: [
      "Submit satellite imagery baseline from 2019–2021 for permanence verification.",
      "Ensure 3rd-party MRV audit is completed by an accredited agency (DNV, Bureau Veritas).",
      finalScore < 80
        ? "Consider co-registering with Gold Standard to improve credit market value."
        : "Project meets BCX quality threshold. Proceed to registry approval.",
    ],
    validatedAt: new Date().toISOString(),
    model: "bcx-integrity-v1-mock (Genkit/VertexAI ready)",
  };
}

// ─── Flow: marketPriceFlow ────────────────────────────────────────────────────
/**
 * Predicts fair market price for carbon credits based on project attributes.
 * Future: Fine-tuned regression model on BCX trading history.
 */
export async function marketPriceFlow(input: {
  sector: string;
  integrityScore: number;
  vintage: number;
  sdgGoals: number[];
}): Promise<{ suggestedPrice: number; priceRange: [number, number] }> {
  await new Promise((r) => setTimeout(r, 800));

  const sectorBase: Record<string, number> = {
    "Blue Carbon": 1150,
    Afforestation: 680,
    "Renewable Energy": 820,
    "Methane Capture": 900,
    "Energy Efficiency": 720,
    "Soil Carbon": 640,
    "Waste Management": 680,
  };

  const base = sectorBase[input.sector] ?? 750;
  const scoreMult = 0.8 + (input.integrityScore / 100) * 0.4;
  const sdgBonus = input.sdgGoals.length * 15;
  const vintageDiscount = input.vintage < 2022 ? -50 : 0;

  const suggested = Math.round(base * scoreMult + sdgBonus + vintageDiscount);
  return {
    suggestedPrice: suggested,
    priceRange: [Math.round(suggested * 0.85), Math.round(suggested * 1.15)],
  };
}
