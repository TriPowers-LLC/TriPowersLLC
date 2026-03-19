// api/src/functions/send-email.js
const sendgrid = require("@sendgrid/mail");

const SENDGRID_KEY = process.env.SENDGRID_KEY;
const SENDGRID_TO = process.env.SENDGRID_TO || "kimberlyjenkins@tripowersllc.com";
const SENDGRID_FROM = process.env.SENDGRID_FROM || "kimberlyjenkins@tripowersllc.com";

if (SENDGRID_KEY) {
  sendgrid.setApiKey(SENDGRID_KEY);
}

// v4 model: default export of an async function
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

  // Handle CORS preflight
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

  if (!SENDGRID_KEY) {
    context.log.error("SendGrid API key is not configured");
    context.res = {
      status: 500,
      headers: baseHeaders,
      body: "Email service is not configured."
    };
    return;
  }

  const messageText = `Name:\n${name}\n${message}\n\nPhone: ${phone || "N/A"}\nEmail: ${email}`;

  try {
    await sendgrid.send({
      to: SENDGRID_TO,
      from: SENDGRID_FROM,
      replyTo: email,
      subject: `Contact form: ${name}`,
      text: messageText
    });
    context.res = { status: 202, headers: baseHeaders, body: "Email sent" };
  } catch (error) {
    context.log.error("SendGrid failed to send email", error);
    context.res = {
      status: 502,
      headers: baseHeaders,
      body: "Failed to send email."
    };
  }
};

// optional HTTP trigger metadata (only if you need custom route/method):
module.exports.route = "send-email";
module.exports.methods = ["POST", "OPTIONS"];
