import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/auth/actions";
import { getCurrentUser } from "@/lib/supabase/auth";
import UserMenu from "@/components/user-menu";
import { LabProBillingCard } from "./billing-card";
import { deleteAccountAction, updateProfileAction } from "./actions";
import { AlertsPanel } from "./alerts-panel";
import { PrivacySettingsPanel } from "./privacy-settings-panel";

type IconName =
  | "home"
  | "lab"
  | "brain"
  | "trophy"
  | "profile"
  | "crown"
  | "bolt"
  | "flame"
  | "spark"
  | "badge"
  | "card"
  | "bell"
  | "logout"
  | "trash"
  | "lock"
  | "star"
  | "check";

type ProfileTab = "account" | "progress" | "billing" | "alerts";
type BillingPlan = "annual" | "monthly";

type ProfilePageProps = {
  searchParams?: Promise<{
    tab?: string | string[];
    plan?: string | string[];
    message?: string | string[];
    error?: string | string[];
  }>;
};

const navItems: Array<[IconName, string, string]> = [
  ["home", "Home", "/dashboard"],
  ["lab", "Lab", "/lab"],
  ["brain", "Brain Test", "/brain-test"],
  ["trophy", "My Brain", "/my-brain"],
  ["profile", "Profile", "/profile"],
];

const profileStats: Array<[IconName, string, string]> = [
  ["bolt", "0", "Total XP"],
  ["flame", "0", "Streak"],
  ["spark", "-", "Score"],
  ["badge", "0", "Badges"],
];

const profileTabs: Array<[IconName, string]> = [
  ["profile", "Account"],
  ["badge", "Progress"],
  ["card", "Billing"],
  ["bell", "Alerts"],
];

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login?message=Please sign in to open your account.");
  }

  const rawName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : user.email?.split("@")[0] ?? "Wajeeha";
  const displayName = toDisplayName(rawName);
  const email = user.email ?? "wajeehanadeem200@gmail.com";
  const params = await searchParams;
  const requestedTab = Array.isArray(params?.tab) ? params.tab[0] : params?.tab;
  const requestedPlan = Array.isArray(params?.plan) ? params.plan[0] : params?.plan;
  const message = Array.isArray(params?.message) ? params.message[0] : params?.message;
  const error = Array.isArray(params?.error) ? params.error[0] : params?.error;
  const activeTab = getProfileTab(requestedTab);
  const activePlan = getBillingPlan(requestedPlan);
  const leaderboardPublic = user.user_metadata?.leaderboard_public === true;
  const leaderboardNameMode =
    user.user_metadata?.leaderboard_name_mode === "real" ? "real" : "generated";
  const pushEnabled = user.user_metadata?.alert_push_enabled === true;
  const reminderTime =
    typeof user.user_metadata?.alert_reminder_time === "string"
      ? user.user_metadata.alert_reminder_time
      : "09:00 AM";
  const digestEnabled = user.user_metadata?.alert_digest_enabled !== false;
  const digestFrequency = getDigestFrequency(user.user_metadata?.alert_digest_frequency);

  return (
    <main
      className="min-h-screen text-black"
      style={{
        background: "linear-gradient(105deg, #ecfbfa 0%, #f8fbfa 50%, #fff7f2 100%)",
      }}
    >
      <DashboardHeader activeLabel="Profile" displayName={displayName} email={email} />

      <div className="mx-auto max-w-[760px] px-6 pb-16 pt-8">
        <section className="mx-auto max-w-[672px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black">
            Player Profile
          </p>
          <h1 className="mt-2 font-display text-[2.55rem] font-semibold leading-none text-black">
            Your Brain Card
          </h1>
        </section>

        <ProfileHeroCard displayName={displayName} email={email} />
        <ProfileTabs activeTab={activeTab} />
        {activeTab === "progress" ? (
          <ProgressPanel />
        ) : activeTab === "billing" ? (
          <BillingPanel activePlan={activePlan} />
        ) : activeTab === "alerts" ? (
          <AlertsPanel
            email={email}
            initialDigestEnabled={digestEnabled}
            initialDigestFrequency={digestFrequency}
            initialPushEnabled={pushEnabled}
            initialReminderTime={reminderTime}
          />
        ) : (
          <>
            <AccountPanel displayName={displayName} email={email} message={message} error={error} />
            <PrivacySettingsPanel
              leaderboardPublic={leaderboardPublic}
              leaderboardNameMode={leaderboardNameMode}
            />
            <SignOutPanel />
            <DangerPanel />
          </>
        )}
      </div>

      <ProfessorButton />
      <DashboardFooter />
    </main>
  );
}

function ProfileHeroCard({
  displayName,
  email,
}: {
  displayName: string;
  email: string;
}) {
  return (
    <section className="mx-auto mt-8 max-w-[672px] rounded-[1.2rem] bg-black px-6 py-6 text-white shadow-[10px_10px_0_#000]">
      <div className="flex items-center gap-5">
        <div className="relative grid h-[78px] w-[78px] shrink-0 place-items-center rounded-[1rem] bg-cyan text-3xl font-semibold text-black shadow-[inset_0_0_0_2px_rgba(255,255,255,0.35)]">
          {displayName.charAt(0).toUpperCase()}
          <span className="absolute -bottom-1 -right-2 rounded-full border-[2px] border-black bg-orange-500 px-2 py-1 text-[10px] font-semibold uppercase text-black">
            LV 1
          </span>
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-2xl font-semibold leading-tight text-white">{displayName}</h2>
          <p className="mt-1 truncate text-sm font-medium text-white/55">{email}</p>
          <span className="mt-3 inline-flex h-8 items-center rounded-full border-[2px] border-white/22 px-4 text-[10px] font-semibold uppercase text-white">
            Free Plan
          </span>
        </div>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-4">
        {profileStats.map(([icon, value, label]) => (
          <div
            key={label}
            className="grid h-[76px] place-items-center rounded-[0.9rem] border border-white/10 bg-white/10 px-3 text-center"
          >
            <AppIcon name={icon} className="h-4 w-4 text-white/78" />
            <p className="text-xl font-semibold leading-none text-white">{value}</p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/45">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.13em] text-white/48">
        <span>Level 1</span>
        <span>0 / 100 XP</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/18">
        <span className="block h-full w-0 bg-cyan" />
      </div>
    </section>
  );
}

function ProfileTabs({ activeTab }: { activeTab: ProfileTab }) {
  return (
    <section className="mx-auto mt-8 flex h-[58px] max-w-[672px] overflow-hidden rounded-[1rem] border-[2px] border-black bg-white p-1.5 shadow-[0_7px_0_#000]">
      {profileTabs.map(([icon, label]) => {
        const tab = label.toLowerCase() as ProfileTab;
        const active = activeTab === tab;
        const href = tab === "account" ? "/profile" : `/profile?tab=${tab}`;
        return (
          <Link
            key={label}
            href={href}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[0.8rem] text-sm font-semibold ${
              active ? "bg-black text-white" : "text-black"
            }`}
          >
            <AppIcon name={icon} className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </section>
  );
}

function AccountPanel({
  displayName,
  email,
  message,
  error,
}: {
  displayName: string;
  email: string;
  message?: string;
  error?: string;
}) {
  return (
    <form
      action={updateProfileAction}
      className="mx-auto mt-8 max-w-[672px] rounded-[1.2rem] border-[2px] border-black bg-white px-6 py-6 shadow-[0_7px_0_#000]"
    >
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black">
        Personal Info
      </h2>
      {message ? (
        <p className="mt-5 rounded-[0.8rem] border border-cyan/35 bg-cyan/10 px-4 py-3 text-xs font-semibold text-cyan">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-5 rounded-[0.8rem] border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
          {error}
        </p>
      ) : null}
      <label className="mt-7 block text-sm font-semibold text-black" htmlFor="display-name">
        Display name
      </label>
      <input
        id="display-name"
        name="displayName"
        defaultValue={displayName}
        maxLength={80}
        required
        className="mt-3 h-[52px] w-full rounded-[0.9rem] border-[2px] border-black px-4 text-sm font-medium text-black shadow-[0_5px_0_#000] outline-none focus:ring-4 focus:ring-cyan/25"
      />

      <label className="mt-7 block text-sm font-semibold text-black" htmlFor="email-address">
        Email address
      </label>
      <input
        id="email-address"
        value={email}
        readOnly
        className="mt-3 h-[52px] w-full rounded-[0.9rem] border-[2px] border-black px-4 text-sm font-medium text-[#1f2937] shadow-[0_5px_0_#000] outline-none"
      />
      <p className="mt-3 text-xs font-medium text-[#1f2937]">Email cannot be changed.</p>

      <button
        type="submit"
        className="mt-6 h-[48px] rounded-[0.85rem] bg-black px-6 text-sm font-semibold text-white"
      >
        Save changes
      </button>
    </form>
  );
}

function SignOutPanel() {
  return (
    <section className="mx-auto mt-8 max-w-[672px] rounded-[1.2rem] border-[2px] border-black bg-white px-6 py-6 shadow-[0_7px_0_#000]">
      <form action={signOutAction}>
        <button type="submit" className="flex items-center gap-5 text-left">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#f4f5f7] text-black">
            <AppIcon name="logout" className="h-5 w-5" />
          </span>
          <span className="text-base font-semibold text-black">Sign out of this device</span>
        </button>
      </form>
    </section>
  );
}

function DangerPanel() {
  return (
    <section className="mx-auto mt-8 max-w-[672px] rounded-[1.2rem] border-[2px] border-red-200 bg-white px-6 py-6">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-red-500">
        Danger Zone
      </h2>
      <p className="mt-3 text-sm font-medium text-muted">
        Permanently delete your account and all data. This cannot be undone.
      </p>
      <form action={deleteAccountAction}>
        <button
          type="submit"
          className="mt-6 flex items-center gap-5 text-sm font-semibold text-red-500"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-red-50">
            <AppIcon name="trash" className="h-5 w-5" />
          </span>
          Delete account
        </button>
      </form>
    </section>
  );
}

function ProgressPanel() {
  return (
    <>
      <LevelPanel />
      <BadgesPanel />
      <StreakPanel />
      <LifetimeStatsPanel />
      <TrainingConsistencyPanel />
      <PersonalBestsPanel />
      <MilestonesPanel />
    </>
  );
}

function BillingPanel({ activePlan }: { activePlan: BillingPlan }) {
  return (
    <>
      <LabProBillingCard activePlan={activePlan} />
      <BillingComparisonTable />
      <p className="mx-auto mt-6 max-w-[672px] text-center text-xs font-medium leading-5 text-muted">
        Backed by a 7-day no-card-needed trial. Cancel anytime.
      </p>
      <p className="mx-auto mt-6 max-w-[640px] text-center text-xs font-medium leading-5 text-muted">
        Lab is designed for general wellness, cognitive fitness, and educational purposes only. It is
        not a medical service and does not provide medical advice, diagnosis, or treatment.
      </p>
    </>
  );
}

const billingRows: Array<[string, boolean, boolean]> = [
  ["Brain Test + Cognitive Fitness Score", true, true],
  ["Abstract Card Match exercise", true, true],
  ["All 25 Elite cognitive exercises*", false, true],
  ["Daily quest, 3 picked exercises", false, true],
  ["Score history and trends", false, true],
  ["Professor 5-Brain training coach", false, true],
  ["Streaks, badges and XP", true, true],
];

function BillingComparisonTable() {
  return (
    <section className="mx-auto mt-8 max-w-[672px] overflow-hidden rounded-[1.2rem] border-[2px] border-black bg-white shadow-[0_7px_0_#000]">
      <div className="grid h-[50px] grid-cols-[1fr_64px_64px] items-center border-b border-black px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-black">
        <span>What you get</span>
        <span className="text-center">Free</span>
        <span className="text-center text-cyan">Pro</span>
      </div>
      <div>
        {billingRows.map(([label, free, pro]) => (
          <div
            key={label}
            className="grid min-h-[54px] grid-cols-[1fr_64px_64px] items-center border-b border-black/10 px-5 last:border-b-0"
          >
            <p className="text-sm font-medium text-black">{label}</p>
            <BillingAccessIcon enabled={free} muted />
            <BillingAccessIcon enabled={pro} />
          </div>
        ))}
      </div>
    </section>
  );
}

function BillingAccessIcon({ enabled, muted = false }: { enabled: boolean; muted?: boolean }) {
  return (
    <span className="grid place-items-center">
      <AppIcon
        name={enabled ? "check" : "lock"}
        className={`h-4 w-4 ${enabled ? (muted ? "text-[#1f2937]" : "text-cyan") : "text-[#1f2937]"}`}
      />
    </span>
  );
}

function LevelPanel() {
  return (
    <section className="mx-auto mt-8 h-[150px] w-full max-w-[673px] rounded-[1rem] bg-cyan px-5 py-5 text-white shadow-[9px_9px_0_#000]">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/78">
            Current Level
          </p>
          <h2 className="mt-1.5 font-display text-[2.25rem] font-semibold leading-none text-white">
            Level 1
          </h2>
        </div>
        <div className="pt-3 text-right">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/78">
            Next
          </p>
          <p className="mt-1.5 text-lg font-semibold text-white">100 XP</p>
        </div>
      </div>
      <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/20">
        <span className="block h-full w-0 bg-white" />
      </div>
      <div className="mt-3 flex justify-between text-[11px] font-semibold text-white/75">
        <span>0 / 100</span>
        <span>0%</span>
      </div>
    </section>
  );
}

const badgeCards: Array<[IconName, string, string]> = [
  ["flame", "3-Day Streak", "Train 3 days in a row"],
  ["trophy", "1-Week Streak", "Train 7 consecutive days"],
  ["crown", "1-Month Streak", "Train 30 days in a row"],
  ["star", "Rising Star", "Earn 500 total XP"],
  ["spark", "Cognitive Champion", "Earn 2,500 total XP"],
];

function BadgesPanel() {
  return (
    <section className="mx-auto mt-8 h-[380px] w-full max-w-[660px] rounded-[1.2rem] border-[2px] border-black bg-white px-5 py-5 shadow-[0_7px_0_#000]">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black">
          Badges
        </h2>
        <span className="inline-flex h-8 items-center gap-1.5 rounded-full border-[2px] border-cyan/35 bg-cyan/10 px-3 text-xs font-semibold text-cyan">
          <AppIcon name="badge" className="h-3.5 w-3.5" />0 / 5
        </span>
      </div>
      <div className="mt-5 grid justify-items-center gap-3 sm:grid-cols-3">
        {badgeCards.map(([icon, title, caption]) => (
          <div
            key={title}
            className="relative grid h-[120px] w-[201px] place-items-center rounded-[1rem] border-[2px] border-dashed border-[#5f5f5f] bg-white px-3 text-center text-[#b8b8b8]"
          >
            <AppIcon name="lock" className="absolute right-2 top-2 h-4 w-4 text-[#777]" />
            <AppIcon name={icon} className="h-11 w-11 text-[#c8c8c8]" />
            <div>
              <p className="text-xs font-semibold text-[#5c5c5c]">{title}</p>
              <p className="mt-1 text-[10px] font-medium text-[#777]">{caption}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-center text-xs font-medium text-black">
        Complete training sessions and hit milestones to unlock badges.
      </p>
    </section>
  );
}

function StreakPanel() {
  return (
    <section
      className="mx-auto mt-8 box-border h-[110px] max-w-[672px] overflow-hidden rounded-[1.2rem] border-[2px] border-black bg-white px-6 py-4 shadow-[0_7px_0_#000]"
      style={{ height: 110 }}
    >
      <div className="flex items-start justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black">
          Streak
        </h2>
        <AppIcon name="flame" className="h-5 w-5 text-orange-500" />
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-[2.1rem] font-semibold leading-none text-black">
            0 <span className="text-base">days</span>
          </p>
          <p className="mt-1 text-xs font-medium text-black">Current streak</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold leading-none text-black">0</p>
          <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-black">
            Best
          </p>
        </div>
      </div>
    </section>
  );
}

function LifetimeStatsPanel() {
  return (
    <section className="mx-auto mt-8 max-w-[672px] rounded-[1.2rem] border-[2px] border-black bg-white px-6 py-6 shadow-[0_7px_0_#000]">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black">
        Lifetime Statistics
      </h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        {[
          ["0", "Exercises Done"],
          ["0", "Minutes Trained"],
          ["-", "Peak Score"],
          ["0", "Days Active"],
        ].map(([value, label]) => (
          <div
            key={label}
            className="grid h-[78px] place-items-center rounded-[1rem] border border-black/10 bg-[#f8fafb] text-center"
          >
            <p className="text-2xl font-semibold leading-none text-black">{value}</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrainingConsistencyPanel() {
  return (
    <section className="mx-auto mt-8 h-[130px] max-w-[672px] rounded-[1.2rem] border-[2px] border-black bg-white px-6 py-5 shadow-[0_7px_0_#000]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black">
            Training Consistency
          </h2>
          <p className="mt-2 text-sm font-medium leading-5 text-muted">
            Based on training frequency and streak logs. Independent from cognitive performance scores.
          </p>
        </div>
        <span className="text-2xl font-semibold leading-none text-black">-</span>
      </div>
      <p className="mt-3 text-xl font-medium text-black">0</p>
    </section>
  );
}

const domains = ["Memory", "Attention", "Speed", "Flexibility", "Logic"];

function PersonalBestsPanel() {
  return (
    <section
      className="mx-auto mt-8 box-border h-[300px] max-w-[672px] rounded-[1.2rem] border-[2px] border-black bg-white px-6 py-5 shadow-[0_7px_0_#000]"
      style={{ height: 300 }}
    >
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black">
        Personal Bests
      </h2>
      <p className="mt-4 text-xs font-medium text-muted">
        Your highest recorded scores across all 5 Training Categories.
      </p>
      <div className="mt-5 grid gap-3">
        {domains.map((domain) => (
          <div key={domain} className="grid grid-cols-[110px_1fr_24px] items-center gap-4">
            <span className="text-sm font-semibold text-black">{domain}</span>
            <span className="h-2 rounded-full bg-[#f1f2f3]" />
            <span className="text-right text-lg font-semibold leading-none text-black">-</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function MilestonesPanel() {
  const milestones = [
    ["First Exercise", "100 XP"],
    ["7-Day Streak", "500 XP"],
    ["30-Day Streak", "1,000 XP"],
    ["Top 25% Trainer", "Rank Unlock"],
    ["Top 10% Trainer", "Rank Unlock"],
  ];

  return (
    <section className="mx-auto mt-8 h-[400px] max-w-[672px] rounded-[1.2rem] border-[2px] border-black bg-white px-6 py-5 shadow-[0_7px_0_#000]">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black">
        Milestones & Achievements
      </h2>
      <div className="mt-5 grid gap-3">
        {milestones.map(([label, value]) => (
          <div
            key={label}
            className="flex h-[55px] items-center justify-between rounded-[1rem] border border-black/10 bg-[#f8fafb] px-4 text-[#a7a9ad]"
          >
            <div className="flex items-center gap-4">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#e9edf2]">
                <AppIcon name="check" className="h-4 w-4" />
              </span>
              <span className="text-xs font-semibold">{label}</span>
            </div>
            <span className="text-xs font-semibold">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function DashboardHeader({
  activeLabel,
  displayName,
  email,
}: {
  activeLabel: string;
  displayName: string;
  email: string;
}) {
  return (
    <header className="relative border-b-[3px] border-orange-500 bg-white">
      <div className="mx-auto flex h-[72px] w-full max-w-[959px] items-center justify-between gap-4 px-4">
        <Link href="/dashboard" className="absolute left-10 top-1/2 shrink-0 -translate-y-1/2">
          <Image
            src="/assets/nutropx-lab-logo.png"
            alt="Nutropx LAB"
            width={255}
            height={70}
            priority
            className="h-10 w-auto lg:h-[42px]"
          />
        </Link>

        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-[34px] text-xs font-semibold text-[#777] lg:flex">
          {navItems.map(([icon, label, href]) => {
            const active = label === activeLabel;
            return (
              <Link
                key={label}
                href={href}
                className={`relative inline-flex h-[72px] items-center gap-2 ${
                  active ? "text-black" : "text-[#777]"
                }`}
              >
                <AppIcon name={icon} className={active ? "h-4 w-4 text-cyan" : "h-4 w-4 text-[#777]"} />
                <span>{label}</span>
                {active ? (
                  <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-orange-500" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="absolute right-[25px] top-1/2 flex shrink-0 -translate-y-1/2 items-center gap-3">
          <Link
            href="/profile?tab=billing"
            className="hidden h-[40px] w-[99px] items-center justify-center gap-1.5 rounded-[0.85rem] border-[3px] border-black bg-orange-500 text-xs font-semibold uppercase text-black shadow-[0_5px_0_#000000] sm:inline-flex"
          >
            <AppIcon name="crown" className="h-4 w-4" />
            Go Pro
          </Link>
          <UserMenu displayName={displayName} email={email} />
        </div>
      </div>
    </header>
  );
}

function ProfessorButton() {
  return (
    <Link
      href="/profile"
      className="fixed bottom-8 right-8 z-20 grid h-[86px] w-[86px] place-items-center rounded-full bg-orange-500 shadow-[0_16px_35px_rgba(255,107,44,0.35)]"
      aria-label="Professor 5-Brain"
    >
      <Image
        src="/assets/professor-5brain.png"
        alt=""
        width={66}
        height={66}
        className="h-[66px] w-[66px] object-contain"
      />
    </Link>
  );
}

function DashboardFooter() {
  return (
    <footer className="bg-[#121416] px-6 py-16 text-white sm:px-10 lg:px-16 xl:px-28">
      <div className="mx-auto max-w-[1720px]">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.35fr]">
          <div>
            <Image
              src="/assets/nutropx-lab-logo-white.png"
              alt="Nutropx LAB"
              width={230}
              height={58}
              className="h-12 w-auto"
            />
            <address className="mt-10 not-italic text-xs font-medium leading-5 text-white/35">
              Nutropx LLC
              <br />
              19744 Beach Blvd., Suite 170
              <br />
              Huntington Beach, CA 92648
              <br />
              <a className="mt-2 inline-block underline underline-offset-2" href="mailto:support@nutropx.com">
                support@nutropx.com
              </a>
            </address>
          </div>
          <FooterColumn title="Platform" links={[["How It Works", "/how-it-works"], ["Contact", "mailto:support@nutropx.com"]]} />
          <FooterColumn title="Account" links={[["Sign In", "/auth/login"], ["Sign Up", "/auth/signup"], ["Dashboard", "/dashboard"]]} />
          <FooterColumn
            title="Policies"
            links={[
              ["Terms of Service", "https://nutropx.com/terms-and-agreements"],
              ["Privacy Policy", "https://nutropx.com/privacy-policy"],
              ["Shipping Policy", "https://nutropx.com/shipping-and-handling-policy"],
              ["Medical Disclaimer", "https://nutropx.com/medical-disclaimer"],
              ["Do Not Sell or Share My Personal Information", "/privacy/choices"],
            ]}
          />
        </div>
        <div className="mt-16 border-t border-white/10 pt-10 text-xs font-normal leading-5 text-white/25">
          <p>
            Lab is designed for general wellness, cognitive fitness, and educational purposes
            only. It is not a medical service and does not provide medical advice, diagnosis,
            or treatment. Supplement statements have not been evaluated by the Food and Drug
            Administration. Nutropx supplements are not intended to diagnose, treat, cure, or
            prevent any disease.
          </p>
          <p className="mt-6">
            Sharp-PS is a registered trademark of Enzymotec Ltd. Chocamine is a registered
            trademark of RFI Ingredients. Meriva is a registered trademark of Indena S.p.A.
            Cognizin is a registered trademark of Kyowa Hakko Bio Co., Ltd. All other
            trademarks are the property of their respective owners.
          </p>
          <p className="mt-6">(c) 2026 Nutropx LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<[string, string]>;
}) {
  return (
    <nav>
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/28">
        {title}
      </h3>
      <div className="mt-7 grid gap-5 text-sm font-medium leading-6 text-white/48">
        {links.map(([label, href]) =>
          href.startsWith("mailto:") ? (
            <a key={label} href={href}>
              {label}
            </a>
          ) : href.startsWith("http") ? (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          ) : (
            <Link key={label} href={href}>
              {label}
            </Link>
          ),
        )}
      </div>
    </nav>
  );
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
    strokeWidth: 2.15,
    viewBox: "0 0 24 24",
  };

  if (name === "home") {
    return (
      <svg aria-hidden="true" {...common}>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </svg>
    );
  }

  if (name === "lab") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M9 3h6" />
        <path d="M10 3v6l-5 8a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-8V3" />
        <path d="M8 14h8" />
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

  if (name === "profile") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }

  if (name === "crown") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="m4 8 4 4 4-7 4 7 4-4-2 10H6L4 8Z" />
        <path d="M6 21h12" />
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

  if (name === "flame") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M8.5 14.5A4.5 4.5 0 1 0 16 11c0-3-3-5-3-8-3 2-6 5-6 9" />
        <path d="M12 22c-2.2-1-3.4-2.5-3.4-4.2 0-1.5.9-2.8 2.2-3.6.2 1.7 1.2 2.6 2.6 3.5.6.4 1 .9 1 1.7 0 1.1-.8 2-2.4 2.6Z" />
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

  if (name === "badge") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M8 21h8" />
        <path d="m9 17-1 4" />
        <path d="m15 17 1 4" />
        <circle cx="12" cy="8" r="5" />
      </svg>
    );
  }

  if (name === "card") {
    return (
      <svg aria-hidden="true" {...common}>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18" />
      </svg>
    );
  }

  if (name === "bell") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
        <path d="M10 21h4" />
      </svg>
    );
  }

  if (name === "logout") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M10 17 15 12l-5-5" />
        <path d="M15 12H3" />
        <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" />
      </svg>
    );
  }

  if (name === "lock") {
    return (
      <svg aria-hidden="true" {...common}>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
    );
  }

  if (name === "star") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 3Z" />
      </svg>
    );
  }

  if (name === "check") {
    return (
      <svg aria-hidden="true" {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" {...common}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6 18 20H6L5 6" />
      <path d="M10 11v5" />
      <path d="M14 11v5" />
    </svg>
  );
}

function getProfileTab(value?: string): ProfileTab {
  if (value === "progress" || value === "billing" || value === "alerts") {
    return value;
  }

  return "account";
}

function getBillingPlan(value?: string): BillingPlan {
  if (value === "monthly") {
    return "monthly";
  }

  return "annual";
}

function getDigestFrequency(value: unknown): "daily" | "weekly" | "streak" {
  if (value === "daily" || value === "weekly" || value === "streak") {
    return value;
  }

  return "weekly";
}

function toDisplayName(value: string) {
  const cleaned = value.replace(/[._-]+/g, " ").trim();
  if (!cleaned) return "Wajeeha";
  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
