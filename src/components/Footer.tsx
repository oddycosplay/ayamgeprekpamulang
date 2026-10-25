import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#5e0d10] text-amber-100/80 pt-16 pb-12 border-t border-[#781519]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F5C518] text-[#5e0d10] flex items-center justify-center font-black text-xl">
                A
              </div>
              <span className="text-2xl font-serif font-black text-white">Al-Fariz</span>
            </div>
            <p className="text-xs leading-relaxed text-amber-200/70">
              Ayam Penyet Sambel Ijo Al-Fariz adalah kuliner gerobak otentik sambel ijo uleg dadakan dengan racikan khas Nusantara di depan kampus UNPAM Pamulang Barat.
            </p>
          </div>

          {/* Links Navigation */}
          <div>
            <p className="text-sm font-bold text-white uppercase tracking-wider mb-4">Navigasi</p>
            <ul className="space-y-2 text-xs">
              <li><a className="hover:text-[#F5C518] transition-colors" href="#hero">Home</a></li>
              <li><a className="hover:text-[#F5C518] transition-colors" href="#tentang-kami">Tentang Kami</a></li>
              <li><a className="hover:text-[#F5C518] transition-colors" href="#menu">Daftar Menu & Harga</a></li>
              <li><a className="hover:text-[#F5C518] transition-colors" href="#keunggulan">Keunggulan Rasa</a></li>
              <li><a className="hover:text-[#F5C518] transition-colors" href="#simulasi-pemesanan">Order Sekarang / Pesan Langsung</a></li>
              <li><a className="hover:text-[#F5C518] transition-colors" href="#lokasi">Lokasi Depan UNPAM</a></li>
            </ul>
          </div>

          {/* Menu Pilihan */}
          <div>
            <p className="text-sm font-bold text-white uppercase tracking-wider mb-4">Menu Pilihan</p>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between py-0.5 border-b border-white/5">
                <span className="text-amber-100/90 hover:text-[#F5C518] transition-colors cursor-default">
                  Paket Penyet + Nasi
                </span>
                <span className="font-bold text-[#F5C518] text-[11px]">Rp 17.000</span>
              </li>
              <li className="flex items-center justify-between py-0.5 border-b border-white/5">
                <span className="text-amber-100/90 hover:text-[#F5C518] transition-colors cursor-default">
                  Ayam Penyet Saja
                </span>
                <span className="font-bold text-[#F5C518] text-[11px]">Rp 15.000</span>
              </li>
            </ul>
          </div>

          {/* Jam Buka & Order */}
          <div>
            <p className="text-sm font-bold text-white uppercase tracking-wider mb-4">Jam Operasional</p>
            <div className="text-xs space-y-2">
              <p>
                <strong className="text-[#F5C518]">Senin - Minggu:</strong><br />
                15:00 - 22:00 WIB
              </p>
              <p className="pt-2">
                <strong className="text-[#F5C518]">WhatsApp Pemesanan:</strong><br />
                0897-3816-530
              </p>
            </div>
          </div>
        </div>

        {/* Copyright Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-200/60 gap-4">
          <p>
            created design by @oddycosplay © 2027 Ayam Penyet Sambel Ijo Al-Fariz UNPAM. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <p className="flex items-center gap-2">
            <span>Dibuat dengan rasa otentik untuk pecinta pedas Pamulang</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
