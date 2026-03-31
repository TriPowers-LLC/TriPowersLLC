import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM;
    const to = process.env.RESEND_TO;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing RESEND_API_KEY" });
    }
    if (!from) {
      return res.status(500).json({ error: "Missing RESEND_FROM" });
    }
    if (!to) {
      return res.status(500).json({ error: "Missing RESEND_TO" });
    }

    const { name, company, email, phone, service, message } = req.body || {};

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const resend = new Resend(apiKey);

    const result = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New contact form submission from ${name}`,
      text:
        `Name: ${name}\n` +
        `Company: ${company || "N/A"}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n` +
        `Service: ${service || "N/A"}\n\n` +
        `Message:\n${message}`,
    });

    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("send-email crashed:", error);
    return res.status(500).json({
      error: error?.message || "Failed to send email",
      details: error?.response?.data || null,
    });
  }
}