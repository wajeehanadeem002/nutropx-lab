import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const domains = [
  {
    title: "Memory",
    copy: "Recall, working memory, and recognition",
    icon: "brain",
  },
  {
    title: "Attention",
    copy: "Sustained attention and distraction suppression",
    icon: "target",
  },
  {
    title: "Speed",
    copy: "Reaction time and neural response",
    icon: "bolt",
  },
  {
    title: "Flexibility",
    copy: "Planning, switching, and prioritizing",
    icon: "trend",
  },
  {
    title: "Logic",
    copy: "Reasoning, calculation, and pattern recognition",
    icon: "book",
  },
];

const scoreIs = [
  "A personal benchmark for tracking your own progress over time",
  "A snapshot of how you're performing on the Lab exercise library right now",
  "A guide to help you find which domains to focus on",
];

const scoreIsNot = [
  "A medical assessment",
  "A measure of intelligence or IQ",
  "A diagnostic tool for any condition",
  "A comparison to a clinically validated population norm",
];

const scoreFactors = [
  "Sleep: how much, how recently",
  "Stress and mood",
  "Fatigue and time of day",
  "Caffeine and hydration",
  "Environment and distractions",
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(105deg,#f2fbfb_0%,#ffffff_50%,#fff8f3_100%)] text-black">
      <HowItWorksHeader />

      <article className="mx-auto max-w-[710px] px-5 pb-20 pt-20 sm:px-6 lg:pt-24">
        <div className="inline-flex h-8 items-center gap-2 rounded-full bg-black px-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
          <SparkIcon className="h-3.5 w-3.5 text-[#ff6b2c]" />
          Methodology
        </div>

        <h1 className="mt-8 font-display text-[2.35rem] font-semibold leading-tight tracking-normal text-black sm:text-[2.65rem]">
          How Lab Works
        </h1>
        <p className="mt-5 max-w-[680px] text-[1.08rem] font-normal leading-8 text-[#344049]">
          Lab is a cognitive fitness platform. Like a workout routine for your
          body, it&apos;s designed to give you a structured way to engage your
          brain: memory, focus, processing speed, executive function, problem
          solving, and track your progress over time.
        </p>

        <MethodSection number="1" title="The five training domains">
          <p className="text-[1rem] leading-7 text-[#344049]">
            Every game in Lab targets one of five cognitive domains:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {domains.map((domain) => (
              <article
                key={domain.title}
                className="flex min-h-[72px] items-center gap-4 rounded-[0.9rem] border-2 border-black bg-white px-4 py-3"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[0.65rem] bg-[#42c6ee] text-black">
                  <DomainIcon name={domain.icon} className="h-5 w-5" />
                </span>
                <span>
                  <strong className="block text-[1rem] font-semibold leading-5 text-black">
                    {domain.title}
                  </strong>
                  <span className="mt-1 block text-[0.86rem] font-normal leading-5 text-[#5f666b]">
                    {domain.copy}
                  </span>
                </span>
              </article>
            ))}
          </div>
          <p className="mt-7 text-[1rem] leading-7 text-[#344049]">
            When you play a game, we record your performance: accuracy,
            reaction times, completions, and consistency. That data drives your
            domain scores and your overall Cognitive Fitness Score.
          </p>
        </MethodSection>

        <MethodSection number="2" title="Your Cognitive Fitness Score">
          <p className="text-[1.02rem] leading-8 text-[#344049]">
            Your Cognitive Fitness Score is a personal wellness benchmark.
            It&apos;s computed from your average performance across the games in
            each domain, weighted to give you a single number for tracking
            progress over time.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <ScoreCard title="What your score is" items={scoreIs} tone="cyan" />
            <ScoreCard
              title="What your score is not"
              items={scoreIsNot}
              tone="gray"
            />
          </div>

          <DisclaimerBox className="mt-6" />
        </MethodSection>

        <MethodSection number="3" title="Why scores change day to day">
          <p className="text-[1.02rem] leading-8 text-[#344049]">
            Cognitive performance naturally varies based on many factors:
          </p>
          <ul className="mt-4 space-y-3 text-[0.98rem] leading-6 text-black">
            {scoreFactors.map((factor) => (
              <li key={factor} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#42c6ee]" />
                <span>{factor}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[1.02rem] leading-8 text-[#344049]">
            A drop of 5 or 10 points between sessions doesn&apos;t mean anything
            is wrong. The trend over weeks matters more than any single session.
            For the most consistent personal tracking, we recommend training in
            similar conditions: same rough time of day, same level of caffeine,
            same environment.
          </p>
        </MethodSection>

        <MethodSection number="4" title="Daily Quests">
          <p className="text-[1.02rem] leading-8 text-[#344049]">
            Each day, Lab picks three games for you, weighted toward whichever
            domain currently shows the most room for improvement. You don&apos;t
            have to play the quest. You can browse the full library and pick any
            game, but the quest is the fastest way to keep your routine moving.
          </p>
        </MethodSection>

        <MethodSection number="5" title="Streaks, XP, and Levels">
          <p className="text-[1.02rem] leading-8 text-[#344049]">
            Consistency is the strongest predictor of personal benchmark
            improvement on this platform. Streaks, XP, and Levels are designed
            to reward consistency rather than raw performance. Each game
            completion earns XP. XP fills your level bar. Daily training extends
            your streak. None of these affect your Cognitive Fitness Score
            directly - they&apos;re engagement and motivation tools, not
            measurement tools.
          </p>
        </MethodSection>

        <MethodSection number="6" title={<>Professor 5-Brain&trade;</>}>
          <p className="text-[1.02rem] leading-8 text-[#344049]">
            Professor 5-Brain&trade; is your AI training coach. Each week, it
            generates a short summary of your training activity, consistency,
            and recent performance, meant to help you spot patterns and keep
            your routine moving.
          </p>
          <div className="mt-6 rounded-[0.9rem] border-2 border-black bg-white px-5 py-4 text-[0.95rem] font-semibold leading-6 text-black">
            Professor 5-Brain&trade; is a wellness coach for your training
            routine. It is not a medical professional and does not provide
            medical advice, diagnosis, or treatment.
          </div>
        </MethodSection>

        <MethodSection number="7" title="What this is and is not">
          <p className="text-[1.02rem] leading-8 text-[#344049]">
            Lab is designed for general wellness, cognitive fitness, and
            educational purposes only. It is not a medical service, a clinical
            diagnostic system, or a substitute for professional care.
          </p>
          <p className="mt-6 text-[1.02rem] leading-8 text-[#344049]">
            If you are experiencing memory problems, attention issues, or
            changes in cognition that concern you, please talk to a qualified
            healthcare professional. Lab is not built to evaluate or treat any
            medical condition.
          </p>
          <DisclaimerBox className="mt-6" />
        </MethodSection>

        <section className="mt-16">
          <h2 className="border-b-2 border-black pb-3 font-display text-[1.35rem] font-semibold leading-tight text-black">
            Questions?
          </h2>
          <p className="mt-7 text-[1rem] leading-7 text-[#344049]">
            <a
              href="mailto:support@nutropx.com"
              className="font-semibold text-black underline underline-offset-2"
            >
              support@nutropx.com
            </a>{" "}
            We read every message.
          </p>
          <p className="mt-16 border-t border-black/10 pt-7 text-[0.76rem] font-normal text-[#9aa0a4]">
            Last updated: 2026-05-14 &middot; Methodology version: 1.0
          </p>
        </section>
      </article>

      <DashboardFooter />
    </main>
  );
}

function HowItWorksHeader() {
  return (
    <header className="border-b border-black bg-white">
      <div className="mx-auto flex h-[58px] max-w-[1080px] items-center justify-between px-5 sm:h-[66px] sm:px-6">
        <Link href="/dashboard" aria-label="Nutropx Lab dashboard">
          <Image
            src="/assets/nutropx-lab-logo.png"
            alt="Nutropx LAB"
            width={190}
            height={48}
            className="h-8 w-auto sm:h-9"
            priority
          />
        </Link>
        <Link
          href="/brain-test"
          className="inline-flex h-10 items-center justify-center gap-3 rounded-full bg-black px-5 text-[0.9rem] font-semibold text-white sm:h-11 sm:px-6"
        >
          Brain Test
          <span aria-hidden="true">›</span>
        </Link>
      </div>
    </header>
  );
}

function MethodSection({
  number,
  title,
  children,
}: {
  number: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mt-16">
      <h2 className="border-b-2 border-black pb-3 font-display text-[1.35rem] font-semibold leading-tight text-black">
        {number}. {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ScoreCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "cyan" | "gray";
}) {
  const isCyan = tone === "cyan";

  return (
    <article
      className={[
        "rounded-[0.85rem] border-2 p-5",
        isCyan
          ? "border-[#42c6ee] bg-[#f1fcff]"
          : "border-[#c9c9c9] bg-[#fbfbfb]",
      ].join(" ")}
    >
      <h3 className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-black">
        {title}
      </h3>
      <ul className="mt-4 space-y-4 text-[0.92rem] leading-6 text-black">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            {isCyan ? (
              <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[#42c6ee]" />
            ) : (
              <XIcon className="mt-1 h-4 w-4 shrink-0 text-[#ff6b2c]" />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function DisclaimerBox({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-[0.75rem] border border-black/10 bg-white px-4 py-4 text-[0.82rem] font-normal leading-6 text-[#344049] ${className}`}
    >
      <p>
        Your Cognitive Fitness Score is a personal wellness benchmark, not an IQ
        test, not a measure of intelligence, medical assessment, or diagnosis.
        It has not been validated against clinical population norms.
      </p>
      <p className="mt-3">
        *These statements have not been evaluated by the Food and Drug
        Administration. This product is not intended to diagnose, treat, cure,
        or prevent any disease.
      </p>
    </div>
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
              <a
                className="mt-2 inline-block underline underline-offset-2"
                href="mailto:support@nutropx.com"
              >
                support@nutropx.com
              </a>
            </address>
          </div>
          <FooterColumn
            title="Platform"
            links={[
              ["How It Works", "/how-it-works"],
              ["Contact", "mailto:support@nutropx.com"],
            ]}
          />
          <FooterColumn
            title="Account"
            links={[
              ["Sign In", "/auth/login"],
              ["Sign Up", "/auth/signup"],
              ["Dashboard", "/dashboard"],
            ]}
          />
          <FooterColumn
            title="Policies"
            links={[
              ["Terms of Service", "https://nutropx.com/terms-and-agreements"],
              ["Privacy Policy", "https://nutropx.com/privacy-policy"],
              ["Shipping Policy", "https://nutropx.com/shipping-and-handling-policy"],
              ["Medical Disclaimer", "https://nutropx.com/medical-disclaimer"],
              [
                "Do Not Sell or Share My Personal Information",
                "/privacy/choices",
              ],
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
            Sharp-PS is a registered trademark of Enzymotec Ltd. Chocamine is a
            registered trademark of RFI Ingredients. Meriva is a registered
            trademark of Indena S.p.A. Cognizin is a registered trademark of
            Kyowa Hakko Bio Co., Ltd. All other trademarks are the property of
            their respective owners.
          </p>
          <p className="mt-6">
            Nutropx is committed to digital inclusion. We are actively working
            to ensure our website and Lab platform meet WCAG 2.1 Level AA
            accessibility standards. If you encounter any accessibility
            barriers, or if you need any content provided in an alternative
            format, please contact us at support@nutropx.com and we will respond
            promptly to provide a manual alternative or address the issue. We
            welcome feedback on accessibility and use it to improve our platform
            over time.
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

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8L12 3z" />
      <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12.5l4.2 4.2L19 6.8" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 7l10 10" />
      <path d="M17 7L7 17" />
    </svg>
  );
}

function DomainIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  if (name === "brain") {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M9 4.5a3 3 0 0 0-3 3v.4A3 3 0 0 0 4.5 13v1.5A3.5 3.5 0 0 0 8 18h1" />
        <path d="M15 4.5a3 3 0 0 1 3 3v.4A3 3 0 0 1 19.5 13v1.5A3.5 3.5 0 0 1 16 18h-1" />
        <path d="M9 4.5V19" />
        <path d="M15 4.5V19" />
        <path d="M9 9h2" />
        <path d="M13 12h2" />
      </svg>
    );
  }

  if (name === "target") {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === "bolt") {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M13 2L4 14h7l-1 8 10-13h-7l1-7z" />
      </svg>
    );
  }

  if (name === "trend") {
    return (
      <svg viewBox="0 0 24 24" {...common}>
        <path d="M4 16l5-5 4 4 7-8" />
        <path d="M15 7h5v5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" {...common}>
      <path d="M5 4h5a3 3 0 0 1 3 3v13a4 4 0 0 0-3-1H5z" />
      <path d="M19 4h-5a3 3 0 0 0-3 3v13a4 4 0 0 1 3-1h5z" />
    </svg>
  );
}
