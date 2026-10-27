import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, ShieldCheck, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RentDesk — Property management" },
      {
        name: "description",
        content: "Property management, rent collection and tenant support in one place.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f4eb] text-[#17261c]">
      <header className="sticky top-0 z-10 border-b border-[#e6e0d4] bg-[#0c2918]">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-7 lg:px-9"
        >
          <Link
            to="/"
            aria-label="RentDesk home"
            className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6aa59]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#d6aa59] text-[#173c27]">
              <Building2 aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="font-serif text-lg font-semibold text-[#f7f4eb] sm:text-xl">
              RentDesk
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-2 sm:gap-5">
            <Link to="/auth">
              <Button className="h-9 rounded-lg bg-[#d6aa59] px-3 text-xs font-semibold text-[#173c27] shadow-none hover:bg-[#e1ba70] focus-visible:ring-[#d6aa59] sm:px-4 sm:text-sm">
                Sign in
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-14 pt-14 sm:px-7 sm:pt-20 lg:px-9 lg:pt-24">
        <section className="max-w-3xl">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#315d40]">
            Property desk / Kenya
          </p>
          <h1 className="font-serif text-4xl font-semibold leading-[1.12] tracking-tight text-[#17261c] sm:text-5xl lg:text-6xl">
            Property management,
            <span className="block text-[#315d40]">in good order.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#69746c] sm:text-lg">
            Manage tenants, track rent and arrears, record payments, and keep property teams and
            residents connected from one considered workspace.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link to="/auth">
              <Button className="h-11 rounded-lg bg-[#145632] px-5 font-semibold text-white shadow-none hover:bg-[#104728] focus-visible:ring-[#145632]">
                Get started <ArrowRight aria-hidden="true" className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section
          aria-label="RentDesk features"
          className="mt-14 grid gap-4 md:mt-20 md:grid-cols-3"
        >
          <FeatureCard
            icon={<Zap aria-hidden="true" className="h-5 w-5" />}
            title="Rent collection"
            description="Record M-Pesa, bank and cash payments, and keep an up-to-date view of balances."
          />
          <FeatureCard
            icon={<ShieldCheck aria-hidden="true" className="h-5 w-5" />}
            title="Tenant support"
            description="Give residents a dedicated place to review their charges and report maintenance issues."
          />
          <FeatureCard
            icon={<Building2 aria-hidden="true" className="h-5 w-5" />}
            title="Property operations"
            description="Coordinate property teams and tenant records across the homes you manage."
          />
        </section>
      </main>
      <footer className="border-t border-[#e6e0d4] px-4 py-5 text-center text-xs text-[#69746c]">
        RentDesk · Property management in Kenya
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-[#e5dfd3] bg-[#fffefa] p-5 shadow-[0_2px_8px_rgba(27,42,30,0.06)] sm:p-6">
      <span className="mb-5 grid h-10 w-10 place-items-center rounded-full bg-[#e4ece4] text-[#315d40]">
        {icon}
      </span>
      <h2 className="font-serif text-xl font-semibold text-[#17261c]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#69746c]">{description}</p>
    </article>
  );
}
