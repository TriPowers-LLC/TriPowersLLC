import React from "react";

const projects = [
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

const Portfolio = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
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

            {project.url && (
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