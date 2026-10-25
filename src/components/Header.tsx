import React, { useState } from 'react';
import { LogIn, MessageCircle, User } from 'lucide-react';

interface HeaderProps {
  onLoginClick: () => void;
  isLoggedIn?: boolean;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onLoginClick,
  isLoggedIn = false,
  userName = ''
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

        {/* Logo Branding */}
        <a href="#hero" className="flex items-center gap-2 xs:gap-3 group flex-shrink-0">
          <div className="w-10 h-10 xs:w-12 xs:h-12 rounded-full border-2 border-[#F5C518] p-0.5 bg-[#781519] flex items-center justify-center shadow-md overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6 xs:w-7 xs:h-7 text-[#F5C518]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-bold tracking-wider text-[#781519] uppercase leading-tight truncate">
              Sambel Ijo Uleg Dadakan
            </span>
            <span className="text-lg xs:text-xl sm:text-2xl font-extrabold text-[#781519] font-serif leading-none tracking-tight truncate">
              Al-Fariz <span className="text-[#F5C518]">UNPAM</span>
            </span>
          </div>
        </a>

        {/* ===== DESKTOP NAVIGATION ===== */}
        <nav
          aria-label="Navigasi Utama"
          className="hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-8 text-sm font-semibold text-gray-700"
        >
          <a className="text-[#781519] font-bold hover:opacity-70 transition-opacity" href="#hero">Home</a>
          <a className="hover:text-[#781519] transition-colors" href="#order">Menu & Pesan WA</a>
          <a className="hover:text-[#781519] transition-colors" href="#rahasia">Rahasia Rasa</a>
          <a className="hover:text-[#781519] transition-colors" href="#testimoni">Ulasan Pelanggan</a>
          <a className="hover:text-[#781519] transition-colors" href="#lokasi">Lokasi UNPAM</a>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 flex-shrink-0">

          {/* Order CTA */}
          <a
            className="inline-flex items-center gap-1.5 xs:gap-2 bg-[#F5C518] hover:bg-[#e0b312] text-[#5e0d10] px-3.5 xs:px-4 sm:px-5 py-2 xs:py-2.5 rounded-full font-black text-xs sm:text-sm shadow-sm transition-all transform hover:scale-105"
            href="https://wa.me/628973816530?text=Halo%20Mas%20Al-Fariz,%20saya%20mau%20pesan%20Ayam%20Penyet%20Sambel%20Ijo"
            rel="noopener noreferrer"
            target="_blank"
          >
            <MessageCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 fill-current" />
            <span>Pesan via WA</span>
          </a>

          {/* Owner Login Button */}
          <button
            onClick={onLoginClick}
            className="p-2 xs:p-2.5 rounded-full transition-all flex items-center gap-1.5 text-gray-600 hover:text-[#781519] hover:bg-gray-100"
            title="Login Owner (CRM)"
            aria-label="Login Owner"
          >
            <LogIn className="w-4 h-4 xs:w-5 xs:h-5" />
          </button>

          {/* ===== HAMBURGER — hanya mobile & tablet ===== */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-[#781519] rounded-xl hover:bg-gray-100 min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ===== MOBILE & TABLET DRAWER ===== */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-5 space-y-1 animate-in fade-in duration-200">
          <a onClick={() => setMobileMenuOpen(false)} href="#hero"
            className="block py-2.5 px-3 rounded-xl text-sm font-bold text-[#781519] hover:bg-amber-50 transition">
            Home
          </a>
          <a onClick={() => setMobileMenuOpen(false)} href="#order"
            className="block py-2.5 px-3 rounded-xl text-sm font-bold text-[#781519] bg-amber-50 hover:bg-amber-100 transition">
            Menu & Pesan Langsung (WA)
          </a>
          <a onClick={() => setMobileMenuOpen(false)} href="#rahasia"
            className="block py-2.5 px-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
            Rahasia Rasa
          </a>
          <a onClick={() => setMobileMenuOpen(false)} href="#testimoni"
            className="block py-2.5 px-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
            Ulasan Pelanggan
          </a>
          <a onClick={() => setMobileMenuOpen(false)} href="#lokasi"
            className="block py-2.5 px-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
            Lokasi & Kontak UNPAM
          </a>
          <div className="pt-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs border border-gray-200 transition"
            >
              <LogIn className="w-4 h-4 text-[#781519]" />
              <span>Login Owner</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
