// Central contact + business facts. Edit here once; every page reads from this.
//
// CONTACT HIERARCHY (client-confirmed): Text → Call → Email.
//   - "Michael" is the public-facing contact site visitors should reach.
//   - The SMS number is the same line as the phone number PENDING confirmation that
//     it is text-capable. If a different text number is provided, change smsNumber only.
export const site = {
  contactName: "Michael",

  phoneDisplay: "228-493-0845",
  phoneHref: "tel:+12284930845",

  // TODO(confirm): verify 228-493-0845 can receive SMS, or swap in the real text line.
  smsHref: "sms:+12284930845",

  email: "hancockamusement@gmail.com",
  emailHref: "mailto:hancockamusement@gmail.com",

  region: "South Mississippi & Southeast Louisiana",

  // Sourced from the LeagueLeader operator profile. NOT rendered yet — zip is unverified
  // (profile shows 35920-2337; Bay St. Louis, MS is 39520 — likely a transposed typo).
  // Confirm with Caleb before displaying a street address anywhere.
  address: {
    street: "203 Kellar Street",
    city: "Bay St. Louis",
    state: "MS",
    zip: null,
  },
};
