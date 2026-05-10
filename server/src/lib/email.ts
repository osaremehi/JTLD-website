// server/src/lib/email.ts
import sgMail from '@sendgrid/mail'

const FROM = process.env.EMAIL_FROM || 'noreply@jtldinc.com'
const configured = Boolean(process.env.SENDGRID_API_KEY)

if (configured) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
}

interface EmailPayload {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  if (!configured) {
    console.log(`[email] SendGrid not configured — skipping email to ${payload.to}: ${payload.subject}`)
    return
  }
  await sgMail.send({ from: FROM, ...payload })
}

// ── Application emails ──

export async function sendApplicationConfirmation(opts: {
  candidateName: string
  candidateEmail: string
  jobTitle: string
  companyName: string
}) {
  await sendEmail({
    to: opts.candidateEmail,
    subject: `Application submitted — ${opts.jobTitle} at ${opts.companyName}`,
    html: `
      <p>Hi ${opts.candidateName},</p>
      <p>Your application for <strong>${opts.jobTitle}</strong> at <strong>${opts.companyName}</strong> has been received.</p>
      <p>You can track your application status on your <a href="https://jtldinc.com/careers/dashboard">candidate dashboard</a>.</p>
      <p>Good luck!<br/>The JTLD Team</p>
    `,
    text: `Hi ${opts.candidateName}, your application for ${opts.jobTitle} at ${opts.companyName} has been received. Track your status at https://jtldinc.com/careers/dashboard`,
  })
}

export async function sendNewApplicationAlert(opts: {
  employerEmail: string
  companyName: string
  candidateName: string
  jobTitle: string
  jobId: string
}) {
  await sendEmail({
    to: opts.employerEmail,
    subject: `New application — ${opts.candidateName} applied for ${opts.jobTitle}`,
    html: `
      <p>Hi ${opts.companyName},</p>
      <p><strong>${opts.candidateName}</strong> has applied for your job posting: <strong>${opts.jobTitle}</strong>.</p>
      <p><a href="https://jtldinc.com/employer/jobs/${opts.jobId}/applicants">View all applicants</a></p>
      <p>The JTLD Team</p>
    `,
    text: `${opts.candidateName} applied for ${opts.jobTitle}. View applicants at https://jtldinc.com/employer/jobs/${opts.jobId}/applicants`,
  })
}

// ── Job alert email ──

export async function sendJobAlertEmail(opts: {
  candidateEmail: string
  candidateName: string
  jobs: Array<{ title: string; company: string; location: string; slug: string }>
}) {
  if (opts.jobs.length === 0) return
  const jobListHtml = opts.jobs.map(j =>
    `<li><a href="https://jtldinc.com/jobs/${j.slug}">${j.title}</a> — ${j.company}, ${j.location}</li>`
  ).join('\n')

  await sendEmail({
    to: opts.candidateEmail,
    subject: `${opts.jobs.length} new job${opts.jobs.length > 1 ? 's' : ''} matching your alert`,
    html: `
      <p>Hi ${opts.candidateName},</p>
      <p>Here are today's new jobs matching your saved search:</p>
      <ul>${jobListHtml}</ul>
      <p><a href="https://jtldinc.com/jobs">Browse all jobs</a></p>
      <p>The JTLD Team</p>
    `,
    text: `New jobs for you: ${opts.jobs.map(j => `${j.title} at ${j.company} (${j.location}) — https://jtldinc.com/jobs/${j.slug}`).join(', ')}`,
  })
}

// ── Contact form confirmation ──

export async function sendContactConfirmation(opts: {
  firstName: string
  email: string
  service?: string
}) {
  await sendEmail({
    to: opts.email,
    subject: 'We received your inquiry — JTLD Consulting',
    html: `
      <p>Hi ${opts.firstName},</p>
      <p>Thank you for reaching out${opts.service ? ` about <strong>${opts.service}</strong>` : ''}. A member of our team will be in touch within 1–2 business days.</p>
      <p>In the meantime, explore our <a href="https://jtldinc.com/services">services</a> or <a href="https://jtldinc.com/blog">insights</a>.</p>
      <p>Best regards,<br/>The JTLD Consulting Team</p>
    `,
    text: `Hi ${opts.firstName}, thank you for reaching out. We'll be in touch within 1–2 business days.`,
  })
}
