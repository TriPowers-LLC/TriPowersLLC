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
  const { name, email, phone, message } = req.body || {};

  if (!name || !email || !message) {
    context.res = { status: 400, body: "Missing fields" };
    return;
  }

  if (!SENDGRID_KEY) {
    context.log.error("SendGrid API key is not configured");
    context.res = {
      status: 500,
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
    context.res = { status: 202, body: "Email sent" };
  } catch (error) {
    context.log.error("SendGrid failed to send email", error);
    context.res = {
      status: 502,
      body: "Failed to send email."
    };
  }
};

// optional HTTP trigger metadata (only if you need custom route/method):
module.exports.route = "send-email";
module.exports.methods = ["POST"];
