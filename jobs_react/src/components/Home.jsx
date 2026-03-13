import React from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  Bot,
  Briefcase,
  CheckCircle,
  Cloud,
  ShieldCheck,
  Users,
  Workflow,
} from "lucide-react";
import groupImage from "../assets/groupImage.png";
import { Link } from "react-router-dom";

gsap.registerPlugin(useGSAP);

const FEATURED_CAPABILITIES = [
  {
    title: "IT Modernization",
    description:
      "Modernize legacy systems and workflows into secure, scalable, cloud-ready platforms.",
    icon: Workflow,
  },
  {
    title: "Cloud & SaaS Solutions",
    description:
      "Support Azure, AWS, hybrid cloud, and SaaS-based delivery models aligned with public sector needs.",
    icon: Cloud,
  },
  {
    title: "AI & Automation",
    description:
      "Implement intelligent tools and automation to improve efficiency, reduce manual work, and support better decisions.",
    icon: Bot,
  },
  {
    title: "Technical Staffing",
    description:
      "Provide skilled IT professionals, analysts, and technical support personnel for mission-critical work.",
    icon: Users,
  },
];

const HIGHLIGHTS = [
  "Government, public sector, and commercial support",
  "Cloud-ready and scalable digital solutions",
  "Security, compliance, and accessibility focused",
  "Technology + staffing under one trusted partner",
];

export default function Home() {
  useGSAP(() => {
    gsap.fromTo(
      ".hero-content",
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      }
    );

    gsap.fromTo(
      ".feature-card",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        delay: 0.5,
      }
    );
  }, []);

  return (
    <div id="home" className="bg-white text-slate-900">
      <section className="relative isolate overflow-hidden">
        <img
          src={groupImage}
          alt="TriPowers team"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 via-slate-900/55 to-slate-900/70" />

        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl items-center px-4 py-24 md:px-8">
          <div className="max-w-3xl">
            <p className="hero-content mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100 backdrop-blur-sm">
              SDVOSB | Technology Solutions | Technical Staffing
            </p>

            <h1 className="hero-content text-4xl font-bold leading-tight text-white md:text-6xl">
              Modern Technology, Cloud Solutions, and Workforce Support for
              Mission-Driven Organizations
            </h1>

            <p className="hero-content mt-6 max-w-2xl text-base leading-8 text-slate-100 md:text-xl">
              TriPowers LLC helps government, public sector, and commercial
              clients modernize operations through secure digital solutions,
              cloud-ready services, AI-driven automation, and technical staffing
              support.
            </p>

            <div className="hero-content mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700"
              >
                Contact Us
                <ArrowRight className="ml-2" size={18} />
              </Link>

              <Link
                to="/services"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Explore Capabilities
              </Link>
            </div>

            <div className="hero-content mt-10 grid gap-3 sm:grid-cols-2">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-white/10 p-4 text-left backdrop-blur-sm"
                >
                  <CheckCircle className="mt-0.5 shrink-0 text-blue-300" size={18} />
                  <span className="text-sm text-white md:text-base">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
              Core Capabilities
            </p>
            <h2 className="text-3xl font-bold text-blue-950 md:text-4xl">
              Strategic solutions built for performance, security, and scale
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              We combine technology expertise, staffing support, and public
              sector awareness to help clients solve operational challenges and
              deliver measurable results.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
            {FEATURED_CAPABILITIES.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="feature-card rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(37,99,235,0.12)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <Icon className="text-blue-700" size={24} />
                </div>

                <h3 className="mb-3 text-xl font-semibold text-blue-950">
                  {title}
                </h3>
                <p className="leading-7 text-slate-600">{description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/services"
              className="inline-flex items-center font-semibold text-blue-700 transition hover:text-blue-900"
            >
              View all services
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl bg-white p-8 shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
              Why TriPowers
            </p>
            <h2 className="text-3xl font-bold text-blue-950 md:text-4xl">
              A trusted partner for modernization, staffing, and mission support
            </h2>
            <p className="mt-5 leading-8 text-slate-600">
              TriPowers LLC delivers tailored, client-focused support designed
              to strengthen operations, improve service delivery, and support
              long-term growth. We bring a practical understanding of
              technology, workforce needs, and public sector expectations to
              every engagement.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <ShieldCheck className="mb-3 text-blue-700" size={24} />
                <h3 className="font-semibold text-blue-950">
                  Security & Compliance Mindset
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Solutions designed with security, accessibility, and
                  compliance awareness for government and regulated
                  environments.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <Briefcase className="mb-3 text-blue-700" size={24} />
                <h3 className="font-semibold text-blue-950">
                  Technology + Staffing
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  One partner for digital solutions, workforce support, and
                  operational execution.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 p-8 text-white shadow-[0_18px_50px_rgba(15,23,42,0.24)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
              Built for Public Sector Readiness
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              Cloud-ready, scalable, and aligned with modern delivery needs
            </h2>

            <div className="mt-8 space-y-5">
              <div className="flex gap-4">
                <Cloud className="mt-1 shrink-0 text-blue-200" size={22} />
                <div>
                  <h3 className="font-semibold">Cloud & SaaS Support</h3>
                  <p className="mt-1 text-sm leading-7 text-blue-100">
                    Support for Azure, AWS, hybrid environments, and SaaS-based
                    delivery approaches.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Users className="mt-1 shrink-0 text-blue-200" size={22} />
                <div>
                  <h3 className="font-semibold">Technical Workforce Support</h3>
                  <p className="mt-1 text-sm leading-7 text-blue-100">
                    Skilled professionals available to support modernization,
                    operations, and mission-critical initiatives.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <ShieldCheck className="mt-1 shrink-0 text-blue-200" size={22} />
                <div>
                  <h3 className="font-semibold">Compliance-Aware Delivery</h3>
                  <p className="mt-1 text-sm leading-7 text-blue-100">
                    Public-sector-conscious development with accessibility,
                    security, and governance considerations in mind.
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/contact"
              className="mt-8 inline-flex items-center rounded-xl bg-white px-6 py-3 font-semibold text-blue-900 transition hover:bg-blue-50"
            >
              Start a Conversation
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}