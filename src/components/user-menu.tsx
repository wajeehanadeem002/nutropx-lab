import Image from "next/image";
import Link from "next/link";
import { signOutAction } from "@/app/auth/actions";

type UserMenuProps = {
  displayName: string;
  email?: string;
};

export default function UserMenu({ displayName, email }: UserMenuProps) {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan [&::-webkit-details-marker]:hidden">
        <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-black/10 bg-white">
          <Image
            src="/assets/professor-5brain.png"
            alt=""
            width={44}
            height={44}
            className="h-9 w-9 object-contain"
          />
        </div>
        <span className="hidden max-w-[130px] truncate text-xs font-semibold text-black sm:inline">
          {displayName}
        </span>
      </summary>

      <div className="absolute right-0 top-[calc(100%+16px)] z-50 w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[1.1rem] border-2 border-black bg-white text-black shadow-[10px_10px_0_#000000]">
        <div className="px-5 py-4">
          <p className="truncate text-lg font-semibold leading-tight">{displayName}</p>
          {email ? <p className="mt-1 truncate text-sm font-medium text-[#4e4e4e]">{email}</p> : null}
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex h-8 items-center gap-1.5 rounded-full border-2 border-black bg-white px-3 text-xs font-semibold shadow-[0_3px_0_#000000]">
              <MenuIcon name="bolt" className="h-4 w-4 text-cyan" />
              Lv 1
            </span>
            <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#f1f1f1] px-3 text-xs font-semibold text-black">
              <MenuIcon name="sparkle" className="h-4 w-4 text-black" />
              Free
            </span>
          </div>
        </div>

        <div className="border-t border-black/15 px-3 py-4">
          <Link
            href="/profile"
            className="flex h-11 items-center gap-4 rounded-xl px-3 text-base font-semibold text-black hover:bg-black/[0.04]"
          >
            <MenuIcon name="profile" className="h-5 w-5 text-black" />
            Player profile
          </Link>
          <Link
            href="/profile?tab=billing"
            className="mt-3 flex h-14 items-center justify-between rounded-2xl bg-black px-5 text-base font-semibold text-white"
          >
            <span className="flex items-center gap-4">
              <MenuIcon name="crown" className="h-5 w-5 text-cyan" />
              Unlock Lab Pro
            </span>
            <span aria-hidden="true">&gt;</span>
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="mt-4 flex h-11 w-full items-center gap-4 rounded-xl px-3 text-left text-base font-semibold text-black hover:bg-black/[0.04]"
            >
              <MenuIcon name="logout" className="h-5 w-5 text-black" />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </details>
  );
}

function MenuIcon({
  name,
  className,
}: {
  name: "bolt" | "sparkle" | "profile" | "crown" | "logout";
  className: string;
}) {
  if (name === "bolt") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M13 2 4 14h7l-1 8 10-13h-7l0-7Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "sparkle") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3 9.7 9.7 3 12l6.7 2.3L12 21l2.3-6.7L21 12l-6.7-2.3L12 3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "profile") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 21a7.5 7.5 0 0 1 15 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "crown") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="m3 8 5 4 4-7 4 7 5-4-2 11H5L3 8Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 8V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3M9 12h11m0 0-3.5-3.5M20 12l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
