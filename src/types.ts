export type ThumbnailQuality = 'maxres' | 'hq' | 'mq' | 'sd' | 'default';

export interface ThumbnailOption {
  quality: ThumbnailQuality;
  label: string;
  resolution: string;
  url: string;
  webpUrl: string;
  recommendedFor: string;
}

export interface VideoData {
  id: string;
  url: string;
  title: string;
  author?: string;
  extractedAt: number;
  thumbnails: ThumbnailOption[];
  isLoadingTitle?: boolean;
  videoType?: 'Standard' | 'Shorts' | 'Live' | 'Music';
  estimatedReadingTime?: string;
}

export interface HistoryItem {
  id: string;
  url: string;
  title: string;
  author?: string;
  extractedAt: number;
  thumbnailUrl: string;
}
