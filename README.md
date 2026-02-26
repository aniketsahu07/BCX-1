# 🌱 BCX — Bharat Carbon Exchange

> **India's Official Carbon Credit Registry, Marketplace, and Compliance Dashboard**
> Built on Next.js 15 App Router · Phase 1: Frontend-first with mock data layer

---

## 🏗️ Architecture Overview

```
BCX Platform (Next.js 15)
├── Role-Based Access Control (Admin / Developer / Buyer)
├── Server Actions (Mock → PostgreSQL / Microservices)
├── GenAI Layer (Mock → Genkit + Vertex AI)
└── UI: ShadCN-compatible components + Tailwind CSS
```

---

## 🚀 Quick Start

```bash
npm install
npm run dev
# → http://localhost:3000
```

### Demo Credentials

| Role | Email | Password | Redirects to |
|------|-------|----------|-------------|
| 🏛️ Admin | `admin@bcx.gov.in` | `Admin@123` | `/admin/dashboard` |
| 🌱 Developer | `dev@greenenergy.in` | `Dev@123` | `/developer/dashboard` |
| 🏢 Buyer | `buyer@tatasteel.com` | `Buyer@123` | `/buyer/dashboard` |

---

## 📁 Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── admin/
│   │   ├── dashboard/          # Registry stats + compliance alerts
│   │   ├── projects/           # Review & approve projects
│   │   └── credits/            # Issue / retire carbon credits
│   ├── developer/
│   │   ├── dashboard/          # Analytics overview + quick actions
│   │   ├── projects/           # Project list table
│   │   └── register-project/   # 3-step registration form
│   ├── buyer/
│   │   ├── dashboard/          # Portfolio summary + net zero progress
│   │   └── history/            # Purchase & retirement history
│   ├── marketplace/            # Credit marketplace with search + filters
│   ├── ledger/                 # Public transaction ledger
│   ├── ai-assistant/           # AI validation flows (Genkit-ready)
│   └── profile/                # User profile settings
│
├── actions/
│   └── actions.ts              # All server actions (data access layer)
│
├── components/
│   └── layout/
│       └── app-shell.tsx       # Sidebar + header + role-aware nav
│
├── context/
│   ├── AuthContext.tsx         # Mock auth + session management
│   └── CartContext.tsx         # Buyer cart state
│
└── lib/
    ├── types.ts                # Domain TypeScript models
    ├── mock-data.ts            # Phase 1 data store
    └── ai-flows.ts             # Genkit-structured AI flows
```

---

## 🎯 Feature Matrix

### Admin / Registry Authority
- ✅ Statistics dashboard (credits issued, traded, retired, pending)
- ✅ Monthly volume bar chart
- ✅ Compliance alerts table (critical/warning/info)
- ✅ Project review with approve/reject actions
- ✅ Carbon credit issuance with serial number generation

### Project Developer
- ✅ Analytics overview with revenue estimates
- ✅ Project portfolio cards (integrity score, credits sold progress)
- ✅ Project table with all attributes
- ✅ 3-step project registration form (Info → Methodology → Credits)
- ✅ SDG goal alignment selection

### Buyer
- ✅ Portfolio dashboard (holdings, P&L, net zero progress)
- ✅ Purchase & retirement history
- ✅ Marketplace integration with cart

### Marketplace
- ✅ Search + sector filters + sort (price/score/availability)
- ✅ Project cards with integrity score bars
- ✅ Add to cart with quantity selector
- ✅ Cart state management

### Public Ledger
- ✅ Immutable transaction log
- ✅ Search by project, entity, block hash
- ✅ Transaction type badges (issuance/purchase/transfer/retirement)

### AI Assistant (Genkit-ready)
- ✅ Integrity Score Flow
- ✅ Project Validation Flow
- ✅ Market Price Flow
- ✅ Mock outputs with LLM-ready structure

---

## 🔌 Future-Proof Architecture

### Phase 2: Real Database
```typescript
// Replace in actions/actions.ts:
// BEFORE (mock):
return MOCK_PROJECTS.filter(p => p.status === 'active')

// AFTER (Prisma/PostgreSQL):
return await prisma.project.findMany({ where: { status: 'active' } })
```

### Phase 2: JWT Authentication
```typescript
// Replace in actions/actions.ts loginUser():
// Generate JWT, set httpOnly cookie
const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET)
cookies().set('bcx_token', token, { httpOnly: true, secure: true })
```

### Phase 3: Genkit AI Integration
```typescript
// Replace in lib/ai-flows.ts:
const integrityScoreFlow = defineFlow(
  { name: 'integrityScore', inputSchema: ..., outputSchema: ... },
  async (input) => {
    const response = await generate({
      model: gemini15Pro,
      prompt: buildIntegrityPrompt(input),
    });
    return parseScore(response);
  }
);
```

### Phase 4: Blockchain Ledger
```typescript
// Add to actions/actions.ts after credit issuance:
await bcxContract.issueCredits(projectId, quantity, serialNumbers)
// Transaction hash recorded immutably on Polygon/Ethereum
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `green-600` (#16a34a) | CTAs, active states |
| Background | `white` | Page backgrounds |
| Surface | `slate-50` | Cards, sidebar |
| Border | `slate-200` | All borders |
| Accent | `blue-500` | Links, portfolio data |
| Warning | `amber-500` | Pending status |
| Danger | `red-500` | Rejected/critical |

**Typography**: DM Sans (UI) + DM Mono (codes, numbers)

---

## 🛡️ Security Roadmap

- Phase 1: Client-side sessionStorage (demo only)
- Phase 2: httpOnly JWT cookies + CSRF tokens
- Phase 3: RBAC middleware in Next.js Middleware
- Phase 4: Rate limiting, WAF, CERT-In compliance audit

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| State | React Context + Server Actions |
| AI (future) | Genkit + Vertex AI Gemini |
| DB (future) | PostgreSQL + Prisma |
| Auth (future) | JWT + httpOnly cookies |
| Ledger (future) | Polygon blockchain |

---

## 🇮🇳 BCX Compliance

- MoEFCC (Ministry of Environment, Forest & Climate Change) certified framework
- BIS standards for carbon accounting
- ISO 14064 methodology alignment
- Paris Agreement NDC tracking ready

---

*BCX Platform v1.0 · Phase 1 Frontend · Built for future-proof enterprise carbon trading*
