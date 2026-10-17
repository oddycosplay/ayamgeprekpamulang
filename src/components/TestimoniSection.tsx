import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  MessageSquarePlus,
  ThumbsUp,
  X,
  Sparkles,
  Quote,
  Flame,
  ShieldCheck,
  Utensils,
  Heart,
} from 'lucide-react';
import { TESTIMONIALS } from '../data/menuData.ts';
import { Testimonial } from '../types.ts';

type FilterCategory = 'all' | 'rating5' | 'campus' | 'locals';

export const TestimoniSection: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Review submission state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerRole, setReviewerRole] = useState('Mahasiswa UNPAM');
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState('');
  const [selectedTag, setSelectedTag] = useState('Sambel Nampol 🌶️');
  const [selectedFavoriteMenu, setSelectedFavoriteMenu] = useState('Paket Geprek + Nasi');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Load custom reviews from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('alfariz_custom_reviews');
      if (stored) {
        const parsed: Testimonial[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTestimonials([...parsed, ...TESTIMONIALS]);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Filtered testimonials
  const filteredTestimonials = testimonials.filter((t) => {
    if (activeFilter === 'rating5') return (t.rating || 5) >= 5;
    if (activeFilter === 'campus') {
      const text = `${t.role} ${t.name}`.toLowerCase();
      return text.includes('unpam') || text.includes('mahasiswa') || text.includes('kampus') || text.includes('dosen');
    }
    if (activeFilter === 'locals') {
      const text = `${t.role} ${t.name}`.toLowerCase();
      return text.includes('warga') || text.includes('pamulang') || text.includes('permai') || text.includes('ojol') || text.includes('alumni');
    }
    return true;
  });

  // Track active slide index on scroll
  const handleScroll = () => {
    if (sliderRef.current) {
      const scrollLeft = sliderRef.current.scrollLeft;
      const cardWidth = 340; // approx card width + gap
      const index = Math.round(scrollLeft / cardWidth);
      setActiveSlideIndex(Math.min(Math.max(0, index), filteredTestimonials.length - 1));
    }
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  const scrollToSlide = (index: number) => {
    if (sliderRef.current) {
      const cardWidth = 340;
      sliderRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    const gradients = [
      'from-amber-500 to-red-600',
      'from-emerald-500 to-teal-700',
      'from-blue-500 to-indigo-700',
      'from-purple-500 to-pink-600',
      'from-rose-500 to-red-700',
      'from-orange-500 to-amber-600',
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

    const newRev: Testimonial = {
      id: `rev-${Date.now()}`,
      name: reviewerName.trim(),
      role: reviewerRole.trim() || 'Pelanggan Setia Pamulang',
      comment: reviewComment.trim(),
      rating: selectedRating,
      highlightTag: selectedTag,
      favoriteMenu: selectedFavoriteMenu,
      date: 'Baru saja',
      avatarColor: randomGradient,
    };

    const updated = [newRev, ...testimonials];
    setTestimonials(updated);

    try {
      const existingStored = localStorage.getItem('alfariz_custom_reviews');
      const parsedStored: Testimonial[] = existingStored ? JSON.parse(existingStored) : [];
      localStorage.setItem('alfariz_custom_reviews', JSON.stringify([newRev, ...parsedStored]));
    } catch {
      // ignore
    }

    // Reset and close
    setReviewerName('');
    setReviewComment('');
    setSelectedRating(5);
    setIsReviewModalOpen(false);
    setShowSuccessToast(true);

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4500);

    // Reset filter to 'all' and scroll carousel to front
    setActiveFilter('all');
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  // Calculate stats
  const totalReviews = testimonials.length;
  const avgRating = (
    testimonials.reduce((acc, curr) => acc + (curr.rating || 5), 0) / (totalReviews || 1)
  ).toFixed(1);

  const fiveStarCount = testimonials.filter((t) => (t.rating || 5) === 5).length;
  const fourStarCount = testimonials.filter((t) => (t.rating || 5) === 4).length;
  const fiveStarPercent = Math.round((fiveStarCount / (totalReviews || 1)) * 100);
  const fourStarPercent = Math.round((fourStarCount / (totalReviews || 1)) * 100);

  return (
    <section
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#FCFAF7] via-[#FFFDF9] to-[#FCFAF7] border-t border-amber-200/50 relative overflow-hidden"
      id="testimoni"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-red-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#781519]/10 border border-[#781519]/20 text-[#781519] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-xs">
            <Flame className="w-3.5 h-3.5 text-[#781519]" />
            <span>Testimoni</span>
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F1F1F] font-serif leading-tight">
            Apa Kata <span className="text-[#781519]">Pelanggan Setia?</span>
          </h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-[#F5C518] to-amber-500 rounded-full mx-auto" />
          <p className="text-xs xs:text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
            Cerita nyata dari ribuan porsi yang kami racik dengan uleg dadakan setiap hari di depan gerbang utama Kampus UNPAM Pamulang.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
          {/* Left Column: Summary Dashboard & Credibility Card */}
          <div className="lg:col-span-4 space-y-4">
            {/* Credibility & Rating Score Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 xs:p-5 sm:p-7 border border-amber-200/90 shadow-xl shadow-amber-900/5 space-y-4 sm:space-y-5 relative overflow-hidden group">
              {/* Subtle card decorative corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-100/50 to-transparent rounded-bl-3xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-gray-100 relative">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-[#781519] font-serif tracking-tight">
                      {avgRating}
                    </span>
                    <span className="text-sm font-bold text-gray-400">/ 5.0</span>
                  </div>
                  <p className="text-xs font-bold text-gray-600 mt-1">
                    Skor Kepuasan ({totalReviews}+ Ulasan)
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <div className="flex items-center justify-end text-[#F5C518] drop-shadow-sm">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current text-[#F5C518]" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    99.4% Puas
                  </span>
                </div>
              </div>

              {/* Star Breakdown Meter */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-14 font-bold text-gray-700 flex items-center gap-1">
                    5 <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden p-0.5">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-[#F5C518] h-full rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${fiveStarPercent}%` }}
                    />
                  </div>
                  <span className="font-extrabold text-gray-800 w-10 text-right">{fiveStarPercent}%</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-14 font-bold text-gray-700 flex items-center gap-1">
                    4 <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden p-0.5">
                    <div
                      className="bg-gradient-to-r from-amber-300 to-amber-400 h-full rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${fourStarPercent}%` }}
                    />
                  </div>
                  <span className="font-extrabold text-gray-800 w-10 text-right">{fourStarPercent}%</span>
                </div>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-gray-600 font-medium">
                <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-2.5 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>100% Uleg Dadakan</span>
                </div>
                <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-2.5 flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                  <span>Favorit UNPAM</span>
                </div>
              </div>

              {/* Write Review CTA Button */}
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#781519] to-[#911a20] hover:from-[#5e0d10] hover:to-[#781519] text-[#F5C518] font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-98"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Beri Rating & Ulasan Anda</span>
              </button>
            </div>
          </div>

          {/* Right Column: Carousel Slide with Enhanced Cards */}
          <div className="lg:col-span-8 flex flex-col gap-4 relative">
            {/* Top Bar: Category Filter Chips & Slide Navigation Arrows */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200/70">
              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeFilter === 'all'
                      ? 'bg-[#781519] text-[#F5C518] shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-300 hover:text-gray-900'
                  }`}
                >
                  Semua ({testimonials.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('rating5')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                    activeFilter === 'rating5'
                      ? 'bg-[#781519] text-[#F5C518] shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-300 hover:text-gray-900'
                  }`}
                >
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>Bintang 5 ({fiveStarCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('campus')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeFilter === 'campus'
                      ? 'bg-[#781519] text-[#F5C518] shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-300 hover:text-gray-900'
                  }`}
                >
                  🎓 Mahasiswa & Kampus
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('locals')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeFilter === 'locals'
                      ? 'bg-[#781519] text-[#F5C518] shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-300 hover:text-gray-900'
                  }`}
                >
                  🏠 Warga Pamulang
                </button>
              </div>

              {/* Slider Navigation Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-[11px] font-bold text-gray-500 mr-1 hidden sm:inline">
                  {filteredTestimonials.length} Ulasan
                </span>
                <button
                  type="button"
                  aria-label="Testimoni Sebelumnya"
                  onClick={scrollLeft}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-200 hover:border-[#781519] hover:bg-[#781519] hover:text-[#F5C518] text-gray-700 shadow-sm transition-all flex items-center justify-center cursor-pointer group active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-0.5" />
                </button>
                <button
                  type="button"
                  aria-label="Testimoni Selanjutnya"
                  onClick={scrollRight}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-200 hover:border-[#781519] hover:bg-[#781519] hover:text-[#F5C518] text-gray-700 shadow-sm transition-all flex items-center justify-center cursor-pointer group active:scale-95"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* Carousel Slider Cards Container */}
            <div
              ref={sliderRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto gap-5 pb-5 pt-1 scroll-smooth select-none no-scrollbar snap-x snap-mandatory"
            >
              {filteredTestimonials.map((rev, index) => {
                const itemRating = Math.min(5, Math.max(1, rev.rating || 5));
                const avatarGradient =
                  rev.avatarColor ||
                  [
                    'from-amber-500 to-red-600',
                    'from-emerald-500 to-teal-700',
                    'from-blue-500 to-indigo-700',
                    'from-purple-500 to-pink-600',
                    'from-rose-500 to-red-700',
                  ][index % 5];

                return (
                  <div
                    key={rev.id}
                    className="w-[295px] sm:w-[335px] flex-shrink-0 snap-start bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-300 flex flex-col justify-between space-y-4 group relative overflow-hidden transform hover:-translate-y-1"
                  >
                    {/* Top Watermark Quote Decoration */}
                    <Quote className="absolute top-4 right-4 w-12 h-12 text-[#781519]/5 group-hover:text-[#781519]/10 transition-colors pointer-events-none" />

                    <div className="space-y-3.5 relative z-10">
                      {/* Highlight Badge & Date Header */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-extrabold text-[#781519] bg-gradient-to-r from-amber-50 to-red-50 border border-amber-200/80 px-2.5 py-1 rounded-full shadow-xs">
                          {rev.highlightTag || 'Rasa Juara 🏆'}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-400">
                          {rev.date || 'Terverifikasi'}
                        </span>
                      </div>

                      {/* 1 - 5 Star Rating System Header */}
                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-0.5">
                            <span className="sr-only">Rating {itemRating} dari 5 bintang</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                aria-hidden="true"
                                className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                                  star <= itemRating
                                    ? 'fill-[#F5C518] text-[#F5C518]'
                                    : 'fill-gray-100 text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] font-black text-gray-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            {itemRating}.0
                          </span>
                        </div>

                        {/* Verified Authenticity Tag */}
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Otentik</span>
                        </span>
                      </div>

                      {/* Testimonial Quote */}
                      <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed italic line-clamp-4 pt-1 font-sans">
                        “{rev.comment}”
                      </p>

                      {/* Favorite Menu Tag if available */}
                      {rev.favoriteMenu && (
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-900 bg-amber-50/80 border border-amber-200/60 px-2.5 py-1 rounded-xl">
                          <Utensils className="w-3 h-3 text-amber-700 flex-shrink-0" />
                          <span className="truncate">{rev.favoriteMenu}</span>
                        </div>
                      )}
                    </div>

                    {/* Author Profile Footer */}
                    <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Gradient Avatar with Initial */}
                        <div
                          className={`w-9 h-9 rounded-full bg-gradient-to-tr ${avatarGradient} flex items-center justify-center text-xs font-black text-white shadow-sm flex-shrink-0 border-2 border-white`}
                        >
                          {rev.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs font-black text-gray-900 group-hover:text-[#781519] transition-colors truncate">
                            {rev.name}
                          </h3>
                          <p className="text-[11px] text-gray-500 font-medium truncate">
                            {rev.role}
                          </p>
                        </div>
                      </div>

                      <div className="text-[10px] text-gray-400 font-semibold bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 flex-shrink-0">
                        UNPAM
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Slider Dots Indicator / Interactive Pagination */}
            <div className="flex items-center justify-center gap-1 pt-2">
              {filteredTestimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Ke slide ${idx + 1}`}
                  onClick={() => scrollToSlide(idx)}
                  className="w-10 h-10 flex items-center justify-center cursor-pointer p-2 focus:outline-none touch-manipulation"
                >
                  <span
                    className={`h-2 rounded-full transition-all duration-300 block ${
                      activeSlideIndex === idx
                        ? 'w-6 bg-[#781519]'
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Mobile Swipe Hint */}
            <div className="text-center sm:hidden text-[11px] text-gray-500 font-medium flex items-center justify-center gap-1.5 pt-1">
              <ThumbsUp className="w-3.5 h-3.5 text-[#781519]" />
              <span>Geser ke samping untuk melihat ulasan lainnya</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-[#1F1F1F] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#F5C518]/50 flex items-center gap-3 animate-pop-in">
          <Sparkles className="w-5 h-5 text-[#F5C518] flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">
            Terima kasih! Ulasan bintang Anda telah berhasil diterbitkan dan langsung tampil di slide.
          </span>
        </div>
      )}

      {/* Modal: Beri Ulasan Bintang 1-5 */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative space-y-5 animate-pop-in max-h-[90vh] overflow-y-auto no-scrollbar">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#781519] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                  Ulasan Pelanggan Al-Fariz
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 font-serif mt-1">
                  Beri Rating & Ulasan Anda
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddReview} className="space-y-4">
              {/* Star Rating Picker (1 to 5) */}
              <div className="text-center py-3 bg-gradient-to-b from-[#FFF9F0] to-amber-50/50 rounded-2xl border border-amber-200/80 p-4 shadow-inner">
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Pilih Rating Kepuasan Anda:
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || selectedRating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSelectedRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 cursor-pointer transform hover:scale-125 transition-transform"
                        title={`${star} Bintang`}
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? 'fill-[#F5C518] text-[#F5C518]'
                              : 'fill-gray-200 text-gray-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs font-black text-[#781519] mt-2">
                  {selectedRating === 5 && '⭐⭐⭐⭐⭐ Sempurna! Pedas & Gurihnya Juara'}
                  {selectedRating === 4 && '⭐⭐⭐⭐ Sangat Enak & Porsi Puas'}
                  {selectedRating === 3 && '⭐⭐⭐ Cukup Enak & Standar'}
                  {selectedRating === 2 && '⭐⭐ Perlu Ditingkatkan'}
                  {selectedRating === 1 && '⭐ Kurang Puas'}
                </p>
              </div>

              {/* Quick Highlight Tag Picker */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Label Pengalaman:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Sambel Nampol 🌶️',
                    'Porsi Kenyang 🍚',
                    'Ayam Super Krispi 🍗',
                    'Minyak Bawang Mantap 🧄',
                    'Pelayanan Ramah ⚡',
                    'Langganan UNPAM ❤️',
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className={`text-[11px] px-2.5 py-1 rounded-full font-bold border transition cursor-pointer ${
                        selectedTag === tag
                          ? 'bg-[#781519] text-[#F5C518] border-[#781519]'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nama Anda <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rian Pratama"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#781519]/20 focus:border-[#781519]"
                />
              </div>

              {/* Role/Status Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Status / Asal Pelanggan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Mahasiswa UNPAM / Warga Pamulang"
                  value={reviewerRole}
                  onChange={(e) => setReviewerRole(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#781519]/20 focus:border-[#781519]"
                />
              </div>

              {/* Favorite Menu Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Menu Yang Dipesan
                </label>
                <select
                  value={selectedFavoriteMenu}
                  onChange={(e) => setSelectedFavoriteMenu(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#781519]/20 focus:border-[#781519] bg-white cursor-pointer"
                >
                  <option value="Paket Geprek + Nasi">Paket Geprek + Nasi (Rp 17.000)</option>
                  <option value="Ayam Geprek Saja">Ayam Geprek Saja (Rp 15.000)</option>
                  <option value="Paket Box Acara Kampus">Pesanan Box Acara UNPAM</option>
                </select>
              </div>

              {/* Comment Textarea */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Ulasan / Komentar <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ceritakan pengalaman Anda menikmati kepedasan dan kerenyahan Ayam Geprek Sambel Ijo Al-Fariz..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#781519]/20 focus:border-[#781519] resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#781519] to-[#911a20] hover:from-[#5e0d10] hover:to-[#781519] text-[#F5C518] font-bold text-xs shadow-md hover:shadow-lg transition cursor-pointer active:scale-98"
                >
                  Kirim Ulasan Bintang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
