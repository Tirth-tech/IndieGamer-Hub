export const stripHtml = (html = '') => {
  if (!html) return '';
  return String(html)
    .replace(/<[^>]*>/g, ' ')                                    // strip all HTML tags like <img ...>, <p>, <br>
    .replace(/\[\/?(?:img|b|i|u|url|code|list|quote)[^\]]*\]/gi, ' ') // strip BBCode tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/(?:src|class|href)="[^"]*"/gi, '')                 // remove leftover attribute strings
    .replace(/\s+/g, ' ')                                         // collapse multiple spaces
    .trim();
};
