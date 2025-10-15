import React, { useRef} from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import * as emailjs from "@emailjs/browser";

gsap.registerPlugin(useGSAP);

/* const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY; */


const Contact = () => {
  const formRef = useRef(null);

  useGSAP(() => {
    gsap.to(".contact-card", { y: -20, opacity: 1, delay: 0.15 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(formRef.current);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(data)),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
      }

      alert("Thank you!  We'll be in touch shortly.");
      formRef.current.reset();
      }  catch (error) {
      console.error("Error sending email:", error);
      alert("There was an error sending your message. Please try again later.");
      }
  }

  return (
    <section
      id="contact"
      className="relative flex items-center justify-center px-4 py-20 bg-gray-100"
    >
      <div className="contact-card w-full max-w-3xl rounded-2xl bg-white/80 backdrop-blur-md shadow-xl p-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900">
          Get in touch
        </h2>

        {/* form */}
        <form
          ref={formRef}
          className="mt-8 grid gap-6"
          onSubmit={handleSubmit}
        >
          {/* name */}
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
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* email */}
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
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* phone */}
          <div className="grid gap-2">
            <label htmlFor="email" className="font-medium text-blue-900">
              Contact Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              placeholder="xxx-xxx-xxxx"
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* message */}
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
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300 resize-none"
            ></textarea>
          </div>

          {/* submit */}
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
// Contact component

export default Contact;