import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, phone, message } = req.body || {};

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: process.env.RESEND_TO,
      replyTo: email,
      subject: `New contact form submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${String(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("send-email error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to send email",
    });
  }
}