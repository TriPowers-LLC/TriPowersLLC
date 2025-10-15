// api/src/functions/send-email.js
const sendgrid = require("@sendgrid/mail");
sendgrid.setApiKey(process.env.SENDGRID_KEY);

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

  try {
    await sendgrid.send({
      to: "kimberlyjenkins@tripowersllc.com",
      from: "kimberlyjenkins@tripowersllc.com",
      replyTo: email,
      subject: `Contact form: ${name}`,
      text: `Name:\n${name}\n${message}\n\nPhone: ${phone || "N/A"}\nEmail: ${email}`
    });
    context.res = { status: 202, headers: baseHeaders, body: "Email sent" };
  } catch (error) {
    context.log?.error?.("SendGrid failed to send email", error);
    context.res = { status: 502, headers: baseHeaders, body: "Failed to send email." };
  }
};

// optional HTTP trigger metadata (only if you need custom route/method):
module.exports.route = "send-email";
module.exports.methods = ["POST", "OPTIONS"];
