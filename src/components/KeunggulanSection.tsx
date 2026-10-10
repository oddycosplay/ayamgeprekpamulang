import React from 'react';
import { Tag, Sparkles, Clock, ShoppingBag } from 'lucide-react';

export const KeunggulanSection: React.FC = () => {
  return (
    <section className="py-16 lg:py-20 bg-[#FCFAF7] border-t border-gray-200" id="keunggulan">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-[#781519] font-bold text-xs uppercase tracking-widest block">
            Mengapa Kami
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F1F1F] font-serif leading-tight">
            Keunggulan Warung Kami
          </h2>
        </div>

        {/* 4-Card Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Harga Terjangkau */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start gap-4 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1.5">Harga Terjangkau</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Nikmati masakan khas Nusantara dengan harga ramah di kantong mahasiswa.
              </p>
            </div>
          </div>

          {/* Card 2: Hidangan Lezat */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start gap-4 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-[#F5C518]/20 text-[#781519] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1.5">Hidangan Lezat</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Rasa otentik dari resep warisan turun-temurun, kaya rempah menggugah selera.
              </p>
            </div>
          </div>

          {/* Card 3: Fresh Setiap Hari */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start gap-4 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-[#781519]/10 text-[#781519] flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1.5">Fresh Setiap Hari</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Masakan disiapkan setiap pagi, selalu hangat dan segar untuk Anda.
              </p>
            </div>
          </div>

          {/* Card 4: Mudah Dipesan */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start gap-4 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1.5">Mudah Dipesan</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Tersedia di Offline Store serta WhatsApp. Tinggal klik, makanan langsung sampai!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
