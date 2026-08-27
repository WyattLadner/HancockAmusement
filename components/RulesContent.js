import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Renders league rules Markdown in the site's dark theme. Trusted, static content
// (no raw HTML), so react-markdown's default sanitization is sufficient.
export default function RulesContent({ markdown }) {
  if (!markdown) return null;
  return (
    <div
      className="prose prose-invert max-w-none
        prose-headings:font-display prose-headings:uppercase prose-headings:tracking-wide
        prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:mb-6
        prose-h2:text-2xl prose-h2:text-chalk prose-h2:border-b prose-h2:border-line prose-h2:pb-2
        prose-h3:text-xl prose-h3:text-blue
        prose-li:marker:text-smoke prose-strong:text-chalk
        prose-p:text-smoke prose-li:text-chalk"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
