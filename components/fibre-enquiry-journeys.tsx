"use client";

import { useEffect, useState } from "react";
import { Buildings } from "@phosphor-icons/react/dist/icons/Buildings";
import { HouseLine } from "@phosphor-icons/react/dist/icons/HouseLine";
import { EnquiryForm } from "@/components/enquiry-form";

type Journey = "resident" | "property";

function journeyFromHash(): Journey {
  return window.location.hash === "#property-meeting" ? "property" : "resident";
}

export function FibreEnquiryJourneys() {
  const [journey, setJourney] = useState<Journey>("resident");

  useEffect(() => {
    const syncHash = () => setJourney(journeyFromHash());
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const matchesJourney = (journey === "resident" && hash === "resident-inquiry") || (journey === "property" && hash === "property-meeting");
    if (!matchesJourney) return;
    requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: "start" })));
  }, [journey]);

  function choose(next: Journey) {
    setJourney(next);
    const hash = next === "resident" ? "resident-inquiry" : "property-meeting";
    window.history.replaceState(null, "", `#${hash}`);
    requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <section className="fibre-journeys" aria-labelledby="fibre-journeys-title">
      <div className="fibre-journey-heading">
        <p className="eyebrow">CHOOSE YOUR FIBRE JOURNEY</p>
        <h2 id="fibre-journeys-title">Start with the route that fits you.</h2>
        <p>Residents can check an existing building or area. Property teams can arrange a meeting to plan connectivity for a building.</p>
      </div>
      <div className="fibre-journey-tabs" role="tablist" aria-label="Fibre enquiry type">
        <button type="button" role="tab" aria-selected={journey === "resident"} aria-controls="resident-inquiry" id="resident-tab" onClick={() => choose("resident")}>
          <HouseLine size={24} aria-hidden="true" />
          <span><strong>Resident or client</strong><small>Check fibre availability in Juja</small></span>
        </button>
        <button type="button" role="tab" aria-selected={journey === "property"} aria-controls="property-meeting" id="property-tab" onClick={() => choose("property")}>
          <Buildings size={24} aria-hidden="true" />
          <span><strong>Property owner or manager</strong><small>Book a building meeting</small></span>
        </button>
      </div>

      {journey === "resident" ? (
        <div className="fibre-journey-panel" id="resident-inquiry" role="tabpanel" aria-labelledby="resident-tab" tabIndex={-1}>
          <EnquiryForm fixedKind="fibre_availability" heading="Check fibre availability" idPrefix="fibre-resident" />
        </div>
      ) : (
        <div className="fibre-journey-panel" id="property-meeting" role="tabpanel" aria-labelledby="property-tab" tabIndex={-1}>
          <div className="property-meeting-context">
            <p className="eyebrow">FOR PROPERTY TEAMS</p>
            <h3>Plan reliable fibre for your building.</h3>
            <ul><li>Property assessment and practical cabling plan</li><li>Conduit or neat surface-trunking options</li><li>Terms confirmed in a signed agreement</li></ul>
            <p>Meetings and assessments are arranged in advance; there is no walk-in office.</p>
          </div>
          <EnquiryForm fixedKind="property_meeting" heading="Book a property meeting" idPrefix="fibre-property" />
        </div>
      )}
    </section>
  );
}
