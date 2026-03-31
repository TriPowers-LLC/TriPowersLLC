import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import publicApi from "../api/publicApiClient";

gsap.registerPlugin(useGSAP);

const Contact = () => {
  const formRef = useRef(null);

  useGSAP(() => {
    gsap.to(".contact-card", { y: -20, opacity: 1, delay: 0.15 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = Object.fromEntries(new FormData(formRef.current));

    try {
      await publicApi.post("send-email", payload, { timeout: 15000 });
      alert("Thank you! We'll be in touch shortly.");
      formRef.current.reset();
    } catch (err) {
      console.error("Error sending contact form message:", err);
      alert("There was an error sending your message. Please try again later.");
    }
  };

  return (
    <section
      id="contact"
      className="relative flex items-center justify-center px-4 py-20 bg-gray-100"
    >
      <div className="contact-card w-full max-w-3xl rounded-2xl bg-white/80 backdrop-blur-md shadow-xl p-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900">
          Get in touch
        </h2>

        <form
          ref={formRef}
          className="mt-8 grid gap-6"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-2">
            <label htmlFor="name" className="font-medium text-blue-900">
              Full name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Full Name"
              autoComplete="name"
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="email" className="font-medium text-blue-900">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="phone" className="font-medium text-blue-900">
              Contact Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              placeholder="xxx-xxx-xxxx"
              autoComplete="tel"
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="message" className="font-medium text-blue-900">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              placeholder="How can we help?"
              autoComplete="off"
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            id="submit-btn"
            className="contact-card inline-block w-full rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Send&nbsp;Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
