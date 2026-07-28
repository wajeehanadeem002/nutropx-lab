"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type BillingPlan = "annual" | "monthly";
type BillingIconName = "crown" | "spark" | "bolt" | "check";

export function LabProBillingCard({ activePlan }: { activePlan: BillingPlan }) {
  const [acknowledged, setAcknowledged] = useState(false);
  const router = useRouter();
  const monthly = activePlan === "monthly";
  const renewalAmount = monthly ? "$11.99/month" : "$99.99/year";
  const billedLine = monthly
    ? "Billed monthly to your payment method on file"
    : "Billed annually to your payment method on file";
  const conversionLine = monthly
    ? "After 7 days, automatically converts to $11.99/month"
    : "After 7 days, automatically converts to $99.99/year";

  function openCheckout() {
    if (!acknowledged) return;
    router.push(`/checkout?plan=${activePlan}`);
  }

  return (
    <section className="mx-auto mt-8 max-w-[672px] rounded-[1.2rem] bg-black px-8 py-8 text-white shadow-[9px_9px_0_#000]">
      <div className="flex items-start justify-between gap-5">
        <div className="flex items-center gap-4">
          <span className="grid h-[48px] w-[48px] shrink-0 place-items-center rounded-[0.9rem] bg-cyan text-black">
            <BillingIcon name="crown" className="h-6 w-6" />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan">
              Lab Pro
            </p>
            <h2 className="mt-1 text-xl font-semibold leading-none text-white">
              Full access membership
            </h2>
            <p className="mt-2 text-sm font-medium text-white/55">Train with the whole Lab.</p>
          </div>
        </div>
        <span className="hidden h-[36px] shrink-0 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 text-xs font-semibold uppercase text-white sm:inline-flex">
          <BillingIcon name="spark" className="h-4 w-4 text-cyan" />
          7-day free trial
        </span>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <BillingPlanCard
          active={activePlan === "annual"}
          href="/profile?tab=billing&plan=annual"
          label="Annual"
          price="$99.99"
          unit="/year"
          caption="Yearly $8.33/month, billed annually"
          badge="Best value - Save 31%"
        />
        <BillingPlanCard
          active={monthly}
          href="/profile?tab=billing&plan=monthly"
          label="Monthly"
          price="$11.99"
          unit="/month"
          caption="Flexible month-to-month billing"
        />
      </div>

      <p className="mt-7 text-sm font-medium text-white/68">
        Less than a coffee. Trains your brain every day.
      </p>

      <div className="mt-7 rounded-[1rem] border border-white/20 bg-white/10 px-5 py-5">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan">
          Subscription Terms
        </h3>
        <ul className="mt-4 grid gap-2 text-xs font-medium leading-5 text-white/72">
          {[
            "7-day free trial. No charge during the trial period",
            conversionLine,
            billedLine,
            "Cancel anytime from Account settings. One click, no phone call required",
            "Canceling during the trial means no charge",
          ].map((term) => (
            <li key={term} className="flex gap-2">
              <span aria-hidden="true">&bull;</span>
              <span>{term}</span>
            </li>
          ))}
        </ul>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 text-xs font-medium leading-5 text-white/70">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(event) => setAcknowledged(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/50 bg-white accent-cyan"
        />
        <span>
          I understand I will be charged <strong>{renewalAmount}</strong> after my 7-day free trial
          unless I cancel.
        </span>
      </label>

      <button
        type="button"
        disabled={!acknowledged}
        onClick={openCheckout}
        className={`mt-5 flex h-[56px] w-full items-center justify-center gap-3 rounded-[0.9rem] text-sm font-semibold uppercase text-black ${
          acknowledged ? "bg-orange-500" : "cursor-not-allowed bg-orange-500/65"
        }`}
      >
        <BillingIcon name="bolt" className="h-5 w-5" />
        Start 7-day free trial
        <span aria-hidden="true">-&gt;</span>
      </button>
      {!acknowledged ? (
        <p className="mt-4 text-center text-[11px] font-semibold text-white/38">
          Check the box above to continue
        </p>
      ) : null}
      <p className="mt-4 text-center text-xs font-medium text-white/42">
        Card required - cancel anytime in 1 click - secure checkout via Stripe
      </p>
      <p className="mt-4 text-center text-[11px] font-medium leading-5 text-white/48">
        By creating an account you confirm you are 18 or older and agree to the{" "}
        <a href="https://nutropx.com/terms-and-agreements" target="_blank" rel="noreferrer" className="underline">
          Terms
        </a>{" "}
        and{" "}
        <a href="https://nutropx.com/privacy-policy" target="_blank" rel="noreferrer" className="underline">
          Privacy Policy
        </a>
        .
      </p>

      <div className="mt-7 grid gap-4 text-center sm:grid-cols-3">
        {[
          ["spark", "7-day free trial", "cancel before day 7, no charge"],
          ["check", "Cancel anytime", "in 1 click"],
          ["check", "Secure checkout", "via Stripe"],
        ].map(([icon, title, caption]) => (
          <div key={title} className="grid justify-items-center gap-1.5 text-white/48">
            <BillingIcon name={icon as BillingIconName} className="h-4 w-4 text-cyan" />
            <p className="text-xs font-semibold">{title}</p>
            <p className="text-[11px] font-medium leading-4">{caption}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BillingPlanCard({
  active = false,
  href,
  label,
  price,
  unit,
  caption,
  badge,
}: {
  active?: boolean;
  href: string;
  label: string;
  price: string;
  unit: string;
  caption: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className={`relative min-h-[116px] rounded-[1rem] border-[2px] bg-white/8 px-5 py-5 ${
        active ? "border-cyan" : "border-white/18"
      }`}
      aria-current={active ? "true" : undefined}
    >
      {badge ? (
        <span className="absolute right-4 top-4 rounded-full bg-cyan px-3 py-1 text-[10px] font-semibold uppercase text-black">
          {badge}
        </span>
      ) : null}
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan">{label}</p>
      <p className="mt-4 font-display text-[2rem] font-semibold leading-none text-white">
        {price} <span className="text-base text-white/55">{unit}</span>
      </p>
      <p className="mt-2 text-xs font-medium text-white/55">{caption}</p>
    </Link>
  );
}

function BillingIcon({
  name,
  className = "h-5 w-5",
}: {
  name: BillingIconName;
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

  if (name === "crown") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="m4 8 4 4 4-7 4 7 4-4-2 10H6L4 8Z" />
        <path d="M6 21h12" />
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

  if (name === "bolt") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="m13 2-8 12h6l-1 8 9-13h-6l1-7Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.2 2.2 4.8-5" />
    </svg>
  );
}
