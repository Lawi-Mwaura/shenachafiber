export const packages = [
  { id: "start-8", name: "Start", speed: "8 Mbps", price: "KSh 1,500", descriptor: "Browsing, classes and social", devices: "1–3 devices", featured: false },
  { id: "home-15", name: "Home", speed: "15 Mbps", price: "KSh 2,000", descriptor: "Streaming, work and study", devices: "3–6 devices", featured: true },
  { id: "family-20", name: "Family", speed: "20 Mbps", price: "KSh 2,500", descriptor: "Busy homes and multiple screens", devices: "6–10 devices", featured: false },
] as const;

export const locations = ["Homes", "Apartments", "Offices", "New developments", "Landlord projects"] as const;

export const troubleshootingSteps = [
  { title: "Restart the router", body: "Turn the router off, wait 30 seconds, switch it back on and allow up to two minutes for the lights to settle." },
  { title: "Check the Power and WAN lights", body: "If there are no power lights, check the socket and power adapter. If the router is on but the WAN light is off, check that the WAN cable is firmly connected at both ends." },
  { title: "Test one other phone or computer", body: "Connect one other device to the Wi-Fi. If both devices are offline, note which Power and WAN lights are on, off or blinking before contacting support." },
] as const;

export const buyingQuestions = [
  { question: "Is installation included in the monthly price?", answer: "Installation requirements vary by building and cable route. Shenacha confirms any installation charge in writing after checking coverage and the property layout." },
  { question: "Is a router included?", answer: "The recommended router and any additional Wi-Fi equipment are confirmed with the final package before you commit." },
  { question: "How quickly can installation happen?", answer: "Timing depends on confirmed coverage, access to the property and the required cable route. The installation date is agreed before work begins." },
  { question: "Are there contracts or usage limits?", answer: "Contract, Fair Usage and service terms should be reviewed with the final package. Ask the team to include every applicable term in your written quotation." },
  { question: "Can you cover apartments and businesses?", answer: "Yes. Shenacha plans connectivity, CCTV and biometric access for homes, apartments, offices and other suitable premises across Nairobi, subject to a property assessment." },
  { question: "What happens after installation?", answer: "The handover includes testing, connecting key devices and explaining how to get support. Any ongoing maintenance arrangement is confirmed in the quotation." },
] as const;

export const troubleshootingGuides = [
  { title: "My connection has expired", body: "Use the official payment number 4124145. Your account number is your name. Confirm the payment details before sending, then keep the confirmation message." },
  { title: "I want to change my Wi-Fi name or password", body: "Use the router login address and instructions supplied during installation. Change only the Wi-Fi name or password. If your dashboard looks different, contact support before changing any other setting." },
  { title: "Important: do not change PPPoE details", body: "Do not edit the PPPoE username or password. Those details authenticate your connection; changing them will take the router offline." },
] as const;
