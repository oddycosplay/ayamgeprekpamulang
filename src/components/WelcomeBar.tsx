import React from 'react';
import { Check } from 'lucide-react';

export const WelcomeBar: React.FC = () => {
  return (
    <section className="bg-[#F3EFEA] border-b border-gray-200 py-3 sm:py-4 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
        <span className="text-gray-800 font-extrabold text-base sm:text-xl font-serif">
          Selamat Datang,
        </span>
        <div className="flex flex-wrap sm:inline-flex items-center justify-center p-1 sm:p-1.5 bg-white rounded-2xl sm:rounded-full border border-gray-200 shadow-sm max-w-full">
          <span className="px-3 sm:px-5 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-gray-700">
            Ayam Geprek Sambel Ijo Al-Fariz
          </span>
          <a
            href="#menu"
            className="bg-[#F5C518] text-[#5e0d10] px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl sm:rounded-full text-xs sm:text-sm font-bold flex items-center gap-1 shadow-sm hover:bg-[#e0b312] transition"
          >
            <Check className="w-3.5 h-3.5" />
            Menu Unggulan
          </a>
        </div>
      </div>
    </section>
  );
};
