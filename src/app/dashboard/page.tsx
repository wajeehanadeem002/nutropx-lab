import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";
import UserMenu from "@/components/user-menu";

type IconName = "home" | "lab" | "brain" | "trophy" | "profile" | "grid" | "bolt" | "play" | "flame" | "crown" | "target";

const navItems: Array<[IconName, string, string, boolean]> = [
  ["home", "Home", "/dashboard", true],
  ["lab", "Lab", "/lab", false],
  ["brain", "Brain Test", "/brain-test", false],
  ["trophy", "My Brain", "/my-brain", false],
  ["profile", "Profile", "/profile", false],
];

const domains = [
  ["#9f42d6", "Logic"],
  ["#2d95ee", "Memory"],
  ["#ef3030", "Attention"],
  ["#ffd11a", "Speed"],
  ["#18c7b5", "Flex"],
];

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login?message=Please sign in to open your dashboard.");
  }

  const rawName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : user.email?.split("@")[0] ?? "Wajeeha";
  const displayName = toDisplayName(rawName);
  const email = user.email ?? "";

  return (
    <main
      className="min-h-screen text-black"
      style={{
        background:
          "linear-gradient(105deg, #ecfbfa 0%, #f8fbfa 50%, #fff7f2 100%)",
      }}
    >
      <DashboardHeader displayName={displayName} email={email} />

      <div className="mx-auto max-w-[1120px] px-6 pb-10 pt-5 sm:px-8 lg:px-10">
        <ProgressPill />

        <section className="mx-auto mt-8 w-full max-w-[672px]">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-black">
            Good afternoon
          </p>
          <h1 className="mt-2 font-display text-[1.55rem] font-bold leading-none text-black sm:text-[1.9rem]">
            Hi, {displayName}
          </h1>

          <article className="mx-auto mt-8 h-auto rounded-[1.25rem] bg-[#131516] px-5 py-5 text-white shadow-[0_18px_45px_rgba(0,0,0,0.16)] sm:px-8 sm:py-6 lg:h-[277px] lg:w-[672px]">
            <span className="inline-flex rounded-full border border-cyan/50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-cyan">
              Free - 90 seconds
            </span>
            <h2 className="mt-4 text-xl font-black leading-tight sm:text-[1.6rem]">
              Meet your brain.{" "}
              <span className="text-cyan">Take the Brain Test.</span>
            </h2>
            <p className="mt-3 max-w-4xl text-xs font-medium leading-5 text-white/62 sm:text-sm">
              Get your Cognitive Fitness Score, a personal wellness benchmark
              and the starting line your training builds from.
            </p>
            <Link
              href="/brain-test"
              className="mt-6 inline-flex min-h-[54px] w-full items-center justify-center rounded-[1rem] border-[3px] border-black bg-orange-500 px-6 text-sm font-black uppercase text-black shadow-[0_7px_0_#000000] transition hover:translate-y-0.5 hover:shadow-[0_5px_0_#000000]"
            >
              Start the Brain Test <span className="ml-2 text-xl">{"\u2192"}</span>
            </Link>
            <p className="mt-5 text-center text-[11px] font-medium text-white/45">
              Not an IQ test, not a measure of intelligence, not a medical
              assessment or diagnosis.
            </p>
          </article>
        </section>

        <TrainingCard />
        <ProTrialCard />
        <StreakCard />

        <p className="mx-auto mt-10 max-w-[670px] text-center text-[11px] font-medium leading-[17px] text-muted lg:h-[34px] lg:w-[670px]">
          *Exercises train and test skills in-app. Lab is designed for general
          wellness, cognitive fitness, and educational purposes only. It is not
          a medical service and does not provide medical advice, diagnosis, or
          treatment.
        </p>
      </div>

      <ProfessorButton />
      <DashboardFooter />
    </main>
  );
}

function DashboardHeader({ displayName, email }: { displayName: string; email: string }) {
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
          {navItems.map(([icon, label, href, active]) => (
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
          ))}
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

function ProgressPill() {
  return (
    <div className="mx-auto flex h-[72px] w-full max-w-[417px] items-center rounded-full border-[3px] border-black bg-white px-4 shadow-[0_8px_0_#000000]">
      <Link
        href="/profile"
        aria-label="Open profile"
        className="flex min-w-0 flex-1 items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
      >
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-cyan text-base font-black">
          1
        </div>
        <div className="ml-4 min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted">
            Level 1
          </p>
          <div className="mt-2 h-1.5 max-w-[105px] rounded-full bg-black/6" />
        </div>
        <div className="mx-4 h-9 w-px bg-black/8" />
        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted">
          <AppIcon name="flame" className="h-4 w-4 text-black/15" />
          <span className="text-sm text-black">0</span>
          Days
        </div>
      </Link>
      <Link
        href="/lab"
        className="ml-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white"
      >
        <AppIcon name="bolt" className="h-4 w-4 text-cyan" />
        Train
      </Link>
    </div>
  );
}

function TrainingCard() {
  return (
    <section className="mx-auto mt-9 overflow-hidden rounded-[1.2rem] border border-black/10 bg-white shadow-[0_2px_0_rgba(0,0,0,0.05)] lg:h-[220px] lg:w-[670px]">
      <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
        <h2 className="text-base font-black">Today&apos;s training</h2>
        <Link href="/lab" className="text-xs font-black text-[#C95F1E]">
          All exercises {"\u2192"}
        </Link>
      </div>
      <div className="flex items-center justify-between gap-4 border-b border-black/10 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-[0.8rem] bg-[#2d95ee] text-white">
            <AppIcon name="target" className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-black">Abstract Card Match</h3>
            <p className="mt-1 text-xs font-medium text-muted">
              Memory - 2 min - Free exercise
            </p>
          </div>
        </div>
        <Link
          href="/training/abstract-card-match"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-[0.8rem] bg-orange-500 text-black"
        >
          <AppIcon name="play" className="h-6 w-6" />
        </Link>
      </div>
      <div className="grid grid-cols-5 px-6 py-3 text-center">
        {domains.map(([color, label]) => (
          <div key={label} className="grid justify-items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] font-black uppercase tracking-[0.08em] text-muted">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProTrialCard() {
  return (
    <section id="upgrade" className="mx-auto mt-9 overflow-hidden rounded-[1.2rem] bg-[#1a1d1f] px-5 py-5 text-white lg:h-[330px] lg:w-[670px]">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan">
        7-day free trial
      </p>
      <h2 className="mt-2 text-xl font-black leading-tight">Unlock the full Lab</h2>
      <p className="mt-3 max-w-5xl text-xs font-medium leading-5 text-white/55">
        All 25 Elite cognitive exercises*, daily quests, score history, and
        Professor 5-Brain™ as your training coach.
      </p>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <button className="rounded-[0.9rem] border-2 border-orange-500 px-4 py-3 text-center lg:h-[103px]">
          <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-white/55">
            Yearly
          </span>
          <span className="mt-1 block text-xl font-black">$99.99<span className="text-xs text-white/50">/yr</span></span>
          <span className="mt-0.5 block text-[10px] font-medium text-white/55">or $8.33/mo</span>
          <span className="mt-1 block text-[10px] font-black text-cyan">Save 31% yearly</span>
        </button>
        <button className="self-start rounded-[0.9rem] border border-white/15 px-4 py-3 text-center lg:h-[72px]">
          <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-white/55">
            Monthly
          </span>
          <span className="mt-3 block text-xl font-black">$11.99<span className="text-xs text-white/50">/mo</span></span>
        </button>
      </div>

      <Link
        href="/profile?tab=billing"
        className="mt-4 inline-flex min-h-[46px] w-full items-center justify-center rounded-[0.85rem] border-[3px] border-black bg-orange-500 px-5 text-sm font-black uppercase text-black shadow-[0_6px_0_#000000]"
      >
        Start Free Trial <span className="ml-2">{"\u2192"}</span>
      </Link>
      <p className="mt-4 text-center text-[10px] font-medium text-white/35">
        Card required · cancel anytime in 1 click · no charge if you cancel
        during the trial
      </p>
    </section>
  );
}

function StreakCard() {
  return (
    <section className="mx-auto mt-9 flex items-center gap-5 rounded-[1rem] border border-black/10 bg-white px-6 py-4 lg:h-[75px] lg:w-[670px]">
      <span className="text-3xl">{"\ud83d\udd25"}</span>
      <div>
        <h2 className="text-lg font-semibold">Start your streak today</h2>
        <p className="mt-1 text-sm font-semibold text-muted">
          Train once to light it up. Your longest run lives here.
        </p>
      </div>
    </section>
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
            Lab is designed for general wellness, cognitive fitness, and
            educational purposes only. It is not a medical service and does not
            provide medical advice, diagnosis, or treatment. Supplement
            statements have not been evaluated by the Food and Drug
            Administration. Nutropx supplements are not intended to diagnose,
            treat, cure, or prevent any disease.
          </p>
          <p className="mt-6">
            Sharp-PS® is a registered trademark of Enzymotec Ltd. Chocamine® is
            a registered trademark of RFI Ingredients. Meriva® is a registered
            trademark of Indena S.p.A. Cognizin® is a registered trademark of
            Kyowa Hakko Bio Co., Ltd. All other trademarks are the property of
            their respective owners.
          </p>
          <p className="mt-6">© 2026 Nutropx LLC. All rights reserved.</p>
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
      <h3 className="text-[10px] font-black uppercase tracking-[0.16em] text-white/28">
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

  if (name === "home" || name === "grid") {
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

  if (name === "bolt") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z" />
      </svg>
    );
  }

  if (name === "play") {
    return (
      <svg aria-hidden="true" {...common} fill="currentColor" stroke="none">
        <path d="M8 5.5v13l10-6.5-10-6.5Z" />
      </svg>
    );
  }

  if (name === "flame") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M12 22c3.3-1.8 5-4.4 5-7.8 0-3.1-1.7-5.4-4.4-7.2.1 2.5-.7 4.2-2.6 5.2.2-2.5-.7-4.5-2.8-6C5.7 8.3 5 10.8 5 13.7 5 17.6 7.5 20.5 12 22Z" />
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

  return (
    <svg aria-hidden="true" {...common}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
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
