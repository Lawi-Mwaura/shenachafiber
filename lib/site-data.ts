export const troubleshootingSteps = [
  { title: "Restart the router", body: "Turn the router off, wait 30 seconds, switch it back on and allow up to two minutes for the lights to settle." },
  { title: "Check the Power and WAN lights", body: "If there are no power lights, check the socket and power adapter. If the router is on but the WAN light is off, check that the WAN cable is firmly connected at both ends." },
  { title: "Test one other phone or computer", body: "Connect one other device to the Wi-Fi. If both devices are offline, note which Power and WAN lights are on, off or blinking before contacting support." },
] as const;

export const troubleshootingGuides = [
  { title: "My connection has expired", body: "Use the official payment number 4124145. Your account number is your name. Confirm the payment details before sending, then keep the confirmation message." },
  { title: "I want to change my Wi-Fi name or password", body: "Use the router login address and instructions supplied during installation. Change only the Wi-Fi name or password. If your dashboard looks different, contact support before changing any other setting." },
  { title: "Important: do not change PPPoE details", body: "Do not edit the PPPoE username or password. Those details authenticate your connection; changing them will take the router offline." },
] as const;
