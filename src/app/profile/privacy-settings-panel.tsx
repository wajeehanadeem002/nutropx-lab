"use client";

import { useState } from "react";
import { updatePrivacyAction } from "./actions";

type LeaderboardNameMode = "generated" | "real";

export function PrivacySettingsPanel({
  leaderboardPublic,
  leaderboardNameMode,
}: {
  leaderboardPublic: boolean;
  leaderboardNameMode: LeaderboardNameMode;
}) {
  const [isPublic, setIsPublic] = useState(leaderboardPublic);
  const [nameMode, setNameMode] = useState<LeaderboardNameMode>(leaderboardNameMode);

  return (
    <form
      action={updatePrivacyAction}
      className="mx-auto mt-8 max-w-[672px] rounded-[1.2rem] border-[2px] border-black bg-white px-6 py-6 shadow-[0_7px_0_#000]"
    >
      <input type="hidden" name="leaderboardPublic" value={isPublic ? "true" : "false"} />
      <input type="hidden" name="leaderboardNameMode" value={nameMode} />

      <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black">
        Privacy
      </h2>
      <div className="mt-7 flex items-center justify-between gap-5">
        <div>
          <h3 className="text-sm font-semibold text-black">Show me on the public leaderboard</h3>
          <p className="mt-1 text-xs font-medium text-muted">
            Off by default - your XP still counts toward community totals
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsPublic((current) => !current)}
          className={`relative h-7 w-12 shrink-0 rounded-full ${
            isPublic ? "bg-black" : "bg-[#e5e8ed]"
          }`}
          aria-pressed={isPublic}
          aria-label="Show me on the public leaderboard"
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
              isPublic ? "right-1" : "left-1 border-[2px] border-[#9aa3ad]"
            }`}
          />
        </button>
      </div>

      {isPublic ? (
        <div className="mt-7">
          <h3 className="text-sm font-semibold text-black">Display name on leaderboard</h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setNameMode("generated")}
              className={`h-[46px] rounded-[1rem] border-[2px] border-black px-4 text-sm font-semibold ${
                nameMode === "generated" ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              Generated handle (default)
            </button>
            <button
              type="button"
              onClick={() => setNameMode("real")}
              className={`h-[46px] rounded-[1rem] border-[2px] border-black px-4 text-sm font-semibold ${
                nameMode === "real" ? "bg-black text-white" : "bg-white text-black"
              }`}
            >
              Real name
            </button>
          </div>
          <p className="mt-3 text-xs font-medium text-muted">
            {nameMode === "generated"
              ? "e.g. BrainTraveler47, generated automatically"
              : "Your display name will appear on the leaderboard"}
          </p>
        </div>
      ) : null}

      <button
        type="submit"
        className="mt-6 h-[48px] rounded-[0.85rem] bg-black px-6 text-sm font-semibold text-white"
      >
        Save privacy settings
      </button>
    </form>
  );
}
