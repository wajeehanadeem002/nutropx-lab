"use client";

import Link from "next/link";
import { useState } from "react";

type MainTab = "brain" | "leaderboard";
type PeriodTab = "week" | "all";
type LocalIconName = "brain" | "trophy" | "spark" | "star";

const stats = [
  ["-", "Score", "after first test"],
  ["0", "Streak", "starts today"],
  ["0", "XP", "100 to level 2"],
];

export function MyBrainTabs() {
  const [activeTab, setActiveTab] = useState<MainTab>("brain");
  const [period, setPeriod] = useState<PeriodTab>("week");

  return (
    <>
      <section className="mx-auto mt-7 flex h-[58px] max-w-[672px] overflow-hidden rounded-[1rem] border-[2px] border-black bg-white p-1.5 shadow-[0_7px_0_#000]">
        <button
          type="button"
          onClick={() => setActiveTab("brain")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-[0.8rem] text-sm font-semibold ${
            activeTab === "brain" ? "bg-black text-white" : "text-black"
          }`}
        >
          <LocalIcon name="brain" className="h-4 w-4" />
          My Brain
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("leaderboard")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-[0.8rem] text-sm font-semibold ${
            activeTab === "leaderboard" ? "bg-black text-white" : "text-black"
          }`}
        >
          <LocalIcon name="trophy" className="h-4 w-4" />
          Leaderboard
        </button>
      </section>

      {activeTab === "brain" ? (
        <BrainRecordsCard />
      ) : (
        <LeaderboardPanel period={period} onPeriodChange={setPeriod} />
      )}
    </>
  );
}

function BrainRecordsCard() {
  return (
    <section className="mx-auto mt-8 grid h-[400px] max-w-[672px] place-items-center rounded-[1.2rem] bg-[#131516] px-8 py-8 text-center text-white">
      <div className="mx-auto max-w-[560px]">
        <div className="mx-auto flex w-fit items-center gap-3 text-cyan">
          <LocalIcon name="spark" className="h-6 w-6 text-cyan" />
          <LocalIcon name="spark" className="h-6 w-6 text-cyan" />
        </div>
        <h2 className="mt-4 text-xl font-semibold leading-tight text-white">
          Your records start here
        </h2>
        <p className="mx-auto mt-3 max-w-[540px] text-xs font-medium leading-5 text-white/58">
          Take the 90-second Brain Test and this page fills with your score, your trend,
          and your personal bests.
        </p>
        <Link
          href="/brain-test"
          className="mx-auto mt-5 flex h-[54px] w-[300px] items-center justify-center rounded-[0.9rem] bg-orange-500 text-xs font-semibold text-black shadow-[0_14px_28px_rgba(255,107,44,0.25)]"
        >
          Take the Brain Test <span className="ml-2 text-lg">{"\u2192"}</span>
        </Link>

        <div className="mx-auto mt-8 grid max-w-[260px] grid-cols-3 gap-5">
          {stats.map(([value, label, hint]) => (
            <div key={label}>
              <p className="text-xl font-semibold leading-none text-white">{value}</p>
              <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/38">
                {label}
              </p>
              <p className="mt-1 text-[9px] font-medium text-white/25">{hint}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-[10px] font-medium text-white/24">
          Not an IQ test, not a measure of intelligence, not a medical assessment or diagnosis.
        </p>
      </div>
    </section>
  );
}

function LeaderboardPanel({
  period,
  onPeriodChange,
}: {
  period: PeriodTab;
  onPeriodChange: (period: PeriodTab) => void;
}) {
  const rankedRows: never[] = [];

  return (
    <section className="mx-auto mt-7 max-w-[672px]">
      <div className="flex h-[54px] overflow-hidden rounded-[1rem] border-[2px] border-black bg-white p-1.5 shadow-[0_7px_0_#000]">
        <button
          type="button"
          onClick={() => onPeriodChange("week")}
          className={`flex flex-1 items-center justify-center rounded-[0.75rem] text-sm font-semibold ${
            period === "week" ? "bg-black text-white" : "text-black"
          }`}
        >
          This Week
        </button>
        <button
          type="button"
          onClick={() => onPeriodChange("all")}
          className={`flex flex-1 items-center justify-center rounded-[0.75rem] text-sm font-semibold ${
            period === "all" ? "bg-black text-white" : "text-black"
          }`}
        >
          All Time
        </button>
      </div>

      <div className="mt-7 rounded-[1rem] border border-cyan/45 bg-cyan/10 px-6 py-5">
        <h2 className="text-sm font-semibold text-black">Leaderboard is opt-in</h2>
        <p className="mt-2 text-[13px] font-medium leading-5 text-black/78">
          Members below have chosen to appear here. You can opt in via Profile {"\u2192"} Account
          settings. Your XP always counts toward community totals even if you stay private.
        </p>
      </div>

      {rankedRows.length > 0 ? null : <LeaderboardEmptyState />}

      <p className="mt-7 text-center text-xs font-medium text-muted">
        Rankings reflect training XP only, not Cognitive Fitness Scores.
      </p>
    </section>
  );
}

function LeaderboardEmptyState() {
  return (
    <div className="mt-6 grid min-h-[150px] place-items-center rounded-[1rem] border-[2px] border-black bg-white px-6 py-8 text-center shadow-[0_7px_0_#000]">
      <div>
        <LocalIcon name="star" className="mx-auto h-9 w-9 text-cyan" />
        <h3 className="mt-4 text-lg font-semibold leading-tight text-black">No members ranked yet</h3>
        <p className="mt-2 text-sm font-medium text-muted">
          Be the first to opt in via your Profile settings.
        </p>
      </div>
    </div>
  );
}

function LocalIcon({
  name,
  className = "h-5 w-5",
}: {
  name: LocalIconName;
  className?: string;
}) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2.15,
    viewBox: "0 0 24 24",
  };

  if (name === "brain") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M12 5a3 3 0 1 0-5.98.38 4 4 0 0 0-2.44 5.75 4 4 0 0 0 .52 6.4A4 4 0 1 0 12 18Z" />
        <path d="M12 5a3 3 0 1 1 5.98.38 4 4 0 0 1 2.44 5.75 4 4 0 0 1-.52 6.4A4 4 0 1 1 12 18Z" />
        <path d="M12 5v13" />
      </svg>
    );
  }

  if (name === "trophy") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
        <path d="M5 6H3v2a4 4 0 0 0 4 4" />
        <path d="M19 6h2v2a4 4 0 0 1-4 4" />
      </svg>
    );
  }

  if (name === "star") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="m12 3 2.7 5.47 6.03.88-4.36 4.25 1.03 6.01L12 16.77l-5.4 2.84 1.03-6.01-4.36-4.25 6.03-.88L12 3Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" {...common}>
      <path d="M13 2 9.8 9.8 2 13l7.8 3.2L13 24l3.2-7.8L24 13l-7.8-3.2L13 2Z" />
      <path d="m5 3 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" />
    </svg>
  );
}
