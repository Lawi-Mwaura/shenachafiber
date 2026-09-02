import { Resend } from "resend";
import type { NormalisedLead } from "./lead-validation";

const enquiryLabels: Record<NormalisedLead["enquiryKind"], string> = {
  fibre_availability: "Fibre availability",
  property_meeting: "Property meeting",
  cctv_quote: "CCTV quote",
  biometric_quote: "Biometric access quote",
  support: "Customer support",
};

function display(value: string | number | null | undefined) {
  return value === null || value === undefined || value === "" ? "Not provided" : String(value);
}

function label(value: string | null | undefined) {
  if (!value) return null;
  return value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function escapeHtml(value: string | number) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

type Detail = [name: string, value: string | number | null | undefined];

function detailRows(details: Detail[]) {
  return details
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(([name, value]) => `
      <tr>
        <td style="padding:8px 16px 8px 0;color:#586174;font-size:13px;line-height:20px;vertical-align:top;white-space:nowrap;">${escapeHtml(name)}</td>
        <td style="padding:8px 0;color:#101828;font-size:14px;font-weight:600;line-height:20px;vertical-align:top;word-break:break-word;">${escapeHtml(value!)}</td>
      </tr>`)
    .join("");
}

function detailSection(title: string, details: Detail[]) {
  const rows = detailRows(details);
  if (!rows) return "";
  return `
    <tr>
      <td style="padding:0 28px 24px;">
        <p style="margin:0 0 8px;color:#c72934;font-size:11px;font-weight:700;letter-spacing:1.4px;line-height:16px;text-transform:uppercase;">${escapeHtml(title)}</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-top:1px solid #dce2ea;">
          ${rows}
        </table>
      </td>
    </tr>`;
}

function actionLink(href: string, text: string, accent = false) {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 16px;border:1px solid ${accent ? "#c72934" : "#0b1f3a"};border-radius:6px;background:${accent ? "#c72934" : "#ffffff"};color:${accent ? "#ffffff" : "#0b1f3a"};font-size:13px;font-weight:700;line-height:18px;text-decoration:none;">${escapeHtml(text)}</a>`;
}

function buildLeadHtml(reference: string, lead: NormalisedLead) {
  const actions = [
    lead.whatsapp ? actionLink(`https://wa.me/${lead.whatsapp.replace("+", "")}`, "WhatsApp customer", true) : "",
    actionLink(`tel:${lead.phone}`, "Call customer"),
    lead.email ? actionLink(`mailto:${lead.email}`, "Reply by email") : "",
  ].join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>New Shenacha enquiry</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;color:#101828;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">A new ${escapeHtml(enquiryLabels[lead.enquiryKind].toLowerCase())} enquiry is ready for follow-up.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;background:#f4f6f9;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;max-width:640px;border-collapse:collapse;border-top:5px solid #c72934;background:#ffffff;">
            <tr>
              <td style="padding:28px;background:#0b1f3a;">
                <p style="margin:0 0 18px;color:#ffffff;font-size:19px;font-weight:700;letter-spacing:-0.2px;line-height:24px;">Shenacha Fiber</p>
                <p style="margin:0 0 8px;color:#ffb0b5;font-size:11px;font-weight:700;letter-spacing:1.5px;line-height:16px;text-transform:uppercase;">New enquiry</p>
                <h1 style="margin:0;color:#ffffff;font-size:25px;font-weight:700;line-height:32px;">${escapeHtml(enquiryLabels[lead.enquiryKind])}</h1>
                <p style="margin:14px 0 0;color:#d5deeb;font-size:13px;line-height:20px;">Reference <strong style="color:#ffffff;">${escapeHtml(reference)}</strong></p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 16px;">
                <p style="margin:0;color:#354155;font-size:15px;line-height:24px;">A customer submitted this request on <strong>shenachafiber.com</strong>. Their details are ready for follow-up.</p>
              </td>
            </tr>
            ${detailSection("Customer", [
              ["Name", lead.name], ["Phone", lead.phone], ["WhatsApp", lead.whatsapp], ["Email", lead.email], ["Preferred contact", label(lead.contactPreference)],
            ])}
            ${detailSection("Property", [
              ["Location", lead.location], ["Building", lead.building], ["Property type", label(lead.propertyType)], ["Unit number", lead.unitNumber], ["Unit count", lead.unitCount], ["Contact role", label(lead.contactRole)],
            ])}
            ${detailSection("Request", [
              ["Selected plan", lead.selectedPlan], ["Meeting time", lead.preferredMeetingTime], ["Installation date", lead.preferredInstallationDate], ["Message", lead.message],
            ])}
            <tr>
              <td style="padding:0 28px 24px;">
                <p style="margin:0 0 12px;color:#586174;font-size:12px;font-weight:700;letter-spacing:1px;line-height:16px;text-transform:uppercase;">Follow up</p>
                ${actions}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;background:#edf2f8;color:#586174;font-size:11px;line-height:18px;">
                This internal notification was generated after the enquiry was safely stored. Reference: ${escapeHtml(reference)}.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildLeadNotification(reference: string, lead: NormalisedLead) {
  const subject = `New ${enquiryLabels[lead.enquiryKind]} enquiry — ${reference}`;
  const text = [
    "A new enquiry was saved on shenachafiber.com.",
    "",
    `Reference: ${reference}`,
    `Enquiry: ${enquiryLabels[lead.enquiryKind]}`,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `WhatsApp: ${display(lead.whatsapp)}`,
    `Email: ${display(lead.email)}`,
    `Preferred contact: ${display(lead.contactPreference)}`,
    `Location: ${lead.location}`,
    `Building: ${display(lead.building)}`,
    `Property type: ${display(lead.propertyType)}`,
    `Contact role: ${display(lead.contactRole)}`,
    `Unit count: ${display(lead.unitCount)}`,
    `Unit number: ${display(lead.unitNumber)}`,
    `Selected plan: ${display(lead.selectedPlan)}`,
    `Preferred meeting time: ${display(lead.preferredMeetingTime)}`,
    `Preferred installation date: ${display(lead.preferredInstallationDate)}`,
    `Message: ${display(lead.message)}`,
    `Source: ${lead.source}`,
  ].join("\n");

  return { subject, text, html: buildLeadHtml(reference, lead) };
}

export async function sendLeadNotification(reference: string, lead: NormalisedLead) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.LEADS_NOTIFICATION_EMAIL;

  if (!apiKey || !from || !to) throw new Error("Lead email is not configured.");

  const resend = new Resend(apiKey);
  const content = buildLeadNotification(reference, lead);
  const { data, error } = await resend.emails.send({
    from: `Shenacha Website <${from}>`,
    to: [to],
    replyTo: lead.email ?? undefined,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });

  if (error) throw new Error("Resend rejected the lead notification.");
  return data;
}
