import Image from "next/image";
import Link from "next/link";

const optOutOptions = [
  {
    title: "1. Enable Global Privacy Control (GPC)",
    copy: "If your browser supports GPC and you've enabled it, we honor your signal automatically.",
  },
  {
    title: "2. Email us",
    copy: (
      <>
        Send a request to{" "}
        <a
          href="mailto:privacy@nutropx.com"
          className="font-semibold text-black underline underline-offset-2"
        >
          privacy@nutropx.com
        </a>{" "}
        with the subject line &ldquo;Do Not Sell or Share.&rdquo;
      </>
    ),
  },
  {
    title: "3. Use our cookie banner",
    copy: "When the cookie banner is shown, you can decline non-essential cookies.",
  },
];

export default function PrivacyChoicesPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <PrivacyChoicesHeader />

      <article className="mx-auto max-w-[980px] px-5 pb-20 pt-20 sm:px-6 lg:pt-24">
        <h1 className="border-b-2 border-black pb-7 font-display text-[2.45rem] font-semibold leading-tight tracking-normal text-black sm:text-[3rem] lg:text-[3.35rem]">
          Do Not Sell or Share My Personal Information
        </h1>

        <p className="mt-12 text-[1.12rem] font-normal leading-9 text-[#344049] sm:text-[1.25rem]">
          Under the California Privacy Rights Act (CPRA) and similar laws in
          several other U.S. states, you have the right to opt out of any
          &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of your personal
          information.
        </p>

        <div className="mt-8 rounded-[1.15rem] border-2 border-black bg-white px-6 py-7 sm:px-7">
          <p className="font-display text-[1.35rem] font-semibold leading-8 text-black sm:text-[1.6rem]">
            Nutropx does not sell your personal information for money.
          </p>
        </div>

        <p className="mt-9 text-[1.08rem] font-normal leading-9 text-[#344049] sm:text-[1.2rem]">
          Depending on how third-party advertising cookies are configured on our
          site, the use of such cookies may qualify as &ldquo;sharing&rdquo;
          under CPRA. You can opt out in any of three ways:
        </p>

        <div className="mt-8 grid gap-6">
          {optOutOptions.map((option) => (
            <section
              key={option.title}
              className="rounded-[1.15rem] border-2 border-black bg-white px-6 py-6 sm:px-7"
            >
              <h2 className="font-display text-[1.25rem] font-semibold leading-7 text-black sm:text-[1.45rem]">
                {option.title}
              </h2>
              <p className="mt-3 text-[1rem] font-normal leading-7 text-[#344049] sm:text-[1.08rem]">
                {option.copy}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-8 text-[1.05rem] font-normal leading-8 text-[#344049] sm:text-[1.15rem]">
          We will not discriminate against you for exercising this right. Your
          account access, pricing, and service quality will not be affected.
        </p>

        <p className="mt-8 text-[1.05rem] font-normal leading-8 text-[#344049] sm:text-[1.15rem]">
          For full details, see our{" "}
          <a
            href="https://nutropx.com/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-black underline underline-offset-2"
          >
            Privacy Policy, Section 18.
          </a>
        </p>
      </article>

      <DashboardFooter />
    </main>
  );
}

function PrivacyChoicesHeader() {
  return (
    <header className="border-b-2 border-black bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1160px] items-center justify-between px-5 sm:h-[80px] sm:px-6">
        <Link href="/dashboard" aria-label="Nutropx Lab dashboard">
          <Image
            src="/assets/nutropx-lab-logo.png"
            alt="Nutropx LAB"
            width={210}
            height={54}
            className="h-9 w-auto sm:h-10"
            priority
          />
        </Link>
        <Link
          href="/lab"
          className="text-[1rem] font-semibold leading-none text-black sm:text-[1.2rem]"
        >
          Back to Lab
        </Link>
      </div>
    </header>
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
              [
                "Shipping Policy",
                "https://nutropx.com/shipping-and-handling-policy",
              ],
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
