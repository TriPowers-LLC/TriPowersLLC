export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        ok: true,
        message: "Method not allowed",
      });
    }

    return res.status(200).json({
      ok: true,
      hasApiKey: !!process.env.RESEND_API_KEY,
      hasFrom: !!process.env.RESEND_FROM,
      hasTo: !!process.env.RESEND_TO,
      body: req.body || null,
    });
  } catch (error) {
    console.error("DEBUG send-email crash:", error);
    return res.status(500).json({
      ok: false,
      error: error?.message || "Unknown server error",
    });
  }
}