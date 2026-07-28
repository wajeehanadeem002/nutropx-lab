"use client";

import { useState, useTransition } from "react";
import {
  updateEmailDigestAction,
  updatePushNotificationsAction,
  updateReminderTimeAction,
} from "./actions";

type DigestFrequency = "daily" | "weekly" | "streak";
type AlertStatus = "success" | "error";

const frequencyOptions: Array<[DigestFrequency, string]> = [
  ["daily", "Daily summary"],
  ["weekly", "Weekly summary"],
  ["streak", "Streak alerts only"],
];

export function AlertsPanel({
  email,
  initialDigestEnabled,
  initialDigestFrequency,
  initialPushEnabled,
  initialReminderTime,
}: {
  email: string;
  initialDigestEnabled: boolean;
  initialDigestFrequency: DigestFrequency;
  initialPushEnabled: boolean;
  initialReminderTime: string;
}) {
  const [isPushPending, startPushTransition] = useTransition();
  const [isReminderPending, startReminderTransition] = useTransition();
  const [isEmailPending, startEmailTransition] = useTransition();
  const [pushEnabled, setPushEnabled] = useState(initialPushEnabled);
  const [reminderTime, setReminderTime] = useState(initialReminderTime);
  const [digestEnabled, setDigestEnabled] = useState(initialDigestEnabled);
  const [frequency, setFrequency] = useState<DigestFrequency>(initialDigestFrequency);
  const [status, setStatus] = useState("");
  const [statusKind, setStatusKind] = useState<AlertStatus>("success");

  async function enablePushNotifications() {
    let enabled = true;

    if (typeof window !== "undefined" && "Notification" in window) {
      const permission = await Notification.requestPermission();
      enabled = permission === "granted";
    }

    setPushEnabled(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem("nutropx_push_enabled", enabled ? "true" : "false");
    }

    setStatus("Saving push notification setting...");
    setStatusKind("success");
    startPushTransition(async () => {
      const result = await updatePushNotificationsAction({ pushEnabled: enabled });
      setStatus(
        result.ok
          ? enabled
            ? "Push notifications enabled."
            : "Push permission was not granted."
          : result.message,
      );
      setStatusKind(result.ok ? "success" : "error");
    });
  }

  function saveReminder() {
    if (typeof window !== "undefined") {
      localStorage.setItem("nutropx_reminder_time", reminderTime);
    }

    setStatus("Saving reminder time...");
    setStatusKind("success");
    startReminderTransition(async () => {
      const result = await updateReminderTimeAction({ reminderTime });
      setStatus(result.ok ? "Reminder time saved." : result.message);
      setStatusKind(result.ok ? "success" : "error");
    });
  }

  function saveEmailPreferences() {
    if (typeof window !== "undefined") {
      localStorage.setItem("nutropx_digest_enabled", digestEnabled ? "true" : "false");
      localStorage.setItem("nutropx_digest_frequency", frequency);
    }

    setStatus("Saving email preferences...");
    setStatusKind("success");
    startEmailTransition(async () => {
      const result = await updateEmailDigestAction({
        digestEnabled,
        digestFrequency: frequency,
      });
      setStatus(result.ok ? "Email preferences saved." : result.message);
      setStatusKind(result.ok ? "success" : "error");
    });
  }

  return (
    <>
      {status ? (
        <p
          className={`mx-auto mt-8 max-w-[672px] rounded-[0.8rem] border px-4 py-3 text-xs font-semibold ${
            statusKind === "success"
              ? "border-cyan/35 bg-cyan/10 text-[#0a7290]"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {status}
        </p>
      ) : null}

      <section className="mx-auto mt-8 max-w-[672px] rounded-[1.2rem] border-[2px] border-black bg-white px-6 py-6 shadow-[0_7px_0_#000]">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black">
          Push Notifications
        </h2>

        <button
          type="button"
          onClick={enablePushNotifications}
          disabled={isPushPending}
          className="mt-5 inline-flex h-[42px] items-center justify-center gap-2 rounded-[0.8rem] bg-black px-5 text-xs font-semibold text-white"
        >
          <BellIcon className="h-4 w-4" />
          {isPushPending
            ? "Saving..."
            : pushEnabled
              ? "Push notifications enabled"
              : "Enable push notifications"}
        </button>

        <label className="mt-6 block text-sm font-semibold text-black" htmlFor="reminder-time">
          Reminder time
        </label>
        <div className="mt-3 flex h-[48px] w-[138px] items-center gap-2 rounded-[0.75rem] border-[2px] border-black bg-white px-3 shadow-[0_4px_0_#000]">
          <input
            id="reminder-time"
            type="text"
            value={reminderTime}
            maxLength={8}
            onChange={(event) => setReminderTime(event.target.value)}
            className="h-full w-full bg-transparent text-sm font-medium text-black outline-none"
          />
          <ClockIcon className="h-4 w-4 shrink-0 text-black/65" />
        </div>
        <p className="mt-3 text-xs font-medium text-black/72">
          Daily training reminder will be sent at this time.
        </p>

        <p className="mt-5 rounded-[0.8rem] border border-cyan/45 bg-cyan/10 px-4 py-3 text-xs font-medium leading-5 text-[#1f2937]">
          <strong className="font-semibold">Notifications include:</strong> daily reminders,
          streak milestones, and re-engagement after 3 days of inactivity.
        </p>

        <button
          type="button"
          onClick={saveReminder}
          disabled={isReminderPending}
          className="mt-5 h-[42px] rounded-[0.8rem] bg-black px-5 text-xs font-semibold text-white"
        >
          {isReminderPending ? "Saving..." : "Save reminder time"}
        </button>
      </section>

      <section className="mx-auto mt-8 max-w-[672px] rounded-[1.2rem] border-[2px] border-black bg-white px-6 py-6 shadow-[0_7px_0_#000]">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black">
          Email Digests
        </h2>

        <div className="mt-6 flex items-center justify-between gap-6">
          <div>
            <h3 className="text-sm font-semibold text-black">Email digests</h3>
            <p className="mt-1 text-xs font-medium text-black/72">
              Cognitive Fitness Score summaries sent to your inbox
            </p>
          </div>
          <button
            type="button"
            aria-pressed={digestEnabled}
            onClick={() => setDigestEnabled((value) => !value)}
            className={`flex h-[24px] w-[42px] items-center rounded-full p-1 transition ${
              digestEnabled ? "justify-end bg-black" : "justify-start bg-[#e5e8ee]"
            }`}
          >
            <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        {digestEnabled ? (
          <>
            <h3 className="mt-7 text-sm font-semibold text-black">Frequency</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {frequencyOptions.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFrequency(value)}
                  className={`h-[38px] rounded-[0.75rem] border-[2px] border-black text-xs font-semibold ${
                    frequency === value ? "bg-black text-white" : "bg-white text-black"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        ) : null}

        <p className="mt-4 rounded-[0.75rem] border border-black/10 bg-[#f8fafb] px-4 py-3 text-xs font-medium text-muted">
          Sent to <span className="font-semibold text-black">{email}</span>
          {!digestEnabled ? <span> - Currently off</span> : null}
        </p>

        <button
          type="button"
          onClick={saveEmailPreferences}
          disabled={isEmailPending}
          className="mt-5 h-[42px] rounded-[0.8rem] bg-black px-5 text-xs font-semibold text-white"
        >
          {isEmailPending ? "Saving..." : "Save email preferences"}
        </button>
      </section>
    </>
  );
}

function BellIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function ClockIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
