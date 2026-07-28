"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Stage = "intro" | "playing" | "complete";
type BoardSize = "s" | "m" | "l";
type Pattern =
  | "stack"
  | "diamond"
  | "rings"
  | "spark"
  | "wave"
  | "grid"
  | "triangle"
  | "hex"
  | "plus"
  | "target"
  | "bolt"
  | "moon"
  | "sun"
  | "cube"
  | "leaf";

type Card = {
  uid: string;
  pattern: Pattern;
  matched: boolean;
};

const patterns: Pattern[] = [
  "stack",
  "diamond",
  "rings",
  "spark",
  "wave",
  "grid",
  "triangle",
  "hex",
  "plus",
  "target",
  "bolt",
  "moon",
  "sun",
  "cube",
  "leaf",
];

const boardSettings: Record<BoardSize, { pairs: number; columns: number }> = {
  s: { pairs: 6, columns: 4 },
  m: { pairs: 10, columns: 5 },
  l: { pairs: 15, columns: 5 },
};

function getTimestamp() {
  return typeof performance !== "undefined" ? performance.now() : new Date().getTime();
}

export default function AbstractCardMatchTrainer() {
  const [stage, setStage] = useState<Stage>("intro");
  const [boardSize, setBoardSize] = useState<BoardSize>("m");
  const [deck, setDeck] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [attemptDurations, setAttemptDurations] = useState<number[]>([]);
  const attemptStartedAtRef = useRef<number | null>(null);

  const currentBoard = boardSettings[boardSize];
  const matchedPairs = deck.filter((card) => card.matched).length / 2;
  const liveScore = matchedPairs * 10;
  const progressPercent = useMemo(
    () => Math.min(100, (matchedPairs / currentBoard.pairs) * 100),
    [currentBoard.pairs, matchedPairs],
  );
  const resultAccuracy =
    currentBoard.pairs > 0 && moves > 0
      ? Math.min(100, Math.round((currentBoard.pairs / moves) * 100))
      : 100;
  const resultAvgTime =
    attemptDurations.length > 0
      ? (attemptDurations.reduce((total, duration) => total + duration, 0) / attemptDurations.length / 1000).toFixed(1)
      : "0.0";
  const resultScore = Math.max(0, Math.min(100, Math.round(resultAccuracy * 0.7)));
  const xpEarned = Math.max(5, Math.round(resultScore / 2));

  useEffect(() => {
    document.body.classList.toggle("abstract-card-playing", stage !== "intro");

    return () => {
      document.body.classList.remove("abstract-card-playing");
    };
  }, [stage]);

  function startRound(size: BoardSize = boardSize) {
    setBoardSize(size);
    setDeck(createDeck(size));
    setFlipped([]);
    setMoves(0);
    setLocked(false);
    setAttemptDurations([]);
    attemptStartedAtRef.current = null;
    setStage("playing");
  }

  function flipCard(index: number) {
    if (locked || flipped.includes(index) || deck[index]?.matched) return;

    if (flipped.length === 0) {
      attemptStartedAtRef.current = getTimestamp();
    }

    const nextFlipped = [...flipped, index];
    setFlipped(nextFlipped);

    if (nextFlipped.length !== 2) return;

    setMoves((value) => value + 1);
    const now = getTimestamp();
    const attemptDuration = now - (attemptStartedAtRef.current ?? now);
    attemptStartedAtRef.current = null;
    setAttemptDurations((durations) => [...durations, attemptDuration]);

    const [firstIndex, secondIndex] = nextFlipped;
    const first = deck[firstIndex];
    const second = deck[secondIndex];

    if (first.pattern === second.pattern) {
      const nextDeck = deck.map((card, cardIndex) =>
        cardIndex === firstIndex || cardIndex === secondIndex
          ? { ...card, matched: true }
          : card,
      );
      setTimeout(() => {
        setDeck(nextDeck);
        setFlipped([]);
        if (nextDeck.every((card) => card.matched)) {
          setStage("complete");
        }
      }, 280);
      return;
    }

    setLocked(true);
    setTimeout(() => {
      setFlipped([]);
      setLocked(false);
    }, 760);
  }

  if (stage === "playing") {
    return (
      <section className="mx-auto grid min-h-[calc(100vh-61px)] content-start justify-items-center px-5 pb-8 pt-7 text-center">
        <div className="flex h-[72px] w-full max-w-[490px] items-center rounded-full bg-white px-5 shadow-[0_12px_28px_rgba(45,149,238,0.08)]">
          <div className="min-w-0 flex-1 text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#707b86]">
              Tier 10/20
            </p>
            <div className="mt-2 h-[5px] w-full rounded-full bg-[#e5e7eb]">
              <div className="h-full rounded-full bg-[#2d95ee]" style={{ width: "50%" }} />
            </div>
            <div className="mt-2 h-[4px] w-full rounded-full bg-[#eef1f4]">
              <div
                className="h-full rounded-full bg-[#9ccdf6]"
                style={{ width: `${Math.max(8, progressPercent)}%` }}
              />
            </div>
          </div>
          <div className="mx-5 h-10 w-px bg-black/10" />
          <GameStat label="Round" value="1/1" />
          <div className="mx-4 h-10 w-px bg-black/10" />
          <GameStat label="Score" value={String(liveScore)} />
          <div className="mx-4 h-10 w-px bg-black/10" />
          <GameStat label="Streak" value="0" mutedIcon />
        </div>

        <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#707b86]">
          {matchedPairs} / {currentBoard.pairs} pairs
        </p>

        <div
          className="mt-4 grid gap-2.5"
          style={{ gridTemplateColumns: `repeat(${currentBoard.columns}, 58px)` }}
        >
          {deck.map((card, index) => {
            const isOpen = card.matched || flipped.includes(index);
            return (
              <button
                key={card.uid}
                type="button"
                onClick={() => flipCard(index)}
                aria-label={isOpen ? `${card.pattern} card` : "Face down card"}
                className={`relative grid h-[70px] w-[58px] place-items-center overflow-hidden rounded-[0.8rem] text-black transition ${
                  isOpen
                    ? "border border-[#2d95ee]/35 bg-white shadow-[0_3px_0_rgba(45,149,238,0.16)]"
                    : "bg-[#2d95ee] shadow-[0_1px_0_rgba(45,149,238,0.18)]"
                }`}
              >
                {isOpen ? (
                  <PatternDiagram pattern={card.pattern} />
                ) : (
                  <>
                    <span className="absolute left-2 top-3 h-5 w-5 rounded-full bg-white/10" />
                    <span className="absolute bottom-2 right-2 h-7 w-7 rounded-full bg-white/10" />
                  </>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#707b86]">
          <span>Size</span>
          {(["s", "m", "l"] as BoardSize[]).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => startRound(size)}
              className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold uppercase ${
                boardSize === size ? "bg-[#2d95ee] text-white" : "bg-[#e9edf1] text-[#707b86]"
              }`}
              aria-pressed={boardSize === size}
            >
              {size}
            </button>
          ))}
        </div>

        <p className="mt-5 max-w-[520px] text-[11px] font-medium leading-4 text-[#707b86]">
          Tap two cards to find matching patterns, or use arrow keys and Enter/Space.
        </p>
      </section>
    );
  }

  if (stage === "complete") {
    return (
      <section className="mx-auto grid min-h-[calc(100vh-61px)] content-start justify-items-center px-5 pb-12 pt-6 text-center">
        <div className="w-full max-w-[365px] overflow-hidden rounded-[1.35rem] bg-white shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
          <div className="h-[3px] w-full bg-[#2d95ee]" />
          <div className="px-8 pb-8 pt-9">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7a828b]">
              Session complete
            </p>
            <h1 className="mt-5 font-display text-[1.45rem] font-semibold leading-tight text-[#111827]">
              Keep Training
            </h1>

            <div className="mt-7 flex justify-center">
              <ResultGauge score={resultScore} />
            </div>

            <div className="mt-7 flex justify-center gap-12">
              <ResultMetric label="Accuracy" value={`${resultAccuracy}%`} />
              <ResultMetric label="Avg time" value={`${resultAvgTime}s`} />
            </div>

            <div className="mx-auto mt-7 inline-flex h-9 items-center justify-center rounded-full bg-[#eef6ff] px-5 text-sm font-semibold text-[#2d95ee]">
              +{xpEarned} XP earned
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => startRound()}
                className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[0.85rem] border border-black/8 bg-white text-sm font-semibold text-[#111827] shadow-[0_1px_0_rgba(0,0,0,0.04)]"
              >
                <RefreshIcon className="h-4 w-4" />
                Try Again
              </button>
              <a
                href="/lab"
                className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[0.85rem] bg-black text-sm font-semibold text-white"
              >
                Done
                <span className="text-lg leading-none">{"\u203a"}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-120px)] max-w-[620px] content-center justify-items-center px-4 pb-7 pt-7 text-center">
      <div className="grid h-[58px] w-[58px] place-items-center rounded-[0.8rem] bg-[#dceefa] text-[#2d95ee]">
        <CardsIcon className="h-7 w-7" />
      </div>

      <h1 className="mt-5 font-display text-[1.22rem] font-semibold leading-tight text-black">
        Abstract Card Match
      </h1>
      <p className="mt-2 max-w-[230px] text-[11px] font-medium leading-[17px] text-muted">
        Flip pairs of face-down cards and remember where each pattern is.
        Match all pairs to complete the round.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <div className="grid h-[48px] w-[64px] place-items-center rounded-[0.6rem] bg-white text-center shadow-[0_1px_0_rgba(0,0,0,0.08)]">
          <span className="text-[8px] font-medium uppercase tracking-[0.04em] text-muted">
            Rounds
          </span>
          <span className="text-[13px] font-semibold leading-none text-black">1</span>
        </div>
        <div className="grid h-[48px] w-[64px] place-items-center rounded-[0.6rem] bg-[#dceefa] text-center">
          <span className="text-[8px] font-medium uppercase tracking-[0.04em] text-muted">
            XP
          </span>
          <span className="text-[13px] font-semibold leading-none text-[#2d95ee]">+25</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => startRound()}
        className="mt-7 inline-flex h-[42px] w-[110px] items-center justify-center gap-1.5 rounded-full bg-black text-[12px] font-semibold text-white shadow-[0_3px_0_rgba(0,0,0,0.22)]"
      >
        <PlayIcon className="h-3.5 w-3.5" />
        Start
      </button>
    </section>
  );
}

function createDeck(size: BoardSize) {
  const cards = patterns.slice(0, boardSettings[size].pairs).flatMap((pattern) => [
    { uid: `${pattern}-a`, pattern, matched: false },
    { uid: `${pattern}-b`, pattern, matched: false },
  ]);

  for (let index = cards.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
  }

  return cards;
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
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}

function CardsIcon({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
      <path d="m5 8 7-3 7 3-7 3-7-3Z" />
      <path d="m5 12 7 3 7-3" />
      <path d="m5 16 7 3 7-3" />
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

function PatternDiagram({ pattern }: { pattern: Pattern }) {
  return (
    <svg
      aria-hidden="true"
      className="relative z-10 h-[54px] w-[46px]"
      viewBox="0 0 92 108"
      fill="none"
    >
      <rect x="8" y="12" width="76" height="84" rx="2" fill={diagramBackground(pattern)} />
      {renderDiagram(pattern)}
    </svg>
  );
}

function diagramBackground(pattern: Pattern) {
  if (pattern === "stack" || pattern === "plus" || pattern === "hex") return "#EAF9F4";
  if (pattern === "diamond" || pattern === "grid" || pattern === "wave") return "#EEF7FF";
  return "#FBF6EF";
}

function renderDiagram(pattern: Pattern) {
  if (pattern === "stack") {
    return (
      <>
        <path d="M22 24h45l10 32H31L22 24Z" fill="#10BFA5" />
        <path d="M18 62h46l12 30H30L18 62Z" fill="#44CDBB" />
        <circle cx="72" cy="38" r="9" fill="#A855F7" />
      </>
    );
  }

  if (pattern === "diamond") {
    return (
      <>
        <rect x="22" y="62" width="26" height="26" fill="#B98BE8" />
        <rect x="43" y="43" width="26" height="26" fill="#A86ADE" />
        <rect x="62" y="20" width="24" height="24" fill="#B98BE8" />
      </>
    );
  }

  if (pattern === "rings") {
    return (
      <>
        <circle cx="53" cy="52" r="26" stroke="#74B9EF" strokeWidth="14" />
        <circle cx="28" cy="76" r="10" fill="#FFA867" />
      </>
    );
  }

  if (pattern === "spark") {
    return (
      <>
        <circle cx="28" cy="34" r="10" fill="#EC80B6" />
        <path d="M42 76h35V28h18v66H42V76Z" fill="#6ED190" transform="translate(-16 0)" />
      </>
    );
  }

  if (pattern === "wave") {
    return (
      <>
        <path d="M24 72V28l52 22-52 22Z" fill="#73B5EE" />
        <circle cx="70" cy="32" r="11" fill="#FF8289" />
      </>
    );
  }

  if (pattern === "grid") {
    return (
      <>
        <path d="M24 28h50L52 76 24 28Z" fill="#73B5EE" />
        <rect x="64" y="66" width="18" height="28" fill="#FFA867" />
      </>
    );
  }

  if (pattern === "triangle") {
    return (
      <>
        <path d="M24 80 46 22l22 58H24Z" fill="#FFD23F" />
        <circle cx="67" cy="36" r="9" fill="#10BFA5" />
        <rect x="21" y="72" width="54" height="9" fill="#A855F7" />
      </>
    );
  }

  if (pattern === "hex") {
    return (
      <>
        <path d="M46 22 72 37v30L46 82 20 67V37l26-15Z" fill="#22C55E" />
        <path d="M46 35 61 44v18l-15 9-15-9V44l15-9Z" fill="#DDF7EC" />
        <circle cx="70" cy="74" r="8" fill="#F97316" />
      </>
    );
  }

  if (pattern === "plus") {
    return (
      <>
        <rect x="36" y="20" width="20" height="68" fill="#F87171" />
        <rect x="18" y="44" width="56" height="20" fill="#60A5FA" />
        <circle cx="70" cy="28" r="9" fill="#FBBF24" />
      </>
    );
  }

  if (pattern === "target") {
    return (
      <>
        <circle cx="48" cy="54" r="31" fill="#FDE68A" />
        <circle cx="48" cy="54" r="21" fill="#FB7185" />
        <circle cx="48" cy="54" r="10" fill="#2563EB" />
        <rect x="18" y="76" width="24" height="12" fill="#10BFA5" />
      </>
    );
  }

  if (pattern === "bolt") {
    return (
      <>
        <path d="M51 18 25 58h21l-6 32 29-45H48l3-27Z" fill="#FFD23F" />
        <circle cx="66" cy="70" r="12" fill="#38BDF8" />
      </>
    );
  }

  if (pattern === "moon") {
    return (
      <>
        <circle cx="48" cy="54" r="29" fill="#A78BFA" />
        <circle cx="60" cy="46" r="29" fill={diagramBackground(pattern)} />
        <rect x="22" y="72" width="44" height="14" fill="#34D399" />
      </>
    );
  }

  if (pattern === "sun") {
    return (
      <>
        <circle cx="48" cy="54" r="20" fill="#FBBF24" />
        <path d="M48 16v14M48 78v14M10 54h14M72 54h14M22 28l10 10M64 70l10 10M74 28 64 38M32 70 22 80" stroke="#F97316" strokeWidth="6" strokeLinecap="round" />
        <circle cx="24" cy="78" r="8" fill="#38BDF8" />
      </>
    );
  }

  if (pattern === "cube") {
    return (
      <>
        <path d="m46 18 28 16-28 16-28-16 28-16Z" fill="#93C5FD" />
        <path d="M18 34 46 50v34L18 68V34Z" fill="#60A5FA" />
        <path d="M74 34 46 50v34l28-16V34Z" fill="#2563EB" />
        <circle cx="72" cy="76" r="8" fill="#F472B6" />
      </>
    );
  }

  return (
    <>
      <path d="M24 76c28 0 44-18 44-48H52c-25 0-36 17-36 39v9h8Z" fill="#6ED190" />
      <path d="M20 82 62 38" stroke="#0EA5E9" strokeWidth="7" strokeLinecap="round" />
      <circle cx="70" cy="30" r="8" fill="#A855F7" />
    </>
  );
}
