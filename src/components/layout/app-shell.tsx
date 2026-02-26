"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import type { UserRole } from "@/lib/types";

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────
const Icon = ({
  path,
  size = 18,
  className = "",
}: {
  path: string;
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d={path} />
  </svg>
);

const ICONS = {
  dashboard:
    "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  projects:
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6",
  marketplace: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18",
  ledger: "M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  credits: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  ai: "M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 16a2 2 0 0 1 2 2v2a2 2 0 0 1-4 0v-2a2 2 0 0 1 2-2z M2 12a2 2 0 0 1 2-2h2a2 2 0 0 1 0 4H4a2 2 0 0 1-2-2z M16 12a2 2 0 0 1 2-2h2a2 2 0 0 1 0 4h-2a2 2 0 0 1-2-2z",
  history: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  cart: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0",
  profile: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  menu: "M3 12h18 M3 6h18 M3 18h18",
  x: "M18 6L6 18 M6 6l12 12",
  chevronRight: "M9 18l6-6-6-6",
  alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  register: "M12 5v14 M5 12h14",
  globe: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
};

// ─── Nav config per role ──────────────────────────────────────────────────────
const NAV_CONFIG: Record<UserRole, { label: string; href: string; icon: keyof typeof ICONS }[]> = {
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
    { label: "Projects", href: "/admin/projects", icon: "projects" },
    { label: "Credits", href: "/admin/credits", icon: "credits" },
    { label: "Marketplace", href: "/marketplace", icon: "marketplace" },
    { label: "Ledger", href: "/ledger", icon: "ledger" },
    { label: "AI Assistant", href: "/ai-assistant", icon: "ai" },
    { label: "Profile", href: "/profile", icon: "profile" },
  ],
  developer: [
    { label: "Dashboard", href: "/developer/dashboard", icon: "dashboard" },
    { label: "My Projects", href: "/developer/projects", icon: "projects" },
    { label: "Register Project", href: "/developer/register-project", icon: "register" },
    { label: "Marketplace", href: "/marketplace", icon: "marketplace" },
    { label: "Ledger", href: "/ledger", icon: "ledger" },
    { label: "AI Assistant", href: "/ai-assistant", icon: "ai" },
    { label: "Profile", href: "/profile", icon: "profile" },
  ],
  buyer: [
    { label: "Dashboard", href: "/buyer/dashboard", icon: "dashboard" },
    { label: "Marketplace", href: "/marketplace", icon: "marketplace" },
    { label: "My Portfolio", href: "/buyer/history", icon: "history" },
    { label: "Ledger", href: "/ledger", icon: "ledger" },
    { label: "AI Assistant", href: "/ai-assistant", icon: "ai" },
    { label: "Profile", href: "/profile", icon: "profile" },
  ],
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Registry Admin",
  developer: "Project Developer",
  buyer: "Credit Buyer",
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin: "bg-purple-100 text-purple-700",
  developer: "bg-green-100 text-green-700",
  buyer: "bg-blue-100 text-blue-700",
};

// ─── App Shell ────────────────────────────────────────────────────────────────
export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { totalItems, totalValue } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <>{children}</>;

  const nav = NAV_CONFIG[user.role];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-none">BCX</p>
            <p className="text-[10px] text-slate-500 leading-none mt-0.5">Bharat Carbon Exchange</p>
          </div>
        </div>
      </div>

      {/* User Badge */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-600">
            {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
            <span className={`bcx-badge text-[10px] mt-0.5 ${ROLE_COLORS[user.role]}`}>
              {ROLE_LABELS[user.role]}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {nav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`bcx-sidebar-item ${isActive ? "active" : ""}`}
            >
              <Icon path={ICONS[item.icon]} size={16} />
              {item.label}
              {isActive && (
                <Icon path={ICONS.chevronRight} size={14} className="ml-auto opacity-50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Cart indicator (buyer only) */}
      {user.role === "buyer" && totalItems > 0 && (
        <div className="px-3 pb-2">
          <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2.5 flex items-center gap-2">
            <Icon path={ICONS.cart} size={16} className="text-blue-600" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-blue-900">{totalItems} credits in cart</p>
              <p className="text-[11px] text-blue-600">₹{totalValue.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="px-3 pb-4 pt-2 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="bcx-sidebar-item w-full text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Icon path={ICONS.logout} size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-slate-50 border-r border-slate-200">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 bg-white flex flex-col shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center gap-4 px-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-md hover:bg-slate-100 text-slate-600"
          >
            <Icon path={ICONS.menu} size={20} />
          </button>

          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-slate-900 truncate">
              {nav.find(
                (n) => pathname === n.href || pathname.startsWith(n.href + "/")
              )?.label ?? "BCX Platform"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Status badge */}
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-soft" />
              Live
            </span>

            {/* India flag accent */}
            <span className="hidden md:block text-xs text-slate-500">
              🇮🇳 MoEFCC Certified
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
