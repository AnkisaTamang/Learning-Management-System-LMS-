// Utility function to extract YouTube video ID from various URL formats
export const extractYouTubeVideoId = (url) => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    /youtu\.be\/([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

// Convert YouTube URL to embed URL
export const getYouTubeEmbedUrl = (url, autoplay = false) => {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  
  return `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}`;
};

// Get YouTube thumbnail URL
export const getYouTubeThumbnail = (url, quality = 'hqdefault') => {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};