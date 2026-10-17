import React from 'react';
import tentangImg from '../produk/geprek-alacarte.jpg';
import { Flame, Sparkles, CheckCircle2, ShieldCheck, Heart, MapPin } from 'lucide-react';

export const RahasiaRasaSection: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-white border-t border-gray-100 relative overflow-hidden" id="rahasia">
      {/* Anchor for backward compatibility with navigation */}
      <div id="tentang-kami" className="absolute -top-20" />
      <div id="keunggulan" className="absolute -top-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Text & 3 Secret Sauce Highlights */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-[#781519] font-extrabold text-xs uppercase tracking-widest block">
                Rahasia Kenikmatan Al-Fariz
              </span>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-gray-900 font-serif leading-tight">
                Kenapa Sambel Ijo Uleg Dadakan Kami Bikin Banyak Orang Ketagihan?
              </h2>
              <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed pt-1">
                Bukan sulap, bukan bahan kimia instan. Mas Al-Fariz mempertahankan cita rasa otentik sejak hari pertama melayani mahasiswa UNPAM dan warga Pamulang:
              </p>
            </div>

            {/* 3 Keunggulan Utama */}
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#781519] text-[#F5C518] flex items-center justify-center flex-shrink-0 font-black text-base shadow-sm">
                  1
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-gray-900 mb-1">
                    Cabai Rawit Hijau Asli Diuleg Dadakan Saat Dipesan
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Bukan sambal botolan atau cabai giling kemarin. Cabai rawit hijau segar langsung digerus kasar di atas cobek batu begitu kamu pesan, disiram lumuran minyak bawang panas mendesis yang harum menggugah selera!
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F5C518] text-[#5e0d10] flex items-center justify-center flex-shrink-0 font-black text-base shadow-sm">
                  2
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-gray-900 mb-1">
                    Ayam Krispi Bumbu Kuning Meresap Sampai ke Tulang
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Ayam segar harian dimarinasi rempah tradisional Nusantara pilihan, digoreng dengan baluran tepung renyah berjam-jam tanpa bahan pengawet.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 font-black text-base shadow-sm">
                  3
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-gray-900 mb-1">
                    Porsi Puas & Harga Sangat Bersahabat Mahasiswa
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Mulai Rp 15.000 sudah bisa makan kenyang nikmat tepat di seberang Kampus Utama UNPAM. Higienis, cepat, dan pas buat santap siang maupun makan malam.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-2 grid grid-cols-3 gap-2 text-center p-3 rounded-2xl bg-gray-50 border border-gray-200">
              <div>
                <span className="block text-base sm:text-xl font-black text-[#781519]">100%</span>
                <span className="text-[10px] sm:text-xs text-gray-600 font-medium">Bahan Segar Harian</span>
              </div>
              <div className="border-x border-gray-200">
                <span className="block text-base sm:text-xl font-black text-[#781519]">200+</span>
                <span className="text-[10px] sm:text-xs text-gray-600 font-medium">Porsi Ludes / Hari</span>
              </div>
              <div>
                <span className="block text-base sm:text-xl font-black text-[#781519]">Rp 15k+</span>
                <span className="text-[10px] sm:text-xs text-gray-600 font-medium">Ramah Kantong</span>
              </div>
            </div>
          </div>

          {/* Right Visual: Mas Al-Fariz Portrait & Seal */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-[260px] xs:w-[300px] sm:w-[340px] h-[300px] xs:h-[340px] sm:h-[380px] flex items-center justify-center">
              {/* Yellow Background Circle */}
              <div className="w-[240px] xs:w-[280px] sm:w-[320px] h-[240px] xs:h-[280px] sm:h-[320px] rounded-full bg-[#F5C518] absolute z-0 shadow-lg" />

              {/* Founder Avatar Frame */}
              <div className="relative z-10 w-[220px] xs:w-[260px] sm:w-[300px] h-[220px] xs:h-[260px] sm:h-[300px] rounded-full overflow-hidden border-4 border-white shadow-2xl bg-[#781519] flex items-center justify-center group">
                <img
                  src={tentangImg}
                  alt="Mas Al-Fariz - Founder & Peracik Sambel Ijo Al-Fariz Pamulang"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end items-center text-center p-3 sm:p-5 pb-6 sm:pb-8 text-white">
                  <h4 className="font-extrabold text-base xs:text-lg sm:text-xl text-[#F5C518] leading-tight">
                    Mas Al-Fariz
                  </h4>
                  <p className="text-[10px] sm:text-xs text-amber-100 font-medium mt-0.5">
                    Founder & Peracik Sambel Ijo Al-Fariz
                  </p>
                  <p className="text-[10px] text-white/90 italic mt-1">
                    “Pedasnya jujur, gurihnya nikmat!”
                  </p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-2 right-0 xs:right-2 sm:bottom-0 sm:right-0 z-20 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white p-1 shadow-2xl border-2 border-[#781519] flex items-center justify-center transform rotate-6">
                <div className="w-full h-full rounded-full bg-[#781519] text-center flex flex-col items-center justify-center p-1 text-white">
                  <span className="text-[7px] sm:text-[8px] font-bold text-[#F5C518]">GEPREK</span>
                  <span className="text-[9px] sm:text-[11px] font-serif font-black text-white">AL-FARIZ</span>
                  <span className="text-[6px] sm:text-[7px] text-amber-200">PAMULANG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
