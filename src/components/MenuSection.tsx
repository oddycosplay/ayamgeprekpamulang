import React from 'react';
import { ArrowDown, Flame } from 'lucide-react';
import { MenuItem } from '../types.ts';
import { useLiveMenu } from '../lib/crmApi.ts';

interface MenuSectionProps {
  onSelectMenuForOrder: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onSelectMenuForOrder }) => {
  const liveItems = useLiveMenu().items;
  return (
    <section className="py-20 bg-[#FBF8F3] border-t border-gray-200" id="menu">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#781519] font-bold text-xs uppercase tracking-widest block mb-1">
            Daftar Menu Favorit
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-serif">
            Pilihan Menu Juara Sambel Ijo
          </h2>
          <p className="text-gray-600 mt-3 text-sm sm:text-base">
            Pilih menu di bawah ini untuk langsung menuju <strong>Order Sekarang & Pesan Langsung</strong>. Atur level kepedasan 1 - 5 dan porsi sesukamu!
          </p>
        </div>

        {/* Menu Grid - Exactly 2 Cards with Scroll-to-Order Hover Effect */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {liveItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectMenuForOrder(item)}
              className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-2xl transition-all duration-300 border-2 border-amber-100 hover:border-[#F5C518] flex flex-col justify-between group cursor-pointer relative hover:-translate-y-1.5"
            >
              <div>
                {/* Image Container with Hover Overlay & Zoom */}
                <div className="relative rounded-2xl overflow-hidden aspect-video mb-4 bg-gray-100">
                  <img
                    src={item.image}
                    alt={`${item.name} - Menu Kuliner Ayam Penyet Sambel Ijo Al-Fariz Pamulang`}
                    width={400}
                    height={225}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.badge && (
                    <span className={`absolute top-3 left-3 text-xs font-black px-3 py-1 rounded-full shadow-md z-10 ${
                      item.badge === 'BEST SELLER'
                        ? 'bg-[#F5C518] text-[#5e0d10]'
                        : 'bg-[#781519] text-[#F5C518]'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {/* Hover "Scroll to Order" Overlay Badge */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                    <span className="bg-[#F5C518] text-[#5e0d10] text-[11px] xs:text-xs font-black px-3 xs:px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span>Racik Porsi & Pesan Sekarang</span>
                      <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="font-extrabold text-base sm:text-xl text-gray-900 group-hover:text-[#781519] transition-colors">
                    {item.name}
                  </h3>
                  <span className="text-[11px] sm:text-xs font-bold text-[#2D864E] bg-emerald-50 px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <span>Level 1 - 5</span>
                    <Flame className="w-3 h-3 text-red-500 inline fill-current" />
                  </span>
                </div>

                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              {/* Card Footer: Price & Prominent Scroll-to-Order CTA Button */}
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 block leading-tight">Harga Porsi</span>
                    <span className="text-xl sm:text-2xl font-black text-[#781519]">
                      Rp {item.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#781519] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:inline-flex items-center gap-1">
                    <span>Siap Diuleg</span>
                    <ArrowDown className="w-3.5 h-3.5 text-[#781519] animate-bounce" />
                  </span>
                </div>

                {/* Primary Interactive Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectMenuForOrder(item);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 px-3 sm:px-4 rounded-2xl bg-[#781519] group-hover:bg-[#F5C518] text-white group-hover:text-[#5e0d10] font-black text-xs sm:text-sm shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-[1.01]"
                  title="Pilih dan gulir ke Order Sekarang / Pesan Langsung"
                >
                  <span>Pilih Menu Ini & Kustomisasi Pesanan</span>
                  <ArrowDown className="w-3.5 sm:w-4 h-3.5 sm:h-4 transition-transform duration-300 group-hover:translate-y-1 animate-pulse" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Global Scroll-to-Order Visual Indicator Pill */}
        <div className="mt-8 flex justify-center px-2">
          <a
            href="#simulasi-pemesanan"
            className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-2xl sm:rounded-full bg-white hover:bg-amber-50 text-[#781519] border-2 border-dashed border-[#781519]/30 hover:border-[#781519] font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all group text-center max-w-full"
          >
            <span>Klik menu di atas atau gulir ke bawah untuk langsung mengatur porsi & sambal</span>
            <ArrowDown className="w-4 h-4 text-[#781519] group-hover:translate-y-1 transition-transform animate-bounce flex-shrink-0" />
          </a>
        </div>

        {/* 3 Keunggulan Cards from reference */}
        <div className="py-12 border-t border-amber-100/60 my-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white border border-amber-100 shadow-sm hover:shadow-md transition text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#781519]/10 text-[#781519] flex items-center justify-center font-bold text-xl">
                1
              </div>
              <h3 className="font-bold text-lg text-gray-900">Cabai Rawit Segar Pilihan</h3>
              <p className="text-gray-600 text-sm">
                Bukan sambal botolan atau pasta olahan. Cabai hijau segar langsung diuleg dadakan dengan takaran pas di atas cobek batu.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-amber-100 shadow-sm hover:shadow-md transition text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F5C518]/30 text-[#5e0d10] flex items-center justify-center font-bold text-xl">
                2
              </div>
              <h3 className="font-bold text-lg text-gray-900">Ayam Krispi Gurih Meresap</h3>
              <p className="text-gray-600 text-sm">
                Marinasi bumbu rempah kuning rahasia Nusantara meresap hingga serat terdalam dengan baluran tepung renyah berjam-jam.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-amber-100 shadow-sm hover:shadow-md transition text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
                3
              </div>
              <h3 className="font-bold text-lg text-gray-900">Harga Sahabat Mahasiswa</h3>
              <p className="text-gray-600 text-sm">
                Porsi kenyang, nasi hangat melimpah, dan harga sangat terjangkau cocok untuk rutinitas makan siang dan malam di Pamulang.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
