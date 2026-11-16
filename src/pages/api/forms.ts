import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

/**
 * Receives the website forms (Contact, CV Upload, Hiring Request) and emails each submission to the team.
 * Reply-To is the visitor's address, so "Reply" in the mail app answers them directly.
 *
 * Env (runtime, server only - ~/<app>/shared/.env on the server, .env locally):
 *   SMTP_HOST, SMTP_PORT (587 = STARTTLS, 465 = SSL), SMTP_USER, SMTP_PASS   the mailbox that sends
 *   FORM_MAIL_TO     who receives the submissions (comma-separated), default rizwan@icacorp.org
 *   FORM_MAIL_FROM   sender shown in the email, default SMTP_USER
 */

type Field = { name: string; label: string; required?: boolean; max?: number };

const FORMS: Record<string, Field[]> = {
  'Contact Form': [
    { name: 'first_name', label: 'First name', required: true },
    { name: 'last_name', label: 'Last name', required: true },
    { name: 'email', label: 'Email', required: true },
    { name: 'subject', label: 'Subject', required: true },
    { name: 'message', label: 'Message', required: true, max: 5000 },
  ],
  'CV Upload': [
    { name: 'first_name', label: 'First name' },
    { name: 'last_name', label: 'Last name' },
    { name: 'email', label: 'Email', required: true },
    { name: 'position', label: 'Position applying for' },
    { name: 'message', label: 'Message', max: 5000 },
  ],
  'Hiring Request': [
    { name: 'full_name', label: 'Full name', required: true },
    { name: 'email', label: 'Business email', required: true },
    { name: 'phone', label: 'Phone' },
    { name: 'company', label: 'Company', required: true },
    { name: 'website', label: 'Company website' },
    { name: 'position', label: 'Position / Job title', required: true },
    { name: 'industry', label: 'Sector', required: true },
    { name: 'openings', label: 'Number of openings', required: true },
    { name: 'recruitment_type', label: 'Recruitment type', required: true },
    { name: 'requirements', label: 'Additional requirements', max: 5000 },
  ],
};

const RESUME_MAX = 5 * 1024 * 1024;
const RESUME_TYPES = /\.(pdf|docx?|rtf|txt)$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// simple per-IP limit: 5 submissions per 10 minutes
const WINDOW = 10 * 60_000;
const LIMIT = 5;
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (now - v[v.length - 1] > WINDOW) hits.delete(k);
  return recent.length > LIMIT;
}

let transport: nodemailer.Transporter | undefined;
function mailer() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return undefined;
  const port = Number(SMTP_PORT || 587);
  transport ??= nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
  return transport;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim();

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const reply = (status: number, message: string) =>
    new Response(JSON.stringify({ ok: status < 300, message }), { status, headers: { 'Content-Type': 'application/json' } });

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return reply(400, 'Invalid submission.');
  }

  // honeypot: real visitors never see or fill this field
  if (String(data.get('nickname') ?? '').trim()) return reply(200, 'Thank you!');

  const formName = String(data.get('form') ?? '');
  const fields = FORMS[formName];
  if (!fields) return reply(400, 'Unknown form.');

  const values: { label: string; value: string }[] = [];
  for (const f of fields) {
    const value = String(data.get(f.name) ?? '').trim();
    if (f.required && !value) return reply(400, `Please fill in "${f.label}".`);
    if (value.length > (f.max ?? 300)) return reply(400, `"${f.label}" is too long.`);
    if (value) values.push({ label: f.label, value });
  }
  const email = String(data.get('email') ?? '').trim();
  if (!EMAIL.test(email)) return reply(400, 'Please enter a valid email address.');

  const attachments: { filename: string; content: Buffer }[] = [];
  const resume = data.get('resume');
  if (resume instanceof File && resume.size > 0) {
    if (!RESUME_TYPES.test(resume.name)) return reply(400, 'Resume must be a PDF, Word, RTF or text file.');
    if (resume.size > RESUME_MAX) return reply(400, 'Resume must be 5 MB or smaller.');
    attachments.push({ filename: oneLine(resume.name).slice(0, 120), content: Buffer.from(await resume.arrayBuffer()) });
  }

  // behind the Cloudflare tunnel every request comes from cloudflared; Cloudflare passes the visitor's IP in
  // CF-Connecting-IP (trustworthy: the app ports are only reachable from the LAN, see ufw)
  const visitor = request.headers.get('cf-connecting-ip') || clientAddress;
  if (rateLimited(visitor)) return reply(429, 'Too many submissions. Please try again in a few minutes.');

  const mail = mailer();
  if (!mail) {
    console.error('[forms] SMTP_HOST / SMTP_USER / SMTP_PASS not set - submission not sent');
    return reply(503, 'The form is temporarily unavailable.');
  }

  const who = oneLine(
    String(data.get('full_name') ?? '') || `${data.get('first_name') ?? ''} ${data.get('last_name') ?? ''}`,
  ) || email;
  const subject = `New ${formName} - ${who}`.slice(0, 200);
  const text = values.map((v) => `${v.label}:\n${v.value}\n`).join('\n') + (attachments.length ? `\nResume attached: ${attachments[0].filename}\n` : '');
  const html =
    `<h2 style="font-family:Arial,sans-serif">${esc(formName)}</h2><table cellpadding="8" style="font-family:Arial,sans-serif;border-collapse:collapse">` +
    values.map((v) => `<tr><td style="vertical-align:top;font-weight:bold;border-bottom:1px solid #eee">${esc(v.label)}</td>` +
      `<td style="border-bottom:1px solid #eee;white-space:pre-wrap">${esc(v.value)}</td></tr>`).join('') +
    `</table>` + (attachments.length ? `<p style="font-family:Arial,sans-serif">Resume attached: ${esc(attachments[0].filename)}</p>` : '');

  try {
    await mail.sendMail({
      from: process.env.FORM_MAIL_FROM || process.env.SMTP_USER,
      to: process.env.FORM_MAIL_TO || 'rizwan@icacorp.org',
      replyTo: email,
      subject,
      text,
      html,
      attachments,
    });
  } catch (err) {
    console.error(`[forms] sending the ${formName} email failed: ${err}`);
    return reply(502, 'Sorry, your submission could not be sent.');
  }
  return reply(200, 'Thank you! Your submission has been received.');
};
