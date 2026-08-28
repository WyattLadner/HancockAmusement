import { NextResponse } from "next/server";

// Receives the contact form and forwards it server-side to the n8n webhook.
// Server-to-server avoids the https-page -> http-webhook mixed-content block, and
// keeps the webhook URL out of the client. Set N8N_CONTACT_WEBHOOK in the env.
export const runtime = "nodejs";

export async function POST(req) {
  const webhook = process.env.N8N_CONTACT_WEBHOOK;
  if (!webhook) {
    return NextResponse.json({ error: "The contact form isn't configured yet." }, { status: 500 });
  }

  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { firstName, lastName, venue, email, phone, need, message, website } = data || {};

  // Honeypot: real users never fill the hidden "website" field. If it's set, it's a
  // bot — pretend success and drop it silently.
  if (website) return NextResponse.json({ ok: true });

  if (!firstName || !email) {
    return NextResponse.json({ error: "Please include your name and email." }, { status: 422 });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, venue, email, phone, need, message }),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Couldn't send right now. Please text or call instead." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Couldn't send right now. Please text or call instead." }, { status: 502 });
  }
}
