import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useParallax } from '../hooks/useParallax.ts';
import promoImg from '../produk/geprek-original.jpg';

export const PromoTaglineBanner: React.FC = () => {
  // Parallax hook tracking banner container position in viewport
  const { ref: containerRef, offset } = useParallax<HTMLDivElement>({ speed: 0.2, clamp: 80 });

  return (
    <section
      ref={containerRef}
      className="py-14 lg:py-24 bg-white relative overflow-hidden border-t border-gray-100"
      id="promo-tagline"
    >
      {/* Background Decorative Ambient Watermark with subtle Parallax drift */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-100/60 font-black text-6xl sm:text-8xl md:text-9xl tracking-widest select-none pointer-events-none uppercase font-serif z-0 whitespace-nowrap will-change-transform max-w-full overflow-hidden"
        style={{
          transform: `translate3d(-50%, calc(-50% + ${offset * 0.2}px), 0)`,
        }}
      >
        AL-FARIZ
      </div>

      {/* Subtle ambient colored radial glow */}
      <div
        className="absolute -right-24 top-1/4 w-96 h-96 rounded-full bg-amber-100/50 filter blur-3xl pointer-events-none will-change-transform"
        style={{
          transform: `translate3d(0, ${offset * -0.3}px, 0)`,
        }}
      />
      <div
        className="absolute -left-20 bottom-10 w-80 h-80 rounded-full bg-red-100/40 filter blur-3xl pointer-events-none will-change-transform"
        style={{
          transform: `translate3d(0, ${offset * 0.35}px, 0)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Left Text Column with subtle parallax stabilization */}
          <div
            className="lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left z-10 transition-transform duration-100 ease-out will-change-transform"
            style={{
              transform: `translate3d(0, ${offset * 0.12}px, 0)`,
            }}
          >
            <div className="inline-block bg-[#F5C518] text-[#5e0d10] font-extrabold text-[10px] sm:text-xs px-3.5 py-1.5 rounded-full shadow-sm uppercase tracking-wide">
              Yuk Beli!
            </div>
            <h2 className="text-3xl xs:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight font-serif">
              Siang-Malam Enaknya <span className="text-[#781519] block sm:inline">Geprek Al-Fariz!</span>
            </h2>
            <p className="text-xs xs:text-sm md:text-base text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Order sekarang di GoFood & ShopeeFood atau mampir langsung ke gerobak depan UNPAM — cepat, pedas nampol, nikmat!
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                className="inline-flex items-center gap-2.5 bg-white border border-gray-300 hover:border-[#781519] text-gray-800 hover:text-[#781519] font-bold px-6 py-3 rounded-full text-xs sm:text-sm shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5"
                href="https://wa.me/628973816530?text=Halo%20Ayam%20Geprek%20Al-Fariz,%20saya%20mau%20pesan"
                rel="noopener noreferrer"
                target="_blank"
              >
                <MessageCircle className="w-4 h-4 text-[#781519] fill-current" />
                <span>Hubungi Kami</span>
              </a>
            </div>
          </div>

          {/* Right Circular Platter with Multi-Layer Parallax Elements */}
          <div className="lg:col-span-6 flex justify-center relative mt-2 lg:mt-0">
            <div className="relative w-[260px] h-[260px] xs:w-[320px] xs:h-[320px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] max-w-[85vw] max-h-[85vw] flex items-center justify-center">
              {/* Floating food items with varying parallax depths */}
              <div
                className="absolute -top-5 left-6 xs:-top-7 xs:left-10 text-xl xs:text-2xl select-none pointer-events-none opacity-85 filter drop-shadow transition-transform duration-100 ease-out will-change-transform z-20"
                style={{
                  transform: `translate3d(0, ${offset * -0.65}px, 0) rotate(${-12 + offset * 0.15}deg)`,
                }}
              >
                🍅
              </div>
              <div
                className="absolute -bottom-4 right-4 xs:-bottom-5 xs:right-8 text-xl xs:text-2xl select-none pointer-events-none opacity-85 filter drop-shadow transition-transform duration-100 ease-out will-change-transform z-20"
                style={{
                  transform: `translate3d(0, ${offset * 0.55}px, 0) rotate(${45 - offset * 0.12}deg)`,
                }}
              >
                🍃
              </div>
              <div
                className="absolute top-1/4 -right-3 text-lg select-none pointer-events-none opacity-75 filter blur-[0.3px] transition-transform duration-100 ease-out will-change-transform z-20 hidden sm:block"
                style={{
                  transform: `translate3d(0, ${offset * -0.4}px, 0) rotate(${12 + offset * 0.08}deg)`,
                }}
              >
                🍃
              </div>
              <div
                className="absolute bottom-1/4 -left-3 text-xl select-none pointer-events-none opacity-85 filter drop-shadow transition-transform duration-100 ease-out will-change-transform z-20 hidden sm:block"
                style={{
                  transform: `translate3d(0, ${offset * 0.35}px, 0) rotate(${-20 + offset * 0.1}deg)`,
                }}
              >
                🌶️
              </div>

              {/* Main Circular Food Platter with smooth counter-scroll parallax */}
              <div
                className="relative w-full h-full rounded-full p-2.5 xs:p-3 sm:p-4 bg-gradient-to-tr from-amber-200 via-amber-100 to-amber-50 border-4 border-amber-200 shadow-2xl flex items-center justify-center overflow-hidden transition-transform duration-100 ease-out will-change-transform"
                style={{
                  transform: `translate3d(0, ${offset * -0.25}px, 0)`,
                }}
              >
                <img
                  alt="Sajian Ayam Geprek Sambel Ijo Al-Fariz Spesial"
                  className="w-full h-full object-cover rounded-full shadow-inner transform hover:scale-105 transition-transform duration-500 ease-out"
                  src={promoImg}
                />
              </div>

              {/* Floating badges with distinct parallax offset depths */}
              <div
                className="absolute top-3 right-0 xs:top-6 xs:right-0 sm:top-8 sm:right-2 bg-[#F5C518] text-[#5e0d10] font-bold px-2.5 xs:px-3.5 py-1 xs:py-1.5 rounded-full shadow-lg flex items-center gap-1 border border-white text-[10px] xs:text-xs sm:text-sm z-30 transition-transform duration-100 ease-out will-change-transform"
                style={{
                  transform: `translate3d(0, ${offset * 0.28}px, 0)`,
                }}
              >
                <span className="text-[10px] xs:text-[11px] sm:text-xs">Pedasnya Nagih!</span>
                <span className="bg-[#781519] text-[#F5C518] px-1 xs:px-1.5 py-0.5 rounded-full text-[9px] xs:text-[10px] sm:text-xs font-black">★ 5.0</span>
              </div>

              <div
                className="absolute bottom-4 left-0 xs:bottom-8 xs:left-0 sm:bottom-10 sm:left-2 bg-[#F5C518] text-[#5e0d10] font-bold px-2.5 xs:px-3.5 py-1 xs:py-1.5 rounded-full shadow-lg flex items-center gap-1 border border-white text-[10px] xs:text-xs sm:text-sm z-30 transition-transform duration-100 ease-out will-change-transform"
                style={{
                  transform: `translate3d(0, ${offset * -0.45}px, 0)`,
                }}
              >
                <span className="text-[10px] xs:text-[11px] sm:text-xs">Paket Geprek Ijo</span>
                <span className="bg-[#781519] text-[#F5C518] px-1 xs:px-1.5 py-0.5 rounded-full text-[9px] xs:text-[10px] sm:text-xs font-black">★ 5.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
