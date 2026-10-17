import React from 'react';
import { MapPin, Clock, Sparkles } from 'lucide-react';
import { useParallax } from '../hooks/useParallax.ts';
import citaRasaImg from '../produk/cita-rasa-banner.webp';

export const CitaRasaBanner: React.FC = () => {
  // Parallax hook tracking banner container position in viewport
  const { ref: containerRef, offset } = useParallax<HTMLDivElement>({ speed: 0.18, clamp: 75 });

  return (
    <section
      ref={containerRef}
      className="py-12 lg:py-16 bg-white relative overflow-hidden"
      id="cita-rasa"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Yellow Gradient Banner Container */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#FFF59D] via-[#FDD835] to-[#F59E0B] p-5 sm:p-8 lg:p-12 shadow-xl border border-amber-200/60 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-12">
          {/* Parallax Ambient Background Glow */}
          <div
            className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/20 filter blur-2xl pointer-events-none transition-transform duration-100 ease-out will-change-transform"
            style={{
              transform: `translate3d(0, ${offset * 0.45}px, 0)`,
            }}
          />
          <div
            className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full bg-[#781519]/10 filter blur-3xl pointer-events-none transition-transform duration-100 ease-out will-change-transform"
            style={{
              transform: `translate3d(0, ${offset * -0.35}px, 0)`,
            }}
          />

          {/* Floating Parallax Elements (Leaves & Chili) with varied depth speeds */}
          <div
            className="absolute -top-3 left-8 text-2xl select-none pointer-events-none opacity-85 filter drop-shadow transition-transform duration-100 ease-out will-change-transform hidden sm:block"
            style={{
              transform: `translate3d(0, ${offset * -0.6}px, 0) rotate(${-12 + offset * 0.12}deg)`,
            }}
          >
            🍃
          </div>
          <div
            className="absolute top-1/2 left-1/4 text-xl select-none pointer-events-none opacity-75 filter blur-[0.3px] transition-transform duration-100 ease-out will-change-transform hidden sm:block"
            style={{
              transform: `translate3d(0, ${offset * 0.45}px, 0) rotate(${45 - offset * 0.1}deg)`,
            }}
          >
            🍃
          </div>
          <div
            className="absolute -bottom-3 left-24 text-2xl select-none pointer-events-none opacity-85 transition-transform duration-100 ease-out will-change-transform hidden sm:block"
            style={{
              transform: `translate3d(0, ${offset * -0.35}px, 0) rotate(${12 + offset * 0.08}deg)`,
            }}
          >
            🍃
          </div>
          <div
            className="absolute top-6 right-12 text-xl select-none pointer-events-none opacity-70 transition-transform duration-100 ease-out will-change-transform hidden sm:block"
            style={{
              transform: `translate3d(0, ${offset * 0.55}px, 0) rotate(${35 + offset * 0.15}deg)`,
            }}
          >
            🍃
          </div>
          <div
            className="absolute bottom-6 right-1/3 text-2xl select-none pointer-events-none opacity-80 transition-transform duration-100 ease-out will-change-transform hidden sm:block"
            style={{
              transform: `translate3d(0, ${offset * -0.4}px, 0) rotate(${-8 + offset * 0.1}deg)`,
            }}
          >
            🌶️
          </div>

          {/* Left: Circular Plate Food Presentation with multi-layer 3D parallax depth */}
          <div className="flex-shrink-0 relative z-10 flex items-center justify-center">
            {/* Parallax Background Aura Layer */}
            <div
              className="absolute -inset-3 rounded-full bg-amber-400/30 filter blur-xl transition-transform duration-100 ease-out will-change-transform"
              style={{
                transform: `translate3d(0, ${offset * -0.15}px, 0) scale(${1 + Math.abs(offset) * 0.001})`,
              }}
            />

            {/* Parallax Main Platter */}
            <div
              className="relative w-48 h-48 xs:w-56 xs:h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full p-2 bg-white/50 backdrop-blur-sm shadow-2xl border-4 border-white/90 flex items-center justify-center transform hover:scale-105 transition-all duration-300 ease-out will-change-transform"
              style={{
                transform: `translate3d(0, ${offset * -0.3}px, 0)`,
              }}
            >
              <img
                src={citaRasaImg}
                alt="Cita Rasa Asli Ayam Geprek Sambel Ijo Al-Fariz Pamulang"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover rounded-full shadow-md"
              />

              {/* Floating micro-badge with parallax counter movement */}
              <div
                className="absolute -bottom-2 right-1 sm:right-4 bg-[#781519] text-[#F5C518] px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black shadow-lg border border-amber-300 flex items-center gap-1 transition-transform duration-100 ease-out will-change-transform"
                style={{
                  transform: `translate3d(0, ${offset * 0.2}px, 0)`,
                }}
              >
                <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-current" />
                <span>100% Uleg Dadakan</span>
              </div>
            </div>
          </div>

          {/* Right: Text & Details with slight depth stabilization */}
          <div
            className="relative z-10 flex-1 text-center md:text-left space-y-3 sm:space-y-4 max-w-2xl transition-transform duration-100 ease-out will-change-transform"
            style={{
              transform: `translate3d(0, ${offset * 0.12}px, 0)`,
            }}
          >
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#781519]/10 text-[#781519] font-extrabold text-[10px] sm:text-xs tracking-wider uppercase mb-1.5 sm:mb-2">
                Kuliner Khas Nusantara
              </span>
              <h2 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F1F1F] font-serif leading-tight tracking-tight">
                Cita Rasa Asli Pedas Gurih Sambel Ijo di Pamulang
              </h2>
              <p className="text-xs sm:text-sm text-gray-800/90 font-medium mt-1.5 sm:mt-2 leading-relaxed">
                Racikan cabai rawit hijau segar dadakan diuleg di cobek batu dengan lumuran minyak panas bawang gurih harum menggugah selera.
              </p>
            </div>

            {/* Location and Opening Hours */}
            <div className="pt-1 sm:pt-2 space-y-2 text-xs sm:text-sm text-gray-900 font-semibold">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#781519] text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm">
                  <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                </div>
                <span className="text-xs sm:text-sm">Jl. Surya Kencana No. 27, Pamulang Barat (Depan Kampus Utama UNPAM)</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#781519] text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm">
                  <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                </div>
                <span className="text-xs sm:text-sm">Senin - Minggu jam 15.00 - 22.00 WIB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
