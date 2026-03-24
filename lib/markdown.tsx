/**
 * Extracts data URLs from markdown image tags and replaces them with short
 * placeholders. ReactMarkdown chokes on very long data URLs in image syntax,
 * so we pull them out before parsing and resolve them in a custom img component.
 */
export function extractDataImages(content: string) {
  const images: Record<string, string> = {};
  let counter = 0;
  const processed = content.replace(
    /!\[([^\]]*)\]\((data:[^)]+)\)/g,
    (_match, alt, src) => {
      const key = `__dataimg_${counter++}`;
      images[key] = src;
      return `![${alt}](${key})`;
    }
  );
  return { processed, images };
}

/**
 * Returns a custom img component for ReactMarkdown that resolves
 * extracted data image placeholders back to actual data URLs.
 */
export function createImgRenderer(images: Record<string, string>) {
  return ({ src, alt }: any) => {
    const resolvedSrc = (src && images[src]) || src;
    if (!resolvedSrc) return null;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={resolvedSrc} alt={alt || ''} className="rounded-xl max-w-full" />;
  };
}
