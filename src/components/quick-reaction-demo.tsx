"use client";

import { useEffect, useRef, useState } from "react";

type DemoState = "idle" | "waiting" | "target" | "result";

function randomDelay(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

export function QuickReactionDemo() {
  const [state, setState] = useState<DemoState>("idle");
  const [result, setResult] = useState<number | null>(null);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);
  const targetStartedAt = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function startWaiting() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setState("waiting");
    const delay = hasStartedOnce ? randomDelay(2000, 3000) : randomDelay(3000, 4000);
    setHasStartedOnce(true);

    timeoutRef.current = setTimeout(() => {
      targetStartedAt.current = performance.now();
      setState("target");
    }, delay);
  }

  function handleClick() {
    if (state === "idle" || state === "result") {
      startWaiting();
      return;
    }

    if (state === "target") {
      const measuredMs = Math.max(120, Math.round(performance.now() - targetStartedAt.current));
      setResult(measuredMs);
      setState("result");
    }
  }

  const isOrange = state === "target" || state === "result";
  const label =
    state === "idle"
      ? "Tap to start"
      : state === "waiting"
        ? "Wait for the cyan target..."
        : state === "target"
          ? "Tap Now!"
          : `${result ?? 0}ms`;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex h-[118px] w-full flex-col items-center justify-center rounded-[1.1rem] px-4 text-center text-2xl font-black leading-none transition ${
        isOrange
          ? "bg-[#e96f24] text-black hover:brightness-100"
          : "bg-black text-white hover:brightness-110"
      }`}
    >
      <span>{label}</span>
      {state === "result" ? (
        <span className="mt-3 block text-xs font-medium leading-none text-black">
          Keep training - Tap again
        </span>
      ) : null}
    </button>
  );
}
