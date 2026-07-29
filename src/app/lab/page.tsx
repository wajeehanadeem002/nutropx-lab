import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import UserMenu from "@/components/user-menu";
import LabExerciseExplorer from "./lab-exercise-explorer";

type IconName =
  | "home"
  | "lab"
  | "brain"
  | "trophy"
  | "profile"
  | "crown"
  | "book"
  | "target"
  | "bolt"
  | "play"
  | "lock"
  | "eye"
  | "arrow"
  | "grid"
  | "sigma"
  | "shape"
  | "layers"
  | "cube"
  | "palette"
  | "music"
  | "waves"
  | "squares"
  | "hexagon"
  | "chain"
  | "diamonds"
  | "checklist"
  | "hash"
  | "cubes"
  | "chess"
  | "flame"
  | "spark";

const navItems: Array<[IconName, string, string]> = [
  ["home", "Home", "/dashboard"],
  ["lab", "Lab", "/lab"],
  ["brain", "Brain Test", "/brain-test"],
  ["trophy", "My Brain", "/my-brain"],
  ["profile", "Profile", "/profile"],
];

export default async function LabPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login?message=Please sign in to open your lab.");
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
      className="min-h-screen pb-20 pt-[75px] text-black lg:pb-0"
      style={{
        background: "linear-gradient(105deg, #ecfbfa 0%, #f8fbfa 50%, #fff7f2 100%)",
      }}
    >
      <DashboardHeader activeLabel="Lab" displayName={displayName} email={email} />

      <div className="mx-auto w-full max-w-[760px] px-6 pb-12 pt-9">
        <LabIntro />
        <LabExerciseExplorer />
        <LabProCta />
        <p className="mx-auto mt-8 max-w-[670px] text-center text-[11px] font-medium leading-[17px] text-muted">
          *Exercises train and test skills in-app. Lab is designed for general wellness,
          cognitive fitness, and educational purposes only. It is not a medical service
          and does not provide medical advice, diagnosis, or treatment.
        </p>
        <Link
          href="https://nutropx.com"
          target="_blank"
          rel="noreferrer"
          className="mx-auto mt-16 block w-fit text-center text-sm font-medium text-black"
        >
          Explore the full Nutropx product range {"\u2192"}
        </Link>
      </div>

      <ProfessorButton />
      <MobileBottomNav activeLabel="Lab" />
      <DashboardFooter />
    </main>
  );
}

function LabIntro() {
  return (
    <section className="mx-auto max-w-[670px]">
      <div className="flex items-start justify-between gap-5">
        <div>
          <h1 className="font-display text-[1.8rem] font-semibold leading-none text-black">
            The Lab
          </h1>
          <p className="mt-2 text-sm font-semibold text-muted">Pick an exercise. Start training.</p>
          <p className="mt-1 text-xs font-medium text-muted">
            25 Elite cognitive exercises* across 5 training categories
          </p>
        </div>
        <div className="hidden shrink-0 items-center gap-3 pt-8 sm:flex">
          <StatPill icon="book" label="25 exercises" />
          <StatPill icon="bolt" label="675 XP" />
        </div>
      </div>

      <div className="mt-8 rounded-r-[1rem] border-l-[4px] border-cyan bg-white px-5 py-4 text-sm font-medium leading-5 text-black shadow-sm">
        <strong className="font-semibold">25 Cognitive Exercises</strong> across 5 Training Categories.
        Select a category to filter, or start an exercise below.
      </div>

      <div className="mt-7 flex items-center gap-4 rounded-[1rem] border border-cyan/35 bg-white/65 px-5 py-5">
        <AppIcon name="lock" className="h-5 w-5 shrink-0 text-cyan" />
        <div>
          <h2 className="text-base font-semibold">Free plan: few exercises available</h2>
          <p className="mt-1 text-xs font-medium leading-4 text-black">
            <Link href="/profile?tab=billing" className="font-semibold text-orange-500">
              Unlock unlimited training
            </Link>{" "}
            for $11.99/mo or $99.99/yr. Includes all 5 Training Categories and 25
            premium cognitive training exercises.
          </p>
        </div>
      </div>
    </section>
  );
}

function StatPill({ icon, label }: { icon: IconName; label: string }) {
  return (
    <span className="inline-flex h-[35px] items-center gap-2 rounded-[0.8rem] border-[3px] border-black bg-white px-3 text-xs font-semibold shadow-[0_4px_0_#000]">
      <AppIcon name={icon} className="h-4 w-4 text-cyan" />
      {label}
    </span>
  );
}

function LabProCta() {
  return (
    <section
      id="lab-pro"
      className="mx-auto mt-10 grid max-w-[672px] justify-items-center rounded-[1rem] bg-[#1a1d1f] px-6 py-5 text-center text-white lg:h-[126px] lg:w-[672px]"
    >
      <p className="text-sm font-medium text-white/55">
        24 more exercises unlock with Lab Pro. 7-day free trial.
      </p>
      <Link
        href="/profile?tab=billing"
        className="mt-5 inline-flex h-[48px] w-[115px] items-center justify-center rounded-[0.85rem] border-[2px] border-black bg-orange-500 text-[14px] font-semibold uppercase text-black shadow-[0_6px_0_#000]"
      >
        Go Pro {"\u2192"}
      </Link>
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
    <header
      className="dashboard-shell-header fixed inset-x-0 top-0 border-b-[3px] border-orange-500 bg-white/90 shadow-[0_8px_24px_rgba(0,0,0,0.10)] backdrop-blur-xl"
      style={{ zIndex: 9999 }}
    >
      <div className="relative mx-auto flex min-h-[72px] w-full max-w-[959px] flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4 lg:flex-nowrap lg:py-0">
        <Link href="/dashboard" className="flex shrink-0 items-center lg:absolute lg:left-10 lg:top-1/2 lg:-translate-y-1/2">
          <Image
            src="/assets/nutropx-lab-logo.png"
            alt="Nutropx LAB"
            width={255}
            height={70}
            priority
            className="h-10 w-auto lg:h-[42px]"
          />
        </Link>

        <nav className="hidden items-center justify-center whitespace-nowrap text-xs font-semibold text-[#777] lg:absolute lg:left-1/2 lg:top-1/2 lg:flex lg:w-auto lg:-translate-x-1/2 lg:-translate-y-1/2 lg:gap-[34px]">
          {navItems.map(([icon, label, href]) => {
            const active = label === activeLabel;
            return (
              <Link
                key={label}
                href={href}
                className={`relative inline-flex h-9 items-center gap-1.5 lg:h-[72px] lg:gap-2 ${
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

        <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:absolute lg:right-[25px] lg:top-1/2 lg:-translate-y-1/2">
          <Link
            href="#lab-pro"
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
      className="fixed bottom-20 right-4 z-20 grid h-[62px] w-[62px] place-items-center rounded-full bg-orange-500 shadow-[0_16px_35px_rgba(255,107,44,0.35)] sm:bottom-8 sm:right-8 sm:h-[86px] sm:w-[86px]"
      aria-label="Professor 5-Brain"
    >
      <Image
        src="/assets/professor-5brain.png"
        alt=""
        width={66}
        height={66}
        className="h-[48px] w-[48px] object-contain sm:h-[66px] sm:w-[66px]"
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

  if (name === "home" || name === "grid" || name === "squares") {
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

  if (name === "book") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H7a3 3 0 0 0-3 3Z" />
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 8H20" />
      </svg>
    );
  }

  if (name === "target") {
    return (
      <svg aria-hidden="true" {...common}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
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

  if (name === "lock") {
    return (
      <svg aria-hidden="true" {...common}>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    );
  }

  if (name === "eye") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    );
  }

  if (name === "arrow") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M8 7 3 12l5 5" />
        <path d="M3 12h18" />
        <path d="m16 7 5 5-5 5" />
      </svg>
    );
  }

  if (name === "sigma") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M18 5H7l6 7-6 7h11" />
      </svg>
    );
  }

  if (name === "shape") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="m12 4 4 7H8l4-7Z" />
        <rect x="5" y="15" width="5" height="5" rx="1" />
        <circle cx="17" cy="17.5" r="2.5" />
      </svg>
    );
  }

  if (name === "layers") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 16 9 5 9-5" />
      </svg>
    );
  }

  if (name === "cube") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="M12 12 4 7.5" />
        <path d="M12 12v9" />
        <path d="m12 12 8-4.5" />
      </svg>
    );
  }

  if (name === "palette") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 1.4-3.4 1.8 1.8 0 0 1 1.3-3.1H17a4 4 0 0 0 0-8 8.8 8.8 0 0 0-5-3.5Z" />
        <circle cx="8" cy="10" r="1" />
        <circle cx="11" cy="7.5" r="1" />
        <circle cx="14.5" cy="9.5" r="1" />
      </svg>
    );
  }

  if (name === "music") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M9 18V5l10-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="16" cy="16" r="3" />
      </svg>
    );
  }

  if (name === "waves") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M4 7c2 2 4 2 6 0s4-2 6 0 3 1.5 4 0" />
        <path d="M4 12c2 2 4 2 6 0s4-2 6 0 3 1.5 4 0" />
        <path d="M4 17c2 2 4 2 6 0s4-2 6 0 3 1.5 4 0" />
      </svg>
    );
  }

  if (name === "hexagon") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      </svg>
    );
  }

  if (name === "chain") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M10 13a5 5 0 0 0 7.1 0l1.4-1.4a5 5 0 0 0-7.1-7.1L10.5 5" />
        <path d="M14 11a5 5 0 0 0-7.1 0l-1.4 1.4a5 5 0 0 0 7.1 7.1l.9-.9" />
      </svg>
    );
  }

  if (name === "diamonds") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="m8 3 4 4-4 4-4-4 4-4Z" />
        <path d="m16 3 4 4-4 4-4-4 4-4Z" />
        <path d="m8 13 4 4-4 4-4-4 4-4Z" />
        <path d="m16 13 4 4-4 4-4-4 4-4Z" />
      </svg>
    );
  }

  if (name === "checklist") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="m5 7 2 2 4-4" />
        <path d="M14 7h5" />
        <path d="m5 15 2 2 4-4" />
        <path d="M14 15h5" />
      </svg>
    );
  }

  if (name === "hash") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M5 9h14" />
        <path d="M5 15h14" />
        <path d="M9 4 7 20" />
        <path d="m17 4-2 16" />
      </svg>
    );
  }

  if (name === "cubes") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="m8 4 4 2.5V11l-4 2.5L4 11V6.5L8 4Z" />
        <path d="m16 4 4 2.5V11l-4 2.5-4-2.5V6.5L16 4Z" />
        <path d="m12 11 4 2.5V18l-4 2.5L8 18v-4.5L12 11Z" />
      </svg>
    );
  }

  if (name === "chess") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="m5 20 2-8 5 3 5-3 2 8H5Z" />
        <path d="M8 12 12 4l4 8" />
        <path d="M4 20h16" />
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
