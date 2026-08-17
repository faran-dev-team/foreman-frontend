"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const C = {
  navy: "#0A0F1C",
  slate: "#141C30",
  orange: "#F97A35",
  green: "#1FAA59",
  muted: "#B8BFCC",
  amber: "#FBBF24",
} as const;

// ─── Data ──────────────────────────────────────────────────────────────────────
const revenueData = [
  { label: "Mon", revenue: 1200, jobs: "2 booked", calls: "4 calls" },
  { label: "Tue", revenue: 1850, jobs: "4 booked", calls: "6 calls" },
  { label: "Wed", revenue: 1400, jobs: "3 booked", calls: "5 calls" },
  { label: "Thu", revenue: 2200, jobs: "5 booked", calls: "8 calls" },
  { label: "Fri", revenue: 3100, jobs: "11 booked", calls: "14 calls" },
  { label: "Sat", revenue: 950, jobs: "2 booked", calls: "3 calls" },
  { label: "Sun", revenue: 580, jobs: "1 booked", calls: "2 calls" },
];

const jobStatusData = [
  { name: "Completed", value: 14, fill: C.green, percentage: "58%" },
  { name: "Pending", value: 7, fill: C.amber, percentage: "29%" },
  { name: "Cancelled", value: 3, fill: "#64748B", percentage: "13%" },
];

// ─── Track 1 Tour: Top Row (Revenue Bars & Job Status Donut) ───────────────────
const TOP_ROW_TOUR = [
  { target: "bar" as const, index: 0, title: "Monday", val: "$1,200" },
  { target: "bar" as const, index: 1, title: "Tuesday", val: "$1,850" },
  { target: "bar" as const, index: 2, title: "Wednesday", val: "$1,400" },
  { target: "bar" as const, index: 3, title: "Thursday", val: "$2,200" },
  { target: "bar" as const, index: 4, title: "Friday (Peak)", val: "$3,100" },
  { target: "bar" as const, index: 5, title: "Saturday", val: "$950" },
  { target: "bar" as const, index: 6, title: "Sunday", val: "$580" },
  { target: "donut" as const, index: 0, title: "Completed Jobs", val: "14 (58%)" },
  { target: "donut" as const, index: 1, title: "Pending Dispatch", val: "7 (29%)" },
];

// ─── Track 2 Tour: Bottom Row (Live Transcript & Weekly Reports) ───────────────
const BOTTOM_ROW_TOUR = [
  { target: "caller_info" as const, title: "Caller Intake", val: "David M. · (512) 993-2104" },
  { target: "waveform" as const, title: "Audio Stream", val: "Active (1m 42s)" },
  { target: "ai_bubble" as const, title: "AI Booking", val: "10:00 AM Slot Confirmed" },
  { target: "kpi_answer" as const, title: "Answer Rate", val: "98.6% (141 of 143)" },
  { target: "kpi_value" as const, title: "Captured Revenue", val: "$11,280 (42 Jobs)" },
  { target: "lead_bar" as const, title: "Lead Conversion", val: "87.4% (Target: 80%)" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function fmt$(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function TrendPill({ value, suffix = "" }: { value: string; suffix?: string }) {
  const positive = !value.startsWith("-");
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
        positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
      }`}
    >
      {positive ? (
        <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="currentColor"><path d="M6 2l4 5H2l4-5z" /></svg>
      ) : (
        <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="currentColor"><path d="M6 10l4-5H2l4 5z" /></svg>
      )}
      {value}{suffix}
    </span>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  trend,
  sub,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-3.5 shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        accent
          ? "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50"
          : "border-slate-200/90 bg-white"
      }`}
    >
      {accent && (
        <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-orange-100/60" />
      )}
      <div className="flex items-start justify-between">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            accent ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          {icon}
        </div>
        <TrendPill value={trend} />
      </div>
      <p className="mt-2.5 text-xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-slate-600">{label}</p>
      <p className="mt-0.5 text-[11px] text-slate-400">{sub}</p>
    </div>
  );
}

// ─── Section Card Wrapper ──────────────────────────────────────────────────────
function SectionCard({
  title,
  desc,
  badge,
  action,
  children,
}: {
  title: string;
  desc?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative rounded-xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs flex flex-col justify-between h-full transition-all duration-200 hover:border-slate-300">
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0 flex-wrap sm:flex-nowrap">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 whitespace-nowrap">{title}</h3>
            {badge}
          </div>
          {action}
        </div>
        {desc && <p className="mt-0.5 text-[11px] text-slate-500 truncate">{desc}</p>}
      </div>
      <div className="mt-3 flex-1 flex flex-col justify-between">{children}</div>
    </div>
  );
}

// ─── Main Component with 2 Concurrent Pointer Animations ────────────────────────
export function DashboardOverview({ preview = false }: { preview?: boolean }) {
  // Track 1 (Top Row Tour)
  const [topIndex, setTopIndex] = useState(0);
  const [isTopHovered, setIsTopHovered] = useState(false);
  const [userHoveredBar, setUserHoveredBar] = useState<number | null>(null);
  const [userHoveredSlice, setUserHoveredSlice] = useState<number | null>(null);
  const [topPointerPos, setTopPointerPos] = useState<{ x: number; y: number } | null>(null);

  // Track 2 (Bottom Row Tour)
  const [bottomIndex, setBottomIndex] = useState(0);
  const [isBottomHovered, setIsBottomHovered] = useState(false);
  const [bottomPointerPos, setBottomPointerPos] = useState<{ x: number; y: number } | null>(null);

  // User manual hover tooltip
  const [customHoverTip, setCustomHoverTip] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const topTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bottomTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Loop Track 1 (Top Row)
  useEffect(() => {
    if (isTopHovered) return;
    const interval = setInterval(() => {
      setTopIndex((prev) => (prev + 1) % TOP_ROW_TOUR.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isTopHovered]);

  // Loop Track 2 (Bottom Row)
  useEffect(() => {
    if (isBottomHovered) return;
    const interval = setInterval(() => {
      setBottomIndex((prev) => (prev + 1) % BOTTOM_ROW_TOUR.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isBottomHovered]);

  const resetTopTimer = () => {
    if (topTimerRef.current) clearTimeout(topTimerRef.current);
    topTimerRef.current = setTimeout(() => {
      setIsTopHovered(false);
    }, 2600);
  };

  const resetBottomTimer = () => {
    if (bottomTimerRef.current) clearTimeout(bottomTimerRef.current);
    bottomTimerRef.current = setTimeout(() => {
      setIsBottomHovered(false);
      setCustomHoverTip(null);
    }, 2600);
  };

  const currentTopStep = TOP_ROW_TOUR[topIndex];
  const currentBottomStep = BOTTOM_ROW_TOUR[bottomIndex];

  const activeBarIndex = userHoveredBar !== null ? userHoveredBar : (currentTopStep.target === "bar" ? currentTopStep.index : null);
  const activeSliceIndex = userHoveredSlice !== null ? userHoveredSlice : (currentTopStep.target === "donut" ? currentTopStep.index : null);
  const activeSliceData = activeSliceIndex !== null ? jobStatusData[activeSliceIndex] : null;

  // Compute exact coordinates for Pointer 1 (Top Row)
  const updateTopPointerPosition = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const step = TOP_ROW_TOUR[topIndex];

    let targetEl: Element | null = null;
    if (step.target === "bar") {
      targetEl = containerRef.current.querySelector(`#dashboard-tour-bar-${step.index}`);
    } else if (step.target === "donut") {
      targetEl = containerRef.current.querySelector(`#dashboard-tour-slice-${step.index}`);
    }

    if (targetEl) {
      const targetRect = targetEl.getBoundingClientRect();
      if (targetRect.width > 0 && targetRect.height > 0) {
        if (step.target === "bar") {
          setTopPointerPos({
            x: targetRect.left - containerRect.left + targetRect.width / 2,
            y: targetRect.top - containerRect.top,
          });
        } else if (step.target === "donut") {
          setTopPointerPos({
            x: targetRect.left - containerRect.left + targetRect.width / 2,
            y: targetRect.top - containerRect.top + targetRect.height / 2,
          });
        }
      }
    }
  }, [topIndex]);

  // Compute exact coordinates for Pointer 2 (Bottom Row)
  const updateBottomPointerPosition = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const step = BOTTOM_ROW_TOUR[bottomIndex];

    let targetEl: Element | null = null;
    if (step.target === "caller_info") {
      targetEl = containerRef.current.querySelector("#dashboard-tour-caller-info");
    } else if (step.target === "waveform") {
      targetEl = containerRef.current.querySelector("#dashboard-tour-waveform");
    } else if (step.target === "ai_bubble") {
      targetEl = containerRef.current.querySelector("#dashboard-tour-ai-bubble");
    } else if (step.target === "kpi_answer") {
      targetEl = containerRef.current.querySelector("#dashboard-tour-kpi-answer");
    } else if (step.target === "kpi_value") {
      targetEl = containerRef.current.querySelector("#dashboard-tour-kpi-value");
    } else if (step.target === "lead_bar") {
      targetEl = containerRef.current.querySelector("#dashboard-tour-lead-bar");
    }

    if (targetEl) {
      const targetRect = targetEl.getBoundingClientRect();
      if (targetRect.width > 0 && targetRect.height > 0) {
        setBottomPointerPos({
          x: targetRect.left - containerRect.left + Math.min(160, targetRect.width * 0.5),
          y: targetRect.top - containerRect.top + targetRect.height / 2,
        });
      }
    }
  }, [bottomIndex]);

  useEffect(() => {
    updateTopPointerPosition();
    updateBottomPointerPosition();
    const rafId = requestAnimationFrame(() => {
      updateTopPointerPosition();
      updateBottomPointerPosition();
    });
    const timerId = setTimeout(() => {
      updateTopPointerPosition();
      updateBottomPointerPosition();
    }, 100);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [topIndex, bottomIndex, updateTopPointerPosition, updateBottomPointerPosition]);

  return (
    <div className="space-y-3.5">

      {/* Header */}
      {!preview && (
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Dashboard</h2>
          <p className="text-xs text-slate-500">
            Real-time overview · Last updated <span className="font-medium text-slate-700">Just now</span>
          </p>
        </div>
      </div>
      )}

      {/* Stat cards */}
      {!preview && (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          accent
          icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 15.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
          label="Calls Today"
          value="24"
          trend="+18%"
          sub="vs yesterday · 20 calls"
        />
        <StatCard
          icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
          label="Answer Rate"
          value="98.6%"
          trend="+3.2%"
          sub="AI handled 23 of 24 calls"
        />
        <StatCard
          icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          label="Jobs Booked"
          value="7"
          trend="+40%"
          sub="vs yesterday · 5 jobs"
        />
        <StatCard
          icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Revenue"
          value="$4,250"
          trend="+28%"
          sub="vs yesterday · $3,320"
        />
      </div>
      )}

      {/* Main Interactive Dashboard 2-Row x 2-Col Grid Layout */}
      <div ref={containerRef} className="relative space-y-3">

        {/* ─── POINTER ANIMATION 1: TOP ROW (Revenue & Job Status) ─── */}
        {!isTopHovered && topPointerPos && (
          <motion.div
            initial={false}
            animate={{ x: topPointerPos.x, y: topPointerPos.y }}
            transition={{ type: "spring", stiffness: 90, damping: 18, mass: 0.5 }}
            style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 50 }}
            className="hidden sm:block"
          >
            <div style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.25))" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transform: "translate(-2px, -2px) rotate(-8deg)", transformOrigin: "2px 2px" }}>
                <path d="M3 3l7.5 17.5 3-6.5 6.5-3L3 3z" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <motion.div
              layout
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{
                position: "absolute",
                left: topPointerPos.x > (containerRef.current ? containerRef.current.clientWidth - 160 : 600) ? -150 : 14,
                top: 2,
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: 6,
                boxShadow: "0 4px 14px rgba(10,15,28,0.08)",
                padding: "4px 8px",
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F97A35]" />
                <span className="text-[10px] font-semibold text-slate-800">{currentTopStep.title}:</span>
                <span className="text-[10px] font-bold text-slate-950">{currentTopStep.val}</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ─── POINTER ANIMATION 2: BOTTOM ROW (Live Transcript & Reports) ─── */}
        {!isBottomHovered && bottomPointerPos && (
          <motion.div
            initial={false}
            animate={{ x: bottomPointerPos.x, y: bottomPointerPos.y }}
            transition={{ type: "spring", stiffness: 90, damping: 18, mass: 0.5 }}
            style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 50 }}
            className="hidden sm:block"
          >
            <div style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.25))" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ transform: "translate(-2px, -2px) rotate(-8deg)", transformOrigin: "2px 2px" }}>
                <path d="M3 3l7.5 17.5 3-6.5 6.5-3L3 3z" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
              </svg>
            </div>
            <motion.div
              layout
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{
                position: "absolute",
                left: bottomPointerPos.x > (containerRef.current ? containerRef.current.clientWidth - 170 : 600) ? -160 : 14,
                top: 2,
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: 6,
                boxShadow: "0 4px 14px rgba(10,15,28,0.08)",
                padding: "4px 8px",
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1FAA59]" />
                <span className="text-[10px] font-semibold text-slate-800">{currentBottomStep.title}:</span>
                <span className="text-[10px] font-bold text-slate-950">{currentBottomStep.val}</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── ROW 1: 2 COLUMNS (Revenue by Day & Job Status Breakdown) ── */}
        <div
          className="grid gap-3 lg:grid-cols-2"
          onMouseEnter={() => setIsTopHovered(true)}
          onMouseLeave={resetTopTimer}
        >
          {/* Box 1: Revenue by Day */}
          <SectionCard title="Revenue by Day" desc="Estimated job value captured this week">
            <div className="relative h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 2, right: 2, left: -24, bottom: -4 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="label" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#CBD5E1", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    formatter={(val: number) => [fmt$(val), "Revenue"]}
                    contentStyle={{ borderRadius: 6, border: "1px solid #E2E8F0", padding: "3px 6px", fontSize: 11 }}
                    cursor={{ fill: "rgba(249,122,53,0.06)" }}
                  />
                  <Bar
                    dataKey="revenue"
                    radius={[6, 6, 3, 3]}
                    maxBarSize={34}
                    shape={(props: any) => {
                      const { index } = props;
                      const isActive = activeBarIndex === index;
                      const isFriday = index === 4;
                      const barFill = isActive ? (isFriday ? "#EA580C" : C.orange) : (isFriday ? C.orange : "#CBD5E1");
                      return (
                        <g id={`dashboard-tour-bar-${index}`} key={`tour-bar-${index}`}>
                          <Rectangle {...props} fill={barFill} radius={[6, 6, 3, 3]} style={{ transition: "fill 0.25s ease", filter: isActive ? "drop-shadow(0 4px 10px rgba(249,122,53,0.4))" : "none", cursor: "pointer" }} />
                        </g>
                      );
                    }}
                    onMouseMove={(data) => data && typeof data.activeTooltipIndex === "number" && setUserHoveredBar(data.activeTooltipIndex)}
                    onMouseLeave={() => setUserHoveredBar(null)}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          {/* Box 2: Job Status Breakdown */}
          <SectionCard title="Job Status Breakdown" desc="All jobs booked this week">
            <div className="relative flex h-44 items-center gap-4">
              <div className="relative flex-1">
                <ResponsiveContainer width="100%" height={170}>
                  <PieChart>
                    <Pie data={jobStatusData} dataKey="value" nameKey="name" innerRadius={42} outerRadius={64} paddingAngle={4} stroke="none" onMouseEnter={(_, index) => setUserHoveredSlice(index)} onMouseLeave={() => setUserHoveredSlice(null)}>
                      {jobStatusData.map((entry, i) => (
                        <Cell key={entry.name} id={`dashboard-tour-slice-${i}`} fill={entry.fill} style={{ transform: activeSliceIndex === i ? "scale(1.05)" : "scale(1)", transformOrigin: "center", cursor: "pointer" }} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold tracking-tight text-slate-900">{activeSliceData ? activeSliceData.value : "24"}</span>
                  <span className="text-[9px] font-semibold text-slate-400">{activeSliceData ? `${activeSliceData.name} (${activeSliceData.percentage})` : "Total Jobs"}</span>
                </div>
              </div>
              <ul className="shrink-0 space-y-1.5 pr-1">
                {jobStatusData.map((s, i) => {
                  const isActive = activeSliceIndex === i;
                  return (
                    <li key={s.name} onMouseEnter={() => { setUserHoveredSlice(i); setIsTopHovered(true); }} onMouseLeave={() => { setUserHoveredSlice(null); resetTopTimer(); }} className={`flex items-center gap-2 rounded-md px-2 py-1 transition-all cursor-pointer ${isActive ? "bg-slate-100/90 shadow-2xs ring-1 ring-slate-200" : "hover:bg-slate-50"}`}>
                      <span className="h-2 w-2 rounded-full" style={{ background: s.fill }} />
                      <span className={`text-xs ${isActive ? "font-bold text-slate-900" : "text-slate-600"}`}>{s.name}</span>
                      <span className="ml-auto text-xs font-semibold text-slate-900">{s.value}</span>
                    </li>
                  );
                })}
                <li className="flex items-center gap-2 border-t border-slate-100 pt-1.5 px-2">
                  <span className="text-xs text-slate-500">Total</span>
                  <span className="ml-auto text-xs font-bold text-slate-900">24</span>
                </li>
              </ul>
            </div>
          </SectionCard>
        </div>

        {/* ── ROW 2: 2 COLUMNS (Live Transcript & Weekly Reports - Equal Balanced Height) ── */}
        <div
          className="grid gap-3 lg:grid-cols-2 items-stretch"
          onMouseEnter={() => setIsBottomHovered(true)}
          onMouseLeave={resetBottomTimer}
        >
          {/* Box 3: Live Transcript */}
          <SectionCard
            title="Live Transcript"
            desc="Real-time AI listen session & dialogue capture"
            badge={
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/90 shadow-2xs whitespace-nowrap shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Listen
              </span>
            }
            action={
              <a
                href="/live-transcript"
                className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 transition hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                Open monitor →
              </a>
            }
          >
            <div
              id="dashboard-tour-transcript-box"
              className="h-full flex flex-col justify-between rounded-lg border border-slate-100 bg-slate-50/60 p-3 transition-all duration-300 hover:bg-slate-50/90"
            >
              {/* Header: Clean Caller Info & Live Waveform */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-200/70 pb-2">
                <div
                  id="dashboard-tour-caller-info"
                  className="flex items-center gap-2 cursor-pointer"
                  onMouseEnter={() => { setCustomHoverTip("David Miller · HVAC Call (512) 993-2104"); setIsBottomHovered(true); }}
                  onMouseLeave={() => { setCustomHoverTip(null); resetBottomTimer(); }}
                >
                  <div className="relative flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-white font-bold text-[10px] shadow-xs">
                    AI
                    <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900">David Miller</p>
                      <span className="rounded bg-slate-200/70 px-1 py-0.2 text-[9px] font-semibold text-slate-600">HVAC</span>
                    </div>
                    <p className="text-[10px] text-slate-500">(512) 993-2104 · Inbound</p>
                  </div>
                </div>

                {/* Animated Audio Equalizer Waveform */}
                <div
                  id="dashboard-tour-waveform"
                  className="flex items-center gap-1 rounded-full bg-white px-2 py-0.5 border border-slate-200/80 shadow-2xs cursor-pointer transition hover:border-emerald-300 hover:shadow-xs"
                  onMouseEnter={() => { setCustomHoverTip("Live Audio Stream · Active Transcription"); setIsBottomHovered(true); }}
                  onMouseLeave={() => { setCustomHoverTip(null); resetBottomTimer(); }}
                >
                  <div className="flex items-center gap-0.5 h-2.5">
                    {[40, 85, 30, 95, 60, 80, 45].map((h, idx) => (
                      <motion.span
                        key={idx}
                        className="w-0.5 rounded-full bg-emerald-500"
                        animate={{ height: [`${h * 0.25}%`, `${h}%`, `${h * 0.3}%`] }}
                        transition={{ repeat: Infinity, duration: 0.7 + (idx % 3) * 0.2, ease: "easeInOut" }}
                        style={{ display: "inline-block" }}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-semibold text-emerald-700">1m 42s</span>
                </div>
              </div>

              {/* Sleek Dialogue Messages */}
              <div className="my-2 space-y-1.5 text-xs">
                <div
                  className="rounded-md bg-white p-2 border border-slate-200/70 shadow-2xs transition hover:border-slate-300 cursor-pointer"
                  onMouseEnter={() => { setCustomHoverTip("Caller Speech · AC Malfunction Inquiry"); setIsBottomHovered(true); }}
                  onMouseLeave={() => { setCustomHoverTip(null); resetBottomTimer(); }}
                >
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Caller</p>
                  <p className="text-slate-700 text-[11px] leading-relaxed">&ldquo;AC unit stopped blowing cold air and making a humming sound.&rdquo;</p>
                </div>
                <div
                  id="dashboard-tour-ai-bubble"
                  className={`rounded-md p-2 border shadow-2xs transition cursor-pointer ${
                    currentBottomStep.target === "ai_bubble" && !isBottomHovered
                      ? "bg-orange-100/90 border-orange-300 ring-2 ring-orange-400/40"
                      : "bg-orange-50/80 border-orange-200/60 hover:bg-orange-100/70"
                  }`}
                  onMouseEnter={() => { setCustomHoverTip("Foreman AI Agent · 10:00 AM Slot Confirmed"); setIsBottomHovered(true); }}
                  onMouseLeave={() => { setCustomHoverTip(null); resetBottomTimer(); }}
                >
                  <p className="text-[9px] font-bold text-orange-600 uppercase tracking-wider mb-0.5">Foreman AI</p>
                  <p className="text-slate-900 text-[11px] font-medium leading-relaxed">&ldquo;I have tomorrow at 10:00 AM reserved with senior tech Brad.&rdquo;</p>
                </div>
              </div>

              {/* Symmetrical Bottom Sync Footer */}
              <div
                className="flex items-center justify-between border-t border-slate-200/70 pt-2 text-[11px] text-slate-500 cursor-pointer"
                onMouseEnter={() => { setCustomHoverTip("Auto-synced slot to Google Calendar & Resend SMS"); setIsBottomHovered(true); }}
                onMouseLeave={() => { setCustomHoverTip(null); resetBottomTimer(); }}
              >
                <span className="flex items-center gap-1 font-medium text-slate-700 text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block shadow-2xs" />
                  Auto-Dispatched to Tech Brad
                </span>
                <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-700 border border-emerald-200">
                  Booked $380
                </span>
              </div>
            </div>
          </SectionCard>

          {/* Box 4: Weekly Reports */}
          <SectionCard
            title="Weekly Reports"
            desc="Conversion metrics, revenue capture & dispatch KPIs"
            badge={
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-semibold text-orange-700 border border-orange-200/90 shadow-2xs whitespace-nowrap shrink-0">
                This Week
              </span>
            }
            action={
              <a
                href="/reports"
                className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 transition hover:bg-slate-50 whitespace-nowrap shrink-0"
              >
                View reports →
              </a>
            }
          >
            <div
              id="dashboard-tour-reports-box"
              className="h-full flex flex-col justify-between rounded-lg border border-slate-100 bg-slate-50/60 p-3 transition-all duration-300 hover:bg-slate-50/90"
            >
              {/* Key Report KPI Grid */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div
                  className="rounded-md border border-slate-200/80 bg-white p-2 shadow-2xs transition hover:border-slate-300 hover:shadow-xs cursor-pointer"
                  onMouseEnter={() => { setCustomHoverTip("Total Inbound: 143 Calls (+12% vs last week)"); setIsBottomHovered(true); }}
                  onMouseLeave={() => { setCustomHoverTip(null); resetBottomTimer(); }}
                >
                  <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Total Calls</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">143</p>
                  <p className="text-[9px] font-semibold text-emerald-600 mt-0.2">+12% vs last wk</p>
                </div>
                <div
                  id="dashboard-tour-kpi-answer"
                  className={`rounded-md border p-2 shadow-2xs transition cursor-pointer ${
                    currentBottomStep.target === "kpi_answer" && !isBottomHovered
                      ? "border-emerald-400 bg-emerald-50/80 ring-2 ring-emerald-400/40"
                      : "border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs"
                  }`}
                  onMouseEnter={() => { setCustomHoverTip("AI Answer Rate: 141 of 143 answered instantly"); setIsBottomHovered(true); }}
                  onMouseLeave={() => { setCustomHoverTip(null); resetBottomTimer(); }}
                >
                  <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Answer Rate</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">98.6%</p>
                  <p className="text-[9px] font-semibold text-emerald-600 mt-0.2">141 of 143</p>
                </div>
                <div
                  id="dashboard-tour-kpi-value"
                  className={`rounded-md border p-2 shadow-2xs transition cursor-pointer ${
                    currentBottomStep.target === "kpi_value" && !isBottomHovered
                      ? "border-emerald-400 bg-emerald-50/80 ring-2 ring-emerald-400/40"
                      : "border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs"
                  }`}
                  onMouseEnter={() => { setCustomHoverTip("Total Captured: $11,280 across 42 booked jobs"); setIsBottomHovered(true); }}
                  onMouseLeave={() => { setCustomHoverTip(null); resetBottomTimer(); }}
                >
                  <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Booked Value</p>
                  <p className="text-sm font-bold text-emerald-700 mt-0.5">$11,280</p>
                  <p className="text-[9px] font-semibold text-slate-500 mt-0.2">42 Jobs</p>
                </div>
              </div>

              {/* Conversion Performance Bar */}
              <div
                id="dashboard-tour-lead-bar"
                className={`my-1.5 space-y-1 p-1 rounded-md transition cursor-pointer ${
                  currentBottomStep.target === "lead_bar" && !isBottomHovered
                    ? "bg-orange-100/50 ring-2 ring-orange-400/40"
                    : "hover:bg-slate-100/60"
                }`}
                onMouseEnter={() => { setCustomHoverTip("Lead Conversion: 87.4% (+7.4% higher than 80% target)"); setIsBottomHovered(true); }}
                onMouseLeave={() => { setCustomHoverTip(null); resetBottomTimer(); }}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700">Lead Conversion</span>
                  <span className="font-bold text-emerald-700">87.4% <span className="font-normal text-slate-400 text-[10px]">(Target: 80%)</span></span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-emerald-500 rounded-full" style={{ width: "87.4%" }} />
                </div>
              </div>

              {/* Symmetrical Bottom Sync Footer */}
              <div
                className="flex items-center justify-between border-t border-slate-200/70 pt-2 text-[11px] text-slate-500 cursor-pointer"
                onMouseEnter={() => { setCustomHoverTip("Synced with Google Calendar, Resend SMS & PDF Export"); setIsBottomHovered(true); }}
                onMouseLeave={() => { setCustomHoverTip(null); resetBottomTimer(); }}
              >
                <span className="flex items-center gap-1 font-medium text-slate-700 text-[10px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block shadow-2xs" />
                  Google Calendar & CSV Synced
                </span>
                <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-semibold text-slate-600 border border-slate-200">
                  PDF Ready
                </span>
              </div>
            </div>
          </SectionCard>
        </div>

      </div>

      {/* Interactive Micro-Tooltip Pill when User Hovers Any Element */}
      <AnimatePresence>
        {customHoverTip && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 3 }}
            transition={{ duration: 0.12 }}
            className="flex items-center justify-center"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-0.5 text-[11px] font-medium text-white shadow-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F97A35]" />
              {customHoverTip}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
