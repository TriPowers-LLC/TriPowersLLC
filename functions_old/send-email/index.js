const { Resend } = require("resend");
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = new Resend(RESEND_API_KEY);
const RESEND_TO = process.env.RESEND_TO || "kimberlyjenkins@tripowersllc.com";
const RESEND_FROM = process.env.RESEND_FROM || "onboarding@resend.dev";

module.exports = async (context, req) => {
  const allowedOrigins = new Set([
    "https://www.tripowersllc.com",
    "https://tripowersllc.com",
    "http://localhost:5173",
    "http://localhost:3000"
  ]);

  const origin = req?.headers?.origin;
  const allowOrigin = origin && allowedOrigins.has(origin) ? origin : null;
  const baseHeaders = allowOrigin ? { "Access-Control-Allow-Origin": allowOrigin, Vary: "Origin" } : {};

  if (req?.method === "OPTIONS") {
    context.res = {
      status: 204,
      headers: {
        ...baseHeaders,
        "Access-Control-Allow-Methods": "POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    };
    return;
  }

  const { name, email, phone, message } = req.body || {};

  if (!name || !email || !message) {
    context.res = { status: 400, headers: baseHeaders, body: "Missing fields" };
    return;
  }

  if (!RESEND_API_KEY) {
    context.log.error("Resend API key is not configured");
    context.res = {
      status: 500,
      headers: baseHeaders,
      body: "Email service is not configured."
    };
    return;
  }

  const subject = `Contact form: ${name}`;
  const text = `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\n\nMessage:\n${message}`;
  const html = `
    <h2>New contact form message</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || "N/A"}</p>
    <p><strong>Message:</strong></p>
    <p>${String(message).replace(/\n/g, "<br />")}</p>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [RESEND_TO],
        reply_to: email,
        subject,
        text,
        html
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      context.log.error("Resend API failed", { status: response.status, body: errorBody });
      context.res = { status: 502, headers: baseHeaders, body: "Failed to send email." };
      return;
    }

    context.res = { status: 202, headers: baseHeaders, body: "Email sent" };
  } catch (error) {
    context.log.error("Resend request failed", error);
    context.res = {
      status: 502,
      headers: baseHeaders,
      body: "Failed to send email."
    };
  }
};

module.exports.route = "send-email";
module.exports.methods = ["POST", "OPTIONS"];
