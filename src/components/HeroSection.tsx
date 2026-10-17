import React from 'react';
import { Clock, MapPin, Sparkles, MessageCircle, ArrowDown } from 'lucide-react';
import heroImg from '../produk/geprek-paket-nasi.jpg';

interface HeroSectionProps {
  onOpenAdvisor: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAdvisor }) => {
  return (
    <section className="relative bg-[#781519] text-white overflow-hidden pt-6 pb-14 sm:py-16 lg:py-20" id="hero">
      {/* Watermark Background Typography */}
      <div className="hero-watermark top-12 left-10 select-none opacity-20">Al-Fariz</div>

      {/* Ambient light effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#5e0d10] rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F5C518]/15 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mb-6 text-xs sm:text-sm text-amber-100 font-medium">
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10">
            <Clock className="w-3.5 h-3.5 text-[#F5C518]" />
            <span>Buka Setiap Hari <strong>15.00 - 22.00 WIB</strong></span>
          </div>
          <a
            href="#lokasi"
            className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10 hover:border-[#F5C518] transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-[#F5C518]" />
            <span className="truncate max-w-[240px] xs:max-w-none">Depan Kampus Utama UNPAM Pamulang</span>
          </a>
        </div>

        {/* Hero Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 items-center">
          {/* Left Column: Circular Food Platter Display */}
          <div className="lg:col-span-6 flex justify-center relative order-2 lg:order-1">
            <div className="relative w-[260px] h-[260px] xs:w-[320px] xs:h-[320px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] max-w-[85vw] max-h-[85vw] flex items-center justify-center">
              {/* Radial backdrop glow */}
              <div className="absolute inset-0 glow-radial rounded-full scale-110"></div>

              {/* Circular Cobek Wrapper */}
              <div className="relative w-full h-full rounded-full p-2.5 xs:p-3 sm:p-4 bg-gradient-to-tr from-[#3a080a] via-[#5e0d10] to-[#781519] border-4 border-amber-300/30 shadow-2xl flex items-center justify-center overflow-hidden">
                <img
                  src={heroImg}
                  alt="Ayam Geprek Sambel Ijo Al-Fariz Cobek Batu"
                  width={440}
                  height={440}
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-full object-cover rounded-full shadow-inner transform hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Floating Rating Pill Badge */}
              <div className="absolute bottom-2 left-0 xs:bottom-4 xs:left-2 sm:bottom-8 sm:left-2 bg-[#F5C518] text-[#5e0d10] font-black px-3.5 xs:px-4 py-1.5 xs:py-2 rounded-full shadow-xl flex items-center gap-2 border-2 border-white animate-float z-20">
                <span className="text-[11px] xs:text-xs sm:text-sm">Paket Geprek + Nasi</span>
                <span className="inline-flex items-center text-[10px] xs:text-xs bg-[#781519] text-[#F5C518] px-2 py-0.5 rounded-full font-black">
                  Rp 17.000
                </span>
              </div>

              {/* Decorative chili/kemangi badge */}
              <div className="absolute top-2 right-1 xs:top-4 xs:right-2 sm:top-6 sm:right-4 bg-white/10 backdrop-blur-md p-2.5 xs:p-3 rounded-2xl border border-white/20 shadow-lg hidden xs:block z-20">
                <div className="text-[11px] font-extrabold text-amber-200">🌶️ Cabai Rawit Hijau Asli</div>
                <div className="text-[10px] text-white/90">Diuleg Dadakan Saat Dipesan</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Headline with Curiosity & Seductive Copywriting */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-4 sm:space-y-5 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-[#F5C518] text-[#5e0d10] px-3.5 py-1 rounded-full text-xs font-black tracking-wide shadow-sm">
              <span>🔥 Kuliner Paling Dicari Seberang UNPAM</span>
            </div>

            <h1 className="space-y-1">
              <span className="block text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-white leading-tight tracking-tight">
                Kenapa Mahasiswa UNPAM Rela Antre Tiap Sore Demi Sambel Ijo Ini?
              </span>
            </h1>

            <p className="text-sm xs:text-base text-amber-100/90 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              Ayam krispi panas baru tiris dari wajan, dihantam ulegan cabai rawit hijau segar dadakan di atas cobek batu & disiram minyak bawang aromatik. <strong className="text-[#F5C518]">Pedasnya nendang, gurihnya jujur!</strong> Berani coba Level berapa?
            </p>

            {/* Action Buttons: Direct to Order & Direct to WhatsApp */}
            <div className="pt-2 flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href="#order"
                className="bg-[#F5C518] hover:bg-[#e0b312] text-[#5e0d10] font-black px-6 sm:px-8 py-3.5 rounded-full text-sm sm:text-base shadow-xl transition-all transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2"
              >
                <span>Pilih Menu & Pesan Langsung</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </a>
              <a
                href="https://wa.me/628973816530?text=Halo%20Mas%20Al-Fariz,%20saya%20mau%20pesan%20Ayam%20Geprek%20Sambel%20Ijo"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 sm:px-6 py-3.5 rounded-full text-sm sm:text-base shadow-md transition-all text-center flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat WA Sekarang</span>
              </a>
              <button
                onClick={onOpenAdvisor}
                className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-amber-200 font-semibold px-4 py-3.5 rounded-full text-xs sm:text-sm border border-amber-300/20 backdrop-blur-sm transition-all text-center"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F5C518]" />
                <span>Tanya AI</span>
              </button>
            </div>

            {/* Social Proof Trust Bar */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-amber-100">
              <span className="inline-flex items-center gap-1 bg-black/25 px-3 py-1 rounded-full border border-white/10">
                ⭐ <strong>5.0 Bintang</strong> (200+ Ulasan)
              </span>
              <span className="inline-flex items-center gap-1 bg-black/25 px-3 py-1 rounded-full border border-white/10">
                🍗 <strong>Mulai Rp 15.000</strong> Ramah Kantong
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
