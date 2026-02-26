// ─── Domain Types ────────────────────────────────────────────────────────────

export type UserRole = "admin" | "developer" | "buyer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  createdAt: string;
}

export type ProjectStatus = "draft" | "pending" | "approved" | "rejected" | "active";
export type ProjectSector =
  | "Renewable Energy"
  | "Afforestation"
  | "Methane Capture"
  | "Energy Efficiency"
  | "Blue Carbon"
  | "Soil Carbon"
  | "Waste Management";

export interface CarbonProject {
  id: string;
  name: string;
  developerId: string;
  developerName: string;
  sector: ProjectSector;
  location: string;
  state: string;
  vintage: number; // year
  totalCredits: number;
  availableCredits: number;
  pricePerCredit: number; // INR
  status: ProjectStatus;
  integrityScore: number; // 0–100
  methodology: string;
  description: string;
  co2Reduction: number; // tonnes CO2e
  sdgGoals: number[];
  createdAt: string;
  approvedAt?: string;
  imageUrl?: string;
}

export interface CarbonCredit {
  id: string;
  projectId: string;
  serialNumber: string;
  vintage: number;
  quantity: number;
  status: "issued" | "traded" | "retired";
  issuedTo?: string;
  issuedAt: string;
  retiredAt?: string;
  retiredBy?: string;
}

export type TransactionType = "issuance" | "transfer" | "retirement" | "purchase";

export interface Transaction {
  id: string;
  type: TransactionType;
  projectId: string;
  projectName: string;
  from: string;
  to: string;
  quantity: number;
  pricePerCredit?: number;
  totalValue?: number;
  timestamp: string;
  blockHash?: string;
  status: "confirmed" | "pending" | "failed";
}

export interface AdminStats {
  totalCreditsIssued: number;
  totalCreditsTraded: number;
  totalCreditsRetired: number;
  pendingApprovals: number;
  activeProjects: number;
  registeredDevelopers: number;
  registeredBuyers: number;
  monthlyVolume: { month: string; volume: number; value: number }[];
}

export interface ComplianceAlert {
  id: string;
  type: "warning" | "critical" | "info";
  entity: string;
  message: string;
  projectId?: string;
  timestamp: string;
  resolved: boolean;
}

export interface BuyerPortfolio {
  totalCreditsOwned: number;
  totalCreditsRetired: number;
  totalSpent: number;
  carbonOffset: number;
  holdings: {
    projectId: string;
    projectName: string;
    sector: ProjectSector;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
    purchasedAt: string;
  }[];
}

export interface AIValidationResult {
  projectId: string;
  integrityScore: number;
  riskLevel: "low" | "medium" | "high";
  findings: string[];
  recommendations: string[];
  validatedAt: string;
  model: string;
}

export interface CartItem {
  projectId: string;
  projectName: string;
  quantity: number;
  pricePerCredit: number;
}
