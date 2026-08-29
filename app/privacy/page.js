import { site } from "@/lib/site";

export const metadata = {
  title: "Privacy Policy",
  description: "How Hancock Amusement handles information you share through this website.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-16">
      <h1 className="font-display font-bold uppercase tracking-wide text-4xl md:text-5xl mb-2">Privacy Policy</h1>
      <p className="text-sm text-smoke mb-10">Last updated: August 2026</p>

      <div
        className="prose prose-invert max-w-none
          prose-headings:font-display prose-headings:uppercase prose-headings:tracking-wide
          prose-h2:text-xl prose-h2:text-chalk prose-p:text-smoke prose-li:text-smoke
          prose-a:text-red prose-strong:text-chalk"
      >
        <p>
          This Privacy Policy explains how Hancock Amusement (&ldquo;we,&rdquo; &ldquo;us&rdquo;)
          handles information you share with us through this website.
        </p>

        <h2>Information We Collect</h2>
        <p>
          When you use our contact form, we collect the details you choose to provide — your name,
          business or venue, email address, phone number, and your message. We do not collect this
          information automatically; you decide what to send us.
        </p>

        <h2>How We Use Your Information</h2>
        <p>
          We use the information you send to respond to your inquiry, share details about our
          equipment and leagues, and follow up about doing business together.
        </p>

        <h2>How We Share It</h2>
        <p>
          We do not sell your information. We share it only with the service providers that help us
          run this website and deliver your message to us (for example, our website host and email
          provider), and only as needed for that purpose — or if required by law.
        </p>

        <h2>Cookies &amp; Tracking</h2>
        <p>
          This site does not use advertising or tracking cookies.
        </p>

        <h2>Data Retention</h2>
        <p>
          We keep the information you send for as long as needed to respond and to maintain a record
          of our communications.
        </p>

        <h2>Your Choices</h2>
        <p>
          You can ask us to update or delete the information you&rsquo;ve shared by contacting us
          using the details below.
        </p>

        <h2>Contact Us</h2>
        <p>
          Questions about this policy? Text or call {site.contactName} at{" "}
          <a href={site.phoneHref}>{site.phoneDisplay}</a>, or email{" "}
          <a href={site.emailHref}>{site.email}</a>.
        </p>

        <h2>Changes</h2>
        <p>
          We may update this policy from time to time. The &ldquo;last updated&rdquo; date above
          reflects the current version.
        </p>
      </div>
    </div>
  );
}
