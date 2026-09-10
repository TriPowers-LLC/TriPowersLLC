import { ExternalLink, Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import {
  TRIPOWERS_SOCIAL_LINKS,
  WINNING_BIDS_URL,
} from "../config/externalLinks";

const SOCIAL_ICONS = { LinkedIn: Linkedin, Facebook, Instagram };

const Footer = () => (
  <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 md:px-8">
      <div>
        <p className="text-lg font-bold text-white">TriPowers LLC</p>
        <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
          Technology solutions, AI-driven automation, application development,
          and technical staffing for mission-driven organizations.
        </p>
        <div className="mt-5 flex gap-3" aria-label="Follow TriPowers LLC">
          {TRIPOWERS_SOCIAL_LINKS.map(({ name, url }) => {
            const Icon = SOCIAL_ICONS[name];
            return (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow TriPowers LLC on ${name} (opens in a new tab)`}
                className="rounded-lg border border-slate-700 p-2.5 text-slate-300 transition hover:border-blue-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <Icon size={19} aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </div>

      <nav aria-label="Footer navigation">
        <p className="font-semibold text-white">Company</p>
        <ul className="mt-3 space-y-2 text-sm">
          <li><Link className="hover:text-white" to="/about">About</Link></li>
          <li><Link className="hover:text-white" to="/services">Services</Link></li>
          <li><Link className="hover:text-white" to="/portfolio">Portfolio</Link></li>
          <li><Link className="hover:text-white" to="/contact">Contact</Link></li>
          <li><Link className="hover:text-white" to="/privacy">Privacy</Link></li>
        </ul>
      </nav>

      <div>
        <p className="font-semibold text-white">TriPowers Product</p>
        <Link
          to="/products/winningbids"
          className="mt-3 inline-flex items-center font-semibold text-sky-300 hover:text-sky-200"
        >
          WinningBids.ai
        </Link>
        <a
          href={WINNING_BIDS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex w-fit items-center gap-1 text-sm text-slate-400 hover:text-white"
          aria-label="Visit WinningBids.ai (opens in a new tab)"
        >
          Visit product site <ExternalLink size={14} aria-hidden="true" />
        </a>
        <p className="mt-4 text-xs leading-5 text-slate-500">
          Developed by TriPowers LLC. Independent software; not affiliated with
          or endorsed by the U.S. government.
        </p>
      </div>
    </div>

    <div className="border-t border-slate-800 px-4 py-5 text-center text-xs text-slate-500">
      © {new Date().getFullYear()} TriPowers LLC. All rights reserved.
    </div>
  </footer>
);

export default Footer;
