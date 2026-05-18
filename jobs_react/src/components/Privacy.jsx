import React from "react";

const LAST_UPDATED = "May 18, 2026";

const Privacy = () => {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 text-slate-800">
      <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="mt-3 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

      <div className="mt-10 space-y-8 leading-7">
        <p>
          TriPowers LLC ("we," "us," or "our") respects your privacy. This Privacy Policy
          explains what information we collect through our website, how we use it, and the
          choices you have.
        </p>

        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Information We Collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>Contact details you submit (such as name, email, phone, and company).</li>
            <li>Messages or details you provide through forms (including job applications).</li>
            <li>Basic usage and device data collected automatically by standard web technologies.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-slate-900">How We Use Information</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>To respond to inquiries and provide requested services.</li>
            <li>To review employment applications and communicate with applicants.</li>
            <li>To operate, protect, and improve our website and services.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Information Sharing</h2>
          <p className="mt-3">
            We do not sell personal information. We may share information with service providers
            who support our operations, or when required by law.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Data Security</h2>
          <p className="mt-3">
            We use reasonable administrative, technical, and physical safeguards to protect
            information. No method of transmission or storage is guaranteed to be completely
            secure.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Your Choices</h2>
          <p className="mt-3">
            You may contact us to request updates, corrections, or deletion of personal
            information, subject to applicable law.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Contact Us</h2>
          <p className="mt-3">
            For privacy-related requests, contact us through the <a href="/contact" className="text-blue-700 underline">Contact</a> page.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Privacy;
