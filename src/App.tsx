import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UrlInput } from './components/UrlInput';
import { VideoInfoCard } from './components/VideoInfoCard';
import { ThumbnailCard } from './components/ThumbnailCard';
import { ThumbnailModal } from './components/ThumbnailModal';
import { HistoryList } from './components/HistoryList';
import { FormatGuide } from './components/FormatGuide';
import { Toast, ToastMessage } from './components/Toast';
import { VideoData, ThumbnailOption, HistoryItem } from './types';
import {
  extractVideoId,
  getThumbnails,
  fetchVideoMetadata,
  downloadImage,
  copyImageToClipboard,
  detectVideoType,
  calculateReadingTime,
} from './utils/youtube';
import { exportToJSON, exportToCSV } from './utils/export';
import {
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  ArrowUpDown,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'yt_thumbnail_extractor_history';

export default function App() {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [modalThumbnail, setModalThumbnail] = useState<ThumbnailOption | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const displayedThumbnails = React.useMemo(() => {
    if (!videoData) return [];
    const items = [...videoData.thumbnails];
    if (sortOrder === 'asc') {
      return items.reverse();
    }
    return items;
  }, [videoData, sortOrder]);

  // Load search history from localStorage on initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // Ignore storage read errors
    }
  }, []);

  // Save history item helper
  const saveToHistory = (item: HistoryItem) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.id !== item.id);
      const updated = [item, ...filtered].slice(0, 9); // Keep latest 9 items
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage write errors
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // Ignore
    }
    showToast('info', 'Đã xóa lịch sử tìm kiếm');
  };

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({
      id: Date.now().toString(),
      type,
      message,
    });
  };

  const handleExtract = async (inputUrl: string) => {
    setError(null);
    const videoId = extractVideoId(inputUrl);

    if (!videoId) {
      setError(
        'Đường dẫn YouTube không hợp lệ. Vui lòng kiểm tra lại URL (ví dụ: https://www.youtube.com/watch?v=...)'
      );
      showToast('error', 'Đường dẫn YouTube không hợp lệ');
      return;
    }

    setIsLoading(true);
    const thumbnails = getThumbnails(videoId);
    const fullUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const vType = detectVideoType(inputUrl);

    // Initialize with loading title state
    const initialData: VideoData = {
      id: videoId,
      url: fullUrl,
      title: 'Đang tải tiêu đề...',
      extractedAt: Date.now(),
      thumbnails,
      isLoadingTitle: true,
      videoType: vType,
    };

    setVideoData(initialData);

    // Fetch video metadata asynchronously (title & author)
    try {
      const metadata = await fetchVideoMetadata(videoId);
      const updatedData: VideoData = {
        ...initialData,
        title: metadata.title,
        author: metadata.author,
        isLoadingTitle: false,
        estimatedReadingTime: calculateReadingTime(metadata.title),
      };

      setVideoData(updatedData);

      // Save to local history
      saveToHistory({
        id: videoId,
        url: fullUrl,
        title: metadata.title,
        author: metadata.author,
        extractedAt: Date.now(),
        thumbnailUrl: thumbnails[0].url,
      });

      showToast('success', 'Trích xuất thumbnail & tiêu đề thành công!');
    } catch {
      setVideoData((prev) =>
        prev
          ? {
              ...prev,
              title: `Video YouTube (${videoId})`,
              isLoadingTitle: false,
            }
          : null
      );
      showToast('info', 'Đã lấy thumbnail thành công');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTitle = () => {
    if (!videoData || videoData.isLoadingTitle) return;
    navigator.clipboard.writeText(videoData.title);
    setCopiedTitle(true);
    showToast('success', 'Đã sao chép tiêu đề video vào bộ nhớ tạm');
    setTimeout(() => setCopiedTitle(false), 2500);
  };

  const handleDownloadImage = async (url: string, filename: string) => {
    showToast('info', 'Đang xử lý tải hình ảnh...');
    const success = await downloadImage(url, filename);
    if (success) {
      showToast('success', `Đã tải hình ảnh về máy thành công!`);
    } else {
      showToast('error', 'Không thể tải ảnh. Đã mở hình ảnh trong tab mới.');
    }
  };

  const handleCopyImage = async (url: string) => {
    showToast('info', 'Đang sao chép hình ảnh...');
    const success = await copyImageToClipboard(url);
    if (success) {
      showToast('success', 'Đã sao chép hình ảnh vào bộ nhớ tạm!');
    } else {
      navigator.clipboard.writeText(url);
      showToast('info', 'Đã sao chép đường dẫn hình ảnh!');
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('success', 'Đã sao chép đường dẫn hình ảnh');
  };

  const handleExportSingleJSON = () => {
    if (!videoData) return;
    exportToJSON(videoData, `youtube_metadata_${videoData.id}`);
    showToast('success', 'Đã xuất file JSON thành công!');
  };

  const handleExportSingleCSV = () => {
    if (!videoData) return;
    exportToCSV(videoData, `youtube_metadata_${videoData.id}`);
    showToast('success', 'Đã xuất file CSV thành công!');
  };

  const handleExportHistoryJSON = () => {
    if (history.length === 0) return;
    exportToJSON(history, `youtube_history_${Date.now()}`);
    showToast('success', 'Đã xuất lịch sử ra file JSON!');
  };

  const handleExportHistoryCSV = () => {
    if (history.length === 0) return;
    exportToCSV(history, `youtube_history_${Date.now()}`);
    showToast('success', 'Đã xuất lịch sử ra file CSV!');
  };

  const handleReset = () => {
    setVideoData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header Bar */}
      <Navbar onReset={handleReset} hasData={!!videoData} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Intro banner */}
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            YouTube Thumbnail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Tải ảnh đại diện chất lượng cao (HD, Full HD) từ bất kỳ video YouTube nào.
          </p>
        </div>

        {/* Input Section */}
        <UrlInput
          onExtract={handleExtract}
          isLoading={isLoading}
          error={error}
          onClearError={() => setError(null)}
        />

        {/* Output Section (When Video Data Exists) */}
        {videoData && (
          <div className="space-y-8 animate-fade-in">
            {/* Video Title Card */}
            <VideoInfoCard
              videoData={videoData}
              onCopyTitle={handleCopyTitle}
              copiedTitle={copiedTitle}
              onExportJSON={handleExportSingleJSON}
              onExportCSV={handleExportSingleCSV}
            />

            {/* Thumbnail Options Grid */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-red-600" />
                    <span>Hình ảnh Thumbnail ({videoData.thumbnails.length} kích thước)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chọn kích thước độ phân giải phù hợp để tải về hoặc sao chép
                  </p>
                </div>

                {/* Sorting Controls */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto text-xs font-medium">
                  <span className="text-slate-500 px-2 flex items-center gap-1 font-semibold">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    <span className="hidden sm:inline">Sắp xếp:</span>
                  </span>
                  <button
                    onClick={() => setSortOrder('desc')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                      sortOrder === 'desc'
                        ? 'bg-white text-slate-900 shadow-sm font-bold border border-slate-200/60'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Sắp xếp từ độ phân giải Cao nhất đến Thấp nhất"
                  >
                    <ArrowDownWideNarrow className="w-3.5 h-3.5 text-red-600" />
                    <span>Cao → Thấp</span>
                  </button>
                  <button
                    onClick={() => setSortOrder('asc')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                      sortOrder === 'asc'
                        ? 'bg-white text-slate-900 shadow-sm font-bold border border-slate-200/60'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Sắp xếp từ độ phân giải Thấp nhất đến Cao nhất"
                  >
                    <ArrowUpNarrowWide className="w-3.5 h-3.5 text-blue-600" />
                    <span>Thấp → Cao</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedThumbnails.map((thumb) => (
                  <ThumbnailCard
                    key={thumb.quality}
                    thumbnail={thumb}
                    videoId={videoData.id}
                    videoTitle={videoData.title}
                    onDownload={handleDownloadImage}
                    onCopyImage={handleCopyImage}
                    onCopyUrl={handleCopyUrl}
                    onPreview={(t) => setModalThumbnail(t)}
                    isPrimary={thumb.quality === 'maxres'}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Search History */}
        <HistoryList
          history={history}
          onSelect={(item) => handleExtract(item.url)}
          onClear={handleClearHistory}
          onExportHistoryJSON={handleExportHistoryJSON}
          onExportHistoryCSV={handleExportHistoryCSV}
        />

        {/* Format & Usage Guide */}
        <FormatGuide />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <img src="/assets/ytb.png" alt="YouTube" className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold text-slate-700">YouTube Thumbnail</span>
          </div>
          <p className="flex items-center gap-1 font-medium text-slate-600">
            Made by{' '}
            <a
              href="https://vyphanne.vercel.app/bio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 font-bold hover:underline transition-all"
            >
              VyPhanNe
            </a>
          </p>
        </div>
      </footer>

      {/* Lightbox Modal */}
      <ThumbnailModal
        thumbnail={modalThumbnail}
        videoId={videoData?.id || ''}
        videoTitle={videoData?.title || ''}
        onClose={() => setModalThumbnail(null)}
        onDownload={handleDownloadImage}
        onCopyImage={handleCopyImage}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
