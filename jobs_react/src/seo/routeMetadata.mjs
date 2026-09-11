export const SITE_URL = "https://www.tripowersllc.com";
export const DEFAULT_IMAGE = `${SITE_URL}/logo.jpg`;

export const PUBLIC_ROUTE_METADATA = Object.freeze({
  "/": {
    title: "TriPowers LLC | AI, Application Development & Technology Solutions",
    description:
      "TriPowers LLC delivers AI automation, application development, cloud solutions, technical staffing, and government contracting technology for mission-driven organizations.",
    path: "/",
    imageAlt: "TriPowers LLC logo",
  },
  "/about": {
    title: "About Our Government Technology Company",
    description:
      "Learn about TriPowers LLC, a Texas-based SDVOSB delivering application development, AI automation, cloud solutions, technical staffing, and mission support.",
    path: "/about",
  },
  "/services": {
    title: "AI, Application Development, Cloud & Staffing Services",
    description:
      "TriPowers LLC provides AI automation, full-stack application development, IT modernization, cloud and SaaS solutions, system integration, cybersecurity, and technical staffing.",
    path: "/services",
  },
  "/products/winningbids": {
    title: "WinningBids.ai — AI for Government Contracting",
    description:
      "Explore WinningBids.ai, government contracting software developed by TriPowers LLC for SAM.gov opportunity matching, bid/no-bid analysis, solicitation analysis, and AI proposal assistance.",
    path: "/products/winningbids",
    image: "https://winningbids.ai/logo-full.png",
    imageAlt: "Winning Bids AI logo",
    type: "product",
  },
  "/portfolio": {
    title: "Portfolio & Product Experience",
    description:
      "Explore TriPowers LLC application development, AI integration, cloud delivery, government technology products, and modernization experience.",
    path: "/portfolio",
  },
  "/careers": {
    title: "Careers and Open Technology Roles",
    description:
      "Explore current career opportunities with TriPowers LLC across application development, technology, operations, staffing, and mission support.",
    path: "/careers",
  },
  "/contact": {
    title: "Contact TriPowers LLC",
    description:
      "Contact TriPowers LLC about application development, AI automation, cloud modernization, technical staffing, and government technology solutions.",
    path: "/contact",
  },
  "/privacy": {
    title: "Privacy Policy",
    description:
      "Review how TriPowers LLC collects, uses, protects, and manages information submitted through its website and job-application services.",
    path: "/privacy",
  },
});

export function formatSeoTitle(title) {
  return title.includes("TriPowers") ? title : `${title} | TriPowers LLC`;
}
