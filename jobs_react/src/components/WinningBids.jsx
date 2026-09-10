import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ExternalLink,
  Facebook,
  FileCheck2,
  Instagram,
  Linkedin,
  Radar,
  Users,
  Workflow,
} from "lucide-react";
import winningBidsLogo from "../assets/winningbids-logo.png";
import {
  WINNING_BIDS_SOCIAL_LINKS,
  WINNING_BIDS_TOOLS_URL,
  WINNING_BIDS_URL,
} from "../config/externalLinks";
import Seo from "./Seo";

const CAPABILITIES = [
  "Federal opportunity discovery using SAM.gov data",
  "Business-profile-based opportunity matching",
  "AI-assisted scoring with BID / WATCH / PARTNER / SKIP recommendations",
  "Bid/no-bid decision support",
  "Solicitation and document analysis",
  "Section L/M and requirement analysis",
  "Compliance matrix development",
  "Proposal development and red-team review support",
  "Capability statement and Sources Sought response assistance",
  "Amendment monitoring and impact analysis",
  "Deadline, milestone, and team collaboration features",
];

const DELIVERY_THEMES = [
  "Full-stack SaaS application development",
  "AI and government data/API integration",
  "Secure multi-user, role-based architecture",
  "Automated document-processing workflows",
  "Cloud deployment, analytics, and monitoring",
];

const SOCIAL_ICONS = { LinkedIn: Linkedin, Instagram, Facebook };

const productSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "WinningBids.ai",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: WINNING_BIDS_URL,
  description:
    "AI-powered government contracting software developed by TriPowers LLC for federal opportunity discovery, bid/no-bid analysis, solicitation analysis, capture, and proposal development.",
  creator: {
    "@type": "Organization",
    name: "TriPowers LLC",
    url: "https://www.tripowersllc.com/",
  },
};

const WinningBids = () => (
  <div className="-mx-4 bg-white text-slate-900 md:-mx-8">
    <Seo
      title="WinningBids.ai — AI for Government Contracting"
      description="Explore WinningBids.ai, government contracting software developed by TriPowers LLC for SAM.gov opportunity matching, bid/no-bid analysis, solicitation analysis, and AI proposal assistance."
      path="/products/winningbids"
      image="https://winningbids.ai/logo-full.png"
      imageAlt="Winning Bids AI logo"
      type="product"
      structuredData={productSchema}
    />

    <section className="relative isolate overflow-hidden bg-slate-950 px-4 py-20 text-white md:px-8 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.3),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.2),transparent_32%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
            TriPowers Product
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
            WinningBids.ai
          </h1>
          <p className="mt-4 text-2xl font-semibold text-sky-300">
            AI for Government Contracting
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
            WinningBids.ai is an AI-powered government contracting platform
            developed by TriPowers LLC to help small businesses simplify the
            federal opportunity and capture process.
          </p>
          <p className="mt-4 max-w-2xl leading-7 text-slate-300">
            Move from federal opportunity discovery through smarter bid/no-bid
            decisions, solicitation analysis, capture, and proposal development
            with less manual effort and better organization.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={WINNING_BIDS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-300/40"
            >
              Explore WinningBids.ai <ArrowRight className="ml-2" size={18} aria-hidden="true" />
            </a>
            <a
              href={WINNING_BIDS_TOOLS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-sky-300/40 bg-sky-300/10 px-6 py-3 font-semibold text-sky-100 transition hover:bg-sky-300/20 focus:outline-none focus:ring-4 focus:ring-sky-300/30"
            >
              Try Free GovCon Tools <ExternalLink className="ml-2" size={17} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white p-6 shadow-2xl sm:p-9">
          <img
            src={winningBidsLogo}
            alt="Winning Bids AI"
            className="mx-auto h-auto w-full max-w-md"
          />
          <div className="mt-8 grid grid-cols-3 gap-2 text-center text-xs font-semibold sm:text-sm">
            {[
              ["Find", "Better Opportunities"],
              ["Decide", "Smarter"],
              ["Build", "Stronger Responses"],
            ].map(([verb, detail]) => (
              <div key={verb} className="rounded-xl bg-slate-100 px-2 py-4 text-slate-900">
                <span className="block text-sky-700">{verb}</span>
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className="px-4 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
            From Search to Submission
          </p>
          <h2 className="mt-3 text-3xl font-bold text-blue-950 md:text-4xl">
            Government contracting software built around the pursuit workflow
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            WinningBids uses government opportunity information to help
            businesses analyze and manage GovCon pursuits. It supports informed
            decisions and compliant preparation; it does not guarantee awards.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {CAPABILITIES.map((capability) => (
            <div key={capability} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={20} aria-hidden="true" />
              <span className="leading-6 text-slate-700">{capability}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-slate-50 px-4 py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
              Built by TriPowers LLC
            </p>
            <h2 className="mt-3 text-3xl font-bold text-blue-950 md:text-4xl">
              A working example of our AI and application-development capabilities
            </h2>
            <p className="mt-5 leading-8 text-slate-600">
              TriPowers designed and developed WinningBids.ai as an independent
              commercial SaaS product—not as government contract past performance.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {DELIVERY_THEMES.map((theme, index) => {
              const icons = [Bot, Radar, Users, FileCheck2, Workflow];
              const Icon = icons[index];
              return (
                <div key={theme} className="rounded-2xl bg-white p-5 shadow-sm">
                  <Icon className="text-blue-700" size={24} aria-hidden="true" />
                  <p className="mt-3 font-semibold text-slate-800">{theme}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>

    <section className="px-4 py-16 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl bg-blue-950 p-7 text-white sm:p-10 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Follow WinningBids.ai</h2>
          <p className="mt-2 text-blue-100">Product updates, GovCon insights, and practical resources.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {WINNING_BIDS_SOCIAL_LINKS.map(({ name, url }) => {
            const Icon = SOCIAL_ICONS[name];
            return (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow WinningBids.ai on ${name} (opens in a new tab)`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-semibold transition hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-sky-300/30"
              >
                <Icon size={19} aria-hidden="true" /> {name}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  </div>
);

export default WinningBids;
