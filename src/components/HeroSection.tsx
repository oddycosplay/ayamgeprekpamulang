import React from 'react';
import { Clock, MapPin, Sparkles } from 'lucide-react';
import heroImg from '../produk/geprek-paket-nasi.jpg';

interface HeroSectionProps {
  onOpenAdvisor: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAdvisor }) => {
  return (
    <section className="relative bg-[#781519] text-white overflow-hidden pt-8 pb-16 lg:py-24" id="hero">
      {/* Watermark Background Typography */}
      <div className="hero-watermark top-12 left-10 select-none">Al-Fariz</div>

      {/* Ambient light effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#5e0d10] rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F5C518]/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 text-xs sm:text-sm text-amber-100/90 font-medium">
          <div className="flex items-center gap-2 bg-black/25 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5C518]" />
            <span>Buka Setiap Hari <strong>15.00 - 22.00 WIB</strong></span>
          </div>
          <a
            href="#lokasi"
            className="flex items-center gap-2 bg-black/25 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10 hover:border-[#F5C518] transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F5C518]" />
            <span className="truncate max-w-[250px] xs:max-w-none">Depan Kampus UNPAM Pamulang (Samping Mie Ayam)</span>
          </a>
        </div>

        {/* Hero Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8 items-center">
          {/* Left Column: Circular Food Platter Display */}
          <div className="lg:col-span-6 flex justify-center relative">
            <div className="relative w-[260px] h-[260px] xs:w-[320px] xs:h-[320px] sm:w-[380px] sm:h-[380px] md:w-[460px] md:h-[460px] max-w-[85vw] max-h-[85vw] flex items-center justify-center">
              {/* Radial backdrop glow */}
              <div className="absolute inset-0 glow-radial rounded-full scale-110"></div>

              {/* Circular Cobek Wrapper */}
              <div className="relative w-full h-full rounded-full p-2.5 xs:p-3 sm:p-4 bg-gradient-to-tr from-[#3a080a] via-[#5e0d10] to-[#781519] border-4 border-amber-300/30 shadow-2xl flex items-center justify-center overflow-hidden">
                <img
                  src={heroImg}
                  alt="Ayam Geprek Sambel Ijo Al-Fariz Cobek Batu"
                  className="w-full h-full object-cover rounded-full shadow-inner transform hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Floating Rating Pill Badge */}
              <div className="absolute bottom-2 left-0 xs:bottom-4 xs:left-2 sm:bottom-10 sm:left-2 bg-[#F5C518] text-[#5e0d10] font-bold px-3 xs:px-4 py-1.5 xs:py-2 rounded-full shadow-xl flex items-center gap-1.5 xs:gap-2 border-2 border-white animate-float z-20">
                <span className="text-[11px] xs:text-xs sm:text-sm">Paket Geprek Ijo</span>
                <span className="inline-flex items-center text-[10px] xs:text-xs bg-[#781519] text-[#F5C518] px-1.5 xs:px-2 py-0.5 rounded-full font-black">
                  ★ 5.0
                </span>
              </div>

              {/* Decorative chili/kemangi badge */}
              <div className="absolute top-2 right-1 xs:top-4 xs:right-2 sm:top-8 sm:right-6 bg-white/10 backdrop-blur-md p-2 xs:p-3 rounded-2xl border border-white/20 shadow-lg hidden xs:block z-20">
                <div className="text-[10px] xs:text-[11px] font-bold text-amber-200">🌶️ Cabai Rawit Hijau Asli</div>
                <div className="text-[9px] xs:text-[10px] text-white/80">Diuleg Dadakan Panas-Panas</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Headline & Brand Title */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-5 sm:space-y-6">
            <div className="space-y-1">
              <span className="inline-block text-base sm:text-xl md:text-2xl font-bold tracking-wide text-white/90">
                Ayam Geprek Sambel Ijo
              </span>
              <h1 className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-normal text-[#F5C518] font-script tracking-wide leading-tight drop-shadow-md">
                Al-Fariz
              </h1>
            </div>

            <p className="text-sm xs:text-base sm:text-lg text-amber-50/90 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Kuliner gerobak otentik sambel ijo uleg dadakan khas Nusantara tepat di seberang Kampus Utama Universitas Pamulang. Gurih krispi, renyah nendang, pedas segar bikin melek, dan sangat ramah di kantong mahasiswa!
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href="#menu"
                className="bg-[#F5C518] hover:bg-[#e0b312] text-[#5e0d10] font-extrabold px-6 sm:px-8 py-3.5 rounded-full text-sm sm:text-base shadow-lg transition-all transform hover:-translate-y-0.5 text-center flex items-center justify-center"
              >
                Lihat Menu & Harga
              </a>
              <a
                href="#lokasi"
                className="bg-[#5e0d10]/80 hover:bg-black/40 text-white font-semibold px-5 sm:px-6 py-3.5 rounded-full text-sm sm:text-base border border-white/20 backdrop-blur-sm transition-all text-center flex items-center justify-center"
              >
                Petunjuk Arah (UNPAM)
              </a>
              <button
                onClick={onOpenAdvisor}
                className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-amber-200 font-semibold px-5 py-3.5 rounded-full text-xs sm:text-sm border border-amber-300/30 backdrop-blur-sm transition-all text-center"
              >
                <Sparkles className="w-4 h-4 text-[#F5C518]" />
                Tanya Menu AI
              </button>
            </div>

            {/* Menu Terfavorit Badge */}
            <div className="pt-4 flex items-center justify-center lg:justify-start">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 text-xs text-amber-100">
                <span>🔥 Menu Terfavorit:</span>
                <span className="bg-[#F5C518] text-[#5e0d10] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  Ayam Geprek Jumbo Ijo ★ 5.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
