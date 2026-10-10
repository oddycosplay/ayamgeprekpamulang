import React, { useState } from 'react';
import { X, Image as ImageIcon, Sparkles, Download, Loader2 } from 'lucide-react';

interface ImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImageStudioModal: React.FC<ImageStudioModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState<string>('Paket Ayam Geprek Sambel Ijo uleg dadakan di cobek batu panas dengan nasi pulen hangat dan timun segar');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedImg, setGeneratedImg] = useState<string | null>(
    'https://lh3.googleusercontent.com/aida/AEtjO1WH0LL-6kRASK1FAeeFzAwBJSPC_tS_kXo7CYWrQdXqUCAFVDanQUT542j53NygbYIy0dJ9rR1WNaHRWzFGSWt2zLlBpEWFJT_FCsiGT74Jz5m5qwbk_ppyCMbanrebd7USy2ZDglaBmUcfbBXM8KxrSfBKQk69Ng5rYb4jiHdSLjQ6DSklsfbcyJtFq1OvdYQ1uka0b7YsbCf4u8fOcsrsAj0TOqaIT302bKHhtHbNyg'
  );
  const [resolutionNote, setResolutionNote] = useState<string>('1024x1024 (1K HD)');

  if (!isOpen) return null;

  const handleGenerate = async (customPrompt?: string) => {
    const textPrompt = customPrompt || prompt;
    if (!textPrompt.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textPrompt, imageSize })
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImg(data.imageUrl);
        setResolutionNote(
          imageSize === '4K'
            ? '4096x4096 (4K Ultra-Res)'
            : imageSize === '2K'
            ? '2048x2048 (2K Quad-HD)'
            : '1024x1024 (1K Standard HD)'
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden text-gray-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-amber-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5C518]/30 text-[#781519] flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-gray-900 font-serif">
                  Studio Gambar Kuliner AI
                </h3>
                <span className="text-[10px] font-black bg-[#781519] text-[#F5C518] px-2 py-0.5 rounded-full">
                  1K / 2K / 4K
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Buat dan sesuaikan foto visual Ayam Geprek Sambel Ijo Al-Fariz dalam resolusi tinggi.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Preset Buttons */}
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Pilihan Konsep Visual Cepat:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const p = 'Paket Ayam Geprek Sambel Ijo di Cobek Batu dengan Lalapan Timun Segar';
                  setPrompt(p);
                  handleGenerate(p);
                }}
                className="text-xs bg-gray-50 hover:bg-amber-50 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 transition"
              >
                🍗 Paket Cobek Batu Klasik
              </button>
              <button
                onClick={() => {
                  const p = 'Ayam Geprek Sambel Ijo dengan Lelehan Keju Mozarella Bakar Hangat';
                  setPrompt(p);
                  handleGenerate(p);
                }}
                className="text-xs bg-gray-50 hover:bg-amber-50 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 transition"
              >
                🧀 Mozarella Melted
              </button>
              <button
                onClick={() => {
                  const p = 'Kulit Ayam Krispi Keemasan dengan Siraman Sambel Rawit Ijo Mengkilap';
                  setPrompt(p);
                  handleGenerate(p);
                }}
                className="text-xs bg-gray-50 hover:bg-amber-50 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 transition"
              >
                ✨ Kulit Krispi Renyah
              </button>
            </div>
          </div>

          {/* Prompt textarea */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Prompt Deskripsi Visual:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-gray-300 focus:border-[#781519] focus:ring-[#781519]"
            />
          </div>

          {/* Size Selector (1K, 2K, 4K affordance) */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-200">
            <div>
              <span className="text-xs font-bold text-gray-800 block">Resolusi Gambar (Affordance):</span>
              <span className="text-[11px] text-gray-500">Pilih kualitas output render</span>
            </div>
            <div className="flex gap-1.5">
              {(['1K', '2K', '4K'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setImageSize(sz)}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition ${
                    imageSize === sz
                      ? 'bg-[#781519] text-[#F5C518] shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={() => handleGenerate()}
            disabled={loading || !prompt.trim()}
            className="w-full py-3 bg-[#F5C518] hover:bg-[#e0b312] text-[#5e0d10] font-black rounded-2xl text-sm shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Merender Gambar AI ({imageSize})...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Gambar Kuliner ({imageSize})</span>
              </>
            )}
          </button>

          {/* Image Display */}
          {generatedImg && (
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center space-y-3">
              <div className="relative aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden shadow-md border border-gray-200">
                <img
                  src={generatedImg}
                  alt="Ayam Geprek Al-Fariz AI Visual"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                  {resolutionNote}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <a
                  href={generatedImg}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="ayam-geprek-al-fariz.png"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-100 text-gray-800 text-xs font-bold rounded-xl border border-gray-300 shadow-sm transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Buka / Simpan Gambar
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
