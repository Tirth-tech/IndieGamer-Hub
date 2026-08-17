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

// Generate a letter-based avatar URL from a name (first letter initials)
export const letterAvatar = (name = 'User', size = 150) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF6B00&color=fff&size=${size}&bold=true&format=png`;
