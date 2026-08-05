import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER || "";
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || "";
export const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:3000";

let transporter: Transporter | null = null;

const isConfigured = () =>
  GMAIL_USER.length > 0 && GMAIL_APP_PASSWORD.length > 0;

const getTransporter = (): Transporter | null => {
  if (!isConfigured()) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });
  }

  return transporter;
};

interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export const sendEmail = async (options: MailOptions) => {
  const t = getTransporter();

  if (!t) {
    console.warn(
      "[mailer] GMAIL_USER/GMAIL_APP_PASSWORD not configured - skipping email to " +
        options.to
    );
    return { skipped: true };
  }

  try {
    await t.sendMail({
      from: `"Yellow Mart" <${GMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    console.log("[mailer] Email sent to " + options.to);
    return { ok: true };
  } catch (err) {
    console.error("[mailer] Failed to send email:", err);
    return { ok: false, error: err };
  }
};
