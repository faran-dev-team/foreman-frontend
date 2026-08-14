"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Rectangle,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Brand tokens (mirrored from lib/brand) ───────────────────────────────────
const C = {
  navy: "#0A0F1C",
  slate: "#141C30",
  orange: "#F97A35",
  green: "#1FAA59",
  muted: "#B8BFCC",
  sky: "#38BDF8",
  red: "#F87171",
  amber: "#FBBF24",
} as const;

// ─── Dummy data ────────────────────────────────────────────────────────────────
const weeklyCallData = [
  { day: "Mon", calls: 18, answered: 17, booked: 5 },
  { day: "Tue", calls: 22, answered: 21, booked: 7 },
  { day: "Wed", calls: 19, answered: 18, booked: 6 },
  { day: "Thu", calls: 27, answered: 26, booked: 9 },
  { day: "Fri", calls: 31, answered: 30, booked: 11 },
  { day: "Sat", calls: 14, answered: 14, booked: 4 },
  { day: "Sun", calls: 8, answered: 8, booked: 2 },
];

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

const recentCalls = [
  { id: "c1", caller: "Mike Johnson", phone: "(512) 334-9021", service: "AC Repair", time: "2:14 PM", status: "booked", value: "$320" },
  { id: "c2", caller: "Sarah Williams", phone: "(737) 891-4450", service: "Furnace Check", time: "1:47 PM", status: "booked", value: "$185" },
  { id: "c3", caller: "Unknown", phone: "(210) 556-7823", service: "General Inquiry", time: "1:02 PM", status: "missed", value: "—" },
  { id: "c4", caller: "Tom Garrett", phone: "(512) 229-3347", service: "Water Heater", time: "12:38 PM", status: "booked", value: "$450" },
  { id: "c5", caller: "Linda Cruz", phone: "(737) 440-1129", service: "Duct Cleaning", time: "11:55 AM", status: "answered", value: "—" },
  { id: "c6", caller: "James Park", phone: "(512) 881-6602", service: "AC Tune-Up", time: "10:22 AM", status: "booked", value: "$125" },
];

// ─── Automated Onboarding Tour Steps ──────────────────────────────────────────
const ONBOARDING_TOUR = [
  {
    target: "bar" as const,
    index: 0,
    day: "Mon",
    fullDay: "Monday",
    val: "$1,200",
    detail: "4 calls · 2 booked jobs ($1,200)",
  },
  {
    target: "bar" as const,
    index: 1,
    day: "Tue",
    fullDay: "Tuesday",
    val: "$1,850",
    detail: "6 calls · 4 booked jobs ($1,850)",
  },
  {
    target: "bar" as const,
    index: 2,
    day: "Wed",
    fullDay: "Wednesday",
    val: "$1,400",
    detail: "5 calls · 3 booked jobs ($1,400)",
  },
  {
    target: "bar" as const,
    index: 3,
    day: "Thu",
    fullDay: "Thursday",
    val: "$2,200",
    detail: "8 calls · 5 booked jobs ($2,200)",
  },
  {
    target: "bar" as const,
    index: 4,
    day: "Fri",
    fullDay: "Friday",
    val: "$3,100",
    detail: "★ Highest revenue day · 11 booked jobs",
  },
  {
    target: "bar" as const,
    index: 5,
    day: "Sat",
    fullDay: "Saturday",
    val: "$950",
    detail: "3 calls · 2 booked jobs ($950)",
  },
  {
    target: "bar" as const,
    index: 6,
    day: "Sun",
    fullDay: "Sunday",
    val: "$580",
    detail: "2 calls · 1 booked job ($580)",
  },
  {
    target: "donut" as const,
    index: 0,
    day: "Jobs",
    fullDay: "Completed",
    val: "14 Jobs (58%)",
    detail: "14 jobs successfully completed this week",
  },
  {
    target: "donut" as const,
    index: 1,
    day: "Jobs",
    fullDay: "Pending",
    val: "7 Jobs (29%)",
    detail: "7 jobs queued for upcoming dispatch",
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function fmt$(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function TrendPill({ value, suffix = "" }: { value: string; suffix?: string }) {
  const positive = !value.startsWith("-");
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
        positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
      }`}
    >
      {positive ? (
        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor"><path d="M6 2l4 5H2l4-5z" /></svg>
      ) : (
        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor"><path d="M6 10l4-5H2l4 5z" /></svg>
      )}
      {value}{suffix}
    </span>
  );
}

function CallStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    booked: "bg-emerald-50 text-emerald-700 border-emerald-200",
    missed: "bg-red-50 text-red-600 border-red-200",
    answered: "bg-sky-50 text-sky-700 border-sky-200",
  };
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${styles[status] ?? "bg-slate-100 text-slate-600"}`}>
      {status}
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
      className={`relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        accent
          ? "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50"
          : "border-slate-200/80 bg-white"
      }`}
    >
      {accent && (
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-100/60" />
      )}
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            accent ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          {icon}
        </div>
        <TrendPill value={trend} />
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-1 text-xs text-slate-400">{sub}</p>
    </div>
  );
}

// ─── Chart wrappers ────────────────────────────────────────────────────────────
function SectionCard({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {desc && <p className="mt-0.5 text-xs text-slate-500">{desc}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

// ─── AI Status Widget ──────────────────────────────────────────────────────────
function AiStatusCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0A0F1C] via-[#141C30] to-[#0A0F1C] p-5 text-white shadow-lg shadow-[#0A0F1C]/30 sm:p-6">
      {/* Glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#F97A35]/10 blur-3xl" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1FAA59] opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-[#1FAA59]" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#F97A35]">AI Agent · Live</p>
        </div>
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-[#B8BFCC]">All Systems Go</span>
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight">98.6%</p>
      <p className="mt-0.5 text-sm text-[#B8BFCC]">Answer rate today</p>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
        {[
          { label: "Calls Today", val: "24" },
          { label: "Avg Duration", val: "3m 12s" },
          { label: "Capture Rate", val: "87%" },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-lg font-bold">{s.val}</p>
            <p className="text-xs text-[#B8BFCC]">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export function DashboardOverview({ preview = false }: { preview?: boolean }) {
  const [tourIndex, setTourIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [userHoveredBar, setUserHoveredBar] = useState<number | null>(null);
  const [userHoveredSlice, setUserHoveredSlice] = useState<number | null>(null);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-advancing onboarding tour loop
  useEffect(() => {
    if (isUserInteracting) return;
    const interval = setInterval(() => {
      setTourIndex((prev) => (prev + 1) % ONBOARDING_TOUR.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [isUserInteracting]);

  const resetInteractingTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 2500);
  };

  const currentTourStep = ONBOARDING_TOUR[tourIndex];
  const activeBarIndex = userHoveredBar !== null ? userHoveredBar : (currentTourStep.target === "bar" ? currentTourStep.index : null);
  const activeSliceIndex = userHoveredSlice !== null ? userHoveredSlice : (currentTourStep.target === "donut" ? currentTourStep.index : null);
  const activeSliceData = activeSliceIndex !== null ? jobStatusData[activeSliceIndex] : null;

  // Dynamically compute exact pixel coordinate of active bar top-center or pie slice center
  const updatePointerPosition = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const step = ONBOARDING_TOUR[tourIndex];

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
          setPointerPos({
            x: targetRect.left - containerRect.left + targetRect.width / 2,
            y: targetRect.top - containerRect.top,
          });
        } else {
          setPointerPos({
            x: targetRect.left - containerRect.left + targetRect.width / 2,
            y: targetRect.top - containerRect.top + targetRect.height / 2,
          });
        }
      }
    }
  }, [tourIndex]);

  useEffect(() => {
    updatePointerPosition();
    const rafId = requestAnimationFrame(updatePointerPosition);
    const timerId = setTimeout(updatePointerPosition, 80);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
    };
  }, [tourIndex, updatePointerPosition]);

  useEffect(() => {
    const handleResize = () => updatePointerPosition();
    window.addEventListener("resize", handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updatePointerPosition();
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver?.disconnect();
    };
  }, [updatePointerPosition]);

  return (
    <div className="space-y-6">

      {/* Header */}
      {!preview && (
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-500">
            Saturday, Aug 2 · Last updated <span className="font-medium text-slate-700">2:27 PM</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-orange-300">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M4.582 9A9 9 0 0120 14.582M19.418 15A9 9 0 014 9.418" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
      )}

      {/* Stat cards */}
      {!preview && (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          accent
          icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 15.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
          label="Calls Today"
          value="24"
          trend="+18%"
          sub="vs yesterday · 20 calls"
        />
        <StatCard
          icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
          label="Answer Rate"
          value="98.6%"
          trend="+3.2%"
          sub="AI handled 23 of 24 calls"
        />
        <StatCard
          icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          label="Jobs Booked"
          value="7"
          trend="+40%"
          sub="vs yesterday · 5 jobs"
        />
        <StatCard
          icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Revenue"
          value="$4,250"
          trend="+28%"
          sub="vs yesterday · $3,320"
        />
      </div>
      )}

      {/* AI widget + weekly chart */}
      {!preview && (
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AiStatusCard />
        </div>

        <div className="lg:col-span-2">
          <SectionCard title="Weekly Call Volume" desc="Calls received, answered, and booked — past 7 days">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyCallData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradCalls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.orange} stopOpacity={0.18} />
                      <stop offset="95%" stopColor={C.orange} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradBooked" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.green} stopOpacity={0.22} />
                      <stop offset="95%" stopColor={C.green} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#CBD5E1", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", boxShadow: "0 8px 24px rgba(10,15,28,0.08)" }}
                    labelStyle={{ fontWeight: 600, color: "#0F172A" }}
                  />
                  <Area type="monotone" dataKey="calls" name="Calls" stroke={C.orange} strokeWidth={2} fill="url(#gradCalls)" dot={false} />
                  <Area type="monotone" dataKey="booked" name="Booked" stroke={C.green} strokeWidth={2} fill="url(#gradBooked)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="inline-block h-2 w-2 rounded-full" style={{ background: C.orange }} />Calls received</span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="inline-block h-2 w-2 rounded-full" style={{ background: C.green }} />Jobs booked</span>
            </div>
          </SectionCard>
        </div>
      </div>
      )}

      {/* Revenue bar + Jobs donut with Unified Continuous Onboarding Tour */}
      <div
        ref={containerRef}
        className="relative grid gap-4 lg:grid-cols-2"
        onMouseEnter={() => setIsUserInteracting(true)}
        onMouseLeave={resetInteractingTimer}
      >
        {/* Unified Continuous Smooth Pointer across both cards (Hidden when real mouse hovers) */}
        {!isUserInteracting && pointerPos && (
          <motion.div
            initial={false}
            animate={{
              x: pointerPos.x,
              y: pointerPos.y,
            }}
            transition={{
              type: "spring",
              stiffness: 85,
              damping: 17,
              mass: 0.6,
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
              zIndex: 40,
            }}
            className="hidden sm:block"
          >
            {/* Pointer SVG Arrow (Tip calibrated exactly at (0,0)) */}
            <div style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.3))" }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                style={{
                  transform: "translate(-3px, -3px) rotate(-8deg)",
                  transformOrigin: "3px 3px",
                }}
              >
                <path
                  d="M3 3l7.5 17.5 3-6.5 6.5-3L3 3z"
                  fill="#0F172A"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Native-Style Recharts Tooltip (Clean, white, exactly like real hover) */}
            <motion.div
              layout
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{
                position: "absolute",
                left: pointerPos.x > (containerRef.current ? containerRef.current.clientWidth - 170 : 700) ? -165 : 16,
                top: 4,
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: 10,
                boxShadow: "0 8px 24px rgba(10,15,28,0.12)",
                padding: "8px 12px",
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}
            >
              {currentTourStep.target === "bar" ? (
                <>
                  <p style={{ margin: "0 0 2px", fontWeight: 600, color: "#0F172A", fontSize: 11 }}>
                    {currentTourStep.day}
                  </p>
                  <p style={{ margin: 0, color: "#F97A35", fontWeight: 600, fontSize: 12 }}>
                    Revenue : <span style={{ fontWeight: 700 }}>{currentTourStep.val}</span>
                  </p>
                </>
              ) : (
                <>
                  <p style={{ margin: "0 0 2px", fontWeight: 600, color: "#0F172A", fontSize: 11 }}>
                    {currentTourStep.fullDay}
                  </p>
                  <p style={{ margin: 0, color: "#0F172A", fontWeight: 600, fontSize: 12 }}>
                    {currentTourStep.fullDay} : <span style={{ fontWeight: 700 }}>{currentTourStep.val}</span>
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Revenue by Day Card (Clean UI) */}
        <SectionCard
          title="Revenue by Day"
          desc="Estimated job value captured this week"
        >
          <div className="relative h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="label" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#CBD5E1", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(val: number) => [fmt$(val), "Revenue"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", boxShadow: "0 8px 24px rgba(10,15,28,0.08)" }}
                  cursor={{ fill: "rgba(249,122,53,0.06)" }}
                />
                <Bar
                  dataKey="revenue"
                  radius={[8, 8, 4, 4]}
                  maxBarSize={44}
                  shape={(props: any) => {
                    const { index } = props;
                    const isActive = activeBarIndex === index;
                    const isFriday = index === 4;
                    const barFill = isActive ? (isFriday ? "#EA580C" : C.orange) : (isFriday ? C.orange : "#CBD5E1");
                    return (
                      <g id={`dashboard-tour-bar-${index}`} key={`tour-bar-${index}`}>
                        <Rectangle
                          {...props}
                          fill={barFill}
                          radius={[8, 8, 4, 4]}
                          style={{
                            transition: "fill 0.25s ease, filter 0.25s ease",
                            filter: isActive ? "drop-shadow(0 6px 14px rgba(249,122,53,0.45))" : "none",
                            cursor: "pointer",
                          }}
                        />
                      </g>
                    );
                  }}
                  onMouseMove={(data) => {
                    if (data && typeof data.activeTooltipIndex === "number") {
                      setUserHoveredBar(data.activeTooltipIndex);
                    }
                  }}
                  onMouseLeave={() => setUserHoveredBar(null)}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Job Status Breakdown Card (Clean UI) */}
        <SectionCard
          title="Job Status Breakdown"
          desc="All jobs booked this week"
        >
          <div className="relative flex h-52 items-center gap-6">
            <div className="relative flex-1">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={jobStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={76}
                    paddingAngle={4}
                    stroke="none"
                    onMouseEnter={(_, index) => setUserHoveredSlice(index)}
                    onMouseLeave={() => setUserHoveredSlice(null)}
                  >
                    {jobStatusData.map((entry, i) => {
                      const isActive = activeSliceIndex === i;
                      return (
                        <Cell
                          key={entry.name}
                          id={`dashboard-tour-slice-${i}`}
                          fill={entry.fill}
                          style={{
                            transition: "filter 0.25s ease, transform 0.25s ease",
                            filter: isActive ? `drop-shadow(0 6px 16px ${entry.fill}70)` : "none",
                            transform: isActive ? "scale(1.05)" : "scale(1)",
                            transformOrigin: "center",
                            cursor: "pointer",
                          }}
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0" }}
                    formatter={(val: number, name: string) => [val, name]}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Donut Center Rate Display */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  {activeSliceData ? activeSliceData.value : "24"}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {activeSliceData ? `${activeSliceData.name} (${activeSliceData.percentage})` : "Total Jobs"}
                </span>
              </div>
            </div>

            {/* Status List Legend with Interactive Hover Highlighting */}
            <ul className="shrink-0 space-y-2 pr-2">
              {jobStatusData.map((s, i) => {
                const isActive = activeSliceIndex === i;
                return (
                  <li
                    key={s.name}
                    onMouseEnter={() => {
                      setUserHoveredSlice(i);
                      setIsUserInteracting(true);
                    }}
                    onMouseLeave={() => {
                      setUserHoveredSlice(null);
                      resetInteractingTimer();
                    }}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
                      isActive
                        ? "bg-slate-100/90 shadow-sm ring-1 ring-slate-200"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.fill }} />
                    <span className={`text-sm ${isActive ? "font-bold text-slate-900" : "text-slate-600"}`}>
                      {s.name}
                    </span>
                    <span className="ml-auto text-sm font-semibold text-slate-900">{s.value}</span>
                  </li>
                );
              })}
              <li className="flex items-center gap-2.5 border-t border-slate-100 pt-2 px-2.5">
                <span className="text-sm text-slate-500">Total</span>
                <span className="ml-auto text-sm font-bold text-slate-900">24</span>
              </li>
            </ul>
          </div>
        </SectionCard>
      </div>

      {/* Recent calls feed */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Recent Calls</h3>
            <p className="mt-0.5 text-xs text-slate-500">Live feed · refreshes every 15s</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              Live
            </span>
            <a href="/calls" className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50">
              View all
            </a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 sm:px-6">Caller</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Service</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Time</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400 sm:px-6">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentCalls.map((call) => (
                <tr key={call.id} className="group transition-colors hover:bg-slate-50/70">
                  <td className="px-5 py-3.5 sm:px-6">
                    <p className="font-medium text-slate-900">{call.caller}</p>
                    <p className="text-xs text-slate-400">{call.phone}</p>
                  </td>
                  <td className="px-3 py-3.5 text-slate-600">{call.service}</td>
                  <td className="px-3 py-3.5 text-slate-400">{call.time}</td>
                  <td className="px-3 py-3.5">
                    <CallStatusBadge status={call.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-slate-900 sm:px-6">{call.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
