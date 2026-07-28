import Image from "next/image";
import Link from "next/link";
import { QuickReactionDemo } from "@/components/quick-reaction-demo";

const XYNAPTIC_DROPS_URL = "https://nutropx.com/product/xynaptic-drops";
const FIVE_BRAIN_URL = "https://nutropx.com/product/5-brain";
const XTRA_BRAIN_URL = "https://nutropx.com/product/xtra-brain";
const BRAIN_STACK_URL = "https://nutropx.com/product/xynergistic-brain-stack";

function getSupplementUrl(name: string) {
  if (name === "Xynaptic Drops") return XYNAPTIC_DROPS_URL;
  if (name === "5-Brain") return FIVE_BRAIN_URL;
  if (name === "Xtra-Brain") return XTRA_BRAIN_URL;
  return undefined;
}

const features = [
  [
    "Cognitive Fitness Score",
    "A personal wellness benchmark that tracks your training progress across 5 domains.",
  ],
  [
    "Daily Quests",
    "Under 3 minutes. Adaptive exercises that target your current focus area.",
  ],
  [
    "Level & XP",
    "Earn XP after every session. Unlock levels and badges as you train.",
  ],
  [
    "Streaks",
    "Build consistency with a visual streak calendar that never lets you forget.",
  ],
  [
    "Professor 5-Brain",
    "AI wellness coach that summarizes your weekly training activity and suggests what to focus on next.",
  ],
  [
    "Progress Tracking",
    "Visible training progress: weekly trendlines, domain deltas, personal bests.",
  ],
];

const benefits = [
  [
    "Enhance Memory",
    "Recall crucial details when it matters most. Crush demanding tasks with unshakeable focus.",
  ],
  [
    "Learn Faster",
    "Absorb new information like a sponge. Retain knowledge and master skills faster.",
  ],
  [
    "Clear Thinking",
    "Silence the mental haze. Experience decisive thinking and unwavering energy.",
  ],
  [
    "Balanced Mood",
    "Greater calm and resilience. Stay composed even when life throws curveballs.",
  ],
];

const supplements = [
  {
    tag: "Fast-Acting",
    name: "Xynaptic Drops",
    copy: "Daily support for focus, memory & mental energy.*",
    price: "$59.99",
    image: "/assets/product-xynaptic-drops.png",
  },
  {
    tag: "Top Rated",
    name: "5-Brain",
    copy: "Comprehensive all-in-one formula for sharper focus, enhanced memory, and sustained mental alertness.*",
    price: "$69.99",
    image: "/assets/product-5brain.png",
  },
  {
    tag: "Gut-Brain",
    name: "Xtra-Brain",
    copy: "Advanced non-dairy probiotic to support the gut-brain axis.*",
    price: "$49.99",
    image: "/assets/product-xtra-brain.png",
  },
];

const planFeatures = [
  "Unlimited cognitive training exercises",
  "Full Cognitive Fitness Score history & trends",
  "Personalized daily training plan",
  "Professor 5-Brain AI wellness coach",
  "Domain breakdown & progress tracking",
  "Streak system & milestone tracking",
  "Weekly training summaries",
];

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <Hero />
      <ProductPair />
      <Platform />
      <WhyTrain />
      <WhyTrainProducts />
      <Professor />
      <Supplements />
      <Stack />
      <HowItWorks />
      <Pricing />
      <FinalCta />
      <SiteFooter />
    </main>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-transparent px-3 pt-2 pb-0 sm:px-6 sm:pt-3 lg:px-16 xl:px-24 2xl:px-32 2xl:pt-4">
      <div className="mx-auto flex min-h-[66px] max-w-[1648px] items-center justify-between rounded-full border border-black/10 bg-white/80 px-5 shadow-[0_18px_42px_rgba(0,0,0,0.10)] backdrop-blur-md sm:min-h-[74px] sm:px-8 2xl:min-h-[82px]">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/nutropx-lab-logo.png"
            alt="Nutropx LAB"
            width={225}
            height={62}
            priority
            className="h-11 w-auto sm:h-14 2xl:h-[64px]"
          />
        </Link>
        <nav className="flex w-auto min-w-[132px] items-center justify-between gap-3 text-[11px] font-semibold leading-none text-black md:min-w-[360px] md:gap-4 md:text-sm lg:min-w-[400px] lg:text-[15px] 2xl:min-w-[440px] 2xl:text-base">
          <Link href="#supplements" className="hidden hover:text-coral md:inline">
            Supplements
          </Link>
          <Link href="#pricing" className="hidden hover:text-coral md:inline">
            Pricing
          </Link>
          <Link href="/auth/login" className="hidden hover:text-coral md:inline">
            Sign in
          </Link>
          <Link
            href="/brain-test"
            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-[1rem] border-[3px] border-black bg-coral px-4 text-[11px] font-semibold uppercase leading-none text-ink shadow-[0_5px_0_#000] transition hover:translate-y-0.5 hover:shadow-[0_3px_0_#000] sm:min-h-12 sm:w-[160px] sm:px-5 sm:text-sm 2xl:min-h-14 2xl:w-[176px] 2xl:text-base"
          >
            Brain Test
            <span className="text-xl leading-none">{"\u203a"}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      id="main-content"
      className="overflow-hidden"
      style={{
        background:
          "linear-gradient(105deg, #ecfbfa 0%, #f8fbfa 48%, #fff7f2 100%)",
      }}
    >
      <div className="relative mx-auto grid max-w-[1776px] items-start gap-10 pl-10 pr-6 pb-20 pt-0 sm:pl-12 sm:pr-8 sm:pb-24 sm:pt-1 lg:grid-cols-[minmax(0,840px)_minmax(0,820px)] lg:gap-[116px] lg:pl-24 lg:pr-16 lg:pt-3 xl:pl-32 xl:pr-24 2xl:pl-40 2xl:pr-32">
        <div className="hero-copy-offset max-w-[840px]">
          <p className="mb-7 inline-flex whitespace-nowrap items-center gap-2 rounded-full bg-black px-4 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-white shadow-[10px_0_0_#000000]">
            <span className="h-2.5 w-2.5 rounded-full bg-coral" />
            <span>Cognitive Performance Platform</span>
          </p>
          <h1 className="mb-6 font-display text-2xl font-black leading-[1.03] text-black sm:text-[1.7rem] md:text-[2.4rem] lg:text-[3.2rem] xl:text-[3.55rem] 2xl:text-[3.85rem]">
            <span className="block lg:whitespace-nowrap">Train your brain</span>
            <span className="block lg:whitespace-nowrap">
              like it&apos;s a{" "}
              <span className="relative inline-block">
                <span className="relative z-10">game.</span>
                <span className="absolute inset-x-0 -bottom-1 h-3 -skew-x-6 bg-coral/60" />
              </span>
            </span>
          </h1>
          <p className="mb-6 max-w-[720px] text-sm font-normal leading-[1.38] text-black sm:text-lg lg:text-[1.12rem] lg:leading-[1.38]">
            <span className="block">
              Take a 90-second Brain Test. Get your score. Level up with
            </span>
            <span className="block">
              daily quests in the Nutropx Lab, fueled by science.
            </span>
          </p>
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <Link
              href="/brain-test"
              className="inline-flex min-h-[58px] w-full max-w-[360px] items-center justify-center gap-2.5 rounded-[1.25rem] bg-black px-4 text-sm font-black whitespace-nowrap text-white shadow-[10px_12px_0_#000000] transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto sm:min-w-[355px] sm:gap-3 sm:px-5 sm:text-base"
            >
              <span className="grid h-5 w-5 place-items-center text-coral sm:h-6 sm:w-6">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-full w-full"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.3"
                >
                  <path d="M12 5a3 3 0 1 0-5.98.38 4 4 0 0 0-2.44 5.75 4 4 0 0 0 .52 6.4A4 4 0 1 0 12 18Z" />
                  <path d="M12 5a3 3 0 1 1 5.98.38 4 4 0 0 1 2.44 5.75 4 4 0 0 1-.52 6.4A4 4 0 1 1 12 18Z" />
                  <path d="M12 5v13" />
                  <path d="M8.5 9.5A4.5 4.5 0 0 0 12 13" />
                  <path d="M15.5 9.5A4.5 4.5 0 0 1 12 13" />
                  <path d="M7.5 14.5A3.5 3.5 0 0 0 12 18" />
                  <path d="M16.5 14.5A3.5 3.5 0 0 1 12 18" />
                </svg>
              </span>
              Take the Brain Test. Free.
              <span className="text-xl font-normal leading-none sm:text-2xl">{"\u2192"}</span>
            </Link>
            <a
              href="#demo"
              className="inline-flex min-h-[58px] items-center gap-3 rounded-[1.15rem] bg-white px-6 text-base font-black whitespace-nowrap text-black transition-colors hover:bg-cyan/10"
            >
              <span className="h-0 w-0 border-y-[8px] border-l-[13px] border-y-transparent border-l-black" />
              Try demo
            </a>
          </div>

          <div className="mt-8 grid w-full max-w-[760px] grid-cols-2 gap-3 md:grid-cols-4 lg:gap-4">
            {[
              ["25", "Exercises"],
              ["5", "Cognitive domains"],
              ["3 min", "Avg. session"],
              ["90", "Seconds to start"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="flex min-h-[78px] flex-col items-center justify-center rounded-[1.25rem] bg-white px-3 py-4 text-center md:min-h-[88px] lg:px-4"
              >
                <p className="whitespace-nowrap text-lg font-medium leading-none text-black md:text-xl lg:text-[1.35rem]">
                  {value}
                </p>
                <p className="mt-2 whitespace-nowrap text-[10px] font-medium leading-none text-black md:text-[11px] lg:text-xs">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-16 min-w-0 lg:mt-16 lg:justify-self-end" id="demo">
          <div className="relative z-10 ml-auto mr-20 h-[395px] w-full max-w-[370px] rounded-[1.1rem] border-[3px] border-black bg-white px-5 py-5 text-center shadow-[9px_9px_0_#000000] lg:mr-40 2xl:mr-60">
            <div className="text-center">
              <span className="inline-flex rounded-full border-[2px] border-black bg-white px-5 py-1 text-xs font-black uppercase tracking-wide shadow-[0_3px_0_#000]">
                Preview
              </span>
            </div>

            <div className="relative mx-auto mt-0 grid h-[145px] w-[145px] place-items-center">
              <svg viewBox="0 0 180 180" className="absolute inset-0 h-full w-full -rotate-90">
                <circle
                  cx="90"
                  cy="90"
                  r="70"
                  fill="none"
                  stroke="#edf1f5"
                  strokeWidth="12"
                />
                <circle
                  cx="90"
                  cy="90"
                  r="70"
                  fill="none"
                  stroke="#10d0fc"
                  strokeDasharray="322 440"
                  strokeLinecap="round"
                  strokeWidth="12"
                />
              </svg>
              <div className="relative text-center">
                <p className="font-display text-4xl font-black leading-none text-black">
                  73
                </p>
                <p className="relative z-10 mt-2 text-center text-xs font-black uppercase tracking-[0.12em] text-cyan">
                  Cognitive Fitness
                  <span className="block">Score</span>
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                ["71", "Memory", "text-blue-500"],
                ["76", "Attention", "text-red-500"],
                ["68", "Speed", "text-yellow-400"],
              ].map(([value, label, color]) => (
                <div key={label} className="rounded-xl bg-white px-2 py-1.5">
                  <p className={`text-lg font-black ${color}`}>{value}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-black">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-black/10 pt-2.5">
              <div className="flex items-center gap-2 text-sm font-black text-black">
                <span className="h-4 w-4 rounded-full bg-coral" />
                12 day streak
              </div>
              <span className="rounded-xl border-[2px] border-black bg-coral px-3.5 py-1.5 text-xs font-black text-black shadow-[3px_3px_0_#000]">
                +25 XP
              </span>
            </div>
          </div>

          <div className="mt-16 rounded-[1.35rem] border-[3px] border-black bg-white px-5 py-4 shadow-[12px_12px_0_#000000] lg:w-[520px] lg:-translate-x-10">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-black">
                  Quick Demo
                </p>
                <h2 className="mt-1.5 text-xl font-black leading-none text-black">
                  Test your reaction in 3 seconds
                </h2>
              </div>
              <span className="mt-1 pr-1 text-2xl font-black leading-none text-coral">{"\u26a1"}</span>
            </div>
            <QuickReactionDemo />
          </div>
        </div>
      </div>
    </section>
  );
}

function Platform() {
  return (
    <section className="section bg-paper">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">The Platform</p>
          <h2 className="whitespace-nowrap font-display text-[1.05rem] font-black leading-tight text-ink sm:text-xl md:text-2xl lg:text-[1.75rem]">
            A complete cognitive performance lab
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs font-medium leading-5 text-muted sm:text-sm lg:text-base">
            Six interconnected systems designed around one thing: making
            improvement measurable, visible, and fun.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, copy], index) => (
            <article
              key={title}
              className="group min-h-[180px] rounded-[1.25rem] border-2 border-black bg-white px-5 py-5 shadow-[0_8px_0_#000000] transition duration-200 hover:-translate-y-1 hover:border-amber-400 hover:shadow-[0_12px_0_#000000]"
            >
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-[0.9rem] bg-coral text-black">
                <FeatureIcon index={index} />
              </div>
              <h3 className="text-base font-black leading-tight text-black sm:text-lg">
                {title}
              </h3>
              <p className="mt-3 text-xs font-medium leading-5 text-black sm:text-sm">
                {copy}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureIcon({ index }: { index: number }) {
  const commonProps = {
    className: "h-6 w-6",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2.2,
    viewBox: "0 0 24 24",
  };

  switch (index) {
    case 1:
      return (
        <svg aria-hidden="true" {...commonProps}>
          <path d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z" />
        </svg>
      );
    case 2:
      return (
        <svg aria-hidden="true" {...commonProps}>
          <path d="M8 21h8" />
          <path d="M12 17v4" />
          <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
          <path d="M5 6H3v2a4 4 0 0 0 4 4" />
          <path d="M19 6h2v2a4 4 0 0 1-4 4" />
        </svg>
      );
    case 3:
      return (
        <svg aria-hidden="true" {...commonProps}>
          <path d="M12 22c3.3-1.8 5-4.4 5-7.8 0-3.1-1.7-5.4-4.4-7.2.1 2.5-.7 4.2-2.6 5.2.2-2.5-.7-4.5-2.8-6C5.7 8.3 5 10.8 5 13.7 5 17.6 7.5 20.5 12 22Z" />
        </svg>
      );
    case 4:
      return (
        <svg aria-hidden="true" {...commonProps}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      );
    case 5:
      return (
        <svg aria-hidden="true" {...commonProps}>
          <path d="m4 16 5-5 4 4 7-8" />
          <path d="M15 7h5v5" />
        </svg>
      );
    default:
      return (
        <svg aria-hidden="true" {...commonProps}>
        <path d="M12 5a3 3 0 1 0-5.98.38 4 4 0 0 0-2.44 5.75 4 4 0 0 0 .52 6.4A4 4 0 1 0 12 18Z" />
        <path d="M12 5a3 3 0 1 1 5.98.38 4 4 0 0 1 2.44 5.75 4 4 0 0 1-.52 6.4A4 4 0 1 1 12 18Z" />
        <path d="M12 5v13" />
      </svg>
      );
  }
}

function WhyTrain() {
  return (
    <section className="bg-black px-5 pt-20 pb-12 text-white sm:px-8 lg:pt-24 lg:pb-14">
      <div className="mx-auto max-w-[1540px]">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-500">
            Why Train
          </p>
          <h2 className="mt-4 font-display text-2xl font-black leading-[1.05] text-white sm:text-3xl lg:text-[2.4rem] xl:text-[2.75rem]">
            <span className="block">Silence the noise.</span>
            <span className="block">Unlock peak focus.</span>
          </h2>
        </div>
        <div className="mt-12 grid gap-5 px-4 md:grid-cols-2 md:px-8 xl:grid-cols-4 xl:px-12 2xl:px-16">
          {benefits.map(([title, copy], index) => (
            <article
              key={title}
              className="rounded-[1.15rem] border border-white/10 bg-[#101010] px-5 py-6 text-center"
            >
              <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-[0.9rem] bg-orange-500 text-black">
                <BenefitIcon index={index} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.1em] text-white">
                {title}
              </h3>
              <p className="mx-auto mt-3 max-w-[230px] text-xs font-semibold leading-5 text-white/60">
                {copy}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitIcon({ index }: { index: number }) {
  const commonProps = {
    className: "h-6 w-6",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2.1,
    viewBox: "0 0 24 24",
  };

  switch (index) {
    case 1:
      return (
        <svg aria-hidden="true" {...commonProps}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5Z" />
          <path d="M10 2v15" />
        </svg>
      );
    case 2:
      return (
        <svg aria-hidden="true" {...commonProps}>
          <path d="M12 3v3" />
          <path d="M12 18v3" />
          <path d="M3 12h3" />
          <path d="M18 12h3" />
          <path d="m6.5 6.5 2.1 2.1" />
          <path d="m15.4 15.4 2.1 2.1" />
          <path d="m17.5 6.5-2.1 2.1" />
          <path d="m8.6 15.4-2.1 2.1" />
        </svg>
      );
    case 3:
      return (
        <svg aria-hidden="true" {...commonProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        </svg>
      );
    default:
      return (
        <svg aria-hidden="true" {...commonProps}>
          <path d="M12 5a3 3 0 1 0-5.98.38 4 4 0 0 0-2.44 5.75 4 4 0 0 0 .52 6.4A4 4 0 1 0 12 18Z" />
          <path d="M12 5a3 3 0 1 1 5.98.38 4 4 0 0 1 2.44 5.75 4 4 0 0 1-.52 6.4A4 4 0 1 1 12 18Z" />
          <path d="M12 5v13" />
        </svg>
      );
  }
}

function WhyTrainProducts() {
  return (
    <section className="bg-black px-6 pb-24 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-[920px] gap-4 lg:grid-cols-2">
        <SpotlightProductCard
          focus="Attention"
          name="Xynaptic Drops"
          copy="Popular among users training attention.*"
          price="$59.99"
          image="/assets/product-xynaptic-drops.png"
        />
        <SpotlightProductCard
          focus="Memory"
          name="5-Brain"
          copy="Popular among users training memory.*"
          price="$69.99"
          image="/assets/product-5brain.png"
        />
      </div>
    </section>
  );
}

function SpotlightProductCard({
  focus,
  name,
  copy,
  price,
  image,
}: {
  focus: string;
  name: string;
  copy: string;
  price: string;
  image: string;
}) {
  const productHref = getSupplementUrl(name);
  const cardClassName =
    "relative block min-h-[250px] overflow-hidden rounded-[1.2rem] bg-cyan px-5 py-5 text-black sm:px-6 sm:py-6";
  const body = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full border-[2px] border-black/15 bg-black/5 px-3 text-[9px] font-black uppercase tracking-[0.08em]">
              <span className="text-xs leading-none">{"\u2723"}</span>
              For your {focus}
            </span>
            <span className="inline-flex min-h-8 items-center rounded-full bg-white px-3 text-[9px] font-black uppercase tracking-[0.04em]">
              Nutropx
            </span>
          </div>
          <h3 className="mt-5 text-2xl font-black leading-none sm:text-[2rem]">
            {name}
          </h3>
          <p className="mt-4 max-w-[220px] text-sm font-medium leading-6 text-black/75">
            {copy}
          </p>
          <p className="mt-5 text-xl font-black leading-none sm:text-2xl">
            {price}
          </p>
          {productHref ? (
            <span className="mt-5 inline-flex min-h-11 items-center gap-3 rounded-[0.9rem] bg-black px-5 text-xs font-black uppercase text-white transition hover:translate-y-0.5 sm:text-sm">
              Shop Now
              <span className="text-xl leading-none">{"\u203a"}</span>
            </span>
          ) : (
            <a
              className="mt-5 inline-flex min-h-11 items-center gap-3 rounded-[0.9rem] bg-black px-5 text-xs font-black uppercase text-white transition hover:translate-y-0.5 sm:text-sm"
              href="https://nutropx.com/"
            >
              Shop Now
              <span className="text-xl leading-none">{"\u203a"}</span>
            </a>
          )}
        </div>
        <div className="relative mt-20 h-24 w-24 shrink-0 rounded-[1rem] bg-white sm:mt-16 sm:h-32 sm:w-32">
          <Image src={image} alt={name} fill sizes="128px" className="object-contain p-3" />
        </div>
      </div>
    </>
  );

  if (productHref) {
    return (
      <a href={productHref} target="_blank" rel="noreferrer" className={cardClassName}>
        {body}
      </a>
    );
  }

  return (
    <article className={cardClassName}>
      {body}
    </article>
  );
}

function ProductPair() {
  return (
    <section className="px-6 py-4 sm:px-10 lg:px-16 xl:px-24">
      <div className="mx-auto grid max-w-[1640px] gap-4 lg:grid-cols-2">
        <ProductBanner
          focus="Attention"
          name="Xynaptic Drops"
          copy="Daily support for focus, memory & mental energy.*"
          price="$59.99"
          image="/assets/product-xynaptic-drops.png"
        />
        <ProductBanner
          focus="Memory"
          name="5-Brain"
          copy="Comprehensive all-in-one formula for sharper focus, enhanced memory.*"
          price="$69.99"
          image="/assets/product-5brain.png"
        />
      </div>
    </section>
  );
}

function ProductBanner({
  focus,
  name,
  copy,
  price,
  image,
}: {
  focus: string;
  name: string;
  copy: string;
  price: string;
  image: string;
}) {
  const productHref = getSupplementUrl(name);
  const cardClassName =
    "group flex min-h-[68px] items-center gap-2.5 rounded-[1rem] border-[3px] border-black bg-white px-3 py-1.5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_8px_0_#000000] sm:min-h-[76px] sm:px-3.5";
  const body = (
    <>
      <div className="relative h-10 w-10 shrink-0 rounded-[0.75rem] border border-black/10 bg-white sm:h-11 sm:w-11">
        <Image src={image} alt={name} fill sizes="44px" className="object-contain p-1" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[8px] font-black uppercase tracking-[0.14em] text-cyan">
          For your {focus}
        </p>
        <h3 className="mt-0.5 text-xs font-black leading-none text-black sm:text-sm">
          {name}
        </h3>
        <p className="mt-1 truncate text-[10px] font-medium leading-tight text-black sm:text-[11px]">
          {copy}
        </p>
      </div>
      {productHref ? (
        <span className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full bg-cyan px-2.5 text-[10px] font-black text-black transition group-hover:translate-x-0.5 sm:h-8 sm:px-3 sm:text-[11px]">
          {price}
          <span className="text-lg leading-none">{"\u203a"}</span>
        </span>
      ) : (
        <a
          className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full bg-cyan px-2.5 text-[10px] font-black text-black transition group-hover:translate-x-0.5 sm:h-8 sm:px-3 sm:text-[11px]"
          href="https://nutropx.com/"
        >
          {price}
          <span className="text-lg leading-none">{"\u203a"}</span>
        </a>
      )}
    </>
  );

  if (productHref) {
    return (
      <a href={productHref} target="_blank" rel="noreferrer" className={cardClassName}>
        {body}
      </a>
    );
  }

  return (
    <article className={cardClassName}>
      {body}
    </article>
  );
}

function Professor() {
  return (
    <section
      className="px-5 py-16 sm:px-8 lg:py-20"
      style={{
        background:
          "linear-gradient(105deg, #ecfbfa 0%, #f8fbfa 50%, #fff7f2 100%)",
      }}
    >
      <div className="mx-auto grid max-w-[1540px] items-center gap-12 lg:grid-cols-[0.78fr_1fr]">
        <div className="mx-auto grid min-h-[300px] w-full max-w-[540px] place-items-center rounded-[1.6rem] bg-[#eaf9fd] px-5 py-7 sm:min-h-[370px]">
          <div className="relative h-[240px] w-full max-w-[340px] rounded-[1.25rem] bg-white shadow-[10px_10px_0_#000000] sm:h-[310px]">
            <Image
              src="/assets/professor-5brain.png"
              alt="Professor 5-Brain"
              fill
              sizes="(min-width: 1024px) 340px, 90vw"
              className="object-contain p-6"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center lg:pr-10 xl:pr-16 2xl:pr-24">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border-[3px] border-black bg-white px-5 py-2 text-[10px] font-black uppercase tracking-[0.06em] text-orange-600 shadow-[0_5px_0_#000000]">
            <span className="text-xs leading-none">{"\u2723"}</span>
            AI-Powered Guidance
          </p>
          <h2 className="mt-7 whitespace-nowrap font-display text-lg font-medium leading-tight text-black sm:text-xl lg:text-[1.75rem] xl:text-[1.95rem]">
            Meet Professor 5-Brain
            <span className="align-super text-[0.42em]">{"\u2122"}</span>
          </h2>
          <p className="mt-4 max-w-2xl text-justify text-xs font-medium leading-5 text-black sm:text-sm lg:text-base lg:leading-6">
            Your AI wellness training coach. Summarizes your weekly training
            activity, identifies patterns in your sessions, and delivers
            tailored training suggestions, including supplement pairings for
            your routine.*
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Summarizes your weekly training activity",
              "Identifies your strongest and current focus areas",
              "Creates personalized training suggestions",
              "Pairs you with the right Nutropx support stack*",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-xs font-medium text-black sm:text-sm">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-[9px] font-black text-orange-500">
                  {"\u2713"}
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/brain-test"
            className="mt-8 inline-flex min-h-11 w-fit items-center gap-3 rounded-[0.9rem] bg-black px-5 text-xs font-black text-white shadow-[0_14px_28px_rgba(0,0,0,0.12)] transition hover:translate-y-0.5 sm:text-sm"
          >
            Try it now, Free
            <span className="text-lg leading-none">{"\u2192"}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Supplements() {
  return (
    <section
      id="supplements"
      className="scroll-mt-32 px-5 pt-14 pb-0 lg:pt-16"
      style={{
        background:
          "linear-gradient(105deg, #ecfbfa 0%, #f8fbfa 50%, #fff7f2 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-[1120px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-orange-600">Nutropx Supplements</p>
          <h2 className="mt-3 font-display text-2xl font-black leading-tight text-ink sm:text-3xl lg:text-[2.4rem]">Fuel your training</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm font-normal leading-6 text-muted sm:text-base">
            Pair daily training with Nutropx supplements formulated to support
            memory, focus, and cognitive wellness.*
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {supplements.map((product) => {
            const productHref = getSupplementUrl(product.name);
            const cardClassName =
              "flex min-h-[305px] flex-col items-center rounded-[1.4rem] bg-white px-5 py-4 text-center transition-shadow duration-200 hover:shadow-[10px_10px_0_#000000] sm:min-h-[335px] sm:px-7 lg:min-h-[365px] lg:px-8";
            const body = (
              <>
                <div className="relative h-24 w-full sm:h-28 lg:h-32">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-contain"
                  />
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="inline-flex min-h-9 items-center rounded-full bg-black px-5 text-xs font-black uppercase text-white">
                    Nutropx
                  </span>
                  <span className="inline-flex min-h-9 items-center rounded-full bg-orange-500 px-5 text-xs font-black uppercase text-black">
                    {product.tag}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-black leading-tight text-black sm:text-2xl">
                  {product.name}
                </h3>
                <p className="mx-auto mt-2 max-w-[390px] text-sm font-normal leading-6 text-black">
                  {product.copy}
                </p>
                <p className="mt-auto pt-4 text-2xl font-black leading-none text-black">
                  {product.price}
                </p>
                {productHref ? (
                  <span className="mt-4 inline-flex items-center gap-3 text-sm font-black text-black sm:text-base">
                    Shop {product.name}
                    <span className="text-xl leading-none">{"\u203a"}</span>
                  </span>
                ) : (
                  <a
                    href="https://nutropx.com/"
                    className="mt-4 inline-flex items-center gap-3 text-sm font-black text-black sm:text-base"
                  >
                    Shop {product.name}
                    <span className="text-xl leading-none">{"\u203a"}</span>
                  </a>
                )}
              </>
            );

            return productHref ? (
              <a
                key={product.name}
                href={productHref}
                target="_blank"
                rel="noreferrer"
                className={cardClassName}
              >
                {body}
              </a>
            ) : (
              <article key={product.name} className={cardClassName}>
                {body}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Stack() {
  return (
    <section
      className="px-5 pt-10 pb-14"
      style={{
        background:
          "linear-gradient(105deg, #ecfbfa 0%, #f8fbfa 50%, #fff7f2 100%)",
      }}
    >
      <div className="mx-auto grid w-full max-w-[1120px] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,320px)]">
        <article className="min-h-[180px] w-full rounded-[1.25rem] border-2 border-black bg-white px-6 py-3 shadow-[10px_10px_0_#000000] sm:px-8 lg:h-[377px] lg:min-h-0 lg:px-9">
          <p className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-orange-600">
            <span className="text-sm leading-none">{"\u2723"}</span>
            Why Nutropx
          </p>
          <h2 className="mt-2 max-w-3xl font-display text-lg font-black leading-tight text-black sm:text-xl lg:text-[1.45rem]">
            Formulated for cognitive support.
          </h2>

          <div className="mt-4 grid gap-x-12 gap-y-3 text-[11px] font-normal text-black sm:text-xs lg:grid-cols-2 lg:text-sm">
            {[
              "Cognizin Citicoline 250mg*",
              "Bacopa Monnieri 20% bacosides*",
              "Sharp-PS Green phosphatidylserine*",
              "Ginkgo Biloba 20:1 Extract*",
              "Sugar-free, non-GMO, vegan",
              "30-day satisfaction guarantee",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 border-orange-500 text-[8px] font-black text-orange-500">
                  {"\u2713"}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 text-center text-[11px] font-black text-black sm:grid-cols-2">
            <div className="grid justify-items-center gap-1">
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                <path d="m9 12 2 2 4-5" />
              </svg>
              30-day guarantee
            </div>
            <div className="grid justify-items-center gap-1">
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M10 17h4V5H2v12h3" />
                <path d="M14 9h4l4 4v4h-3" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
              Free shipping $100+
            </div>
          </div>
        </article>

        <article className="w-full overflow-hidden rounded-[1.25rem] border-2 border-black bg-white shadow-[10px_10px_0_#000000] lg:h-[377px]">
          <div className="flex items-center justify-between gap-3 bg-black px-4 py-3 text-white">
            <h3 className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.08em] sm:text-[10px]">
              <span className="text-cyan">{"\u2723"}</span>
              Your Daily Support Stack
            </h3>
            <span className="shrink-0 rounded-full bg-cyan px-3 py-1.5 text-[10px] font-black uppercase text-black">
              Save 20%
            </span>
          </div>

          <div className="space-y-3 px-4 py-4">
            {[
              ["Pre-training", "Xynaptic Drops", "Fast-acting liquid nootropic*", "/assets/product-xynaptic-drops.png"],
              ["With breakfast", "5-Brain", "Advanced nootropic formula*", "/assets/product-5brain.png"],
              ["Evening", "Xtra-Brain", "Advanced gut-brain probiotic*", "/assets/product-xtra-brain.png"],
            ].map(([time, name, copy, image]) => {
              const productHref = getSupplementUrl(name);
              const rowClassName = "flex items-center gap-3";
              const row = (
                <>
                  <div className="relative h-11 w-11 shrink-0 rounded-[0.8rem] border border-black bg-white shadow-[3px_3px_0_#000000]">
                    <Image src={image} alt={name} fill sizes="44px" className="object-contain p-1.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[8px] font-black uppercase tracking-[0.12em] text-orange-600">
                      {time}
                    </p>
                    <h4 className="mt-0.5 text-sm font-black leading-none text-black">
                      {name}
                    </h4>
                    <p className="mt-1 text-[10px] font-normal leading-4 text-black">
                      {copy}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-black text-orange-600">
                    {"\u2713"}
                  </span>
                </>
              );

              return productHref ? (
                <a
                  key={name}
                  href={productHref}
                  target="_blank"
                  rel="noreferrer"
                  className={rowClassName}
                >
                  {row}
                </a>
              ) : (
                <div key={name} className={rowClassName}>
                  {row}
                </div>
              );
            })}

            <a
              href={BRAIN_STACK_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-[0.85rem] bg-black px-5 text-xs font-black uppercase text-white"
            >
              Build My Stack
              <span className="text-xl leading-none">{"\u203a"}</span>
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section
      className="px-5 py-20 sm:px-8 lg:px-16 lg:py-24 xl:px-24"
      style={{
        background:
          "linear-gradient(105deg, #ecfbfa 0%, #f8fbfa 50%, #fff7f2 100%)",
      }}
    >
      <div className="mx-auto max-w-[1480px]">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#C95F1E]">
            How It Works
          </p>
          <h2 className="mt-4 font-display text-xl font-black leading-tight text-black sm:text-2xl lg:text-[1.9rem]">
            From zero to training in 5 minutes
          </h2>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {[
            [
              "Take the Brain Test",
              "90 seconds. Measures reaction speed, working memory, and focus. No account required.",
            ],
            [
              "Get your Cognitive Fitness Score",
              "Personal wellness benchmark across 5 cognitive training domains. Professor 5-Brain summarizes your results.",
            ],
            [
              "Level up daily",
              "Adaptive 3-minute quests target your weakest domain. Your score updates after every session.",
            ],
          ].map(([title, copy], index) => (
            <article
              key={title}
              className="min-h-[220px] rounded-[1.3rem] border-2 border-black bg-white px-7 py-6 shadow-[0_8px_0_#000000] sm:px-8"
            >
              <div className={`mb-6 grid h-12 w-12 place-items-center rounded-[0.8rem] bg-[#C95F1E] text-lg font-black leading-none ${index === 1 ? "text-white" : "text-black"}`}>
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="text-base font-black leading-tight text-black">
                {title}
              </h3>
              <p className="mt-3 text-xs font-normal leading-5 text-black">
                {copy}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section
      id="pricing"
      className="px-5 py-20 sm:px-8 lg:px-16 xl:px-24"
      style={{
        background:
          "linear-gradient(105deg, #ecfbfa 0%, #f8fbfa 50%, #fff7f2 100%)",
      }}
    >
      <div className="mx-auto max-w-[1260px]">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#C95F1E]">
            Simple Pricing
          </p>
          <h2 className="mt-4 font-display text-2xl font-black leading-tight text-black sm:text-3xl lg:text-[2.25rem]">
            Full access. Two simple plans.
          </h2>
          <p className="mt-4 text-sm font-normal text-muted sm:text-base">
            No tiers. No upsells. Cancel anytime.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-[980px] gap-6 lg:grid-cols-[478px_478px]">
          <PriceCard
            name="Annual"
            note="Best value. Pay once a year."
            price="$99.99"
            cadence="/year"
            detail="$8.33 /month, billed annually"
            highlighted
          />
          <PriceCard
            name="Monthly"
            note="Flexible, cancel anytime"
            price="$11.99"
            cadence="/month"
            detail="Billed month-to-month"
          />
        </div>

        <div className="mx-auto mt-12 grid max-w-[680px] gap-10 px-10 text-center text-xs font-normal text-muted sm:grid-cols-3 lg:px-16">
          {[
            ["shield", "Secure checkout", "via Stripe"],
            ["check", "Cancel anytime", "in 1 click"],
            ["sparkle", "7-day free trial", "cancel before day 7, no charge"],
          ].map(([icon, title, copy]) => (
            <div key={title} className="grid justify-items-center gap-3">
              <PricingTrustIcon icon={icon} />
              <p>
                <span className="block text-xs font-normal leading-4 text-[#656565]">
                  {title}
                </span>
                <span className="mt-1 block text-[10px] font-normal leading-4 text-[#8a8a8a]">
                  {copy}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingTrustIcon({ icon }: { icon: string }) {
  const commonProps = {
    className: "h-4 w-4 text-[#C95F1E]",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2.1,
    viewBox: "0 0 24 24",
  };

  if (icon === "shield") {
    return (
      <svg aria-hidden="true" {...commonProps}>
        <path d="M12 3 19 6v5.5c0 4.2-2.5 7.5-7 9.5-4.5-2-7-5.3-7-9.5V6l7-3Z" />
        <path d="m9.5 12 1.7 1.7 3.7-4.2" />
      </svg>
    );
  }

  if (icon === "check") {
    return (
      <svg aria-hidden="true" {...commonProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.7 12.2 2.1 2.1 4.5-5" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" {...commonProps}>
      <path d="M12 3.5 14 9l5.5 2-5.5 2-2 5.5-2-5.5-5.5-2 5.5-2 2-5.5Z" />
      <path d="M19 15.5 20 18l2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5Z" />
      <path d="M4.5 4.5 5.3 6.7 7.5 7.5 5.3 8.3 4.5 10.5 3.7 8.3 1.5 7.5 3.7 6.7 4.5 4.5Z" />
    </svg>
  );
}

function PriceCard({
  name,
  note,
  price,
  cadence,
  detail,
  highlighted: planHighlighted,
}: {
  name: string;
  note: string;
  price: string;
  cadence: string;
  detail: string;
  highlighted?: boolean;
}) {
  const highlighted = planHighlighted ?? name === "Annual";

  return (
    <article
      className={`flex min-h-[552px] flex-col rounded-[1.3rem] border-2 border-black px-6 py-6 shadow-[10px_10px_0_#000000] sm:px-7 lg:h-[552px] lg:w-[478px] lg:min-h-0 ${
        highlighted ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.12em] text-[#C95F1E]">
            {name}
          </h3>
          <p className={`mt-2 text-xs font-semibold sm:text-sm ${highlighted ? "text-white/60" : "text-muted"}`}>
            {note}
          </p>
        </div>
        {highlighted ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2 text-xs font-black uppercase text-black">
            <span>{"\u2723"}</span>
            Save 31%
          </span>
        ) : null}
      </div>

      <div className="mt-7 flex items-end gap-2">
        <span className="font-display text-4xl font-black leading-none sm:text-5xl">
          {price}
        </span>
        <span className={`pb-1 text-sm font-black ${highlighted ? "text-white/60" : "text-muted"}`}>
          {cadence}
        </span>
      </div>
      <p className={`mt-3 text-sm font-semibold ${highlighted ? "text-white/50" : "text-muted"}`}>
        {detail}
      </p>

      <ul className="mt-7 space-y-2.5">
        {planFeatures.map((feature) => (
          <li
            key={feature}
            className={`flex items-center gap-3 text-xs font-semibold ${highlighted ? "text-white/75" : "text-muted"}`}
          >
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-orange-500 text-[10px] font-black text-orange-500">
              {"\u2713"}
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href="/brain-test"
        className={`mt-auto inline-flex min-h-11 w-full items-center justify-center gap-3 rounded-[0.9rem] px-6 text-xs font-black ${
          highlighted ? "bg-orange-500 text-black" : "bg-black text-white"
        }`}
      >
        Start 7-day free trial
        <span className="text-2xl leading-none">{"\u203a"}</span>
      </Link>
      <p className={`mt-4 text-center text-[11px] font-normal ${highlighted ? "text-white/35" : "text-muted/60"}`}>
        7-day free trial · card required · cancel before day 7, no charge
      </p>
    </article>
  );
}

function FinalCta() {
  return (
    <section>
      <div className="bg-black px-5 py-20 text-center text-white sm:px-8 lg:py-24">
        <h2 className="mx-auto max-w-5xl font-display text-xl font-black leading-tight sm:text-2xl lg:text-[2rem]">
          Ready to unlock your cognitive potential?
        </h2>
        <p className="mt-5 text-sm font-semibold text-white/55 sm:text-base">
          Join the movement.
        </p>
        <Link
          href="/brain-test"
          className="mt-9 inline-flex min-h-12 items-center justify-center gap-3 rounded-[0.85rem] bg-orange-500 px-8 text-xs font-black uppercase tracking-[0.02em] text-black transition hover:bg-orange-400 sm:min-w-[360px] sm:text-sm"
        >
          Take the Brain Test. Free.
          <span className="text-xl leading-none">{"\u2192"}</span>
        </Link>
      </div>
      <div
        className="px-5 py-10 sm:px-8 lg:px-16"
        style={{
          background:
            "linear-gradient(105deg, #ecfbfa 0%, #f8fbfa 50%, #fff7f2 100%)",
        }}
      >
        <p className="mx-auto max-w-[800px] rounded-[1rem] border border-black/10 bg-white/70 px-6 py-5 text-xs font-normal leading-5 text-muted shadow-[0_1px_0_rgba(0,0,0,0.04)]">
          *These statements have not been evaluated by the Food and Drug
          Administration. This product is not intended to diagnose, treat,
          cure, or prevent any disease.
        </p>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-[#121416] px-5 py-16 text-white sm:px-8 lg:px-16 xl:px-24">
      <div className="mx-auto max-w-[1540px]">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.45fr]">
          <div>
            <Image
              src="/assets/nutropx-lab-logo-white.png"
              alt="Nutropx LAB"
              width={220}
              height={56}
              className="h-12 w-auto"
            />
            <address className="mt-10 not-italic text-xs font-normal leading-5 text-white/35">
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

          <nav aria-label="Platform footer links">
            <h3 className="text-[10px] font-black uppercase tracking-[0.16em] text-white/28">
              Platform
            </h3>
            <div className="mt-6 grid gap-4 text-sm font-medium text-white/48">
              <Link href="/how-it-works">How It Works</Link>
              <a href="mailto:support@nutropx.com">Contact</a>
            </div>
          </nav>

          <nav aria-label="Account footer links">
            <h3 className="text-[10px] font-black uppercase tracking-[0.16em] text-white/28">
              Account
            </h3>
            <div className="mt-6 grid gap-4 text-sm font-medium text-white/48">
              <Link href="/auth/login">Sign In</Link>
              <Link href="/auth/signup">Sign Up</Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>
          </nav>

          <nav aria-label="Policies footer links">
            <h3 className="text-[10px] font-black uppercase tracking-[0.16em] text-white/28">
              Policies
            </h3>
            <div className="mt-6 grid gap-4 text-sm font-medium leading-6 text-white/48">
              <a
                href="https://nutropx.com/terms-and-agreements"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
              <a
                href="https://nutropx.com/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              <a
                href="https://nutropx.com/shipping-and-handling-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Shipping Policy
              </a>
              <a
                href="https://nutropx.com/medical-disclaimer"
                target="_blank"
                rel="noopener noreferrer"
              >
                Medical Disclaimer
              </a>
              <Link href="/privacy/choices">
                Do Not Sell or Share My Personal Information
              </Link>
            </div>
          </nav>
        </div>

        <div className="mt-16 border-t border-white/10 pt-10 text-xs font-normal leading-5 text-white/28">
          <p>
            Lab is designed for general wellness, cognitive fitness, and
            educational purposes only. It is not a medical service and does not
            provide medical advice, diagnosis, or treatment. Supplement
            statements have not been evaluated by the Food and Drug
            Administration. Nutropx supplements are not intended to diagnose,
            treat, cure, or prevent any disease.
          </p>
          <p className="mt-7">
            Sharp-PS&reg; is a registered trademark of Enzymotec Ltd. Chocamine&reg;
            is a registered trademark of RFI Ingredients. Meriva&reg; is a
            registered trademark of Indena S.p.A. Cognizin&reg; is a registered
            trademark of Kyowa Hakko Bio Co., Ltd. All other trademarks are the
            property of their respective owners.
          </p>
          <p className="mt-7">
            Nutropx is committed to digital inclusion. We are actively working
            to ensure our website and Lab platform meet WCAG 2.1 Level AA
            accessibility standards. If you encounter any accessibility
            barriers, or if you need any content provided in an alternative
            format, please contact us at support@nutropx.com and we will
            respond promptly to provide a manual alternative or address the
            issue. We welcome feedback on accessibility and use it to improve
            our platform over time.
          </p>
          <p className="mt-7">&copy; 2026 Nutropx LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
