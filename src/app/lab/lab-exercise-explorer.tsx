"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type FilterName =
  | "All"
  | "Core"
  | "3D Exercises"
  | "Memory"
  | "Attention"
  | "Speed"
  | "Flexibility"
  | "Logic";

type IconName =
  | "book"
  | "brain"
  | "bolt"
  | "play"
  | "lock"
  | "eye"
  | "target"
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
  | "flame";

type CategoryCard = {
  title: Extract<FilterName, "Memory" | "Attention" | "Speed" | "Flexibility" | "Logic">;
  copy: string;
  color: string;
  text: string;
  icon: IconName;
  xp: string;
};

type ProductFeature = {
  eyebrow: string;
  title: string;
  copy: string;
  price: string;
  image?: string;
  images?: string[];
  accent?: "cyan" | "orange";
  composite?: boolean;
  href?: string;
};

const categories: CategoryCard[] = [
  {
    title: "Memory",
    copy: "Strengthen recall and...",
    color: "#2d95ee",
    text: "text-white",
    icon: "book",
    xp: "130",
  },
  {
    title: "Attention",
    copy: "Train sustained attention and...",
    color: "#ef3030",
    text: "text-white",
    icon: "target",
    xp: "130",
  },
  {
    title: "Speed",
    copy: "Speed up reaction and...",
    color: "#ffd11a",
    text: "text-black",
    icon: "bolt",
    xp: "125",
  },
  {
    title: "Flexibility",
    copy: "Plan, switch, and prioritize...",
    color: "#12bfa8",
    text: "text-white",
    icon: "brain",
    xp: "125",
  },
  {
    title: "Logic",
    copy: "Reason, calculate, and...",
    color: "#9f42d6",
    text: "text-white",
    icon: "shape",
    xp: "165",
  },
];

const productByFilter: Record<
  Extract<FilterName, "Memory" | "Attention" | "Speed" | "Flexibility" | "Logic">,
  ProductFeature
> = {
  Attention: {
    eyebrow: "For attention",
    title: "Xynaptic Drops",
    copy: "Daily support for focus, memory & mental energy.*",
    price: "$59.99",
    image: "/assets/product-xynaptic-drops.png",
    href: "https://nutropx.com/product/xynaptic-drops",
  },
  Memory: {
    eyebrow: "For memory",
    title: "5-Brain",
    copy: "Comprehensive all-in-one formula for sharper focus, enhanced memory, and sustained me...",
    price: "$69.99",
    image: "/assets/product-5brain.png",
    href: "https://nutropx.com/product/5-brain",
  },
  Speed: {
    eyebrow: "For speed",
    title: "Xynaptic Drops",
    copy: "Daily support for focus, memory & mental energy.*",
    price: "$59.99",
    image: "/assets/product-xynaptic-drops.png",
    href: "https://nutropx.com/product/xynaptic-drops",
  },
  Flexibility: {
    eyebrow: "For flexibility",
    title: "Brain Stack",
    copy: "360-degree synergistic support for peak focus, mood, memory, energy, and gut-brain harmony.*",
    price: "$152.97",
    image: "/assets/product-brain-stack.png",
    accent: "orange",
    composite: true,
    href: "https://nutropx.com/product/xynergistic-brain-stack",
  },
  Logic: {
    eyebrow: "For logic",
    title: "5-Brain",
    copy: "Comprehensive all-in-one formula for clear thinking and sustained mental alertness.*",
    price: "$69.99",
    image: "/assets/product-5brain.png",
    href: "https://nutropx.com/product/5-brain",
  },
};

type Exercise = {
  title: string;
  description: string;
  icon: IconName;
  categories: FilterName[];
  pro?: boolean;
  featured?: boolean;
};

const filters: FilterName[] = [
  "All",
  "Core",
  "3D Exercises",
  "Memory",
  "Attention",
  "Speed",
  "Flexibility",
  "Logic",
];

const exercises: Exercise[] = [
  {
    title: "Core Vortex Tracer",
    description: "Track highlighted shapes as they move through 3D space, then identify the one...",
    icon: "eye",
    categories: ["Attention"],
    pro: true,
  },
  {
    title: "Velocity Burst",
    description: "Tap only the shapes matching the rule before they vanish.",
    icon: "bolt",
    categories: ["Attention"],
    pro: true,
  },
  {
    title: "Signal Isolation",
    description: "Respond only to the target signal. Suppress everything else.",
    icon: "sigma",
    categories: ["Attention"],
    pro: true,
  },
  {
    title: "Phantom Projection",
    description: "Keep your eyes on the center. Tap the spot where the flash appears in your...",
    icon: "eye",
    categories: ["Attention"],
    pro: true,
  },
  {
    title: "Vector Distraction",
    description: "Respond to the center arrow only - ignore the ones around it.",
    icon: "arrow",
    categories: ["Attention"],
    pro: true,
  },
  {
    title: "Schulte Table Rush",
    description: "Tap the grid cells in ascending order - 1, 2, 3... - as fast as you can.",
    icon: "grid",
    categories: ["Speed"],
    pro: true,
  },
  {
    title: "Step-Math Progressions",
    description: "Solve arithmetic problems and tap the correct answer - score as many as yo...",
    icon: "sigma",
    categories: ["Speed"],
    pro: true,
  },
  {
    title: "Shape Shifter Speed",
    description: "A shape changes - spot what changed (rotation, scale, reflection, or color)...",
    icon: "shape",
    categories: ["Speed"],
    pro: true,
  },
  {
    title: "Grid Fusion Math",
    description: "2048 with a twist - merge tiles that evaluate to the same value, like 12 and...",
    icon: "grid",
    categories: ["Speed"],
    pro: true,
  },
  {
    title: "Rapid Grid Match",
    description: "A rule appears at the top - tap every matching number as items stream into...",
    icon: "squares",
    categories: ["Speed"],
    pro: true,
  },
  {
    title: "Abstract Card Match",
    description: "Flip pairs of cards and remember where each abstract pattern is....",
    icon: "layers",
    categories: ["Memory"],
    featured: true,
  },
  {
    title: "Cryptographic Decoy",
    description: "Memorize a code, hold it through rapid interference, then judge: Same or...",
    icon: "lock",
    categories: ["Memory"],
    pro: true,
  },
  {
    title: "Sound Match Spectrum",
    description: "Watch the colored tone sequence, then tap the pads in order. Sequences grow...",
    icon: "music",
    categories: ["Memory"],
    pro: true,
  },
  {
    title: "Sonic Memory Match",
    description: "Find the two tiles that play the same sound. Tap a tile to hear it, then find its...",
    icon: "waves",
    categories: ["Memory"],
    pro: true,
  },
  {
    title: "Hyper-Cube N-Back",
    description: "Watch the cube. A node will light up - remember which one appeared N step...",
    icon: "cube",
    categories: ["Memory"],
    pro: true,
  },
  {
    title: "Spectrum Sync",
    description: "The rule alternates between ink color and word meaning - stay sharp when i...",
    icon: "palette",
    categories: ["Flexibility"],
    pro: true,
  },
  {
    title: "Layout Collapse",
    description: "Study a grid pattern for 2 seconds, then rebuild it from memory before the...",
    icon: "squares",
    categories: ["Flexibility"],
    pro: true,
  },
  {
    title: "Origami Shadow",
    description: "Watch a 3D shape fold under a light source, then choose the shadow that...",
    icon: "shape",
    categories: ["Flexibility"],
    pro: true,
  },
  {
    title: "Hexa-Word Churn",
    description: "A hex wheel spins between word categories - type or pick a valid word...",
    icon: "hexagon",
    categories: ["Flexibility"],
    pro: true,
  },
  {
    title: "Chain Shift",
    description: "Build a word chain from a seed - each link must follow letter, category, or...",
    icon: "chain",
    categories: ["Flexibility"],
    pro: true,
  },
  {
    title: "Pattern Sequence",
    description: "A sequence of shapes follows a hidden rule - find it, then pick what comes...",
    icon: "diamonds",
    categories: ["Logic"],
    pro: true,
  },
  {
    title: "Logic Grid Deduction",
    description: "Use the clues to deduce who has what - fill in the grid until every row checks...",
    icon: "checklist",
    categories: ["Logic"],
    pro: true,
  },
  {
    title: "Advanced Sudoku Matrix",
    description: "Classic Sudoku, plus Killer, Thermo, and Arrow variants that unlock as you climb...",
    icon: "cubes",
    categories: ["Logic"],
    pro: true,
  },
  {
    title: "Nonogram Logic Art",
    description: "Row and column clues tell you how many cells to fill - deduce the hidden picture.",
    icon: "hash",
    categories: ["Logic"],
    pro: true,
  },
  {
    title: "Spatial Gambit",
    description: "Play a full game of chess in 3D - against the adaptive AI or pass-and-pla...",
    icon: "chess",
    categories: ["Logic"],
    pro: true,
  },
];

export default function LabExerciseExplorer() {
  const [activeFilter, setActiveFilter] = useState<FilterName>("All");
  const activeProductFilter = categories.some((category) => category.title === activeFilter)
    ? (activeFilter as CategoryCard["title"])
    : "Attention";
  const activeProduct = productByFilter[activeProductFilter];
  const productAccent = activeProduct.accent === "orange" ? "orange" : "cyan";
  const productHref = activeProduct.href ?? "/#supplements";
  const externalProductHref = productHref.startsWith("http");
  const visibleExercises = useMemo(
    () =>
      activeFilter === "All" || activeFilter === "Core"
        ? exercises
        : exercises.filter((exercise) => exercise.categories.includes(activeFilter)),
    [activeFilter],
  );

  return (
    <>
      <section className="mx-auto mt-8 max-w-[670px]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black">
          Training Categories
        </p>
        <h2 className="mt-1 text-xl font-semibold leading-tight">Select a domain to target</h2>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:justify-center sm:gap-4">
          {categories.map((category) => {
            const active = activeFilter === category.title;
            return (
              <button
                key={category.title}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveFilter(category.title)}
                className={`flex h-[170px] w-full flex-col rounded-[1rem] px-4 py-5 text-left shadow-[9px_9px_0_#000] transition sm:w-[130px] ${
                  category.text
                } ${active ? "ring-2 ring-white ring-offset-2 ring-offset-cyan" : ""}`}
                style={{ backgroundColor: category.color }}
              >
                <div className="flex items-start gap-3">
                  <span className="grid h-[48px] w-[28px] shrink-0 place-items-center rounded-full bg-white/20">
                    <AppIcon name={category.icon} className="h-6 w-6" />
                  </span>
                  <span className="text-[8px] font-semibold uppercase leading-[11px] tracking-[0.08em]">
                    Training
                    <br />
                    Category
                  </span>
                </div>
                <h3 className="ml-[40px] -mt-3 text-[15px] font-semibold leading-tight">
                  {category.title}
                </h3>
                <p className="mt-6 line-clamp-2 text-[10px] font-medium leading-[14px] opacity-90">
                  {category.copy}
                </p>
                <div className="mt-auto flex items-end justify-between text-[9px] font-semibold leading-[12px]">
                  <span className="flex items-end gap-2">
                    <AppIcon name="play" className="mb-1 h-3.5 w-3.5" />
                    <span>
                      5
                      <br />
                      exercises
                    </span>
                  </span>
                  <span className="flex items-end gap-1.5">
                    <AppIcon name="bolt" className="mb-1 h-3.5 w-3.5" />
                    <span>
                      {category.xp}
                      <br />
                      XP
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <Link
        href={productHref}
        target={externalProductHref ? "_blank" : undefined}
        rel={externalProductHref ? "noreferrer" : undefined}
        className="mx-auto mt-8 flex max-w-[670px] items-center gap-4 rounded-[1rem] border-[2px] border-black bg-white px-4 py-3 shadow-[0_6px_0_#000]"
      >
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[0.8rem] border border-black/10 bg-white">
          <ProductThumbnail product={activeProduct} />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${
              productAccent === "orange" ? "text-orange-500" : "text-cyan"
            }`}
          >
            {activeProduct.eyebrow}
          </p>
          <h2 className="mt-1 text-base font-semibold">{activeProduct.title}</h2>
          <p className="truncate text-xs font-medium text-black">
            {activeProduct.copy}
          </p>
        </div>
        <span
          className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-[0.8rem] px-4 text-xs font-semibold text-black ${
            productAccent === "orange" ? "bg-orange-500 text-white" : "bg-cyan"
          }`}
        >
          {activeProduct.price} {"\u203A"}
        </span>
      </Link>

      <section className="mx-auto mt-10 max-w-[670px]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black">
          Staff Picks
        </p>
        <h2 className="mt-1 flex items-center gap-2 text-xl font-semibold">
          <AppIcon name="flame" className="h-5 w-5 text-orange-500" />
          Recommended Exercises
        </h2>
        <div className="mt-8 flex h-[56px] items-center justify-between rounded-[1rem] border-[2px] border-black bg-white px-3 shadow-[0_7px_0_#000]">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`h-10 rounded-[0.8rem] px-3 text-[11px] font-semibold ${
                filter === activeFilter ? "bg-black text-white" : "text-black"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-[670px]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black">
          {activeFilter === "All" ? "All" : activeFilter} Exercises - {visibleExercises.length}
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {visibleExercises.map((exercise) => (
            <ExerciseCard key={exercise.title} {...exercise} />
          ))}
        </div>
      </section>
    </>
  );
}

function ProductThumbnail({ product }: { product: ProductFeature }) {
  if (product.images?.length) {
    return (
      <div className="flex h-14 w-14 items-end justify-center gap-0.5">
        {product.images.map((image, index) => (
          <Image
            key={image}
            src={image}
            alt={`${product.title} item ${index + 1}`}
            width={28}
            height={44}
            className={`w-auto object-contain ${
              index === 1 ? "h-12" : "h-10"
            } ${index === 0 ? "-mr-1" : index === 2 ? "-ml-1" : ""}`}
          />
        ))}
      </div>
    );
  }

  if (!product.image) return null;

  return (
    <Image
      src={product.image}
      alt={product.title}
      width={product.composite ? 72 : 42}
      height={58}
      className={
        product.composite
          ? "h-14 w-14 rounded-[0.55rem] object-contain"
          : "h-14 w-auto object-contain"
      }
    />
  );
}

function ExerciseCard({
  title,
  description,
  icon,
  pro,
  featured,
}: Exercise) {
  if (title === "Hyper-Cube N-Back") {
    return (
      <Link
        href="/profile?tab=billing"
        className="flex h-[130px] w-full gap-4 rounded-[1rem] border-[2px] border-[#696e6c] bg-white/72 px-4 py-4 shadow-[0_6px_0_#696e6c] sm:w-[330px]"
      >
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[0.9rem] bg-[#a3a7a5] text-white shadow-[5px_5px_0_#696e6c]">
          <AppIcon name={icon} className="h-7 w-7" />
        </span>
        <div className="min-w-0">
          <div className="flex items-start gap-2">
            <h3 className="truncate text-base font-semibold text-[#666b69]">{title}</h3>
            {pro ? <ProBadge /> : null}
          </div>
          <p className="mt-2 line-clamp-2 text-xs font-medium leading-4 text-[#666b69]">
            {description}
          </p>
          <span className="mt-2 inline-block text-xs font-semibold text-[#5aaebe]">
            Upgrade to unlock
          </span>
        </div>
      </Link>
    );
  }

  if (featured) {
    return (
      <article className="flex h-[130px] w-full gap-4 rounded-[1rem] border-[2px] border-black bg-white px-4 py-4 shadow-[0_6px_0_#000] sm:w-[330px]">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[0.9rem] bg-[#2d95ee] text-white shadow-[5px_5px_0_#000]">
          <AppIcon name={icon} className="h-7 w-7" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-black">{title}</h3>
          <p className="mt-1 line-clamp-2 text-xs font-medium leading-4 text-black">
            {description}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs font-medium text-black">
            <span className="font-semibold text-[#2d95ee]">Memory</span>
            <span>2 min</span>
            <span className="text-cyan">2 stars</span>
          </div>
          <p className="mt-2 text-xs font-semibold text-cyan">+25</p>
        </div>
        <Link
          href="/training/abstract-card-match"
          className="mt-auto grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/5 text-black"
          aria-label="Start Abstract Card Match"
        >
          <AppIcon name="play" className="h-5 w-5" />
        </Link>
      </article>
    );
  }

  return (
    <Link
      href="/profile?tab=billing"
      className="flex h-[130px] w-full gap-4 rounded-[1rem] border-[2px] border-[#696e6c] bg-white/72 px-4 py-4 shadow-[0_6px_0_#696e6c] sm:w-[330px]"
    >
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[0.9rem] bg-[#a3a7a5] text-white shadow-[5px_5px_0_#696e6c]">
        <AppIcon name={icon} className="h-7 w-7" />
      </span>
      <div className="min-w-0">
        <div className="flex items-start gap-2">
          <h3 className="truncate text-base font-semibold text-[#666b69]">{title}</h3>
          {pro ? <ProBadge /> : null}
        </div>
        <p className="mt-2 line-clamp-2 text-xs font-medium leading-4 text-[#666b69]">
          {description}
        </p>
        <span className="mt-2 inline-block text-xs font-semibold text-[#5aaebe]">
          Upgrade to unlock
        </span>
      </div>
    </Link>
  );
}

function ProBadge() {
  return (
    <span className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full bg-[#666b69] px-3 text-[10px] font-semibold uppercase text-white">
      <AppIcon name="lock" className="h-3.5 w-3.5" />
      Pro
    </span>
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

  if (name === "grid" || name === "squares") {
    return (
      <svg aria-hidden="true" {...common}>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
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

  if (name === "book") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5A2.5 2.5 0 0 1 20 21V5.5Z" />
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

  return (
    <svg aria-hidden="true" {...common}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}
