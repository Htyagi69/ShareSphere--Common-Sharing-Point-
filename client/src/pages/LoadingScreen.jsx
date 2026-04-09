// LoadingScreen.jsx
import { useEffect, useState } from "react";

const SkeletonRow = ({ widths, delay }) => (
  <div
    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
    style={{ animation: `fadeUp 0.5s ease forwards`, animationDelay: delay, opacity: 0 }}
  >
    <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
    <div className="flex-1 flex flex-col gap-1.5">
      <div className={`h-2.5 rounded bg-gray-200 dark:bg-gray-700 animate-pulse`} style={{ width: widths[0] }} />
      <div className={`h-2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse`} style={{ width: widths[1] }} />
    </div>
    <div className="w-8 h-2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
  </div>
);

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="w-full max-w-sm flex flex-col items-center gap-8">

        {/* Logo + dots */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-13 h-13 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center p-3">
            <ShareIcon />
          </div>
          <div>
            <p className="text-xl font-medium text-gray-900 dark:text-white text-center tracking-tight">
              ShareSphere
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-1.5">
              {[0, 200, 400].map((delay, i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-blue-500"
                  style={{ animation: `pulse 1.4s ease-in-out ${delay}ms infinite` }}
                />
              ))}
              <span className="text-xs text-gray-400 ml-1">Loading your workspace</span>
            </div>
          </div>
        </div>

        {/* Skeleton card */}
        <div className="w-full bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 flex flex-col gap-4">
          
          {/* Header row */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0" />
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="h-2.5 w-1/2 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="h-2 w-1/3 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            </div>
            <div className="w-14 h-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800" />

          {/* Skeleton rows */}
          <div className="flex flex-col gap-2">
            <SkeletonRow widths={["60%", "40%"]} delay="0.05s" />
            <SkeletonRow widths={["45%", "55%"]} delay="0.15s" />
            <SkeletonRow widths={["70%", "30%"]} delay="0.25s" />
          </div>
        </div>

        <p className="text-xs text-gray-400">Preparing your shared spaces...</p>
      </div>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="18" cy="5" r="3" fill="#3b82f6" />
      <circle cx="6" cy="12" r="3" fill="#3b82f6" />
      <circle cx="18" cy="19" r="3" fill="#3b82f6" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="#3b82f6" strokeWidth="1.5" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="#3b82f6" strokeWidth="1.5" />
    </svg>
  );
}
