import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";

type CheckoutPlan = "annual" | "monthly";

type CheckoutPageProps = {
  searchParams?: Promise<{ plan?: string | string[] }>;
};

const checkoutCopy = {
  monthly: {
    price: "$11.99",
    unit: "month",
    pkr: "PKR 2,887.05",
    line: "Then PKR 2,887.05 per month starting July 27, 2026",
    after: "PKR 2,887.05 / month after",
  },
  annual: {
    price: "$99.99",
    unit: "year",
    pkr: "PKR 28,896.51",
    line: "Then PKR 28,896.51 per year starting July 27, 2026",
    after: "PKR 28,896.51 / year after",
  },
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login?message=Please sign in to start checkout.");
  }

  const params = await searchParams;
  const requestedPlan = Array.isArray(params?.plan) ? params.plan[0] : params?.plan;
  const plan = getCheckoutPlan(requestedPlan);
  const copy = checkoutCopy[plan];
  const email = user.email ?? "wajeehanadeem200@gmail.com";

  return (
    <main className="min-h-screen bg-white text-[#303030] lg:grid lg:grid-cols-2">
      <section className="bg-[#d8d8d8] px-7 py-10 lg:min-h-screen lg:px-[110px] lg:py-14">
        <div className="mx-auto max-w-[430px]">
          <div className="flex items-center gap-4">
            <Link
              href={`/profile?tab=billing&plan=${plan}`}
              className="text-2xl leading-none text-[#6d6d6d]"
              aria-label="Back to billing"
            >
              &lt;
            </Link>
            <Image
              src="/assets/nutropx-lab-logo.png"
              alt="Nutropx"
              width={105}
              height={32}
              className="h-6 w-auto grayscale"
            />
          </div>

          <div className="mt-12">
            <p className="text-sm font-semibold text-[#666]">Try Nutropx Brainlab Subscription</p>
            <h1 className="mt-2 text-[2.7rem] font-semibold leading-none text-[#333]">
              7 days free
            </h1>
            <p className="mt-2 text-sm font-semibold text-[#666]">{copy.line}</p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="h-[46px] rounded-[0.45rem] border border-[#222] bg-white text-sm font-semibold text-[#222]"
            >
              PKR
            </button>
            <button
              type="button"
              className="h-[46px] rounded-[0.45rem] bg-white text-sm font-semibold text-[#222]"
            >
              USD
            </button>
          </div>
          <p className="mt-4 text-xs font-medium text-[#666]">
            1 USD = 288.9940 PKR. Charges will vary based on exchange rates.
          </p>

          <div className="mt-14 flex items-start justify-between gap-5 text-sm">
            <p className="font-semibold text-[#333]">Nutropx Brainlab Subscription</p>
            <div className="text-right">
              <p className="font-semibold text-[#333]">7 days free</p>
              <p className="text-xs font-medium text-[#666]">{copy.after}</p>
            </div>
          </div>

          <div className="mt-6 border-t border-[#bfbfbf] pt-5">
            <div className="flex justify-between text-sm font-semibold">
              <span>Subtotal</span>
              <span>{copy.pkr}</span>
            </div>
            <button
              type="button"
              className="mt-5 h-[44px] rounded-[0.8rem] bg-[#cfcfcf] px-4 text-sm font-semibold text-[#333]"
            >
              Add promotion code
            </button>
          </div>

          <div className="mt-6 border-t border-[#bfbfbf] pt-5 text-sm">
            <div className="flex justify-between">
              <span>Total after trial</span>
              <span>{copy.pkr}</span>
            </div>
            <div className="mt-2 flex justify-between font-semibold">
              <span>Total due today</span>
              <span>PKR 0.00</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-7 py-10 lg:min-h-screen lg:px-[72px] lg:py-14">
        <div className="mx-auto max-w-[430px]">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="h-[58px] rounded-[0.45rem] bg-black text-xl font-semibold text-white"
            >
              Apple Pay
            </button>
            <button
              type="button"
              className="h-[58px] rounded-[0.45rem] bg-[#00d66f] text-xl font-semibold text-black"
            >
              link
            </button>
          </div>

          <div className="my-8 flex items-center gap-3 text-xs font-medium text-[#777]">
            <span className="h-px flex-1 bg-[#ddd]" />
            OR
            <span className="h-px flex-1 bg-[#ddd]" />
          </div>

          <h2 className="text-2xl font-semibold text-[#333]">Enter payment details</h2>
          <div className="mt-5 rounded-[0.45rem] border border-[#ddd] bg-[#f9f9f9] px-5 py-4 shadow-sm">
            <div className="grid grid-cols-[90px_1fr] items-center text-sm">
              <span className="font-semibold text-[#666]">Email</span>
              <span className="truncate text-[#333]">{email}</span>
            </div>
          </div>

          <h3 className="mt-9 text-base font-semibold text-[#333]">Payment method</h3>
          <div className="mt-4 rounded-[0.45rem] border border-[#d7d7d7] bg-white shadow-sm">
            <div className="flex items-center gap-3 px-5 py-4 text-sm font-semibold">
              <span className="grid h-5 w-6 place-items-center rounded-sm bg-black text-[8px] text-white">
                --
              </span>
              Card
            </div>
            <div className="px-5 pb-4">
              <label className="block text-sm font-semibold text-[#666]">Card information</label>
              <div className="mt-2 overflow-hidden rounded-[0.45rem] border border-[#ddd]">
                <div className="flex h-[44px] items-center justify-between border-b border-[#ddd] px-4 text-sm text-[#777]">
                  <span>1234 1234 1234 1234</span>
                  <span className="text-[10px] font-semibold text-[#2b5be7]">VISA MC AMEX</span>
                </div>
                <div className="grid grid-cols-2">
                  <div className="h-[44px] border-r border-[#ddd] px-4 py-3 text-sm text-[#777]">
                    MM / YY
                  </div>
                  <div className="h-[44px] px-4 py-3 text-sm text-[#777]">CVC</div>
                </div>
              </div>

              <label className="mt-5 block text-sm font-semibold text-[#666]">
                Cardholder name
              </label>
              <input
                className="mt-2 h-[42px] w-full rounded-[0.45rem] border border-[#ddd] px-4 text-sm outline-none"
                placeholder="Full name on card"
              />

              <label className="mt-5 block text-sm font-semibold text-[#666]">
                Country or region
              </label>
              <button
                type="button"
                className="mt-2 flex h-[42px] w-full items-center justify-between rounded-[0.45rem] border border-[#ddd] px-4 text-left text-sm text-[#333]"
              >
                Pakistan
                <span aria-hidden="true">v</span>
              </button>

              <label className="mt-4 flex items-center gap-3 text-sm font-medium text-[#666]">
                <input type="checkbox" className="h-4 w-4 rounded border-[#ddd]" />
                Save my information with Link for faster checkout
              </label>
            </div>
          </div>

          <button
            type="button"
            className="mt-8 h-[58px] w-full rounded-[0.45rem] bg-cyan text-base font-medium text-[#155363] shadow-sm"
          >
            Start trial
          </button>
          <p className="mt-5 text-center text-xs font-medium leading-5 text-[#666]">
            By subscribing, you authorize Nutropx LLC to charge you in PKR at the displayed exchange
            rate or the exchange rate at the time of billing, according to the terms until you
            cancel.
          </p>

          <div className="mt-8 flex items-center justify-center gap-5 text-xs font-medium text-[#777]">
            <span>
              Powered by <strong>stripe</strong>
            </span>
            <span className="h-5 w-px bg-[#bbb]" />
            <a href="https://nutropx.com/terms-and-agreements" target="_blank" rel="noreferrer">
              Terms
            </a>
            <a href="https://nutropx.com/privacy-policy" target="_blank" rel="noreferrer">
              Privacy
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function getCheckoutPlan(value?: string): CheckoutPlan {
  if (value === "monthly") {
    return "monthly";
  }

  return "annual";
}
