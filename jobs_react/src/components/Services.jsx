import React from 'react'
import { CheckCircle } from "lucide-react";   // lightweight icon set
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);

const CAPABILITIES = [
  "Design & build secure, scalable web applications",
  "Create responsive, user-friendly websites",
  "Develop custom dashboards & data-driven platforms",
  "Integrate systems, APIs, and databases seamlessly",
  "Deliver cloud-ready, future-proof solutions",
  "Ensure federal compliance & accessibility",
];

const Services = () => {
  useGSAP(() => {
    gsap.from(".cap-card", {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#services",
        start: "top 80%",   // when section hits 80% of viewport
      },
    });
  }, []);

  return (
    <section
      id="services"
      className="relative px-4 py-20 bg-gradient-to-b from-gray-50 to-gray-100 text-center scroll-mt-16"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-12">
        Our&nbsp;Capabilities
      </h2>

      <ul className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map((cap) => (
          <li
            key={cap}
            className="cap-card flex items-start gap-4 rounded-xl bg-white/90 p-6 shadow-lg backdrop-blur-sm"
          >
            <CheckCircle className="mt-1 shrink-0 text-blue-600" size={24} />

            <p className="text-left leading-relaxed text-gray-800">{cap}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Services