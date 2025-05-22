import React from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import groupImage from "../assets/groupImage.png";
import { Link } from "react-router-dom";


gsap.registerPlugin(useGSAP);

export default function Home() {
  useGSAP(() => {
    gsap.to("#hero-title", { opacity: 1, delay: 0.4 });
    gsap.to("#cta-btn", { opacity: 1, y: -20, delay: 0.8 });
  }, []);

  return (
    <div className = "home-container " id = "home">
      <section className="hero relative flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <img
          src={groupImage}
          alt="office team"
          className="heroPhoto absolute inset-0 w-full h-full object-cover z-[-5]"
        />

        <h1
          id="hero-title"
          className="opacity-0 text-5xl md:text-6xl font-bold text-white drop-shadow-lg"
        >
          TriPowers&nbsp;LLC
        </h1>
        <p className="hero-mission  mt-20 max-w-2xl text-lg md:text-xl text-white backdrop-blur-sm">
                At TriPowers LLC, our mission is to empower organizations to achieve their goals through
                 innovative technology, expert staffing, and comprehensive HR solutions. We leverage our 
                 extensive experience as a service-disabled, veteran-owned business to deliver tailored,
                  client-centric support that drives efficiency, growth, and success. Together, we'll 
                  transform challenges into opportunities and create lasting impact in your mission-critical 
                  endeavors.
        </p>
        <Link
          to="/contact"
          id="cta-btn"
          className=" mt-60 cta-btn mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold opacity-0"
        >
          Contact&nbsp;Us
        </Link>
      </section>
             
    </div>
)
}