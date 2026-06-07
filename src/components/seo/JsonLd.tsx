/**
 * Renders JSON-LD structured data. Server component — the script ships in the
 * initial HTML so search crawlers and answer engines read it without executing
 * any JavaScript. Pass a single node or an array (rendered as a @graph-like list).
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const nodes = Array.isArray(data) ? data : [data]
  return (
    <>
      {nodes.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
    </>
  )
}
