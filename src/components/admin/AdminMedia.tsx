import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Copy,
  Check,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  Plus,
  X,
  Maximize2,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useLanguage } from '../../context/LanguageContext';
import { MediaItem } from '../../types';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

export const AdminMedia: React.FC = () => {
  const { media, setMedia, showToast } = usePortfolio();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mediaToDelete, setMediaToDelete] = useState<MediaItem | null>(null);
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageName, setNewImageName] = useState('');

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    showToast(isAr ? 'تم نسخ رابط الصورة إلى الحافظة' : 'Image URL copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    const newItem: MediaItem = {
      id: `media-${Date.now()}`,
      filename: newImageName.trim() || 'Custom Asset',
      type: 'image/jpeg',
      size: 'Web CDN',
      uploadDate: new Date().toISOString().split('T')[0],
      url: newImageUrl.trim(),
    };

    setMedia((prev) => [newItem, ...prev]);
    showToast(isAr ? 'تمت إضافة الصورة إلى مكتبة الوسائط' : 'Asset added to media library', 'success');
    setNewImageUrl('');
    setNewImageName('');
    setIsAddOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newItem: MediaItem = {
      id: `media-${Date.now()}`,
      filename: file.name,
      type: file.type || 'image/jpeg',
      size: `${Math.round(file.size / 1024)} KB`,
      uploadDate: new Date().toISOString().split('T')[0],
      url: URL.createObjectURL(file),
    };

    setMedia((prev) => [newItem, ...prev]);
    showToast(isAr ? 'تم رفع الملف بنجاح' : 'File uploaded successfully', 'success');
  };

  const confirmDelete = () => {
    if (mediaToDelete) {
      setMedia((prev) => prev.filter((item) => item.id !== mediaToDelete.id));
      showToast(isAr ? 'تم حذف الملف' : 'Asset removed', 'info');
      setMediaToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-surface border border-stroke shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-display italic text-text-primary">
            {isAr ? 'مكتبة الوسائط والصور' : 'Media & Asset Library'}
          </h2>
          <p className="text-xs text-muted mt-1">
            {isAr
              ? 'رفع واستعراض صور المشاريع والشاشات ونسخ الروابط المباشرة لاستخدامها.'
              : 'Upload and organize project screenshots, banner assets, and copy CDN URLs.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 rounded-full bg-surface hover:bg-stroke/60 border border-stroke text-text-primary text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة رابط URL' : 'Add Image URL'}</span>
          </button>

          <label className="px-5 py-2.5 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md">
            <Upload className="w-4 h-4" />
            <span>{isAr ? 'رفع ملف من الجهاز' : 'Upload File'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Add URL Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-md bg-surface border border-stroke rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stroke">
                <h3 className="text-base font-semibold text-text-primary">
                  {isAr ? 'إضافة صورة عبر الرابط' : 'Add Image via URL'}
                </h3>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="p-1 text-muted hover:text-text-primary cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddUrl} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                    {isAr ? 'اسم أو وصف الصورة' : 'Image Name'}
                  </label>
                  <input
                    type="text"
                    value={newImageName}
                    onChange={(e) => setNewImageName(e.target.value)}
                    placeholder="Project Dashboard Screen"
                    className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                    {isAr ? 'رابط الصورة المباشر (URL) *' : 'Direct Image URL *'}
                  </label>
                  <input
                    type="url"
                    required
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or https://res.cloudinary.com/..."
                    dir="ltr"
                    className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-stroke">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-4 py-2 rounded-full bg-surface border border-stroke text-xs text-text-primary hover:bg-stroke/60 cursor-pointer"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-md"
                  >
                    {isAr ? 'إضافة الصورة' : 'Add Image'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Media Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {media.map((item) => {
          const isCopied = copiedId === item.id;
          return (
            <div
              key={item.id}
              className="bg-surface border border-stroke hover:border-[#89AACC]/40 rounded-3xl overflow-hidden transition-all flex flex-col justify-between shadow-sm group"
            >
              {/* Image Preview */}
              <div className="relative aspect-video w-full bg-black/40 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <button
                  onClick={() => setZoomUrl(item.url)}
                  className="absolute bottom-2.5 right-2.5 rtl:right-auto rtl:left-2.5 p-2 rounded-xl bg-black/70 hover:bg-black text-white border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Zoom preview"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-xs font-semibold text-text-primary truncate"
                    title={item.filename}
                  >
                    {item.filename}
                  </span>
                  <span className="text-[10px] font-mono text-muted shrink-0">{item.size}</span>
                </div>

                <div className="text-[11px] font-mono text-muted flex items-center justify-between">
                  <span>{item.type}</span>
                  <span>{item.uploadDate}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-3 bg-bg/60 border-t border-stroke/50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleCopy(item.url, item.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isAr ? 'نسخ الرابط' : 'Copy URL'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setMediaToDelete(item)}
                  className="p-1.5 rounded-lg text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Delete image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {zoomUrl && (
          <div
            onClick={() => setZoomUrl(null)}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setZoomUrl(null)}
              className="fixed top-5 right-5 rtl:right-auto rtl:left-5 z-[10000] p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl max-h-[85vh] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black"
            >
              <img src={zoomUrl} alt="Preview" className="w-full h-full object-contain max-h-[85vh]" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(mediaToDelete)}
        title={isAr ? 'حذف الملف من المكتبة؟' : 'Delete Media Asset?'}
        message={
          isAr
            ? 'هل أنت متأكد من حذف هذا الملف من مكتبة الوسائط؟'
            : 'Are you sure you want to delete this media asset?'
        }
        itemTitle={mediaToDelete?.filename}
        onConfirm={confirmDelete}
        onCancel={() => setMediaToDelete(null)}
      />
    </div>
  );
};
