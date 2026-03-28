function decodeHtmlEntities(text: string): string {
  return text
    .replaceAll('&quot;', '"')
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&#39;', '\'')
}

export function assembleDocument(html: string, css: string): string {
  // Extract <style> tags rendered by server components and move them to <head>
  // so paged.js can process @page rules and break properties.
  // Vue SSR's <component :is="'style'"> HTML-encodes entities in the content,
  // so we decode them to restore valid CSS (e.g. &quot; → " in content properties).
  let inlineStyles = ''
  const cleanedHtml = html.replaceAll(/<style>([\s\S]*?)<\/style>/g, (_match, content) => {
    inlineStyles += decodeHtmlEntities(content)
    return ''
  })

  const headStyles = inlineStyles
    ? `<style>${css}</style><style>${inlineStyles}</style>`
    : `<style>${css}</style>`

  return `<!DOCTYPE html><html><head><meta charset="utf-8">${headStyles}</head><body>${cleanedHtml}</body></html>`
}
