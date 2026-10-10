/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { WelcomeBar } from './components/WelcomeBar.tsx';
import { TentangKamiSection } from './components/TentangKamiSection.tsx';
import { CitaRasaBanner } from './components/CitaRasaBanner.tsx';
import { KeunggulanSection } from './components/KeunggulanSection.tsx';
import { PromoTaglineBanner } from './components/PromoTaglineBanner.tsx';
import { MenuSection } from './components/MenuSection.tsx';
import { LayananKamiSection } from './components/LayananKamiSection.tsx';
import { SimulasiPemesanan } from './components/SimulasiPemesanan.tsx';
import { TestimoniSection } from './components/TestimoniSection.tsx';
import { LokasiKontakSection } from './components/LokasiKontakSection.tsx';
import { Footer } from './components/Footer.tsx';

import { AiAdvisorModal } from './components/AiAdvisorModal.tsx';
import { ImageStudioModal } from './components/ImageStudioModal.tsx';
import { LoginModal } from './components/LoginModal.tsx';
import { MenuItem } from './types.ts';
import { MENU_ITEMS } from './data/menuData.ts';

import { Sparkles, Image as ImageIcon } from 'lucide-react';

export default function App() {
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem>(MENU_ITEMS[0]);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [advisorInitialMode, setAdvisorInitialMode] = useState<'advisor' | 'maps' | 'search'>('advisor');
  const [isImageStudioOpen, setIsImageStudioOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // User auth/identity state
  const [userName, setUserName] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('alfariz_user_name');
      if (savedUser) {
        setUserName(savedUser);
        setIsLoggedIn(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleLogin = (name: string) => {
    setUserName(name);
    setIsLoggedIn(true);
    try {
      localStorage.setItem('alfariz_user_name', name);
    } catch (e) {
      // ignore
    }
  };

  const handleLogout = () => {
    setUserName('');
    setIsLoggedIn(false);
    try {
      localStorage.removeItem('alfariz_user_name');
    } catch (e) {
      // ignore
    }
  };

  const handleSelectMenuForOrder = (item: MenuItem) => {
    setSelectedMenuItem(item);
    const element = document.getElementById('simulasi-pemesanan');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenMapsAdvisor = () => {
    setAdvisorInitialMode('maps');
    setIsAdvisorOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col relative selection:bg-[#F5C518] selection:text-[#5e0d10]">
      {/* Primary Sticky Header */}
      <Header
        onLoginClick={() => setIsLoginOpen(true)}
        isLoggedIn={isLoggedIn}
        userName={userName}
      />

      {/* Main Page Flow Matching Reference Exactly */}
      <main className="flex-1">
        {/* 1. Hero Section with Al-Fariz Watermark & Glowing Food Platter */}
        <HeroSection
          onOpenAdvisor={() => {
            setAdvisorInitialMode('advisor');
            setIsAdvisorOpen(true);
          }}
        />

        {/* 2. Welcome Strip */}
        <WelcomeBar />

        {/* 3. Tentang Kami with Mas Al-Fariz Graphic & Seal */}
        <TentangKamiSection />

        {/* 4. Cita Rasa Asli Banner (Yellow Gradient Card) */}
        <CitaRasaBanner />

        {/* 5. Keunggulan Warung Kami (4 Grid Cards) */}
        <KeunggulanSection />

        {/* 6. Tagline Heroic Banner ("Siang-Malam Enaknya Geprek Al-Fariz!") */}
        <PromoTaglineBanner />

        {/* 7. Menu Catalog Juara Sambel Ijo (2 Menu Items) */}
        <MenuSection onSelectMenuForOrder={handleSelectMenuForOrder} />

        {/* 8. Layanan Kami (Our Services) */}
        <LayananKamiSection />

        {/* 9. Simulasi Pemesanan & Direct WhatsApp Order Generator */}
        <SimulasiPemesanan
          selectedMenuItem={selectedMenuItem}
          onMenuItemChange={setSelectedMenuItem}
        />

        {/* 10. Apa Sih Kata Pembeli (Testimonial Slider) */}
        <TestimoniSection />

        {/* 11. Lokasi Strategis Depan UNPAM & Interactive Maps */}
        <LokasiKontakSection />
      </main>

      {/* Site Footer */}
      <Footer />

      {/* Floating Quick Action Drawer (Right-bottom for quick access to AI tools) */}
      <aside aria-label="Aksi Cepat Fitur" className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5 items-end">
        <button
          onClick={() => {
            setAdvisorInitialMode('advisor');
            setIsAdvisorOpen(true);
          }}
          className="bg-[#781519] hover:bg-[#5e0d10] text-[#F5C518] font-bold text-xs py-2 px-3.5 rounded-full shadow-lg border border-[#F5C518]/30 flex items-center gap-2 transform hover:scale-105 transition"
          title="Tanya AI & Navigasi Maps"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Asisten Menu & Maps AI</span>
        </button>

        <button
          onClick={() => setIsImageStudioOpen(true)}
          className="bg-[#F5C518] hover:bg-[#e0b312] text-[#5e0d10] font-black text-xs py-2 px-3.5 rounded-full shadow-lg border border-amber-300 flex items-center gap-2 transform hover:scale-105 transition"
          title="Studio Gambar Makanan AI"
        >
          <ImageIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Studio Gambar (1K/2K/4K)</span>
        </button>
      </aside>

      {/* Modals */}
      <AiAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        initialMode={advisorInitialMode}
      />

      <ImageStudioModal
        isOpen={isImageStudioOpen}
        onClose={() => setIsImageStudioOpen(false)}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </div>
  );
}
