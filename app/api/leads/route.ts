import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import type { LeadResponse } from "@/lib/lead";
import { readLeadJson, validateLead } from "@/lib/lead-validation";

export const runtime = "nodejs";

const noStoreHeaders = { "Cache-Control": "no-store" };

function json(body: LeadResponse, status: number) {
  return NextResponse.json(body, { status, headers: noStoreHeaders });
}

export async function POST(request: Request) {
  const parsed = await readLeadJson(request);
  if (!parsed.ok) {
    return json(
      {
        saved: false,
        reason: "invalid_request",
        message: parsed.reason === "too_large" ? "The request is too large. Shorten the message and try again." : "The request could not be read. Check the form and try again.",
      },
      parsed.reason === "too_large" ? 413 : 400,
    );
  }

  const result = validateLead(parsed.value);
  if (!result.ok) {
    return json({ saved: false, reason: result.reason, message: result.message, fieldErrors: result.fieldErrors }, 400);
  }

  if (!process.env.DATABASE_URL) {
    console.warn("lead_storage_unavailable", { reason: "database_not_configured", service: result.lead.service });
    return json(
      { saved: false, reason: "storage_unavailable", message: "Online requests are temporarily unavailable. Your details were not sent or stored. Please try again or use the official WhatsApp contact." },
      503,
    );
  }

  const reference = `SF-${randomBytes(6).toString("hex").toUpperCase()}`;
  const consentAt = new Date().toISOString();
  const submittedAt = new Date().toISOString();

  try {
    const sql = getDatabase();
    await sql`
      INSERT INTO website_leads (
        public_reference, service, enquiry_kind, selected_plan, location, building, property_type,
        contact_role, unit_count, unit_number, message, name, phone, whatsapp, email, contact_preference,
        preferred_meeting_time, preferred_installation_date, consent_granted,
        consent_at, source, utm, submitted_at
      ) VALUES (
        ${reference}, ${result.lead.service}, ${result.lead.enquiryKind}, ${result.lead.selectedPlan}, ${result.lead.location},
        ${result.lead.building}, ${result.lead.propertyType}, ${result.lead.contactRole}, ${result.lead.unitCount},
        ${result.lead.unitNumber}, ${result.lead.message}, ${result.lead.name}, ${result.lead.phone},
        ${result.lead.whatsapp}, ${result.lead.email}, ${result.lead.contactPreference},
        ${result.lead.preferredMeetingTime}, ${result.lead.preferredInstallationDate}, ${result.lead.consent}, ${consentAt},
        ${result.lead.source}, ${JSON.stringify(result.lead.utm)}::jsonb, ${submittedAt}
      )
    `;
    return json({ saved: true, reference, message: "Your request has been received. Shenacha can now follow up using the phone number you provided." }, 201);
  } catch (error) {
    console.error("lead_storage_failed", { reference, service: result.lead.service, error: error instanceof Error ? error.name : "UnknownError" });
    return json(
      { saved: false, reason: "storage_error", message: "The request was not sent or stored. Please try again or use the official WhatsApp contact." },
      503,
    );
  }
}
