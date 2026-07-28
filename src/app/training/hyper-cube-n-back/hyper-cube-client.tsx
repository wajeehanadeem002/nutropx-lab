"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Stage = "intro" | "setup" | "playing" | "complete";

const totalRounds = 5;
const stepsPerRound = 10;
const audioTones = ["C4", "E4", "G4", "A4", "C5", "F5"];

export default function HyperCubeNBackTrainer() {
  const [stage, setStage] = useState<Stage>("intro");
  const [flatView, setFlatView] = useState(false);
  const [dualAudio, setDualAudio] = useState(true);
  const [round, setRound] = useState(1);
  const [step, setStep] = useState(0);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [activeTone, setActiveTone] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastScore, setLastScore] = useState(67);

  const totalStepCount = (round - 1) * stepsPerRound + step;
  const sessionPercent = Math.min(100, Math.round((totalStepCount / (totalRounds * stepsPerRound)) * 100));
  const roundBreak = stage === "playing" && step >= stepsPerRound && round < totalRounds;
  const completeSoon = stage === "playing" && step >= stepsPerRound && round >= totalRounds;
  const avgTime = (2.4 + ((lastScore % 8) / 10)).toFixed(1);
  const xpEarned = Math.max(18, Math.round(lastScore / 3));

  useEffect(() => {
    if (stage !== "playing") return;

    if (step >= stepsPerRound) {
      const pause = window.setTimeout(() => {
        if (round >= totalRounds) {
          setLastScore(Math.min(94, Math.max(56, 55 + Math.round(score / 8))));
          setStage("complete");
          return;
        }

        setRound((value) => value + 1);
        setStep(0);
        setActiveNode(null);
        setActiveTone(null);
        setStreak(0);
      }, 2000);

      return () => window.clearTimeout(pause);
    }

    const timer = window.setTimeout(
      () => {
        const nextStep = step + 1;
        setActiveNode((previous) => pickDifferent(27, previous));
        setActiveTone(dualAudio ? (previous) => pickDifferent(audioTones.length, previous) : null);
        setStep(nextStep);
        setScore((value) => value + (nextStep % 3 === 0 ? 5 : 4));
        setStreak((value) => Math.min(stepsPerRound, value + 1));
      },
      step === 0 ? 1050 : 1550,
    );

    return () => window.clearTimeout(timer);
  }, [dualAudio, round, score, stage, step]);

  function startSetup() {
    setStage("setup");
  }

  function beginSession() {
    setRound(1);
    setStep(0);
    setActiveNode(null);
    setActiveTone(null);
    setScore(0);
    setStreak(0);
    setStage("playing");
  }

  function resetToIntro() {
    setRound(1);
    setStep(0);
    setActiveNode(null);
    setActiveTone(null);
    setScore(0);
    setStreak(0);
    setStage("intro");
  }

  if (stage === "setup") {
    return (
      <section className="mx-auto grid min-h-[calc(100vh-124px)] content-start justify-items-center px-5 pb-8 pt-6 text-center">
        <SessionPill
          round={round}
          score={score}
          streak={streak}
          percent={sessionPercent}
        />

        <article className="mt-5 grid w-full max-w-[430px] justify-items-center rounded-[1.2rem] bg-white px-8 py-12 shadow-[0_14px_34px_rgba(45,149,238,0.06)]">
          <p className="max-w-[360px] text-center text-[13px] font-semibold leading-5 text-[#1f2937]">
            Watch the cube - press Match when the lit node repeats from N steps ago
          </p>
          <p className="mt-2 text-[10px] font-semibold text-[#89919b]">
            Space / J: visual match {"\u00b7"} F: audio match (dual mode)
          </p>

          <div className="mt-6 grid w-full gap-3">
            <SettingToggle
              title="Flat 2D view"
              note={
                flatView
                  ? "On: no WebGL required, reduced-motion safe"
                  : "Off: 3D cube"
              }
              checked={flatView}
              onChange={() => setFlatView((value) => !value)}
              tinted="violet"
            />
            <SettingToggle
              title="Dual-task audio mode"
              note={dualAudio ? "On: visual + audio N-back" : "Off: visual N-back only"}
              checked={dualAudio}
              onChange={() => setDualAudio((value) => !value)}
              tinted="blue"
            />
          </div>

          <button
            type="button"
            onClick={beginSession}
            className="mt-5 inline-flex h-[48px] w-[122px] items-center justify-center rounded-[0.9rem] bg-[#2d95ee] text-sm font-semibold text-white"
          >
            Begin
          </button>
        </article>

        <BottomStatus label="Ready..." progress={0} onEnd={resetToIntro} />
      </section>
    );
  }

  if (stage === "playing") {
    return (
      <section className="mx-auto grid min-h-[calc(100vh-124px)] content-start justify-items-center px-5 pb-8 pt-6 text-center">
        <SessionPill
          round={round}
          score={score}
          streak={streak}
          percent={sessionPercent}
        />

        <div className="mt-5 grid w-full max-w-[430px] justify-items-center rounded-[1.2rem] bg-white/50 px-6 py-8">
          <CubeBoard activeNode={activeNode} flatView={flatView} />
          {roundBreak || completeSoon ? (
            <p className="mt-1 rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#2d95ee] shadow-[0_8px_20px_rgba(45,149,238,0.10)]">
              Round {round}/{totalRounds} complete
            </p>
          ) : null}
        </div>

        {dualAudio ? <AudioToneRow activeTone={activeTone} /> : null}

        <button
          type="button"
          onClick={() => {
            setScore((value) => value + 2);
            setStreak((value) => Math.min(stepsPerRound, value + 1));
          }}
          className="mt-4 flex h-[44px] w-full max-w-[430px] items-center justify-center rounded-[0.85rem] bg-[#2d95ee] text-[13px] font-semibold text-white shadow-[0_5px_14px_rgba(45,149,238,0.18)]"
        >
          <span className="mr-1 text-white">{"\u25c9"}</span>
          Visual Match: same as 1 step ago <span className="ml-1 text-white/75">(Space / J)</span>
        </button>

        {dualAudio ? (
          <button
            type="button"
            onClick={() => {
              setScore((value) => value + 3);
              setStreak((value) => Math.min(stepsPerRound, value + 1));
            }}
            className="mt-3 flex h-[44px] w-full max-w-[430px] items-center justify-center rounded-[0.85rem] bg-[#22c55e] text-[13px] font-semibold text-white shadow-[0_5px_14px_rgba(34,197,94,0.18)]"
          >
            <span className="mr-1 text-white">{"\u266a"}</span>
            Audio Match: same sound as 1 step ago <span className="ml-1 text-white/75">(F)</span>
          </button>
        ) : null}

        <BottomStatus
          label={
            roundBreak
              ? `Round ${round}/${totalRounds} complete`
              : completeSoon
                ? `Round ${round}/${totalRounds} complete`
                : `Step ${step} / ${stepsPerRound} - 1-back - 3\u00b3`
          }
          progress={Math.min(100, (step / stepsPerRound) * 100)}
          onEnd={resetToIntro}
          stats
        />
      </section>
    );
  }

  if (stage === "complete") {
    return (
      <section className="mx-auto grid min-h-[calc(100vh-124px)] content-start justify-items-center px-5 pb-12 pt-6 text-center">
        <article className="w-full max-w-[365px] overflow-hidden rounded-[1.35rem] bg-white shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
          <div className="h-[3px] w-full bg-[#2d95ee]" />
          <div className="px-8 pb-8 pt-9">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7a828b]">
              Session complete
            </p>
            <h1 className="mt-5 font-display text-[1.45rem] font-semibold leading-tight text-[#111827]">
              Solid Effort
            </h1>

            <div className="mt-7 flex justify-center">
              <ResultGauge score={lastScore} />
            </div>

            <div className="mt-7 flex justify-center gap-12">
              <ResultMetric label="Accuracy" value="100%" />
              <ResultMetric label="Avg time" value={`${avgTime}s`} />
            </div>

            <div className="mx-auto mt-7 inline-flex h-9 items-center justify-center rounded-full bg-[#eef6ff] px-5 text-sm font-semibold text-[#2d95ee]">
              +{xpEarned} XP earned
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={beginSession}
                className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[0.85rem] border border-black/8 bg-white text-sm font-semibold text-[#111827] shadow-[0_1px_0_rgba(0,0,0,0.04)]"
              >
                <RefreshIcon className="h-4 w-4" />
                Try Again
              </button>
              <Link
                href="/lab"
                className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[0.85rem] bg-black text-sm font-semibold text-white"
              >
                Done
                <span className="text-lg leading-none">{"\u203a"}</span>
              </Link>
            </div>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-124px)] max-w-[620px] content-center justify-items-center px-4 pb-7 pt-7 text-center">
      <div className="grid h-[58px] w-[58px] place-items-center rounded-[0.8rem] bg-[#dceefa] text-[#2d95ee]">
        <CubeIcon className="h-7 w-7" />
      </div>

      <h1 className="mt-5 font-display text-[1.22rem] font-semibold leading-tight text-black">
        Hyper-Cube N-Back
      </h1>
      <p className="mt-2 max-w-[255px] text-[11px] font-medium leading-[17px] text-muted">
        Watch the cube. A node will light up. Press Match when the current node
        matches the one N steps ago. Enable dual-task for a simultaneous audio
        N-back challenge.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <div className="grid h-[48px] w-[64px] place-items-center rounded-[0.6rem] bg-white text-center shadow-[0_1px_0_rgba(0,0,0,0.08)]">
          <span className="text-[8px] font-medium uppercase tracking-[0.04em] text-muted">
            Rounds
          </span>
          <span className="text-[13px] font-semibold leading-none text-black">5</span>
        </div>
        <div className="grid h-[48px] w-[64px] place-items-center rounded-[0.6rem] bg-[#dceefa] text-center">
          <span className="text-[8px] font-medium uppercase tracking-[0.04em] text-muted">
            XP
          </span>
          <span className="text-[13px] font-semibold leading-none text-[#2d95ee]">+30</span>
        </div>
      </div>

      <button
        type="button"
        onClick={startSetup}
        className="mt-7 inline-flex h-[42px] w-[110px] items-center justify-center gap-1.5 rounded-full bg-black text-[12px] font-semibold text-white shadow-[0_3px_0_rgba(0,0,0,0.22)]"
      >
        <PlayIcon className="h-3.5 w-3.5" />
        Start
      </button>
    </section>
  );
}

function pickDifferent(total: number, previous: number | null) {
  if (total <= 1) return 0;

  let next = Math.floor(Math.random() * total);
  if (previous !== null && next === previous) {
    next = (next + 1 + Math.floor(Math.random() * (total - 1))) % total;
  }

  return next;
}

function SessionPill({
  round,
  score,
  streak,
  percent,
}: {
  round: number;
  score: number;
  streak: number;
  percent: number;
}) {
  return (
    <div className="flex h-[72px] w-full max-w-[490px] items-center rounded-full bg-white px-5 shadow-[0_12px_28px_rgba(45,149,238,0.08)]">
      <div className="min-w-0 flex-1 text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#707b86]">
          Tier 1/20
        </p>
        <div className="mt-2 h-[5px] w-full rounded-full bg-[#e5e7eb]">
          <div
            className="h-full rounded-full bg-[#2d95ee]"
            style={{ width: `${Math.max(5, percent)}%` }}
          />
        </div>
        <div className="mt-2 h-[4px] w-full rounded-full bg-[#eef1f4]">
          <div
            className="h-full rounded-full bg-[#9ccdf6]"
            style={{ width: `${Math.max(5, percent)}%` }}
          />
        </div>
      </div>
      <div className="mx-5 h-10 w-px bg-black/10" />
      <GameStat label="Round" value={`${round}/${totalRounds}`} />
      <div className="mx-4 h-10 w-px bg-black/10" />
      <GameStat label="Score" value={String(score)} />
      <div className="mx-4 h-10 w-px bg-black/10" />
      <GameStat label="Streak" value={String(streak)} mutedIcon />
    </div>
  );
}

function GameStat({
  label,
  value,
  mutedIcon = false,
}: {
  label: string;
  value: string;
  mutedIcon?: boolean;
}) {
  return (
    <div className="min-w-[42px] text-center">
      <span className="block text-[10px] font-semibold uppercase tracking-[0.06em] text-[#707b86]">
        {label}
      </span>
      <span className="mt-1 flex items-center justify-center gap-1 text-sm font-semibold leading-none text-black">
        {mutedIcon ? <span className="text-[#c9ced3]">{"\u2668"}</span> : null}
        {value}
      </span>
    </div>
  );
}

function SettingToggle({
  title,
  note,
  checked,
  onChange,
  tinted,
}: {
  title: string;
  note: string;
  checked: boolean;
  onChange: () => void;
  tinted: "violet" | "blue";
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex h-[68px] items-center justify-between rounded-[0.9rem] border px-4 text-left ${
        tinted === "violet"
          ? "border-purple-100 bg-purple-50/35"
          : "border-[#bfe9ff] bg-[#eef9ff]"
      }`}
      aria-pressed={checked}
    >
      <span>
        <span className="block text-[13px] font-semibold text-[#1f2937]">
          {title}
        </span>
        <span className="mt-1 block text-[11px] font-medium text-[#7a828b]">
          {note}
        </span>
      </span>
      <span
        className={`relative h-7 w-11 rounded-full ${
          checked ? "bg-[#2d95ee]" : "bg-[#e5e7eb]"
        }`}
      >
        <span
          className={`absolute top-1 grid h-5 w-5 place-items-center rounded-full bg-white shadow ${
            checked ? "left-5" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function BottomStatus({
  label,
  progress,
  onEnd,
  stats = false,
}: {
  label: string;
  progress: number;
  onEnd: () => void;
  stats?: boolean;
}) {
  return (
    <div className="mt-4 w-full max-w-[430px] rounded-[0.9rem] bg-white px-5 py-3 shadow-[0_10px_24px_rgba(45,149,238,0.08)]">
      <div className="flex items-center justify-between gap-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#7a828b]">
          {label}
        </span>
        <button
          type="button"
          onClick={onEnd}
          className="h-8 rounded-full bg-[#eef6ff] px-5 text-xs font-semibold text-[#2d95ee]"
        >
          End Session
        </button>
      </div>
      <div className="mt-2 h-[4px] rounded-full bg-[#e5e7eb]">
        <div
          className="h-full rounded-full bg-[#2d95ee] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      {stats ? (
        <div className="mt-3 flex gap-5 text-[10px] font-semibold uppercase tracking-[0.08em]">
          <span className="text-green-500">H 0</span>
          <span className="text-yellow-500">M 0</span>
          <span className="text-rose-500">FA 0</span>
          <span className="text-[#2d95ee]">CR 3</span>
        </div>
      ) : null}
    </div>
  );
}

function AudioToneRow({ activeTone }: { activeTone: number | null }) {
  const toneColors = [
    ["#2d95ee", "#e7f4ff"],
    ["#22c55e", "#e9fbef"],
    ["#facc15", "#fff7cc"],
    ["#fb923c", "#fff0e5"],
    ["#ef4444", "#ffe8e8"],
    ["#8b5cf6", "#f1eaff"],
  ];

  return (
    <div className="mt-3 flex h-[36px] w-full max-w-[430px] items-center gap-2 rounded-[0.75rem] bg-white px-4 text-left shadow-[0_8px_18px_rgba(45,149,238,0.06)]">
      <span className="text-[10px] font-semibold text-[#7a828b]">Audio:</span>
      <div className="flex items-center gap-1.5">
        {audioTones.map((tone, index) => {
          const [color, background] = toneColors[index];
          const active = activeTone === index;

          return (
            <span
              key={tone}
              className="grid h-5 min-w-5 place-items-center rounded-full border text-[8px] font-semibold transition-all duration-500"
              style={{
                borderColor: color,
                backgroundColor: active ? color : background,
                color: active ? "white" : color,
                boxShadow: active ? `0 0 15px ${color}88` : "none",
                transform: active ? "scale(1.12)" : "scale(1)",
              }}
            >
              {tone}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function CubeBoard({
  activeNode,
  flatView,
}: {
  activeNode: number | null;
  flatView: boolean;
}) {
  const layers = [0, 1, 2];

  return (
    <div
      aria-label={flatView ? "Flat N-back layer map" : "3D cube node map"}
      className="flex h-[300px] w-full items-center justify-center"
      role="img"
    >
      {flatView ? (
        <div className="flex items-start justify-center gap-6 sm:gap-8">
          {layers.map((layer) => (
            <div key={layer} className="w-[112px] text-center">
              <p className="text-[10px] font-semibold text-[#7ebdf0]">
                Layer {layer + 1}
              </p>
              <div className="mx-auto mt-2 h-px w-[92px] bg-[#a8d3f3]" />
              <div className="mt-3 grid grid-cols-3 gap-2.5">
                {Array.from({ length: 9 }).map((_, index) => {
                  const nodeIndex = layer * 9 + index;
                  const active = activeNode === nodeIndex;

                  return (
                    <span
                      key={nodeIndex}
                      className={`h-9 w-9 rounded-full border-[2px] transition-all duration-700 ${
                        active
                          ? "scale-110 border-[#2d95ee] bg-[#2d95ee] shadow-[0_0_20px_rgba(45,149,238,0.68)]"
                          : "border-[#8ec6f4] bg-[#d7ecfb]"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <CubeDiagram activeNode={activeNode} />
      )}
    </div>
  );
}

const cubeNodes = Array.from({ length: 27 }, (_, index) => {
  const layer = Math.floor(index / 9);
  const layerIndex = index % 9;
  const row = Math.floor(layerIndex / 3);
  const column = layerIndex % 3;

  return {
    index,
    x: 74 + column * 48 + layer * 31,
    y: 54 + row * 48 + layer * 28,
    column,
    row,
    layer,
  };
});

const cubeEdges = cubeNodes.flatMap((node) => {
  const connections = [
    cubeNodes.find(
      (target) =>
        target.layer === node.layer &&
        target.row === node.row &&
        target.column === node.column + 1,
    ),
    cubeNodes.find(
      (target) =>
        target.layer === node.layer &&
        target.column === node.column &&
        target.row === node.row + 1,
    ),
    cubeNodes.find(
      (target) =>
        target.column === node.column &&
        target.row === node.row &&
        target.layer === node.layer + 1,
    ),
  ].filter(Boolean) as typeof cubeNodes;

  return connections.map((target) => ({
    key: `${node.index}-${target.index}`,
    x1: node.x,
    y1: node.y,
    x2: target.x,
    y2: target.y,
  }));
});

function CubeDiagram({ activeNode }: { activeNode: number | null }) {
  return (
    <svg
      aria-hidden="true"
      className="h-[260px] w-[310px] overflow-visible"
      viewBox="0 0 300 270"
    >
      {cubeEdges.map((edge) => (
        <line
          key={edge.key}
          x1={edge.x1}
          x2={edge.x2}
          y1={edge.y1}
          y2={edge.y2}
          stroke="#b9ddf6"
          strokeWidth="1.4"
          opacity="0.55"
        />
      ))}
      {cubeNodes.map((node) => {
        const active = activeNode === node.index;

        return (
          <g key={node.index}>
            {active ? (
              <circle
                cx={node.x}
                cy={node.y}
                r="22"
                fill="#2d95ee"
                opacity="0.20"
              />
            ) : null}
            <circle
              cx={node.x}
              cy={node.y}
              r={active ? 8 : 4.5}
              fill={active ? "#2d95ee" : "#2b8fd3"}
              opacity={active ? "1" : "0.78"}
              style={{
                filter: active
                  ? "drop-shadow(0 0 12px rgba(45,149,238,0.75))"
                  : "none",
                transition: "r 700ms ease, opacity 700ms ease, filter 700ms ease",
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}

function ResultGauge({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative grid h-[140px] w-[140px] place-items-center">
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#edf0f4" strokeWidth="11" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#2d95ee"
          strokeLinecap="round"
          strokeWidth="11"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="relative text-center">
        <span className="block text-[2.4rem] font-semibold leading-none text-[#111827]">
          {score}
        </span>
        <span className="mt-1 block text-sm font-medium leading-none text-[#7a828b]">
          /100
        </span>
      </div>
    </div>
  );
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-[10px] font-semibold uppercase tracking-[0.07em] text-[#7a828b]">
        {label}
      </span>
      <span className="mt-1 block text-lg font-semibold leading-none text-[#111827]">
        {value}
      </span>
    </div>
  );
}

function RefreshIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
      viewBox="0 0 24 24"
    >
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}

function CubeIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
      viewBox="0 0 24 24"
    >
      <path d="m12 3 7 4v10l-7 4-7-4V7l7-4Z" />
      <path d="m5 7 7 4 7-4" />
      <path d="M12 11v10" />
    </svg>
  );
}

function PlayIcon({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5.5v13l10-6.5-10-6.5Z" />
    </svg>
  );
}
