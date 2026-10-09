import { ThumbnailOption, ThumbnailQuality } from '../types';

/**
 * Extracts YouTube Video ID from various URL formats or raw 11-character IDs.
 */
export function extractVideoId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If user pasted raw 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regular expressions for various YouTube URL formats
  const regexes = [
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/|music\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/i,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/i,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/i,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/i,
  ];

  for (const regex of regexes) {
    const match = trimmed.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Returns thumbnail options for a given YouTube video ID.
 */
export function getThumbnails(videoId: string): ThumbnailOption[] {
  return [
    {
      quality: 'maxres',
      label: 'Chất lượng tối đa (Max Resolution)',
      resolution: '1280 x 720',
      url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      webpUrl: `https://i.ytimg.com/vi_webp/${videoId}/maxresdefault.webp`,
      recommendedFor: 'Thiết kế, hình nền, ảnh bìa sắc nét nhất',
    },
    {
      quality: 'hq',
      label: 'Chất lượng cao (HD)',
      resolution: '640 x 480',
      url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      webpUrl: `https://i.ytimg.com/vi_webp/${videoId}/hqdefault.webp`,
      recommendedFor: 'Tải nhanh, thích hợp làm ảnh đại diện',
    },
    {
      quality: 'mq',
      label: 'Chất lượng trung bình (MQ)',
      resolution: '480 x 360',
      url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      webpUrl: `https://i.ytimg.com/vi_webp/${videoId}/mqdefault.webp`,
      recommendedFor: 'Xem trước nhanh trên di động',
    },
    {
      quality: 'sd',
      label: 'Chất lượng tiêu chuẩn (SD)',
      resolution: '320 x 180',
      url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      webpUrl: `https://i.ytimg.com/vi_webp/${videoId}/sddefault.webp`,
      recommendedFor: 'Tiết kiệm dung lượng',
    },
    {
      quality: 'default',
      label: 'Kích thước nhỏ (Small)',
      resolution: '120 x 90',
      url: `https://img.youtube.com/vi/${videoId}/default.jpg`,
      webpUrl: `https://i.ytimg.com/vi_webp/${videoId}/default.webp`,
      recommendedFor: 'Ảnh thu nhỏ cực nhẹ',
    },
  ];
}

/**
 * Detects the type of video based on input URL.
 */
export function detectVideoType(input: string): 'Standard' | 'Shorts' | 'Live' | 'Music' {
  const lower = input.toLowerCase();
  if (lower.includes('/shorts/')) return 'Shorts';
  if (lower.includes('music.youtube.com')) return 'Music';
  if (lower.includes('/live/')) return 'Live';
  return 'Standard';
}

/**
 * Calculates estimated reading time for the title in seconds.
 */
export function calculateReadingTime(title: string): string {
  if (!title) return '1s';
  const words = title.trim().split(/\s+/).filter(Boolean).length;
  const seconds = Math.max(1, Math.ceil(words / 3.5));
  return `${words} từ (~${seconds}s đọc)`;
}

/**
 * Fetches YouTube video metadata (title, author) via pure frontend endpoints.
 * First tries direct YouTube oEmbed, then fallback to noembed.
 */
export async function fetchVideoMetadata(videoId: string): Promise<{ title: string; author?: string }> {
  const targetUrl = `https://www.youtube.com/watch?v=${videoId}`;
  
  // Try 1: YouTube official oEmbed endpoint
  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(targetUrl)}&format=json`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.title) {
        return {
          title: data.title,
          author: data.author_name || 'YouTube',
        };
      }
    }
  } catch {
    // Ignore and attempt fallback
  }

  // Try 2: NoEmbed public proxy service
  try {
    const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(targetUrl)}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.title && !data.error) {
        return {
          title: data.title,
          author: data.author_name || 'YouTube',
        };
      }
    }
  } catch {
    // Ignore
  }

  // Fallback default
  return {
    title: `Video YouTube (${videoId})`,
    author: 'YouTube',
  };
}

/**
 * Downloads image directly to user device with custom filename.
 */
export async function downloadImage(imageUrl: string, filename: string): Promise<boolean> {
  try {
    const response = await fetch(imageUrl, { mode: 'cors' });
    if (!response.ok) throw new Error('Không thể tải ảnh');
    
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    return true;
  } catch {
    // If CORS prevents direct blob fetch, fallback to window open/direct link trigger
    const a = document.createElement('a');
    a.href = imageUrl;
    a.target = '_blank';
    a.download = filename;
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true;
  }
}

/**
 * Copies image blob directly to user's clipboard.
 */
export async function copyImageToClipboard(imageUrl: string): Promise<boolean> {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // Ensure standard png/jpeg blob for ClipboardItem
    let pngBlob = blob;
    if (blob.type !== 'image/png') {
      pngBlob = await convertBlobToPng(blob);
    }

    if (navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({
          [pngBlob.type]: pngBlob,
        }),
      ]);
      return true;
    }
  } catch {
    // Fallback: Copy URL text
  }
  return false;
}

/**
 * Helper to convert image blob to PNG format for clipboard support.
 */
function convertBlobToPng(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const url = URL.createObjectURL(blob);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((pngBlob) => {
          URL.revokeObjectURL(url);
          if (pngBlob) resolve(pngBlob);
          else reject(new Error('Canvas conversion failed'));
        }, 'image/png');
      } else {
        URL.revokeObjectURL(url);
        reject(new Error('Canvas context failed'));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image load failed'));
    };

    img.src = url;
  });
}
