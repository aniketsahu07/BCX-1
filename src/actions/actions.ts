"use server";

/**
 * BCX Server Actions
 *
 * Currently reads from mock data in lib/mock-data.ts.
 * Designed for future replacement with:
 *   - PostgreSQL via Prisma / Drizzle
 *   - JWT-authenticated API calls
 *   - Microservice endpoints
 */

import {
  MOCK_USERS,
  MOCK_PROJECTS,
  MOCK_TRANSACTIONS,
  MOCK_ADMIN_STATS,
  MOCK_COMPLIANCE_ALERTS,
  MOCK_BUYER_PORTFOLIO,
  DEMO_CREDENTIALS,
} from "@/lib/mock-data";
import type {
  User,
  CarbonProject,
  Transaction,
  AdminStats,
  ComplianceAlert,
  BuyerPortfolio,
  ProjectStatus,
} from "@/lib/types";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 400));

  const cred = DEMO_CREDENTIALS.find(
    (c) => c.email === email && c.password === password
  );

  if (!cred) {
    return { success: false, error: "Invalid email or password." };
  }

  const user = MOCK_USERS.find((u) => u.email === email);
  if (!user) {
    return { success: false, error: "User record not found." };
  }

  // In production: create JWT, set httpOnly cookie
  return { success: true, user };
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStats> {
  await new Promise((r) => setTimeout(r, 200));
  // Future: SELECT aggregates from credits, projects, users tables
  return MOCK_ADMIN_STATS;
}

export async function getComplianceAlerts(): Promise<ComplianceAlert[]> {
  await new Promise((r) => setTimeout(r, 150));
  return MOCK_COMPLIANCE_ALERTS;
}

export async function approveProject(
  projectId: string
): Promise<{ success: boolean }> {
  await new Promise((r) => setTimeout(r, 300));
  // Future: UPDATE projects SET status='approved' WHERE id=projectId
  console.log(`[BCX] Approving project: ${projectId}`);
  return { success: true };
}

export async function rejectProject(
  projectId: string,
  reason: string
): Promise<{ success: boolean }> {
  await new Promise((r) => setTimeout(r, 300));
  console.log(`[BCX] Rejecting project: ${projectId}, reason: ${reason}`);
  return { success: true };
}

export async function issueCredits(
  projectId: string,
  quantity: number
): Promise<{ success: boolean; serialNumbers?: string[] }> {
  await new Promise((r) => setTimeout(r, 500));
  // Future: INSERT into carbon_credits, emit blockchain event
  const serials = Array.from(
    { length: Math.min(quantity, 5) },
    (_, i) =>
      `BCX-${projectId.toUpperCase()}-2024-${String(i + 1001).padStart(4, "0")}`
  );
  return { success: true, serialNumbers: serials };
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getProjects(filters?: {
  status?: ProjectStatus;
  developerId?: string;
  sector?: string;
}): Promise<CarbonProject[]> {
  await new Promise((r) => setTimeout(r, 200));
  // Future: SELECT * FROM projects WHERE ... LIMIT ... OFFSET ...
  let projects = [...MOCK_PROJECTS];

  if (filters?.status) {
    projects = projects.filter((p) => p.status === filters.status);
  }
  if (filters?.developerId) {
    projects = projects.filter((p) => p.developerId === filters.developerId);
  }
  if (filters?.sector) {
    projects = projects.filter((p) => p.sector === filters.sector);
  }

  return projects;
}

export async function getProjectById(
  id: string
): Promise<CarbonProject | null> {
  await new Promise((r) => setTimeout(r, 150));
  return MOCK_PROJECTS.find((p) => p.id === id) ?? null;
}

export async function registerProject(
  data: Partial<CarbonProject>
): Promise<{ success: boolean; projectId?: string; error?: string }> {
  await new Promise((r) => setTimeout(r, 600));
  // Future: INSERT into projects, trigger AI validation flow
  const newId = `prj${Date.now()}`;
  console.log(`[BCX] Registering project:`, data);
  return { success: true, projectId: newId };
}

// ─── Marketplace ──────────────────────────────────────────────────────────────

export async function getMarketplaceData(filters?: {
  sector?: string;
  minPrice?: number;
  maxPrice?: number;
  minScore?: number;
}): Promise<CarbonProject[]> {
  await new Promise((r) => setTimeout(r, 250));
  // Future: SELECT * FROM projects JOIN credits ON ... WHERE status='active'
  let projects = MOCK_PROJECTS.filter((p) => p.status === "active");

  if (filters?.sector) {
    projects = projects.filter((p) => p.sector === filters.sector);
  }
  if (filters?.minPrice !== undefined) {
    projects = projects.filter((p) => p.pricePerCredit >= filters.minPrice!);
  }
  if (filters?.maxPrice !== undefined) {
    projects = projects.filter((p) => p.pricePerCredit <= filters.maxPrice!);
  }
  if (filters?.minScore !== undefined) {
    projects = projects.filter((p) => p.integrityScore >= filters.minScore!);
  }

  return projects;
}

export async function purchaseCredits(
  projectId: string,
  quantity: number,
  buyerId: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  await new Promise((r) => setTimeout(r, 800));
  // Future: BEGIN TRANSACTION → check availability → debit buyer → credit developer → record tx → COMMIT
  const txId = `txn${Date.now()}`;
  console.log(`[BCX] Purchase: ${quantity} credits from ${projectId} by ${buyerId}`);
  return { success: true, transactionId: txId };
}

// ─── Ledger ───────────────────────────────────────────────────────────────────

export async function getLedgerTransactions(page = 1, pageSize = 20): Promise<{
  transactions: Transaction[];
  total: number;
}> {
  await new Promise((r) => setTimeout(r, 200));
  // Future: SELECT * FROM transactions ORDER BY timestamp DESC LIMIT pageSize OFFSET (page-1)*pageSize
  const sorted = [...MOCK_TRANSACTIONS].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  return { transactions: sorted, total: sorted.length };
}

// ─── Buyer ────────────────────────────────────────────────────────────────────

export async function getBuyerPortfolio(
  buyerId: string
): Promise<BuyerPortfolio> {
  await new Promise((r) => setTimeout(r, 200));
  // Future: SELECT SUM(quantity) FROM holdings WHERE buyer_id=buyerId
  return MOCK_BUYER_PORTFOLIO;
}

export async function retireCredits(
  projectId: string,
  quantity: number,
  buyerId: string,
  reason: string
): Promise<{ success: boolean; retirementId?: string }> {
  await new Promise((r) => setTimeout(r, 500));
  // Future: UPDATE credits SET status='retired', retired_at=NOW() WHERE ...
  const retirementId = `RET-${Date.now()}`;
  console.log(`[BCX] Retiring ${quantity} credits from project ${projectId}`);
  return { success: true, retirementId };
}
