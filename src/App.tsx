/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { OrderDirectSection } from './components/OrderDirectSection.tsx';
import { RahasiaRasaSection } from './components/RahasiaRasaSection.tsx';
import { TestimoniSection } from './components/TestimoniSection.tsx';
import { LokasiKontakSection } from './components/LokasiKontakSection.tsx';
import { Footer } from './components/Footer.tsx';

import { AiAdvisorModal } from './components/AiAdvisorModal.tsx';
import { LoginModal } from './components/LoginModal.tsx';
import { MenuItem } from './types.ts';
import { MENU_ITEMS } from './data/menuData.ts';

import { Sparkles } from 'lucide-react';

export default function App() {
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem>(MENU_ITEMS[0]);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [advisorInitialMode, setAdvisorInitialMode] = useState<'advisor' | 'maps' | 'search'>('advisor');
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

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col relative selection:bg-[#F5C518] selection:text-[#5e0d10]">
      {/* Primary Sticky Header */}
      <Header
        onLoginClick={() => setIsLoginOpen(true)}
        isLoggedIn={isLoggedIn}
        userName={userName}
      />

      {/* Main Page Flow: Simple, Fast, Direct Order Focus */}
      <main className="flex-1">
        {/* 1. Hero Section with Curiosity Headline */}
        <HeroSection
          onOpenAdvisor={() => {
            setAdvisorInitialMode('advisor');
            setIsAdvisorOpen(true);
          }}
        />

        {/* 2. Menu Apa? & Pesan Langsung via WhatsApp (Compact Order Hub) */}
        <OrderDirectSection
          selectedMenuItem={selectedMenuItem}
          onMenuItemChange={setSelectedMenuItem}
        />

        {/* 3. Rahasia Rasa & Kisah Otentik Mas Al-Fariz */}
        <RahasiaRasaSection />

        {/* 4. Apa Sih Kata Pembeli (Ulasan & Testimoni Bintang 5) */}
        <TestimoniSection />

        {/* 5. Lokasi Strategis Depan UNPAM & Peta */}
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
      </aside>

      {/* Modals */}
      <AiAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        initialMode={advisorInitialMode}
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
