// Shows a PDF (e.g. pool rules) inline on larger screens with an always-available
// Open/Download button — inline PDF rendering is unreliable on phones, so the button
// is the dependable path there.
const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red";

export default function PdfDoc({ url, title, note }) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-display font-bold uppercase tracking-wide text-2xl md:text-3xl">{title}</h2>
          {note ? <p className="text-sm text-smoke mt-1">{note}</p> : null}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center bg-red text-ink font-display font-bold uppercase tracking-wide rounded-md px-5 py-3 hover:bg-red/90 transition-colors duration-200 ${ring} focus-visible:ring-offset-2 focus-visible:ring-offset-ink`}
        >
          Open / Download PDF →
        </a>
      </div>
      <iframe
        src={url}
        title={title}
        className="hidden md:block w-full h-[80vh] rounded-lg border border-line bg-surface"
      />
      <p className="md:hidden rounded-lg border border-line bg-surface px-5 py-4 text-sm text-smoke">
        Tap <span className="text-chalk font-display font-bold uppercase">Open / Download PDF</span> above to view the full document.
      </p>
    </div>
  );
}
