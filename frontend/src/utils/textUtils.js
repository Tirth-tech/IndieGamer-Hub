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

// Generate a local gradient letter-based avatar (WhatsApp style) using SVG data URI
export const letterAvatar = (name = 'User', size = 150) => {
  const cleanName = name || 'User';
  const letter = cleanName.trim().charAt(0).toUpperCase() || '?';
  
  // Premium gradient combinations
  const gradients = [
    ['#FF6B00', '#FFB000'], // Premium Electric Orange / Gold
    ['#39FF88', '#00DFD8'], // Green / Light Teal
    ['#FF007A', '#7928CA'], // Magenta / Purple
    ['#00DFD8', '#007CF0'], // Teal / Blue
    ['#7928CA', '#FF0080'], // Purple / Pink
    ['#FF4D4D', '#FFB000'], // Red / Gold
    ['#4F46E5', '#06B6D4'], // Indigo / Cyan
    ['#EC4899', '#8B5CF6'], // Pink / Violet
  ];

  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  const [color1, color2] = gradients[index];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">
    <defs>
      <linearGradient id="grad-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color1}" />
        <stop offset="100%" stop-color="${color2}" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad-${index})" />
    <text x="50%" y="54%" font-family="-apple-system, BlinkMacSystemFont, 'Outfit', 'Inter', sans-serif" font-weight="900" font-size="44" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">${letter}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Get the correct avatar: if user has old Unsplash placeholder or empty, use letter avatar
export const getAvatar = (avatar, name = 'User', size = 150) => {
  if (!avatar || avatar.includes('unsplash.com') || avatar.includes('ui-avatars.com')) {
    return letterAvatar(name, size);
  }
  return avatar;
};
