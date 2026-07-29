import Link from "next/link";

type MobileNavLabel = "Home" | "Lab" | "Brain Test" | "My Brain" | "Profile";
type MobileIconName = "home" | "lab" | "brain" | "trophy" | "profile";

const mobileNavItems: Array<[MobileIconName, MobileNavLabel, string]> = [
  ["home", "Home", "/dashboard"],
  ["lab", "Lab", "/lab"],
  ["brain", "Brain Test", "/brain-test"],
  ["trophy", "My Brain", "/my-brain"],
  ["profile", "Profile", "/profile"],
];

export default function MobileBottomNav({ activeLabel }: { activeLabel: MobileNavLabel }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.12)] lg:hidden">
      <div className="mx-auto grid max-w-[480px] grid-cols-5 gap-0.5 px-2 pb-2 pt-2">
        {mobileNavItems.map(([icon, label, href]) => {
          const active = label === activeLabel;
          return (
            <Link
              key={label}
              href={href}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1 text-[9px] font-semibold ${
                active ? "text-cyan" : "text-[#555]"
              }`}
            >
              <MobileIcon name={icon} className="h-[20px] w-[20px]" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function MobileIcon({ name, className }: { name: MobileIconName; className: string }) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
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
        <path d="M10 3v6l-5 8a3 3 0 0 0 2.55 4.5h8.9A3 3 0 0 0 19 17l-5-8V3" />
        <path d="M8 14h8" />
      </svg>
    );
  }

  if (name === "brain") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M9 4.5a3 3 0 0 0-3 3v.4a3.7 3.7 0 0 0 0 7.2v.4a3 3 0 0 0 6 0v-8a3 3 0 0 0-3-3Z" />
        <path d="M15 4.5a3 3 0 0 1 3 3v.4a3.7 3.7 0 0 1 0 7.2v.4a3 3 0 0 1-6 0v-8a3 3 0 0 1 3-3Z" />
      </svg>
    );
  }

  if (name === "trophy") {
    return (
      <svg aria-hidden="true" {...common}>
        <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
        <path d="M8 6H4a4 4 0 0 0 4 4" />
        <path d="M16 6h4a4 4 0 0 1-4 4" />
        <path d="M12 12v4" />
        <path d="M9 20h6" />
        <path d="M10 16h4v4h-4z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" {...common}>
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}
