import React from "react";
import {
  Bot,
  CheckCircle,
  Cloud,
  Code2,
  Database,
  Laptop,
  Layers3,
  Lock,
  RefreshCw,
  ShieldCheck,
  Users,
  Workflow,
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);

const CAPABILITIES = [
  {
    title: "IT Modernization",
    description:
      "Modernize legacy applications, workflows, and infrastructure into secure, scalable, cloud-ready solutions that improve performance, usability, and long-term maintainability.",
    icon: RefreshCw,
  },
  {
    title: "AI & Automation",
    description:
      "Implement AI-powered tools, automation workflows, and intelligent business solutions that reduce manual effort, improve service delivery, and support faster decision-making.",
    icon: Bot,
  },
  {
    title: "Enterprise System Integration",
    description:
      "Connect enterprise systems, APIs, and databases to streamline operations, improve interoperability, and enable secure, seamless data exchange across platforms.",
    icon: Workflow,
  },
  {
    title: "Cloud Migration & SaaS Solutions",
    description:
      "Design, migrate, and support cloud-native and Software-as-a-Service (SaaS) solutions across Azure, AWS, and hybrid environments with scalability, resilience, and security in mind.",
    icon: Cloud,
  },
  {
    title: "Cybersecurity & Compliance",
    description:
      "Apply secure development practices and support compliance requirements such as accessibility, data protection, risk reduction, and cloud security alignment for public sector environments.",
    icon: ShieldCheck,
  },
  {
    title: "Technical Staffing",
    description:
      "Provide qualified IT professionals, developers, analysts, and technical specialists to support digital transformation, modernization, operations, and mission-critical initiatives.",
    icon: Users,
  },
];

const TECHNOLOGIES = [
  ".NET / C#",
  "React / JavaScript",
  "Node.js",
  "REST APIs",
  "SQL Server / PostgreSQL",
  "Azure / AWS",
  "Cloud-hosted SaaS platforms",
  "Data dashboards & reporting tools",
];

const COMPLIANCE = [
  "TX-RAMP cloud security alignment support",
  "Section 508 accessibility awareness",
  "Secure coding and data protection practices",
  "Cloud-ready architecture for SaaS environments",
  "Support for public sector security and compliance requirements",
  "Scalable solutions for state and government clients",
];

const STAFFING = [
  "Application Developers",
  "Web Developers",
  "Cloud Support Professionals",
  "Business / Systems Analysts",
  "Data & Reporting Specialists",
  "Project and Technical Support Personnel",
];

const Services = () => {
  useGSAP(() => {
  gsap.set(".services-heading, .cap-card, .info-card", {
    clearProps: "opacity,transform",
  });

  gsap.fromTo(
    ".services-heading",
    { autoAlpha: 0, y: 20 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#services",
        start: "top 85%",
        once: true,
      },
    }
  );

  gsap.fromTo(
    ".cap-card",
    { autoAlpha: 0, y: 30 },
    {
      autoAlpha: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".capabilities-grid",
        start: "top 85%",
        once: true,
      },
    }
  );

  gsap.fromTo(
    ".info-card",
    { autoAlpha: 0, y: 25 },
    {
      autoAlpha: 1,
      y: 0,
      stagger: 0.12,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".services-info-grid",
        start: "top 85%",
        once: true,
      },
    }
  );
}, []);

  return (
    <section
      id="services"
      className="relative overflow-x-hidden scroll-mt-16 bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-20 md:px-8"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="services-heading mx-auto mb-14 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-blue-900 md:text-4xl">
            Our Capabilities
          </h2>
          <p className="text-base leading-relaxed text-gray-700 md:text-lg">
            TriPowers LLC delivers modern technology solutions and technical
            workforce support for government, public sector, and commercial
            clients. Our services are designed to help organizations modernize
            operations, strengthen security, and deploy scalable digital
            solutions with confidence.
          </p>
        </div>

        <div className="capabilities-grid grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {CAPABILITIES.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="cap-card h-full rounded-2xl border border-slate-200/70 bg-white p-7 text-left shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_45px_rgba(37,99,235,0.12)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Icon className="text-blue-700" size={24} />
              </div>

              <h3 className="mb-3 text-xl font-semibold text-blue-900">
                {title}
              </h3>

              <p className="leading-relaxed text-gray-700">{description}</p>
            </div>
          ))}
        </div>

        <div className="services-info-grid mt-16 grid gap-8 lg:grid-cols-3">
          <div className="info-card rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
            <div className="mb-4 flex items-center gap-3">
              <Code2 className="text-blue-700" size={24} />
              <h3 className="text-xl font-semibold text-blue-900">
                Technologies We Use
              </h3>
            </div>

            <ul className="space-y-3">
              {TECHNOLOGIES.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle
                    className="mt-1 shrink-0 text-blue-600"
                    size={18}
                  />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="info-card rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
            <div className="mb-4 flex items-center gap-3">
              <Lock className="text-blue-700" size={24} />
              <h3 className="text-xl font-semibold text-blue-900">
                Compliance & Security
              </h3>
            </div>

            <ul className="space-y-3">
              {COMPLIANCE.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle
                    className="mt-1 shrink-0 text-blue-600"
                    size={18}
                  />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="info-card rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
            <div className="mb-4 flex items-center gap-3">
              <Laptop className="text-blue-700" size={24} />
              <h3 className="text-xl font-semibold text-blue-900">
                Technical Staffing Solutions
              </h3>
            </div>

            <ul className="space-y-3">
              {STAFFING.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle
                    className="mt-1 shrink-0 text-blue-600"
                    size={18}
                  />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="info-card mt-12 rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 px-6 py-8 text-white shadow-[0_18px_50px_rgba(15,23,42,0.28)]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="flex items-start gap-3">
              <Layers3 className="mt-1 shrink-0" size={22} />
              <div>
                <h4 className="font-semibold">Modern Solutions</h4>
                <p className="mt-1 text-sm text-blue-100">
                  Secure, scalable digital services built for long-term growth.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Cloud className="mt-1 shrink-0" size={22} />
              <div>
                <h4 className="font-semibold">Cloud & SaaS Ready</h4>
                <p className="mt-1 text-sm text-blue-100">
                  Support for Azure, AWS, hybrid environments, and SaaS-based
                  delivery models.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Database className="mt-1 shrink-0" size={22} />
              <div>
                <h4 className="font-semibold">Integrated Data Systems</h4>
                <p className="mt-1 text-sm text-blue-100">
                  Connected platforms, APIs, and reporting systems that improve
                  visibility and efficiency.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 shrink-0" size={22} />
              <div>
                <h4 className="font-semibold">Public Sector Focus</h4>
                <p className="mt-1 text-sm text-blue-100">
                  Built with security, compliance, accessibility, and government
                  readiness in mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;