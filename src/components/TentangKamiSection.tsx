import React from 'react';
import tentangImg from '../produk/geprek-alacarte.jpg';
import { BookOpen, MapPin } from 'lucide-react';

export const TentangKamiSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden" id="tentang-kami">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-[#781519] font-bold text-xs uppercase tracking-widest block mb-2">
                Tentang Kami
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1F1F1F] font-serif leading-tight">
                Ayam Geprek Sambel Ijo<br className="hidden sm:inline" /> Al-Fariz
              </h2>
            </div>

            <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
              Berawal dari cita rasa otentik gerobak kuliner khas Nusantara di seberang kampus Universitas Pamulang (UNPAM), <strong>Al-Fariz</strong> menghadirkan sajian ayam goreng tepung super renyah yang dimemarkan bersama sambel ijo cabai rawit pilihan. Ulegan cabai segar bercampur gurihnya bawang dan minyak panas menghasilkan aroma harum menggugah selera.
            </p>

            <p className="text-gray-600 leading-relaxed text-base">
              Setiap porsi diracik dari bahan baku ayam segar harian tanpa bahan pengawet kimia, dengan minyak goreng berkualitas yang selalu diperhatikan kejernihannya. Pilihan nomor wahid bagi mahasiswa, dosen, serta warga Pamulang yang mencari hidangan cepat, nampol, higienis, dan terjangkau setiap hari.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 sm:pt-4 flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 sm:gap-4">
              <a
                href="#lokasi"
                className="inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-[#e0b312] text-[#5e0d10] font-bold px-6 sm:px-7 py-3 rounded-full text-xs sm:text-sm shadow transition transform hover:-translate-y-0.5 text-center"
              >
                <MapPin className="w-4 h-4" />
                Info Lokasi Gerobak
              </a>
              <a
                href="#menu"
                className="inline-flex items-center justify-center gap-2 bg-[#781519] hover:bg-[#5e0d10] text-white font-bold px-6 sm:px-7 py-3 rounded-full text-xs sm:text-sm shadow transition transform hover:-translate-y-0.5 text-center"
              >
                <BookOpen className="w-4 h-4" />
                Lihat Menu Lengkap
              </a>
            </div>

            {/* UMKM Service Badges */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-5 rounded-2xl bg-[#FCFAF7] border border-amber-200/60 shadow-sm grid grid-cols-3 gap-1 sm:gap-4 divide-x divide-amber-200/50 text-center">
              <div className="px-1 sm:px-2">
                <span className="block text-lg xs:text-xl sm:text-2xl font-extrabold text-[#781519]">100%</span>
                <span className="text-[10px] sm:text-xs text-gray-500 font-medium leading-tight block">Bahan Segar Tiap Hari</span>
              </div>
              <div className="px-1 sm:px-2">
                <span className="block text-lg xs:text-xl sm:text-2xl font-extrabold text-[#781519]">200+</span>
                <span className="text-[10px] sm:text-xs text-gray-500 font-medium leading-tight block">Porsi Dipesan / Hari</span>
              </div>
              <div className="px-1 sm:px-2">
                <span className="block text-lg xs:text-xl sm:text-2xl font-extrabold text-[#781519]">Rp 15k+</span>
                <span className="text-[10px] sm:text-xs text-gray-500 font-medium leading-tight block">Ramah Kantong UNPAM</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Portrait with Yellow Graphic & Seal */}
          <div className="lg:col-span-5 flex justify-center relative mt-4 lg:mt-0">
            <div className="relative w-[260px] xs:w-[300px] sm:w-[380px] h-[300px] xs:h-[340px] sm:h-[420px] flex items-center justify-center">
              {/* Yellow Circular Background Graphic */}
              <div className="w-[240px] xs:w-[280px] sm:w-[340px] h-[240px] xs:h-[280px] sm:h-[340px] rounded-full bg-[#F5C518] absolute z-0 shadow-lg"></div>

              {/* Founder / Cook Mascot Illustration Avatar */}
              <div className="relative z-10 w-[220px] xs:w-[260px] sm:w-[320px] h-[220px] xs:h-[260px] sm:h-[320px] rounded-full overflow-hidden border-4 border-white shadow-2xl bg-[#781519] flex items-center justify-center group">
                <img
                  src={tentangImg}
                  alt="Mas Al-Fariz - Founder & Peracik Sambel Ijo Al-Fariz"
                  className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end items-center text-center p-3 sm:p-5 pb-6 sm:pb-10 text-white">
                  <h4 className="font-extrabold text-base xs:text-lg sm:text-xl text-[#F5C518] drop-shadow leading-tight">
                    Mas Al-Fariz
                  </h4>
                  <p className="text-[9px] xs:text-[10px] sm:text-xs text-amber-100 font-medium leading-snug mt-0.5">
                    Founder & Peracik Sambel Ijo Al-Fariz
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-white/90 mt-1 italic hidden sm:block">
                    “Pedasnya jujur, gurihnya nikmat!”
                  </p>
                </div>
              </div>

              {/* Floating Seal Badge */}
              <div className="absolute -bottom-2 right-0 xs:right-2 sm:bottom-2 sm:right-0 z-20 w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1.5 shadow-2xl border-2 border-[#781519] flex items-center justify-center transform rotate-6 hover:rotate-12 transition-transform">
                <div className="w-full h-full rounded-full bg-[#781519] text-center flex flex-col items-center justify-center p-1 text-white">
                  <span className="text-[8px] xs:text-[9px] font-bold uppercase tracking-wider text-[#F5C518]">GEPREK</span>
                  <span className="text-[10px] xs:text-xs font-serif font-black leading-tight text-white">AL-FARIZ</span>
                  <span className="text-[7px] xs:text-[8px] text-amber-200">PAMULANG</span>
                </div>
              </div>

              {/* Floating decorative emojis */}
              <div className="absolute top-2 right-2 text-xl xs:text-2xl animate-bounce select-none">🌶️</div>
              <div className="absolute bottom-12 xs:bottom-16 left-0 text-lg xs:text-xl select-none">🍃</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
