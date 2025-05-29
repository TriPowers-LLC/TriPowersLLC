// api/src/functions/send-email.js
const sendgrid = require("@sendgrid/mail");
sendgrid.setApiKey(process.env.SENDGRID_KEY);

// v4 model: default export of an async function
module.exports = async (context, req) => {
  const { name, email, phone, message } = req.body || {};

  if (!name || !email || !message) {
    context.res = { status: 400, body: "Missing fields" };
    return;
  }

  await sendgrid.send({
    to: "kimberlyjenkins@tripowersllc.com",
    from: "info@tripowersllc.com",
    subject: `Contact form: ${name}`,
    text: `${message}\n\nPhone: ${phone}\nEmail: ${email}`
  });

  context.res = { status: 200, body: "OK" };
};

// optional HTTP trigger metadata (only if you need custom route/method):
module.exports.route = "send-email";
module.exports.methods = ["POST"];
