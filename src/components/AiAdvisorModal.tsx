import React, { useState } from 'react';
import { X, Sparkles, MapPin, Search, Brain, Loader2, ExternalLink, Send, Lightbulb } from 'lucide-react';

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'advisor' | 'maps' | 'search';
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'advisor'
}) => {
  const [activeTab, setActiveTab] = useState<'advisor' | 'maps' | 'search'>(initialMode);
  const [prompt, setPrompt] = useState<string>('');
  const [deepThinking, setDeepThinking] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Results
  const [advisorResponse, setAdvisorResponse] = useState<{ text: string; thinkingNotes?: string | null } | null>(null);
  const [mapsResponse, setMapsResponse] = useState<{ text: string; mapsLinks: Array<{ title: string; uri: string }> } | null>(null);
  const [searchResponse, setSearchResponse] = useState<{ text: string; citations: Array<{ title: string; uri: string }> } | null>(null);

  if (!isOpen) return null;

  const handleAdvisorSubmit = async (queryText?: string) => {
    const textToSubmit = queryText || prompt;
    if (!textToSubmit.trim()) return;

    setLoading(true);
    setAdvisorResponse(null);

    try {
      const res = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSubmit, deepThinking })
      });
      const data = await res.json();
      setAdvisorResponse({
        text: data.advice,
        thinkingNotes: data.thinkingNotes
      });
    } catch (err: any) {
      setAdvisorResponse({
        text: 'Maaf, terjadi kendala saat memproses rekomendasi. Silakan coba kembali!'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMapsGroundingSubmit = async (queryText?: string) => {
    const textToSubmit = queryText || prompt || 'Panduan rute jalan ke Ayam Geprek Al-Fariz depan Kampus UNPAM';
    setLoading(true);
    setMapsResponse(null);

    try {
      const res = await fetch('/api/gemini/grounding-maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSubmit })
      });
      const data = await res.json();
      setMapsResponse({
        text: data.text,
        mapsLinks: data.mapsLinks || []
      });
    } catch (err) {
      setMapsResponse({
        text: 'Ayam Geprek Al-Fariz berada di seberang gerbang utama UNPAM Pamulang Barat, samping warung Mie Ayam.',
        mapsLinks: [
          {
            title: 'Google Maps: Kampus Utama UNPAM Pamulang',
            uri: 'https://maps.google.com/?q=Universitas+Pamulang+Jl.+Surya+Kencana+No.27+Pamulang+Barat'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchGroundingSubmit = async (queryText?: string) => {
    const textToSubmit = queryText || prompt || 'Tren ayam geprek sambel ijo kampus UNPAM Tangerang Selatan';
    setLoading(true);
    setSearchResponse(null);

    try {
      const res = await fetch('/api/gemini/grounding-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSubmit })
      });
      const data = await res.json();
      setSearchResponse({
        text: data.text,
        citations: data.citations || []
      });
    } catch (err) {
      setSearchResponse({
        text: 'Kuliner ayam geprek sambel ijo merupakan salah satu pilihan terpopuler mahasiswa di sekitar Pamulang.',
        citations: []
      });
    } finally {
      setLoading(false);
    }
  };

  const executeCurrentTabAction = () => {
    if (activeTab === 'advisor') handleAdvisorSubmit();
    else if (activeTab === 'maps') handleMapsGroundingSubmit();
    else if (activeTab === 'search') handleSearchGroundingSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden text-gray-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-amber-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5C518]/30 text-[#781519] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-gray-900 font-serif">
                Asisten Cerdas Al-Fariz (Gemini)
              </h3>
              <p className="text-xs text-gray-500">
                Didukung Google Search & Google Maps Grounding serta mode High Thinking.
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

        {/* Tab Selection */}
        <div className="px-6 pt-3 border-b border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              setActiveTab('advisor');
              setPrompt('');
            }}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'advisor'
                ? 'border-[#781519] text-[#781519]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Brain className="w-4 h-4" />
            Konsultasi Selera & Budget
          </button>
          <button
            onClick={() => {
              setActiveTab('maps');
              setPrompt('Rute tercepat jalan kaki dari gedung Viktor / gerbang utama UNPAM ke gerobak Al-Fariz');
            }}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'maps'
                ? 'border-[#781519] text-[#781519]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Maps Grounding (Navigasi)
          </button>
          <button
            onClick={() => {
              setActiveTab('search');
              setPrompt('Apa yang membuat ayam geprek sambel ijo digemari mahasiswa di Pamulang?');
            }}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'search'
                ? 'border-[#781519] text-[#781519]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Search className="w-4 h-4" />
            Search Grounding (Info Web)
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Quick Preset Buttons */}
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Rekomendasi Cepat:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeTab === 'advisor' && (
                <>
                  <button
                    onClick={() => {
                      const q = 'Saya mahasiswa punya budget pas Rp 20.000, lapar sehabis kuliah jam 17.00. Apa paket paling hemat & kenyang?';
                      setPrompt(q);
                      handleAdvisorSubmit(q);
                    }}
                    className="text-xs bg-gray-50 hover:bg-amber-50 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 font-medium transition"
                  >
                    💰 Budget Rp 20.000 Mahasiswa
                  </button>
                  <button
                    onClick={() => {
                      const q = 'Berapa estimasi biaya dan paket terbaik untuk acara rapat BEM 45 orang di kampus UNPAM?';
                      setPrompt(q);
                      handleAdvisorSubmit(q);
                    }}
                    className="text-xs bg-gray-50 hover:bg-amber-50 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 font-medium transition"
                  >
                    📦 Katering Rapat Kampus (45 Box)
                  </button>
                  <button
                    onClick={() => {
                      const q = 'Saya suka pedas tapi punya riwayat lambung sensitif, level berapa yang disarankan di Al-Fariz?';
                      setPrompt(q);
                      handleAdvisorSubmit(q);
                    }}
                    className="text-xs bg-gray-50 hover:bg-amber-50 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 font-medium transition"
                  >
                    🌶️ Rekomendasi Lambung Sensitif
                  </button>
                </>
              )}

              {activeTab === 'maps' && (
                <>
                  <button
                    onClick={() => {
                      const q = 'Patokan jalan persis menuju gerobak Al-Fariz dari gerbang utama UNPAM Surya Kencana';
                      setPrompt(q);
                      handleMapsGroundingSubmit(q);
                    }}
                    className="text-xs bg-gray-50 hover:bg-amber-50 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 font-medium transition"
                  >
                    📍 Patokan Gerbang Utama UNPAM
                  </button>
                  <button
                    onClick={() => {
                      const q = 'Di mana tempat parkir motor atau mobil yang nyaman saat mampir ke Al-Fariz Pamulang?';
                      setPrompt(q);
                      handleMapsGroundingSubmit(q);
                    }}
                    className="text-xs bg-gray-50 hover:bg-amber-50 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 font-medium transition"
                  >
                    🛵 Tips Parkir Motor & Akses
                  </button>
                </>
              )}

              {activeTab === 'search' && (
                <>
                  <button
                    onClick={() => {
                      const q = 'Tren kuliner pedas sambel ijo dadakan di Pamulang dan Tangerang Selatan';
                      setPrompt(q);
                      handleSearchGroundingSubmit(q);
                    }}
                    className="text-xs bg-gray-50 hover:bg-amber-50 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 font-medium transition"
                  >
                    🔥 Tren Kuliner Sambel Ijo Pamulang
                  </button>
                  <button
                    onClick={() => {
                      const q = 'Bahan-bahan rahasia ayam geprek sambel ijo Nusantara cabai rawit minyak bawang';
                      setPrompt(q);
                      handleSearchGroundingSubmit(q);
                    }}
                    className="text-xs bg-gray-50 hover:bg-amber-50 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 font-medium transition"
                  >
                    🌿 Racikan Sambel Ijo Otentik
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Prompt Input Box */}
          <div className="space-y-2">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  activeTab === 'advisor'
                    ? 'Tanyakan rekomendasi paket, porsi acara, atau level pedas...'
                    : activeTab === 'maps'
                    ? 'Tanyakan lokasi, patokan arah, atau transportasi ke UNPAM...'
                    : 'Tanyakan tren kuliner seputar Pamulang...'
                }
                rows={3}
                className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-gray-300 focus:border-[#781519] focus:ring-[#781519] pr-12"
              />
              <button
                disabled={loading || !prompt.trim()}
                onClick={executeCurrentTabAction}
                className="absolute right-3 bottom-4 p-2 bg-[#781519] hover:bg-[#5e0d10] text-white rounded-xl disabled:opacity-40 transition shadow"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>

            {/* High Thinking Mode Toggle */}
            {activeTab === 'advisor' && (
              <div className="flex items-center justify-between text-xs text-gray-600 bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-amber-700" />
                  <span className="font-semibold text-gray-800">Mode Analisis Mendalam (Thinking Mode)</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={deepThinking}
                    onChange={(e) => setDeepThinking(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#781519]"></div>
                </label>
              </div>
            )}
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="p-8 text-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#781519]" />
              <p className="text-xs text-gray-500 font-medium">
                Gemini sedang memproses data kuliner & grounding teraktual...
              </p>
            </div>
          )}

          {/* Results Display */}
          {advisorResponse && activeTab === 'advisor' && (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#781519]">
                <Lightbulb className="w-4 h-4 text-[#F5C518]" />
                <span>Rekomendasi dari Mas Al-Fariz:</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                {advisorResponse.text}
              </div>
              {advisorResponse.thinkingNotes && (
                <div className="mt-3 pt-3 border-t border-amber-200/60 text-[11px] text-amber-900 bg-white/70 p-2.5 rounded-lg">
                  <strong className="block text-[10px] uppercase tracking-wider text-amber-700">Catatan Pemikiran AI:</strong>
                  {advisorResponse.thinkingNotes}
                </div>
              )}
            </div>
          )}

          {mapsResponse && activeTab === 'maps' && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Hasil Navigasi & Lokasi (Google Maps Grounding):</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                {mapsResponse.text}
              </div>

              {mapsResponse.mapsLinks.length > 0 && (
                <div className="pt-2 border-t border-emerald-200/60 space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    Tautan Google Maps Terverifikasi:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {mapsResponse.mapsLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{link.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {searchResponse && activeTab === 'search' && (
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                <Search className="w-4 h-4 text-blue-700" />
                <span>Hasil Pencarian Web (Google Search Grounding):</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                {searchResponse.text}
              </div>

              {searchResponse.citations.length > 0 && (
                <div className="pt-2 border-t border-blue-200/60 space-y-1.5">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                    Sumber & Sitasi Web:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {searchResponse.citations.map((cite, idx) => (
                      <a
                        key={idx}
                        href={cite.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-blue-300 text-blue-800 text-xs font-semibold hover:bg-blue-100 transition shadow-sm"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{cite.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
