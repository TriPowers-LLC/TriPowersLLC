import React from "react";
import { Link } from "react-router-dom";
import Seo from "./Seo";
import { PUBLIC_ROUTE_METADATA } from "../seo/routeMetadata.mjs";

const projects = [
  {
    title: "WinningBids.ai",
    subtitle: "AI-Powered Government Contracting SaaS Platform",
    description:
      "A TriPowers-developed commercial product that simplifies federal opportunity discovery, capture, solicitation analysis, and proposal development for small businesses.",
    url: "/products/winningbids",
    role: "Product Strategy, Design & Full-Stack Development",
    tech: ["Full-Stack SaaS", "AI Integration", "Government APIs", "Document Processing", "Cloud Deployment"],
    internal: true,
  },
  {
    title: "Spirit Luxe Travels",
    description:
      "Luxury travel brand focused on curated group trips, concierge planning, and elevated client experiences.",
    url: "https://www.spiritluxetravels.com",
    role: "Founder & Travel Advisor",
    tech: ["Branding", "Web Design", "Client Experience", "Travel Systems"],
  },
  {
    title: "Adams Family Reunion",
    description:
      "Custom-built family reunion website with registration, branch tracking, and member engagement features.",
    url: "https://adamsfamilyreunion.org",
    role: "Full-Stack Developer",
    tech: ["React", "Forms", "Database Design", "User Management"],
  },
  {
    title: "TriPowers LLC Website",
    description:
      "Government-focused business website showcasing services, job opportunities, and applicant intake system.",
    url: "https://www.tripowersllc.com",
    role: "Full-Stack Developer & Owner",
    tech: ["React", ".NET API", "AWS", "Azure", "PostgreSQL"],
  },
  {
    title: "DoD PamWeb Modernization",
    description:
      "Modernizing Army G1 enterprise system from legacy WebForms to scalable modern architecture.",
    role: "Application Developer",
    tech: [".NET", "Blazor", "SQL", "Enterprise Systems"],
  },
];

const portfolioSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "TriPowers LLC Portfolio and Product Experience",
  url: "https://www.tripowersllc.com/portfolio",
  about: [
    "Application development",
    "AI integration",
    "Cloud deployment",
    "Government technology",
  ],
  hasPart: {
    "@type": "SoftwareApplication",
    name: "WinningBids.ai",
    url: "https://winningbids.ai/",
    applicationCategory: "BusinessApplication",
  },
};

const Portfolio = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Seo
        {...PUBLIC_ROUTE_METADATA["/portfolio"]}
        structuredData={portfolioSchema}
      />
      <h1 className="text-3xl font-bold mb-8 text-center">
        Our Work & Experience
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>

            {project.subtitle && (
              <p className="mb-3 text-sm font-semibold text-blue-700">{project.subtitle}</p>
            )}

            <p className="text-gray-600 mb-3">{project.description}</p>

            <p className="text-sm mb-2">
              <span className="font-semibold">Role:</span> {project.role}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((t, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-200 px-2 py-1 rounded"
                >
                  {t}
                </span>
              ))}
            </div>

            {project.url && project.internal && (
              <Link
                to={project.url}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                View Product →
              </Link>
            )}

            {project.url && !project.internal && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Visit Site →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
