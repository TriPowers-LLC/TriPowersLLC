import axios from "axios";
import { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const Contact = () => {
  const formRef = useRef(null);
  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [loading, setLoading] = useState(false);

  useGSAP(() => {
    gsap.fromTo(
      ".contact-card",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
  if (status === "success") {
    const timer = setTimeout(() => setStatus(null), 5000);
    return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = Object.fromEntries(new FormData(formRef.current));

    try {
      setLoading(true);
      setStatus(null);

      await axios.post("/api/send-email", payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });

      setStatus("success");
      formRef.current.reset();
    } catch (err) {
      console.error("Error sending contact form message:", err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative bg-gradient-to-b from-slate-50 to-blue-50 px-4 py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="contact-card grid overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
          <div className="bg-blue-900 px-8 py-12 text-white md:px-12">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-200">
              Contact Us
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
              TriPowers LLC
            </h2>

            <p className="mt-4 max-w-md text-base leading-7 text-blue-100">
              Let’s talk about your staffing, technology, automation, or digital
              solution needs. Send us a message and we’ll get back to you
              shortly.
            </p>

            <div className="mt-10 space-y-6 text-sm text-blue-100">
              <div>
                <p className="font-semibold text-white">Business Name</p>
                <p>TriPowers LLC</p>
              </div>

              <div>
                <p className="font-semibold text-white">Services</p>
                <p>Technology, Staffing, Automation, and Business Solutions</p>
              </div>

              <div>
                <p className="font-semibold text-white">Response Time</p>
                <p>We aim to respond within 1–2 business days.</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-12 md:px-12">
            <h3 className="text-2xl font-bold text-slate-900">
              Send us a message
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Complete the form below and a member of the TriPowers LLC team
              will follow up with you.
            </p>

            {status === "success" && (
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
                Message sent successfully. We’ll be in touch shortly.
              </div>
            )}

            {status === "error" && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                Something went wrong while sending your message. Please try
                again.
              </div>
            )}

            <form
              ref={formRef}
              className="mt-8 grid gap-5"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-2">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-slate-800"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className="rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="company"
                  className="text-sm font-semibold text-slate-800"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  placeholder="Enter your company name"
                  autoComplete="organization"
                  className="rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-slate-800"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-semibold text-slate-800"
                >
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  placeholder="(555) 555-5555"
                  autoComplete="tel"
                  className="rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="grid gap-2">
              <label className="text-sm font-semibold text-slate-800">
                Service Needed
              </label>
              <select
                name="service"
                required
                className="rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Select a service</option>
                <option>Technology Solutions</option>
                <option>Staffing Services</option>
                <option>AI & Automation</option>
                <option>Website / App Development</option>
                <option>General Inquiry</option>
              </select>
            </div>

              <div className="grid gap-2">
                <label
                  htmlFor="message"
                  className="text-sm font-semibold text-slate-800"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Tell us a little about what you need help with."
                  autoComplete="off"
                  className="resize-none rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-blue-700 px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
