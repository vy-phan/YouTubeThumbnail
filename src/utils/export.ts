import { VideoData, HistoryItem } from '../types';

/**
 * Trigger file download in browser for text/data.
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Export single video data or list to JSON.
 */
export function exportToJSON(data: VideoData | VideoData[] | HistoryItem[], filename: string) {
  const jsonString = JSON.stringify(data, null, 2);
  downloadFile(jsonString, `${filename}.json`, 'application/json');
}

/**
 * Export single video or array to CSV file.
 */
export function exportToCSV(data: VideoData | VideoData[] | HistoryItem[], filename: string) {
  const items = Array.isArray(data) ? data : [data];

  const headers = [
    'Video ID',
    'Title',
    'Author/Channel',
    'URL',
    'Extracted Date',
    'MaxRes Thumbnail URL',
    'HD Thumbnail URL',
  ];

  const rows = items.map((item) => {
    const isVideoData = 'thumbnails' in item;
    const maxRes = isVideoData
      ? item.thumbnails.find((t) => t.quality === 'maxres')?.url || ''
      : item.thumbnailUrl;
    const hq = isVideoData
      ? item.thumbnails.find((t) => t.quality === 'hq')?.url || ''
      : '';

    const dateStr = new Date(item.extractedAt).toISOString();

    // Escape quotes for CSV
    const escapeCsv = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;

    return [
      escapeCsv(item.id),
      escapeCsv(item.title),
      escapeCsv(item.author || ''),
      escapeCsv(item.url),
      escapeCsv(dateStr),
      escapeCsv(maxRes),
      escapeCsv(hq),
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n'); // Add UTF-8 BOM
  downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
}
