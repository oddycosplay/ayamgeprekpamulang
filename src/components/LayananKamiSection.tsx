import React from 'react';
import { ShoppingBag, Utensils, Package, Bike } from 'lucide-react';

export const LayananKamiSection: React.FC = () => {
  return (
    <section className="py-14 lg:py-20 bg-white relative overflow-hidden" id="layanan-kami">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Yellow gradient curved container matching reference */}
        <div className="rounded-3xl bg-gradient-to-b from-[#FFF59D] via-[#FDF8D2] to-[#FAF8F5]/80 p-5 sm:p-10 lg:p-16 border border-amber-200/50 shadow-sm relative overflow-hidden">
          {/* Section Heading */}
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#781519] block mb-1">
              Our Services
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F1F1F] font-serif tracking-tight">
              Layanan Kami
            </h2>
          </div>

          {/* 4 Elevated Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-4xl mx-auto">
            {/* 1. Ambil di Tempat */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-6 text-center flex flex-col items-center justify-between shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-amber-100/60 min-h-[145px] sm:min-h-[160px]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#F5C518]/20 text-[#781519] flex items-center justify-center mb-1.5 sm:mb-2">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-xs sm:text-base font-bold text-gray-900 mb-0.5">Ambil di Tempat</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 leading-snug">
                  Pick-up langsung di gerobak depan UNPAM
                </p>
              </div>
            </div>

            {/* 2. Makan di Tempat */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-6 text-center flex flex-col items-center justify-between shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-amber-100/60 min-h-[145px] sm:min-h-[160px]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#F5C518]/20 text-[#781519] flex items-center justify-center mb-1.5 sm:mb-2">
                <Utensils className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-xs sm:text-base font-bold text-gray-900 mb-0.5">Makan di Tempat</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 leading-snug">
                  Dine in santai dan nikmat hangat di tempat
                </p>
              </div>
            </div>

            {/* 3. Bungkus */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-6 text-center flex flex-col items-center justify-between shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-amber-100/60 min-h-[145px] sm:min-h-[160px]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#F5C518]/20 text-[#781519] flex items-center justify-center mb-1.5 sm:mb-2">
                <Package className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-xs sm:text-base font-bold text-gray-900 mb-0.5">Bungkus</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 leading-snug">
                  Take away cepat, higienis & kemasan rapi
                </p>
              </div>
            </div>

            {/* 4. Delivery Order */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-6 text-center flex flex-col items-center justify-between shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-amber-100/60 min-h-[145px] sm:min-h-[160px]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#F5C518]/20 text-[#781519] flex items-center justify-center mb-1.5 sm:mb-2">
                <Bike className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-xs sm:text-base font-bold text-gray-900 mb-0.5">Delivery Order</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 leading-snug">
                  Pesan via WhatsApp & kurir cepat
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
