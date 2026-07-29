import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import UserMenu from "@/components/user-menu";
import { MyBrainTabs } from "./my-brain-tabs";

type IconName =
  | "home"
  | "lab"
  | "brain"
  | "trophy"
  | "profile"
  | "crown"
  | "spark";

const navItems: Array<[IconName, string, string]> = [
  ["home", "Home", "/dashboard"],
  ["lab", "Lab", "/lab"],
  ["brain", "Brain Test", "/brain-test"],
  ["trophy", "My Brain", "/my-brain"],
  ["profile", "Profile", "/profile"],
];

export default async function MyBrainPage() {
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
  const email = user.email ?? "";

  return (
    <main
      className="min-h-screen pb-20 pt-[75px] text-black lg:pb-0"
      style={{
        background: "linear-gradient(105deg, #ecfbfa 0%, #f8fbfa 50%, #fff7f2 100%)",
      }}
    >
      <DashboardHeader activeLabel="My Brain" displayName={displayName} email={email} />

      <div className="mx-auto max-w-[760px] px-6 pb-14 pt-9">
        <section className="mx-auto max-w-[672px]">
          <h1 className="font-display text-[1.75rem] font-semibold leading-none text-black">
            Your progress
          </h1>
          <p className="mt-2 text-sm font-medium text-muted">Is the routine working?</p>
        </section>

        <MyBrainTabs />
      </div>

      <ProfessorButton />
      <MobileBottomNav activeLabel="My Brain" />
      <DashboardFooter />
    </main>
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

  return (
    <svg aria-hidden="true" {...common}>
      <path d="M13 2 9.8 9.8 2 13l7.8 3.2L13 24l3.2-7.8L24 13l-7.8-3.2L13 2Z" />
      <path d="m5 3 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" />
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
