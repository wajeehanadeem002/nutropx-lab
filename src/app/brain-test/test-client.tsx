"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type Stage =
  | "landing"
  | "reaction-intro"
  | "reaction-wait"
  | "reaction-target"
  | "reaction-result"
  | "memory-intro"
  | "memory-show"
  | "memory-input"
  | "memory-feedback"
  | "analyzing"
  | "results";

type IconName =
  | "back"
  | "book"
  | "brain"
  | "chart"
  | "chevron"
  | "lock"
  | "spark"
  | "speed"
  | "target"
  | "check"
  | "shield"
  | "truck"
  | "trophy";

const reactionRoundsTotal = 6;
const memoryLengths = [4, 5, 6];
const XYNAPTIC_DROPS_URL = "https://nutropx.com/product/xynaptic-drops";
const FIVE_BRAIN_URL = "https://nutropx.com/product/5-brain";
const XTRA_BRAIN_URL = "https://nutropx.com/product/xtra-brain";
const BRAIN_STACK_URL = "https://nutropx.com/product/xynergistic-brain-stack";

function getSupplementUrl(name: string) {
  if (name === "Xynaptic Drops") return XYNAPTIC_DROPS_URL;
  if (name === "5-Brain") return FIVE_BRAIN_URL;
  if (name === "Xtra-Brain") return XTRA_BRAIN_URL;
  return undefined;
}

const checkInItems = [
  {
    title: "Reaction Speed",
    meta: "6 rounds - ~30 seconds",
    icon: "speed" as IconName,
  },
  {
    title: "Working Memory",
    meta: "3 rounds - ~60 seconds",
    icon: "brain" as IconName,
  },
];

export function BrainCheckInClient() {
  const router = useRouter();
  const waitTimerRef = useRef<number | null>(null);
  const advanceTimerRef = useRef<number | null>(null);

  const [stage, setStage] = useState<Stage>("landing");
  const [reactionRound, setReactionRound] = useState(1);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [reactionEarly, setReactionEarly] = useState(false);
  const [targetStartedAt, setTargetStartedAt] = useState<number | null>(null);
  const [lastReactionTime, setLastReactionTime] = useState<number | null>(null);
  const [memoryRound, setMemoryRound] = useState(1);
  const [memorySequence, setMemorySequence] = useState<string[]>([]);
  const [memoryIndex, setMemoryIndex] = useState(0);
  const [memoryInput, setMemoryInput] = useState("");
  const [memoryResults, setMemoryResults] = useState<boolean[]>([]);
  const [memoryFeedback, setMemoryFeedback] = useState<"correct" | "incorrect" | null>(
    null,
  );
  const [unlockEmail, setUnlockEmail] = useState("");
  const [unlockMessage, setUnlockMessage] = useState("");
  const [fullResultsUnlocked, setFullResultsUnlocked] = useState(false);

  const averageReaction = useMemo(() => average(reactionTimes), [reactionTimes]);
  const score = useMemo(() => {
    const reactionBase = averageReaction
      ? clamp(Math.round(72 - (averageReaction - 280) / 24), 15, 78)
      : 35;
    const memoryBase = Math.round((memoryResults.filter(Boolean).length / 3) * 24);
    return clamp(Math.round(12 + reactionBase * 0.55 + memoryBase), 1, 99);
  }, [averageReaction, memoryResults]);

  const progress = getProgress(stage, reactionRound, memoryRound);

  useEffect(() => {
    return () => {
      if (waitTimerRef.current !== null) window.clearTimeout(waitTimerRef.current);
      if (advanceTimerRef.current !== null) window.clearTimeout(advanceTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (stage !== "memory-show" || memorySequence.length === 0) return;

    const timer = window.setTimeout(() => {
      if (memoryIndex < memorySequence.length - 1) {
        setMemoryIndex((index) => index + 1);
      } else {
        setMemoryInput("");
        setStage("memory-input");
      }
    }, 850);

    return () => window.clearTimeout(timer);
  }, [memoryIndex, memorySequence.length, stage]);

  useEffect(() => {
    if (stage !== "analyzing") return;

    const timer = window.setTimeout(() => {
      setStage("results");
    }, 1700);

    return () => window.clearTimeout(timer);
  }, [stage]);

  function clearTimers() {
    if (waitTimerRef.current !== null) {
      window.clearTimeout(waitTimerRef.current);
      waitTimerRef.current = null;
    }

    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }

  function resetRun(nextStage: Stage = "landing") {
    clearTimers();
    setReactionRound(1);
    setReactionTimes([]);
    setReactionEarly(false);
    setTargetStartedAt(null);
    setLastReactionTime(null);
    setMemoryRound(1);
    setMemorySequence([]);
    setMemoryIndex(0);
    setMemoryInput("");
    setMemoryResults([]);
    setMemoryFeedback(null);
    setUnlockEmail("");
    setUnlockMessage("");
    setFullResultsUnlocked(false);
    setStage(nextStage);
  }

  function startCheckIn() {
    resetRun("reaction-intro");
  }

  function startReactionRound(round = 1) {
    clearTimers();
    setReactionRound(round);
    setReactionEarly(false);
    setTargetStartedAt(null);
    setLastReactionTime(null);
    setStage("reaction-wait");

    waitTimerRef.current = window.setTimeout(() => {
      waitTimerRef.current = null;
      setTargetStartedAt(performance.now());
      setStage("reaction-target");
    }, 1000);
  }

  function handleEarlyReactionTap() {
    if (reactionEarly) return;

    if (waitTimerRef.current !== null) {
      window.clearTimeout(waitTimerRef.current);
      waitTimerRef.current = null;
    }

    setReactionEarly(true);

    advanceTimerRef.current = window.setTimeout(() => {
      advanceTimerRef.current = null;
      startReactionRound(reactionRound);
    }, 950);
  }

  function handleTargetTap() {
    if (targetStartedAt === null) return;

    const reactionMs = Math.max(120, Math.round(performance.now() - targetStartedAt));
    const nextRound = reactionRound + 1;
    setLastReactionTime(reactionMs);
    setReactionTimes((times) => [...times, reactionMs]);
    setStage("reaction-result");

    advanceTimerRef.current = window.setTimeout(() => {
      advanceTimerRef.current = null;
      if (nextRound > reactionRoundsTotal) {
        setStage("memory-intro");
      } else {
        startReactionRound(nextRound);
      }
    }, 950);
  }

  function startMemoryRound(round = 1) {
    clearTimers();
    setMemoryRound(round);
    setMemorySequence(makeDigits(memoryLengths[round - 1]));
    setMemoryIndex(0);
    setMemoryInput("");
    setMemoryFeedback(null);
    setStage("memory-show");
  }

  function submitMemoryAnswer() {
    const expected = memorySequence.join("");
    const typedDigits = memoryInput.replace(/\D/g, "");
    const correct = typedDigits === expected;
    const nextRound = memoryRound + 1;

    setMemoryFeedback(correct ? "correct" : "incorrect");
    setMemoryResults((results) => [...results, correct]);
    setStage("memory-feedback");

    advanceTimerRef.current = window.setTimeout(() => {
      advanceTimerRef.current = null;
      if (nextRound > memoryLengths.length) {
        setStage("analyzing");
      } else {
        startMemoryRound(nextRound);
      }
    }, 1150);
  }

  function handleBack() {
    if (stage === "landing") {
      router.push("/dashboard");
      return;
    }

    resetRun("landing");
  }

  return (
    <main
      className="min-h-screen text-black"
      style={{
        background:
          "linear-gradient(105deg, #ecfbfa 0%, #f8fbfa 50%, #fff7f2 100%)",
      }}
    >
      {stage === "results" ? (
        <ResultsHeader />
      ) : (
        <CheckInHeader onBack={handleBack} progress={progress} showProgress={stage !== "landing"} />
      )}

      <div className={stage === "landing" ? "mx-auto max-w-[720px] px-6 pb-16 pt-10" : "px-6"}>
        {stage === "landing" && <LandingStage onStart={startCheckIn} />}

        {stage === "reaction-intro" && (
          <ReactionIntroStage onStartRound={() => startReactionRound(1)} />
        )}

        {stage === "reaction-wait" && (
          <ReactionWaitStage
            averageReaction={averageReaction}
            isEarly={reactionEarly}
            round={reactionRound}
            onEarlyTap={handleEarlyReactionTap}
          />
        )}

        {stage === "reaction-target" && (
          <ReactionTargetStage round={reactionRound} onTap={handleTargetTap} />
        )}

        {stage === "reaction-result" && (
          <ReactionResultStage
            averageReaction={averageReaction}
            lastReactionTime={lastReactionTime}
            round={reactionRound}
          />
        )}

        {stage === "memory-intro" && (
          <MemoryIntroStage onStartMemory={() => startMemoryRound(1)} />
        )}

        {stage === "memory-show" && (
          <MemoryShowStage
            currentDigit={memorySequence[memoryIndex] ?? ""}
            digitCount={memorySequence.length}
            index={memoryIndex}
            round={memoryRound}
          />
        )}

        {stage === "memory-input" && (
          <MemoryInputStage
            digitCount={memorySequence.length}
            input={memoryInput}
            onInput={setMemoryInput}
            onSubmit={submitMemoryAnswer}
            round={memoryRound}
          />
        )}

        {stage === "memory-feedback" && (
          <MemoryFeedbackStage feedback={memoryFeedback} sequence={memorySequence} />
        )}

        {stage === "analyzing" && <AnalyzingStage />}

        {stage === "results" && (
          <ResultsStage
            averageReaction={averageReaction}
            memoryResults={memoryResults}
            onRetake={() => resetRun("reaction-intro")}
            score={score}
            unlockEmail={unlockEmail}
            unlockMessage={unlockMessage}
            fullResultsUnlocked={fullResultsUnlocked}
            onUnlockEmail={setUnlockEmail}
            onUnlock={() => {
              const email = unlockEmail.trim();
              if (!email) {
                setFullResultsUnlocked(false);
                setUnlockMessage("");
                return;
              }

              if (!email.includes("@")) {
                setFullResultsUnlocked(false);
                setUnlockMessage("Enter a valid email to unlock your full results.");
                return;
              }

              setFullResultsUnlocked(true);
              setUnlockMessage("");
            }}
          />
        )}
      </div>
    </main>
  );
}

function CheckInHeader({
  onBack,
  progress,
  showProgress,
}: {
  onBack: () => void;
  progress: number;
  showProgress: boolean;
}) {
  return (
    <>
      <header className="relative h-[70px] border-b-2 border-black bg-white">
        <button
          type="button"
          onClick={onBack}
          className="absolute left-5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-[#f1f2f3] text-black"
          aria-label="Back"
        >
          <AppIcon name="back" className="h-5 w-5" />
        </button>

        <div className="mx-auto flex h-full w-fit items-center gap-4">
          <Image
            src="/assets/nutropx-lab-logo.png"
            alt="Nutropx LAB"
            width={170}
            height={48}
            priority
            className="h-9 w-auto"
          />
          <span className="text-[13px] font-black uppercase tracking-[0.16em] text-black">
            Brain Check-In
          </span>
        </div>

        {showProgress && (
          <span className="absolute right-7 top-1/2 -translate-y-1/2 text-xs font-black text-black">
            {progress}%
          </span>
        )}
      </header>

      {showProgress && (
        <div className="h-[5px] bg-transparent">
          <span
            className="block h-full bg-[#29c8e9] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </>
  );
}

function ResultsHeader() {
  return (
    <header className="relative h-[70px] border-b-2 border-black bg-white">
      <div className="mx-auto flex h-full w-fit items-center gap-4">
        <Image
          src="/assets/nutropx-lab-logo.png"
          alt="Nutropx LAB"
          width={170}
          height={48}
          priority
          className="h-9 w-auto"
        />
        <span className="text-[13px] font-black uppercase tracking-[0.16em] text-black">
          Brain Test Results
        </span>
      </div>
      <Link
        href="/auth/login"
        className="absolute right-7 top-1/2 -translate-y-1/2 text-sm font-black text-black"
      >
        Sign in
      </Link>
    </header>
  );
}

function LandingStage({ onStart }: { onStart: () => void }) {
  return (
    <>
      <section className="mx-auto rounded-[1.15rem] bg-[#131516] px-8 py-8 text-center text-white shadow-[0_18px_42px_rgba(0,0,0,0.18)] sm:h-[191px] sm:w-[450px]">
        <span className="inline-flex rounded-full border border-[#23c8ee]/55 px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-[#23c8ee]">
          90 seconds &middot; 2 rounds
        </span>
        <h1 className="mt-5 font-display text-[1.45rem] font-semibold leading-tight sm:text-[1.65rem]">
          Check in with <span className="text-[#23c8ee]">your brain.</span>
        </h1>
        <p className="mx-auto mt-3 max-w-[360px] text-[11px] font-semibold leading-[18px] text-white/62">
          A quick session that updates your Cognitive Fitness Score and shows how this
          week&apos;s training is landing.
        </p>
      </section>

      <section className="mx-auto mt-8 grid gap-4 sm:w-[450px]">
        {checkInItems.map((item) => (
          <CheckInRow key={item.title} {...item} />
        ))}
      </section>

      <button
        type="button"
        onClick={onStart}
        className="mx-auto mt-8 flex h-[63px] items-center justify-center rounded-[1rem] border-[3px] border-black bg-[#ff6b2c] text-center text-base font-black uppercase text-black shadow-[0_7px_0_#000] sm:w-[453px]"
      >
        Start Quick Check-In <span className="ml-2 text-xl">-&gt;</span>
      </button>

      <p className="mx-auto mt-8 max-w-[450px] text-center text-[11px] font-semibold leading-[16.5px] text-[#747474] sm:h-[33px] sm:w-[450px]">
        For best accuracy, use a quiet environment. This Check-In measures Speed and
        Memory. More categories unlock with more sessions.
      </p>

      <section className="mx-auto mt-[15px] max-w-[470px] space-y-[10px] text-center text-[11px] font-medium leading-[17.5px] text-[#747474]">
        <p className="mx-auto sm:h-[35px] sm:w-[470px]">
          The Quick Check-In and your Cognitive Fitness Score are wellness and
          educational tools. Not an IQ test, not a measure of intelligence, and not a
          medical assessment or diagnosis.
        </p>
        <p className="mx-auto max-w-[459px] px-3 sm:h-[30px] sm:w-[459px]">
          Results reflect in-app performance today and can vary with sleep, time of day,
          and environment.
        </p>
      </section>

      <PoweredCard />
      <Disclaimer />
    </>
  );
}

function ReactionIntroStage({ onStartRound }: { onStartRound: () => void }) {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-75px)] max-w-[520px] content-center justify-items-center px-2 text-center">
      <div className="grid h-[88px] w-[88px] place-items-center rounded-[1rem] bg-[#43c3e5] text-black shadow-[9px_9px_0_#000]">
        <AppIcon name="speed" className="h-12 w-12" />
      </div>

      <h1 className="mt-8 font-display text-[2rem] font-bold leading-none text-black">
        Reaction Speed
      </h1>
      <p className="mt-6 max-w-[360px] text-[18px] font-medium leading-[1.45] text-black">
        A cyan target will appear after a random delay. Tap it as fast as you can.{" "}
        <strong className="font-bold">6 rounds.</strong>
      </p>

      <div className="mt-8 w-full max-w-[360px] rounded-[1rem] border-[2px] border-black bg-white px-6 py-5 text-left shadow-[7px_7px_0_#000]">
        <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#0a7290]">
          <span className="grid h-4 w-4 place-items-center rounded-full border border-[#0a7290] text-[10px]">
            !
          </span>
          Important
        </p>
        <p className="mt-3 text-[15px] font-medium leading-[1.55] text-black">
          Wait for the target. Tapping early restarts the round.
        </p>
      </div>

      <button
        type="button"
        onClick={onStartRound}
        className="mt-9 flex h-[64px] w-[230px] items-center justify-center rounded-[1rem] bg-black text-base font-bold text-white shadow-[9px_9px_0_#000]"
      >
        Start Round 1 <span className="ml-4 text-2xl">-&gt;</span>
      </button>
    </section>
  );
}

function ReactionWaitStage({
  averageReaction,
  isEarly,
  onEarlyTap,
  round,
}: {
  averageReaction: number;
  isEarly: boolean;
  onEarlyTap: () => void;
  round: number;
}) {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-75px)] max-w-[540px] content-center justify-items-center px-2 text-center">
      <ReactionStatus averageReaction={averageReaction} round={round} />

      <button
        type="button"
        onClick={onEarlyTap}
        className={`mt-10 grid h-[285px] w-full max-w-[360px] place-items-center rounded-[1rem] text-black ${
          isEarly ? "bg-[#ff6b2a] shadow-[9px_9px_0_#000]" : "bg-white/55"
        }`}
      >
        <span className="grid justify-items-center">
          {isEarly ? (
            <>
              <span className="text-[1.4rem] font-black uppercase tracking-[0.08em] text-black">
                Too early
              </span>
              <span className="mt-3 text-[12px] font-black uppercase tracking-[0.16em] text-black">
                Wait for cyan
              </span>
            </>
          ) : (
            <>
              <AppIcon name="target" className="h-8 w-8 text-[#747474]" />
              <span className="mt-8 text-[12px] font-black uppercase tracking-[0.16em] text-black">
                Wait for the cyan target...
              </span>
            </>
          )}
        </span>
      </button>
    </section>
  );
}

function ReactionTargetStage({ onTap, round }: { onTap: () => void; round: number }) {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-75px)] max-w-[540px] content-center justify-items-center px-2 text-center">
      <ReactionStatus averageReaction={0} hideAverage round={round} />

      <button
        type="button"
        onClick={onTap}
        className="mt-10 grid h-[300px] w-full max-w-[390px] place-items-center rounded-[1rem] bg-[#21c5e6] text-black active:scale-[0.99]"
      >
        <span className="grid justify-items-center">
          <span className="grid h-[118px] w-[118px] place-items-center rounded-full bg-white/20">
            <AppIcon name="speed" className="h-16 w-16 text-black" />
          </span>
          <span className="mt-8 text-[1.2rem] font-black uppercase tracking-[0.12em] text-[#087a93]">
            Tap Now!
          </span>
        </span>
      </button>
    </section>
  );
}

function ReactionResultStage({
  averageReaction,
  lastReactionTime,
  round,
}: {
  averageReaction: number;
  lastReactionTime: number | null;
  round: number;
}) {
  const ms = lastReactionTime ?? 0;

  return (
    <section className="mx-auto grid min-h-[calc(100vh-75px)] max-w-[540px] content-center justify-items-center px-2 text-center">
      <ReactionStatus averageReaction={averageReaction} round={round} />

      <div className="mt-10 grid h-[285px] w-full max-w-[360px] place-items-center rounded-[1rem] bg-white/55 text-black">
        <div>
          <p className="font-display text-[3.6rem] font-bold leading-none text-[#0b78a2]">
            {ms}
          </p>
          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.14em] text-black">
            Milliseconds
          </p>
          <span className="mx-auto mt-5 inline-flex rounded-full bg-[#fff0e6] px-4 py-1 text-[10px] font-black uppercase text-[#c95f1e]">
            {reactionLabel(ms)}
          </span>
        </div>
      </div>

      <span className="mt-8 inline-flex rounded-full border-[2px] border-black bg-white px-5 py-2 text-[12px] font-black text-black">
        Avg {averageReaction || ms}ms
      </span>
    </section>
  );
}

function ReactionStatus({
  averageReaction,
  hideAverage,
  round,
}: {
  averageReaction: number;
  hideAverage?: boolean;
  round: number;
}) {
  return (
    <>
      <div className="grid w-full max-w-[390px] grid-cols-[1fr_1fr] items-center gap-6">
        <span className="inline-flex h-[30px] w-fit items-center gap-2 rounded-full border border-[#29c8e9]/35 bg-white px-4 text-[10px] font-black uppercase tracking-[0.08em] text-[#0a7290]">
          <AppIcon name="speed" className="h-4 w-4" />
          Reaction
        </span>
        <span className="text-right text-[11px] font-black uppercase tracking-[0.16em] text-black">
          Round {round} / 6
        </span>
      </div>
      <div className="mt-5 h-2 w-full max-w-[390px] rounded-full bg-[#f3f5f6]">
        <span
          className="block h-full rounded-full bg-[#29c8e9]"
          style={{ width: `${Math.max(10, (round / reactionRoundsTotal) * 100)}%` }}
        />
      </div>
      {!hideAverage && averageReaction > 0 && (
        <p className="mt-3 text-[11px] font-bold text-[#747474]">Average {averageReaction}ms</p>
      )}
    </>
  );
}

function MemoryIntroStage({ onStartMemory }: { onStartMemory: () => void }) {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-75px)] max-w-[520px] content-center justify-items-center px-2 text-center">
      <div className="grid h-[88px] w-[88px] place-items-center rounded-[1rem] bg-[#43c3e5] text-white shadow-[9px_9px_0_#000]">
        <AppIcon name="book" className="h-12 w-12" />
      </div>

      <h1 className="mt-8 font-display text-[2rem] font-bold leading-none text-black">
        Working Memory
      </h1>
      <p className="mt-6 max-w-[360px] text-[18px] font-medium leading-[1.55] text-black">
        Digits will appear one at a time. Remember them in order and type them back.
      </p>

      <div className="mt-8 w-full max-w-[340px] rounded-[1rem] border-[2px] border-black bg-white px-7 py-5 text-left shadow-[7px_7px_0_#000]">
        {memoryLengths.map((digits, index) => (
          <div key={digits} className="flex items-center justify-between py-1.5">
            <span className="flex items-center gap-4 text-base font-medium text-black">
              <span className="h-5 w-5 rounded-full bg-[#43c3e5]" />
              Round {index + 1}
            </span>
            <span className="text-base font-bold text-black">{digits} digits</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onStartMemory}
        className="mt-9 flex h-[64px] w-[280px] items-center justify-center rounded-[1rem] bg-black text-base font-bold text-white shadow-[9px_9px_0_#000]"
      >
        Start Memory Test <span className="ml-4 text-2xl">-&gt;</span>
      </button>
    </section>
  );
}

function MemoryShowStage({
  currentDigit,
  digitCount,
  index,
  round,
}: {
  currentDigit: string;
  digitCount: number;
  index: number;
  round: number;
}) {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-75px)] max-w-[560px] content-center justify-items-center px-2 text-center">
      <MemoryRoundBar digitCount={digitCount} index={index + 1} round={round} />

      <p className="mt-11 text-[16px] font-bold text-black">Remember this sequence</p>

      <div className="mt-7 grid h-[142px] w-[142px] place-items-center rounded-[1rem] bg-[#43c3e5] text-white shadow-[9px_9px_0_#000]">
        <span className="font-display text-[4.4rem] font-bold leading-none">
          {currentDigit}
        </span>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2">
        {Array.from({ length: digitCount }).map((_, digitIndex) => (
          <span
            key={digitIndex}
            className={`h-2 rounded-full ${
              digitIndex <= index ? "w-6 bg-[#43c3e5]" : "w-3 bg-[#dfe8eb]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function MemoryInputStage({
  digitCount,
  input,
  onInput,
  onSubmit,
  round,
}: {
  digitCount: number;
  input: string;
  onInput: (value: string) => void;
  onSubmit: () => void;
  round: number;
}) {
  const canSubmit = input.replace(/\D/g, "").length >= digitCount;

  return (
    <section className="mx-auto grid min-h-[calc(100vh-75px)] max-w-[560px] content-center justify-items-center px-2 text-center">
      <MemoryRoundBar digitCount={digitCount} index={digitCount} round={round} />

      <p className="mt-12 text-[16px] font-bold text-black">
        Type the {digitCount} numbers separated by spaces
      </p>
      <input
        value={input}
        onChange={(event) => onInput(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && canSubmit) onSubmit();
        }}
        inputMode="numeric"
        autoFocus
        placeholder={Array.from({ length: digitCount }, () => "_").join("  ")}
        className="mt-8 h-[78px] w-full max-w-[420px] rounded-[1rem] border-[3px] border-[#43c3e5] bg-white px-6 text-center text-[2.5rem] font-bold tracking-[0.18em] text-black shadow-[0_0_0_3px_rgba(67,195,229,0.18)] outline-none placeholder:text-[#9ca3af]"
      />
      <button
        type="button"
        disabled={!canSubmit}
        onClick={onSubmit}
        className="mt-8 flex h-[64px] w-[190px] items-center justify-center rounded-[1rem] bg-black text-base font-bold text-white shadow-[9px_9px_0_#000] disabled:bg-[#9aa09e] disabled:shadow-none"
      >
        Submit <span className="ml-4 text-2xl">-&gt;</span>
      </button>
    </section>
  );
}

function MemoryFeedbackStage({
  feedback,
  sequence,
}: {
  feedback: "correct" | "incorrect" | null;
  sequence: string[];
}) {
  const correct = feedback === "correct";

  return (
    <section className="mx-auto grid min-h-[calc(100vh-75px)] max-w-[520px] content-center justify-items-center px-2 text-center">
      <div
        className={`grid h-[230px] w-full max-w-[380px] place-items-center rounded-[1rem] border-[3px] border-black bg-white shadow-[7px_7px_0_#000] ${
          correct ? "text-[#0a9d62]" : "text-[#c42e2e]"
        }`}
      >
        <div>
          <p className="font-display text-[2.2rem] font-bold">
            {correct ? "Correct" : "Try the next one"}
          </p>
          <p className="mt-4 text-[13px] font-semibold text-[#747474]">
            Sequence: {sequence.join(" ")}
          </p>
        </div>
      </div>
    </section>
  );
}

function MemoryRoundBar({
  digitCount,
  index,
  round,
}: {
  digitCount: number;
  index: number;
  round: number;
}) {
  return (
    <>
      <div className="grid w-full max-w-[390px] grid-cols-[1fr_1fr] items-center gap-6">
        <span className="inline-flex h-[30px] w-[112px] items-center justify-center rounded-full bg-[#43c3e5] text-[10px] font-black uppercase tracking-[0.08em] text-white">
          Memory
        </span>
        <span className="text-right text-[11px] font-black uppercase tracking-[0.16em] text-black">
          Round {round} / 3
        </span>
      </div>
      <div className="mt-5 h-2 w-full max-w-[390px] rounded-full bg-[#f3f5f6]">
        <span
          className="block h-full rounded-full bg-[#29c8e9]"
          style={{ width: `${Math.max(10, (index / digitCount) * 100)}%` }}
        />
      </div>
    </>
  );
}

function AnalyzingStage() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-75px)] max-w-[560px] content-center justify-items-center px-2 text-center">
      <div className="grid h-[88px] w-[88px] place-items-center rounded-[1rem] bg-[#43c3e5] text-black shadow-[9px_9px_0_#000]">
        <AppIcon name="brain" className="h-12 w-12" />
      </div>
      <h1 className="mt-8 max-w-[420px] font-display text-[2rem] font-bold leading-tight text-black">
        Calculating your Cognitive Fitness Score
      </h1>
      <p className="mt-5 text-[16px] font-medium text-black">Analyzing performance data...</p>
      <div className="mt-8 flex gap-3">
        <span className="h-3 w-3 animate-pulse rounded-full bg-[#43c3e5]" />
        <span className="h-3 w-3 animate-pulse rounded-full bg-[#43c3e5] [animation-delay:150ms]" />
        <span className="h-3 w-3 animate-pulse rounded-full bg-[#43c3e5] [animation-delay:300ms]" />
      </div>
    </section>
  );
}

function ResultsStage({
  averageReaction,
  fullResultsUnlocked,
  memoryResults,
  onRetake,
  onUnlock,
  onUnlockEmail,
  score,
  unlockEmail,
  unlockMessage,
}: {
  averageReaction: number;
  fullResultsUnlocked: boolean;
  memoryResults: boolean[];
  onRetake: () => void;
  onUnlock: () => void;
  onUnlockEmail: (value: string) => void;
  score: number;
  unlockEmail: string;
  unlockMessage: string;
}) {
  const correctMemory = memoryResults.filter(Boolean).length;
  const [trialPlan, setTrialPlan] = useState<"annual" | "monthly">("annual");
  const [trialAccepted, setTrialAccepted] = useState(false);

  return (
    <section className="mx-auto max-w-[600px] px-4 pb-16 pt-12 text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-[#43c3e5] px-5 py-3 text-[12px] font-black uppercase tracking-[0.08em] text-black">
        <AppIcon name="spark" className="h-4 w-4" />
        Brain Test Complete
      </span>

      <article className="mx-auto mt-7 rounded-[1.2rem] bg-[#131516] px-8 py-10 text-white shadow-[0_20px_42px_rgba(0,0,0,0.18)] sm:w-[460px]">
        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-white/65">
          Your Cognitive Fitness Score
        </p>
        <ScoreRing score={score} />
        <p className="mx-auto mt-8 max-w-[330px] text-[13px] font-semibold leading-6 text-white/65">
          Your Cognitive Fitness Score is a personal wellness benchmark. It is not an IQ
          test, not a measure of intelligence, and not a medical assessment or diagnosis.
        </p>
      </article>

      <article className="mx-auto mt-8 rounded-[1.1rem] border-[3px] border-black bg-white px-6 py-6 text-left shadow-[8px_8px_0_#000] sm:w-[460px]">
        <div className="flex items-start gap-5">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-[1rem] bg-[#43c3e5] text-black">
            <AppIcon name="lock" className="h-9 w-9" />
          </span>
          <div>
            <h2 className="font-display text-[1.45rem] font-bold leading-tight text-black">
              Unlock your full results
            </h2>
            <p className="mt-1 text-[15px] font-medium leading-5 text-black">
              Domain breakdown + Professor 5-Brain analysis + product match
            </p>
          </div>
        </div>
        <form
          className="mt-6 grid gap-3 sm:grid-cols-[1fr_120px]"
          onSubmit={(event) => {
            event.preventDefault();
            onUnlock();
          }}
        >
          <input
            type="email"
            value={unlockEmail}
            onChange={(event) => {
              onUnlockEmail(event.target.value);
            }}
            placeholder="Enter your email"
            className="h-[58px] rounded-[1rem] border-[3px] border-black px-5 text-base font-medium outline-none placeholder:text-[#9ca3af]"
          />
          <button
            type="submit"
            className="h-[58px] rounded-[1rem] bg-black text-base font-bold text-white"
          >
            Unlock <span className="ml-2">-&gt;</span>
          </button>
        </form>
        {unlockMessage && (
          <p className="mt-3 text-center text-[12px] font-semibold text-[#d93025]">
            {unlockMessage}
          </p>
        )}
      </article>

      {fullResultsUnlocked ? (
        <>
          <UnlockedFullResults />
          <RecommendedTrainingCard />
          <SaveRoutineCard />
          <ProductMatchCard />
          <DailySupportStack />
          <EnterLabTrialCard
            accepted={trialAccepted}
            onAcceptedChange={setTrialAccepted}
            onPlanChange={setTrialPlan}
            plan={trialPlan}
          />
          <p className="mx-auto mt-6 max-w-[460px] text-left text-[13px] font-medium leading-6 text-[#374151]">
            *These statements have not been evaluated by the Food and Drug Administration.
            This product is not intended to diagnose, treat, cure, or prevent any disease.
          </p>
          <div className="mt-7 flex items-center justify-center gap-6 text-[14px] font-medium text-black">
            <button
              type="button"
              onClick={onRetake}
              className="underline-offset-4 hover:underline"
            >
              Retake the Brain Test
            </button>
            <Link href="/lab" className="underline-offset-4 hover:underline">
              Go to Training
            </Link>
          </div>
        </>
      ) : (
        <>
          <RecommendedTrainingCard />
          <SaveRoutineCard />
          <EnterLabPreviewCard />
          <div className="mt-4 text-center text-[14px] font-medium text-black">
            <button
              type="button"
              onClick={onRetake}
              className="underline-offset-4 hover:underline"
            >
              Retake the Brain Test
            </button>
          </div>
        </>
      )}

      <p className="mt-8 text-[11px] font-medium text-[#747474]">
        Reaction average: {averageReaction || 0}ms. Memory correct: {correctMemory}/3.
      </p>
    </section>
  );
}

function UnlockedFullResults() {
  return (
    <>
      <article className="mx-auto mt-8 rounded-[1.1rem] border-[3px] border-black bg-white px-6 py-6 text-left shadow-[8px_8px_0_#000] sm:w-[460px]">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-black">
            By Training Category
          </p>
          <span className="inline-flex h-8 items-center gap-2 rounded-full border-[3px] border-black px-3 text-[11px] font-black uppercase text-black shadow-[0_4px_0_#000]">
            <AppIcon name="trophy" className="h-3.5 w-3.5" />
            Memory Best
          </span>
        </div>

        <div className="mt-6 space-y-4">
          <DomainScoreRow
            label="Speed"
            value={5}
            color="#ffd400"
            isGrowthArea
          />
          <DomainScoreRow label="Memory" value={58} color="#2d95ee" />
          <DomainScoreRow label="Attention" value={34} color="#ef3333" />
          <DomainScoreRow label="Flexibility" value={42} color="#14bfa6" />
        </div>
      </article>

      <article className="mx-auto mt-8 rounded-[1.1rem] border-[3px] border-black bg-white px-6 py-6 text-left shadow-[8px_8px_0_#000] sm:w-[460px]">
        <div className="flex items-center gap-4">
          <span className="relative grid h-[58px] w-[58px] shrink-0 place-items-center overflow-hidden rounded-full bg-[#43c3e5]">
            <Image
              src="/assets/professor-5brain.png"
              alt="Professor 5-Brain"
              width={58}
              height={58}
              className="h-full w-full object-cover"
            />
          </span>
          <div>
            <h2 className="font-display text-[1.35rem] font-bold leading-tight text-black">
              Professor 5-Brain&trade;
            </h2>
            <p className="mt-0.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#0a7290]">
              Your AI Coach
            </p>
          </div>
        </div>

        <div className="mt-7">
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-black">
            Observation
          </p>
          <p className="mt-3 text-[15px] font-medium leading-7 text-black">
            I noticed your memory score is quite strong, while processing speed and
            focus could use some extra attention.
          </p>
        </div>

        <div className="mt-7">
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-black">
            Training Insight
          </p>
          <p className="mt-3 text-[15px] font-medium leading-7 text-black">
            This pattern suggests that enhancing your processing speed and focus could
            create a more balanced training experience.
          </p>
        </div>
      </article>

      <article className="mx-auto mt-8 rounded-[1rem] border border-black/10 bg-white px-5 py-5 text-left sm:w-[460px]">
        <p className="text-[13px] font-medium leading-6 text-[#555]">
          Your Cognitive Fitness Score is a personal wellness benchmark, not an IQ test,
          not a measure of intelligence, medical assessment, or diagnosis. It has not
          been validated against clinical population norms.
        </p>
        <p className="mt-4 text-[13px] font-medium leading-6 text-[#555]">
          *These statements have not been evaluated by the Food and Drug Administration.
          This product is not intended to diagnose, treat, cure, or prevent any disease.
        </p>
      </article>

      <p className="mx-auto mt-4 max-w-[460px] text-left text-[13px] font-medium leading-6 text-[#747474]">
        Results may vary and are intended for educational and personal tracking purposes
        only.
      </p>
    </>
  );
}

function DomainScoreRow({
  label,
  value,
  color,
  isGrowthArea = false,
}: {
  label: string;
  value: number;
  color: string;
  isGrowthArea?: boolean;
}) {
  return (
    <div
      className={`relative rounded-[0.9rem] px-4 py-4 ${
        isGrowthArea
          ? "border-2 border-[#ff6b2c] bg-[#fff8f4]"
          : "border border-black/10 bg-white"
      }`}
    >
      {isGrowthArea && (
        <span className="absolute right-4 top-[-13px] rounded-full bg-[#ff6b2c] px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-black">
          Growth Area
        </span>
      )}
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-[15px] font-bold text-black">{label}</h3>
        <span className="text-[15px] font-black" style={{ color }}>
          {value}
        </span>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-black/5">
        <span
          className="block h-full rounded-full"
          style={{ backgroundColor: color, width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function RecommendedTrainingCard() {
  return (
    <article className="mx-auto mt-8 rounded-[1.1rem] border border-black/10 bg-white px-5 py-5 text-left sm:w-[460px]">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#747474]">
        Recommended for your growth area
      </p>
      <Link href="/training/hyper-cube-n-back" className="mt-5 flex items-center gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[0.75rem] bg-[#2f91df] text-white">
          <AppIcon name="chart" className="h-6 w-6" />
        </span>
        <div>
          <h3 className="font-display text-[1rem] font-bold text-black">
            Hyper-Cube N-Back
          </h3>
          <p className="text-[13px] font-medium text-[#747474]">
            Speed &middot; 3 min &middot; trains working memory in-app
          </p>
        </div>
      </Link>
      <Link
        href="/training/hyper-cube-n-back"
        className="mt-6 flex h-[54px] items-center justify-center rounded-[0.9rem] border-[3px] border-black bg-[#ff6b2c] text-center text-[1rem] font-black uppercase text-black shadow-[0_6px_0_#000]"
      >
        Train SpeedNow <span className="ml-2">-&gt;</span>
      </Link>
    </article>
  );
}

function SaveRoutineCard() {
  return (
    <article className="mx-auto mt-8 rounded-[1.1rem] bg-[#131516] px-5 py-6 text-center sm:w-[460px]">
      <Link
        href="/auth/login"
        className="flex h-[58px] items-center justify-center rounded-[0.9rem] border-[3px] border-black bg-[#ff6b2c] text-[0.95rem] font-black uppercase text-black shadow-[0_6px_0_#000]"
      >
        Save my score and build my routine
      </Link>
      <p className="mx-auto mt-5 max-w-[360px] text-[12px] font-medium leading-5 text-white/65">
        Retake available in 24 hours. Scores reflect in-app performance and vary with
        sleep, time of day, and environment.
      </p>
    </article>
  );
}

function EnterLabPreviewCard() {
  return (
    <article className="mx-auto mt-5 rounded-[1.1rem] bg-black px-6 py-7 text-center text-white shadow-[8px_8px_0_#000] sm:w-[460px]">
      <span className="inline-flex items-center gap-2 rounded-full border-[3px] border-white/25 bg-[#1d1d1d] px-4 py-1.5 text-[11px] font-black uppercase text-white shadow-[0_4px_0_rgba(255,255,255,0.18)]">
        <AppIcon name="speed" className="h-3.5 w-3.5 text-[#43c3e5]" />
        Next Step
      </span>
      <h2 className="mt-5 font-display text-[1.55rem] font-bold leading-tight">
        Enter the Lab
      </h2>
      <p className="mx-auto mt-4 max-w-[330px] text-[14px] font-medium leading-6 text-white/65">
        Daily 3-minute quests targeting your weakest domain. AI-guided training with
        progress you can see.
      </p>
      <p className="mt-7 flex flex-wrap items-center justify-center gap-3 text-[13px] font-medium text-white/85">
        <span className="inline-flex items-center gap-1">
          <AppIcon name="chart" className="h-3.5 w-3.5 text-[#43c3e5]" />
          Full score history
        </span>
        <span className="text-white/30">&middot;</span>
        <span className="inline-flex items-center gap-1">
          <AppIcon name="spark" className="h-3.5 w-3.5 text-[#43c3e5]" />
          Elite 25 training experiences
        </span>
      </p>
      <Link
        href="/profile?tab=billing"
        className="mt-6 flex h-[56px] items-center justify-center rounded-[0.9rem] bg-[#ff6b2c] text-[0.95rem] font-black uppercase text-black"
      >
        Start 7-day free trial <span className="ml-2">-&gt;</span>
      </Link>
    </article>
  );
}

function ProductMatchCard() {
  return (
    <article className="mx-auto mt-8 overflow-hidden rounded-[1.1rem] border-[3px] border-black bg-white text-left shadow-[8px_8px_0_#000] sm:w-[460px]">
      <div className="relative h-[54px] bg-[#23c8ee]">
        <span className="absolute right-5 top-3 rounded-full border-[3px] border-black bg-white px-5 py-1.5 text-[11px] font-black uppercase text-black">
          Nutropx
        </span>
      </div>

      <div className="px-5 py-6">
        <p className="text-[13px] font-medium leading-6 text-black">
          Your Cognitive Fitness Score highlights Speed as your current focus area.
          Popular among users focused on speed support as part of their routine.*
        </p>

        <div className="mt-5 grid grid-cols-[126px_1fr] gap-4">
          <a
            href={XYNAPTIC_DROPS_URL}
            target="_blank"
            rel="noreferrer"
            className="grid h-[116px] w-[112px] place-items-center rounded-[0.9rem] border-[3px] border-black bg-white shadow-[0_5px_0_#000]"
          >
            <Image
              src="/assets/product-xynaptic-drops.png"
              alt="Xynaptic Drops"
              width={70}
              height={100}
              className="h-[96px] w-auto object-contain"
            />
          </a>
          <div className="min-w-0">
            <span className="inline-flex rounded-[0.35rem] bg-[#23c8ee] px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-black">
              Fast-acting
            </span>
            <a
              href={XYNAPTIC_DROPS_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block font-display text-[1.05rem] font-bold text-black"
            >
              Xynaptic Drops&trade;
            </a>
            <p className="mt-2 text-[13px] font-medium leading-5 text-black">
              Daily support for focus, memory & mental energy.*
            </p>
            <p className="mt-4 text-[1.2rem] font-black text-black">$59.99</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-black">
          <span>Fast-acting liquid</span>
          <span>Zero crash</span>
          <span>Sugar-free</span>
        </div>

        <a
          href={XYNAPTIC_DROPS_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-6 flex h-[52px] items-center justify-center rounded-[0.9rem] bg-[#23c8ee] text-[15px] font-black text-black"
        >
          Shop Xynaptic Drops <span className="ml-2">-&gt;</span>
        </a>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] font-medium text-black">
          <span className="inline-flex items-center gap-1.5">
            <AppIcon name="truck" className="h-4 w-4" />
            Free shipping over $100
          </span>
          <span className="inline-flex items-center gap-1.5">
            <AppIcon name="shield" className="h-4 w-4" />
            30-day money-back guarantee
          </span>
        </div>

        <div className="mt-5 border-t border-black/10 pt-5 text-[12px] font-medium leading-6 text-[#747474]">
          *These statements have not been evaluated by the FDA. This product is not intended
          to diagnose, treat, cure, or prevent any disease. Consult a healthcare professional
          before use if pregnant, nursing, under 18, taking medications, or have a diagnosed
          condition.
        </div>
      </div>
    </article>
  );
}

function DailySupportStack() {
  const stack = [
    ["Pre-training", "Xynaptic Drops", "Fast-acting liquid nootropic*", "/assets/product-xynaptic-drops.png"],
    ["With breakfast", "5-Brain", "Advanced nootropic formula*", "/assets/product-5brain.png"],
    ["Evening", "Xtra-Brain", "Advanced gut-brain probiotic*", "/assets/product-xtra-brain.png"],
  ];

  return (
    <article className="mx-auto mt-8 overflow-hidden rounded-[1.1rem] border-[3px] border-black bg-white text-left shadow-[8px_8px_0_#000] sm:w-[460px]">
      <div className="flex h-[58px] items-center justify-between bg-black px-5 text-white">
        <p className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em]">
          <AppIcon name="spark" className="h-4 w-4 text-[#23c8ee]" />
          Your daily support stack
        </p>
        <span className="rounded-full bg-[#43c3e5] px-4 py-2 text-[11px] font-black text-black">
          SAVE 20%
        </span>
      </div>

      <div className="space-y-6 px-5 py-6">
        {stack.map(([time, title, copy, image]) => {
          const productHref = getSupplementUrl(title);
          const rowClassName = "grid grid-cols-[62px_1fr_24px] items-center gap-3";
          const row = (
            <>
              <span className="grid h-[54px] w-[54px] place-items-center rounded-[0.8rem] border-[3px] border-black bg-white shadow-[0_4px_0_#000]">
                <Image
                  src={image}
                  alt={title}
                  width={42}
                  height={42}
                  className="h-[42px] w-auto object-contain"
                />
              </span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#c95f1e]">
                  {time}
                </p>
                <h3 className="mt-1 font-display text-[1rem] font-bold text-black">
                  {title}
                </h3>
                <p className="mt-1 text-[12px] font-medium text-black">{copy}</p>
              </div>
              <AppIcon name="check" className="h-4 w-4 text-[#c95f1e]" />
            </>
          );

          return productHref ? (
            <a
              key={title}
              href={productHref}
              target="_blank"
              rel="noreferrer"
              className={rowClassName}
            >
              {row}
            </a>
          ) : (
            <div key={title} className={rowClassName}>
              {row}
            </div>
          );
        })}

        <a
          href={BRAIN_STACK_URL}
          target="_blank"
          rel="noreferrer"
          className="flex h-[52px] items-center justify-center rounded-[0.9rem] bg-black text-[14px] font-black uppercase text-white"
        >
          Build my stack <span className="ml-2">-&gt;</span>
        </a>
      </div>
    </article>
  );
}

function EnterLabTrialCard({
  accepted,
  onAcceptedChange,
  onPlanChange,
  plan,
}: {
  accepted: boolean;
  onAcceptedChange: (value: boolean) => void;
  onPlanChange: (value: "annual" | "monthly") => void;
  plan: "annual" | "monthly";
}) {
  const price = plan === "annual" ? "$99.99/year" : "$11.99/month";

  return (
    <article className="mx-auto mt-8 rounded-[1.1rem] bg-black px-6 py-8 text-center text-white shadow-[8px_8px_0_#000] sm:w-[460px]">
      <span className="inline-flex items-center gap-2 rounded-full border-[3px] border-white/25 bg-[#1d1d1d] px-4 py-1.5 text-[11px] font-black uppercase text-white shadow-[0_4px_0_rgba(255,255,255,0.18)]">
        <AppIcon name="speed" className="h-3.5 w-3.5 text-[#43c3e5]" />
        Next Step
      </span>
      <h2 className="mt-5 font-display text-[1.65rem] font-bold leading-tight">Enter the Lab</h2>
      <p className="mx-auto mt-4 max-w-[330px] text-[14px] font-medium leading-6 text-white/65">
        Daily 3-minute quests targeting your weakest domain. AI-guided training with
        progress you can see.
      </p>
      <p className="mt-7 flex flex-wrap items-center justify-center gap-3 text-[13px] font-medium text-white/85">
        <span className="inline-flex items-center gap-1">
          <AppIcon name="chart" className="h-3.5 w-3.5 text-[#43c3e5]" />
          Full score history
        </span>
        <span className="text-white/30">&middot;</span>
        <span className="inline-flex items-center gap-1">
          <AppIcon name="spark" className="h-3.5 w-3.5 text-[#43c3e5]" />
          Elite 25 training experiences
        </span>
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 text-left">
        {(["annual", "monthly"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onPlanChange(option)}
            className={`rounded-[0.8rem] border px-3 py-3 ${
              plan === option ? "border-[#43c3e5]" : "border-white/20"
            }`}
          >
            <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-[#43c3e5]">
              {option}
            </span>
            <span className="mt-1 block text-[15px] font-black text-white">
              {option === "annual" ? "$99.99/yr" : "$11.99/mo"}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-5 rounded-[0.75rem] border border-white/20 bg-white/10 px-4 py-4 text-left text-[12px] font-medium leading-5 text-white/65">
        7-day free trial, then <strong className="text-white">{price}</strong>. Cancel
        anytime before day 7 and you will not be charged. Billed to your payment method
        on file after the trial.
      </p>

      <label className="mt-5 flex items-start gap-3 text-left text-[13px] font-medium leading-6 text-white/80">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => onAcceptedChange(event.target.checked)}
          className="mt-1 h-5 w-5 rounded border-white/40 accent-[#43c3e5]"
        />
        <span>
          I understand I will be charged <strong className="text-white">{price}</strong> after
          my 7-day free trial unless I cancel.
        </span>
      </label>

      {accepted ? (
        <Link
          href="/profile?tab=billing"
          className="mt-6 flex h-[58px] items-center justify-center rounded-[0.9rem] bg-[#ff6b2c] text-[0.95rem] font-black uppercase text-black"
        >
          Start 7-day free trial <span className="ml-2">-&gt;</span>
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="mt-6 flex h-[58px] w-full items-center justify-center rounded-[0.9rem] bg-[#9f441d] text-[0.95rem] font-black uppercase text-black opacity-90"
        >
          Start 7-day free trial <span className="ml-2">-&gt;</span>
        </button>
      )}

      {!accepted && (
        <p className="mt-4 text-[11px] font-medium text-white/35">
          Check the box above to continue
        </p>
      )}
    </article>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - score / 100);

  return (
    <div className="relative mx-auto mt-6 grid h-[172px] w-[172px] place-items-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160" aria-hidden="true">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#3d3d3d"
          strokeWidth="14"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#ff6b2c"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeWidth="14"
        />
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-[3.2rem] font-bold leading-none text-white">{score}</p>
        <p className="mt-2 text-[13px] font-black text-[#23c8ee]">Keep Training</p>
      </div>
    </div>
  );
}

function CheckInRow({
  title,
  meta,
  icon,
}: {
  title: string;
  meta: string;
  icon: IconName;
}) {
  return (
    <article className="flex h-[67px] items-center gap-4 rounded-[1rem] border-2 border-[#23c8ee] bg-white px-4 shadow-[6px_6px_0_#000] sm:w-[450px]">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[0.75rem] bg-[#23c8ee] text-white">
        <AppIcon name={icon} className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-sm font-black text-black">{title}</h2>
        <p className="mt-0.5 text-xs font-medium text-black">{meta}</p>
      </div>
      <AppIcon name="chevron" className="h-5 w-5 shrink-0 text-black" />
    </article>
  );
}

function PoweredCard() {
  return (
    <section className="mx-auto mt-12 rounded-[1.1rem] border-[3px] border-black bg-white px-6 py-5 text-black shadow-[0_8px_0_#000] sm:h-[103px] sm:w-[450px]">
      <p className="flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.16em] text-[#0a7290]">
        <AppIcon name="spark" className="h-5 w-5 text-[#0a7290]" />
        Powered by Nutropx
      </p>
      <p className="mt-1.5 max-w-[412px] text-[12px] font-medium leading-4 sm:h-[32px] sm:w-[412px]">
        Your Cognitive Fitness Score highlights your current training focus area. Nutropx
        supplements pair well with your training routine.*
      </p>
    </section>
  );
}

function Disclaimer() {
  return (
    <p className="mx-auto mt-10 max-w-[470px] text-center text-[11px] font-medium leading-[17.5px] text-[#747474] sm:h-[35px] sm:w-[470px]">
      *These statements have not been evaluated by the Food and Drug Administration.
      This product is not intended to diagnose, treat, cure, or prevent any disease.
    </p>
  );
}

function getProgress(stage: Stage, reactionRound: number, memoryRound: number) {
  if (stage === "landing") return 0;
  if (stage === "reaction-intro") return 5;
  if (stage === "reaction-wait" || stage === "reaction-target" || stage === "reaction-result") {
    return clamp(35 + (reactionRound - 1) * 3, 35, 50);
  }
  if (stage === "memory-intro") return 50;
  if (stage === "memory-show") return clamp(62 + memoryRound * 4, 66, 74);
  if (stage === "memory-input") return 75;
  if (stage === "memory-feedback") return clamp(78 + memoryRound * 5, 83, 92);
  if (stage === "analyzing") return 95;
  return 100;
}

function makeDigits(length: number) {
  return Array.from({ length }, () => String(Math.floor(Math.random() * 10)));
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function reactionLabel(ms: number) {
  if (ms <= 350) return "Good";
  return "Slow";
}

function AppIcon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2.2,
    viewBox: "0 0 24 24",
  };

  if (name === "back") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
    );
  }

  if (name === "book") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5Z" />
        <path d="M4 5.5A2.5 2.5 0 0 0 1.5 3H4" />
        <path d="M4 5.5v16" />
      </svg>
    );
  }

  if (name === "brain") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M12 5a3 3 0 1 0-5.98.38 4 4 0 0 0-2.44 5.75 4 4 0 0 0 .52 6.4A4 4 0 1 0 12 18Z" />
        <path d="M12 5a3 3 0 1 1 5.98.38 4 4 0 0 1 2.44 5.75 4 4 0 0 1-.52 6.4A4 4 0 1 1 12 18Z" />
        <path d="M12 5v13" />
      </svg>
    );
  }

  if (name === "chart") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M4 18 18 4" />
        <path d="M18 4v8" />
        <path d="M18 4h-8" />
      </svg>
    );
  }

  if (name === "chevron") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="m9 18 6-6-6-6" />
      </svg>
    );
  }

  if (name === "check") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="m20 6-11 11-5-5" />
      </svg>
    );
  }

  if (name === "lock") {
    return (
      <svg aria-hidden="true" {...common}>
        <rect height="11" rx="2" width="16" x="4" y="10" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    );
  }

  if (name === "spark") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M13 2 9.8 9.8 2 13l7.8 3.2L13 24l3.2-7.8L24 13l-7.8-3.2L13 2Z" />
        <path d="m5 3 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-5" />
      </svg>
    );
  }

  if (name === "target") {
    return (
      <svg aria-hidden="true" {...common}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    );
  }

  if (name === "truck") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M14 18V6H3v12h11Z" />
        <path d="M14 10h4l3 3v5h-7" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </svg>
    );
  }

  if (name === "trophy") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M8 21h8" />
        <path d="M12 17v4" />
        <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
        <path d="M7 7H4a3 3 0 0 0 3 3" />
        <path d="M17 7h3a3 3 0 0 1-3 3" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" {...common}>
      <path d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z" />
    </svg>
  );
}
