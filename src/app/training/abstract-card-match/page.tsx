import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";
import UserMenu from "@/components/user-menu";
import AbstractCardMatchTrainer from "./training-client";

type IconName = "home" | "lab" | "brain" | "trophy" | "profile" | "crown" | "play" | "cards";

const navItems: Array<[IconName, string, string]> = [
  ["home", "Home", "/dashboard"],
  ["lab", "Lab", "/lab"],
  ["brain", "Brain Test", "/brain-test"],
  ["trophy", "My Brain", "/my-brain"],
  ["profile", "Profile", "/profile"],
];

export default async function AbstractCardMatchPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login?message=Please sign in to open training.");
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
          "linear-gradient(105deg, #f1fbfc 0%, #eef7ff 54%, #fff8f3 100%)",
      }}
    >
      <div className="abstract-training-chrome">
        <TrainingHeader activeLabel="Lab" displayName={displayName} email={email} />
      </div>
      <ExerciseBar />

      <AbstractCardMatchTrainer />

      <div className="abstract-training-chrome">
        <TrainingFooter />
      </div>
      <ProfessorButton />
    </main>
  );
}

function ExerciseBar() {
  return (
    <section className="border-b border-black/10 bg-white">
      <div className="mx-auto flex h-[52px] max-w-[1720px] items-center gap-1.5 px-3">
        <Link
          href="/dashboard"
          aria-label="Back to dashboard"
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-black/5 text-black"
        >
          <span className="text-base leading-none">{"\u2039"}</span>
        </Link>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[0.55rem] bg-[#2d95ee] text-white shadow-[2px_2px_0_#000]">
          <AppIcon name="cards" className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[11px] font-semibold leading-tight text-black">
            Abstract Card Match
          </h2>
          <p className="mt-0.5 text-[9px] font-medium leading-[11px] text-[#1f2937]">
            <span className="font-semibold uppercase tracking-[0.08em] text-[#2d95ee]">
              Memory
            </span>
            <span className="mx-2 text-black/55">{"\u00b7"}</span>
            Flip pairs of cards and remember where each abstract pattern is.
            Find all pairs to complete the round.
          </p>
        </div>
      </div>
    </section>
  );
}

function TrainingHeader({
  activeLabel,
  displayName,
  email,
}: {
  activeLabel: string;
  displayName: string;
  email: string;
}) {
  return (
    <header className="relative border-b-[3px] border-black bg-white">
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
                <AppIcon
                  name={icon}
                  className={active ? "h-4 w-4 text-cyan" : "h-4 w-4 text-[#777]"}
                />
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
      className="abstract-training-chrome fixed bottom-8 right-8 z-20 grid h-[86px] w-[86px] place-items-center rounded-full bg-orange-500 shadow-[0_16px_35px_rgba(255,107,44,0.35)]"
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

function TrainingFooter() {
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
          <p className="mt-6">&copy; 2026 Nutropx LLC. All rights reserved.</p>
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

  if (name === "play") {
    return (
      <svg aria-hidden="true" {...common} fill="currentColor" stroke="none">
        <path d="M8 5.5v13l10-6.5-10-6.5Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" {...common}>
      <path d="m5 8 7-3 7 3-7 3-7-3Z" />
      <path d="m5 12 7 3 7-3" />
      <path d="m5 16 7 3 7-3" />
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
